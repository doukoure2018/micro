-- Réparation des demandes du circuit accueil sans saisissant (mesure du 16/11/2026 : 57 demandes,
-- dont 30 en CORRECTION_ACCUEIL = 27 doublons « annulés » par le DA + 3 vraies corrections).
-- TOUT est dans une transaction : relire les contrôles, puis remplacer ROLLBACK par COMMIT en fin de fichier.
--   ssh digicreditrural 'sudo docker exec -i postgrecontainer sh -c "psql -U \"\$POSTGRES_USER\" -d \"\$POSTGRES_DB\""' < docs/reparation_orphelines_accueil.sql
\pset pager off
\set ON_ERROR_STOP on
BEGIN;

-- ---------------------------------------------------------------------------------------------
-- A. Les 27 doublons que le DA a voulu annuler (motif « double emploi », « doublons », « envoyée 2 fois »…)
--    Contrôle : pour chacun, le membre doit avoir une AUTRE demande vivante (sinon ce n'est pas un doublon).
-- ---------------------------------------------------------------------------------------------
\echo '==== A0. Contrôle des doublons : autre demande vivante du même membre ? ===='
WITH doublons(id) AS (VALUES (5885),(5997),(8236),(8237),(8238),(8239),(8240),(8242),(8243),(8244),(8246),(8247),(8248),
                             (8249),(8250),(8251),(8253),(8254),(8255),(8256),(9911),(10021),(10037),(10038),(10128),(10247),(10373))
SELECT d.demandeindividuel_id, d.nom, d.prenom, d.numero_membre,
       (SELECT string_agg(a.demandeindividuel_id || ':' || a.validation_state || '/' || COALESCE(a.statut_demande,''), ' ' ORDER BY a.demandeindividuel_id)
          FROM demandeindividuel a
         WHERE a.numero_membre = d.numero_membre AND a.demandeindividuel_id <> d.demandeindividuel_id
           AND a.demandeindividuel_id NOT IN (SELECT id FROM doublons)
           AND COALESCE(a.statut_demande,'') NOT IN ('REJET','REJECTED','ANNULE')) AS autres_demandes_vivantes
FROM demandeindividuel d JOIN doublons x ON x.id = d.demandeindividuel_id
ORDER BY d.demandeindividuel_id;

\echo '==== A1. Annulation effective des doublons (statut ANNULE, motif du DA conservé) ===='
UPDATE demandeindividuel
SET statut_demande = 'ANNULE'
WHERE demandeindividuel_id IN (5885,5997,8236,8237,8238,8239,8240,8242,8243,8244,8246,8247,8248,8249,8250,8251,8253,8254,8255,8256,
                               9911,10021,10037,10038,10128,10247,10373)
  AND validation_state = 'CORRECTION_ACCUEIL' AND saisie_par IS NULL;

-- ---------------------------------------------------------------------------------------------
-- B. Les 3 vraies corrections : donner un saisissant pour que la correction redevienne possible.
--    10610 → 754 APDOUALAMOU (a déjà instruit le dossier, agent de crédit de N'Zerekoré 1).
--    3876 (N'Zerekoré 1, « revoir le numéro membre », saisie le 03/09) et 7508 (Pita, « montant échéance
--    pas conforme ») : remplacer les ??? par l'agent de crédit choisi par le DA, ou laisser le DA « Réattribuer ».
-- ---------------------------------------------------------------------------------------------
\echo '==== B. Saisissant posé sur les vraies corrections ===='
UPDATE demandeindividuel d
SET saisie_par = u.user_id, saisie_par_role = 'AGENT_CREDIT', cod_usuarios = u.first_name || ' ' || u.last_name
FROM users u
WHERE d.demandeindividuel_id = 10610 AND u.user_id = 754 AND d.saisie_par IS NULL;
-- UPDATE demandeindividuel d SET saisie_par = u.user_id, saisie_par_role = 'AGENT_CREDIT', cod_usuarios = u.first_name || ' ' || u.last_name
-- FROM users u WHERE d.demandeindividuel_id = 3876 AND u.user_id = ??? AND d.saisie_par IS NULL;
-- UPDATE demandeindividuel d SET saisie_par = u.user_id, saisie_par_role = 'AGENT_CREDIT', cod_usuarios = u.first_name || ' ' || u.last_name
-- FROM users u WHERE d.demandeindividuel_id = 7508 AND u.user_id = ??? AND d.saisie_par IS NULL;

-- ---------------------------------------------------------------------------------------------
-- C. Les 20 demandes AFFECTEE sans saisissant : l'agent affecté devient le saisissant (même règle que la
--    réattribution du DA), pour qu'un futur renvoi en correction ne les bloque pas.
-- ---------------------------------------------------------------------------------------------
\echo '==== C. Affectées : agent affecté = saisissant ===='
UPDATE demandeindividuel d
SET saisie_par = d.agent_credit_affecte, saisie_par_role = 'AGENT_CREDIT',
    cod_usuarios = COALESCE(NULLIF(d.cod_usuarios,''), u.first_name || ' ' || u.last_name)
FROM users u
WHERE u.user_id = d.agent_credit_affecte
  AND d.saisie_par IS NULL AND d.validation_state = 'AFFECTEE'
  AND COALESCE(d.statut_demande,'') NOT IN ('REJET','REJECTED','ANNULE');

-- D. Les 7 EN_ATTENTE_DA sans saisissant : rien à faire ; le correctif serveur pose désormais le saisissant
--    à la création et, à défaut, l'agent affecté lors d'un renvoi.

\echo '==== Bilan après réparation ===='
SELECT validation_state, count(*) AS encore_sans_saisissant
FROM demandeindividuel
WHERE saisie_par IS NULL AND validation_state IN ('EN_ATTENTE_DA','AFFECTEE','CORRECTION_ACCUEIL')
  AND COALESCE(statut_demande,'') NOT IN ('REJET','REJECTED','ANNULE')
GROUP BY 1 ORDER BY 1;

COMMIT;
