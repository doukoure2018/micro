-- V124 : Credit Groupe Solidaire — tables d'extension de la demande individuelle.
-- Le groupe reutilise demandeindividuel (nature_client = 'Demande de credit Pour Groupe Solidaire')
-- et l'integralite du circuit AC -> DA -> DR -> DE -> DG avec l'echelle de delegation.
-- 7 types de groupe : CAS, CAS_R, CCS, CRS, CFE, MCK, ACM (proposition validee le 2026-08-27).
--
-- Regles metier :
--   * la somme des montants a percevoir des membres = montant_demande (blocage backend)
--   * le nombre de lignes membres = nombre_membres declare
--   * mandataire 1 + contact obligatoires
--   * champs PE (montant sollicite, base PE, versement mensuel PE) reserves au type CFE

-- ============= EXTENSION GROUPE DE LA DEMANDE =============
CREATE TABLE IF NOT EXISTS demande_groupe (
    demande_groupe_id       BIGSERIAL PRIMARY KEY,
    demandeindividuel_id    BIGINT NOT NULL
                            REFERENCES demandeindividuel(demandeindividuel_id) ON DELETE CASCADE,
    type_groupe             VARCHAR(10) NOT NULL
                            CHECK (type_groupe IN ('CAS', 'CAS_R', 'CCS', 'CRS', 'CFE', 'MCK', 'ACM')),
    nom_groupe              VARCHAR(150) NOT NULL,
    date_adhesion           DATE,
    district_quartier       VARCHAR(150),
    secteur                 VARCHAR(150),
    mandataire1             VARCHAR(150) NOT NULL,
    contact_mandataire1     VARCHAR(30)  NOT NULL,
    mandataire2             VARCHAR(150),
    contact_mandataire2     VARCHAR(30),
    nombre_membres          INTEGER NOT NULL CHECK (nombre_membres > 0),
    numero_demande          VARCHAR(20) UNIQUE,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP,
    CONSTRAINT uq_demande_groupe_demande UNIQUE (demandeindividuel_id)
);

CREATE INDEX IF NOT EXISTS idx_demande_groupe_demande
    ON demande_groupe(demandeindividuel_id);

COMMENT ON TABLE demande_groupe IS
'Extension 1-1 de demandeindividuel pour la nature Groupe Solidaire : identification du groupe, mandataires, type (CAS/CAS_R/CCS/CRS/CFE/MCK/ACM). La cascade activites et les modalites du pret restent sur la demande socle.';
COMMENT ON COLUMN demande_groupe.numero_demande IS
'Numero de demande groupe incremental formate GRP-AAAA-NNNNN (sequence numero_demande_groupe_seq, genere par le backend).';

-- ============= MEMBRES DU GROUPE =============
CREATE TABLE IF NOT EXISTS membre_groupe (
    membre_groupe_id        BIGSERIAL PRIMARY KEY,
    demandeindividuel_id    BIGINT NOT NULL
                            REFERENCES demandeindividuel(demandeindividuel_id) ON DELETE CASCADE,
    numero_membre           VARCHAR(30) NOT NULL,
    nom_prenom              VARCHAR(150) NOT NULL,
    montant_percevoir       NUMERIC(15,2) NOT NULL CHECK (montant_percevoir > 0),
    -- Champs specifiques CFE (Plan Epargne)
    montant_sollicite       NUMERIC(15,2) CHECK (montant_sollicite IS NULL OR montant_sollicite >= 0),
    montant_base_pe         NUMERIC(15,2) CHECK (montant_base_pe IS NULL OR montant_base_pe >= 0),
    versement_mensuel_pe    NUMERIC(15,2) CHECK (versement_mensuel_pe IS NULL OR versement_mensuel_pe >= 0),
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_membre_groupe_demande
    ON membre_groupe(demandeindividuel_id);

COMMENT ON TABLE membre_groupe IS
'Membres d''une demande de credit groupe solidaire. Contrainte metier (backend) : SUM(montant_percevoir) = montant_demande de la demande socle et COUNT(*) = demande_groupe.nombre_membres. Champs PE renseignes uniquement pour le type CFE.';

-- ============= SEQUENCE DU NUMERO DE DEMANDE GROUPE =============
CREATE SEQUENCE IF NOT EXISTS numero_demande_groupe_seq START WITH 1;
