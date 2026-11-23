-- =====================================================================================
-- V220 : suivi de correction des variations d'ecart (lot 2 de « Variations des ecarts »)
-- Demande DSIG du 2026-11-23 : identifier la variation, trouver le compte, CORRIGER
-- =====================================================================================
--
-- Une variation identifiee mais jamais prise n'est qu'un chiffre de plus. Cette table porte
-- une prise en charge par couple (point de service, compte comptable) : qui regarde, ce qu'il a
-- trouve, si la regularisation est passee dans SAF, et — le point qui compte — si la photo
-- suivante le CONFIRME. Personne ne ferme une fiche a la main sur la foi d'une ecriture : c'est
-- la photo qui ferme (etat CONFIRMEE pose par le serveur a la reception d'une photo).
--
-- Une seule fiche VIVANTE par couple (index partiel) : une nouvelle variation sur un couple deja
-- suivi s'ajoute a la fiche existante au lieu d'en ouvrir une autre. Une fiche confirmee reste
-- dans l'historique ; le couple peut en rouvrir une.
--
-- digi n'ecrit rien dans SAF : il note.

CREATE TABLE IF NOT EXISTS rapprochement_variation_suivi (
    id                 BIGSERIAL     PRIMARY KEY,
    module             VARCHAR(10)   NOT NULL CHECK (module IN ('COMPTES', 'CREDITS', 'DAT')),
    cod_agencia        VARCHAR(5)    NOT NULL,
    libelle_point      VARCHAR(150),
    compte_comptable   VARCHAR(200)  NOT NULL,

    -- La variation telle qu'elle a ete constatee : photo lue, photo de reference, les deux ecarts.
    jour_constat       DATE          NOT NULL,
    jour_reference     DATE          NOT NULL,
    ecart_reference    NUMERIC(20,2),            -- l'ecart AVANT la variation : la cible du retour
    ecart_constat      NUMERIC(20,2),            -- l'ecart du jour du constat
    variation          NUMERIC(20,2) NOT NULL,

    -- A_INSTRUIRE : quelqu'un regarde. EXPLIQUEE : la cause est connue, la correction reste a
    -- passer. CORRIGEE_SAF : la regularisation est passee, la photo suivante doit le montrer.
    -- CONFIRMEE : l'ecart est revenu au niveau d'avant la variation, ou a zero (pose par le
    -- serveur). STRUCTUREL : ecart connu et documente, accepte par la Direction financiere.
    etat               VARCHAR(20)   NOT NULL DEFAULT 'A_INSTRUIRE'
                       CHECK (etat IN ('A_INSTRUIRE', 'EXPLIQUEE', 'CORRIGEE_SAF', 'CONFIRMEE', 'STRUCTUREL')),
    explication        VARCHAR(1000),
    type_operation     VARCHAR(120),             -- la famille d'operation en cause, en clair
    reference_ecriture VARCHAR(120),             -- numero d'ecriture SAF de la regularisation

    cree_par           BIGINT        REFERENCES users(user_id),
    cree_le            TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modifie_par        BIGINT        REFERENCES users(user_id),
    modifie_le         TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- La verification par la photo.
    corrigee_le        TIMESTAMPTZ,              -- quand la fiche est passee CORRIGEE_SAF
    jour_dernier       DATE,                     -- derniere photo qui a verifie la fiche
    ecart_dernier      NUMERIC(20,2),            -- l'ecart du couple dans cette photo
    photos_sans_effet  SMALLINT      NOT NULL DEFAULT 0,
    confirmee_le       TIMESTAMPTZ,
    jour_confirmation  DATE
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_variation_suivi_vivante
    ON rapprochement_variation_suivi (module, cod_agencia, compte_comptable)
    WHERE etat <> 'CONFIRMEE';
CREATE INDEX IF NOT EXISTS idx_variation_suivi_etat
    ON rapprochement_variation_suivi (module, etat);

COMMENT ON TABLE rapprochement_variation_suivi IS
    'V220 : prise en charge d''une variation d''ecart par (module, point de service, compte comptable) ; une fiche vivante par couple ; CONFIRMEE est pose par la photo suivante, jamais a la main';

-- Le journal de la fiche : chaque changement d'etat, avec qui et pourquoi. La confirmation par
-- la photo y figure comme les autres, auteur « photo du <jour> ».
CREATE TABLE IF NOT EXISTS rapprochement_variation_suivi_evenement (
    id             BIGSERIAL    PRIMARY KEY,
    suivi_id       BIGINT       NOT NULL REFERENCES rapprochement_variation_suivi(id) ON DELETE CASCADE,
    etat           VARCHAR(20)  NOT NULL,
    commentaire    VARCHAR(1000),
    auteur_user_id BIGINT       REFERENCES users(user_id),
    auteur         VARCHAR(150) NOT NULL,
    survenu_le     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_variation_suivi_evenement_suivi
    ON rapprochement_variation_suivi_evenement (suivi_id, survenu_le);

-- -------------------------------------------------------------------------------------
-- Qui ecrit : une rubrique propre, SUIVI_ECARTS.
-- -------------------------------------------------------------------------------------
-- La lecture de l'ecran reste EVOLUTION_ECARTS (ou AUDIT_CAISSE). L'ecriture du suivi va a ceux
-- qui instruisent et corrigent : le departement operationnel de la DSIG et la comptabilite
-- (Direction financiere). L'Audit lit et n'ecrit rien (V194), la DG et la DE lisent.
INSERT INTO habilitation_rubrique (code, libelle, famille, ordre) VALUES
    ('SUIVI_ECARTS', 'Suivi de correction des ecarts de rapprochement', 'SAF et rapprochement', 36)
ON CONFLICT (code) DO NOTHING;

INSERT INTO habilitation_role_rubrique (role, service, rubrique_code) VALUES
    ('SUPER_ADMIN', '*',  'SUIVI_ECARTS'),
    ('MANAGER',     'DF', 'SUIVI_ECARTS'),
    -- La Direction financiere doit VOIR l'ecran pour y corriger : V218 l'avait laissee de cote
    -- (hors de la liste demandee) ; le suivi de correction la rend necessaire.
    ('MANAGER',     'DF', 'EVOLUTION_ECARTS')
ON CONFLICT DO NOTHING;

INSERT INTO habilitation_departement_rubrique (departement_id, rubrique_code)
SELECT d.id, 'SUIVI_ECARTS'
  FROM habilitation_departement d
 WHERE d.service = 'DSIG'
   AND d.code IN ('OPERATIONNEL', 'RESPONSABLE')
ON CONFLICT DO NOTHING;
