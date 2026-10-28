-- =====================================================================================
-- V184 : activer_rotation — lever l'ambiguite sur id_rotation (DSIG, 28/10/2026)
-- =====================================================================================
--
-- Signale ce jour : impossible d'activer un agent de credit sur un point de service. Le
-- journal de userservice ne montrait que « bad SQL grammar [SELECT * FROM
-- activer_rotation(?, ?)] », trop general pour dire quoi que ce soit.
--
-- La fonction declare RETURNS TABLE(id_rotation BIGINT, message TEXT) : « id_rotation » est
-- donc aussi un parametre de sortie. Dans la branche qui reactive une rotation deja
-- existante, la colonne n'etait pas qualifiee :
--
--     UPDATE rotation SET statut = true, ... WHERE id_rotation = v_rotation_id;
--
-- PostgreSQL ne sait pas s'il s'agit de la colonne ou du parametre et refuse :
-- « column reference "id_rotation" is ambiguous » (SQLSTATE 42702), que Spring presente
-- comme une erreur de grammaire SQL. Reproduit a l'identique sur la copie locale.
--
-- Consequence exacte : envoyer un agent vers un point de service ou il n'est JAMAIS alle
-- fonctionnait (chemin INSERT) ; l'y renvoyer echouait toujours (chemin UPDATE). C'est le
-- cas du compte 72 vers le point de service 30, ou il etait deja passe le 12 octobre.
--
-- Seule la ligne fautive change ; les garde-fous de la V170 sont repris a l'identique.

CREATE OR REPLACE FUNCTION activer_rotation(
    p_id_user BIGINT,
    p_ps BIGINT
) RETURNS TABLE (
    id_rotation BIGINT,
    message TEXT
) AS $$
DECLARE
    v_rotation_id BIGINT;
    v_ps_actuel   BIGINT;
    v_dossiers    INTEGER;
    v_accueil     INTEGER;
    v_portefeuille INTEGER;
    v_designations INTEGER;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_id_user) THEN
        RETURN QUERY SELECT NULL::BIGINT, 'Erreur: Utilisateur inexistant'::TEXT;
        RETURN;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pointvente WHERE id = p_ps) THEN
        RETURN QUERY SELECT NULL::BIGINT, 'Erreur: Point de vente inexistant'::TEXT;
        RETURN;
    END IF;

    SELECT pointvente_id INTO v_ps_actuel FROM users WHERE user_id = p_id_user;

    -- V170 : rien ne doit rester au nom de l'agent sur son point de service actuel.
    IF v_ps_actuel IS NOT NULL AND v_ps_actuel <> p_ps THEN
        SELECT COUNT(*) INTO v_dossiers FROM demandeindividuel d
         WHERE d.agent_credit_affecte = p_id_user
           AND COALESCE(d.statut_demande, '') NOT IN ('REJET', 'REJECTED', 'ANNULE')
           AND COALESCE(d.validation_state, '') <> 'VALIDATED_FINAL';
        SELECT COUNT(*) INTO v_accueil FROM demandeindividuel d
         WHERE d.saisie_par = p_id_user AND d.validation_state = 'CORRECTION_ACCUEIL'
           AND COALESCE(d.statut_demande, '') NOT IN ('REJET', 'REJECTED', 'ANNULE');
        SELECT COUNT(*) INTO v_portefeuille FROM portefeuille_affectation WHERE actif AND agent_user_id = p_id_user;
        SELECT COUNT(*) INTO v_designations FROM rapport_saisie_designation WHERE actif AND agent_user_id = p_id_user;
        IF v_dossiers + v_accueil + v_portefeuille + v_designations > 0 THEN
            RETURN QUERY SELECT NULL::BIGINT,
                ('Erreur: cet agent porte encore ' || v_dossiers || ' dossier(s) de crédit en cours, '
                 || v_accueil || ' correction(s) accueil, ' || v_portefeuille || ' crédit(s) SAF affecté(s) et '
                 || v_designations || ' désignation(s) de rapport : transférez sa charge à un agent du même point de service avant la rotation')::TEXT;
            RETURN;
        END IF;
    END IF;

    UPDATE rotation SET statut = false WHERE rotation.id_user = p_id_user AND rotation.statut = true;

    SELECT r.id_rotation INTO v_rotation_id FROM rotation r
     WHERE r.id_user = p_id_user AND r.ps = p_ps ORDER BY r.date_rotation DESC LIMIT 1;
    IF v_rotation_id IS NOT NULL THEN
        UPDATE rotation SET statut = true, date_rotation = CURRENT_TIMESTAMP WHERE rotation.id_rotation = v_rotation_id;
    ELSE
        INSERT INTO rotation (id_user, ps, statut, date_rotation)
        VALUES (p_id_user, p_ps, true, CURRENT_TIMESTAMP)
        RETURNING rotation.id_rotation INTO v_rotation_id;
    END IF;

    UPDATE users SET pointvente_id = p_ps, updated_at = CURRENT_TIMESTAMP WHERE user_id = p_id_user;
    RETURN QUERY SELECT v_rotation_id, 'Rotation activée avec succès'::TEXT;
END;
$$ LANGUAGE plpgsql;
