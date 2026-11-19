-- =====================================================================================
-- V216 : annulation d'un dossier de crédit à TOUTE étape, par TOUT rôle du circuit
-- Demande DSIG du 2026-11-19 (« le bouton ne s'affiche pas dans tous les détails »)
-- Proposition : https://claude.ai/artifact/639Xx8XQyXVXL5JJ8QLZXc
-- =====================================================================================
--
-- La V163 (2026-10-15) a créé le mécanisme pour un seul cas : l'agent de crédit affecté
-- demande, son DA tranche. Le bouton exigeait donc quatre conditions (rôle AGENT_CREDIT,
-- agent affecté, statut EN_ATTENTE, l'une de onze étapes) et n'existait pour personne
-- d'autre : ni pour le DA, le DR, la DE, la DG ou la DSIG, ni à l'accueil, ni sur
-- l'ancienne étape VALIDATION, ni après l'approbation finale même avant mise en place.
--
-- RÈGLE UNIQUE désormais : celui qui TIENT le dossier à son étape l'annule directement ;
-- tout autre acteur du dossier en DEMANDE l'annulation, et c'est le tenant qui tranche.
--   accueil et agent et APPROVED -> le DA ; VALIDATED_DA -> le DR ; VALIDATED_DR et
--   VALIDATED_FINAL non mis en place -> la DE ; PENDING_DG -> la DG ; la DSIG partout.
-- La règle vit dans le code (AnnulationDossier.java) et dans ses tests ; la base ne porte
-- que les colonnes qui en gardent la trace. AUCUNE NOUVELLE ÉTAPE : la contrainte
-- chk_validation_state n'est pas touchée.

-- -------------------------------------------------------------------------------------
-- 0. L'ancienne étape VALIDATION entre dans la contrainte (arbitrage 7)
-- -------------------------------------------------------------------------------------
-- Vingt-trois dossiers portent l'étape « VALIDATION », d'avant la V115, absente de
-- chk_validation_state. La contrainte est NOT VALID mais Postgres la revérifie à CHAQUE
-- UPDATE de la ligne : la V181 avait dû les laisser de côté, et le premier déploiement de
-- cette V216 a échoué sur le dossier 15 (REJET / VALIDATION) à la reprise du § 3. Comme la
-- règle d'annulation tient VALIDATION pour une étape de l'agent, ces dossiers doivent
-- pouvoir être mis à jour : la liste complète est reprise (V115, V119, V163) + VALIDATION.
ALTER TABLE demandeindividuel DROP CONSTRAINT IF EXISTS chk_validation_state;
ALTER TABLE demandeindividuel ADD CONSTRAINT chk_validation_state
    CHECK (validation_state IS NULL OR validation_state IN (
        'NOUVEAU', 'SELECTION', 'APPROVED',
        'VALIDATED_DA', 'VALIDATED_DR',
        'PENDING_DG', 'VALIDATED_FINAL',
        'CORRECTION', 'CORRECTION_DR', 'CORRECTION_DE',
        'RETOUR_AGENT', 'REJETE_DG',
        'EN_ATTENTE_DA', 'CORRECTION_ACCUEIL', 'AFFECTEE',
        'ANNULATION_DEMANDEE',
        'VALIDATION'
    )) NOT VALID;

-- -------------------------------------------------------------------------------------
-- 1. Trace du mode et du rôle décideur, identité du demandeur, réouverture
-- -------------------------------------------------------------------------------------
ALTER TABLE demandeindividuel
    -- DIRECTE : le tenant a annulé sur-le-champ ; DEMANDEE : demande puis décision du
    -- tenant ; HISTORIQUE_SANS_TRACE : sorti avant la V163 par PATCH /ecredit/update,
    -- sans motif ni auteur (238 dossiers le 2026-10-15), marqué ici une fois pour toutes.
    ADD COLUMN IF NOT EXISTS annulation_dossier_mode               VARCHAR(30),
    -- Rôle de celui qui a décidé : DA, DR, DE, DG ou DSIG.
    ADD COLUMN IF NOT EXISTS annulation_dossier_role               VARCHAR(30),
    -- Le demandeur était jusqu'ici un nom affichable ; la notification de la décision a
    -- besoin de son identifiant.
    ADD COLUMN IF NOT EXISTS annulation_dossier_demandee_par_id    BIGINT,
    -- Réouverture par le tenant, dans les trente jours (arbitrage 4 de la proposition).
    ADD COLUMN IF NOT EXISTS date_reouverture_dossier              TIMESTAMP,
    ADD COLUMN IF NOT EXISTS reouverture_dossier_par               VARCHAR(255),
    ADD COLUMN IF NOT EXISTS reouverture_dossier_motif             TEXT;

COMMENT ON COLUMN demandeindividuel.annulation_dossier_mode IS
    'V216 : DIRECTE (le tenant de l''étape a annulé), DEMANDEE (demande tranchée par le tenant), HISTORIQUE_SANS_TRACE (sortie d''avant V163, sans motif ni auteur)';
COMMENT ON COLUMN demandeindividuel.annulation_dossier_role IS
    'V216 : rôle du décideur de l''annulation : DA, DR, DE, DG ou DSIG';

ALTER TABLE demandeindividuel DROP CONSTRAINT IF EXISTS chk_annulation_dossier_mode;
ALTER TABLE demandeindividuel ADD CONSTRAINT chk_annulation_dossier_mode
    CHECK (annulation_dossier_mode IS NULL OR annulation_dossier_mode IN (
        'DIRECTE', 'DEMANDEE', 'HISTORIQUE_SANS_TRACE'
    )) NOT VALID;

-- -------------------------------------------------------------------------------------
-- 2. Deux motifs de plus (arbitrage 6) : la liste complète est reprise, comme en V163
-- -------------------------------------------------------------------------------------
ALTER TABLE demandeindividuel DROP CONSTRAINT IF EXISTS chk_annulation_dossier_motif_code;
ALTER TABLE demandeindividuel ADD CONSTRAINT chk_annulation_dossier_motif_code
    CHECK (annulation_dossier_motif_code IS NULL OR annulation_dossier_motif_code IN (
        'DESISTEMENT_CLIENT', 'CLIENT_INJOIGNABLE', 'DOUBLE_SAISIE', 'ERREUR_SAISIE',
        'DOSSIER_INCOMPLET_ABANDONNE', 'CHANGEMENT_DE_PRODUIT', 'AUTRE'
    )) NOT VALID;

COMMENT ON COLUMN demandeindividuel.annulation_dossier_motif_code IS
    'V163/V216 : DESISTEMENT_CLIENT, CLIENT_INJOIGNABLE, DOUBLE_SAISIE, ERREUR_SAISIE, DOSSIER_INCOMPLET_ABANDONNE, CHANGEMENT_DE_PRODUIT, AUTRE';

-- -------------------------------------------------------------------------------------
-- 3. Reprise de l'existant
-- -------------------------------------------------------------------------------------
-- Les annulations de la V163 : toutes demandées par un agent et décidées par un DA.
UPDATE demandeindividuel
   SET annulation_dossier_mode = 'DEMANDEE',
       annulation_dossier_role = 'DA'
 WHERE statut_demande = 'ANNULE'
   AND annulation_dossier_mode IS NULL;

-- Les sorties d'avant la V163 : statut REJET posé par PATCH /ecredit/update, sans garde,
-- sans motif, sans auteur. On ne reconstitue rien, on marque pour que l'audit les
-- distingue à jamais des annulations tracées.
UPDATE demandeindividuel
   SET annulation_dossier_mode = 'HISTORIQUE_SANS_TRACE'
 WHERE statut_demande IN ('REJET', 'REJECTED')
   AND annulation_dossier_mode IS NULL
   AND annulation_dossier_decidee_par IS NULL;

-- -------------------------------------------------------------------------------------
-- 4. La file des décideurs : DA par agence, DR par délégation, DE et DG sur tout le réseau
-- -------------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_demandeind_annulation_a_decider
    ON demandeindividuel (etat_avant_annulation, delegation, agence, demandeindividuel_id)
    WHERE validation_state = 'ANNULATION_DEMANDEE';
