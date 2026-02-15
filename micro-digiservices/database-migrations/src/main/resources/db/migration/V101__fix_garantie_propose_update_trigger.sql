-- Fix: trigger update_updated_at_column() references "updated_at" but column is "updatedat"
DROP TRIGGER IF EXISTS update_garantie_propose_updated_at ON garantie_propose;

CREATE OR REPLACE FUNCTION update_garantie_propose_updatedat()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedat = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_garantie_propose_updated_at
    BEFORE UPDATE ON garantie_propose
    FOR EACH ROW
    EXECUTE FUNCTION update_garantie_propose_updatedat();
