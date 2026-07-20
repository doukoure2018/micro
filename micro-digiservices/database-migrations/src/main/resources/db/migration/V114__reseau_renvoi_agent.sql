-- ============================================================================
-- V114: Renvoi d'une demande de credit du DA vers l'agent de credit
--
-- Cas : l'agent envoie une demande a la mauvaise agence/DA par erreur. Le DA la
-- renvoie a l'agent createur (etat RETOUR_AGENT). L'agent corrige la destination
-- (delegation/agence/pos) et la renvoie -> repart au bon DA (etat APPROVED).
--
-- validation_state est un VARCHAR libre (pas de contrainte CHECK) -> la nouvelle
-- valeur 'RETOUR_AGENT' ne necessite aucune modification de contrainte.
-- ============================================================================

ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS renvoi_agent_motif VARCHAR(500);
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS renvoi_agent_by    VARCHAR(255);

COMMENT ON COLUMN demandeindividuel.renvoi_agent_motif IS 'Motif du renvoi DA -> agent (erreur de destination)';
COMMENT ON COLUMN demandeindividuel.renvoi_agent_by IS 'DA ayant renvoye la demande a l agent';
