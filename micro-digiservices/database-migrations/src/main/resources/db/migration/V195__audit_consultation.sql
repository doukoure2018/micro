-- =====================================================================================
-- V195 : la trace des consultations de l'Audit (DSIG, 30/10/2026) — lot 3
-- =====================================================================================
--
-- L'Audit lit tout le réseau en lecture seule : les dossiers de crédit avec leurs pièces, le
-- dossier SAF d'un crédit, les comptes et leurs journaux. Un service qui voit tout doit lui
-- aussi pouvoir rendre compte de ce qu'il a regardé — c'est ce qui protège les auditeurs
-- autant que les audités.
--
-- Cette table enregistre les consultations SENSIBLES et elles seules : l'écran des comptes et
-- de leurs habilitations, et chaque export de liste. Tracer chaque clic noierait le journal et
-- ne dirait plus rien (arbitrage 4 de la proposition du 30/10/2026).
--
-- Le dossier SAF d'un crédit n'y figure pas encore : il est servi par ebanking, qui ne parle
-- qu'aux bases SAF et n'a aucun accès à celle-ci. L'y ajouter demande d'ouvrir une source
-- Postgres dans ce service — à faire quand l'Audit en aura l'usage, pas avant.
--
-- Elle est la huitième source du journal unifié des actions sensibles, à côté des sept
-- journaux que la plateforme tenait déjà.

CREATE TABLE IF NOT EXISTS audit_consultation (
    id                BIGSERIAL    PRIMARY KEY,
    user_id           BIGINT       NOT NULL REFERENCES users(user_id),
    par_nom           VARCHAR(200),
    par_service       VARCHAR(60),
    ecran             VARCHAR(60)  NOT NULL,   -- COMPTES, EXPORT_…
    objet             VARCHAR(160),            -- le crédit, le compte, la liste consultée
    detail            VARCHAR(300),
    date_consultation TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_consultation_date ON audit_consultation (date_consultation DESC);
CREATE INDEX IF NOT EXISTS idx_audit_consultation_user ON audit_consultation (user_id, date_consultation DESC);

COMMENT ON TABLE audit_consultation IS
'Trace des consultations sensibles : qui a ouvert l''ecran des comptes ou exporte une liste, et quand. Seules les consultations sensibles y figurent — tracer chaque clic noierait le journal.';
COMMENT ON COLUMN audit_consultation.ecran IS
'COMPTES : l''ecran des comptes et habilitations. EXPORT_* : un export de liste, le suffixe nommant la liste (ACTIONS, DECISIONS, ANNULATIONS, NUMEROS_MEMBRE, COMPTES, DELAIS).';
