-- =====================================================================================
-- V166 : le DA déclare lui-même le passage d'un crédit au contentieux (DSIG, 2026-10-17)
-- =====================================================================================
--
-- La V165 permet de confier au recouvrement les dossiers que SAF a passés au judiciaire
-- (IND_ESTADO = 'J'). Mais le DA constate le décrochage avant SAF : il veut pouvoir
-- sélectionner des crédits et les passer au contentieux lui-même, pour les suivre comme
-- tels sans attendre.
--
-- digi n'écrit jamais dans SAF : le statut bancaire du crédit ne change pas. Ce qui est
-- enregistré ici est un SUIVI DE RECOUVREMENT INTERNE — « ce dossier est traité au
-- contentieux » — déclaré par le DA, horodaté et nominatif, et levable de la même façon.
--
-- Le crédit reste dans le portefeuille de son agent de crédit et dans son score tant que
-- SAF le dit en cours : la perte reste la sienne, on ne doit pas pouvoir assainir une
-- note en poussant les dossiers difficiles au contentieux. L'agent de recouvrement, lui,
-- s'ajoute par une affectation de type CONTENTIEUX (V165) — facultative : le DA peut
-- déclarer le contentieux sans désigner encore personne.

CREATE TABLE IF NOT EXISTS portefeuille_contentieux (
    id                  BIGSERIAL PRIMARY KEY,
    cod_agencia         VARCHAR(5)   NOT NULL,          -- point de service SAF (= pointvente.code)
    num_credito         BIGINT       NOT NULL,          -- PR_CREDITOS.NUM_CREDITO
    cod_cliente         VARCHAR(15),                    -- repris de SAF au moment de la déclaration
    declare_par_user_id BIGINT       NOT NULL REFERENCES users(user_id),
    date_declaration    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motif               VARCHAR(255),
    actif               BOOLEAN      NOT NULL DEFAULT TRUE,
    date_fin            TIMESTAMPTZ,                    -- levée du contentieux
    fin_par_user_id     BIGINT       REFERENCES users(user_id),
    motif_fin           VARCHAR(255)
);

-- Un crédit n'est au contentieux qu'une fois à la fois ; l'historique des déclarations
-- levées reste en base, comme pour les affectations.
CREATE UNIQUE INDEX IF NOT EXISTS uq_portefeuille_contentieux_actif
    ON portefeuille_contentieux (cod_agencia, num_credito) WHERE actif;

CREATE INDEX IF NOT EXISTS idx_portefeuille_contentieux_ps
    ON portefeuille_contentieux (cod_agencia) WHERE actif;

COMMENT ON TABLE portefeuille_contentieux IS
'Passage au contentieux declare par le DA dans digi (V166) : suivi de recouvrement interne, sans effet sur le statut du credit dans SAF. Le credit reste dans le portefeuille et le score de son agent de credit tant que SAF le dit en cours.';
