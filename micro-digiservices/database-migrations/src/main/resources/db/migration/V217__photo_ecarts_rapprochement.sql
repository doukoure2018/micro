-- =====================================================================================
-- V217 : photo quotidienne des ecarts de rapprochement
-- Demande DSIG du 2026-11-23, arbitrages recommandes retenus
-- Proposition : https://claude.ai/artifact/TXVzciN4fZi5DcjVMgpKo4
-- =====================================================================================
--
-- L'outil de bureau rapproche les encours clients avec la comptabilite generale, point de
-- service par point de service. Son ecart total est lu a l'ecran puis perdu : la copie SAF est
-- restauree chaque matin et les chiffres de la veille ne peuvent pas etre reconstitues. Il
-- garde bien un historique, mais dans une base SQLite du poste, sans sauvegarde, consultable
-- de ce poste et de lui seul.
--
-- Ces deux tables recoivent une PHOTO par jour et par module, poussee par l'outil. Elles ne
-- sont jamais ecrites depuis un ecran : digi recoit, range et affiche.
--
-- ARBITRAGES RETENUS :
--   - une photo par jour et par module, la derniere de la journee l'emporte (cle unique) ;
--   - le detail descend jusqu'au COMPTE COMPTABLE, maille ou l'on voit quelle ligne a bouge ;
--   - les trois modules des le depart : comptes clients, credits, depots a terme ;
--   - pas d'alerte par courriel dans ce lot : l'ecran d'abord.

-- -------------------------------------------------------------------------------------
-- 1. La photo : une ligne par jour et par module, pour tout le reseau
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rapprochement_photo (
    id                  BIGSERIAL PRIMARY KEY,
    -- La date du CALENDRIER, et non la date d'arrete du point de service : c'est l'axe de la
    -- courbe. Les dates d'arrete different d'un point de service a l'autre et ne font pas un axe.
    jour                DATE NOT NULL,
    module              VARCHAR(20) NOT NULL,
    -- Periode comptable lue, pour que l'on sache a quel mois se rapporte l'ecart.
    periode_annee       INTEGER,
    periode_mois        INTEGER,
    -- Les grandeurs du reseau. Les deux soldes sont gardes, et pas seulement leur difference :
    -- c'est ce qui permet de dire lequel des deux cotes a bouge.
    ecart_total         NUMERIC(20, 2) NOT NULL,
    solde_client        NUMERIC(20, 2),
    solde_comptable     NUMERIC(20, 2),
    nb_lignes           INTEGER,
    nb_concordantes     INTEGER,
    nb_ecarts           INTEGER,
    -- Ce qui rend une photo comparable a celle de la veille : une photo prise sur 180 points
    -- de service au lieu de 185 n'est pas comparable, et doit le dire.
    points_lus          INTEGER,
    points_attendus     INTEGER,
    horodatage          TIMESTAMP NOT NULL DEFAULT NOW(),
    auteur              VARCHAR(255),
    recue_le            TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_photo_module CHECK (module IN ('COMPTES', 'CREDITS', 'DAT')),
    -- LA cle de l'arbitrage 2 : un deuxieme envoi du meme jour REMPLACE le premier au lieu de
    -- s'ajouter. Deux rapprochements le matin et l'apres-midi donnent une seule photo.
    CONSTRAINT uq_photo_jour_module UNIQUE (jour, module)
);

COMMENT ON TABLE rapprochement_photo IS
    'V217 : photo quotidienne des ecarts de rapprochement, poussee par l''outil de bureau. Une ligne par jour et par module ; la derniere photo du jour remplace la precedente.';
COMMENT ON COLUMN rapprochement_photo.jour IS
    'Date du calendrier, axe de la courbe — pas la date d''arrete du point de service';
COMMENT ON COLUMN rapprochement_photo.points_lus IS
    'Points de service effectivement lus ; inferieur a points_attendus = photo incomplete, a ne pas lire comme une amelioration';

-- -------------------------------------------------------------------------------------
-- 2. Le detail : point de service, puis compte comptable
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rapprochement_photo_ligne (
    id                  BIGSERIAL PRIMARY KEY,
    photo_id            BIGINT NOT NULL REFERENCES rapprochement_photo(id) ON DELETE CASCADE,
    cod_agencia         VARCHAR(20) NOT NULL,
    libelle_point       VARCHAR(255),
    -- La hierarchie Credit Rural TELLE QU'AU MOMENT de la photo : une agence qui change de
    -- delegation ne doit pas reecrire le passe.
    cod_agence          VARCHAR(20),
    libelle_agence      VARCHAR(255),
    cod_delegation      VARCHAR(20),
    libelle_delegation  VARCHAR(255),
    -- Vide (chaine vide) = la ligne porte le TOTAL du point de service. On lit ainsi la courbe
    -- d'un point de service sans additionner ses comptes, tout en gardant le detail.
    compte_comptable    VARCHAR(30) NOT NULL DEFAULT '',
    produits            VARCHAR(255),
    nb_comptes          INTEGER,
    ecart               NUMERIC(20, 2) NOT NULL,
    solde_client        NUMERIC(20, 2),
    solde_comptable     NUMERIC(20, 2),
    etat                VARCHAR(30),
    CONSTRAINT uq_photo_ligne UNIQUE (photo_id, cod_agencia, compte_comptable)
);

COMMENT ON COLUMN rapprochement_photo_ligne.compte_comptable IS
    'Compte comptable de la ligne ; chaine vide = total du point de service';

-- -------------------------------------------------------------------------------------
-- 3. Index de lecture
-- -------------------------------------------------------------------------------------
-- La courbe : les N derniers jours d'un module.
CREATE INDEX IF NOT EXISTS idx_photo_module_jour
    ON rapprochement_photo (module, jour DESC);
-- Le tableau du jour, et la courbe d'un point de service.
CREATE INDEX IF NOT EXISTS idx_photo_ligne_point
    ON rapprochement_photo_ligne (cod_agencia, photo_id);
-- Le filtre par delegation et par agence de l'ecran.
CREATE INDEX IF NOT EXISTS idx_photo_ligne_hierarchie
    ON rapprochement_photo_ligne (cod_delegation, cod_agence, photo_id);
-- Le total d'un point de service, la ligne la plus lue de l'ecran.
CREATE INDEX IF NOT EXISTS idx_photo_ligne_total
    ON rapprochement_photo_ligne (photo_id, cod_agencia)
    WHERE compte_comptable = '';
