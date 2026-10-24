-- =====================================================================================
-- V173 : contacts des agents, lot 2 — saisie par le directeur d'agence (DSIG, 24/10/2026)
-- =====================================================================================
--
-- Le lot 1 (V172) permet a chaque agent de corriger lui-meme son adresse et son numero,
-- code de verification a l'appui. Reste ceux qui n'y arrivent pas : le directeur d'agence
-- les a au telephone ou en face de lui, et peut saisir le contact a leur place.
--
-- Une saisie par le directeur n'est PAS une verification : personne n'a prouve que la
-- boite existe. Elle est donc enregistree comme telle — qui l'a saisie, et quand — et
-- l'agent reste invite a la confirmer par un code a sa prochaine connexion. C'est ce qui
-- distingue « un contact connu » de « un contact qui repond ».

ALTER TABLE users ADD COLUMN IF NOT EXISTS email_saisi_par_user_id BIGINT REFERENCES users(user_id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_saisi_at          TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_saisi_par_user_id BIGINT REFERENCES users(user_id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_saisi_at          TIMESTAMPTZ;

COMMENT ON COLUMN users.email_saisi_par_user_id IS
'Directeur d''agence (ou DSIG) qui a saisi cette adresse a la place de l''agent (V173). Tant que email_verifie_at est NULL, le contact est connu mais non prouve : l''agent est invite a le confirmer par un code.';
COMMENT ON COLUMN users.phone_saisi_par_user_id IS
'Meme regle que email_saisi_par_user_id, pour le numero de telephone.';

-- Le suivi du directeur et de la Direction de l'exploitation lit ces colonnes par agence
-- et par delegation : l'index sert ces deux decomptes.
CREATE INDEX IF NOT EXISTS idx_users_contacts_suivi
    ON users (agence_id, delegation_id)
    WHERE enabled;
