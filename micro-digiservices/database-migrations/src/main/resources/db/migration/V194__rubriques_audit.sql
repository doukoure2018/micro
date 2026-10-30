-- =====================================================================================
-- V194 : l'environnement du service Audit (DSIG, 30/10/2026) — lot 1
-- =====================================================================================
--
-- Le service Audit a quatre comptes actifs, tous MANAGER, et ne voyait qu'UN écran métier :
-- l'audit du rapprochement de caisse. Aucun écran de crédit, de portefeuille, de clientèle ni
-- d'accès, alors que la plateforme enregistre déjà 21 760 changements d'état de dossiers,
-- 34 370 affectations de portefeuille et les journaux des comptes et des habilitations.
--
-- Cette migration crée le groupe de menu « Audit » et ses cinq rubriques, une par sous-menu.
-- Chaque rubrique ouvre un ensemble d'écrans qui existent déjà : rien n'est dupliqué, c'est la
-- matrice qui dit qui voit quoi. L'Audit lit et ne modifie rien — la règle est posée côté
-- serveur, pas seulement dans l'écran.
--
-- Le service reçoit aussi deux départements, pour que la responsable de l'Audit règle elle-même
-- qui, chez elle, voit quoi, comme la responsable DSIG le fait pour son service.

INSERT INTO habilitation_rubrique (code, libelle, famille, ordre, actif) VALUES
    ('AUDIT_CREDIT',       'Audit — Credit',            'Audit', 200, TRUE),
    ('AUDIT_CAISSE',       'Audit — Caisse et comptes', 'Audit', 210, TRUE),
    ('AUDIT_PORTEFEUILLE', 'Audit — Portefeuille',      'Audit', 220, TRUE),
    ('AUDIT_CLIENTELE',    'Audit — Clientele',         'Audit', 230, TRUE),
    ('AUDIT_ACCES',        'Audit — Acces et traces',   'Audit', 240, TRUE)
ON CONFLICT (code) DO NOTHING;

COMMENT ON TABLE habilitation_rubrique IS
'Ecrans que la matrice sait donner a un departement. Une rubrique ne sert a rien tant qu''aucune entree de menu ni aucune route ne la lit : les quatre rubriques restees muettes jusqu''au 28/10/2026 l''ont rappele. Les rubriques AUDIT_* (30/10/2026) sont des GROUPES : chacune ouvre plusieurs ecrans existants, en lecture seule, et vaut cle alternative sur leurs routes et leurs points d''entree.';

-- -------------------------------------------------------------- droits par role
-- Les quatre comptes du service voient tout le groupe des la livraison. Le reglage fin par
-- departement vient ensuite, quand la responsable aura place ses auditeurs.
INSERT INTO habilitation_role_rubrique (role, service, rubrique_code) VALUES
    ('MANAGER', 'Audit', 'AUDIT_CREDIT'),
    ('MANAGER', 'Audit', 'AUDIT_CAISSE'),
    ('MANAGER', 'Audit', 'AUDIT_PORTEFEUILLE'),
    ('MANAGER', 'Audit', 'AUDIT_CLIENTELE'),
    ('MANAGER', 'Audit', 'AUDIT_ACCES')
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------- departements du service
-- Pas d'ecran d'accueil pour l'instant : le journal des decisions, qui en sera l'accueil
-- naturel, arrive au lot 2. Sans accueil declare, le compte tombe sur l'accueil par defaut.
INSERT INTO habilitation_departement (service, code, libelle, accueil_route, tout_voir, ordre, actif) VALUES
    ('Audit', 'RESPONSABLE', 'Responsable de l''audit', NULL, TRUE,  10, TRUE),
    ('Audit', 'AUDITEURS',   'Auditeurs',               NULL, FALSE, 20, TRUE)
ON CONFLICT DO NOTHING;

-- Le departement « Auditeurs » recoit les cinq rubriques ; le responsable voit tout par
-- tout_voir, comme a la DSIG.
INSERT INTO habilitation_departement_rubrique (departement_id, rubrique_code)
SELECT d.id, r.code
  FROM habilitation_departement d
  CROSS JOIN (VALUES ('AUDIT_CREDIT'), ('AUDIT_CAISSE'), ('AUDIT_PORTEFEUILLE'),
                     ('AUDIT_CLIENTELE'), ('AUDIT_ACCES')) AS r(code)
 WHERE d.service = 'Audit' AND d.code = 'AUDITEURS'
ON CONFLICT DO NOTHING;
