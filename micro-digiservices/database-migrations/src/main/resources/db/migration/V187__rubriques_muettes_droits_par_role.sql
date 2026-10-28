-- =====================================================================================
-- V187 : les quatre rubriques muettes commandent enfin un écran (DSIG, 28/10/2026)
-- =====================================================================================
--
-- Quatre rubriques de la matrice ne commandaient aucun écran : les cocher ne changeait
-- rien. Elles ouvrent désormais l'écran que leur libellé annonce :
--
--   Rapprochement du module caisse              -> Audit du rapprochement de caisse
--   Suivi des arrêtés de caisse                 -> Suivi des arrêtés de caisse
--   Assainissement                              -> Assainissement
--   Statistiques des modifications de téléphone -> Inspection des changements de téléphone
--
-- Ces écrans étaient jusqu'ici ouverts par le rôle, en dur dans le menu. Plutôt que de
-- garder deux règles concurrentes (« ce rôle, OU cette case »), le rôle donne maintenant la
-- rubrique : la matrice devient la seule règle, et la barrière de route peut s'appuyer
-- dessus sans enfermer dehors ceux qui y accédaient par leur rôle.
--
-- Les lignes ci-dessous reprennent EXACTEMENT les conditions du menu d'avant. Personne ne
-- gagne ni ne perd un accès ; ce qui change, c'est qu'un département DSIG peut désormais en
-- recevoir un par la matrice.

INSERT INTO habilitation_role_rubrique (role, service, rubrique_code) VALUES
    -- Audit du rapprochement de caisse : le service Audit, comme avant.
    ('MANAGER', 'Audit', 'RAPPROCHEMENT_CAISSE'),

    -- Suivi des arrêtés de caisse : DA, RA, DR, DG, Exploitation, Inspection.
    ('DA',      '*',     'ARRETE_CAISSE'),
    ('RA',      '*',     'ARRETE_CAISSE'),
    ('DR',      '*',     'ARRETE_CAISSE'),
    ('DG',      '*',     'ARRETE_CAISSE'),
    ('MANAGER', 'DE',    'ARRETE_CAISSE'),
    ('MANAGER', 'DI',    'ARRETE_CAISSE'),

    -- Assainissement : DA, DR, DG, Exploitation, Sociétariat.
    ('DA',      '*',     'ASSAINISSEMENT'),
    ('DR',      '*',     'ASSAINISSEMENT'),
    ('DG',      '*',     'ASSAINISSEMENT'),
    ('MANAGER', 'DE',    'ASSAINISSEMENT'),
    ('MANAGER', 'Societariat', 'ASSAINISSEMENT'),

    -- Inspection des changements de téléphone : le service Inspection, comme avant.
    ('MANAGER', 'DI',    'STATS_TELEPHONE')
ON CONFLICT DO NOTHING;
