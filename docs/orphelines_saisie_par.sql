-- Demandes du circuit accueil sans saisissant (saisie_par NULL) : personne ne peut les corriger
-- ni les rediligenter après un renvoi du DA (cas du dossier 10610, 16/11/2026).
-- Lecture seule sauf le bloc 3, commenté.
--   ssh digicreditrural 'sudo docker exec -i postgrecontainer sh -c "psql -U \"\$POSTGRES_USER\" -d \"\$POSTGRES_DB\""' < docs/orphelines_saisie_par.sql
\pset pager off

\echo '==== 1. Ampleur : demandes encore dans le circuit accueil sans saisie_par ===='
SELECT validation_state, count(*) AS nb, min(createdat) AS plus_ancienne, max(createdat) AS plus_recente
FROM demandeindividuel
WHERE saisie_par IS NULL
  AND validation_state IN ('EN_ATTENTE_DA', 'AFFECTEE', 'CORRECTION_ACCUEIL')
  AND COALESCE(statut_demande, '') NOT IN ('REJET', 'REJECTED', 'ANNULE')
GROUP BY 1 ORDER BY 1;

\echo '==== 2. Celles qui sont bloquées (renvoyées en correction, personne pour corriger) ===='
SELECT d.demandeindividuel_id, d.nom, d.prenom, ag.libele AS agence, pv.libele AS ps, d.createdat::date AS saisie_le,
       d.date_annulation_da::date AS renvoyee_le, left(d.motif_annulation_da, 60) AS motif, d.agent_credit_affecte
FROM demandeindividuel d
LEFT JOIN agence ag ON ag.id = d.agence
LEFT JOIN pointvente pv ON pv.id = d.pos
WHERE d.saisie_par IS NULL AND d.validation_state = 'CORRECTION_ACCUEIL'
ORDER BY d.date_annulation_da;

\echo '==== 2b. Qui a donné l''avis sur 10610 (user 754) et les agents du PS N''Zerekoré 1 ===='
SELECT u.user_id, u.username, u.first_name || ' ' || u.last_name AS nom, string_agg(r.name, ',') AS roles,
       u.enabled, u.pointvente_id, u.agence_id
FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id
WHERE u.user_id = 754 OR u.pointvente_id = 29
GROUP BY u.user_id, u.username, u.first_name, u.last_name, u.enabled, u.pointvente_id, u.agence_id
ORDER BY u.user_id;

-- ==== 3. Réparation du 10610 (à décommenter après avoir choisi le saisissant, ex. 754) ====
-- UPDATE demandeindividuel
-- SET saisie_par = 754, saisie_par_role = 'AGENT_CREDIT',
--     cod_usuarios = (SELECT first_name || ' ' || last_name FROM users WHERE user_id = 754)
-- WHERE demandeindividuel_id = 10610 AND saisie_par IS NULL AND validation_state = 'CORRECTION_ACCUEIL';
-- Alternative sans SQL : le DA (Saa Robert) ouvre le dossier → « Réattribuer » → un agent de crédit de N'Zerekoré 1 ;
-- la réattribution pose saisie_par sur cet agent, qui voit alors le dossier dans « Mes réceptions », corrige et rediligente.
