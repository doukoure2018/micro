-- =====================================================================================
-- V210 : dernier état connu de chaque crédit SAF, crédit par crédit
--        (application mobile — le nom du membre et les montants hors ligne)
-- =====================================================================================
--
-- POURQUOI. L'application mobile n'affichait du portefeuille que ce que SAF venait de
-- répondre : un jour de coupure du VPN bancaire, ou une lecture SAF en échec, et l'agent
-- voyait ses crédits SANS LE NOM DU MEMBRE, sans montant et sans retard — donc sans
-- pouvoir chercher un sociétaire par son nom. Or le nom d'un membre ne change pas d'un
-- jour à l'autre : il n'y a aucune raison de le perdre parce que SAF est muet à l'instant.
--
-- CE QUE RANGE CETTE TABLE. Une ligne par crédit, écrasée à chaque lecture réussie de SAF,
-- avec ce que l'écran affiche : le membre, son nom, son téléphone, le produit, l'encours,
-- l'impayé, le retard et la prochaine échéance. Ce n'est PAS une source : SAF reste la
-- mesure, cette table n'est que la dernière mesure connue, datée par lu_at pour que rien
-- ne soit pris pour le chiffre de l'instant.
--
-- QUI L'ÉCRIT. Deux écritures, aucune lecture SAF supplémentaire :
--   1. la photo du portefeuille à risque de 08h40 GMT (V191), qui lit déjà TOUS les crédits
--      de TOUS les points de service — elle range au passage le détail par crédit ;
--   2. la synchronisation d'un téléphone, pour les seuls crédits de l'agent.
--
-- DURÉE DE VIE. Un crédit soldé disparaît de SAF et sa ligne reste ici : elle est sans
-- effet (plus aucune affectation active ne la désigne) et la photo du matin la remplacera
-- si le crédit revient. Pas de purge : une ligne par crédit du réseau, c'est l'ordre de
-- grandeur de PR_CREDITOS, pas celui d'un historique.

CREATE TABLE IF NOT EXISTS portefeuille_credit_photo (
    cod_agencia                VARCHAR(5)    NOT NULL,
    num_credito                BIGINT        NOT NULL,
    cod_cliente                VARCHAR(15),
    nom_client                 VARCHAR(200),
    telephone                  VARCHAR(60),
    produit                    VARCHAR(120),
    encours                    NUMERIC(18,2),
    montant_impaye             NUMERIC(18,2),
    jours_retard               INTEGER,
    prochaine_echeance         DATE,
    prochaine_echeance_montant NUMERIC(18,2),
    lu_at                      TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_portefeuille_credit_photo PRIMARY KEY (cod_agencia, num_credito)
);

COMMENT ON TABLE portefeuille_credit_photo IS
'Dernier etat connu de chaque credit SAF (nom du membre, telephone, produit, encours, impaye, retard, prochaine echeance), ecrase a chaque lecture SAF reussie. Sert l application mobile quand SAF est muet. lu_at date la mesure. Ecrite par la photo de 08h40 (V191) et par la synchronisation des telephones (V209).';

COMMENT ON COLUMN portefeuille_credit_photo.lu_at IS
'Moment de la lecture SAF qui a produit cette ligne : l application l affiche pour qu aucun montant ne soit pris pour celui de l instant.';

-- Chercher un sociétaire par son numéro de membre, tous crédits confondus
CREATE INDEX IF NOT EXISTS ix_credit_photo_cliente
    ON portefeuille_credit_photo (cod_cliente);
