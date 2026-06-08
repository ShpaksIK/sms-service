import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private pool: Pool;
  private client: PoolClient | null = null;

  constructor(private readonly options) {
    this.pool = new Pool({
      host: options.config.host,
      port: options.config.port,
      database: options.config.database,
      user: options.config.user,
      password: options.config.password,
      ssl: options.config.ssl,
      max: options.config.max,
      idleTimeoutMillis: options.config.idleTimeoutMillis,
      connectionTimeoutMillis: options.config.connectionTimeoutMillis,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  async query(text: string, params?: any[]) {
    const client = await this.pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  }

  async transaction(callback: (client: PoolClient) => Promise<any>) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getClient(): Promise<PoolClient> {
    if (!this.client) {
      this.client = await this.pool.connect();
    }
    return this.client;
  }

  async release() {
    if (this.client) {
      this.client.release();
      this.client = null;
    }
  }

  async close() {
    await this.pool.end();
  }

  async onModuleDestroy() {
    await this.close();
  }

  getPool() {
    return this.pool;
  }

  async saveOutgoingMessage(
    userId: string,
    phoneNumber: string,
    message: string,
    externalId?: string,
    status: string = 'sent',
  ): Promise<any> {
    const query = `
    INSERT INTO "message" (id_conversation, text, type, created_at)
    VALUES ($1, $2, 'outgoing', now())
    RETURNING id
  `;

    const conversationQuery = `
    SELECT id FROM "conversation" 
    WHERE id_user = $1 AND contact_number = $2
    LIMIT 1
  `;

    let conversation = await this.query(conversationQuery, [
      userId,
      phoneNumber,
    ]);

    let conversationId;
    if (conversation.rows.length === 0) {
      const newConversation = await this.query(
        `INSERT INTO "conversation" (id_user, contact_number) VALUES ($1, $2) RETURNING id`,
        [userId, phoneNumber],
      );
      conversationId = newConversation.rows[0].id;
    } else {
      conversationId = conversation.rows[0].id;
    }

    const result = await this.query(query, [conversationId, message]);
    return { id: result.rows[0].id };
  }
}
