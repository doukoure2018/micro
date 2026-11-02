-- =====================================================================================
-- V198 : la synthèse hebdomadaire de direction (DSIG, 02/11/2026) — lot 1
-- =====================================================================================
--
-- Un courriel le lundi matin, en cinq blocs : situation des crédits, niveau du portefeuille
-- du réseau, portefeuille à risque par tranche, évolution de l'assainissement, évolution du
-- suivi des arrêtés de caisse. Pour le Directeur Général, toute l'équipe de la Direction de
-- l'Exploitation, le responsable de la DSIG et l'équipe opérationnelle de la DSIG
-- (décisions du 02/11/2026).
--
-- Aucune adresse n'est écrite ici ni dans le code : les destinataires se déduisent des rôles
-- et des départements de la matrice d'habilitations. Un arrivant dans l'une de ces équipes
-- reçoit la synthèse sans intervention, un partant cesse de la recevoir le jour où son compte
-- est désactivé.

INSERT INTO habilitation_rubrique (code, libelle, famille, ordre, actif)
VALUES ('SYNTHESE_DIRECTION', 'Synthese hebdomadaire de direction', 'Pilotage', 10, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Par rôle : la direction générale et la Direction de l'Exploitation. Ces comptes n'ont aucun
-- département — la matrice ne couvre aujourd'hui que les services DSIG et Audit — et c'est
-- précisément pourquoi la résolution des destinataires de ce courriel honore les deux sources
-- de droits, rôle ET département, comme le fait le reste de la plateforme.
INSERT INTO habilitation_role_rubrique (role, service, rubrique_code) VALUES
    ('DG',      '*',  'SYNTHESE_DIRECTION'),
    ('MANAGER', 'DE', 'SYNTHESE_DIRECTION')
ON CONFLICT DO NOTHING;

-- Par département : l'équipe opérationnelle de la DSIG. Le responsable du service porte
-- « tout voir » et reçoit donc la synthèse sans qu'on l'inscrive ici.
INSERT INTO habilitation_departement_rubrique (departement_id, rubrique_code)
SELECT d.id, 'SYNTHESE_DIRECTION'
  FROM habilitation_departement d
 WHERE d.service = 'DSIG' AND d.code = 'OPERATIONNEL'
ON CONFLICT DO NOTHING;

-- =====================================================================================
-- La photo hebdomadaire
-- =====================================================================================
--
-- Une ligne par lundi, qui garde les chiffres de chaque bloc TELS QU'ILS ONT ÉTÉ ENVOYÉS.
-- Elle sert à trois choses à la fois :
--   1. calculer la variation la semaine suivante — c'est elle qui donne « contre 7,4 % la
--      semaine dernière », sans quoi un courriel de direction n'apprend rien ;
--   2. relire une synthèse passée sans la recalculer ;
--   3. prouver ce qui a été dit à la direction un lundi donné — une synthèse recalculée après
--      coup ne redonne jamais le même chiffre, puisque les données ont bougé entre-temps.
--
-- C'est aussi elle qui rendra exacte, dès le deuxième lundi, la variation des deux mesures
-- qu'aucun historique ne porte aujourd'hui : les arrêtés de caisse et les refus de dossiers.

CREATE TABLE IF NOT EXISTS direction_synthese_semaine (
    id                   BIGSERIAL     PRIMARY KEY,
    semaine_du           DATE          NOT NULL UNIQUE,   -- le lundi de la semaine décrite
    semaine_au           DATE          NOT NULL,          -- le dimanche

    -- Bloc 1 : situation des crédits. Le stock est exact ; parmi les flux, les refus ne sont
    -- PAS mesurables à la semaine (voir le commentaire de dem_refuse ci-dessous).
    dem_recu             INTEGER,
    dem_instruction      INTEGER,
    dem_accorde          INTEGER,
    dem_refuse           INTEGER,
    dem_annule           INTEGER,
    dem_nouveaux_semaine INTEGER,
    dem_accordes_semaine INTEGER,
    dem_annules_semaine  INTEGER,

    -- Bloc 2 : niveau du portefeuille du réseau, lu dans la photo quotidienne du portefeuille
    -- à risque. pf_date_photo dit de quel jour datent ces chiffres : la photo lit la sauvegarde
    -- SAF restaurée vers 07h15, donc le lundi elle décrit le samedi soir.
    pf_date_photo        DATE,
    pf_credits           INTEGER,
    pf_encours           NUMERIC(20,2),
    pf_nb_retard         INTEGER,
    pf_impaye            NUMERIC(20,2),
    pf_contentieux       INTEGER,

    -- Bloc 3 : portefeuille à risque par tranche
    par30_encours        NUMERIC(20,2),
    par30_nb             INTEGER,
    par60_encours        NUMERIC(20,2),
    par60_nb             INTEGER,
    par90_encours        NUMERIC(20,2),
    par90_nb             INTEGER,
    par120_encours       NUMERIC(20,2),
    par120_nb            INTEGER,

    -- Bloc 4 : assainissement des fiches clients
    ass_en_attente       INTEGER,
    ass_valide           INTEGER,
    ass_rejete           INTEGER,
    ass_valide_semaine   INTEGER,
    ass_rejete_semaine   INTEGER,

    -- Bloc 5 : suivi des arrêtés de caisse, au dernier jour ouvré toléré
    arr_date_limite      DATE,
    arr_a_jour           INTEGER,
    arr_a_valider        INTEGER,
    arr_en_retard        INTEGER,
    arr_jamais_remonte   INTEGER,
    arr_retard_moyen     NUMERIC(6,1),

    -- Vie de la ligne
    envoye_at            TIMESTAMPTZ,
    nb_destinataires     INTEGER,
    essai                BOOLEAN       NOT NULL DEFAULT FALSE,
    calcule_at           TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_direction_synthese_semaine ON direction_synthese_semaine (semaine_du DESC);

COMMENT ON TABLE direction_synthese_semaine IS
'Une ligne par lundi : les chiffres de la synthese hebdomadaire de direction tels qu''ils ont ete envoyes. Sert a la variation de la semaine suivante, a la relecture, et de preuve de ce qui a ete annonce.';
COMMENT ON COLUMN direction_synthese_semaine.dem_refuse IS
'STOCK des dossiers refuses, exact. Le FLUX hebdomadaire des refus n''est pas mesurable : le journal des etats ne porte que 6 refus depuis le 19/09/2026 alors que le stock en compte 237, les sorties passant par une voie non journalisee. La variation de ce stock d''un lundi a l''autre est donc la seule mesure honnete du flux, et elle est disponible des le deuxieme envoi.';
COMMENT ON COLUMN direction_synthese_semaine.ass_valide_semaine IS
'Fiches passees a VALIDE dans la semaine, datees par personne_physique.updated_at faute de date de changement de statut. Mesure verifiee le 02/11/2026 : 22 fiches sur 1 331 en attente ont ete modifiees apres leur creation, contre 13 408 sur 15 655 validees — c''est donc bien la decision de correction qui met cette date a jour.';
COMMENT ON COLUMN direction_synthese_semaine.essai IS
'VRAI pour un envoi d''essai adresse a son seul demandeur : la ligne ne sert alors ni de reference de variation ni de preuve.';
