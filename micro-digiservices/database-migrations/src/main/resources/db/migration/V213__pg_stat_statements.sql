-- =====================================================================================
-- V213 : mesurer les requetes avant de dimensionner la base (16/11/2026)
-- =====================================================================================
--
-- Le 16/11, un tour de la base de production a montre des reglages d'usine sur une machine
-- de 16 Go, 630 Mo de fichiers temporaires en trois jours, et 18 tables de plus de mille
-- lignes dont le planificateur n'avait JAMAIS lu les statistiques (portefeuille_affectation :
-- 739 lignes estimees pour 38 624 reelles). Les reglages sont dans docker-compose ; cette
-- migration pose l'instrument qui permettra, la prochaine fois, de partir d'une mesure.
--
-- pg_stat_statements n'agit que si shared_preload_libraries le charge (docker-compose). Sans
-- cela, l'extension se cree quand meme et ses vues repondent par une erreur explicite :
-- rien ne casse, et la migration n'a pas a connaitre l'etat du conteneur.

CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

COMMENT ON EXTENSION pg_stat_statements IS
'V213 : temps et frequence de chaque requete, pour dimensionner la base sur des mesures. Lecture : SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC.';
