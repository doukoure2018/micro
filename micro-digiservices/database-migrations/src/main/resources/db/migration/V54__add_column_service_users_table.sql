ALTER TABLE users
    ADD COLUMN service VARCHAR(100) DEFAULT NULL::CHARACTER VARYING;

-- Add comment to document the column
COMMENT ON COLUMN users.service IS 'Service information for the user';