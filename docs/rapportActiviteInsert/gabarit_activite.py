# -*- coding: utf-8 -*-
"""
Gabarit du classeur « IND MENSUELS ET TRIMESTRIELS » / « RAPPORT FORECARIAH » : ou se trouve,
dans une feuille de point de service, la valeur de chaque rubrique SAISIE du module ACTIVITE
(referentiel V168). Les lignes et colonnes sont en base 0, comme les lit xlrd/openpyxl.

Le meme gabarit a servi a ecrire le referentiel V168 : il est donc l'inverse exact de l'export
Excel du module (RapportActiviteExcelUtils). Les rubriques de nature CALCUL ne figurent pas ici,
digi les recalcule (plusieurs totaux et taux des classeurs sont faux : formule etiree, #DIV/0!).
"""

# --- blocs « une ligne par mois », la rubrique est en colonne ------------------------------
# (ligne de janvier, {colonne: code})
MOIS_LIGNES = [
    (5,   {3: 'OCT_CRS', 4: 'OCT_CAS', 5: 'OCT_CC', 6: 'OCT_KIOSQUE', 7: 'OCT_PENSION',
           8: 'OCT_CFE', 9: 'OCT_CDF', 10: 'OCT_MOTO', 11: 'OCT_CMT', 12: 'OCT_CFDOM',
           13: 'OCT_NB'}),
    (53,  {2: 'SEC_OCT_AGRI', 3: 'SEC_OCT_COM', 4: 'SEC_OCT_TP', 5: 'SEC_OCT_TRANSP',
           6: 'SEC_OCT_ARTIS', 7: 'SEC_OCT_KIOSQUE', 8: 'SEC_ENC_AGRI', 9: 'SEC_ENC_COM',
           10: 'SEC_ENC_TP', 11: 'SEC_ENC_TRANSP', 12: 'SEC_ENC_ELUS', 13: 'SEC_ENC_MOTO'}),
    (71,  {3: 'ENC_PENSION', 4: 'ENC_CAS', 5: 'ENC_CC', 6: 'ENC_INVEST', 7: 'ENC_KIOSQUE',
           8: 'ENC_CFE', 9: 'ENC_CDF', 10: 'ENC_VIRE', 11: 'ENC_CMT', 12: 'ENC_ELUS'}),
    (87,  {3: 'NBE_PENSION', 4: 'NBE_CAS', 5: 'NBE_CC', 6: 'NBE_INVEST', 7: 'NBE_KIOSQUE',
           8: 'NBE_CFE', 9: 'NBE_CDF', 10: 'NBE_VIRE', 11: 'NBE_CMT', 12: 'NBE_ELUS'}),
    (105, {2: 'APU_CRS', 3: 'APU_CAS', 4: 'APU_CC', 5: 'APU_ACM', 6: 'APU_STOCK',
           7: 'APU_CFE', 8: 'APU_CDF', 9: 'APU_PART', 10: 'APU_CMT', 11: 'APU_CFDOM'}),
    (123, {3: 'RET_CRS', 4: 'RET_CAS', 5: 'RET_CC', 6: 'RET_ACM', 7: 'RET_STOCK',
           8: 'RET_CFE', 9: 'RET_CDF', 10: 'RET_MOTO', 11: 'RET_CMT', 12: 'RET_CFDOM',
           13: 'RET_INTERETS'}),
    (169, {3: 'EPA_DAV', 4: 'EPA_PE', 5: 'EPA_FONCT', 6: 'EPA_DAT6', 7: 'EPA_TONTINE',
           8: 'EPA_FS', 10: 'EPA_EG'}),
    (186, {2: 'AUT_TRANSF_DR', 3: 'AUT_RECEPT_DR', 4: 'AUT_ENVOIS', 5: 'AUT_RECEPTION',
           6: 'AUT_FRAIS', 7: 'AUT_TONT_COLLECTE', 8: 'AUT_TONT_PAIEMENT', 9: 'AUT_TONT_GAIN',
           10: 'AUT_INTERET_CREDIT', 11: 'AUT_CHARGE_FONCT', 12: 'AUT_FRAIS_GESTION30'}),
    (204, {3: 'SOC_H', 4: 'SOC_F', 5: 'SOC_PM', 6: 'SOC_ADHESION', 7: 'SOC_DEMISSION',
           8: 'SOC_EMP_H', 9: 'SOC_EMP_F', 10: 'SOC_EMP_PM', 11: 'SOC_TAUX_REMB_A1',
           12: 'SOC_TAUX_REMB', 13: 'SOC_EPARG_H', 14: 'SOC_EPARG_F', 15: 'SOC_EPARG_PM',
           16: 'SOC_ATT_H', 17: 'SOC_ATT_F', 18: 'SOC_ATT_PM'}),
    (220, {1: 'PER_DA_RA', 2: 'PER_CHARGES_AC', 3: 'PER_CAISSIERS', 4: 'PER_COLLAB',
           5: 'PER_GARDIENS', 6: 'PER_ELUS', 8: 'PER_PRODUITS', 9: 'PER_CHARGES',
           10: 'PER_COMMERCIAUX', 11: 'PER_DIGITAUX'}),
]

# --- blocs « une ligne par rubrique, un mois par colonne » ---------------------------------
# (ligne, code) ; janvier en colonne 3, decembre en colonne 14
MOIS_COLONNES_COL_JANVIER = 3
MOIS_COLONNES = [
    (21, 'GEN_F_NB'), (22, 'GEN_F_MT'), (23, 'GEN_H_NB'), (24, 'GEN_H_MT'),
    (25, 'GEN_PM_NB'), (26, 'GEN_PM_MT'), (27, 'GEN_RUR_NB'), (28, 'GEN_RUR_MT'),
    (35, 'PRD_AGRI_NB'), (36, 'PRD_AGRI_MT'), (37, 'PRD_COM_NB'), (38, 'PRD_COM_MT'),
    (39, 'PRD_FONCT_NB'), (40, 'PRD_FONCT_MT'), (41, 'PRD_CMT_NB'), (42, 'PRD_CMT_MT'),
    (43, 'PRD_PME_NB'), (44, 'PRD_PME_MT'), (45, 'PRD_AUTRE_NB'), (46, 'PRD_AUTRE_MT'),
]

# --- rubriques OUVERTURE : portees par le rapport de janvier -------------------------------
# (ligne, {colonne: code})
OUVERTURE = [
    (70,  {3: 'ENC_A1_PENSION', 4: 'ENC_A1_CAS', 5: 'ENC_A1_CC', 6: 'ENC_A1_INVEST',
           7: 'ENC_A1_KIOSQUE', 8: 'ENC_A1_CFE', 9: 'ENC_A1_CDF', 10: 'ENC_A1_VIRE',
           11: 'ENC_A1_CMT', 12: 'ENC_A1_ELUS'}),
    (104, {2: 'APU_SOLDE_CRS', 3: 'APU_SOLDE_CAS', 4: 'APU_SOLDE_CC', 5: 'APU_SOLDE_ACM',
           6: 'APU_SOLDE_STOCK', 7: 'APU_SOLDE_CFE', 8: 'APU_SOLDE_CDF',
           9: 'APU_SOLDE_PART', 10: 'APU_SOLDE_CMT', 11: 'APU_SOLDE_CFDOM'}),
]

# --- structure des impayes : une photographie par trimestre, deux blocs par bande de lignes
# {mois de fin de trimestre: (ligne « A JOUR », colonne « NOMBRE DE PRETS »)}
IMPAYES_BLOCS = {3: (143, 1), 6: (143, 6), 9: (155, 1), 12: (155, 6)}
IMPAYES_TRANCHES = ['IMP_T0', 'IMP_T1', 'IMP_T2', 'IMP_T3', 'IMP_T4', 'IMP_T5', 'IMP_T6', 'IMP_T7']
IMPAYES_COLONNES = {0: '_NB', 1: '_CAP', 3: '_EG'}   # 2 = %, 4 = % couvert : calcules

# --- blocs trimestriels en lignes (1er..4e trimestre) --------------------------------------
# (ligne du 1er trimestre, {colonne: code})
TRIMESTRE_LIGNES = [
    (238, {1: 'PAR_M_1_30', 3: 'PAR_M_31_60', 5: 'PAR_M_61_90', 7: 'PAR_M_91_180',
           9: 'PAR_M_180P'}),
    (246, {1: 'RAT_MT_MOYEN_DECAISSE', 2: 'RAT_MT_MOYEN_ENCOURS', 3: 'RAT_COUT_MOYEN',
           4: 'RAT_ACCROISSEMENT', 5: 'RAT_RENDEMENT', 6: 'RAT_IMPAYES',
           7: 'RAT_PRODUCTIVITE', 8: 'RAT_CHARGES_OP', 9: 'RAT_EPARGNE_PORTEFEUILLE'}),
]

# Ancres de conformite : (ligne, colonne, debuts acceptes du libelle normalise).
# Onze feuilles ont un en-tete retape (« TRANSFERT A L'AGENCE », colonne CRS ecrasee) :
# le quadrillage des valeurs est le meme, seul le titre differe.
ANCRES = [
    (4, 2, ('TOTALOCTROIS',)), (4, 13, ('NBREDECREDIT',)),
    (20, 3, ('JANVIER',)), (34, 3, ('JANVIER',)),
    (52, 1, ('TOTALOCTROIS',)), (52, 14, ('TOTALENCOURS',)),
    (69, 2, ('TOTALENCOURS',)), (70, 1, ('DECEMBREA1',)),
    (86, 2, ('TOTALENCOURS',)),
    (104, 0, ('SOLDEDESAPURES',)),
    (122, 2, ('TOTALRETARD',)), (122, 13, ('INTERETS',)),
    (142, 1, ('NOMBREDEPRETS',)), (154, 1, ('NOMBREDEPRETS',)),
    (168, 3, ('DAV',)), (168, 10, ('EG',)),
    (185, 2, ('TRANSFERTALADR', 'TRANSFERTALAGENCE')),
    (203, 2, ('TOTALSOCIETARIAT',)), (203, 18, ('PM',)),
    (219, 1, ('DARA',)), (219, 11, ('AGENTSDIGITAUX',)),
    (236, 1, ('1A30JOURS',)), (245, 1, ('MONTANTSMOYENS',)),
]
