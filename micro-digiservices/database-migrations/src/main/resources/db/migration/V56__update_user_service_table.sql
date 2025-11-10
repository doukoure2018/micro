UPDATE users
SET
    service = 'DE',
    updated_at = CURRENT_TIMESTAMP
WHERE user_id IN (
    SELECT DISTINCT u.user_id
    FROM users u
             INNER JOIN user_roles ur ON u.user_id = ur.user_id
             INNER JOIN roles r ON ur.role_id = r.role_id
    WHERE r.name IN ('CAISSE', 'AGENT_CREDIT', 'DR', 'CORRECTEUR', 'AGENT', 'DA', 'RA')
);