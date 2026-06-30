import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateDeviceDto } from 'src/device/dto/create-device.dto';
import { UpdateDeviceDto } from 'src/device/dto/update-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async registerDevice(userId: string, createDeviceDto: CreateDeviceDto) {
    const { name, device_id, token, battery_level, app_version } =
      createDeviceDto;

    const existing = await this.databaseService.query(
      `SELECT id FROM device WHERE device_id = $1 AND id_user = $2`,
      [device_id, userId],
    );

    if (existing.rows.length > 0) {
      throw new HttpException('Device already registered', HttpStatus.CONFLICT);
    }

    const query = `
      INSERT INTO device (id_user, name, device_id, token, status, battery_level, app_version, last_sync_at)
      VALUES ($1, $2, $3, $4, 'offline', $5, $6, now())
      RETURNING id, name, device_id, status, battery_level, app_version, last_sync_at, created_at
    `;

    const result = await this.databaseService.query(query, [
      userId,
      name,
      device_id,
      token,
      battery_level || null,
      app_version || null,
    ]);

    return result.rows[0];
  }

  async updateDeviceStatus(
    userId: string,
    deviceId: string,
    updateDeviceDto: UpdateDeviceDto,
  ) {
    const { name, token, status, battery_level, app_version } = updateDeviceDto;

    const device = await this.databaseService.query(
      `SELECT id FROM device WHERE id = $1 AND id_user = $2`,
      [deviceId, userId],
    );

    if (device.rows.length === 0) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (token !== undefined) {
      updates.push(`token = $${paramIndex++}`);
      values.push(token);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (battery_level !== undefined) {
      updates.push(`battery_level = $${paramIndex++}`);
      values.push(battery_level);
    }
    if (app_version !== undefined) {
      updates.push(`app_version = $${paramIndex++}`);
      values.push(app_version);
    }

    updates.push(`last_sync_at = now()`);

    values.push(deviceId, userId);
    const query = `
      UPDATE device
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex} AND id_user = $${paramIndex + 1}
      RETURNING id, name, device_id, status, battery_level, app_version, last_sync_at
    `;

    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async getUserDevices(userId: string) {
    const query = `
      SELECT 
        d.id,
        d.name,
        d.device_id,
        d.status,
        d.battery_level,
        d.app_version,
        d.last_sync_at,
        d.created_at,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', s.id,
            'operator', s.operator,
            'phone_number', s.phone_number,
            'slot_index', s.slot_index,
            'is_active', s.is_active
          )
        ) AS sim_cards
      FROM device d
      LEFT JOIN sim_card s ON d.id = s.id_device
      WHERE d.id_user = $1
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rows;
  }

  async getDeviceById(userId: string, deviceId: string) {
    const query = `
      SELECT 
        d.id,
        d.name,
        d.device_id,
        d.status,
        d.battery_level,
        d.app_version,
        d.last_sync_at,
        d.created_at,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', s.id,
            'operator', s.operator,
            'phone_number', s.phone_number,
            'slot_index', s.slot_index,
            'is_active', s.is_active
          )
        ) AS sim_cards
      FROM device d
      LEFT JOIN sim_card s ON d.id = s.id_device
      WHERE d.id = $1 AND d.id_user = $2
      GROUP BY d.id
    `;

    const result = await this.databaseService.query(query, [deviceId, userId]);

    if (result.rows.length === 0) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }

    return result.rows[0];
  }

  async deleteDevice(userId: string, deviceId: string) {
    const query = `
      DELETE FROM device
      WHERE id = $1 AND id_user = $2
      RETURNING id
    `;

    const result = await this.databaseService.query(query, [deviceId, userId]);

    if (result.rows.length === 0) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }

    return { success: true, message: 'Device deleted successfully' };
  }

  async syncSimCards(userId: string, deviceId: string, simCards: any[]) {
    const device = await this.databaseService.query(
      `SELECT id FROM device WHERE id = $1 AND id_user = $2`,
      [deviceId, userId],
    );

    if (device.rows.length === 0) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }

    await this.databaseService.query(
      `DELETE FROM sim_card WHERE id_device = $1`,
      [deviceId],
    );

    for (const sim of simCards) {
      await this.databaseService.query(
        `
        INSERT INTO sim_card (id_device, operator, phone_number, slot_index, is_active)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          deviceId,
          sim.operator,
          sim.phone_number,
          sim.slot_index,
          sim.is_active !== false,
        ],
      );
    }

    await this.databaseService.query(
      `UPDATE device SET last_sync_at = now() WHERE id = $1`,
      [deviceId],
    );

    return { success: true, message: 'SIM cards synced successfully' };
  }
}
