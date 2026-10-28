-- =====================================================================================
-- V188 : « Clients et sociétariat » retrouve un écran (DSIG, 28/10/2026)
-- =====================================================================================
--
-- La V186 a donné à la vérification des documents sa propre case. Effet de bord : la
-- rubrique « Clients et sociétariat » ne commandait plus aucun écran. Elle rejoignait donc
-- les quatre rubriques muettes que la V187 venait de corriger — une case qu'on peut cocher
-- sans que rien ne change.
--
-- Il lui reste un écran légitime : le suivi du sociétariat (/dashboards/suivi-societariat).
-- Celui-ci était ouvert par le rôle, en dur dans le menu, et sa route n'avait aucune
-- barrière. Il passe par la matrice, comme les autres.
--
-- Les lignes ci-dessous reprennent EXACTEMENT la condition du menu d'avant (DA, DR, RA).
-- Personne ne gagne ni ne perd l'écran ; ce qui change, c'est qu'un département peut
-- désormais le recevoir par la matrice, et que la route refuse enfin ceux qui n'y ont rien
-- à faire.

INSERT INTO habilitation_role_rubrique (role, service, rubrique_code) VALUES
    ('DA', '*', 'CLIENTS_SOCIETARIAT'),
    ('DR', '*', 'CLIENTS_SOCIETARIAT'),
    ('RA', '*', 'CLIENTS_SOCIETARIAT')
ON CONFLICT DO NOTHING;
