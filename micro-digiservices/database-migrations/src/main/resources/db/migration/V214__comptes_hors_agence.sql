-- =====================================================================================
-- V214 : comptes ouverts hors de l'agence du client — lot 1, détection et alerte (DSIG, 17/11/2026)
-- =====================================================================================
--
-- Dans SAF2000 les trois premiers chiffres du numéro de membre donnent l'agence du client :
-- le membre 33600023271 est de l'agence 336. Un compte dont COD_AGENCIA n'est pas ces trois
-- chiffres a été ouvert ailleurs. L'usager qui l'a ouvert est connu (COD_USUARIO), et son
-- agence aussi quand les trois derniers caractères de son code désignent une agence existante
-- (KCHERIF334 → 334).
--
-- Troisième surveillance du même moule que les crédits négatifs (V177) et les comptes de
-- remboursement mal adossés (V196) : lecture horaire de la PRODUCTION, journal des cas connus
-- pour ne signaler que le nouveau, preuve figée à la fermeture, mêmes destinataires (porteurs
-- de la rubrique CREDITS_NEGATIFS, décision du 31/10/2026 étendue le 17/11/2026).
--
-- Mesure du 17/11/2026 avec le script DSIG : 10 comptes, tous fermés ou transférés, aucun actif.
-- L'alerte sert à tenir ce zéro : chaque compte ouvert hors agence sera connu dans l'heure.

CREATE TABLE IF NOT EXISTS compte_hors_agence (
    id                     BIGSERIAL     PRIMARY KEY,
    -- Le compte (identifiants SAF, pas de FK possible)
    num_cuenta             VARCHAR(40)   NOT NULL,
    type_compte            VARCHAR(5),              -- positions 4 à 6 du numéro ; NULL si illisible
    intitule               VARCHAR(150),            -- NOM_CHEQUERA
    cod_cliente            VARCHAR(20),
    nom_cliente            VARCHAR(150),
    agence_client          VARCHAR(5),              -- 3 premiers chiffres du numéro de membre
    agence_client_fiche    VARCHAR(5),              -- CL.CL_CLIENTES.COD_AGENCIA, telle que lue
    agence_compte          VARCHAR(5)    NOT NULL,
    des_agence_compte      VARCHAR(100),
    -- À qui l'ouverture est imputable : c'est ce qui la rend corrigeable
    cree_par               VARCHAR(40),             -- COD_USUARIO
    nom_cree_par           VARCHAR(150),
    agence_agent           VARCHAR(5),              -- NULL = inconnue (administrateur, siège)
    situation              VARCHAR(30)   NOT NULL,
    date_ouverture         DATE,
    etat_compte            VARCHAR(5),              -- A actif ; autre = fermé, bloqué, transféré
    solde                  NUMERIC(20,2),
    -- Vie de la ligne
    detecte_at             TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dernier_vu_at          TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situation_changee_at   TIMESTAMPTZ,             -- la situation a changé depuis la détection
    signale_at             TIMESTAMPTZ,             -- quand le courriel est parti ; NULL = jamais signalé
    corrige_at             TIMESTAMPTZ,             -- disparu de la liste SAF
    fermeture_motif        VARCHAR(20),             -- CORRIGE : plus hors agence ; TRANSFERT : la fiche client a rejoint le compte
    -- La preuve de ce qu'était le compte au moment de la fermeture. Écrite UNE fois, jamais
    -- réécrite (leçon de V193 sur les crédits négatifs).
    etat_a_la_correction   VARCHAR(5),
    agence_a_la_correction VARCHAR(5),
    -- Suivi côté DSIG (lot 2) : digi ne corrige pas SAF, il note qui s'en occupe
    traite_par_user_id     BIGINT        REFERENCES users(user_id),
    traite_at              TIMESTAMPTZ,
    commentaire            VARCHAR(500),
    -- Relance (lot 3, même règle que V199)
    derniere_relance_at    TIMESTAMPTZ,
    nb_relances            INTEGER       NOT NULL DEFAULT 0,
    -- Vérification à la demande (lot 3, même règle que V203)
    verifie_saf_at         TIMESTAMPTZ,
    verification_conclusion VARCHAR(30),
    CONSTRAINT chk_cha_situation CHECK (situation IN
        ('AGENT_CHEZ_LUI', 'AGENT_DU_CLIENT', 'TROIS_AGENCES', 'AGENT_SANS_AGENCE'))
);

-- Une seule ligne ouverte par compte : la clé de rapprochement entre deux passages.
CREATE UNIQUE INDEX IF NOT EXISTS uq_compte_hors_agence_ouvert
    ON compte_hors_agence (num_cuenta) WHERE corrige_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_compte_hors_agence_situation
    ON compte_hors_agence (situation) WHERE corrige_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_compte_hors_agence_cree_par
    ON compte_hors_agence (cree_par) WHERE corrige_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_compte_hors_agence_detecte
    ON compte_hors_agence (detecte_at DESC);

COMMENT ON TABLE compte_hors_agence IS
'Comptes SAF ouverts dans une agence differente de celle du client (3 premiers chiffres du numero de membre), avec l''usager qui les a ouverts. Journal des cas connus, pour que l''alerte ne signale que le nouveau. Lecture seule sur SAF : digi n''y ecrit jamais.';
COMMENT ON COLUMN compte_hors_agence.situation IS
'AGENT_CHEZ_LUI : l''agent a ouvert le compte dans son propre point de service pour un client d''une autre agence. AGENT_DU_CLIENT : l''agent est de l''agence du client mais le compte est ouvert ailleurs. TROIS_AGENCES : agent, compte et client dans trois agences differentes. AGENT_SANS_AGENCE : usager sans agence (administrateur, siege).';
COMMENT ON COLUMN compte_hors_agence.fermeture_motif IS
'CORRIGE : le compte n''est plus hors agence ou n''existe plus. TRANSFERT : l''agence de la fiche client est devenue celle du compte, le client a ete transfere et le compte est a sa place. NULL sur les lignes encore ouvertes.';
COMMENT ON COLUMN compte_hors_agence.etat_a_la_correction IS
'L''etat du compte au moment de la fermeture de la ligne, fige une fois pour toutes.';
