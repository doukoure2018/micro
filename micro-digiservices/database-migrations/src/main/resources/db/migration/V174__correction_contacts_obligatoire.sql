-- =====================================================================================
-- V174 : correction des contacts rendue obligatoire (DSIG, 24/10/2026)
-- =====================================================================================
--
-- Decision de la DSIG du 24/10/2026, qui revient sur l'arbitrage « bandeau non bloquant »
-- de la proposition : pour les 36 comptes dont l'adresse a ete constatee en echec, la
-- correction ne peut plus attendre. Ces agents se connectent tous les jours — 33 d'entre
-- eux entre le 16 et le 24 octobre — mais aucune alerte, aucune synthese du matin, aucun
-- etat TT1 ne leur parvient.
--
-- A leur prochaine connexion, ces comptes sont donc conduits a la page « Mon profil » et
-- n'en sortent qu'une fois leur adresse ET leur numero verifies par un code. Les autres
-- comptes du reseau ne sont pas concernes : 428 d'entre eux n'ont pas de numero, les
-- bloquer tous arreterait le travail de toute la Guinee.
--
-- Le marqueur est leve automatiquement des que les deux contacts sont prouves (V172).

ALTER TABLE users ADD COLUMN IF NOT EXISTS contacts_a_corriger BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN users.contacts_a_corriger IS
'Le compte doit corriger son adresse ET son numero avant de pouvoir travailler (V174). Pose sur les comptes dont l''adresse a ete constatee en echec ; leve des que email_verifie_at et phone_verifie_at sont tous deux renseignes.';

-- Les comptes concernes sont exactement ceux que la V171 a marques en echec.
UPDATE users
   SET contacts_a_corriger = TRUE
 WHERE email_en_echec
   AND NOT contacts_a_corriger;

-- Un compte qui aurait deja tout verifie n'a rien a corriger.
UPDATE users
   SET contacts_a_corriger = FALSE
 WHERE contacts_a_corriger
   AND email_verifie_at IS NOT NULL
   AND phone_verifie_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_contacts_a_corriger
    ON users (contacts_a_corriger) WHERE contacts_a_corriger;
