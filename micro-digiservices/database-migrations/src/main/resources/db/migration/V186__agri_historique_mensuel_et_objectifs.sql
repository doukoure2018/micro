-- V186 : historique mensuel du portefeuille agricole et objectifs (tableau de bord DE, lot 3).
--
-- Point 6 de la demande KUMY : aucune photo mensuelle par point de vente n'existait dans digi.
-- Les seuls chiffres mensuels etaient declaratifs (rapport_mensuel), avec un controle SAF lu a la
-- date de saisie et non a l'arrete.
--
-- DEUX SOURCES, ET C'EST VOULU :
--   * PHOTO           : le mois en cours, photographie chaque matin apres la restauration de la
--                       sauvegarde. L'encours est le MON_SALDO de SAF, la meme mesure que tous les
--                       ecrans de la plateforme : la serie se raccorde donc aux tableaux de bord.
--   * RECONSTITUTION  : les mois passes, recalcules depuis l'echeancier. La production, les sorties
--                       datees et les retards se reconstituent fidelement (ils reposent sur des
--                       dates reelles). L'ENCOURS PASSE, LUI, RESTE NUL ET C'EST DELIBERE : mesure
--                       du 28/10/2026 sur les 5 181 credits agricoles vivants, le capital de
--                       l'echeancier ne reproduit pas MON_SALDO (27,6 Md contre 46,7 Md, soit
--                       -41 %), le differe etant la norme en credit agricole. Publier cette
--                       approximation aurait donne au DE un encours faux de quatre dixiemes, avec
--                       une rupture visible le jour ou la photo prend le relais.
--
-- La colonne « source » porte donc une information de fiabilite, pas un detail technique.

CREATE TABLE IF NOT EXISTS agri_photo_mensuelle (
    mois                DATE         NOT NULL,              -- premier jour du mois observe
    code_agence         VARCHAR(10)  NOT NULL,              -- code SAF du point de vente
    nb_credits          INTEGER,                            -- credits vivants a la date d'observation
    encours             NUMERIC(18,2),                      -- NULL pour une RECONSTITUTION : voir ci-dessus
    nb_par30            INTEGER,
    encours_par30       NUMERIC(18,2),                      -- NULL pour une RECONSTITUTION
    nb_par90            INTEGER,
    encours_par90       NUMERIC(18,2),                      -- NULL pour une RECONSTITUTION
    montant_impaye      NUMERIC(18,2),                      -- du et non regle : capital + interets
    nb_production       INTEGER,                            -- credits mis en place dans le mois
    montant_production  NUMERIC(18,2),
    nb_sorties          INTEGER,                            -- credits dont SAF date la cloture dans le mois
    montant_sorties     NUMERIC(18,2),
    nb_clos_sans_date   INTEGER,                            -- reserve : clotures et apures que SAF ne date pas
    source              VARCHAR(16)  NOT NULL CHECK (source IN ('PHOTO', 'RECONSTITUTION')),
    calcule_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_agri_photo_mensuelle PRIMARY KEY (mois, code_agence)
);

CREATE INDEX IF NOT EXISTS idx_agri_photo_mois ON agri_photo_mensuelle (mois);

COMMENT ON TABLE agri_photo_mensuelle IS
    'V186 : une ligne par point de vente et par mois. source = PHOTO (mois en cours, encours reel de SAF) '
    'ou RECONSTITUTION (mois passes : production, sorties et retards fideles, encours volontairement nul)';
COMMENT ON COLUMN agri_photo_mensuelle.encours IS
    'Somme des MON_SALDO, meme mesure que les ecrans de la plateforme. NULL en RECONSTITUTION : '
    'l''echeancier ne reproduit pas MON_SALDO a -41 %, un encours passe approche aurait trompe le lecteur';
COMMENT ON COLUMN agri_photo_mensuelle.nb_clos_sans_date IS
    'Credits clos, transferes ou apures que SAF ne date pas (45 485 au 28/10/2026) : ils ne peuvent etre '
    'situes dans le temps et sont exclus des vivants. Compte ici pour que la serie porte sa propre reserve';

-- Point 7 : objectifs. Aucun objectif par agence ou delegation n'est saisi dans digi ; ils viennent
-- d'un fichier annuel de la Direction de l'exploitation. La table accueille aussi bien un objectif
-- annuel (mois NULL) qu'un objectif mensuel, et aussi bien un point de vente qu'une delegation.
CREATE TABLE IF NOT EXISTS agri_objectif (
    id             BIGSERIAL    PRIMARY KEY,
    annee          INTEGER      NOT NULL,
    mois           INTEGER      CHECK (mois BETWEEN 1 AND 12),   -- NULL = objectif annuel
    code_agence    VARCHAR(10),                                  -- code SAF du point de vente
    delegation_id  BIGINT,                                       -- ou une delegation entiere
    indicateur     VARCHAR(32)  NOT NULL,                        -- ENCOURS, PRODUCTION_MONTANT, PRODUCTION_NB, TAUX_PAR30...
    valeur         NUMERIC(18,2) NOT NULL,
    saisi_par      BIGINT,
    saisi_at       TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_agri_objectif_cible CHECK (code_agence IS NOT NULL OR delegation_id IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_agri_objectif
    ON agri_objectif (annee, COALESCE(mois, 0), COALESCE(code_agence, '-'),
                      COALESCE(delegation_id, 0), indicateur);

COMMENT ON TABLE agri_objectif IS
    'V186 : objectifs fournis par la Direction de l''exploitation. Un objectif cible soit un point de '
    'vente (code SAF) soit une delegation, pour une annee et eventuellement un mois. Vide jusqu''a '
    'reception du fichier de la DE : le gabarit est annee, mois, cible, indicateur, valeur';
