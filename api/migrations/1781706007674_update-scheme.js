/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(`
DROP TABLE "message";
DROP TABLE "conversation";
DROP TABLE "session";
DROP TABLE "user";

CREATE TYPE device_status AS ENUM ('online', 'offline');
CREATE TYPE message_status AS ENUM ('pending', 'queued', 'sent', 'delivered', 'failed', 'received');
CREATE TYPE webhook_event_type AS ENUM ('sms.received', 'sms.delivered');

CREATE TABLE "user" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	first_name VARCHAR(100),
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP
);

CREATE TABLE "device" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_user UUID REFERENCES "user"(id) ON DELETE CASCADE,
	name VARCHAR(255) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    status device_status NOT NULL,
    battery_level INTEGER,
    app_version VARCHAR(32),
    last_sync_at TIMESTAMP NOT NULL DEFAULT now(),
	created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "sim_card" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_device UUID REFERENCES "device"(id) ON DELETE CASCADE,
	operator VARCHAR(255) NOT NULL,
    phone_number VARCHAR(32) NOT NULL,
    slot_index INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE "sms_message" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_user UUID REFERENCES "user"(id) ON DELETE CASCADE,
    id_device UUID REFERENCES "device"(id) ON DELETE CASCADE,
    sim_slot INTEGER NOT NULL,
    type message_type NOT NULL,
    phone_number VARCHAR(32) NOT NULL,
	text TEXT NOT NULL,
    status message_status NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    error_message VARCHAR(255),
    scheduled_at TIMESTAMP,
	created_at TIMESTAMP NOT NULL DEFAULT now() 
);

CREATE TABLE "api_key" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_user UUID REFERENCES "user"(id) ON DELETE CASCADE,
	key VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    last_used_at TIMESTAMP,
	created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "webhook" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_user UUID REFERENCES "user"(id) ON DELETE CASCADE,
	url VARCHAR(255) NOT NULL,
    secret VARCHAR(255) NOT NULL,
    event_type TIMESTAMP
);

CREATE TABLE "session" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_user UUID REFERENCES "user"(id) ON DELETE CASCADE,
	refresh_token VARCHAR(500) NOT NULL,
	user_agent TEXT,
	ip_address VARCHAR(45),
	expires_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_device_token ON "device"(token);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON "device"(id_user);
CREATE INDEX IF NOT EXISTS idx_sms_message_device_id ON "sms_message"(id_device);
CREATE INDEX IF NOT EXISTS idx_sms_message_status ON "sms_message"(status);
CREATE INDEX IF NOT EXISTS idx_sms_message_user_id ON "sms_message"(id_user);
CREATE INDEX IF NOT EXISTS idx_sms_message_created_at ON "sms_message"(created_at DESC);
`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
	pgm.sql(`
DROP TABLE "webhook";
DROP TABLE "api_key";
DROP TABLE "sms_message";
DROP TABLE "sim_card";
DROP TABLE "device";
DROP TABLE "session";
DROP TABLE "user";

DROP TYPE device_status;
DROP TYPE message_status;
DROP TYPE webhook_event_type;
`);
};
