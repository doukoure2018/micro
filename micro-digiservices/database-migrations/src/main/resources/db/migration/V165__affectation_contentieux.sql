-- =====================================================================================
-- V165 : affectation des crédits au contentieux (demande DSIG du 2026-10-17)
-- =====================================================================================
--
-- Depuis la V159, le DA confie chaque crédit EN COURS à un agent de crédit de son point
-- de service. Les crédits passés au contentieux (SAF IND_ESTADO = 'J') sortent du cycle
-- de remboursement ordinaire : ils restent visibles au filtre mais ne sont la charge de
-- personne, et toute affectation posée dessus est fermée d'office.
--
-- Le DA demande à pouvoir confier ces dossiers-là, de la même façon, aux agents chargés
-- du recouvrement contentieux. Deux ajouts, aucun nouveau rôle de connexion :
--
--   1. la fonction CONTENTIEUX rejoint ACCUEIL et CREDIT dans agent_fonctions : le DA
--      l'active lui-même, depuis « Gestion des agents », pour les agents de son agence.
--      La liste des agents contentieux d'un point de service est celle des agents de son
--      AGENCE portant cette fonction — le recouvrement se traite au niveau de l'agence,
--      pas du guichet ;
--
--   2. portefeuille_affectation distingue désormais le type d'affectation. Une
--      affectation CREDIT ne vaut que pour un crédit en cours ; une affectation
--      CONTENTIEUX ne vaut que pour un crédit au contentieux, et n'est plus fermée
--      d'office au chargement suivant. Les 606 affectations existantes sont des
--      affectations de crédit : le défaut les couvre.
--
-- Le score des agents (V164) ne porte que sur les crédits en cours : les dossiers
-- contentieux restent hors notation, ils relèvent d'un autre métier.

-- ============= 1. La fonction CONTENTIEUX =============
ALTER TABLE agent_fonctions DROP CONSTRAINT IF EXISTS agent_fonctions_fonction_check;
ALTER TABLE agent_fonctions ADD CONSTRAINT agent_fonctions_fonction_check
    CHECK (fonction IN ('ACCUEIL', 'CREDIT', 'CONTENTIEUX'));

COMMENT ON TABLE agent_fonctions IS
'Fonctions d''agence (ACCUEIL / CREDIT / CONTENTIEUX) activees ou desactivees par le DA pour les agents de son agence. Le role de connexion (users/roles) reste pose a la creation du compte ; la capacite effective = role + fonctions actives.';

-- ============= 2. Le type d'affectation =============
ALTER TABLE portefeuille_affectation
    ADD COLUMN IF NOT EXISTS type_affectation VARCHAR(12) NOT NULL DEFAULT 'CREDIT';

ALTER TABLE portefeuille_affectation DROP CONSTRAINT IF EXISTS ck_portefeuille_affectation_type;
ALTER TABLE portefeuille_affectation ADD CONSTRAINT ck_portefeuille_affectation_type
    CHECK (type_affectation IN ('CREDIT', 'CONTENTIEUX'));

CREATE INDEX IF NOT EXISTS idx_portefeuille_affectation_type
    ON portefeuille_affectation (cod_agencia, type_affectation) WHERE actif;

COMMENT ON COLUMN portefeuille_affectation.type_affectation IS
'CREDIT : credit en cours confie a un agent de credit du point de service. CONTENTIEUX : dossier au contentieux confie a un agent de recouvrement de l''agence (V165).';
