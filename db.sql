/*
####################################################################
###                                                             ####
### Author: Junior RT                                           ####
### License: Get Arrays LLC (https://getarrays.io)              ####
### Date: January 29th, 2025                                    ####
### Version: 1.0                                                ####
###                                                             ####
####################################################################


 * --- General Rules ---
 * Use underscore_names instead of CamelCase
 * Table names should be plural
 * Spell out id fields (item_id instead of id)
 * Don't use ambiguous column names
 * Name foreign key columns the same as the columns they refer to
 * Use caps for all SQL keywords
 */

BEGIN;

-- Authrozation Server

CREATE TABLE IF NOT EXISTS oauth2_registered_client (
                                                        id VARCHAR(100) PRIMARY KEY,
    client_id VARCHAR(100) NOT NULL,
    client_id_issued_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                         client_secret VARCHAR(200) DEFAULT NULL,
    client_secret_expires_at TIMESTAMP(6) WITH TIME ZONE DEFAULT NULL,
                                         client_name VARCHAR(200) NOT NULL,
    client_authentication_methods VARCHAR(1000) NOT NULL,
    authorization_grant_types VARCHAR(1000) NOT NULL,
    redirect_uris VARCHAR(1000) DEFAULT NULL,
    post_logout_redirect_uris VARCHAR(1000) DEFAULT NULL,
    scopes VARCHAR(1000) NOT NULL,
    client_settings VARCHAR(2000) NOT NULL,
    token_settings VARCHAR(2000) NOT NULL
    );

-- User Service

CREATE TABLE IF NOT EXISTS users (
                                     user_id BIGSERIAL PRIMARY KEY,
                                     user_uuid VARCHAR(40) NOT NULL,
    username VARCHAR(25) NOT NULL,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    email VARCHAR(40) NOT NULL,
    member_id VARCHAR(40) NOT NULL,
    phone VARCHAR(15) DEFAULT NULL,
    address VARCHAR(100) DEFAULT NULL,
    bio VARCHAR(100) DEFAULT NULL,
    qr_code_secret VARCHAR(50) DEFAULT NULL,
    qr_code_image_uri TEXT DEFAULT NULL,
    image_url VARCHAR(255) DEFAULT 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    last_login TIMESTAMP(6) WITH TIME ZONE DEFAULT NULL,
                                login_attempts INTEGER DEFAULT 0,
                                mfa BOOLEAN NOT NULL DEFAULT FALSE,
                                enabled BOOLEAN NOT NULL DEFAULT FALSE,
                                account_non_expired BOOLEAN NOT NULL DEFAULT FALSE,
                                account_non_locked BOOLEAN NOT NULL DEFAULT FALSE,
                                created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_user_uuid UNIQUE (user_uuid),
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_member_id UNIQUE (member_id)
    );

CREATE TABLE IF NOT EXISTS roles (
                                     role_id BIGSERIAL PRIMARY KEY,
                                     role_uuid VARCHAR(40) NOT NULL,
    name VARCHAR(25) NOT NULL,
    authority TEXT NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT uq_roles_name UNIQUE (name),
    CONSTRAINT uq_roles_role_uuid UNIQUE (role_uuid)
    );

CREATE TABLE IF NOT EXISTS user_roles (
                                          user_role_id BIGSERIAL PRIMARY KEY,
                                          user_id BIGINT NOT NULL,
                                          role_id BIGINT NOT NULL,
                                          CONSTRAINT fk_user_roles_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_user_roles_role_id FOREIGN KEY (role_id) REFERENCES roles (role_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS credentials (
                                           credential_id BIGSERIAL PRIMARY KEY,
                                           credential_uuid VARCHAR(40) NOT NULL,
    user_id BIGINT NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT uq_credentials_credential_uuid UNIQUE (credential_uuid),
    CONSTRAINT uq_credentials_user_id UNIQUE (user_id),
    CONSTRAINT fk_credentials_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS account_tokens (
                                              account_token_id BIGSERIAL PRIMARY KEY,
                                              token VARCHAR(40) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT uq_account_tokens_token UNIQUE (token),
    CONSTRAINT uq_account_tokens_user_id UNIQUE (user_id),
    CONSTRAINT fk_account_tokens_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS password_tokens (
                                               password_token_id BIGSERIAL PRIMARY KEY,
                                               token VARCHAR(40) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT uq_password_tokens_token UNIQUE (token),
    CONSTRAINT uq_password_tokens_user_id UNIQUE (user_id),
    CONSTRAINT fk_password_tokens_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS devices (
                                       device_id BIGSERIAL PRIMARY KEY,
                                       user_id BIGINT NOT NULL,
                                       device VARCHAR(40) NOT NULL,
    client VARCHAR(40) NOT NULL,
    ip_address VARCHAR(100) NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT fk_devices_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

-- Ticket Service

CREATE TABLE IF NOT EXISTS tickets (
                                       ticket_id BIGSERIAL PRIMARY KEY,
                                       ticket_uuid VARCHAR(40) NOT NULL,
    user_id BIGINT NOT NULL,
    assignee_id BIGINT DEFAULT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    due_date TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW() + INTERVAL '2 week',
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                              CONSTRAINT uq_tickets_ticket_uuid UNIQUE (ticket_uuid),
    CONSTRAINT ck_tickets_progress CHECK ((progress >= 0) AND (progress <= 100)),
    CONSTRAINT fk_tickets_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_tickets_assignee_id FOREIGN KEY (assignee_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS tasks (
                                     task_id BIGSERIAL PRIMARY KEY,
                                     task_uuid VARCHAR(40) NOT NULL,
    ticket_id BIGINT NOT NULL,
    assignee_id BIGINT DEFAULT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    due_date TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 week',
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                              CONSTRAINT uq_tasks_task_uuid UNIQUE (task_uuid),
    CONSTRAINT fk_tasks_ticket_id FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_tasks_assignee_id FOREIGN KEY (assignee_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS files (
                                     file_id BIGSERIAL PRIMARY KEY,
                                     file_uuid VARCHAR(40) NOT NULL,
    ticket_id BIGINT NOT NULL,
    extension VARCHAR(10) NOT NULL,
    formatted_size VARCHAR(10) NOT NULL,
    name VARCHAR(50) NOT NULL,
    size BIGINT NOT NULL,
    uri VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT uq_files_file_uuid UNIQUE (file_uuid),
    CONSTRAINT fk_files_ticket_id FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS comments (
                                        comment_id BIGSERIAL PRIMARY KEY,
                                        comment_uuid VARCHAR(40) NOT NULL,
    user_id BIGINT NOT NULL,
    ticket_id BIGINT NOT NULL,
    comment TEXT NOT NULL,
    edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT uq_comments_comment_uuid UNIQUE (comment_uuid),
    CONSTRAINT fk_comments_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_comments_ticket_id FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS statuses (
                                        status_id BIGSERIAL PRIMARY KEY,
                                        status VARCHAR(20) NOT NULL,
    description VARCHAR(100) NOT NULL,
    CONSTRAINT ck_statuses_status CHECK(status IN ('NEW', 'IN PROGRESS', 'IN REVIEW', 'COMPLETED', 'IMPEDED', 'ASSIGNED', 'UNASSIGNED', 'CLOSED', 'PENDING'))
    );

CREATE TABLE IF NOT EXISTS types (
                                     type_id BIGSERIAL PRIMARY KEY,
                                     type VARCHAR(20) NOT NULL,
    description VARCHAR(100) NOT NULL,
    CONSTRAINT ck_types_type CHECK(type IN ('INCIDENT', 'BUG', 'DESIGN', 'DEFECT', 'ENHANCEMENT'))
    );

CREATE TABLE IF NOT EXISTS priorities (
                                          priority_id BIGSERIAL PRIMARY KEY,
                                          priority VARCHAR(10) NOT NULL,
    description VARCHAR(100) NOT NULL,
    CONSTRAINT ck_priorities_priority CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH'))
    );

CREATE TABLE IF NOT EXISTS ticket_statuses (
                                               ticket_status_id BIGSERIAL PRIMARY KEY,
                                               ticket_id BIGINT NOT NULL,
                                               status_id BIGINT NOT NULL,
                                               CONSTRAINT fk_ticket_statuses_ticket_id FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_ticket_statuses_status_id FOREIGN KEY (status_id) REFERENCES statuses (status_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS ticket_types (
                                            ticket_type_id BIGSERIAL PRIMARY KEY,
                                            ticket_id BIGINT NOT NULL,
                                            type_id BIGINT NOT NULL,
                                            CONSTRAINT fk_ticket_types_ticket_id FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_ticket_types_type_id FOREIGN KEY (type_id) REFERENCES types (type_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS ticket_priorities (
                                                 ticket_priority_id BIGSERIAL PRIMARY KEY,
                                                 ticket_id BIGINT NOT NULL,
                                                 priority_id BIGINT NOT NULL,
                                                 CONSTRAINT fk_ticket_priorities_ticket_id FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_ticket_priorities_priority_id FOREIGN KEY (priority_id) REFERENCES priorities (priority_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS task_statuses (
                                             task_status_id BIGSERIAL PRIMARY KEY,
                                             task_id BIGINT NOT NULL,
                                             status_id BIGINT NOT NULL,
                                             CONSTRAINT fk_task_statuses_task_id FOREIGN KEY (task_id) REFERENCES tasks (task_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_task_statuses_status_id FOREIGN KEY (status_id) REFERENCES statuses (status_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS messages (
                                        message_id BIGSERIAL PRIMARY KEY,
                                        message_uuid VARCHAR(40) NOT NULL,
    conversation_id VARCHAR(40) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT uq_messages_message_uuid UNIQUE (message_uuid),
    CONSTRAINT fk_messages_sender_id FOREIGN KEY (sender_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_messages_receiver_id FOREIGN KEY (receiver_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS message_statuses (
                                                message_status_id BIGSERIAL PRIMARY KEY,
                                                message_status VARCHAR(10) DEFAULT 'UNREAD',
    user_id BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    CONSTRAINT ck_message_statuses_message_status CHECK (message_status IN ('UNREAD', 'READ')),
    CONSTRAINT fk_message_statuses_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT k_message_statuses_message_id FOREIGN KEY (message_id) REFERENCES messages (message_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE
    );

-- Stored Procedures

CREATE OR REPLACE PROCEDURE create_user (IN p_user_uuid VARCHAR(40), IN p_first_name VARCHAR(25), IN p_last_name VARCHAR(25), IN p_email VARCHAR(40), IN p_username VARCHAR(25), IN p_password VARCHAR(255), IN p_credential_uuid VARCHAR(40), IN p_token VARCHAR(40), IN p_member_id VARCHAR(40))
    LANGUAGE PLPGSQL
    AS $$
    DECLARE
v_user_id BIGINT;
BEGIN
INSERT INTO users (user_uuid, first_name, last_name, email, username, member_id) VALUES (p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id) RETURNING user_id INTO v_user_id;
INSERT INTO credentials (credential_uuid, user_id, password) VALUES (p_credential_uuid, v_user_id, p_password);
INSERT INTO user_roles (user_id, role_id) VALUES (v_user_id, (SELECT roles.role_id FROM roles WHERE roles.name = 'USER'));
INSERT INTO account_tokens (user_id, token) VALUES (v_user_id, p_token);
END;
    $$


CREATE OR REPLACE PROCEDURE create_account (IN p_user_uuid VARCHAR(40), IN p_first_name VARCHAR(25), IN p_last_name VARCHAR(25), IN p_email VARCHAR(40), IN p_username VARCHAR(25), IN p_password VARCHAR(255), IN p_credential_uuid VARCHAR(40), IN p_token VARCHAR(40), IN p_member_id VARCHAR(40), IN p_role_name VARCHAR(20))
    LANGUAGE PLPGSQL
    AS $$
    DECLARE
v_user_id BIGINT;
BEGIN
INSERT INTO users (user_uuid, first_name, last_name, email, username, member_id) VALUES (p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id) RETURNING user_id INTO v_user_id;
INSERT INTO credentials (credential_uuid, user_id, password) VALUES (p_credential_uuid, v_user_id, p_password);
INSERT INTO user_roles (user_id, role_id) VALUES (v_user_id, (SELECT roles.role_id FROM roles WHERE roles.name = p_role_name));
INSERT INTO account_tokens (user_id, token) VALUES (v_user_id, p_token);
END;
    $$

-- Functions

CREATE OR REPLACE FUNCTION enable_user_mfa (IN p_user_uuid VARCHAR(40), IN p_qr_code_secret VARCHAR(50), IN p_qr_code_image_uri TEXT)
    RETURNS TABLE(qr_code_image_uri TEXT, member_id VARCHAR, role VARCHAR, authorities TEXT, account_non_expired BOOLEAN, account_non_locked BOOLEAN, created_at TIMESTAMP WITH TIME ZONE, email VARCHAR, enabled BOOLEAN, first_name VARCHAR, user_id BIGINT, image_url VARCHAR, last_login TIMESTAMP WITH TIME ZONE, last_name VARCHAR, mfa BOOLEAN, updated_at TIMESTAMP WITH TIME ZONE, user_uuid VARCHAR, phone VARCHAR, bio VARCHAR, address VARCHAR)
    LANGUAGE PLPGSQL
    AS $$
BEGIN
UPDATE users SET mfa = TRUE, qr_code_secret = p_qr_code_secret, qr_code_image_uri = p_qr_code_image_uri WHERE users.user_uuid = p_user_uuid;
RETURN QUERY SELECT u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities, u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled, u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa, u.updated_at, u.user_uuid, u.phone, u.bio, u.address FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_uuid = p_user_uuid;
END;
    $$

CREATE OR REPLACE FUNCTION disable_user_mfa (IN p_user_uuid VARCHAR(40))
    RETURNS TABLE(member_id VARCHAR, role VARCHAR, authorities TEXT, account_non_expired BOOLEAN, account_non_locked BOOLEAN, created_at TIMESTAMP WITH TIME ZONE, email VARCHAR, enabled BOOLEAN, first_name VARCHAR, user_id BIGINT, image_url VARCHAR, last_login TIMESTAMP WITH TIME ZONE, last_name VARCHAR, mfa BOOLEAN, updated_at TIMESTAMP WITH TIME ZONE, user_uuid VARCHAR, phone VARCHAR, bio VARCHAR, address VARCHAR)
    LANGUAGE PLPGSQL
    AS $$
BEGIN
UPDATE users SET mfa = FALSE, qr_code_secret = NULL, qr_code_image_uri = NULL WHERE users.user_uuid = p_user_uuid;
RETURN QUERY SELECT u.member_id, r.name AS role, r.authority AS authorities, u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled, u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa, u.updated_at, u.user_uuid, u.phone, u.bio, u.address FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_uuid = p_user_uuid;
END;
    $$

CREATE OR REPLACE FUNCTION toggle_account_expired (IN p_user_uuid VARCHAR(40))
    RETURNS TABLE(qr_code_image_uri TEXT, member_id VARCHAR, role VARCHAR, authorities TEXT, account_non_expired BOOLEAN, account_non_locked BOOLEAN, created_at TIMESTAMP WITH TIME ZONE, email VARCHAR, enabled BOOLEAN, first_name VARCHAR, user_id BIGINT, image_url VARCHAR, last_login TIMESTAMP WITH TIME ZONE, last_name VARCHAR, mfa BOOLEAN, updated_at TIMESTAMP WITH TIME ZONE, user_uuid VARCHAR, phone VARCHAR, bio VARCHAR, address VARCHAR)
    LANGUAGE PLPGSQL
    AS $$
BEGIN
UPDATE users SET account_non_expired = NOT users.account_non_expired WHERE users.user_uuid = p_user_uuid;
RETURN QUERY SELECT u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities, u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled, u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa, u.updated_at, u.user_uuid, u.phone, u.bio, u.address FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_uuid = p_user_uuid;
END;
    $$

CREATE OR REPLACE FUNCTION toggle_account_locked (IN p_user_uuid VARCHAR(40))
    RETURNS TABLE(qr_code_image_uri TEXT, member_id VARCHAR, role VARCHAR, authorities TEXT, account_non_expired BOOLEAN, account_non_locked BOOLEAN, created_at TIMESTAMP WITH TIME ZONE, email VARCHAR, enabled BOOLEAN, first_name VARCHAR, user_id BIGINT, image_url VARCHAR, last_login TIMESTAMP WITH TIME ZONE, last_name VARCHAR, mfa BOOLEAN, updated_at TIMESTAMP WITH TIME ZONE, user_uuid VARCHAR, phone VARCHAR, bio VARCHAR, address VARCHAR)
    LANGUAGE PLPGSQL
    AS $$
BEGIN
UPDATE users SET account_non_locked = NOT users.account_non_locked WHERE users.user_uuid = p_user_uuid;
RETURN QUERY SELECT u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities, u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled, u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa, u.updated_at, u.user_uuid, u.phone, u.bio, u.address FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_uuid = p_user_uuid;
END;
    $$

CREATE OR REPLACE FUNCTION toggle_account_enabled (IN p_user_uuid VARCHAR(40))
    RETURNS TABLE(qr_code_image_uri TEXT, member_id VARCHAR, role VARCHAR, authorities TEXT, account_non_expired BOOLEAN, account_non_locked BOOLEAN, created_at TIMESTAMP WITH TIME ZONE, email VARCHAR, enabled BOOLEAN, first_name VARCHAR, user_id BIGINT, image_url VARCHAR, last_login TIMESTAMP WITH TIME ZONE, last_name VARCHAR, mfa BOOLEAN, updated_at TIMESTAMP WITH TIME ZONE, user_uuid VARCHAR, phone VARCHAR, bio VARCHAR, address VARCHAR)
    LANGUAGE PLPGSQL
    AS $$
BEGIN
UPDATE users SET enabled = NOT users.enabled WHERE users.user_uuid = p_user_uuid;
RETURN QUERY SELECT u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities, u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled, u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa, u.updated_at, u.user_uuid, u.phone, u.bio, u.address FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_uuid = p_user_uuid;
END;
    $$

CREATE OR REPLACE FUNCTION update_user_role (IN p_user_uuid VARCHAR(40), IN p_role VARCHAR(25))
    RETURNS TABLE(qr_code_image_uri TEXT, member_id VARCHAR, role VARCHAR, authorities TEXT, account_non_expired BOOLEAN, account_non_locked BOOLEAN, created_at TIMESTAMP WITH TIME ZONE, email VARCHAR, enabled BOOLEAN, first_name VARCHAR, user_id BIGINT, image_url VARCHAR, last_login TIMESTAMP WITH TIME ZONE, last_name VARCHAR, mfa BOOLEAN, updated_at TIMESTAMP WITH TIME ZONE, user_uuid VARCHAR, phone VARCHAR, bio VARCHAR, address VARCHAR)
    LANGUAGE PLPGSQL
    AS $$
BEGIN
UPDATE user_roles SET role_id = (SELECT r.role_id FROM roles r WHERE r.name = p_role) WHERE user_roles.user_id = (SELECT users.user_id FROM users WHERE users.user_uuid = p_user_uuid);
RETURN QUERY SELECT u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities, u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled, u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa, u.updated_at, u.user_uuid, u.phone, u.bio, u.address FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_uuid = p_user_uuid;
END;
    $$

CREATE OR REPLACE FUNCTION create_ticket (IN p_ticket_uuid VARCHAR(40), IN p_user_uuid VARCHAR(40), IN p_title VARCHAR(100), IN p_description TEXT, IN p_type VARCHAR(20), IN p_priority VARCHAR(10))
    RETURNS TABLE (comment_count BIGINT, file_count BIGINT, ticket_id BIGINT, ticket_uuid VARCHAR, title VARCHAR, description TEXT, progress INT, due_date TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE, updated_at TIMESTAMP WITH TIME ZONE, status VARCHAR, type VARCHAR, priority VARCHAR)
    LANGUAGE PLPGSQL
    AS $$
    DECLARE v_ticket_id BIGINT;
    DECLARE v_user_id BIGINT;
BEGIN
SELECT user_id FROM users INTO v_user_id WHERE user_uuid = p_user_uuid;
INSERT INTO tickets (ticket_uuid, user_id, title, description) VALUES (p_ticket_uuid, v_user_id, p_title, p_description) RETURNING tickets.ticket_id INTO v_ticket_id;
INSERT INTO ticket_statuses (ticket_id, status_id) VALUES (v_ticket_id, (SELECT statuses.status_id FROM statuses WHERE statuses.status = 'NEW'));
INSERT INTO ticket_types (ticket_id, type_id) VALUES (v_ticket_id, (SELECT types.type_id FROM types WHERE types.type = p_type));
INSERT INTO ticket_priorities (ticket_id, priority_id) VALUES (v_ticket_id, (SELECT priorities.priority_id FROM priorities WHERE priorities.priority = p_priority));
RETURN QUERY SELECT COUNT(DISTINCT(c.comment_id)) AS comment_count, COUNT(DISTINCT(f.file_id)) AS file_count, t.ticket_id, t.ticket_uuid, t.title, t.description, t.progress, t.due_date, t.created_at, t.updated_at, s.status, typ.type, pr.priority FROM tickets t JOIN users u ON t.user_id = u.user_id JOIN ticket_statuses ts ON t.ticket_id = ts.ticket_id JOIN ticket_types tt ON t.ticket_id = tt.ticket_id JOIN ticket_priorities tp ON t.ticket_id = tp.ticket_id JOIN statuses s ON s.status_id = ts.status_id JOIN types typ ON typ.type_id = tt.type_id JOIN priorities pr ON pr.priority_id = tp.priority_id LEFT JOIN files f ON t.ticket_id = f.ticket_id LEFT JOIN comments c ON t.ticket_id = c.ticket_id WHERE u.user_uuid = p_user_uuid AND t.ticket_id = v_ticket_id GROUP BY u.user_id, t.ticket_id, s.status, typ.type_id, pr.priority_id;
END;
    $$

CREATE OR REPLACE FUNCTION create_comment (IN p_comment_uuid VARCHAR(40), IN p_user_uuid VARCHAR(40), IN p_ticket_uuid VARCHAR(40), IN p_comment TEXT)
    RETURNS TABLE (comment_id BIGINT, comment_uuid VARCHAR, comment TEXT, created_at TIMESTAMP WITH TIME ZONE, updated_at TIMESTAMP WITH TIME ZONE, user_uuid VARCHAR, first_name VARCHAR, last_name VARCHAR, image_url VARCHAR)
    LANGUAGE PLPGSQL
    AS $$
    DECLARE v_user_id BIGINT;
    DECLARE v_ticket_id BIGINT;
    DECLARE v_comment_id BIGINT;
BEGIN
SELECT user_id FROM users INTO v_user_id WHERE users.user_uuid = p_user_uuid;
SELECT ticket_id FROM tickets INTO v_ticket_id WHERE ticket_uuid = p_ticket_uuid;
INSERT INTO comments (comment_uuid, user_id, ticket_id, comment) VALUES (p_comment_uuid, v_user_id, v_ticket_id, p_comment) RETURNING comments.comment_id INTO v_comment_id;
RETURN QUERY SELECT c.comment_id, c.comment_uuid, c.comment, c.created_at, c.updated_at, u.user_uuid, u.first_name, u.last_name, u.image_url FROM comments c JOIN tickets t ON t.ticket_id = c.ticket_id JOIN users u ON u.user_id = c.user_id WHERE c.comment_id = v_comment_id;
END;
    $$

CREATE OR REPLACE FUNCTION update_comment (IN p_comment_uuid VARCHAR(40), IN p_comment TEXT)
    RETURNS TABLE (comment_id BIGINT, comment_uuid VARCHAR, comment TEXT, created_at TIMESTAMP WITH TIME ZONE, updated_at TIMESTAMP WITH TIME ZONE, user_uuid VARCHAR, first_name VARCHAR, last_name VARCHAR, image_url VARCHAR)
    LANGUAGE PLPGSQL
    AS $$
BEGIN
UPDATE comments SET comment = p_comment, edited = TRUE, update_at = NOW() WHERE comments.comment_uuid = p_comment_uuid;
RETURN QUERY SELECT c.comment_id, c.comment_uuid, c.comment, c.created_at, c.updated_at, u.user_uuid, u.first_name, u.last_name, u.image_url FROM comments c JOIN users u ON u.user_id = c.user_id WHERE c.comment_uuid = p_comment_uuid;
END;
    $$

CREATE OR REPLACE FUNCTION update_ticket (IN p_ticket_uuid VARCHAR(40), IN p_title VARCHAR(100), IN p_description TEXT, IN p_progress INTEGER, IN p_due_date VARCHAR(40), p_status VARCHAR(20), IN p_type VARCHAR(20), IN p_priority VARCHAR(10))
    RETURNS TABLE (ticket_id BIGINT, ticket_uuid VARCHAR, title VARCHAR, description TEXT, progress INT, due_date TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE, updated_at TIMESTAMP WITH TIME ZONE, status VARCHAR, type VARCHAR, priority VARCHAR)
    LANGUAGE PLPGSQL
    AS $$
    DECLARE v_ticket_id BIGINT;
BEGIN
UPDATE tickets SET title = p_title, description = p_description, progress = p_progress, due_date = TO_TIMESTAMP(p_due_date, 'YYYY-MM-DD HH24:MI:ss'), update_at = NOW() WHERE tickets.ticket_uuid = p_ticket_uuid RETURNING tickets.ticket_id INTO v_ticket_id;
UPDATE ticket_statuses SET status_id = (SELECT statuses.status_id FROM statuses WHERE statuses.status = p_status) WHERE ticket_statuses.ticket_id = v_ticket_id;
UPDATE ticket_types SET type_id = (SELECT types.type_id FROM types WHERE types.type = p_type) WHERE ticket_types.ticket_id = v_ticket_id;
UPDATE ticket_priorities SET priority_id = (SELECT priorities.priority_id FROM priorities WHERE priorities.priority = p_priority) WHERE ticket_priorities.ticket_id = v_ticket_id;
RETURN QUERY SELECT t.ticket_id, t.ticket_uuid, t.title, t.description, t.progress, t.due_date, t.created_at, t.updated_at, s.status, typ.type, pr.priority FROM tickets t JOIN ticket_statuses ts ON t.ticket_id = ts.ticket_id JOIN ticket_types tt ON t.ticket_id = tt.ticket_id JOIN ticket_priorities tp ON t.ticket_id = tp.ticket_id JOIN statuses s ON s.status_id = ts.status_id JOIN types typ ON typ.type_id = tt.type_id JOIN priorities pr ON pr.priority_id = tp.priority_id WHERE t.ticket_id = v_ticket_id;
END;
    $$

CREATE OR REPLACE FUNCTION create_task (IN p_user_uuid VARCHAR(40), IN p_ticket_uuid VARCHAR(40), IN p_task_uuid VARCHAR(40), IN p_name VARCHAR(50), IN p_description VARCHAR(255), IN p_status VARCHAR(20))
    RETURNS TABLE (first_name VARCHAR, last_name VARCHAR, image_url VARCHAR, task_id BIGINT, task_uuid VARCHAR, name VARCHAR, description VARCHAR, status VARCHAR, due_date TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE, updated_at TIMESTAMP WITH TIME ZONE)
    LANGUAGE PLPGSQL
    AS $$
    DECLARE v_task_id BIGINT;
    DECLARE v_ticket_id BIGINT;
    DECLARE v_user_id BIGINT;
BEGIN
SELECT users.user_id FROM users WHERE users.user_uuid = p_user_uuid INTO v_user_id;
SELECT tickets.ticket_id FROM tickets WHERE ticket.ticket_uuid = p_ticket_uuid INTO v_ticket_id;
INSERT INTO tasks (task_uuid, ticket_id, assigned_id, name, description) VALUES (p_task_uuid, v_ticket_id, v_user_id, p_name, p_description) RETURNING tasks.task_id INTO v_task_id;
INSERT INTO task_statuses (task_id, status_id) VALUES (v_task_id, (SELECT statuses.status_id FROM statuses WHERE statuses.status = p_status));
RETURN QUERY SELECT u.first_name, u.last_name, u.image_url, t.task_id, t.task_uuid, t.name, t.description, s.status, t.due_date, t.created_at, t.updated_at FROM tasks t JOIN users u ON t.assignee_id = u.user_id JOIN task_statuses ts ON t.task_id = ts.task_id JOIN statuses s ON ts.status_id = s.status_id WHERE t.task_id = v_task_id;
END;
    $$

CREATE OR REPLACE FUNCTION save_ticket_file (IN p_file_uuid VARCHAR(40), IN p_ticket_id BIGINT, IN p_filename VARCHAR(50), IN p_name VARCHAR(50), IN p_size BIGINT, IN p_formatted_size VARCHAR(10), IN p_extension VARCHAR(10), IN p_uri VARCHAR(255))
    RETURNS TABLE (file_id BIGINT, file_uuid VARCHAR, extension VARCHAR, formatted_size VARCHAR, name VARCHAR, size BIGINT, uri VARCHAR, created_at TIMESTAMP WITH TIME ZONE, updated_at TIMESTAMP WITH TIME ZONE)
    LANGUAGE PLPGSQL
    AS $$
    DECLARE v_file_id BIGINT;
BEGIN
INSERT INTO files (file_uuid, ticket_id, name, size, formatted_size, extension, uri) VALUES (p_file_uuid, p_ticket_id, p_filename, p_size, p_formatted_size, p_extension, p_uri) RETURNING files.file_id INTO v_file_id;
RETURN QUERY SELECT f.file_id, f.file_uuid, f.extension, f.formatted_size, f.name, f.size, f.uri, f.created_at, f.updated_at FROM files f WHERE f.file_id = v_file_id;
END;
    $$

CREATE OR REPLACE FUNCTION create_message (IN p_message_uuid VARCHAR(40), IN p_from_user_uuid VARCHAR(40), IN p_to_email VARCHAR(40), IN p_subject VARCHAR(40), IN p_message TEXT, IN p_conversation_id VARCHAR(40))
    RETURNS TABLE (sender_uuid VARCHAR, sender_first_name VARCHAR, sender_last_name VARCHAR, sender_email VARCHAR, sender_image_url VARCHAR, receiver_uuid VARCHAR, receiver_first_name VARCHAR, receiver_last_name VARCHAR, receiver_email VARCHAR, receiver_image_url VARCHAR, message_id BIGINT, message_uuid VARCHAR, subject VARCHAR, message TEXT, conversation_id VARCHAR, status VARCHAR, created_at TIMESTAMP WITH TIME ZONE, updated_at TIMESTAMP WITH TIME ZONE)
    LANGUAGE PLPGSQL
    AS $$
    DECLARE v_from_user_id BIGINT;
    DECLARE v_to_user_id BIGINT;
    DECLARE v_message_id BIGINT;
BEGIN
SELECT users.user_id FROM users WHERE users.user_uuid = p_from_user_uuid INTO v_from_user_id;
SELECT users.user_id FROM users WHERE users.email = p_to_email INTO v_to_user_id;
INSERT INTO messages (message_uuid, subject, message, sender_id, receiver_id, conversation_id) VALUES (p_message_uuid, p_subject, p_message, v_from_user_id, v_to_user_id, p_conversation_id) RETURNING messages.message_id INTO v_message_id;
INSERT INTO message_statuses(message_status, user_id, message_id) VALUES ('READ', v_from_user_id, v_message_id);
INSERT INTO message_statuses(message_status, user_id, message_id) VALUES ('UNREAD', v_to_user_id, v_message_id);
RETURN QUERY SELECT s.user_uuid AS sender_uuid, s.first_name AS sender_first_name, s.last_name AS sender_last_name, s.email AS sender_email, s.image_url AS sender_image_url, r.user_uuid AS receiver_uuid, r.first_name AS receiver_first_name, r.last_name AS receiver_last_name, r.email AS receiver_email, r.image_url AS receiver_image_url, m.message_id, m.message_uuid, m.subject, m.message, m.conversation_id, ms.message_status AS status, m.created_at, m.updated_at FROM messages m JOIN users s ON m.sender_id = s.user_id JOIN users r ON m.receiver_id = r.user_id JOIN message_statuses ms ON (ms.user_id = v_from_user_id AND ms.message_id = v_message_id) WHERE m.message_id = v_message_id;
END;
    $$


    ----- Analyse de credit ----

CREATE TABLE promoteur (
                           promoteur_id SERIAL PRIMARY KEY,
                           nom VARCHAR(100) NOT NULL,
                           prenom VARCHAR(100) NOT NULL,
                           date_naissance DATE,
                           numero_identite VARCHAR(50),
                           adresse TEXT,
                           telephone VARCHAR(20),
                           email VARCHAR(100),
                           date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entreprise (
                            entreprise_id SERIAL PRIMARY KEY,
                            nom VARCHAR(200) NOT NULL,
                            forme_juridique VARCHAR(50),
                            secteur_activite VARCHAR(100),
                            date_creation DATE,
                            numero_registre VARCHAR(50),
                            adresse TEXT,
                            telephone VARCHAR(20),
                            email VARCHAR(100),
                            promoteur_id INTEGER REFERENCES promoteur(promoteur_id),
                            date_enregistrement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE bilan_entreprise (
                                  bilan_entreprise_id SERIAL PRIMARY KEY,
                                  entreprise_id INTEGER REFERENCES entreprise(entreprise_id),
                                  date_bilan DATE NOT NULL,
                                  liquidites DECIMAL(15, 2) DEFAULT 0,
                                  creances_clients DECIMAL(15, 2) DEFAULT 0,
                                  valeur_stocks DECIMAL(15, 2) DEFAULT 0,
                                  valeur_equipements DECIMAL(15, 2) DEFAULT 0,
                                  dettes_fournisseurs DECIMAL(15, 2) DEFAULT 0,
                                  emprunts DECIMAL(15, 2) DEFAULT 0,
                                  capital_propre DECIMAL(15, 2) DEFAULT 0,
                                  est_previsionnel BOOLEAN DEFAULT FALSE,
                                  date_enregistrement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Contrainte d'unicité pour éviter les doublons
                                  CONSTRAINT uk_bilan_entreprise UNIQUE (entreprise_id, date_bilan, est_previsionnel)
);

CREATE TABLE bilan_personnel (
                                 bilan_personnel_id SERIAL PRIMARY KEY,
                                 promoteur_id INTEGER REFERENCES promoteur(promoteur_id),
                                 date_bilan DATE NOT NULL,
                                 epargnes DECIMAL(15, 2) DEFAULT 0,
                                 valeur_biens_durables DECIMAL(15, 2) DEFAULT 0,
                                 date_enregistrement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Contrainte d'unicité pour éviter les doublons
                                 CONSTRAINT uk_bilan_personnel UNIQUE (promoteur_id, date_bilan)
);


CREATE TABLE compte_exploitation (
                                     compte_exploitation_id SERIAL PRIMARY KEY,
                                     entreprise_id INTEGER REFERENCES entreprise(entreprise_id),
                                     date_debut_periode DATE NOT NULL,
                                     date_fin_periode DATE NOT NULL,
                                     chiffre_affaires DECIMAL(15, 2) DEFAULT 0,
                                     cout_marchandises DECIMAL(15, 2) DEFAULT 0,
                                     cout_transport_production DECIMAL(15, 2) DEFAULT 0,
                                     frais_transport_personnel DECIMAL(15, 2) DEFAULT 0,
                                     frais_manutention DECIMAL(15, 2) DEFAULT 0,
                                     montant_aide_externe DECIMAL(15, 2) DEFAULT 0,
                                     frais_hebergement_restauration DECIMAL(15, 2) DEFAULT 0,
                                     impots DECIMAL(15, 2) DEFAULT 0,
                                     loyers DECIMAL(15, 2) DEFAULT 0,
                                     est_previsionnel BOOLEAN DEFAULT FALSE,
                                     date_enregistrement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Contrainte d'unicité pour éviter les doublons
                                     CONSTRAINT uk_compte_exploitation UNIQUE (entreprise_id, date_debut_periode, date_fin_periode, est_previsionnel),
    -- Contrainte pour s'assurer que la date de fin est après la date de début
                                     CONSTRAINT ck_periode_valide CHECK (date_fin_periode >= date_debut_periode)
);


CREATE TABLE demande_credit (
                                demande_credit_id SERIAL PRIMARY KEY,
                                entreprise_id INTEGER REFERENCES entreprise(entreprise_id),
                                date_demande DATE NOT NULL DEFAULT CURRENT_DATE,
                                montant_demande DECIMAL(15, 2) NOT NULL,
                                duree_mois INTEGER NOT NULL,
                                taux_interet DECIMAL(5, 2),
                                objet_financement TEXT,
                                statut VARCHAR(20) DEFAULT 'En attente',
                                date_enregistrement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Contrainte pour s'assurer que le montant est positif
                                CONSTRAINT ck_montant_positif CHECK (montant_demande > 0),
    -- Contrainte pour s'assurer que la durée est positive
                                CONSTRAINT ck_duree_positive CHECK (duree_mois > 0)
);


-- Table des analyses de crédit
CREATE TABLE analyse_credit (
                                analyse_credit_id SERIAL PRIMARY KEY,
                                demande_credit_id INTEGER REFERENCES demande_credit(demande_credit_id),
                                ratio_liquidite DECIMAL(10, 4),
                                ratio_endettement DECIMAL(10, 4),
                                marge_brute_actuelle DECIMAL(10, 4),
                                marge_brute_previsionnelle DECIMAL(10, 4),
                                marge_nette_actuelle DECIMAL(10, 4),
                                marge_nette_previsionnelle DECIMAL(10, 4),
                                ratio_marge_nette_actuelle DECIMAL(10, 4),
                                ratio_marge_nette_previsionnelle DECIMAL(10, 4),
                                score_credit INTEGER,
                                recommandation VARCHAR(50),
                                commentaires TEXT,
                                date_analyse DATE DEFAULT CURRENT_DATE,
                                date_enregistrement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Contrainte d'unicité pour éviter les doublons
                                CONSTRAINT uk_analyse_credit UNIQUE (demande_credit_id, date_analyse)
);




---  Saisie des données actuelles (n-1)

INSERT INTO compte_exploitation
(entreprise_id, date_debut_periode, date_fin_periode, chiffre_affaires, est_previsionnel)
VALUES
    (:entreprise_id, :date_debut, :date_fin, :chiffre_affaires, FALSE);

----  Saisie des données prévisionnelles

INSERT INTO compte_exploitation
(entreprise_id, date_debut_periode, date_fin_periode, chiffre_affaires, cout_marchandises, est_previsionnel)
VALUES
    (:entreprise_id, :date_debut_prev, :date_fin_prev, :chiffre_affaires_prev, :cout_marchandises_prev, TRUE);






CREATE OR REPLACE FUNCTION traiter_demande_sans_analyse(
      -- Paramètres pour le promoteur
    p_nom_promoteur VARCHAR(100),
    p_prenom_promoteur VARCHAR(100),
    p_date_naissance_promoteur DATE,
    p_numero_identite_promoteur VARCHAR(50),
    p_adresse_promoteur TEXT,
    p_telephone_promoteur VARCHAR(20),
    p_email_promoteur VARCHAR(100),

    -- Paramètres pour l'entreprise
    p_nom_entreprise VARCHAR(200),
    p_forme_juridique VARCHAR(50),
    p_secteur_activite VARCHAR(100),
    p_date_creation_entreprise DATE,
    p_numero_registre VARCHAR(50),
    p_adresse_entreprise TEXT,
    p_telephone_entreprise VARCHAR(20),
    p_email_entreprise VARCHAR(100),

    -- Paramètres pour le bilan de l'entreprise
    p_liquidites DECIMAL(15, 2),
    p_creances_clients DECIMAL(15, 2),
    p_valeur_stocks DECIMAL(15, 2),
    p_valeur_equipements DECIMAL(15, 2),
    p_dettes_fournisseurs DECIMAL(15, 2),
    p_emprunts DECIMAL(15, 2),
    p_capital_propre DECIMAL(15, 2),

    -- Paramètres pour le bilan personnel
    p_epargnes DECIMAL(15, 2),
    p_valeur_biens_durables DECIMAL(15, 2),

    -- Paramètres pour le compte d'exploitation actuel
    p_date_debut_periode_actuel DATE,
    p_date_fin_periode_actuel DATE,
    p_chiffre_affaires_actuel DECIMAL(15, 2),
    p_cout_marchandises_actuel DECIMAL(15, 2),
    p_cout_transport_production_actuel DECIMAL(15, 2),
    p_frais_transport_personnel_actuel DECIMAL(15, 2),
    p_frais_manutention_actuel DECIMAL(15, 2),
    p_montant_aide_externe_actuel DECIMAL(15, 2),
    p_frais_hebergement_restauration_actuel DECIMAL(15, 2),
    p_impots_actuel DECIMAL(15, 2),
    p_loyers_actuel DECIMAL(15, 2),

    -- Paramètres pour le compte d'exploitation prévisionnel
    p_date_debut_periode_previsionnel DATE,
    p_date_fin_periode_previsionnel DATE,
    p_chiffre_affaires_previsionnel DECIMAL(15, 2),
    p_cout_marchandises_previsionnel DECIMAL(15, 2),
    p_cout_transport_production_previsionnel DECIMAL(15, 2),
    p_frais_transport_personnel_previsionnel DECIMAL(15, 2),
    p_frais_manutention_previsionnel DECIMAL(15, 2),
    p_montant_aide_externe_previsionnel DECIMAL(15, 2),
    p_frais_hebergement_restauration_previsionnel DECIMAL(15, 2),
    p_impots_previsionnel DECIMAL(15, 2),
    p_loyers_previsionnel DECIMAL(15, 2),

    -- Paramètres pour la demande de crédit
    p_montant_demande DECIMAL(15, 2),
    p_duree_mois INTEGER,
    p_objet_financement TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
v_promoteur_id INTEGER;
    v_entreprise_id INTEGER;
    v_bilan_entreprise_id INTEGER;
    v_bilan_personnel_id INTEGER;
    v_compte_exploitation_actuel_id INTEGER;
    v_compte_exploitation_previsionnel_id INTEGER;
    v_demande_credit_id INTEGER;
    v_date_courante DATE := CURRENT_DATE;
BEGIN
     -- 1. Insérer le promoteur
INSERT INTO promoteur (
    nom, prenom, date_naissance, numero_identite,
    adresse, telephone, email
) VALUES (
             p_nom_promoteur, p_prenom_promoteur, p_date_naissance_promoteur, p_numero_identite_promoteur,
             p_adresse_promoteur, p_telephone_promoteur, p_email_promoteur
         ) RETURNING promoteur_id INTO v_promoteur_id;

-- 2. Insérer l'entreprise
INSERT INTO entreprise (
    nom, forme_juridique, secteur_activite, date_creation,
    numero_registre, adresse, telephone, email, promoteur_id
) VALUES (
             p_nom_entreprise, p_forme_juridique, p_secteur_activite, p_date_creation_entreprise,
             p_numero_registre, p_adresse_entreprise, p_telephone_entreprise, p_email_entreprise, v_promoteur_id
         ) RETURNING entreprise_id INTO v_entreprise_id;

-- 3. Insérer le bilan de l'entreprise actuel
INSERT INTO bilan_entreprise (
    entreprise_id, date_bilan, liquidites, creances_clients,
    valeur_stocks, valeur_equipements, dettes_fournisseurs,
    emprunts, capital_propre, est_previsionnel
) VALUES (
             v_entreprise_id, v_date_courante, p_liquidites, p_creances_clients,
             p_valeur_stocks, p_valeur_equipements, p_dettes_fournisseurs,
             p_emprunts, p_capital_propre, FALSE
         ) RETURNING bilan_entreprise_id INTO v_bilan_entreprise_id;

-- 4. Insérer le bilan personnel
INSERT INTO bilan_personnel (
    promoteur_id, date_bilan, epargnes, valeur_biens_durables
) VALUES (
             v_promoteur_id, v_date_courante, p_epargnes, p_valeur_biens_durables
         ) RETURNING bilan_personnel_id INTO v_bilan_personnel_id;

-- 5. Insérer le compte d'exploitation actuel
INSERT INTO compte_exploitation (
    entreprise_id, date_debut_periode, date_fin_periode, chiffre_affaires,
    cout_marchandises, cout_transport_production, frais_transport_personnel,
    frais_manutention, montant_aide_externe, frais_hebergement_restauration,
    impots, loyers, est_previsionnel
) VALUES (
             v_entreprise_id, p_date_debut_periode_actuel, p_date_fin_periode_actuel, p_chiffre_affaires_actuel,
             p_cout_marchandises_actuel, p_cout_transport_production_actuel, p_frais_transport_personnel_actuel,
             p_frais_manutention_actuel, p_montant_aide_externe_actuel, p_frais_hebergement_restauration_actuel,
             p_impots_actuel, p_loyers_actuel, FALSE
         ) RETURNING compte_exploitation_id INTO v_compte_exploitation_actuel_id;

-- 6. Insérer le compte d'exploitation prévisionnel
INSERT INTO compte_exploitation (
    entreprise_id, date_debut_periode, date_fin_periode, chiffre_affaires,
    cout_marchandises, cout_transport_production, frais_transport_personnel,
    frais_manutention, montant_aide_externe, frais_hebergement_restauration,
    impots, loyers, est_previsionnel
) VALUES (
             v_entreprise_id, p_date_debut_periode_previsionnel, p_date_fin_periode_previsionnel, p_chiffre_affaires_previsionnel,
             p_cout_marchandises_previsionnel, p_cout_transport_production_previsionnel, p_frais_transport_personnel_previsionnel,
             p_frais_manutention_previsionnel, p_montant_aide_externe_previsionnel, p_frais_hebergement_restauration_previsionnel,
             p_impots_previsionnel, p_loyers_previsionnel, TRUE
         ) RETURNING compte_exploitation_id INTO v_compte_exploitation_previsionnel_id;

-- 7. Insérer la demande de crédit
INSERT INTO demande_credit (
    entreprise_id, date_demande, montant_demande, duree_mois, objet_financement
) VALUES (
             v_entreprise_id, v_date_courante, p_montant_demande, p_duree_mois, p_objet_financement
         ) RETURNING demande_credit_id INTO v_demande_credit_id;

-- Note: Nous ne générons pas l'analyse de crédit ici pour éviter le problème de dépassement

-- Préparer le résultat JSON avec tous les IDs générés
v_resultat := jsonb_build_object(
        'success', true,
        'message', 'Demande de crédit créée avec succès (sans analyse)',
        'data', jsonb_build_object(
            'promoteur_id', v_promoteur_id,
            'entreprise_id', v_entreprise_id,
            'bilan_entreprise_id', v_bilan_entreprise_id,
            'bilan_personnel_id', v_bilan_personnel_id,
            'compte_exploitation_actuel_id', v_compte_exploitation_actuel_id,
            'compte_exploitation_previsionnel_id', v_compte_exploitation_previsionnel_id,
            'demande_credit_id', v_demande_credit_id
        )
    );
RETURN TRUE;

EXCEPTION WHEN OTHERS THEN
    -- En cas d'erreur, retourner FALSE
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;


 ----- ECREDIT   -------

 -- Add responsable_id as a self-referencing foreign key
ALTER TABLE users
    ADD COLUMN responsable_id BIGINT NULL;

-- Add delegation, agency, and point of sale IDs
ALTER TABLE users
    ADD COLUMN delegation_id BIGINT NULL,
ADD COLUMN agence_id BIGINT NULL,
ADD COLUMN pointvente_id BIGINT NULL;

-- Add foreign key constraint for the self-referencing relationship
ALTER TABLE users
    ADD CONSTRAINT fk_users_responsable
        FOREIGN KEY (responsable_id) REFERENCES users(user_id);

-- Optional: Add foreign key constraints if these tables exist
-- Uncomment and modify as needed

ALTER TABLE users
ADD CONSTRAINT fk_users_delegation
FOREIGN KEY (delegation_id) REFERENCES delegation(id);

ALTER TABLE users
ADD CONSTRAINT fk_users_agence
FOREIGN KEY (agence_id) REFERENCES agence(id);

ALTER TABLE users
ADD CONSTRAINT fk_users_pointvente
FOREIGN KEY (pointvente_id) REFERENCES pointvente(id);



CREATE TABLE demandeIndividuel (
                                   demandeIndividuel_id BIGSERIAL PRIMARY KEY,
                                   nom VARCHAR(255),
                                   prenom VARCHAR(255),
                                   telephone VARCHAR(255),
                                   age INTEGER,
                                   numero_membre VARCHAR(255),
                                   delegation INTEGER,
                                   agence INTEGER,
                                   pos INTEGER,
                                   quartier VARCHAR(255),
                                   fonction VARCHAR(255),
                                   createdAt TIMESTAMP,
                                   montant DECIMAL,
                                   activite VARCHAR(255),
                                   statut_demande VARCHAR(255),
                                   commune_residence VARCHAR(255),
                                   validation_state VARCHAR(255),
                                   type_apport VARCHAR(255),
                                   statut_selection VARCHAR(255),
                                   current_activite VARCHAR(255),
                                   raison VARCHAR(255),
                                   object VARCHAR(255),
                                   tip_credito INTEGER,
                                   cod_usuarios VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS selection (
                                         selection_id BIGSERIAL PRIMARY KEY,
                                         doc VARCHAR(300),
    created_at TIMESTAMP,
    statut_selection VARCHAR(255),
    user_id BIGINT NOT NULL,
    demandeIndividuel_id BIGINT NOT NULL,
    CONSTRAINT fk_selection_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_selection_demande FOREIGN KEY (demandeIndividuel_id) REFERENCES demandeIndividuel(demandeIndividuel_id)
    );

CREATE TABLE IF NOT EXISTS redirection (
                                           redirection_id BIGSERIAL PRIMARY KEY,
                                           pos VARCHAR(255),
    usager VARCHAR(255),
    state VARCHAR(255),  -- FOR-SELECTION - FOR-CREDIT
    created_at TIMESTAMP,
    demandeindividuel_id BIGINT NOT NULL,
    CONSTRAINT fk_redirection_demande FOREIGN KEY (demandeindividuel_id) REFERENCES demandeIndividuel(demandeIndividuel_id)
    );


-- Create the individuel table
CREATE TABLE IF NOT EXISTS individuel (
                                          individuel_id BIGSERIAL PRIMARY KEY,
                                          created_at TIMESTAMP,
                                          cat_membre VARCHAR(255),
    numero_membre VARCHAR(255),
    nom VARCHAR(25),
    prenom VARCHAR(25),
    date_naissance TIMESTAMP,
    lieux_naissance VARCHAR(25),
    nationalite VARCHAR(25),
    telephone VARCHAR(255),
    telephone2 VARCHAR(255),
    type_piece VARCHAR(255),
    numero_piece VARCHAR(255),
    sexe VARCHAR(1),
    profession VARCHAR(255),
    nom_pere VARCHAR(25),
    nom_mere VARCHAR(25),
    activite VARCHAR(255),
    nbre_enfant INTEGER,
    nbre_parent INTEGER,
    nbre_autre INTEGER,
    quartier VARCHAR(255),
    district VARCHAR(255),
    secteur VARCHAR(255),
    cotisation DECIMAL,
    droit_entree DECIMAL,
    type_habitation VARCHAR(2),
    nbre_annee INTEGER,
    statutIndividuel VARCHAR(255),
    prestataire VARCHAR(255),
    codCanton VARCHAR(255),
    ville VARCHAR(255),
    typeEntreprise VARCHAR(2),
    lienParente VARCHAR(255),
    nomParent VARCHAR(255),
    conjoint VARCHAR(15),
    nbreAnneeH INTEGER,
    adresse VARCHAR(255),
    expiration_date TIMESTAMP,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_individuel_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Create the credit table
CREATE TABLE IF NOT EXISTS credit (
                                      credit_id BIGSERIAL PRIMARY KEY,
                                      reference_credit VARCHAR(255) NOT NULL,
    type_credit VARCHAR(20) NOT NULL,
    status VARCHAR(255),
    create_at TIMESTAMP,
    code_membre VARCHAR(255),
    delegation_id BIGINT,
    agence_id BIGINT,
    pointvente_id BIGINT,
    individuel_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT uk_credit_reference UNIQUE (reference_credit),
    CONSTRAINT fk_credit_individuel FOREIGN KEY (individuel_id) REFERENCES individuel(individuel_id),
    CONSTRAINT fk_credit_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE IF NOT EXISTS occurence_credit (
                                                occurence_credit_id BIGSERIAL PRIMARY KEY,
                                                cod_membre_ind VARCHAR(255),
    created_at TIMESTAMP,
    state_credit VARCHAR(255),
    reference_credit VARCHAR(255),
    state_note VARCHAR(255),
    note_profile VARCHAR(255),
    note_analyse VARCHAR(255),
    note_garantie VARCHAR(255),
    statut VARCHAR(255),
    individuel_id BIGINT,
    user_id BIGINT,
    CONSTRAINT fk_occurence_credit_individuel FOREIGN KEY (individuel_id) REFERENCES individuel(individuel_id),
    CONSTRAINT fk_occurence_credit_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE IF NOT EXISTS petit_credit (
                                            petit_credit_id BIGSERIAL PRIMARY KEY,
                                            moyen_person VARCHAR(255),
    bien VARCHAR(255),
    capital DECIMAL,
    creance DECIMAL,
    dette DECIMAL,
    statut_activite VARCHAR(255),
    experience VARCHAR(255),
    lieux_act VARCHAR(255),
    person_emp VARCHAR(255),
    lien VARCHAR(255),
    nombre VARCHAR(255),
    reference_credit VARCHAR(255),
    cumul_credit DECIMAL,
    nbre_credit INTEGER,
    CONSTRAINT uk_petit_credit_reference UNIQUE (reference_credit)
    );

CREATE TABLE IF NOT EXISTS produit_ind (
                                           produit_ind_id BIGSERIAL PRIMARY KEY,
                                           reference_credit VARCHAR(255),
    libele VARCHAR(255),
    prix_unit DECIMAL,
    qte INTEGER,
    created_at TIMESTAMP,
    observation VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS charges_indi (
                                            charges_indi_id BIGSERIAL PRIMARY KEY,
                                            reference_credit VARCHAR(255),
    libele VARCHAR(255),
    prix_unit DECIMAL,
    qte INTEGER,
    create_at TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS frequence (
                                         frequence_id BIGSERIAL PRIMARY KEY,
                                         reference_credit VARCHAR(255) NOT NULL,
    created_ate TIMESTAMP,
    frequence INTEGER,
    CONSTRAINT uk_frequence_reference UNIQUE (reference_credit)
    );

CREATE TABLE IF NOT EXISTS garantieMat (
                                           garantieMat_id BIGSERIAL PRIMARY KEY,
                                           reference_credit VARCHAR(255) NOT NULL,
    libele VARCHAR(255),
    montant DECIMAL,
    created_at TIMESTAMP,
    CONSTRAINT uk_garantiemat_reference UNIQUE (reference_credit)
    );

CREATE TABLE IF NOT EXISTS garantiepersonnecaution (
                                                       garantiepersonnecaution_id BIGSERIAL PRIMARY KEY,
                                                       nom VARCHAR(255),
    prenom VARCHAR(255),
    telephone VARCHAR(255),
    reference_credit VARCHAR(255),
    activite VARCHAR(255),
    age BIGINT,
    profession VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS localisation (
                                            localisation_id BIGSERIAL PRIMARY KEY,
                                            reference_credit VARCHAR(255) NOT NULL,
    it_ass VARCHAR(255),
    it_pc VARCHAR(255),
    CONSTRAINT uk_localisation_reference UNIQUE (reference_credit)
    );


-- Create note_profile table
CREATE TABLE IF NOT EXISTS note_profile (
                                            note_profile_id BIGSERIAL PRIMARY KEY,
                                            reference_credit VARCHAR(255),
    note BIGINT,
    motif VARCHAR(255),
    created_at TIMESTAMP,
    status_note VARCHAR(255),
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_note_profile_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Create note_analyse table
CREATE TABLE IF NOT EXISTS note_analyse (
                                            note_analyse_id BIGSERIAL PRIMARY KEY,
                                            reference_credit VARCHAR(255),
    note BIGINT,
    motif VARCHAR(255),
    status_note VARCHAR(255),
    created_at TIMESTAMP,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_note_analyse_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Create note_garantie table
CREATE TABLE IF NOT EXISTS note_garantie (
                                             note_garantie_id BIGSERIAL PRIMARY KEY,
                                             reference_credit VARCHAR(255),
    motif VARCHAR(255),
    note BIGINT,
    status_note VARCHAR(255),
    created_at TIMESTAMP,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_note_garantie_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );


-- Create resultNote table
CREATE TABLE IF NOT EXISTS resultNote (
                                          resultNote_id BIGSERIAL PRIMARY KEY,
                                          reference_credit VARCHAR(255),
    status VARCHAR(255),
    final_note DECIMAL,
    created_at TIMESTAMP,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_result_note_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Create acte table
CREATE TABLE IF NOT EXISTS acte (
                                    acte_id BIGSERIAL PRIMARY KEY,
                                    reference_credit VARCHAR(255) NOT NULL,
    acte_url VARCHAR(255)
    );

-- Create appreciation table
CREATE TABLE IF NOT EXISTS appreciation (
                                            appreciation_id BIGSERIAL PRIMARY KEY,
                                            motif VARCHAR(255),
    montant_suggere DECIMAL,
    montant_demande DECIMAL,
    reference_credit VARCHAR(255),
    created_at TIMESTAMP,
    status VARCHAR(255),
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_appreciation_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Create confirmed_credit table
CREATE TABLE IF NOT EXISTS confirmed_credit (
                                                confirmed_credit_id BIGSERIAL PRIMARY KEY,
                                                montant DECIMAL,
                                                type_activite VARCHAR(255),
    reference_credit VARCHAR(255) NOT NULL,
    CONSTRAINT uk_confirmed_credit_reference UNIQUE (reference_credit)
    );



-- Populate roles table
INSERT INTO roles (role_uuid, name, authority) VALUES ('7d1b82b1-92c7-4fae-b790-73eb1ac9d6b5', 'USER', 'user:read,user:update,ticket:create,ticket:read,ticket:update,comment:create,comment:read,comment:update,comment:delete,task:read');
INSERT INTO roles (role_uuid, name, authority) VALUES ('1a0e13de-4fdf-4db0-8a3d-08fce64cbe8c', 'TECH_SUPPORT', 'user:read,user:update,ticket:create,ticket:read,ticket:update,comment:create,comment:read,comment:update,comment:delete,task:create,task:read,task:update,task:delete');
INSERT INTO roles (role_uuid, name, authority) VALUES ('894853e1-9238-4c64-b5d8-c0a29bdf1b94', 'MANAGER', 'user:create,user:read,user:update,ticket:create,ticket:read,ticket:update,ticket:delete,comment:create,comment:read,comment:update,comment:delete,task:create,task:read,task:update,task:delete');
INSERT INTO roles (role_uuid, name, authority) VALUES ('7f907494-90b0-4165-b2fd-00e04fb18b49', 'ADMIN', 'user:create,user:read,user:update,user:delete,ticket:create,ticket:read,ticket:update,ticket:delete,comment:create,comment:read,comment:update,comment:delete,task:create,task:read,task:update,task:delete');
INSERT INTO roles (role_uuid, name, authority) VALUES ('838ca5ee-eb15-427a-b380-6cf7bfbd68b7', 'SUPER_ADMIN', 'app:create,app:read,app:update,app:delete,user:create,user:read,user:update,user:delete,ticket:create,ticket:read,ticket:update,ticket:delete,comment:create,comment:read,comment:update,comment:delete,task:create,task:read,task:update,task:delete');

-- Populate priorities table
INSERT INTO priorities (priority, description) VALUES ('LOW', 'This is low priority');
INSERT INTO priorities (priority, description) VALUES ('MEDIUM', 'This is medium priority');
INSERT INTO priorities (priority, description) VALUES ('HIGH', 'This is high priority');

-- Populate statuses table
INSERT INTO statuses (status, description) VALUES ('NEW', 'This is new');
INSERT INTO statuses (status, description) VALUES ('IN PROGRESS', 'This is in progress');
INSERT INTO statuses (status, description) VALUES ('IN REVIEW', 'This is in review');
INSERT INTO statuses (status, description) VALUES ('COMPLETED', 'This is complete');
INSERT INTO statuses (status, description) VALUES ('IMPEDED', 'This is impeded');
INSERT INTO statuses (status, description) VALUES ('ASSIGNED', 'This is assigned');
INSERT INTO statuses (status, description) VALUES ('UNASSIGNED', 'This is unassigned');
INSERT INTO statuses (status, description) VALUES ('CLOSED', 'This is closed');
INSERT INTO statuses (status, description) VALUES ('PENDING', 'This is pending');

-- Populate types table
INSERT INTO types (type, description) VALUES ('BUG', 'This is a bug fix');
INSERT INTO types (type, description) VALUES ('DEFECT', 'This is a defect');
INSERT INTO types (type, description) VALUES ('INCIDENT', 'This is an incident');
INSERT INTO types (type, description) VALUES ('ENHANCEMENT', 'This is an enhancement');
INSERT INTO types (type, description) VALUES ('DESIGN', 'This is a design');




CALL create_user(
    '550e8400-e29b-41d4-a716-446655440000', -- p_user_uuid
    'Doukoure',                                  -- p_first_name
    'Salifou',                                   -- p_last_name
    'douklifsa93@gmail.com',                  -- p_email
    'admin',                               -- p_username
    '$2a$12$.Ij3d6B03dff0mRTiygaKe26oFXoKOeniewxdRgecM1PnNH1Dz2Jq',                           -- p_password
    '7c9e6679-7425-40de-944b-e07fc1f90ae7', -- p_credential_uuid
    '550e8400-e29b-41d4-a716-446655440000',                      -- p_token
    '778-8909-8655'                              -- p_member_id
);

---- Alter the missings column to table demande_credit

-- Add missing columns to demande_credit table
ALTER TABLE demande_credit
    ADD COLUMN delegation_id BIGINT REFERENCES public.delegation(id);

ALTER TABLE demande_credit
    ADD COLUMN agence_id BIGINT REFERENCES public.agence(id);

ALTER TABLE demande_credit
    ADD COLUMN point_vente_id BIGINT REFERENCES public.pointvente(id);


---- Add table personnecaution pour l'analyse Credit -----
CREATE TABLE IF NOT EXISTS personnecaution (
   personnecaution_id BIGSERIAL PRIMARY KEY,
   entreprise_id INTEGER REFERENCES entreprise(entreprise_id),
   nom VARCHAR(255),
    prenom VARCHAR(255),
    telephone VARCHAR(255),
    activite VARCHAR(255),
    age BIGINT,
    profession VARCHAR(255)
    );


-- Add missing columns to bilan_personnel table
ALTER TABLE bilan_personnel
    ADD COLUMN libele_garantie VARCHAR(255);

ALTER TABLE bilan_personnel
    ADD COLUMN montant_garantie DECIMAL(15, 2) DEFAULT 0;

-- Add user_id column to demande_credit tableas
ALTER TABLE demande_credit
    ADD COLUMN user_id BIGINT REFERENCES users(user_id);

ALTER TABLE compte_exploitation
    ADD COLUMN autres_revenus DECIMAL(15, 2) DEFAULT 0;



CREATE TABLE motif_analyses (
                                motif_analyse_id SERIAL PRIMARY KEY,
                                user_id INTEGER NOT NULL REFERENCES users(user_id),
                                demande_credit_id INTEGER NOT NULL REFERENCES demande_credit(demande_credit_id),
                                motif_date DATE NOT NULL DEFAULT CURRENT_DATE,
                                motif VARCHAR(500) NOT NULL  -- Consider if this should be required
);