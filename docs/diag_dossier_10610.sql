-- Diagnostic « le dossier n'évolue pas » — demande individuelle 10610
-- Lecture seule. À lancer sur la prod :
--   ssh digicreditrural 'sudo docker exec -i postgrecontainer sh -c "psql -U \"\$POSTGRES_USER\" -d \"\$POSTGRES_DB\""' < docs/diag_dossier_10610.sql
\set id 10610
\pset pager off
\set ON_ERROR_STOP off

\echo
\echo '==== 1. LA DEMANDE : identité, état, acteurs, dates ===='
\x on
SELECT d.demandeindividuel_id, d.nom, d.prenom, d.numero_membre, d.telephone,
       d.statut_demande, d.validation_state, d.statut_credit, d.statut_selection,
       d.montant_demande, d.duree_demande, d.montant_propose, d.duree_proposee,
       d.createdat, d.delegation, dl.libele AS delegation_lib, d.agence, ag.libele AS agence_lib, d.pos, pv.libele AS ps_lib,
       d.saisie_par, d.saisie_par_role, d.cod_usuarios,
       d.agent_credit_affecte, d.affecte_par_da, d.date_affectation_ac,
       d.date_validation_da, d.validated_by_da, d.avis_da, d.motif_rejet_da, d.sections_a_revoir_da, d.instructions_ac,
       d.date_validation_dr, d.validated_by_dr, d.avis_dr, d.motif_rejet_dr, d.sections_a_revoir_dr, d.instructions_da,
       d.date_validation_de, d.validated_by_de, d.avis_de, d.motif_rejet_de, d.sections_a_revoir_de, d.instructions_dr,
       d.date_validation_dg, d.date_rejet_dg, d.validated_by_dg, d.avis_dg, d.motif_rejet_dg, d.instructions_de,
       d.date_confirmation_rejet_de, d.confirmed_by_de,
       d.renvoi_agent_motif, d.renvoi_agent_by,
       d.motif_annulation_da, d.date_annulation_da, d.etat_avant_annulation,
       d.annulation_dossier_motif_code, d.annulation_dossier_motif, d.annulation_dossier_demandee_par,
       d.date_demande_annulation_dossier, d.annulation_dossier_decidee_par, d.date_decision_annulation_dossier,
       d.membre_verifie_saf, d.membre_verifie_at, d.membre_nom_saf, d.membre_agence_saf,
       d.avis_agent_credit
FROM demandeindividuel d
LEFT JOIN delegation dl ON dl.id = d.delegation
LEFT JOIN agence ag ON ag.id = d.agence
LEFT JOIN pointvente pv ON pv.id = d.pos
WHERE d.demandeindividuel_id = :id;
\x off

\echo
\echo '==== 2. HISTORIQUE DES ÉTATS (trigger V149) ===='
SELECT date_evenement, evenement, ancien_etat, nouvel_etat, ancien_statut, nouveau_statut,
       ancien_agent, nouvel_agent, acteur, left(motif, 80) AS motif
FROM demande_etat_historique
WHERE demandeindividuel_id = :id
ORDER BY date_evenement;

\echo
\echo '==== 3. LES ACTEURS : qui a saisi, qui est affecté, qui a validé (compte actif ? bloqué ? dernière connexion ?) ===='
WITH acteurs AS (
    SELECT 'saisie_par' AS role_dans_dossier, saisie_par::text AS ref FROM demandeindividuel WHERE demandeindividuel_id = :id
    UNION ALL SELECT 'cod_usuarios', cod_usuarios FROM demandeindividuel WHERE demandeindividuel_id = :id
    UNION ALL SELECT 'agent_credit_affecte', agent_credit_affecte::text FROM demandeindividuel WHERE demandeindividuel_id = :id
    UNION ALL SELECT 'affecte_par_da', affecte_par_da FROM demandeindividuel WHERE demandeindividuel_id = :id
    UNION ALL SELECT 'validated_by_da', validated_by_da FROM demandeindividuel WHERE demandeindividuel_id = :id
    UNION ALL SELECT 'validated_by_dr', validated_by_dr FROM demandeindividuel WHERE demandeindividuel_id = :id
    UNION ALL SELECT 'validated_by_de', validated_by_de FROM demandeindividuel WHERE demandeindividuel_id = :id
    UNION ALL SELECT 'renvoi_agent_by', renvoi_agent_by FROM demandeindividuel WHERE demandeindividuel_id = :id
)
SELECT a.role_dans_dossier, a.ref,
       u.user_id, u.username, u.first_name || ' ' || u.last_name AS nom,
       string_agg(r.name, ',') AS roles,
       u.enabled, u.account_non_locked, u.last_login,
       u.delegation_id, u.agence_id, u.pointvente_id, pv.libele AS ps
FROM acteurs a
LEFT JOIN users u ON u.user_id::text = a.ref OR u.user_uuid = a.ref OR u.username = a.ref
LEFT JOIN user_roles ur ON ur.user_id = u.user_id
LEFT JOIN roles r ON r.role_id = ur.role_id
LEFT JOIN pointvente pv ON pv.id = u.pointvente_id
WHERE a.ref IS NOT NULL
GROUP BY a.role_dans_dossier, a.ref, u.user_id, u.username, u.first_name, u.last_name, u.enabled, u.account_non_locked,
         u.last_login, u.delegation_id, u.agence_id, u.pointvente_id, pv.libele
ORDER BY 1;

\echo
\echo '==== 3b. Le DA et le DR censés voir ce dossier (même agence / même délégation) ===='
SELECT r.name AS role, u.user_id, u.username, u.first_name || ' ' || u.last_name AS nom, u.enabled, u.account_non_locked, u.last_login,
       u.agence_id, u.pointvente_id
FROM users u
JOIN user_roles ur ON ur.user_id = u.user_id
JOIN roles r ON r.role_id = ur.role_id
JOIN demandeindividuel d ON d.demandeindividuel_id = :id
WHERE (r.name IN ('DA','RA') AND u.agence_id = d.agence)
   OR (r.name = 'DR' AND u.delegation_id = d.delegation)
ORDER BY r.name, u.user_id;

\echo
\echo '==== 4. DOSSIER DE CRÉDIT ET ANALYSES ===='
SELECT dc.demande_credit_id, dc.statut, dc.date_creation, dc.user_id, dc.bilan_analyse_faite, dc.capacite_analyse_faite,
       dc.risque_analyse_fait, dc.date_bilan_analyse, dc.date_capacite_analyse, dc.date_risque_analyse
FROM demande_credit dc WHERE dc.demandeindividuel_id = :id;

SELECT id AS dossier_credit_id, statut, montant_demande, duree_mois, taux_interet, date_demande, date_creation
FROM dossiers_credit WHERE demandeindividuel_id = :id;

SELECT 'previsions_tresorerie' AS table_, count(*) FROM previsions_tresorerie p
   JOIN dossiers_credit dc ON dc.id = p.dossier_id WHERE dc.demandeindividuel_id = :id
UNION ALL SELECT 'garantie_propose', count(*) FROM garantie_propose WHERE demandeindividuel_id = :id
UNION ALL SELECT 'demande_piece_jointe', count(*) FROM demande_piece_jointe WHERE demandeindividuel_id = :id
UNION ALL SELECT 'avis', count(*) FROM avis WHERE demandeindividuel_id = :id
UNION ALL SELECT 'analyse_credit_agricole', count(*) FROM analyse_credit_agricole a WHERE a.demandeindividuel_id = :id
UNION ALL SELECT 'analyse_charges_fonctionnaire', count(*) FROM analyse_charges_fonctionnaire a WHERE a.demandeindividuel_id = :id;

\echo
\echo '==== 5. AVIS SAISIS ===='
SELECT a.date_creation, a.id_user, u.username, left(a.libele, 200) AS avis
FROM avis a LEFT JOIN users u ON u.user_id = a.id_user
WHERE a.demandeindividuel_id = :id ORDER BY a.date_creation;

\echo
\echo '==== 6. ROTATION : l''agent porteur a-t-il été transféré ? le dossier figure-t-il dans un transfert ? ===='
SELECT rt.id, rt.date_transfert, rt.agent_user_id, rt.vers_agent_user_id, rt.par_user_id, rt.agence_id, rt.acquitte,
       rt.nb_dossiers_credit, rt.nb_dossiers_accueil, left(rt.motif, 60) AS motif,
       (',' || rt.dossiers_ids || ',') LIKE '%,' || :id || ',%' AS contient_le_dossier
FROM rotation_transfert rt
WHERE (',' || coalesce(rt.dossiers_ids,'') || ',') LIKE '%,' || :id || ',%'
   OR rt.agent_user_id IN (SELECT agent_credit_affecte FROM demandeindividuel WHERE demandeindividuel_id = :id)
   OR rt.agent_user_id IN (SELECT saisie_par FROM demandeindividuel WHERE demandeindividuel_id = :id)
ORDER BY rt.date_transfert DESC;

\echo
\echo '==== 7. CORRECTION DU NUMÉRO DE MEMBRE ===='
SELECT date_correction, ancien_numero, nouveau_numero, nom_saf, cod_agencia_saf, par_nom, par_role, motif
FROM demande_numero_membre_correction WHERE demandeindividuel_id = :id ORDER BY date_correction;

\echo
\echo '==== 8. OÙ SE SITUE CE DOSSIER PAR RAPPORT AUX AUTRES DU MÊME ÉTAT DANS L''AGENCE ===='
SELECT validation_state, statut_demande, count(*) AS nb, min(createdat) AS plus_ancien, max(createdat) AS plus_recent
FROM demandeindividuel
WHERE agence = (SELECT agence FROM demandeindividuel WHERE demandeindividuel_id = :id)
  AND createdat >= now() - interval '120 days'
GROUP BY 1, 2 ORDER BY 3 DESC;
