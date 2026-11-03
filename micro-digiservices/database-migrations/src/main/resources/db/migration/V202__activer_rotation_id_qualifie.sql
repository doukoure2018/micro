-- =====================================================================================
-- V202 : activer_rotation — « id_rotation » de nouveau qualifie (DSIG, 03/11/2026)
-- =====================================================================================
--
-- La V201 a repris le corps de la fonction depuis la V170 et a donc perdu, sans le vouloir,
-- la correction apportee par la V184 le 28/10/2026 : dans la branche qui REACTIVE une rotation
-- deja existante, la colonne « id_rotation » n'etait pas qualifiee.
--
--     UPDATE rotation SET statut = true, ... WHERE id_rotation = v_rotation_id;
--
-- La fonction declare RETURNS TABLE(id_rotation BIGINT, ...) : « id_rotation » est donc aussi
-- un parametre de sortie, et PostgreSQL refuse (« column reference "id_rotation" is
-- ambiguous », SQLSTATE 42702), ce que Spring presente comme une erreur de grammaire SQL.
--
-- Consequence exacte, identique a celle du 28/10 : envoyer un agent vers un point de service
-- ou il n'est JAMAIS alle fonctionne (chemin INSERT) ; l'y RENVOYER echoue toujours (chemin
-- UPDATE). C'est precisement le geste prevu pour Loua Appolinaire — le ramener a Forecariah
-- avant de le muter dans les regles.
--
-- Seule cette ligne change par rapport a la V201 ; tout le reste, y compris les trois
-- rattachements, est repris a l'identique. Un test de garde interdit desormais la forme non
-- qualifiee dans toute migration.

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
    v_agence      BIGINT;
    v_delegation  BIGINT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_id_user) THEN
        RETURN QUERY SELECT NULL::BIGINT, 'Erreur: Utilisateur inexistant'::TEXT;
        RETURN;
    END IF;
    SELECT pv.agence_id, pv.delegation_id INTO v_agence, v_delegation
      FROM pointvente pv WHERE pv.id = p_ps;
    IF v_agence IS NULL THEN
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
                 || v_designations || ' désignation(s) de rapport : remettez sa charge avant la rotation')::TEXT;
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

    -- Les trois rattachements d'un coup : un agent ne peut plus se retrouver au point de
    -- service d'une agence et dans la fiche d'une autre.
    UPDATE users
       SET pointvente_id = p_ps,
           agence_id = v_agence,
           delegation_id = v_delegation,
           updated_at = CURRENT_TIMESTAMP
     WHERE user_id = p_id_user;
    RETURN QUERY SELECT v_rotation_id, 'Rotation activée avec succès'::TEXT;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION activer_rotation(BIGINT, BIGINT) IS
'Active la rotation d''un agent sur un point de service et pose les TROIS rattachements (point de service, agence, delegation) d''apres ce point de service. Refuse tant que l''agent porte une charge sur son point de service actuel.';
