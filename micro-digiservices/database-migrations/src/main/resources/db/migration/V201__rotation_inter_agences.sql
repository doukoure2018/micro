-- =====================================================================================
-- V201 : la rotation pose les TROIS rattachements, et devient inter-agences
-- (DSIG, 03/11/2026)
-- =====================================================================================
--
-- `activer_rotation` n'écrivait que `users.pointvente_id`. Tant que la rotation restait à
-- l'intérieur d'une agence, cela suffisait : le point de service changeait, l'agence et la
-- délégation étaient les mêmes de toute façon.
--
-- Ouvrir la rotation aux autres agences sans corriger cela aurait produit, à chaque
-- déplacement, un compte à moitié rattaché — point de service de Kindia, agence de
-- Forécariah. C'est exactement l'incohérence qui a bloqué la rotation de Loua Appolinaire le
-- 03/11/2026, mais fabriquée automatiquement et en série. Le point de service porte déjà son
-- agence et sa délégation : l'activation les recopie désormais, et les trois rattachements ne
-- peuvent plus se contredire.
--
-- Rien d'autre ne change : le refus tant que l'agent porte encore une charge reste en place,
-- et c'est lui qui garantit que les dossiers ne partent pas avec l'agent.

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
        UPDATE rotation SET statut = true, date_rotation = CURRENT_TIMESTAMP WHERE id_rotation = v_rotation_id;
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

-- =====================================================================================
-- Trace des comptes deja incoherents
-- =====================================================================================
--
-- Les comptes dont l'agence ne correspond pas a celle de leur point de service existent deja :
-- ils viennent des changements faits a la main dans la fiche de l'agent. Ils ne sont PAS
-- corrigés ici — la bonne valeur dépend de l'intention, et seule la DSIG la connaît. Cette vue
-- les donne à voir, pour qu'on les reprenne un par un.

CREATE OR REPLACE VIEW v_agents_rattachement_incoherent AS
SELECT u.user_id,
       TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) AS agent,
       u.pointvente_id, pv.libele AS point_vente, pv.code AS cod_agencia,
       u.agence_id        AS agence_du_compte,
       pv.agence_id       AS agence_du_point_de_service,
       u.delegation_id    AS delegation_du_compte,
       pv.delegation_id   AS delegation_du_point_de_service
  FROM users u
  JOIN pointvente pv ON pv.id = u.pointvente_id
 WHERE u.pointvente_id IS NOT NULL
   AND (u.agence_id IS DISTINCT FROM pv.agence_id
     OR u.delegation_id IS DISTINCT FROM pv.delegation_id);

COMMENT ON VIEW v_agents_rattachement_incoherent IS
'Comptes dont l''agence ou la delegation ne correspond pas a celle de leur point de service, heritage des changements faits a la main. Non corriges automatiquement : la bonne valeur depend de l''intention.';
