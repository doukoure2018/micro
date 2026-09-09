-- V134 : phase 3 du chantier Congés & Présences DRH — permission sociale.
-- Sans prévision, même circuit que le congé (agent -> responsable -> DRH).
-- Motifs et liens de parenté du formulaire papier CRG. Saisie au plus tard
-- J-2 avant le départ (paramétrable), sauf DÉCÈS (urgence). Quota annuel paramétrable.

CREATE TABLE IF NOT EXISTS drh_permission_sociale (
    permission_id   BIGSERIAL PRIMARY KEY,
    user_id         BIGINT      NOT NULL REFERENCES users(user_id),
    departement_id  BIGINT      NOT NULL REFERENCES drh_departement(departement_id),
    exercice        INTEGER     NOT NULL,
    motif           VARCHAR(20) NOT NULL
                    CHECK (motif IN ('NAISSANCE','BAPTEME','MALADIE','MARIAGE','DECES','AUTRE')),
    lien_parente    VARCHAR(20)
                    CHECK (lien_parente IS NULL OR lien_parente IN
                           ('PERE','MERE','GD_PERE','GD_MERE','ENFANT_CHARGE','MARATRE','CONJOINT','AUTRE')),
    precision_motif VARCHAR(300),
    date_debut      DATE        NOT NULL,
    date_fin        DATE        NOT NULL,
    nb_jours        INTEGER     NOT NULL,
    statut          VARCHAR(20) NOT NULL DEFAULT 'SOUMISE'
                    CHECK (statut IN ('SOUMISE','ACCEPTEE_RESP','REJETEE_RESP',
                                      'VALIDEE_DRH','REJETEE_DRH','ANNULEE')),
    motif_rejet     VARCHAR(500),
    soumise_le      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    traitee_resp_par BIGINT REFERENCES users(user_id),
    traitee_resp_le  TIMESTAMPTZ,
    validee_drh_par  BIGINT REFERENCES users(user_id),
    validee_drh_le   TIMESTAMPTZ,
    annulee_par      BIGINT REFERENCES users(user_id),
    annulee_le       TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_drh_permission_ordre CHECK (date_fin >= date_debut)
);
CREATE INDEX IF NOT EXISTS idx_drh_permission_user ON drh_permission_sociale (user_id, exercice);
CREATE INDEX IF NOT EXISTS idx_drh_permission_dept ON drh_permission_sociale (departement_id, exercice, statut);

INSERT INTO drh_parametre (cle, valeur) VALUES
    ('PERMISSION_QUOTA_ANNUEL_JOURS', '10'),
    ('PERMISSION_DELAI_PREAVIS_JOURS', '2')
ON CONFLICT (cle) DO NOTHING;
