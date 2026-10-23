-- =====================================================================================
-- V170 : rotation d'un agent — transfert de sa charge et garde-fou (DSIG, 23/10/2026)
-- =====================================================================================
--
-- Une rotation (activer_rotation, V47) ne changeait que le point de service de l'utilisateur :
-- ses dossiers de crédit en cours, ses saisies d'accueil, son portefeuille SAF et ses
-- désignations de rapports restaient à son nom, hors de son périmètre — 104 + 129 dossiers
-- orphelins constatés le 23/10/2026, dont six bloqués en correction accueil.
--
-- Désormais : (1) la charge se transfère à un agent du même point de service, en une fois,
-- journalisée ici pour que le DA en soit informé sur son tableau de bord ; (2) activer_rotation
-- refuse tant que l'agent porte encore quelque chose.

CREATE TABLE IF NOT EXISTS rotation_transfert (
    id                       BIGSERIAL    PRIMARY KEY,
    agent_user_id            BIGINT       NOT NULL REFERENCES users(user_id),   -- l'agent qui part
    vers_agent_user_id       BIGINT       NOT NULL REFERENCES users(user_id),   -- celui qui reçoit
    ancien_pointvente_id     BIGINT,
    nouveau_pointvente_id    BIGINT,
    agence_id                BIGINT,
    par_user_id              BIGINT       NOT NULL REFERENCES users(user_id),   -- RA / DA / DR qui transfère
    date_transfert           TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motif                    VARCHAR(500),
    nb_dossiers_credit       INTEGER      NOT NULL DEFAULT 0,
    nb_dossiers_accueil      INTEGER      NOT NULL DEFAULT 0,
    nb_portefeuille          INTEGER      NOT NULL DEFAULT 0,
    nb_designations          INTEGER      NOT NULL DEFAULT 0,
    dossiers_ids             TEXT,                                               -- ids séparés par des virgules
    acquitte                 BOOLEAN      NOT NULL DEFAULT FALSE,
    acquitte_par_user_id     BIGINT       REFERENCES users(user_id),
    date_acquittement        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_rotation_transfert_agence ON rotation_transfert (agence_id) WHERE NOT acquitte;

COMMENT ON TABLE rotation_transfert IS
    'V170 : transferts de charge faits lors d''une rotation ; le DA les voit sur son tableau de bord jusqu''à acquittement';

-- -------------------------------------------------------------------------------------
-- Garde-fou : activer_rotation refuse si l'agent porte encore des dossiers en cours, un
-- portefeuille SAF ou des désignations. L'écran de rotation propose le transfert avant.
-- -------------------------------------------------------------------------------------
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
        UPDATE rotation SET statut = true, date_rotation = CURRENT_TIMESTAMP WHERE id_rotation = v_rotation_id;
    ELSE
        INSERT INTO rotation (id_user, ps, statut, date_rotation)
        VALUES (p_id_user, p_ps, true, CURRENT_TIMESTAMP)
        RETURNING rotation.id_rotation INTO v_rotation_id;
    END IF;

    UPDATE users SET pointvente_id = p_ps, updated_at = CURRENT_TIMESTAMP WHERE user_id = p_id_user;
    RETURN QUERY SELECT v_rotation_id, 'Rotation activée avec succès'::TEXT;
END;
$$ LANGUAGE plpgsql;
