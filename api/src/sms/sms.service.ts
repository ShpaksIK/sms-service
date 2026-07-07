import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { SendSmsDto } from './dto/send-sms.dto';
import { UpdateSmsStatusDto } from './dto/update-sms-status.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SmsService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async sendSms(userId: string, sendSmsDto: SendSmsDto) {
    const { deviceId, simSlot, phoneNumber, text, scheduledAt } = sendSmsDto;

    const device = await this.databaseService.query(
      `SELECT id, status FROM device WHERE id = $1 AND id_user = $2`,
      [deviceId, userId],
    );

    if (device.rows.length === 0) {
      throw new HttpException('Устройство не найдено', HttpStatus.NOT_FOUND);
    }

    if (device.rows[0].status === 'offline') {
      throw new HttpException('Устройство офлайн', HttpStatus.BAD_REQUEST);
    }

    const simCard = await this.databaseService.query(
      `SELECT id FROM sim_card WHERE id_device = $1 AND slot_index = $2 AND is_active = true`,
      [deviceId, simSlot],
    );

    if (simCard.rows.length === 0) {
      throw new HttpException(
        'Активная SIM-карта для этого слота не найдена',
        HttpStatus.BAD_REQUEST,
      );
    }

    const status = scheduledAt ? 'pending' : 'queued';
    const externalId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    const query = `
      INSERT INTO sms_message 
      (id_user, id_device, sim_slot, type, phone_number, text, status, external_id, scheduled_at, created_at)
      VALUES ($1, $2, $3, 'outgoing', $4, $5, $6, $7, $8, now())
      RETURNING id, status, external_id, created_at
    `;

    const result = await this.databaseService.query(query, [
      userId,
      deviceId,
      simSlot,
      phoneNumber,
      text,
      status,
      externalId,
      scheduledAt || null,
    ]);

    return {
      id: result.rows[0].id,
      status: result.rows[0].status,
      external_id: result.rows[0].external_id,
      created_at: result.rows[0].created_at,
    };
  }

  async getUserSms(
    userId: string,
    limit: number = 50,
    offset: number = 0,
    type?: 'incoming' | 'outgoing',
    status?: string,
  ) {
    let query = `
      SELECT 
        m.id,
        m.type,
        m.phone_number,
        m.text,
        m.status,
        m.external_id,
        m.error_message,
        m.scheduled_at,
        m.created_at,
        d.name as device_name,
        m.sim_slot
      FROM sms_message m
      LEFT JOIN device d ON m.id_device = d.id
      WHERE m.id_user = $1
    `;

    const values: any[] = [userId];
    let paramIndex = 2;

    if (type) {
      query += ` AND m.type = $${paramIndex++}`;
      values.push(type);
    }

    if (status) {
      query += ` AND m.status = $${paramIndex++}`;
      values.push(status);
    }

    query += ` ORDER BY m.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    values.push(limit, offset);

    const result = await this.databaseService.query(query, values);
    return result.rows;
  }

  async getSmsById(userId: string, messageId: string) {
    const query = `
      SELECT 
        m.id,
        m.type,
        m.phone_number,
        m.text,
        m.status,
        m.external_id,
        m.error_message,
        m.scheduled_at,
        m.created_at,
        d.name as device_name,
        d.id as device_id,
        m.sim_slot
      FROM sms_message m
      LEFT JOIN device d ON m.id_device = d.id
      WHERE m.id = $1 AND m.id_user = $2
    `;

    const result = await this.databaseService.query(query, [messageId, userId]);

    if (result.rows.length === 0) {
      throw new HttpException('Сообщение не найдено', HttpStatus.NOT_FOUND);
    }

    return result.rows[0];
  }

  async updateSmsStatus(
    userId: string,
    messageId: string,
    updateSmsStatusDto: UpdateSmsStatusDto,
  ) {
    const { status, external_id, error_message } = updateSmsStatusDto;

    const message = await this.databaseService.query(
      `SELECT id FROM sms_message WHERE id = $1 AND id_user = $2`,
      [messageId, userId],
    );

    if (message.rows.length === 0) {
      throw new HttpException('Сообщение не найдено', HttpStatus.NOT_FOUND);
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    updates.push(`status = $${paramIndex++}`);
    values.push(status);

    if (external_id !== undefined) {
      updates.push(`external_id = $${paramIndex++}`);
      values.push(external_id);
    }

    if (error_message !== undefined) {
      updates.push(`error_message = $${paramIndex++}`);
      values.push(error_message);
    }

    // webhook trigger
    // ...

    values.push(messageId, userId);
    const query = `
      UPDATE sms_message
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex} AND id_user = $${paramIndex + 1}
      RETURNING id, status, external_id
    `;

    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async receiveIncomingSms(
    userId: string,
    deviceId: string,
    simSlot: number,
    phoneNumber: string,
    text: string,
  ) {
    const externalId = `incoming_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    const query = `
      INSERT INTO sms_message 
      (id_user, id_device, sim_slot, type, phone_number, text, status, external_id, created_at)
      VALUES ($1, $2, $3, 'incoming', $4, $5, 'received', $6, now())
      RETURNING id, type, phone_number, text, status, created_at
    `;

    const result = await this.databaseService.query(query, [
      userId,
      deviceId,
      simSlot,
      phoneNumber,
      text,
      externalId,
    ]);

    return result.rows[0];
  }

  async getSmsStats(userId: string) {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN type = 'incoming' THEN 1 END) as incoming,
        COUNT(CASE WHEN type = 'outgoing' THEN 1 END) as outgoing,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        MAX(created_at) as last_message_at
      FROM sms_message
      WHERE id_user = $1
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rows[0];
  }
}
