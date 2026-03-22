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
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE message_type AS ENUM ('incoming', 'outgoing');

CREATE TABLE "user" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	email VARCHAR(255) UNIQUE NOT NULL,
	-- phone_number VARCHAR(15) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	first_name VARCHAR(100),
	fcm_token VARCHAR(255),
	created_at TIMESTAMP DEFAULT now(),
	updated_at TIMESTAMP
);

CREATE TABLE "conversation" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_user UUID REFERENCES "user"(id) ON DELETE CASCADE,
	contact_number VARCHAR(15) NOT NULL,
	is_archived BOOLEAN NOT NULL DEFAULT false,
	created_at TIMESTAMP DEFAULT now(),
	updated_at TIMESTAMP
);

CREATE TABLE "message" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_conversation UUID REFERENCES "conversation"(id) ON DELETE CASCADE,
	text TEXT NOT NULL,
	type message_type NOT NULL,
	created_at TIMESTAMP DEFAULT now() 
);

CREATE TABLE "session" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_user UUID REFERENCES "user"(id) ON DELETE CASCADE,
	refresh_token VARCHAR(500) NOT NULL,
	user_agent TEXT,
	ip_address VARCHAR(45),
	expires_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP DEFAULT now()
);`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
DROP TABLE "message";
DROP TABLE "conversation";
DROP TABLE "session";
DROP TABLE "user";
DROP TYPE message_type;
`);
};
