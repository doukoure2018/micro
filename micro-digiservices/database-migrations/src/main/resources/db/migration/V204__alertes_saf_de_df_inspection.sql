-- =====================================================================================
-- V204 : les alertes SAF élargies à la DE, à la DF et à l'inspection (DSIG, 03/11/2026)
-- =====================================================================================
--
-- Les deux alertes — crédits à solde négatif (V177) et comptes de remboursement mal adossés
-- (V196) — ne partaient qu'à la DSIG. Elles signalent pourtant des anomalies qui engagent
-- l'exploitation et la comptabilité : un crédit à solde négatif est une écriture fautive, un
-- compte de remboursement mal adossé empêche le prélèvement et fait entrer le crédit dans le
-- PAR pour une raison étrangère à la capacité du client.
--
-- Elles partent désormais aussi à la Direction de l'Exploitation, à la Direction financière et
-- à l'inspection.
--
-- Par le RÔLE et non par un département : au 03/11/2026 la matrice d'habilitations ne couvre
-- que les services DSIG et Audit, et ces trois directions n'y ont aucun département. Une
-- résolution par département seul ne les atteindrait jamais — c'est exactement ce qui avait
-- imposé `porteursParRoleOuDepartement` pour la synthèse de direction (V198).
--
-- Aucune adresse n'est écrite ici : un arrivant dans l'une de ces directions reçoit l'alerte
-- sans intervention, un partant cesse de la recevoir le jour où son compte est désactivé.

INSERT INTO habilitation_role_rubrique (role, service, rubrique_code) VALUES
    ('MANAGER', 'DE', 'CREDITS_NEGATIFS'),
    ('MANAGER', 'DF', 'CREDITS_NEGATIFS'),
    ('MANAGER', 'DI', 'CREDITS_NEGATIFS')
ON CONFLICT DO NOTHING;

-- Ce que cela ouvre, et qu'il faut savoir : la rubrique CREDITS_NEGATIFS commande A LA FOIS la
-- réception des deux alertes, la lecture des deux écrans, et les actions de suivi (prise en
-- charge, vérification dans SAF). Ces trois directions pourront donc marquer une anomalie comme
-- prise en charge.
--
-- Ce n'est pas un risque pour les données : digi n'écrit JAMAIS dans SAF, et ces marques ne
-- servent qu'à éviter que deux personnes travaillent la même anomalie. Si la DSIG préfère
-- qu'elles lisent sans agir, la règle existe déjà pour le service Audit
-- (PerimetreSafService.lectureSeule) et s'étendrait à ces services en une ligne.
