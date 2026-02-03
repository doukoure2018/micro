-- ============================================================================
-- Migration V87: Ajout du champ capitaux_propre à la table analyse_bilan
-- ============================================================================

-- Ajouter le champ capitaux_propre (Situation nette / Capitaux propres)
ALTER TABLE analyse_bilan
ADD COLUMN IF NOT EXISTS capitaux_propre numeric(15,2) DEFAULT 0;

-- Ajouter un commentaire sur la colonne
COMMENT ON COLUMN analyse_bilan.capitaux_propre IS 'Situation nette (Capitaux propres) - PASSIF';

-- Mettre à jour la vue v_bilan_complet pour inclure le nouveau champ
DROP VIEW IF EXISTS v_bilan_complet CASCADE;

CREATE OR REPLACE VIEW v_bilan_complet AS
SELECT
    b.bilan_id,
    b.analyse_id,
    b.type_periode,
    -- ACTIF - Immobilisations
    b.terrain,
    b.batiment_magasin,
    b.installation_agencement,
    b.materiel_industriel,
    b.mobilier_bureau,
    b.materiel_informatique,
    b.materiel_transport,
    b.autre_immobilisation,
    -- ACTIF - Circulant
    b.stocks,
    b.creances_clients,
    b.tresorerie_caisse_banque,
    -- PASSIF
    b.capitaux_propre,
    b.emprunt_long_terme,
    b.emprunt_court_terme,
    b.autres_dettes,
    -- Observations
    b.observations_actif,
    b.observations_passif,
    b.created_at,
    b.updated_at,
    -- Calculs ACTIF
    (COALESCE(b.terrain, 0) + COALESCE(b.batiment_magasin, 0) + COALESCE(b.installation_agencement, 0) +
     COALESCE(b.materiel_industriel, 0) + COALESCE(b.mobilier_bureau, 0) + COALESCE(b.materiel_informatique, 0) +
     COALESCE(b.materiel_transport, 0) + COALESCE(b.autre_immobilisation, 0)) AS total_immobilisations,
    (COALESCE(b.terrain, 0) + COALESCE(b.batiment_magasin, 0) + COALESCE(b.installation_agencement, 0) +
     COALESCE(b.materiel_industriel, 0) + COALESCE(b.mobilier_bureau, 0) + COALESCE(b.materiel_informatique, 0) +
     COALESCE(b.materiel_transport, 0) + COALESCE(b.autre_immobilisation, 0) +
     COALESCE(b.stocks, 0) + COALESCE(b.creances_clients, 0) + COALESCE(b.tresorerie_caisse_banque, 0)) AS total_actif,
    -- Calculs PASSIF
    (COALESCE(b.emprunt_long_terme, 0) + COALESCE(b.emprunt_court_terme, 0) + COALESCE(b.autres_dettes, 0)) AS total_dettes,
    -- Capitaux propres: utiliser la valeur saisie si présente, sinon calculer
    CASE
        WHEN COALESCE(b.capitaux_propre, 0) > 0 THEN b.capitaux_propre
        ELSE (
            (COALESCE(b.terrain, 0) + COALESCE(b.batiment_magasin, 0) + COALESCE(b.installation_agencement, 0) +
             COALESCE(b.materiel_industriel, 0) + COALESCE(b.mobilier_bureau, 0) + COALESCE(b.materiel_informatique, 0) +
             COALESCE(b.materiel_transport, 0) + COALESCE(b.autre_immobilisation, 0) +
             COALESCE(b.stocks, 0) + COALESCE(b.creances_clients, 0) + COALESCE(b.tresorerie_caisse_banque, 0))
            -
            (COALESCE(b.emprunt_long_terme, 0) + COALESCE(b.emprunt_court_terme, 0) + COALESCE(b.autres_dettes, 0))
        )
    END AS capitaux_propres,
    -- Fonds de roulement et BFR
    (CASE
        WHEN COALESCE(b.capitaux_propre, 0) > 0 THEN b.capitaux_propre
        ELSE (
            (COALESCE(b.terrain, 0) + COALESCE(b.batiment_magasin, 0) + COALESCE(b.installation_agencement, 0) +
             COALESCE(b.materiel_industriel, 0) + COALESCE(b.mobilier_bureau, 0) + COALESCE(b.materiel_informatique, 0) +
             COALESCE(b.materiel_transport, 0) + COALESCE(b.autre_immobilisation, 0) +
             COALESCE(b.stocks, 0) + COALESCE(b.creances_clients, 0) + COALESCE(b.tresorerie_caisse_banque, 0))
            -
            (COALESCE(b.emprunt_long_terme, 0) + COALESCE(b.emprunt_court_terme, 0) + COALESCE(b.autres_dettes, 0))
        )
    END + COALESCE(b.emprunt_long_terme, 0))
    -
    (COALESCE(b.terrain, 0) + COALESCE(b.batiment_magasin, 0) + COALESCE(b.installation_agencement, 0) +
     COALESCE(b.materiel_industriel, 0) + COALESCE(b.mobilier_bureau, 0) + COALESCE(b.materiel_informatique, 0) +
     COALESCE(b.materiel_transport, 0) + COALESCE(b.autre_immobilisation, 0)) AS fonds_roulement,
    -- BFR = Stocks + Créances - Dettes court terme
    (COALESCE(b.stocks, 0) + COALESCE(b.creances_clients, 0)) - COALESCE(b.emprunt_court_terme, 0) AS besoin_fonds_roulement
FROM analyse_bilan b;

-- Accorder les permissions sur la vue
GRANT SELECT ON v_bilan_complet TO PUBLIC;
