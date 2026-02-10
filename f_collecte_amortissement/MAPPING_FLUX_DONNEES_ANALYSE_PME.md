# MAPPING FLUX DE DONNEES - ANALYSE CREDIT PME

> Ce document decrit le flux de donnees entre les onglets Excel: Collecte des donnees -> CRG (intermediaire) -> Analyse (Bilan, Rentabilite, Besoin de credit, Ratios).

## Architecture du flux

```
Collecte des donnees  ──────────┐
                                ├──> CRG (calculs intermediaires) ──> Analyse
Amorts (amortissements) ────────┘       colonne W = valeurs                |
                                        colonne Y = CA recommande          |
                                                                           v
                                                          ┌────────────────────────┐
                                                          │ 1. Bilan               │
                                                          │ 2. Rentabilite         │
                                                          │ 3. Besoin de credit    │
                                                          │ 4. Ratios de decision  │
                                                          └────────────────────────┘
```

**Note**: La feuille `CRG` sert de feuille intermediaire. L'onglet `Analyse` ne lit quasiment jamais directement `Collecte des donnees` - il passe par `CRG!W*`.

**Facteur de cycle** : `CRG!AC9` = nombre de mois par cycle (1=Mensuelle, 2=Bimestrielle, 3=Trimestrielle, etc.). Les charges mensuelles sont multipliees par ce facteur pour les ramener au cycle de l'activite.

---

## 1. BILAN (Analyse lignes 11-34) <-- Sources

### 1.1 ACTIF

| Ligne Analyse | Libelle | Formule Excel (Analyse) | Source CRG | Source Finale (Collecte/Amorts) |
|---------------|---------|-------------------------|------------|--------------------------------|
| I13 | **Total Immobilisations** | `=SUM(I14:K21)` | Somme des VNC | Calcule |
| I14 | Terrains | `=IF(CRG!W39="",0,CRG!W39)` | `CRG!W39 = 'Collecte'!P76` | **collecte_actif_passif.terrain_valeur** |
| I15 | Batiments et magasin | `=IF(CRG!W40="",0,CRG!W40)` | `CRG!W40 = SUMIFS(Amorts!$K$6:$K$105, Amorts!$D$6:$D$105, "Batiments et magasin")` | **SUM(amortissement.valeur_nette_comptable) WHERE type = 'Batiments et magasin'** |
| I16 | Installations et agencements | `=IF(CRG!W41="",0,CRG!W41)` | `CRG!W41 = SUMIFS(Amorts!$K$6:$K$105, Amorts!$D$6:$D$105, "Installations et agencements")` | **SUM(amortissement.VNC) WHERE type = 'Installations et agencements'** |
| I17 | Materiels industriels | `=IF(CRG!W42="",0,CRG!W42)` | `CRG!W42 = SUMIFS(Amorts!$K$6:$K$105, Amorts!$D$6:$D$105, "Materiels industriels")` | **SUM(amortissement.VNC) WHERE type = 'Materiels industriels'** |
| I18 | Mobilier de bureau | `=IF(CRG!W43="",0,CRG!W43)` | `CRG!W43 = SUMIFS(...)` | **SUM(amortissement.VNC) WHERE type = 'Mobilier de bureau'** |
| I19 | Materiel informatique | `=IF(CRG!W44="",0,CRG!W44)` | `CRG!W44 = SUMIFS(...)` | **SUM(amortissement.VNC) WHERE type = 'Materiel informatique'** |
| I20 | Materiel de transport | `=IF(CRG!W45="",0,CRG!W45)` | `CRG!W45 = SUMIFS(...)` | **SUM(amortissement.VNC) WHERE type = 'Materiel de transport'** |
| I21 | Autres immobilisations | `=IF(CRG!W46="",0,CRG!W46)` | `CRG!W46 = 'Collecte'!P94 + 'Collecte'!P97` | **collecte_actif_passif.caution_financiere_valeur + pret_employe_valeur** |
| I22 | **Stocks** | `=IF(CRG!W47="",0,CRG!W47)` | `CRG!W47 = IF(evaluer_detail="OUI", total_stock_articles, stock_valeur_estimee)` | **collecte_actif_passif.stock** (estimee ou calcule) |
| I23 | **Creances, Clients** | `=IF(CRG!W48="",0,CRG!W48)` | `CRG!W48 = W49+W50` (< 3 mois + > 3 mois) | **collecte_actif_passif.creance_moins_3_mois + creance_plus_3_mois** |
| I24 | **Tresorerie (Caisse+Banque)** | `=IF(CRG!W51="",0,CRG!W51)` | `CRG!W51 = 'Collecte'!P132+P135+P138+P141` | **cash_valeur + compte_crg_valeur + tontinier_valeur + compte_banque_valeur** |

### 1.2 PASSIF

| Ligne Analyse | Libelle | Formule Excel (Analyse) | Source CRG | Source Finale |
|---------------|---------|-------------------------|------------|---------------|
| I27 | **Situation nette (Capitaux propres)** | `=I32-(I28+I29+I30)` | Calcule | **Total Bilan - Total Dettes** |
| I28 | Emprunt a plus d'un an | `=IF(CRG!W55="",0,CRG!W55)` | `CRG!W55 = 'Collecte'!P147` | **collecte_actif_passif.emprunt_bancaire_lt_valeur** |
| I29 | Emprunt a moins d'un an | `=IF(CRG!W56="",0,CRG!W56)` | `CRG!W56 = 'Collecte'!P150` | **collecte_actif_passif.emprunt_bancaire_ct_valeur** |
| I30 | Autres dettes | `=IF(CRG!W57="",0,CRG!W57)` | `CRG!W57 = P153+P156+P159+P162+P165+P168+P171` | **avance_client + dette_fournisseur + impot_non_paye + loyer_non_paye + facture_non_payee + tontine_dette + autre_dette** |

### 1.3 TOTAUX ET INDICATEURS

| Ligne Analyse | Libelle | Formule Excel | Signification |
|---------------|---------|---------------|---------------|
| I32 | **TOTAL BILAN** | `=SUM(I13+I22+I23+I24)` | Immobilisations + Stocks + Creances + Tresorerie |
| I33 | **Fonds de roulement** | `=(I27+I28)-I13` | (Capitaux propres + Emprunts LT) - Immobilisations |
| I34 | **Besoin en fonds de roulement** | `=I33-I24` | Fonds de roulement - Tresorerie |

---

## 2. RENTABILITE (Analyse lignes 37-63) <-- Sources

### 2.1 Chiffre d'affaires et Marge

| Ligne Analyse | Libelle | Formule Excel (Analyse) | Source CRG | Source Finale |
|---------------|---------|-------------------------|------------|---------------|
| I39 | **Chiffre d'affaires** | `=IF(CRG!Y16="","",IF(objet="Bon de commande",CRG!Y16,(CRG!Y16*CRG!AC9)))` | `CRG!Y16 = CA recommande` (selon hypothese faible/moyenne/elevee) | **Calcule a partir de collecte_chiffre_affaires** (ca_jour_fort/moyen/faible, cycles) x facteur_periodicite |
| F41 | **Taux de marge brute** | `=IF(CRG!AA5="","",CRG!AA5)` | `CRG!AA5` = taux marge selectionne (declare ou calcule) | **collecte_marge_brute.taux_marge_declare ou taux_marge_calcule** |
| I41 | **Marge brute** | `=IF(F41="","",(CRG!W22*CRG!AC9))` | `CRG!W22 = Y16 * AA5` (CA x Taux MB) | **CA_recommande x Taux_marge x facteur_periodicite** |
| I40 | Cout d'achats marchandises | `=IF(I39="","",(I39-I41))` | Calcule | **CA - Marge brute** |

### 2.2 Autres charges d'exploitation

> **Logique** : Si objet = "Bon de commande", charge brute; sinon charge_mensuelle x CRG!AC9 (facteur cycle)

| Ligne Analyse | Libelle | Formule CRG (source W) | Source Collecte | Table/Colonne DB |
|---------------|---------|------------------------|-----------------|------------------|
| I42 | Salaire | `CRG!W24 = 'Collecte'!P179` | Section 6.b | **charge_entreprise.salaire_montant** |
| I43 | Prelevement entrepreneur | `CRG!W25 = W62` (depenses perso) | Voir Section 7 ci-dessous | **charge_personnelle** (logique conditionnelle) |
| I44 | Loyers | `CRG!W26 = 'Collecte'!P176` | Section 6.a | **charge_entreprise.loyer_montant** |
| I45 | Transport | `CRG!W27 = P197+P200+P203` | Section 6.h+i+j | **transport_achat + transport_vente + transport_divers** |
| I46 | Electricite, eau, telephone | `CRG!W28 = P188+P191+P194` | Section 6.e+f+g | **telephone + electricite + eau** |
| I47 | Fournitures et autres besoins | `CRG!W29 = 'Collecte'!P182` | Section 6.c | **charge_entreprise.fourniture_montant** |
| I48 | Entretien et reparation | `CRG!W30 = 'Collecte'!P206` | Section 6.k | **charge_entreprise.entretien_montant** |
| I49 | Carburant et lubrifiants | `CRG!W31 = 'Collecte'!P209` | Section 6.l | **charge_entreprise.carburant_montant** |
| I50 | Frais publicite et promotion | `CRG!W32 = 'Collecte'!P185` | Section 6.d | **charge_entreprise.publicite_montant** |
| I51 | Redevance, impots et taxes | `CRG!W33 = 'Collecte'!P221` | Section 6.o | **charge_entreprise.impots_taxes_montant** |
| I52 | Frais bancaires, interets | `CRG!W34 = P215+P218` | Section 6.n | **frais_bancaires + interets_emprunts** |
| I53 | Echeance autre credit | `CRG!W35 = 'Collecte'!P230` | Section 6.r | **charge_entreprise.echeance_autre_credit_montant** |
| I54 | Diverses charges | `CRG!W36 = P212+P224+P233` | Section 6.m+p+s | **assurance + honoraires + autres_charges** |

### 2.3 Prelevement entrepreneur (logique speciale)

```
CRG!W62 = IF('Collecte'!I274="OUI", CRG!W61, IF('Collecte'!J238="OUI", 'Collecte'!P238, 0))

CRG!W61 (Depenses familiales) = P245+P248+P251+P254+P257+P260+P263+P266+P269+P272
  = alimentation + loyer_residence + transport_prive + electricite_eau_comm
    + habillement + frais_medicaux + echeance_credit_perso + scolarite
    + travaux_construction + autres_charges_perso
```

**Logique** :
- Si `depenses_prelevees_activite = OUI` -> somme de toutes les depenses personnelles detaillees
- Sinon si `salaire_fixe = OUI` -> montant du salaire fixe
- Sinon -> 0

### 2.4 Amortissements, Resultat, Cash-flow

| Ligne Analyse | Libelle | Formule Excel | Source |
|---------------|---------|---------------|--------|
| I55 | **Total autres charges** | `=SUM(I42:L54)` | Somme de toutes les charges ci-dessus |
| I56 | **Amortissements et Provisions** | `=(CRG!W37+CRG!W38)*CRG!AC9` | `CRG!W37 = 'Collecte'!P227` (provisions) + `CRG!W38 = SUMIFS(Amorts!H, Amorts!S, "OUI")` | **provisions_montant + SUM(amortissement_mensuel WHERE statut="En cours")** x facteur_cycle |
| I57 | **Resultat d'exploitation** | `=I41-(I55+I56)` | Marge brute - (Charges + Amortissements) |
| I59 | **Cash-flow** | `=I57+I56` | Resultat + Amortissements (car non-cash) |
| I61 | **Autres revenus net hors activite** | `=IF(CRG!W60="",0,CRG!W60)` | `CRG!W60 = P280+P282+P284+P286` | **salaire_externe + loyers_percus + activite_secondaire + autres_revenus** |
| I63 | **Capacite de remboursement calculee** | `=I59+I61` | Cash-flow + Autres revenus |

---

## 3. BESOIN DE CREDIT (Analyse lignes 68-82) <-- Sources

### 3.1 Besoin en credit investissement

| Ligne Analyse | Libelle | Formule Excel | Source | Table/Colonne DB |
|---------------|---------|---------------|--------|------------------|
| M70 | Besoins d'investissement | `=IF('Collecte'!I14="","",CRG!W2)` | `CRG!W2 = Analyse!Q70 ou 'Collecte'!I14` | **demandeindividuel** (champ investissement) |
| M71 | Depenses rattachees | `=IF('Collecte'!I15="","",CRG!W3)` | `CRG!W3 = Analyse!Q71 ou 'Collecte'!I15` | **demandeindividuel** (champ depenses invest) |
| M72 | Apport personnel | `=IF('Collecte'!I16="","",CRG!W4)` | `CRG!W4 = Analyse!Q72 ou 'Collecte'!I16` | **demandeindividuel** (champ apport perso) |
| M73 | **Besoin reel credit investissement** | `=IFERROR((SUM(M70:P71)-M72),"")` | Calcule | **(Investissement + Depenses) - Apport** |

### 3.2 Besoin en credit exploitation (fonds de roulement)

| Ligne Analyse | Libelle | Formule Excel | Source CRG | Source Finale |
|---------------|---------|---------------|------------|---------------|
| M76 | Cout d'achats pour 1 cycle | `=IF(CRG!W65="","",CRG!Y65)` | `CRG!W65 = Analyse!I40 * nbre_cycles` (cout achat marchandises x cycles) | **Calcule: (CA - Marge brute) x nbre_cycles** |
| M77 | Tresorerie disponible | `=IF(CRG!W66="","",CRG!Y66)` | `CRG!W66 = W51` (tresorerie bilan) | **= Tresorerie du Bilan (I24)** |
| M78 | Stock actuel | `=IF(CRG!W67="","",CRG!Y67)` | `CRG!W67 = W47` (stocks bilan) | **= Stocks du Bilan (I22)** |
| M79 | Comptes a recevoir | `=IF(CRG!W68="","",CRG!Y68)` | `CRG!W68 = W49` (creances < 3 mois seulement) | **collecte_actif_passif.creance_moins_3_mois** |
| M80 | Dettes fournisseurs et autres | `=IF(CRG!W69="","",CRG!Y69)` | `CRG!W69 = W57` (autres dettes bilan) | **= Autres dettes du Bilan (I30)** |
| M81 | Credit fournisseur (Promesse) | `=IF(CRG!W70="","",CRG!Y70)` | `CRG!W70 = 'Collecte'!P124` | **collecte_actif_passif.credit_fournisseur_valeur** |
| M82 | **Besoin reel credit exploitation** | `=(M76+M80)-(M77+M78+M79)` | Calcule | **(Cout achats + Dettes) - (Tresorerie + Stock + Creances)** |

> **Note** : Les colonnes Q (Ajustement) permettent de surcharger manuellement chaque valeur dans la proposition.

---

## 4. RATIOS DE DECISION (Analyse lignes 86-114)

| Ratio | Formule | Norme | Sources principales |
|-------|---------|-------|---------------------|
| **R.1 Capacite de remboursement** | `(Cash-flow + Autres revenus) / Echeance` | >= 200% | Rentabilite I59, I61 + demandeindividuel.echeance |
| **R.2 Solvabilite** | `Capitaux propres / Total Actif` = `I27 / I32` | >= 35% | Bilan |
| **R.3 Liquidite a echeance** | `(Creances + Tresorerie) / Dettes CT` = `(I23+I24) / (I29+I30)` | >= 100% | Bilan |
| **R.4 Endettement** | `(Dettes totales + Credit) / (Total Actif + Credit)` | < 50% | Bilan + montant_demande |
| **R.5 Dependance** | `Autres revenus / Revenus totaux` = `I61 / (I57+I61)` | < 50% | Rentabilite |
| **R.6 Couverture garantie** | `Valeur garantie / Credit` = `'Collecte'!I24 / montant_demande` | > 150% | Collecte Section 2 + demandeindividuel |

---

## 5. RESUME : TABLE DE CORRESPONDANCE DB -> ANALYSE

### 5.1 Bilan - Actif

| Ligne Bilan | Source DB | Champ |
|-------------|----------|-------|
| Terrains | `collecte_actif_passif` | `terrain_valeur` |
| Batiments et magasin | `collecte_amortissement` | `SUM(valeur_nette_comptable) WHERE type_immobilisation = 'Batiments et magasin'` |
| Installations et agencements | `collecte_amortissement` | `SUM(VNC) WHERE type = 'Installations et agencements'` |
| Materiels industriels | `collecte_amortissement` | `SUM(VNC) WHERE type = 'Materiels industriels'` |
| Mobilier de bureau | `collecte_amortissement` | `SUM(VNC) WHERE type = 'Mobilier de bureau'` |
| Materiel informatique | `collecte_amortissement` | `SUM(VNC) WHERE type = 'Materiel informatique'` |
| Materiel de transport | `collecte_amortissement` | `SUM(VNC) WHERE type = 'Materiel de transport'` |
| Autres immobilisations | `collecte_actif_passif` | `caution_financiere_valeur + pret_employe_valeur` |
| Stocks | `collecte_actif_passif` / `collecte_stock_article` | `stock_valeur_estimee` OU `SUM(valeur_stock)` |
| Creances Clients | `collecte_actif_passif` | `creance_moins_3_mois + creance_plus_3_mois` |
| Tresorerie | `collecte_actif_passif` | `cash_valeur + compte_crg_valeur + tontinier_valeur + compte_banque_valeur` |

### 5.2 Bilan - Passif

| Ligne Bilan | Source DB | Champ |
|-------------|----------|-------|
| Capitaux propres | Calcule | `Total Bilan - (Emprunts LT + CT + Autres dettes)` |
| Emprunt > 1 an | `collecte_actif_passif` | `emprunt_bancaire_lt_valeur` |
| Emprunt < 1 an | `collecte_actif_passif` | `emprunt_bancaire_ct_valeur` |
| Autres dettes | `collecte_actif_passif` | `avance_client + dette_fournisseur + impot_non_paye + loyer_non_paye + facture_non_payee + tontine_dette + autre_dette` |

### 5.3 Rentabilite

| Ligne Rentabilite | Source DB | Champ(s) |
|-------------------|----------|----------|
| Chiffre d'affaires | `collecte_chiffre_affaires` | CA recommande (fonction hypothese) x facteur_periodicite |
| Taux marge brute | `collecte_marge_brute` | `taux_marge_declare` ou `taux_marge_calcule` |
| Marge brute | Calcule | CA x Taux MB x facteur_periodicite |
| Cout achats | Calcule | CA - Marge brute |
| Salaire | `collecte_charge_entreprise` | `salaire_montant` x facteur_cycle |
| Prelevement | `collecte_charge_personnelle` | Conditionnel (voir 2.3) x facteur_cycle |
| Loyers | `collecte_charge_entreprise` | `loyer_montant` x facteur_cycle |
| Transport | `collecte_charge_entreprise` | `(transport_achat + transport_vente + transport_divers)` x facteur_cycle |
| Elec/Eau/Tel | `collecte_charge_entreprise` | `(telephone + electricite + eau)` x facteur_cycle |
| Fournitures | `collecte_charge_entreprise` | `fourniture_montant` x facteur_cycle |
| Entretien | `collecte_charge_entreprise` | `entretien_montant` x facteur_cycle |
| Carburant | `collecte_charge_entreprise` | `carburant_montant` x facteur_cycle |
| Publicite | `collecte_charge_entreprise` | `publicite_montant` x facteur_cycle |
| Impots/Taxes | `collecte_charge_entreprise` | `impots_taxes_montant` x facteur_cycle |
| Frais bancaires | `collecte_charge_entreprise` | `(frais_bancaires + interets_emprunts)` x facteur_cycle |
| Echeance autre credit | `collecte_charge_entreprise` | `echeance_autre_credit_montant` x facteur_cycle |
| Diverses charges | `collecte_charge_entreprise` | `(assurance + honoraires + autres_charges)` x facteur_cycle |
| Provisions | `collecte_charge_entreprise` | `provisions_montant` x facteur_cycle |
| Amortissements | `collecte_amortissement` | `SUM(amortissement_mensuel WHERE statut='En cours')` x facteur_cycle |
| Autres revenus | `collecte_autre_revenu` | `salaire_externe + loyers_percus + activite_secondaire + autres_revenus` |

### 5.4 Besoin de credit

| Ligne Besoin | Source DB | Champ(s) |
|-------------|----------|----------|
| Cout achats 1 cycle | Calcule | (CA - Marge brute) par cycle x nbre_cycles |
| Tresorerie disponible | Bilan | = Tresorerie du bilan |
| Stock actuel | Bilan | = Stocks du bilan |
| Comptes a recevoir | `collecte_actif_passif` | `creance_moins_3_mois` (< 3 mois uniquement) |
| Dettes fournisseurs | Bilan | = Autres dettes du bilan |
| Credit fournisseur | `collecte_actif_passif` | `credit_fournisseur_valeur` |

---

## 6. FACTEUR DE PERIODICITE (CRG!AC9)

Le facteur de periodicite convertit les valeurs mensuelles en valeurs par cycle:

| Periodicite | Valeur AC9 |
|-------------|-----------|
| Mensuelle | 1 |
| Bimestrielle | 2 |
| Trimestrielle | 3 |
| Quadrimestrielle | 4 |
| Semestrielle | 6 |
| Annuelle | 12 |

**Usage** : `valeur_par_cycle = valeur_mensuelle * facteur_periodicite`

Cela s'applique a : CA, Marge brute, toutes les charges d'exploitation, amortissements.

---

## 7. DETERMINATION DU CA RECOMMANDE

L'Excel offre 3 hypotheses de CA :

```
CA Faible  = MIN(CA hebdo*4, CA mensuel declare, CA derniere vente, CA jour_fort*nb_jours_forts...)
CA Moyen   = AVERAGE(...)
CA Eleve   = MAX(...)
```

Le CA recommande (`CRG!Y16`) depend du choix de l'agent (Hyp. Faible / Hyp. Moyenne / Hyp. Elevee) dans la cellule `Analyse!G39`.

---

## 8. LOGIQUE DU TAUX DE MARGE (CRG!AA5)

```
Si Analyse!G41 = "% Recom."   -> Taux marge = Faible (hyp. prudente)
Si Analyse!G41 = "Fort %"     -> Taux marge = Eleve
Si Analyse!G41 = "Faible %"   -> Taux marge = Faible
Si Analyse!G41 = "% Declar"   -> Taux marge declare par le membre
```

Avec :
- Taux marge calcule faible = `MIN(taux marge par produit)`
- Taux marge calcule eleve = `MAX(taux marge par produit)`
- Taux marge calcule standard = `(total_ca - total_cout) / total_ca`
