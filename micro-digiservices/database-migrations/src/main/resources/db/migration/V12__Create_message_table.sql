CREATE TABLE IF NOT EXISTS messages (
    message_id BIGSERIAL PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    sender_id BIGINT NOT NULL
    );