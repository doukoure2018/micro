# Documentation des Ratios Financiers - CRG Credit

## Vue d'ensemble

Les 6 ratios financiers sont calcules automatiquement a partir des donnees de la **Collecte** (Sections 3 a 9) via la fonction **Auto-remplir**, puis stockes dans les tables `analyse_bilan` et `analyse_rentabilite`. Les calculs finaux sont effectues dans les vues PostgreSQL `v_bilan_complet` et `v_rentabilite_complete`.

**Fichiers sources :**
- Backend calcul : `AnalyseFinanciereServiceImpl.java` (lignes 390-582)
- Backend requete SQL : `AnalyseFinanciereQuery.java` (lignes 686-705)
- Frontend affichage : `analyse-bilan-activite.component.ts` (lignes 1050-1114)
- Vues SQL : `V82__create_analyse_financiere_tables.sql`

---

## Tableau recapitulatif

| Ratio | Nom | Formule | Norme | Operateur |
|-------|-----|---------|-------|-----------|
| R1 | Capacite de remboursement | CDR / Echeance | >= 200% | >= |
| R2 | Solvabilite | Capitaux propres / Total Actif | >= 35% | >= |
| R3 | Liquidite a echeance | (Creances + Tresorerie) / Dettes CT | >= 100% | >= |
| R4 | Endettement | (Dettes totales + Credit) / (Total Actif + Credit) | < 50% | < |
| R5 | Dependance | Autres revenus / Revenus totaux | < 50% | < |
| R6 | Couverture garantie | Valeur garantie / Credit | > 150% | > |

---

## R.1 - Ratio de Capacite de Remboursement

### Formule
```
R1 = Capacite de Remboursement / Echeance mensuelle du credit
```

- **Sollicite** : CDR / echeance (montant demande)
- **Propose** : CDR / echeance_proposee (montant propose)

### SQL (AnalyseFinanciereQuery.java:687-690)
```sql
CASE WHEN COALESCE(d.echeance, 0) > 0
     THEN rentN.capacite_remboursement / d.echeance
     ELSE NULL END as "calcR1Sollicite"

CASE WHEN COALESCE(d.echeance_proposee, 0) > 0
     THEN rentN.capacite_remboursement / d.echeance_proposee
     ELSE NULL END as "calcR1Propose"
```

### Composante : Capacite de Remboursement (CDR)
Calculee dans la vue `v_rentabilite_complete` (V82:162-169) :
```
CDR = Cash-flow + Autres revenus hors activite
    = (Marge brute - Total 13 charges) + Autres revenus hors activite
```

#### Marge brute
```
Marge brute = Chiffre d'affaires x Taux de marge
```

Le **Chiffre d'affaires** est selectionne parmi 7 estimations selon l'hypothese choisie (Faible/Moyen/Eleve) :

| # | Estimation | Source collecte |
|---|-----------|-----------------|
| 1 | CA mensuel produits | **Section 4** : SUM(prix_vente x quantite) de `collecte_produit` |
| 2 | CA cyclique mensuel | **Section 3** : (CA_jour_fort x nb_jours_fort + CA_jour_moyen x nb_jours_moyen + CA_jour_faible x nb_jours_faible) x 4 |
| 3 | CA mensuel declare | **Section 3** : `ca_mensuel_declare` |
| 4 | CA fort mensuel | **Section 3** : `ca_jour_fort` x 28 |
| 5 | CA faible hebdo | **Section 3** : `ca_jour_faible` x 7 |
| 6 | CA hebdo pondere | Estimation 2 / 4 |
| 7 | CA hebdo declare | **Section 3** : `ca_hebdomadaire_declare` |

Le **Taux de marge** est selectionne parmi 4 options :

| Option | Source |
|--------|--------|
| % Recom. | **Section 4** : (SUM(prix_vente x qte) - SUM(cout_achat x qte)) / SUM(prix_vente x qte) x 100 |
| Fort % | **Section 4** : MAX((prix_vente - cout_achat) / prix_vente x 100) parmi les produits |
| Faible % | **Section 4** : MIN((prix_vente - cout_achat) / prix_vente x 100) parmi les produits |
| % Declar | **Section 4** : `taux_marge_declare` |

#### Total 13 charges d'exploitation
Toutes proviennent de la **Section 6** (charges entreprise) x facteur cycle :

| # | Charge | Champ collecte (Section 6) | Champ DB |
|---|--------|---------------------------|----------|
| 1 | Salaires | `salaireMontant` | `salaires` |
| 2 | Prelevement entrepreneur | **Section 7** (voir ci-dessous) | `prelevement_entrepreneur` |
| 3 | Loyers | `loyerMontant` | `loyers` |
| 4 | Transport | `transportAchatMontant` + `transportVenteMontant` + `transportDiversMontant` | `transport` |
| 5 | Electricite, eau, telephone | `telephoneMontant` + `electriciteMontant` + `eauMontant` | `electricite_eau_telephone` |
| 6 | Fournitures et autres besoins | `fournitureMontant` | `fournitures_autres_besoins` |
| 7 | Entretien et reparation | `entretienMontant` | `entretien_reparation` |
| 8 | Carburant et lubrifiants | `carburantMontant` | `carburant_lubrifiants` |
| 9 | Publicite et promotion | `publiciteMontant` | `publicite_promotion` |
| 10 | Impots et taxes | `impotsTaxesMontant` | `impots_taxes` |
| 11 | Frais bancaires, interets | `fraisBancairesMontant` + `interetsEmpruntsMontant` | `frais_bancaires_interets` |
| 12 | Echeance autre credit | `echeanceAutreCreditMontant` | `echeance_autre_credit` |
| 13 | Diverses charges | `assuranceMontant` + `honorairesMontant` + `autresChargesMontant` | `diverses_charges` |

> **Note** : Toutes les charges mensuelles sont multipliees par le **facteur du cycle d'affaires** (ex: x12 pour cycle annuel, x1 pour mensuel).

#### Prelevement de l'entrepreneur (charge #2)
Logique conditionnelle depuis la **Section 7** (charges personnelles) :
- Si `depensesPreleveesActivite = OUI` (Section 7, question k) :
  ```
  = alimentationMontant + loyerResidenceMontant + transportPriveMontant
    + electriciteEauCommMontant + habillementMontant + fraisMedicauxMontant
    + echeanceCreditPersoMontant + scolariteMontant + travauxConstructionMontant
    + autresChargesPersoMontant
  ```
  (x facteur cycle)
- Sinon si `salaireFixe = OUI` (Section 7) :
  ```
  = salaireMontant (Section 7)
  ```
  (x facteur cycle)
- Sinon : **0**

#### Amortissements et provisions
Source : Table `collecte_amortissement` (Etape Amortissements)
```
= SUM(amortissement_mensuel) WHERE statut_amortissement = 'En cours'
```
(x facteur cycle)

#### Autres revenus hors activite
Voir details dans **R.5** ci-dessous.

### Composante : Echeance
Source : Table `demandeindividuel`
- `echeance` : echeance calculee sur le montant demande (sollicite)
- `echeance_proposee` : echeance calculee sur le montant propose

### Norme
**>= 200%** (>= 2.0) : La CDR doit etre au moins 2 fois l'echeance mensuelle.

---

## R.2 - Ratio de Solvabilite

### Formule
```
R2 = Capitaux propres / Total Actif
```

### SQL (AnalyseFinanciereQuery.java:691-692)
```sql
CASE WHEN COALESCE(bilN.total_actif, 0) > 0
     THEN bilN.capitaux_propres / bilN.total_actif
     ELSE NULL END as "calcR2"
```

### Composante : Total Actif
Calcule dans la vue `v_bilan_complet` :
```
Total Actif = Immobilisations + Stocks + Creances clients + Tresorerie (caisse+banque)
```

| Element | Source collecte (Section 5) | Champ DB |
|---------|---------------------------|----------|
| Terrain | `terrainValeur` | `terrain` |
| Batiments et magasin | VNC depuis `collecte_amortissement` (type='Batiments et magasin') | `batiment_magasin` |
| Installations et agencements | VNC depuis `collecte_amortissement` (type='Installations et agencements') | `installation_agencement` |
| Materiels industriels | VNC depuis `collecte_amortissement` (type='Materiels industriels') | `materiel_industriel` |
| Mobilier de bureau | VNC depuis `collecte_amortissement` (type='Mobilier de bureau') | `mobilier_bureau` |
| Materiel informatique | VNC depuis `collecte_amortissement` (type='Materiel informatique') | `materiel_informatique` |
| Materiel de transport | VNC depuis `collecte_amortissement` (type='Materiel de transport') | `materiel_transport` |
| Autres immobilisations | Section 5 : `cautionFinanciereValeur` + `pretEmployeValeur` | `autre_immobilisation` |
| Stocks | Section 5 : `stockValeurEstimee` ou SUM(`collecte_stock_article`.valeur_stock) | `stocks` |
| Creances clients | Section 5 : `creanceMoins3Mois` + `creancePlus3Mois` | `creances_clients` |
| Tresorerie (caisse+banque) | Section 5 : `cashValeur` + `compteCrgValeur` + `tontinierValeur` + `compteBanqueValeur` | `tresorerie_caisse_banque` |

### Composante : Capitaux propres
```
Capitaux propres = Total Actif - Total Dettes
Total Dettes = Emprunt long terme + Emprunt court terme + Autres dettes
```

| Element | Source collecte (Section 5) | Champ DB |
|---------|---------------------------|----------|
| Emprunt a + d'1 an | `empruntBancaireLtValeur` (question q) | `emprunt_long_terme` |
| Emprunt a - d'1 an | `empruntBancaireCtValeur` (question r) | `emprunt_court_terme` |
| Autres dettes | Somme de 7 champs (voir detail ci-dessous) | `autres_dettes` |

**Detail "Autres dettes"** (Section 5, questions s a y) :
```
Autres dettes = avanceClientValeur (s)
              + detteFournisseurValeur (t)
              + impotNonPayeValeur (u)
              + loyerNonPayeValeur (v)
              + factureNonPayeeValeur (w)
              + tontineDetteValeur (x)
              + autreDetteValeur (y)
```

### Norme
**>= 35%** (>= 0.35) : Les capitaux propres doivent representer au moins 35% du total actif.

---

## R.3 - Ratio de Liquidite a Echeance

### Formule
```
R3 = (Creances clients + Tresorerie) / (Emprunt court terme + Autres dettes)
```

### SQL (AnalyseFinanciereQuery.java:693-694)
```sql
CASE WHEN (COALESCE(bilN.emprunt_court_terme, 0) + COALESCE(bilN.autres_dettes, 0)) > 0
     THEN (bilN.creances_clients + bilN.tresorerie_caisse_banque)
        / (bilN.emprunt_court_terme + bilN.autres_dettes)
     ELSE NULL END as "calcR3"
```

### Composantes

**Numerateur :**

| Element | Source collecte (Section 5) |
|---------|---------------------------|
| Creances clients | `creanceMoins3Mois` + `creancePlus3Mois` |
| Tresorerie (caisse+banque) | `cashValeur` + `compteCrgValeur` + `tontinierValeur` + `compteBanqueValeur` |

**Denominateur :**

| Element | Source collecte (Section 5) |
|---------|---------------------------|
| Emprunt court terme | `empruntBancaireCtValeur` (question r) |
| Autres dettes | Somme des 7 champs (questions s a y) - voir detail R2 |

### Norme
**>= 100%** (>= 1.0) : Les actifs liquides doivent couvrir les dettes a court terme.

> **Note** : Si le denominateur = 0 (pas de dettes CT), le ratio est NULL (information manquante).

---

## R.4 - Ratio d'Endettement

### Formule
```
R4 = (Dettes totales + Credit demande) / (Total Actif + Credit demande)
```

- **Sollicite** : utilise `montant_demande`
- **Propose** : utilise `montant_propose`

### SQL (AnalyseFinanciereQuery.java:695-698)
```sql
-- Sollicite
CASE WHEN (COALESCE(bilN.total_actif, 0) + COALESCE(d.montant_demande, 0)) > 0
     THEN (bilN.total_dettes + d.montant_demande)
        / (bilN.total_actif + d.montant_demande)
     ELSE NULL END as "calcR4Sollicite"

-- Propose
CASE WHEN (COALESCE(bilN.total_actif, 0) + COALESCE(d.montant_propose, 0)) > 0
     THEN (bilN.total_dettes + COALESCE(d.montant_propose, 0))
        / (bilN.total_actif + COALESCE(d.montant_propose, 0))
     ELSE NULL END as "calcR4Propose"
```

### Composantes

| Element | Source |
|---------|--------|
| Dettes totales | `v_bilan_complet` : emprunt_long_terme + emprunt_court_terme + autres_dettes (Section 5) |
| Total Actif | `v_bilan_complet` : voir detail dans R2 (Section 5 + Amortissements) |
| Montant demande | `demandeindividuel.montant_demande` |
| Montant propose | `demandeindividuel.montant_propose` |

### Norme
**< 50%** (< 0.5) : L'endettement total (incluant le nouveau credit) ne doit pas depasser 50% de l'actif total.

---

## R.5 - Ratio de Dependance

### Formule
```
R5 = Autres revenus hors activite / Revenus totaux
```
Ou : **Revenus totaux = Resultat d'exploitation + Autres revenus hors activite**

### SQL (AnalyseFinanciereQuery.java:699-700)
```sql
CASE WHEN (COALESCE(rentN.resultat_exploitation, 0)
         + COALESCE(rentN.autres_revenus_hors_activite, 0)) > 0
     THEN rentN.autres_revenus_hors_activite
        / (rentN.resultat_exploitation + rentN.autres_revenus_hors_activite)
     ELSE NULL END as "calcR5"
```

### Composante Numerateur : Autres revenus hors activite
Source : **Section 8** de la collecte (Evaluation des autres revenus mensuels de l'entrepreneur)

| # | Question collecte | Champ formulaire | Champ DB (collecte_autre_revenu) |
|---|-------------------|-----------------|----------------------------------|
| a) | Salaire et remunerations en tant que salarie | `salaireExterneMontant` | `salaire_externe_montant` |
| b) | Loyers percus | `loyersPercusMontant` | `loyers_percus_montant` |
| c) | Revenus issus d'activites secondaires | `activiteSecondaireMontant` | `activite_secondaire_montant` |
| d) | Autres revenus | `autresRevenusMontant` | `autres_revenus_montant` |

**Calcul backend** (`AnalyseFinanciereServiceImpl.java:579-582`) :
```java
autresRevenusHorsActivite = salaireExterneMontant
                          + loyersPercusMontant
                          + activiteSecondaireMontant
                          + autresRevenusMontant
```

> **Important** : Les autres revenus ne sont **PAS** multiplies par le facteur du cycle d'affaires (valeurs mensuelles directes).

### Composante Denominateur : Resultat d'exploitation
Calcule dans la vue `v_rentabilite_complete` (V82:141-149) :
```
Resultat d'exploitation = Marge brute - (Total 13 charges + Amortissements)
```
- **Marge brute** = Chiffre d'affaires x Taux de marge (voir R1 pour les details)
- **Total 13 charges** = Somme des charges de la **Section 6** (voir R1 pour les details)
- **Amortissements** = SUM(amortissement_mensuel) des immobilisations en cours (etape Amortissements)

### Norme
**< 50%** (< 0.5) : Moins de 50% des revenus totaux doivent provenir de sources exterieures a l'activite. Un ratio faible est positif car cela montre que l'activite est autonome.

### Exemple de calcul (fichier Excel de reference)
```
Autres revenus           =   2 500 000 GNF
Resultat d'exploitation  = 139 770 417 GNF
Revenus totaux           = 142 270 417 GNF

R5 = 2 500 000 / 142 270 417 = 0.0176 = 1.76%  =>  CONFORME (< 50%)
```

---

## R.6 - Ratio de Couverture de la Garantie

### Formule
```
R6 = Valeur totale des garanties / Credit
```

- **Sollicite** : Valeur garanties / montant_demande
- **Propose** : Valeur garanties / montant_propose

### SQL (AnalyseFinanciereQuery.java:702-705)
```sql
-- Sollicite
CASE WHEN COALESCE(d.montant_demande, 0) > 0
     THEN COALESCE(gar.total_valeur_emprunte, 0) / d.montant_demande
     ELSE NULL END as "calcR6Sollicite"

-- Propose
CASE WHEN COALESCE(d.montant_propose, 0) > 0
     THEN COALESCE(gar.total_valeur_emprunte, 0) / d.montant_propose
     ELSE NULL END as "calcR6Propose"
```

### Composantes

| Element | Source |
|---------|--------|
| Valeur totale garanties | `SUM(valeur_emprunte) FROM garantie_propose WHERE demandeindividuel_id = :id` |
| Montant demande | `demandeindividuel.montant_demande` |
| Montant propose | `demandeindividuel.montant_propose` |

La table `garantie_propose` est alimentee depuis l'ecran **Garanties** du detail de la demande. Chaque garantie a un champ `valeur_emprunte` qui represente la valeur estimee par l'agent de credit.

### Norme
**> 150%** (> 1.5) : La valeur des garanties doit couvrir au moins 150% du montant du credit.

---

## Schema de flux des donnees

```
COLLECTE DES DONNEES
====================

Section 3 (CA)  ─────────────────────┐
Section 4 (Marge brute / Produits) ──┤
                                     ├──> Auto-remplir ──> analyse_rentabilite
Section 6 (Charges entreprise) ──────┤       │                    │
Section 7 (Charges personnelles) ────┤       │                    │
Section 8 (Autres revenus) ──────────┘       │                    v
                                             │          v_rentabilite_complete
Section 5 (Actifs / Passifs) ────────────────┤    (resultat_exploitation,
Amortissements (VNC par type) ───────────────┤     capacite_remboursement,
                                             │     autres_revenus_hors_activite)
                                             │
                                             ├──> analyse_bilan
                                             │         │
                                             │         v
                                             │    v_bilan_complet
                                             │    (total_actif, capitaux_propres,
                                             │     total_dettes)
                                             │
                                             v
                                     CALCUL DES RATIOS
                                     (SELECT_SYNTHESE_BY_DEMANDE)
                                             │
                                    ┌────────┼────────┐
                                    v        v        v
                                R1,R5    R2,R3,R4    R6
                              (rentN)    (bilN)    (garantie_propose)
                                    │        │        │
                                    v        v        v
                              Tableau des ratios (frontend)
```

## Requete SQL de verification

Pour verifier tous les ratios d'une demande (ex: id=15) :

```sql
SELECT
    -- R1
    CASE WHEN COALESCE(d.echeance, 0) > 0
         THEN rentN.capacite_remboursement / d.echeance END AS "R1 Sollicite",
    CASE WHEN COALESCE(d.echeance_proposee, 0) > 0
         THEN rentN.capacite_remboursement / d.echeance_proposee END AS "R1 Propose",
    rentN.capacite_remboursement AS "CDR",
    d.echeance AS "Echeance sollicite",
    d.echeance_proposee AS "Echeance propose",

    -- R2
    CASE WHEN bilN.total_actif > 0
         THEN bilN.capitaux_propres / bilN.total_actif END AS "R2",
    bilN.capitaux_propres AS "Capitaux propres",
    bilN.total_actif AS "Total Actif",

    -- R3
    CASE WHEN (bilN.emprunt_court_terme + bilN.autres_dettes) > 0
         THEN (bilN.creances_clients + bilN.tresorerie_caisse_banque)
            / (bilN.emprunt_court_terme + bilN.autres_dettes) END AS "R3",

    -- R4
    CASE WHEN (bilN.total_actif + d.montant_demande) > 0
         THEN (bilN.total_dettes + d.montant_demande)
            / (bilN.total_actif + d.montant_demande) END AS "R4 Sollicite",

    -- R5
    CASE WHEN (rentN.resultat_exploitation + rentN.autres_revenus_hors_activite) > 0
         THEN rentN.autres_revenus_hors_activite
            / (rentN.resultat_exploitation + rentN.autres_revenus_hors_activite) END AS "R5",
    rentN.autres_revenus_hors_activite AS "Autres revenus",
    rentN.resultat_exploitation AS "Resultat exploitation",

    -- R6
    CASE WHEN d.montant_demande > 0
         THEN COALESCE(gar.total_valeur_emprunte, 0) / d.montant_demande END AS "R6 Sollicite"

FROM analyse_financiere af
JOIN demandeindividuel d ON d.demandeindividuel_id = af.demandeindividuel_id
LEFT JOIN v_bilan_complet bilN ON bilN.analyse_id = af.analyse_id AND bilN.type_periode = 'N'
LEFT JOIN v_rentabilite_complete rentN ON rentN.analyse_id = af.analyse_id AND rentN.type_periode = 'N'
LEFT JOIN (
    SELECT demandeindividuel_id, SUM(COALESCE(valeur_emprunte, 0)) as total_valeur_emprunte
    FROM garantie_propose
    GROUP BY demandeindividuel_id
) gar ON gar.demandeindividuel_id = af.demandeindividuel_id
WHERE af.demandeindividuel_id = 15;
```
