-- Ajouter colonne valeur_nette_ajustee pour permettre l'ecrasement manuel de la VNC
ALTER TABLE collecte_amortissement ADD COLUMN IF NOT EXISTS valeur_nette_ajustee NUMERIC(15,2);

-- Mettre a jour fn_calculer_amortissements pour utiliser valeur_nette_ajustee si renseignee
CREATE OR REPLACE FUNCTION fn_calculer_amortissements(p_collecte_id BIGINT)
RETURNS VOID AS $$
DECLARE
    v_date_eval DATE;
    rec RECORD;
    v_mois_ecoules INTEGER;
    v_amort_mensuel NUMERIC(15,2);
    v_amort_cumule NUMERIC(15,2);
    v_vnc NUMERIC(15,2);
    v_statut VARCHAR(20);
BEGIN
    SELECT date_evaluation INTO v_date_eval
    FROM collecte_donnees
    WHERE collecte_id = p_collecte_id;

    IF v_date_eval IS NULL THEN
        v_date_eval := CURRENT_DATE;
    END IF;

    FOR rec IN
        SELECT amortissement_id, date_acquisition, duree_amortissement_mois,
               valeur_acquisition, valeur_nette_ajustee
        FROM collecte_amortissement
        WHERE collecte_id = p_collecte_id
    LOOP
        v_mois_ecoules := EXTRACT(YEAR FROM age(v_date_eval, rec.date_acquisition)) * 12
                        + EXTRACT(MONTH FROM age(v_date_eval, rec.date_acquisition));

        IF v_mois_ecoules < 0 THEN
            v_mois_ecoules := 0;
        END IF;

        IF rec.duree_amortissement_mois > 0 THEN
            v_amort_mensuel := rec.valeur_acquisition / rec.duree_amortissement_mois;
        ELSE
            v_amort_mensuel := 0;
        END IF;

        v_amort_cumule := LEAST(rec.valeur_acquisition, v_amort_mensuel * v_mois_ecoules);

        -- VNC: utiliser valeur_nette_ajustee si fournie, sinon calculer
        IF rec.valeur_nette_ajustee IS NOT NULL THEN
            v_vnc := rec.valeur_nette_ajustee;
        ELSE
            v_vnc := rec.valeur_acquisition - v_amort_cumule;
        END IF;

        IF v_vnc <= 0 THEN
            v_statut := 'Amorti';
            v_vnc := 0;
        ELSE
            v_statut := 'En cours';
        END IF;

        UPDATE collecte_amortissement
        SET amortissement_mensuel = ROUND(v_amort_mensuel, 2),
            amortissement_cumule = ROUND(v_amort_cumule, 2),
            valeur_nette_comptable = ROUND(v_vnc, 2),
            statut_amortissement = v_statut
        WHERE amortissement_id = rec.amortissement_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
