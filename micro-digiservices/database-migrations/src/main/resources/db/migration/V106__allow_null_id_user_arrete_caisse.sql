-- Allow null id_user in arrete_caisse for public form submissions without user identification
ALTER TABLE arrete_caisse ALTER COLUMN id_user DROP NOT NULL;
