-- =====================================================================================
-- V207 : la rubrique « Réclamations » et le responsable de chaque catégorie
--        (application mobile des agents de crédit, lot 0 — 12/11/2026)
-- =====================================================================================
--
-- L'application mobile ouvre une file de réclamations : un agent sur le terrain signale un
-- problème de recouvrement, de crédit, de compte SAF ou de moyens, et six directions en sont
-- averties. La table des réclamations et les écrans viennent au lot 2 ; le DROIT est posé ici,
-- pour que la DSIG puisse placer les comptes avant que la file n'existe, et pour que la règle
-- de routage soit lisible en base plutôt que dans un document.
--
-- LES SIX DESTINATAIRES, arbitrage du 12/11/2026 : les opérationnels de la DSIG, le Centre de
-- validation, l'inspection (DI), la Direction de l'Exploitation (DE), la Direction générale et
-- l'Audit.
--
-- Les deux premiers sont des départements de la matrice (V178) et se désignent comme tels. Les
-- quatre autres n'y ont aucun département : ils sont accordés par le RÔLE, comme les alertes SAF
-- (V204) et la synthèse de direction (V198). La résolution se fait donc par
-- `porteursParRoleOuDepartement`, jamais par `porteursDeRubrique`, qui ignore les rôles.
--
-- ⚠️ Le service « DE » à lui seul désigne 387 comptes au 12/11/2026, c'est-à-dire TOUT LE RÉSEAU :
-- chaque agent de crédit porte ce service. La règle de la Direction de l'Exploitation est donc le
-- rôle MANAGER avec le service DE, soit sept comptes. Router une réclamation sur le seul service
-- enverrait un courriel à l'ensemble du personnel à chaque signalement.
--
-- Aucune adresse n'est écrite ici : un arrivant dans l'une de ces directions reçoit les
-- réclamations sans intervention, un partant cesse de les recevoir le jour où son compte est
-- désactivé.

-- ------------------------------------------------------------------------------- la rubrique
INSERT INTO habilitation_rubrique (code, libelle, famille, ordre, actif) VALUES
    ('RECLAMATIONS', 'Reclamations des agents', 'Agents et pilotage', 120, TRUE)
ON CONFLICT (code) DO NOTHING;

-- La case apparaît dans l'écran de réglage des habilitations dès cette migration, avant l'écran
-- qu'elle commandera : c'est voulu, les droits se placent en amont et non le jour de la livraison.

-- --------------------------------------------------- ce que la DSIG traite, par département
INSERT INTO habilitation_departement_rubrique (departement_id, rubrique_code)
SELECT d.id, 'RECLAMATIONS'
  FROM habilitation_departement d
 WHERE d.service = 'DSIG'
   AND d.code IN ('OPERATIONNEL', 'CENTRE_VALIDATION')
ON CONFLICT DO NOTHING;

-- ------------------------------------------------- les quatre directions, par rôle et service
INSERT INTO habilitation_role_rubrique (role, service, rubrique_code) VALUES
    ('DG',      '*',     'RECLAMATIONS'),
    ('MANAGER', 'DE',    'RECLAMATIONS'),
    ('MANAGER', 'DI',    'RECLAMATIONS'),
    ('MANAGER', 'AUDIT', 'RECLAMATIONS')
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------- le responsable de chaque catégorie
--
-- Six directions averties, ce sont six directions qui peuvent croire que quelqu'un d'autre s'en
-- occupe. Chaque catégorie désigne donc UN responsable, nommé dans le courriel et affiché dans
-- l'écran ; les autres porteurs de la rubrique sont en copie et peuvent reprendre la main.
--
-- Le responsable s'écrit exactement comme la matrice d'habilitation : soit un département
-- (service + code), soit un rôle borné à un service. Le changer est un UPDATE, pas une livraison.

CREATE TABLE IF NOT EXISTS reclamation_categorie (
    code             VARCHAR(40)  PRIMARY KEY,
    libelle          VARCHAR(120) NOT NULL,
    resp_service     VARCHAR(40),                 -- service du responsable (DSIG, DE, DI...)
    resp_departement VARCHAR(40),                 -- département de la matrice, si c'en est un
    resp_role        VARCHAR(40),                 -- rôle, si le responsable se désigne ainsi
    ordre            INT          NOT NULL DEFAULT 0,
    actif            BOOLEAN      NOT NULL DEFAULT TRUE,
    -- Un responsable et un seul : soit un département, soit un rôle, jamais les deux ni aucun.
    CONSTRAINT ck_reclamation_categorie_responsable CHECK (
        (resp_departement IS NOT NULL AND resp_service IS NOT NULL AND resp_role IS NULL)
     OR (resp_role IS NOT NULL AND resp_departement IS NULL AND resp_service IS NOT NULL)),
    -- Le département cité doit exister dans la matrice. Une ligne « par rôle » laisse
    -- resp_departement nul : la clé étrangère ne s'applique alors pas.
    CONSTRAINT fk_reclamation_categorie_departement
        FOREIGN KEY (resp_service, resp_departement)
        REFERENCES habilitation_departement (service, code)
);

COMMENT ON TABLE reclamation_categorie IS
    'V207 : categories de reclamation de l''application mobile, et direction responsable de chacune. '
    'Les autres porteurs de la rubrique RECLAMATIONS sont en copie.';
COMMENT ON COLUMN reclamation_categorie.resp_role IS
    'Rôle du responsable quand sa direction n''a pas de département dans la matrice (DE, DI). '
    'Toujours accompagné de resp_service : MANAGER seul designerait les 33 managers du reseau.';

INSERT INTO reclamation_categorie (code, libelle, resp_service, resp_departement, resp_role, ordre) VALUES
    ('RECOUVREMENT',  'Recouvrement',                           'DE',   NULL,                'MANAGER', 10),
    ('CREDIT',        'Credit, dossier, circuit de validation', 'DE',   NULL,                'MANAGER', 20),
    ('COMPTE_SAF',    'Compte SAF, membre inconnu, ecart',      'DSIG', 'OPERATIONNEL',      NULL,      30),
    ('PIECE_DOSSIER', 'Piece ou validation de dossier',         'DSIG', 'CENTRE_VALIDATION', NULL,      40),
    ('LOGISTIQUE',    'Logistique et moyens',                   'DI',   NULL,                'MANAGER', 50),
    ('AUTRE',         'Autre',                                  'DSIG', 'OPERATIONNEL',      NULL,      60)
ON CONFLICT (code) DO NOTHING;
