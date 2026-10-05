-- ============================================================================
-- V160 : fusion du point de service « nono » dans « kobayah » (demande DSIG du 2026-10-05)
--
-- Constat. Deux lignes de la table pointvente portent le MÊME code SAF 962 :
--     id 181  « nono »     rattaché à l'agence 33 KALOUM
--     id 192  « kobayah »  rattaché à l'agence 40 COBAYA
-- C'est donc un seul et même point de service, saisi deux fois dans le référentiel.
-- Le tableau de bord de l'assainissement fusionne les deux lignes par leur code et
-- retient la plus ancienne pour l'agence : les 290 fiches du code 962 étaient donc
-- comptées sous KALOUM alors qu'elles relèvent de COBAYA.
--
-- Décision : « nono » est supprimé et tout ce qui s'y rattachait est reporté sur
-- « kobayah ». Les références sont déplacées AVANT la suppression ; aucune donnée
-- n'est perdue.
--
-- Ce qui se déplace, mesuré en production le 2026-10-05 :
--     4 utilisateurs (1 CAISSE, 3 AGENT_CORRECTEUR), dont l'agence passe de KALOUM à COBAYA
--     63 arrêtés de caisse (13/03/2026 au 07/07/2026)
--     3 rotations closes
--     0 demande de crédit, 0 bon de commande
-- ============================================================================

DO $$
DECLARE
    v_nono    CONSTANT BIGINT := 181;
    v_kobayah CONSTANT BIGINT := 192;
    v_agence  BIGINT;
    v_deleg   BIGINT;
    n         INTEGER;
BEGIN
    -- Garde-fou : si le référentiel a déjà été corrigé, la migration ne fait rien.
    IF NOT EXISTS (SELECT 1 FROM pointvente WHERE id = v_nono) THEN
        RAISE NOTICE 'V160 : le point de service 181 n''existe plus, rien à faire.';
        RETURN;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pointvente WHERE id = v_kobayah) THEN
        RAISE EXCEPTION 'V160 : le point de service cible 192 (kobayah) est introuvable, migration interrompue.';
    END IF;

    SELECT agence_id, delegation_id INTO v_agence, v_deleg FROM pointvente WHERE id = v_kobayah;

    -- Les utilisateurs suivent le point de service, agence et délégation comprises :
    -- sans cela leur périmètre resterait incohérent (point de service COBAYA, agence KALOUM).
    UPDATE users SET pointvente_id = v_kobayah, agence_id = v_agence, delegation_id = v_deleg
    WHERE pointvente_id = v_nono;
    GET DIAGNOSTICS n = ROW_COUNT; RAISE NOTICE 'V160 : % utilisateur(s) rattaché(s) à kobayah.', n;

    UPDATE arrete_caisse SET pointvente_id = v_kobayah WHERE pointvente_id = v_nono;
    GET DIAGNOSTICS n = ROW_COUNT; RAISE NOTICE 'V160 : % arrêté(s) de caisse reporté(s).', n;

    UPDATE demande_credit SET point_vente_id = v_kobayah WHERE point_vente_id = v_nono;
    GET DIAGNOSTICS n = ROW_COUNT; RAISE NOTICE 'V160 : % demande(s) de crédit reportée(s).', n;

    UPDATE bon_commande SET pointvente_id = v_kobayah WHERE pointvente_id = v_nono;
    GET DIAGNOSTICS n = ROW_COUNT; RAISE NOTICE 'V160 : % bon(s) de commande reporté(s).', n;

    UPDATE rotation SET ps = v_kobayah WHERE ps = v_nono;
    GET DIAGNOSTICS n = ROW_COUNT; RAISE NOTICE 'V160 : % rotation(s) reportée(s).', n;

    DELETE FROM pointvente WHERE id = v_nono;
    RAISE NOTICE 'V160 : point de service « nono » supprimé ; le code 962 ne désigne plus que « kobayah » (COBAYA).';
END $$;
