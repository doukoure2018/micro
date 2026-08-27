-- V125 : Analyse du credit agricole solidaire (types de groupe CAS / CAS_R).
-- Remplace le bilan/flux commercant pour les groupes agricoles, sur le modele
-- de analyse_charges_fonctionnaire (V120) : une ligne par demande, totaux et
-- verdict recalcules cote backend (aucune confiance au front).
--
-- Regles metier (proposition validee le 2026-08-27) :
--   * echeancier a capital constant : I_k = (montant / N) x taux, identique par echeance
--     (formule confirmee pour 2 echeances ; cas 1 et 3 echeances a affiner par le metier)
--   * total echeances = montant x (1 + taux/100)
--   * marge nette = total produits - total charges
--   * verdict FINANCABLE <=> marge nette > total des echeances (strict)

CREATE TABLE IF NOT EXISTS analyse_credit_agricole (
    analyse_agricole_id     BIGSERIAL PRIMARY KEY,
    demandeindividuel_id    BIGINT NOT NULL
                            REFERENCES demandeindividuel(demandeindividuel_id) ON DELETE CASCADE,
    -- Grille des 12 postes de charges de la campagne (GNF)
    frais_labour            NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (frais_labour >= 0),
    frais_cloture           NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (frais_cloture >= 0),
    achat_intrant           NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (achat_intrant >= 0),
    achat_phytosanitaire    NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (achat_phytosanitaire >= 0),
    achat_outillage         NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (achat_outillage >= 0),
    frais_entretien         NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (frais_entretien >= 0),
    frais_semis             NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (frais_semis >= 0),
    frais_recolte           NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (frais_recolte >= 0),
    transport               NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (transport >= 0),
    stockage                NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (stockage >= 0),
    frais_conservation      NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (frais_conservation >= 0),
    charges_familiales      NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charges_familiales >= 0),
    -- Produits de la campagne
    quantite_recolte        NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (quantite_recolte >= 0),
    prix_vente_unitaire     NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (prix_vente_unitaire >= 0),
    autres_produits         NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (autres_produits >= 0),
    -- Calcules et VERROUILLES par le backend
    total_charges           NUMERIC(15,2) NOT NULL,
    total_produits          NUMERIC(15,2) NOT NULL,
    total_echeances         NUMERIC(15,2) NOT NULL,
    marge_nette             NUMERIC(15,2) NOT NULL,
    verdict                 VARCHAR(20) NOT NULL CHECK (verdict IN ('FINANCABLE', 'NON_FINANCABLE')),
    -- Audit
    analyse_par             VARCHAR(255),
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP,
    CONSTRAINT uq_analyse_agricole_demande UNIQUE (demandeindividuel_id)
);

CREATE INDEX IF NOT EXISTS idx_analyse_agricole_demande
    ON analyse_credit_agricole(demandeindividuel_id);

COMMENT ON TABLE analyse_credit_agricole IS
'Analyse du credit agricole solidaire (groupes CAS / CAS_R) : 12 postes de charges de campagne + produits escomptes. Verdict FINANCABLE <=> (total produits - total charges) > total des echeances (capital + interets). Recalcule cote backend a chaque enregistrement et re-verifie a l''approbation AC / validation DA.';
