-- =====================================================================================
-- V168 : rapports du réseau — module B « Rapport d'activité du point de service »
-- Proposition DSIG du 20 octobre 2026, lot 2 ; même moteur que le module A (V167)
-- =====================================================================================
--
-- Le rapport d'activité (fichier « RAPPORT FORECARIAH 2026 ») est une feuille par point
-- de service et par exercice, remplie mois par mois, en seize blocs. Plutôt qu'un second
-- moteur, il réutilise celui des indicateurs mensuels : un rapport = un point de service
-- × un mois, avec le même brouillon continu et le même circuit DA → DR → DE. Ce qui
-- change est le référentiel : les rubriques sont groupées en SECTIONS, chacune décrivant
-- un bloc du fichier (orientation, périodicité, libellé de la ligne annuelle).
--
-- Règle DSIG du 20 octobre, inchangée : tout est saisi à la main ; aucun contrôle SAF sur
-- ce module pour l'instant (controle_saf = FALSE partout).
--
-- Périodicité d'une rubrique :
--   MENSUEL      : saisie chaque mois ;
--   TRIMESTRIEL  : saisie sur les rapports de mars, juin, septembre, décembre ;
--   OUVERTURE    : saisie une fois, sur le rapport de janvier (« décembre A-1 », soldes au 31/12).
-- Formules (nature CALCUL) : « SOMME:a,b,c », « a/b », « REF:a ».
-- Agrégat annuel : comment la ligne de bas de bloc se calcule sur l'exercice
--   (SOMME, MOYENNE des mois renseignés, DERNIER, AUCUN).

-- -------------------------------------------------------------------------------------
-- 1. Le rapport porte son module ; l'unicité devient (module, PS, année, mois)
-- -------------------------------------------------------------------------------------
ALTER TABLE rapport_mensuel ADD COLUMN IF NOT EXISTS module VARCHAR(20) NOT NULL DEFAULT 'MENSUEL';
ALTER TABLE rapport_mensuel DROP CONSTRAINT IF EXISTS uq_rapport_mensuel;
ALTER TABLE rapport_mensuel ADD CONSTRAINT uq_rapport_mensuel UNIQUE (module, cod_agencia, annee, mois);
DROP INDEX IF EXISTS idx_rapport_mensuel_periode;
CREATE INDEX IF NOT EXISTS idx_rapport_mensuel_periode ON rapport_mensuel (module, annee, mois, etat);

COMMENT ON COLUMN rapport_mensuel.module IS 'V168 : MENSUEL (indicateurs mensuels) ou ACTIVITE (rapport d''activité du PS)';

-- -------------------------------------------------------------------------------------
-- 2. Sections, et colonnes de description supplémentaires sur les rubriques
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rapport_section (
    module          VARCHAR(20)  NOT NULL,
    code            VARCHAR(40)  NOT NULL,
    libelle         VARCHAR(150) NOT NULL,
    ordre           INTEGER      NOT NULL,
    -- MOIS_LIGNES : mois en lignes, rubriques en colonnes (la plupart des blocs) ;
    -- MOIS_COLONNES : rubriques en lignes, mois en colonnes ; TRIMESTRE : une ligne par
    -- trimestre ; INSTANTANE : photographie de fin de trimestre, rubriques groupées en lignes.
    orientation     VARCHAR(15)  NOT NULL CHECK (orientation IN ('MOIS_LIGNES', 'MOIS_COLONNES', 'TRIMESTRE', 'INSTANTANE')),
    periodicite     VARCHAR(12)  NOT NULL DEFAULT 'MENSUEL' CHECK (periodicite IN ('MENSUEL', 'TRIMESTRIEL')),
    libelle_annuel  VARCHAR(40),                 -- « TOTAL », « ENCOURS MOYEN »… ; NULL = pas de ligne annuelle
    note            VARCHAR(300),
    PRIMARY KEY (module, code)
);

ALTER TABLE rapport_rubrique
    ADD COLUMN IF NOT EXISTS section        VARCHAR(40),
    ADD COLUMN IF NOT EXISTS periodicite    VARCHAR(12) NOT NULL DEFAULT 'MENSUEL'
        CHECK (periodicite IN ('MENSUEL', 'TRIMESTRIEL', 'OUVERTURE')),
    ADD COLUMN IF NOT EXISTS agregat_annuel VARCHAR(10) NOT NULL DEFAULT 'SOMME'
        CHECK (agregat_annuel IN ('SOMME', 'MOYENNE', 'DERNIER', 'AUCUN')),
    ADD COLUMN IF NOT EXISTS groupe         VARCHAR(60);   -- sous-groupe de colonnes, ou ligne (INSTANTANE)

-- Les formules « SOMME » du module B listent jusqu'à onze codes ; certains en-têtes dépassent 40 caractères.
ALTER TABLE rapport_rubrique ALTER COLUMN formule TYPE VARCHAR(400);
ALTER TABLE rapport_rubrique ALTER COLUMN libelle_court TYPE VARCHAR(60);

-- Les rubriques du module A forment une section unique, pour que l'écran les traite pareil.
INSERT INTO rapport_section (module, code, libelle, ordre, orientation, periodicite, libelle_annuel)
VALUES ('MENSUEL', 'INDICATEURS', 'Indicateurs du mois', 1, 'MOIS_LIGNES', 'MENSUEL', 'CUMUL')
ON CONFLICT (module, code) DO NOTHING;
UPDATE rapport_rubrique SET section = 'INDICATEURS' WHERE module = 'MENSUEL' AND section IS NULL;
UPDATE rapport_rubrique SET agregat_annuel = 'MOYENNE'
 WHERE module = 'MENSUEL' AND code IN ('ENCOURS_CREDITS', 'RETARDS', 'EP_VOLONTAIRES', 'EP_GARANTIES', 'SOCIETARIAT', 'CAPITAL_RETARD', 'TAUX_REMB', 'ENCAISSES');

-- -------------------------------------------------------------------------------------
-- 3. Référentiel du module ACTIVITE : 16 sections, 237 rubriques (186 saisies, 51 calculées),
--    généré à partir de la feuille FORECARIAH du fichier déposé dans docs/rapport
-- -------------------------------------------------------------------------------------
INSERT INTO rapport_section (module, code, libelle, ordre, orientation, periodicite, libelle_annuel, note) VALUES
('ACTIVITE', 'OCTROIS_TYPE', 'Montant des octrois par type de crédit', 1, 'MOIS_LIGNES', 'MENSUEL', 'TOTAL', NULL),
('ACTIVITE', 'PRETS_GENRE', 'Nombre et montant des prêts par mois et par genre', 2, 'MOIS_COLONNES', 'MENSUEL', 'TOTAL', NULL),
('ACTIVITE', 'PRETS_PRODUIT', 'Nombre et montant des prêts par mois et par produit', 3, 'MOIS_COLONNES', 'MENSUEL', 'TOTAL', NULL),
('ACTIVITE', 'SECTEUR', 'Structure des octrois et des encours par secteur d''activité', 4, 'MOIS_LIGNES', 'MENSUEL', 'TOTAL / MOYENNE', NULL),
('ACTIVITE', 'ENCOURS_PRODUIT', 'Encours de crédit par produit', 5, 'MOIS_LIGNES', 'MENSUEL', 'ENCOURS MOYEN', 'La ligne « Décembre A-1 » est saisie une fois, sur le rapport de janvier'),
('ACTIVITE', 'NB_ENCOURS_PRODUIT', 'Nombre de crédits en cours par produit', 6, 'MOIS_LIGNES', 'MENSUEL', 'ENCOURS MOYEN', NULL),
('ACTIVITE', 'APURES', 'Suivi des crédits apurés : recouvrements', 7, 'MOIS_LIGNES', 'MENSUEL', 'TOTAL RECOUVREMENT', 'Le solde au 31/12 A-1 est saisi sur le rapport de janvier ; le solde instantané = solde initial − recouvrements'),
('ACTIVITE', 'RETARDS', 'Retards par produit', 8, 'MOIS_LIGNES', 'MENSUEL', 'RETARD MOYEN', NULL),
('ACTIVITE', 'IMPAYES', 'Structure des impayés (fin de trimestre)', 9, 'INSTANTANE', 'TRIMESTRIEL', NULL, 'Photographie au 31 mars, 30 juin, 30 septembre et 31 décembre'),
('ACTIVITE', 'EPARGNE', 'Encours d''épargne', 10, 'MOIS_LIGNES', 'MENSUEL', 'ENCOURS MOYEN', NULL),
('ACTIVITE', 'AUTRES', 'Autres : relations avec la DR, transferts, tontine, intérêts, charges', 11, 'MOIS_LIGNES', 'MENSUEL', 'TOTAL', NULL),
('ACTIVITE', 'SOCIETARIAT', 'Sociétariat', 12, 'MOIS_LIGNES', 'MENSUEL', 'MOYENNE / TOTAL', NULL),
('ACTIVITE', 'PERSONNEL', 'Personnel de l''agence', 13, 'MOIS_LIGNES', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'PAR', 'Portefeuille à risque et taux d''impayés (fin de trimestre)', 14, 'TRIMESTRE', 'TRIMESTRIEL', 'MOYENNE', 'Taux = montant ÷ encours total du mois de fin de trimestre'),
('ACTIVITE', 'RATIOS', 'Ratios de performance et de productivité (trimestre)', 15, 'TRIMESTRE', 'TRIMESTRIEL', 'MOYENNE', 'Ratios saisis tels que calculés par l’agence ; formules à documenter avec la DE'),
('ACTIVITE', 'NORMES', 'Analyse de quelques ratios et normes (trimestre)', 16, 'TRIMESTRE', 'TRIMESTRIEL', 'MOYENNE', 'Réalisés repris des sections précédentes, normes en regard')
ON CONFLICT (module, code) DO NOTHING;

INSERT INTO rapport_rubrique (module, code, libelle, libelle_court, ordre, nature, format, formule, controle_saf, source_saf, aide, section, periodicite, agregat_annuel, groupe) VALUES
('ACTIVITE', 'OCT_TOTAL', 'Total des octrois', 'TOTAL OCTROIS', 1, 'CALCUL', 'MONTANT', 'SOMME:OCT_CRS,OCT_CAS,OCT_CC,OCT_KIOSQUE,OCT_PENSION,OCT_CFE,OCT_CDF,OCT_MOTO,OCT_CMT,OCT_CFDOM', FALSE, NULL, NULL, 'OCTROIS_TYPE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'OCT_CRS', 'Octrois CRS', 'CRS', 2, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'OCTROIS_TYPE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'OCT_CAS', 'Octrois CAS', 'CAS', 3, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'OCTROIS_TYPE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'OCT_CC', 'Octrois CC', 'CC', 4, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'OCTROIS_TYPE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'OCT_KIOSQUE', 'Octrois Kiosque', 'KIOSQUE', 5, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'OCTROIS_TYPE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'OCT_PENSION', 'Octrois Pension', 'PENSION', 6, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'OCTROIS_TYPE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'OCT_CFE', 'Octrois CFE', 'CFE', 7, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'OCTROIS_TYPE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'OCT_CDF', 'Octrois CDF', 'CDF', 8, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'OCTROIS_TYPE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'OCT_MOTO', 'Octrois Partenariat moto Bajaj', 'PARTENARIAT MOTO BAJAJ', 9, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'OCTROIS_TYPE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'OCT_CMT', 'Octrois CMT', 'CMT', 10, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'OCTROIS_TYPE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'OCT_CFDOM', 'Octrois CF domiciliés', 'CF DOMICILIÉS', 11, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'OCTROIS_TYPE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'OCT_NB', 'Nombre de crédits octroyés', 'NBRE DE CREDIT', 12, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'OCTROIS_TYPE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'GEN_F_NB', 'Nombre de prêts aux femmes', 'NB AUX FEMMES', 13, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PRETS_GENRE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'GEN_F_MT', 'Montant des prêts aux femmes', 'MT AUX FEMMES', 14, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PRETS_GENRE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'GEN_H_NB', 'Nombre de prêts aux hommes', 'NB AUX HOMMES', 15, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PRETS_GENRE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'GEN_H_MT', 'Montant des prêts aux hommes', 'MT AUX HOMMES', 16, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PRETS_GENRE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'GEN_PM_NB', 'Nombre de prêts aux personnes morales', 'NB AUX PERSONNES MORALES', 17, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PRETS_GENRE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'GEN_PM_MT', 'Montant des prêts aux personnes morales', 'MT AUX PERSONNES MORALES', 18, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PRETS_GENRE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'GEN_RUR_NB', 'Nombre de prêts aux ruraux', 'NB AUX RURAUX', 19, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PRETS_GENRE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'GEN_RUR_MT', 'Montant des prêts aux ruraux', 'MT AUX RURAUX', 20, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PRETS_GENRE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'GEN_TOT_NB', 'Nombre total de prêts', 'NOMBRE TOTAL', 21, 'CALCUL', 'NOMBRE', 'SOMME:GEN_F_NB,GEN_H_NB,GEN_PM_NB', FALSE, NULL, 'Femmes + hommes + personnes morales (les ruraux sont un sous-ensemble)', 'PRETS_GENRE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'GEN_TOT_MT', 'Montant total des prêts', 'MONTANT TOTAL', 22, 'CALCUL', 'MONTANT', 'SOMME:GEN_F_MT,GEN_H_MT,GEN_PM_MT', FALSE, NULL, NULL, 'PRETS_GENRE', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_AGRI_NB', 'Nombre de prêts en crédit agricole', 'NB CRÉDIT AGRICOLE', 23, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_AGRI_MT', 'Montant des prêts en crédit agricole', 'MT CRÉDIT AGRICOLE', 24, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_COM_NB', 'Nombre de prêts en crédit commercial', 'NB CRÉDIT COMMERCIAL', 25, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_COM_MT', 'Montant des prêts en crédit commercial', 'MT CRÉDIT COMMERCIAL', 26, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_FONCT_NB', 'Nombre de prêts en crédit fonctionnaire', 'NB CRÉDIT FONCTIONNAIRE', 27, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_FONCT_MT', 'Montant des prêts en crédit fonctionnaire', 'MT CRÉDIT FONCTIONNAIRE', 28, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_CMT_NB', 'Nombre de prêts en crédit moyen terme', 'NB CRÉDIT MOYEN TERME', 29, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_CMT_MT', 'Montant des prêts en crédit moyen terme', 'MT CRÉDIT MOYEN TERME', 30, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_PME_NB', 'Nombre de prêts en crédit aux PME/PMI', 'NB CRÉDIT AUX PME/PMI', 31, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_PME_MT', 'Montant des prêts en crédit aux PME/PMI', 'MT CRÉDIT AUX PME/PMI', 32, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_AUTRE_NB', 'Nombre de prêts en autres crédits court terme', 'NB AUTRES CRÉDITS COURT TERME', 33, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_AUTRE_MT', 'Montant des prêts en autres crédits court terme', 'MT AUTRES CRÉDITS COURT TERME', 34, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_TOT_NB', 'Nombre total de prêts', 'NOMBRE TOTAL', 35, 'CALCUL', 'NOMBRE', 'SOMME:PRD_AGRI_NB,PRD_COM_NB,PRD_FONCT_NB,PRD_CMT_NB,PRD_PME_NB,PRD_AUTRE_NB', FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PRD_TOT_MT', 'Montant total des prêts', 'MONTANT TOTAL', 36, 'CALCUL', 'MONTANT', 'SOMME:PRD_AGRI_MT,PRD_COM_MT,PRD_FONCT_MT,PRD_CMT_MT,PRD_PME_MT,PRD_AUTRE_MT', FALSE, NULL, NULL, 'PRETS_PRODUIT', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'SEC_OCT_TOTAL', 'Total des octrois', 'TOTAL OCTROIS', 37, 'CALCUL', 'MONTANT', 'SOMME:SEC_OCT_AGRI,SEC_OCT_COM,SEC_OCT_TP,SEC_OCT_TRANSP,SEC_OCT_ARTIS,SEC_OCT_KIOSQUE', FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'SOMME', 'Octrois'),
('ACTIVITE', 'SEC_OCT_AGRI', 'Octrois Agri / élevage', 'AGRI / ÉLEVAGE', 38, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'SOMME', 'Octrois'),
('ACTIVITE', 'SEC_OCT_COM', 'Octrois Commerce / hôtel / resto', 'COMMERCE / HÔTEL / RESTO', 39, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'SOMME', 'Octrois'),
('ACTIVITE', 'SEC_OCT_TP', 'Octrois Travaux publics / logement', 'TRAVAUX PUBLICS / LOGEMENT', 40, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'SOMME', 'Octrois'),
('ACTIVITE', 'SEC_OCT_TRANSP', 'Octrois Transport / comm.', 'TRANSPORT / COMM.', 41, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'SOMME', 'Octrois'),
('ACTIVITE', 'SEC_OCT_ARTIS', 'Octrois Artisanat / industrie', 'ARTISANAT / INDUSTRIE', 42, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'SOMME', 'Octrois'),
('ACTIVITE', 'SEC_OCT_KIOSQUE', 'Octrois Crédit kiosque', 'CRÉDIT KIOSQUE', 43, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'SOMME', 'Octrois'),
('ACTIVITE', 'SEC_ENC_AGRI', 'Encours Agri / élevage', 'AGRI / ÉLEVAGE', 44, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'MOYENNE', 'Encours'),
('ACTIVITE', 'SEC_ENC_COM', 'Encours Commerce / hôtel / resto', 'COMMERCE / HÔTEL / RESTO', 45, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'MOYENNE', 'Encours'),
('ACTIVITE', 'SEC_ENC_TP', 'Encours Travaux publics / logement', 'TRAVAUX PUBLICS / LOGEMENT', 46, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'MOYENNE', 'Encours'),
('ACTIVITE', 'SEC_ENC_TRANSP', 'Encours Transport / comm.', 'TRANSPORT / COMM.', 47, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'MOYENNE', 'Encours'),
('ACTIVITE', 'SEC_ENC_ELUS', 'Encours Crédit élus', 'CRÉDIT ÉLUS', 48, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'MOYENNE', 'Encours'),
('ACTIVITE', 'SEC_ENC_MOTO', 'Encours Moto Bajaj', 'MOTO BAJAJ', 49, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'MOYENNE', 'Encours'),
('ACTIVITE', 'SEC_ENC_TOTAL', 'Total des encours', 'TOTAL ENCOURS', 50, 'CALCUL', 'MONTANT', 'SOMME:SEC_ENC_AGRI,SEC_ENC_COM,SEC_ENC_TP,SEC_ENC_TRANSP,SEC_ENC_ELUS,SEC_ENC_MOTO', FALSE, NULL, NULL, 'SECTEUR', 'MENSUEL', 'MOYENNE', 'Encours'),
('ACTIVITE', 'ENC_TOTAL', 'Total encours', 'TOTAL ENCOURS', 51, 'CALCUL', 'MONTANT', 'SOMME:ENC_PENSION,ENC_CAS,ENC_CC,ENC_INVEST,ENC_KIOSQUE,ENC_CFE,ENC_CDF,ENC_VIRE,ENC_CMT,ENC_ELUS', FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'ENC_PENSION', 'Encours Pension', 'PENSION', 52, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'ENC_CAS', 'Encours CAS', 'CAS', 53, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'ENC_CC', 'Encours CC', 'CC', 54, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'ENC_INVEST', 'Encours Investissement', 'INVESTISSEMENT', 55, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'ENC_KIOSQUE', 'Encours Crédit kiosque', 'CRÉDIT KIOSQUE', 56, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'ENC_CFE', 'Encours CFE', 'CFE', 57, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'ENC_CDF', 'Encours CDF', 'CDF', 58, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'ENC_VIRE', 'Encours Virés militaires', 'VIRÉS MILITAIRES', 59, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'ENC_CMT', 'Encours CMT', 'CMT', 60, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'ENC_ELUS', 'Encours Crédit élus', 'CRÉDIT ÉLUS', 61, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'ENC_A1_TOTAL', 'Total encours décembre A-1', 'TOTAL DEC A-1', 62, 'CALCUL', 'MONTANT', 'SOMME:ENC_A1_PENSION,ENC_A1_CAS,ENC_A1_CC,ENC_A1_INVEST,ENC_A1_KIOSQUE,ENC_A1_CFE,ENC_A1_CDF,ENC_A1_VIRE,ENC_A1_CMT,ENC_A1_ELUS', FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'OUVERTURE', 'AUCUN', 'Décembre A-1'),
('ACTIVITE', 'ENC_A1_PENSION', 'Encours Pension au 31/12 A-1', 'PENSION DEC A-1', 63, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'OUVERTURE', 'AUCUN', 'Décembre A-1'),
('ACTIVITE', 'ENC_A1_CAS', 'Encours CAS au 31/12 A-1', 'CAS DEC A-1', 64, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'OUVERTURE', 'AUCUN', 'Décembre A-1'),
('ACTIVITE', 'ENC_A1_CC', 'Encours CC au 31/12 A-1', 'CC DEC A-1', 65, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'OUVERTURE', 'AUCUN', 'Décembre A-1'),
('ACTIVITE', 'ENC_A1_INVEST', 'Encours Investissement au 31/12 A-1', 'INVESTISSEMENT DEC A-1', 66, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'OUVERTURE', 'AUCUN', 'Décembre A-1'),
('ACTIVITE', 'ENC_A1_KIOSQUE', 'Encours Crédit kiosque au 31/12 A-1', 'CRÉDIT KIOSQUE DEC A-1', 67, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'OUVERTURE', 'AUCUN', 'Décembre A-1'),
('ACTIVITE', 'ENC_A1_CFE', 'Encours CFE au 31/12 A-1', 'CFE DEC A-1', 68, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'OUVERTURE', 'AUCUN', 'Décembre A-1'),
('ACTIVITE', 'ENC_A1_CDF', 'Encours CDF au 31/12 A-1', 'CDF DEC A-1', 69, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'OUVERTURE', 'AUCUN', 'Décembre A-1'),
('ACTIVITE', 'ENC_A1_VIRE', 'Encours Virés militaires au 31/12 A-1', 'VIRÉS MILITAIRES DEC A-1', 70, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'OUVERTURE', 'AUCUN', 'Décembre A-1'),
('ACTIVITE', 'ENC_A1_CMT', 'Encours CMT au 31/12 A-1', 'CMT DEC A-1', 71, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'OUVERTURE', 'AUCUN', 'Décembre A-1'),
('ACTIVITE', 'ENC_A1_ELUS', 'Encours Crédit élus au 31/12 A-1', 'CRÉDIT ÉLUS DEC A-1', 72, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'ENCOURS_PRODUIT', 'OUVERTURE', 'AUCUN', 'Décembre A-1'),
('ACTIVITE', 'NBE_TOTAL', 'Total crédits en cours', 'TOTAL', 73, 'CALCUL', 'NOMBRE', 'SOMME:NBE_PENSION,NBE_CAS,NBE_CC,NBE_INVEST,NBE_KIOSQUE,NBE_CFE,NBE_CDF,NBE_VIRE,NBE_CMT,NBE_ELUS', FALSE, NULL, NULL, 'NB_ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'NBE_PENSION', 'Crédits en cours Pension', 'PENSION', 74, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'NB_ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'NBE_CAS', 'Crédits en cours CAS', 'CAS', 75, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'NB_ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'NBE_CC', 'Crédits en cours CC', 'CC', 76, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'NB_ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'NBE_INVEST', 'Crédits en cours Investissement', 'INVESTISSEMENT', 77, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'NB_ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'NBE_KIOSQUE', 'Crédits en cours Crédit kiosque', 'CRÉDIT KIOSQUE', 78, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'NB_ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'NBE_CFE', 'Crédits en cours CFE', 'CFE', 79, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'NB_ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'NBE_CDF', 'Crédits en cours CDF', 'CDF', 80, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'NB_ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'NBE_VIRE', 'Crédits en cours Virés militaires', 'VIRÉS MILITAIRES', 81, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'NB_ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'NBE_CMT', 'Crédits en cours CMT', 'CMT', 82, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'NB_ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'NBE_ELUS', 'Crédits en cours Crédit élus', 'CRÉDIT ÉLUS', 83, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'NB_ENCOURS_PRODUIT', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'APU_TOTAL', 'Total recouvré', 'TOTAL', 84, 'CALCUL', 'MONTANT', 'SOMME:APU_CRS,APU_CAS,APU_CC,APU_ACM,APU_STOCK,APU_CFE,APU_CDF,APU_PART,APU_CMT,APU_CFDOM', FALSE, NULL, NULL, 'APURES', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'APU_CRS', 'Recouvrement apurés CRS', 'CRS', 85, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'APU_CAS', 'Recouvrement apurés CAS', 'CAS', 86, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'APU_CC', 'Recouvrement apurés CC', 'CC', 87, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'APU_ACM', 'Recouvrement apurés ACM', 'ACM', 88, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'APU_STOCK', 'Recouvrement apurés Stock', 'STOCK', 89, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'APU_CFE', 'Recouvrement apurés CFE', 'CFE', 90, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'APU_CDF', 'Recouvrement apurés CDF', 'CDF', 91, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'APU_PART', 'Recouvrement apurés Partenariat', 'PARTENARIAT', 92, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'APU_CMT', 'Recouvrement apurés CMT', 'CMT', 93, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'APU_CFDOM', 'Recouvrement apurés CF domiciliés', 'CF DOMICILIÉS', 94, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'APU_SOLDE_TOTAL', 'Solde des apurés au 31/12 A-1', 'SOLDE A-1', 95, 'CALCUL', 'MONTANT', 'SOMME:APU_SOLDE_CRS,APU_SOLDE_CAS,APU_SOLDE_CC,APU_SOLDE_ACM,APU_SOLDE_STOCK,APU_SOLDE_CFE,APU_SOLDE_CDF,APU_SOLDE_PART,APU_SOLDE_CMT,APU_SOLDE_CFDOM', FALSE, NULL, NULL, 'APURES', 'OUVERTURE', 'AUCUN', 'Solde au 31/12 A-1'),
('ACTIVITE', 'APU_SOLDE_CRS', 'Solde apurés CRS au 31/12 A-1', 'CRS SOLDE A-1', 96, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'OUVERTURE', 'AUCUN', 'Solde au 31/12 A-1'),
('ACTIVITE', 'APU_SOLDE_CAS', 'Solde apurés CAS au 31/12 A-1', 'CAS SOLDE A-1', 97, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'OUVERTURE', 'AUCUN', 'Solde au 31/12 A-1'),
('ACTIVITE', 'APU_SOLDE_CC', 'Solde apurés CC au 31/12 A-1', 'CC SOLDE A-1', 98, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'OUVERTURE', 'AUCUN', 'Solde au 31/12 A-1'),
('ACTIVITE', 'APU_SOLDE_ACM', 'Solde apurés ACM au 31/12 A-1', 'ACM SOLDE A-1', 99, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'OUVERTURE', 'AUCUN', 'Solde au 31/12 A-1'),
('ACTIVITE', 'APU_SOLDE_STOCK', 'Solde apurés Stock au 31/12 A-1', 'STOCK SOLDE A-1', 100, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'OUVERTURE', 'AUCUN', 'Solde au 31/12 A-1'),
('ACTIVITE', 'APU_SOLDE_CFE', 'Solde apurés CFE au 31/12 A-1', 'CFE SOLDE A-1', 101, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'OUVERTURE', 'AUCUN', 'Solde au 31/12 A-1'),
('ACTIVITE', 'APU_SOLDE_CDF', 'Solde apurés CDF au 31/12 A-1', 'CDF SOLDE A-1', 102, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'OUVERTURE', 'AUCUN', 'Solde au 31/12 A-1'),
('ACTIVITE', 'APU_SOLDE_PART', 'Solde apurés Partenariat au 31/12 A-1', 'PARTENARIAT SOLDE A-1', 103, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'OUVERTURE', 'AUCUN', 'Solde au 31/12 A-1'),
('ACTIVITE', 'APU_SOLDE_CMT', 'Solde apurés CMT au 31/12 A-1', 'CMT SOLDE A-1', 104, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'OUVERTURE', 'AUCUN', 'Solde au 31/12 A-1'),
('ACTIVITE', 'APU_SOLDE_CFDOM', 'Solde apurés CF domiciliés au 31/12 A-1', 'CF DOMICILIÉS SOLDE A-1', 105, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'APURES', 'OUVERTURE', 'AUCUN', 'Solde au 31/12 A-1'),
('ACTIVITE', 'RET_TOTAL', 'Total des retards', 'TOTAL RETARD', 106, 'CALCUL', 'MONTANT', 'SOMME:RET_CRS,RET_CAS,RET_CC,RET_ACM,RET_STOCK,RET_CFE,RET_CDF,RET_MOTO,RET_CMT,RET_CFDOM,RET_INTERETS', FALSE, NULL, 'Capital en retard par produit + intérêts', 'RETARDS', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'RET_CRS', 'Retard CRS', 'CRS', 107, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RETARDS', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'RET_CAS', 'Retard CAS', 'CAS', 108, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RETARDS', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'RET_CC', 'Retard CC', 'CC', 109, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RETARDS', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'RET_ACM', 'Retard ACM', 'ACM', 110, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RETARDS', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'RET_STOCK', 'Retard Stock', 'STOCK', 111, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RETARDS', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'RET_CFE', 'Retard CFE', 'CFE', 112, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RETARDS', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'RET_CDF', 'Retard CDF', 'CDF', 113, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RETARDS', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'RET_MOTO', 'Retard Moto Bajaj', 'MOTO BAJAJ', 114, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RETARDS', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'RET_CMT', 'Retard CMT', 'CMT', 115, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RETARDS', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'RET_CFDOM', 'Retard CF domiciliés', 'CF DOMICILIÉS', 116, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RETARDS', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'RET_INTERETS', 'Intérêts en retard', 'INTERETS', 117, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RETARDS', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'IMP_T0_NB', 'Nombre de prêts — À jour', 'NOMBRE DE PRÊTS', 118, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'À jour'),
('ACTIVITE', 'IMP_T0_CAP', 'Capital restant — À jour', 'CAPITAL RESTANT', 119, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'À jour'),
('ACTIVITE', 'IMP_T0_PCT', 'Part du capital — À jour', '%', 120, 'CALCUL', 'TAUX', 'IMP_T0_CAP/IMP_TOT_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'À jour'),
('ACTIVITE', 'IMP_T0_EG', 'Épargne de garantie — À jour', 'EPARGNE DE GARANTIE', 121, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'À jour'),
('ACTIVITE', 'IMP_T0_COUV', 'Principal couvert — À jour', '% DU PRINCIPAL COUVERT', 122, 'CALCUL', 'TAUX', 'IMP_T0_EG/IMP_T0_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'À jour'),
('ACTIVITE', 'IMP_T1_NB', 'Nombre de prêts — Retard de 1 à 30 jours', 'NOMBRE DE PRÊTS', 123, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 1 à 30 jours'),
('ACTIVITE', 'IMP_T1_CAP', 'Capital restant — Retard de 1 à 30 jours', 'CAPITAL RESTANT', 124, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 1 à 30 jours'),
('ACTIVITE', 'IMP_T1_PCT', 'Part du capital — Retard de 1 à 30 jours', '%', 125, 'CALCUL', 'TAUX', 'IMP_T1_CAP/IMP_TOT_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 1 à 30 jours'),
('ACTIVITE', 'IMP_T1_EG', 'Épargne de garantie — Retard de 1 à 30 jours', 'EPARGNE DE GARANTIE', 126, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 1 à 30 jours'),
('ACTIVITE', 'IMP_T1_COUV', 'Principal couvert — Retard de 1 à 30 jours', '% DU PRINCIPAL COUVERT', 127, 'CALCUL', 'TAUX', 'IMP_T1_EG/IMP_T1_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 1 à 30 jours'),
('ACTIVITE', 'IMP_T2_NB', 'Nombre de prêts — Retard de 31 à 60 jours', 'NOMBRE DE PRÊTS', 128, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 31 à 60 jours'),
('ACTIVITE', 'IMP_T2_CAP', 'Capital restant — Retard de 31 à 60 jours', 'CAPITAL RESTANT', 129, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 31 à 60 jours'),
('ACTIVITE', 'IMP_T2_PCT', 'Part du capital — Retard de 31 à 60 jours', '%', 130, 'CALCUL', 'TAUX', 'IMP_T2_CAP/IMP_TOT_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 31 à 60 jours'),
('ACTIVITE', 'IMP_T2_EG', 'Épargne de garantie — Retard de 31 à 60 jours', 'EPARGNE DE GARANTIE', 131, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 31 à 60 jours'),
('ACTIVITE', 'IMP_T2_COUV', 'Principal couvert — Retard de 31 à 60 jours', '% DU PRINCIPAL COUVERT', 132, 'CALCUL', 'TAUX', 'IMP_T2_EG/IMP_T2_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 31 à 60 jours'),
('ACTIVITE', 'IMP_T3_NB', 'Nombre de prêts — Retard de 61 à 90 jours', 'NOMBRE DE PRÊTS', 133, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 61 à 90 jours'),
('ACTIVITE', 'IMP_T3_CAP', 'Capital restant — Retard de 61 à 90 jours', 'CAPITAL RESTANT', 134, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 61 à 90 jours'),
('ACTIVITE', 'IMP_T3_PCT', 'Part du capital — Retard de 61 à 90 jours', '%', 135, 'CALCUL', 'TAUX', 'IMP_T3_CAP/IMP_TOT_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 61 à 90 jours'),
('ACTIVITE', 'IMP_T3_EG', 'Épargne de garantie — Retard de 61 à 90 jours', 'EPARGNE DE GARANTIE', 136, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 61 à 90 jours'),
('ACTIVITE', 'IMP_T3_COUV', 'Principal couvert — Retard de 61 à 90 jours', '% DU PRINCIPAL COUVERT', 137, 'CALCUL', 'TAUX', 'IMP_T3_EG/IMP_T3_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 61 à 90 jours'),
('ACTIVITE', 'IMP_T4_NB', 'Nombre de prêts — Retard de 91 à 120 jours', 'NOMBRE DE PRÊTS', 138, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 91 à 120 jours'),
('ACTIVITE', 'IMP_T4_CAP', 'Capital restant — Retard de 91 à 120 jours', 'CAPITAL RESTANT', 139, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 91 à 120 jours'),
('ACTIVITE', 'IMP_T4_PCT', 'Part du capital — Retard de 91 à 120 jours', '%', 140, 'CALCUL', 'TAUX', 'IMP_T4_CAP/IMP_TOT_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 91 à 120 jours'),
('ACTIVITE', 'IMP_T4_EG', 'Épargne de garantie — Retard de 91 à 120 jours', 'EPARGNE DE GARANTIE', 141, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 91 à 120 jours'),
('ACTIVITE', 'IMP_T4_COUV', 'Principal couvert — Retard de 91 à 120 jours', '% DU PRINCIPAL COUVERT', 142, 'CALCUL', 'TAUX', 'IMP_T4_EG/IMP_T4_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 91 à 120 jours'),
('ACTIVITE', 'IMP_T5_NB', 'Nombre de prêts — Retard de 121 à 180 jours', 'NOMBRE DE PRÊTS', 143, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 121 à 180 jours'),
('ACTIVITE', 'IMP_T5_CAP', 'Capital restant — Retard de 121 à 180 jours', 'CAPITAL RESTANT', 144, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 121 à 180 jours'),
('ACTIVITE', 'IMP_T5_PCT', 'Part du capital — Retard de 121 à 180 jours', '%', 145, 'CALCUL', 'TAUX', 'IMP_T5_CAP/IMP_TOT_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 121 à 180 jours'),
('ACTIVITE', 'IMP_T5_EG', 'Épargne de garantie — Retard de 121 à 180 jours', 'EPARGNE DE GARANTIE', 146, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 121 à 180 jours'),
('ACTIVITE', 'IMP_T5_COUV', 'Principal couvert — Retard de 121 à 180 jours', '% DU PRINCIPAL COUVERT', 147, 'CALCUL', 'TAUX', 'IMP_T5_EG/IMP_T5_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 121 à 180 jours'),
('ACTIVITE', 'IMP_T6_NB', 'Nombre de prêts — Retard de 181 à 365 jours', 'NOMBRE DE PRÊTS', 148, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 181 à 365 jours'),
('ACTIVITE', 'IMP_T6_CAP', 'Capital restant — Retard de 181 à 365 jours', 'CAPITAL RESTANT', 149, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 181 à 365 jours'),
('ACTIVITE', 'IMP_T6_PCT', 'Part du capital — Retard de 181 à 365 jours', '%', 150, 'CALCUL', 'TAUX', 'IMP_T6_CAP/IMP_TOT_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 181 à 365 jours'),
('ACTIVITE', 'IMP_T6_EG', 'Épargne de garantie — Retard de 181 à 365 jours', 'EPARGNE DE GARANTIE', 151, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 181 à 365 jours'),
('ACTIVITE', 'IMP_T6_COUV', 'Principal couvert — Retard de 181 à 365 jours', '% DU PRINCIPAL COUVERT', 152, 'CALCUL', 'TAUX', 'IMP_T6_EG/IMP_T6_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de 181 à 365 jours'),
('ACTIVITE', 'IMP_T7_NB', 'Nombre de prêts — Retard de plus de 365 jours', 'NOMBRE DE PRÊTS', 153, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de plus de 365 jours'),
('ACTIVITE', 'IMP_T7_CAP', 'Capital restant — Retard de plus de 365 jours', 'CAPITAL RESTANT', 154, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de plus de 365 jours'),
('ACTIVITE', 'IMP_T7_PCT', 'Part du capital — Retard de plus de 365 jours', '%', 155, 'CALCUL', 'TAUX', 'IMP_T7_CAP/IMP_TOT_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de plus de 365 jours'),
('ACTIVITE', 'IMP_T7_EG', 'Épargne de garantie — Retard de plus de 365 jours', 'EPARGNE DE GARANTIE', 156, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de plus de 365 jours'),
('ACTIVITE', 'IMP_T7_COUV', 'Principal couvert — Retard de plus de 365 jours', '% DU PRINCIPAL COUVERT', 157, 'CALCUL', 'TAUX', 'IMP_T7_EG/IMP_T7_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Retard de plus de 365 jours'),
('ACTIVITE', 'IMP_TOT_NB', 'Nombre de prêts — total', 'NOMBRE DE PRÊTS', 158, 'CALCUL', 'NOMBRE', 'SOMME:IMP_T0_NB,IMP_T1_NB,IMP_T2_NB,IMP_T3_NB,IMP_T4_NB,IMP_T5_NB,IMP_T6_NB,IMP_T7_NB', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Total'),
('ACTIVITE', 'IMP_TOT_CAP', 'Capital restant — total', 'CAPITAL RESTANT', 159, 'CALCUL', 'MONTANT', 'SOMME:IMP_T0_CAP,IMP_T1_CAP,IMP_T2_CAP,IMP_T3_CAP,IMP_T4_CAP,IMP_T5_CAP,IMP_T6_CAP,IMP_T7_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Total'),
('ACTIVITE', 'IMP_TOT_PCT', 'Part du capital — total', '%', 160, 'CALCUL', 'TAUX', 'IMP_TOT_CAP/IMP_TOT_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Total'),
('ACTIVITE', 'IMP_TOT_EG', 'Épargne de garantie — total', 'EPARGNE DE GARANTIE', 161, 'CALCUL', 'MONTANT', 'SOMME:IMP_T0_EG,IMP_T1_EG,IMP_T2_EG,IMP_T3_EG,IMP_T4_EG,IMP_T5_EG,IMP_T6_EG,IMP_T7_EG', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Total'),
('ACTIVITE', 'IMP_TOT_COUV', 'Principal couvert — total', '% DU PRINCIPAL COUVERT', 162, 'CALCUL', 'TAUX', 'IMP_TOT_EG/IMP_TOT_CAP', FALSE, NULL, NULL, 'IMPAYES', 'TRIMESTRIEL', 'AUCUN', 'Total'),
('ACTIVITE', 'EPA_TOTAL', 'Total encours épargne', 'TOTAL ENCOURS', 163, 'CALCUL', 'MONTANT', 'SOMME:EPA_TOTAL_EV,EPA_EG', FALSE, NULL, NULL, 'EPARGNE', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'EPA_DAV', 'Épargne DAV', 'DAV', 164, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'EPARGNE', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'EPA_PE', 'Épargne PE', 'PE', 165, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'EPARGNE', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'EPA_FONCT', 'Épargne Épargne fonctionnaire', 'ÉPARGNE FONCTIONNAIRE', 166, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'EPARGNE', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'EPA_DAT6', 'Épargne DAT 6', 'DAT 6', 167, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'EPARGNE', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'EPA_TONTINE', 'Épargne Tontine', 'TONTINE', 168, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'EPARGNE', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'EPA_FS', 'Épargne FS', 'FS', 169, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'EPARGNE', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'EPA_TOTAL_EV', 'Total épargne volontaire', 'TOTAL EV', 170, 'CALCUL', 'MONTANT', 'SOMME:EPA_DAV,EPA_PE,EPA_FONCT,EPA_DAT6,EPA_TONTINE,EPA_FS', FALSE, NULL, NULL, 'EPARGNE', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'EPA_EG', 'Épargne de garantie', 'EG', 171, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'EPARGNE', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'EPA_DAT_PE', 'Total DAT + PE', 'TOTAL DAT+PE', 172, 'CALCUL', 'MONTANT', 'SOMME:EPA_PE,EPA_DAT6', FALSE, NULL, NULL, 'EPARGNE', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'AUT_TRANSF_DR', 'Transfert à la DR', 'TRANSFERT À LA DR', 173, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'AUTRES', 'MENSUEL', 'SOMME', 'Relation avec la DR'),
('ACTIVITE', 'AUT_RECEPT_DR', 'Réception de la DR', 'RÉCEPTION DE LA DR', 174, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'AUTRES', 'MENSUEL', 'SOMME', 'Relation avec la DR'),
('ACTIVITE', 'AUT_ENVOIS', 'Envois', 'ENVOIS', 175, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'AUTRES', 'MENSUEL', 'SOMME', 'Transfert d’argent (montant)'),
('ACTIVITE', 'AUT_RECEPTION', 'Réception', 'RÉCEPTION', 176, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'AUTRES', 'MENSUEL', 'SOMME', 'Transfert d’argent (montant)'),
('ACTIVITE', 'AUT_FRAIS', 'Frais', 'FRAIS', 177, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'AUTRES', 'MENSUEL', 'SOMME', 'Transfert d’argent (montant)'),
('ACTIVITE', 'AUT_TONT_COLLECTE', 'Collecte', 'COLLECTE', 178, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'AUTRES', 'MENSUEL', 'SOMME', 'Tontine'),
('ACTIVITE', 'AUT_TONT_PAIEMENT', 'Paiement', 'PAIEMENT', 179, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'AUTRES', 'MENSUEL', 'SOMME', 'Tontine'),
('ACTIVITE', 'AUT_TONT_GAIN', 'Gain', 'GAIN', 180, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'AUTRES', 'MENSUEL', 'SOMME', 'Tontine'),
('ACTIVITE', 'AUT_INTERET_CREDIT', 'Intérêts crédit par mois', 'INTÉRÊTS CRÉDIT PAR MOIS', 181, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'AUTRES', 'MENSUEL', 'SOMME', 'Intérêts et charges'),
('ACTIVITE', 'AUT_CHARGE_FONCT', 'Charges de fonctionnement par mois', 'CHARGES DE FONCTIONNEMENT PAR MOIS', 182, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'AUTRES', 'MENSUEL', 'SOMME', 'Intérêts et charges'),
('ACTIVITE', 'AUT_FRAIS_GESTION30', '30 % des frais de gestion', '30 % DES FRAIS DE GESTION', 183, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'AUTRES', 'MENSUEL', 'SOMME', 'Intérêts et charges'),
('ACTIVITE', 'SOC_TOTAL', 'Total sociétariat', 'TOTAL SOCIETARIAT', 184, 'CALCUL', 'NOMBRE', 'SOMME:SOC_H,SOC_F,SOC_PM', FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'MOYENNE', 'Répartition par genre'),
('ACTIVITE', 'SOC_H', 'Sociétaires hommes', 'HOMMES', 185, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'MOYENNE', 'Répartition par genre'),
('ACTIVITE', 'SOC_F', 'Sociétaires femmes', 'FEMMES', 186, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'MOYENNE', 'Répartition par genre'),
('ACTIVITE', 'SOC_PM', 'Sociétaires personnes morales', 'PERSONNES MORALES', 187, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'MOYENNE', 'Répartition par genre'),
('ACTIVITE', 'SOC_ADHESION', 'Adhésions', 'ADHESION', 188, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'SOMME', 'Mouvements'),
('ACTIVITE', 'SOC_DEMISSION', 'Démissions', 'DEMISSION', 189, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'SOMME', 'Mouvements'),
('ACTIVITE', 'SOC_EMP_H', 'Emprunteurs actifs hommes', 'HOMMES', 190, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'MOYENNE', 'Emprunteurs actifs'),
('ACTIVITE', 'SOC_EMP_F', 'Emprunteurs actifs femmes', 'FEMMES', 191, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'MOYENNE', 'Emprunteurs actifs'),
('ACTIVITE', 'SOC_EMP_PM', 'Emprunteurs actifs personnes morales', 'PERSONNES MORALES', 192, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'MOYENNE', 'Emprunteurs actifs'),
('ACTIVITE', 'SOC_TAUX_REMB_A1', 'Taux de remboursement échéance A-1', 'A-1', 193, 'SAISIE', 'TAUX', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'MOYENNE', 'Taux de remboursement échéance'),
('ACTIVITE', 'SOC_TAUX_REMB', 'Taux de remboursement échéance', 'ANNEE', 194, 'SAISIE', 'TAUX', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'MOYENNE', 'Taux de remboursement échéance'),
('ACTIVITE', 'SOC_EPARG_H', 'Épargnants hommes', 'HOMMES', 195, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'MOYENNE', 'Épargnants'),
('ACTIVITE', 'SOC_EPARG_F', 'Épargnants femmes', 'FEMMES', 196, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'MOYENNE', 'Épargnants'),
('ACTIVITE', 'SOC_EPARG_PM', 'Épargnants personnes morales', 'PERSONNES MORALES', 197, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'MOYENNE', 'Épargnants'),
('ACTIVITE', 'SOC_ATT_H', 'Attentes hommes', 'HOMMES', 198, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'SOMME', 'Attentes'),
('ACTIVITE', 'SOC_ATT_F', 'Attentes femmes', 'FEMMES', 199, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'SOMME', 'Attentes'),
('ACTIVITE', 'SOC_ATT_PM', 'Attentes personnes morales', 'PERSONNES MORALES', 200, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'SOCIETARIAT', 'MENSUEL', 'SOMME', 'Attentes'),
('ACTIVITE', 'PER_DA_RA', 'DA / RA', 'DA / RA', 201, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PERSONNEL', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'PER_CHARGES_AC', 'Chargés de gestion + agents de crédit', 'CHARGÉS DE GESTION + AGENTS DE CRÉDIT', 202, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PERSONNEL', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'PER_CAISSIERS', 'Caissiers', 'CAISSIERS', 203, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PERSONNEL', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'PER_COLLAB', 'Collaborateurs', 'COLLABORATEURS', 204, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PERSONNEL', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'PER_GARDIENS', 'Gardiens', 'GARDIENS', 205, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PERSONNEL', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'PER_ELUS', 'Élus actifs', 'ÉLUS ACTIFS', 206, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PERSONNEL', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'PER_TOTAL', 'Nombre total', 'NBRE TOTAL', 207, 'CALCUL', 'NOMBRE', 'SOMME:PER_DA_RA,PER_CHARGES_AC,PER_CAISSIERS,PER_COLLAB,PER_GARDIENS,PER_ELUS', FALSE, NULL, NULL, 'PERSONNEL', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'PER_PRODUITS', 'Produits', 'PRODUITS', 208, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PERSONNEL', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PER_CHARGES', 'Charges', 'CHARGES', 209, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PERSONNEL', 'MENSUEL', 'SOMME', NULL),
('ACTIVITE', 'PER_COMMERCIAUX', 'Agents commerciaux + superviseurs', 'AGENTS COMMERCIAUX', 210, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PERSONNEL', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'PER_DIGITAUX', 'Agents digitaux', 'AGENTS DIGITAUX', 211, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'PERSONNEL', 'MENSUEL', 'MOYENNE', NULL),
('ACTIVITE', 'PAR_M_1_30', 'Montant en retard 1 à 30 jours', 'MONTANTS', 212, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PAR', 'TRIMESTRIEL', 'MOYENNE', '1 à 30 jours'),
('ACTIVITE', 'PAR_T_1_30', 'Taux 1 à 30 jours', 'TAUX', 213, 'CALCUL', 'TAUX', 'PAR_M_1_30/ENC_TOTAL', FALSE, NULL, NULL, 'PAR', 'TRIMESTRIEL', 'MOYENNE', '1 à 30 jours'),
('ACTIVITE', 'PAR_M_31_60', 'Montant en retard 31 à 60 jours', 'MONTANTS', 214, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PAR', 'TRIMESTRIEL', 'MOYENNE', '31 à 60 jours'),
('ACTIVITE', 'PAR_T_31_60', 'Taux 31 à 60 jours', 'TAUX', 215, 'CALCUL', 'TAUX', 'PAR_M_31_60/ENC_TOTAL', FALSE, NULL, NULL, 'PAR', 'TRIMESTRIEL', 'MOYENNE', '31 à 60 jours'),
('ACTIVITE', 'PAR_M_61_90', 'Montant en retard 61 à 90 jours', 'MONTANTS', 216, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PAR', 'TRIMESTRIEL', 'MOYENNE', '61 à 90 jours'),
('ACTIVITE', 'PAR_T_61_90', 'Taux 61 à 90 jours', 'TAUX', 217, 'CALCUL', 'TAUX', 'PAR_M_61_90/ENC_TOTAL', FALSE, NULL, NULL, 'PAR', 'TRIMESTRIEL', 'MOYENNE', '61 à 90 jours'),
('ACTIVITE', 'PAR_M_91_180', 'Montant en retard 91 à 180 jours', 'MONTANTS', 218, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PAR', 'TRIMESTRIEL', 'MOYENNE', '91 à 180 jours'),
('ACTIVITE', 'PAR_T_91_180', 'Taux 91 à 180 jours', 'TAUX', 219, 'CALCUL', 'TAUX', 'PAR_M_91_180/ENC_TOTAL', FALSE, NULL, NULL, 'PAR', 'TRIMESTRIEL', 'MOYENNE', '91 à 180 jours'),
('ACTIVITE', 'PAR_M_180P', 'Montant en retard Plus de 180 jours', 'MONTANTS', 220, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'PAR', 'TRIMESTRIEL', 'MOYENNE', 'Plus de 180 jours'),
('ACTIVITE', 'PAR_T_180P', 'Taux Plus de 180 jours', 'TAUX', 221, 'CALCUL', 'TAUX', 'PAR_M_180P/ENC_TOTAL', FALSE, NULL, NULL, 'PAR', 'TRIMESTRIEL', 'MOYENNE', 'Plus de 180 jours'),
('ACTIVITE', 'PAR_TAUX_RETARDS', 'Taux de retards', 'TAUX RETARDS', 222, 'CALCUL', 'TAUX', 'RET_TOTAL/ENC_TOTAL', FALSE, NULL, NULL, 'PAR', 'TRIMESTRIEL', 'MOYENNE', 'Taux de retards'),
('ACTIVITE', 'RAT_MT_MOYEN_DECAISSE', 'Montant moyen de crédit décaissé', 'MONTANT MOYEN DE CRÉDIT DÉCAISSÉ', 223, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RATIOS', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'RAT_MT_MOYEN_ENCOURS', 'Montant moyen de crédit en cours', 'MONTANT MOYEN DE CRÉDIT EN COURS', 224, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RATIOS', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'RAT_COUT_MOYEN', 'Coût moyen du crédit', 'COÛT MOYEN DU CRÉDIT', 225, 'SAISIE', 'MONTANT', NULL, FALSE, NULL, NULL, 'RATIOS', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'RAT_ACCROISSEMENT', 'Taux d’accroissement des octrois (A-1 à A)', 'TAUX D’ACCROISSEMENT DES OCTROIS (A-1 À A)', 226, 'SAISIE', 'TAUX', NULL, FALSE, NULL, NULL, 'RATIOS', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'RAT_RENDEMENT', 'Rendement du portefeuille', 'RENDEMENT DU PORTEFEUILLE', 227, 'SAISIE', 'TAUX', NULL, FALSE, NULL, NULL, 'RATIOS', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'RAT_IMPAYES', 'Ratio d’impayés', 'RATIO D’IMPAYÉS', 228, 'SAISIE', 'TAUX', NULL, FALSE, NULL, NULL, 'RATIOS', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'RAT_PRODUCTIVITE', 'Productivité des agents de crédit (prêts)', 'PRODUCTIVITÉ DES AGENTS DE CRÉDIT (PRÊTS)', 229, 'SAISIE', 'NOMBRE', NULL, FALSE, NULL, NULL, 'RATIOS', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'RAT_CHARGES_OP', 'Ratio charges opérationnelles', 'RATIO CHARGES OPÉRATIONNELLES', 230, 'SAISIE', 'TAUX', NULL, FALSE, NULL, NULL, 'RATIOS', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'RAT_EPARGNE_PORTEFEUILLE', 'Ratio épargne sur portefeuille de crédit', 'RATIO ÉPARGNE SUR PORTEFEUILLE DE CRÉDIT', 231, 'SAISIE', 'TAUX', NULL, FALSE, NULL, NULL, 'RATIOS', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'NOR_RENDEMENT', 'Rendement du portefeuille', 'RENDEMENT DU PORTEFEUILLE', 232, 'CALCUL', 'TAUX', 'REF:RAT_RENDEMENT', FALSE, NULL, 'Norme : 30 – 60 %', 'NORMES', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'NOR_CHARGES_OP', 'Ratio des charges opérationnelles', 'RATIO DES CHARGES OPÉRATIONNELLES', 233, 'CALCUL', 'TAUX', 'REF:RAT_CHARGES_OP', FALSE, NULL, 'Norme : ≤ 20 %', 'NORMES', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'NOR_PRODUCTIVITE', 'Ratio de productivité', 'RATIO DE PRODUCTIVITÉ', 234, 'CALCUL', 'NOMBRE', 'REF:RAT_PRODUCTIVITE', FALSE, NULL, 'Norme : 400 – 500 prêts', 'NORMES', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'NOR_PAR1', 'PAR 1', 'PAR 1', 235, 'CALCUL', 'TAUX', 'REF:PAR_T_1_30', FALSE, NULL, 'Norme : 10 %', 'NORMES', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'NOR_PAR30', 'PAR 30', 'PAR 30', 236, 'CALCUL', 'TAUX', 'REF:PAR_T_31_60', FALSE, NULL, 'Norme : 5 %', 'NORMES', 'TRIMESTRIEL', 'MOYENNE', NULL),
('ACTIVITE', 'NOR_PAR90', 'PAR 90', 'PAR 90', 237, 'CALCUL', 'TAUX', 'REF:PAR_T_91_180', FALSE, NULL, 'Norme : 2 %', 'NORMES', 'TRIMESTRIEL', 'MOYENNE', NULL)
ON CONFLICT (module, code) DO NOTHING;
