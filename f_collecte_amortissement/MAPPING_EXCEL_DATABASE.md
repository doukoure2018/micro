# MAPPING EXCEL → BASE DE DONNÉES
## Collecte des Données et Amortissements

Ce document détaille la correspondance entre chaque cellule Excel et la colonne de base de données correspondante.

---

## 📊 SCHÉMA DES TABLES

```
┌─────────────────────────┐
│   demandeindividuel     │ (existante)
│   └── demandeindividuel_id (PK)
└───────────┬─────────────┘
            │ 1:1
            ▼
┌─────────────────────────┐
│   collecte_donnees      │ (nouvelle - en-tête)
│   └── collecte_id (PK)  │
└───────────┬─────────────┘
            │ 1:1 / 1:N
            ▼
┌──────────────────────────────────────────────────────────────────┐
│  Tables enfants (toutes liées par collecte_id)                   │
├──────────────────────────────────────────────────────────────────┤
│  • collecte_chiffre_affaires  (1:1) - Section 3                  │
│  • collecte_marge_brute       (1:1) - Section 4 paramètres       │
│  • collecte_produit           (1:N) - Section 4 produits         │
│  • collecte_actif_passif      (1:1) - Section 5                  │
│  • collecte_stock_article     (1:N) - Section 5i détail stock    │
│  • collecte_charge_entreprise (1:1) - Section 6                  │
│  • collecte_charge_personnelle(1:1) - Section 7                  │
│  • collecte_autre_revenu      (1:1) - Section 8                  │
│  • collecte_bien_personnel    (1:1) - Section 9                  │
│  • collecte_amortissement     (1:N) - Feuille Amorts             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📋 SECTION 1: ACTIVITÉ

| Cellule Excel | Colonne Base de Données | Table | Type | Description |
|---------------|-------------------------|-------|------|-------------|
| D3 | `date_evaluation` | collecte_donnees | DATE | Date d'évaluation |
| I3 | `agent_collecte_nom` | collecte_donnees | VARCHAR(255) | Nom agent collecte |
| I6 | `activite_description` | collecte_donnees | TEXT | Description activité |
| I7 | `secteur_activite` | collecte_donnees | VARCHAR(100) | COMMERCE, AGRICULTURE, etc. |
| I8 | `sous_secteur_activite` | collecte_donnees | VARCHAR(100) | Habillement, Restauration... |
| I9 | `sous_sous_secteur` | collecte_donnees | VARCHAR(100) | Sous-sous-secteur |

---

## 📋 SECTION 2: CONDITIONS DE CRÉDIT

> ⚠️ Ces données existent déjà dans `demandeindividuel` - pas de duplication

| Cellule Excel | Colonne Existante | Table | Remarque |
|---------------|-------------------|-------|----------|
| I12 | `object_credit` | demandeindividuel | Fond de roulement, Investissement... |
| I18 | `montant_demande` | demandeindividuel | Montant sollicité |
| I19 | `duree_demande` | demandeindividuel | Durée en mois |
| I20 | `periodicite_remboursement` | demandeindividuel | Mensuelle, Trimestrielle... |
| I21 | `periode_differe` | demandeindividuel | Période de différé |
| I22 | `nombre_echeance` | demandeindividuel | Nombre d'échéances |
| I23 | `echeance` | demandeindividuel | Montant échéance |
| I24 | `valeur_garantie` | analyse_financiere | Valeur garantie proposée |
| I25 | `capacite_remb_declaree` | analyse_financiere | Capacité remb. déclarée |

---

## 📋 SECTION 3: CHIFFRE D'AFFAIRES

| Cellule Excel | Colonne Base de Données | Table | Type |
|---------------|-------------------------|-------|------|
| I29 | `ca_hebdomadaire_declare` | collecte_chiffre_affaires | NUMERIC(15,2) |
| I30 | `ca_mensuel_declare` | collecte_chiffre_affaires | NUMERIC(15,2) |
| C34:N34 | `cycle_mensuel_json` → "Fort" | collecte_chiffre_affaires | JSONB |
| C35:N35 | `cycle_mensuel_json` → "Moyen" | collecte_chiffre_affaires | JSONB |
| C36:N36 | `cycle_mensuel_json` → "Faible" | collecte_chiffre_affaires | JSONB |
| C40:I40 | `cycle_hebdo_json` → "Fort" | collecte_chiffre_affaires | JSONB |
| C41:I41 | `cycle_hebdo_json` → "Moyen" | collecte_chiffre_affaires | JSONB |
| C42:I42 | `cycle_hebdo_json` → "Faible" | collecte_chiffre_affaires | JSONB |
| O34 | `ca_jour_fort` | collecte_chiffre_affaires | NUMERIC(15,2) |
| O35 | `ca_jour_moyen` | collecte_chiffre_affaires | NUMERIC(15,2) |
| O36 | `ca_jour_faible` | collecte_chiffre_affaires | NUMERIC(15,2) |
| M43 | `ca_hebdo_calcule` | collecte_chiffre_affaires | NUMERIC(15,2) - **Calculé** |
| M44 | `ca_mensuel_calcule` | collecte_chiffre_affaires | NUMERIC(15,2) - **Calculé** |

### Format JSON pour cycles

```json
// cycle_mensuel_json
{
  "Fort": ["Mars", "Août", "Déc"],
  "Moyen": ["Janv", "Avril", "Oct", "Nov"],
  "Faible": ["Févr", "Mai", "Juin", "Juil", "Sept"]
}

// cycle_hebdo_json
{
  "Fort": ["Lun", "Mar", "Mer", "Jeu"],
  "Moyen": ["Ven", "Sam"],
  "Faible": ["Dim"]
}
```

---

## 📋 SECTION 4: MARGE BRUTE

### Paramètres

| Cellule Excel | Colonne Base de Données | Table | Type |
|---------------|-------------------------|-------|------|
| I47 | `connait_taux_marge` | collecte_marge_brute | BOOLEAN |
| (si OUI) | `taux_marge_declare` | collecte_marge_brute | NUMERIC(5,4) |
| I49 | `calculer_taux_marge` | collecte_marge_brute | BOOLEAN |
| I51 | `frequence_ventes` | collecte_marge_brute | VARCHAR(20) |
| M70 | `total_ca_calcule` | collecte_marge_brute | NUMERIC(15,2) - **Calculé** |
| P70 | `total_cout_calcule` | collecte_marge_brute | NUMERIC(15,2) - **Calculé** |
| T70 | `taux_marge_calcule` | collecte_marge_brute | NUMERIC(5,4) - **Calculé** |

### Produits (lignes 55-69)

| Cellule Excel | Colonne Base de Données | Table | Type |
|---------------|-------------------------|-------|------|
| B55:B69 | `nom_produit` | collecte_produit | VARCHAR(255) |
| E55:E69 | `prix_vente` | collecte_produit | NUMERIC(15,2) |
| H55:H69 | `cout_achat` | collecte_produit | NUMERIC(15,2) |
| K55:K69 | `quantite` | collecte_produit | INTEGER |
| M55:M69 | `chiffre_affaires` | collecte_produit | **GENERATED** = prix_vente × quantite |
| P55:P69 | `cout_total` | collecte_produit | **GENERATED** = cout_achat × quantite |

---

## 📋 SECTION 5: ACTIFS ET PASSIFS

### 5a-5f: Immobilisations

| Question | Cellule | Colonne existe | Colonne propriété | Table |
|----------|---------|----------------|-------------------|-------|
| a) Terrains | I75, P76 | `terrain_existe` | `terrain_valeur` | collecte_actif_passif |
| b) Bâtiments | I78, P78 | `batiment_existe` | `batiment_propriete` | collecte_actif_passif |
| c) Installations | I81 | `installation_existe` | `installation_propriete` | collecte_actif_passif |
| d) Matériel roulant | I84, P84 | `materiel_roulant_existe` | `materiel_roulant_propriete` | collecte_actif_passif |
| e) Mobilier | I87 | `mobilier_existe` | `mobilier_propriete` | collecte_actif_passif |
| f) Machines | I90 | `machine_existe` | `machine_propriete` | collecte_actif_passif |

> ⚠️ Les valeurs des immobilisations b), c), d), e), f) proviennent de `collecte_amortissement` (VNC calculée)

### 5g-5o: Autres actifs

| Question | Cellule Existe | Cellule Valeur | Colonne existe | Colonne valeur |
|----------|----------------|----------------|----------------|----------------|
| g) Caution financière | I93 | P94 | `caution_financiere_existe` | `caution_financiere_valeur` |
| h) Prêts employés | I96 | P97 | `pret_employe_existe` | `pret_employe_valeur` |
| i) Stock | I99, I101 | M121 | `stock_existe`, `stock_evaluer_detail` | Calculé depuis `collecte_stock_article` |
| j) Crédit fournisseur | I123 | P124 | `credit_fournisseur_existe` | `credit_fournisseur_valeur` |
| k) Créances clients | I126 | J128, J129 | `creance_client_existe` | `creance_plus_3_mois`, `creance_moins_3_mois` |
| l) Cash | I131 | - | `cash_existe` | `cash_valeur` |
| m) Compte CRG | I134 | P135 | `compte_crg_existe` | `compte_crg_valeur` |
| n) Tontinier | I137 | P138 | `tontinier_existe` | `tontinier_valeur` |
| o) Compte banque | I140 | P141 | `compte_banque_existe` | `compte_banque_valeur` |

### 5p-5y: Passifs (Dettes)

| Question | Cellule Existe | Cellule Valeur | Colonne existe | Colonne valeur |
|----------|----------------|----------------|----------------|----------------|
| p) Emprunt IMF | I143 | - | `emprunt_imf_existe` | `emprunt_imf_valeur` |
| q) Emprunt bancaire LT | I146 | - | `emprunt_bancaire_lt_existe` | `emprunt_bancaire_lt_valeur` |
| r) Emprunt bancaire CT | I149 | - | `emprunt_bancaire_ct_existe` | `emprunt_bancaire_ct_valeur` |
| s) Avances clients | I152 | P153 | `avance_client_existe` | `avance_client_valeur` |
| t) Dettes fournisseurs | I155 | P156 | `dette_fournisseur_existe` | `dette_fournisseur_valeur` |
| u) Impôts non payés | I158 | - | `impot_non_paye_existe` | `impot_non_paye_valeur` |
| v) Loyers non payés | I161 | - | `loyer_non_paye_existe` | `loyer_non_paye_valeur` |
| w) Factures non payées | I164 | - | `facture_non_payee_existe` | `facture_non_payee_valeur` |
| x) Tontine (dette) | I167 | P168 | `tontine_dette_existe` | `tontine_dette_valeur` |
| y) Autres dettes | I170 | P171 | `autre_dette_existe` | `autre_dette_valeur` |

### Stock détaillé (lignes 106-120)

| Cellule Excel | Colonne Base de Données | Table | Type |
|---------------|-------------------------|-------|------|
| B106:B120 | `nom_article` | collecte_stock_article | VARCHAR(255) |
| H106:H120 | `quantite` | collecte_stock_article | INTEGER |
| J106:J120 | `cout_unitaire` | collecte_stock_article | NUMERIC(15,2) |
| M106:M120 | `valeur_stock` | collecte_stock_article | **GENERATED** = quantite × cout_unitaire |

---

## 📋 SECTION 6: CHARGES ENTREPRISE

| Question | Cellule Existe | Cellule Valeur | Colonne existe | Colonne montant |
|----------|----------------|----------------|----------------|-----------------|
| a) Loyer magasins | I175 | P176 | `loyer_existe` | `loyer_montant` |
| b) Salaires | I178 | P179 | `salaire_existe` | `salaire_montant` |
| c) Fournitures | I181 | P182 | `fourniture_existe` | `fourniture_montant` |
| d) Publicité | I184 | P185 | `publicite_existe` | `publicite_montant` |
| e) Téléphone | I187 | P188 | `telephone_existe` | `telephone_montant` |
| f) Électricité | I190 | P191 | `electricite_existe` | `electricite_montant` |
| g) Eau | I193 | P194 | `eau_existe` | `eau_montant` |
| h) Transport achat | I196 | P197 | `transport_achat_existe` | `transport_achat_montant` |
| i) Transport vente | I199 | P200 | `transport_vente_existe` | `transport_vente_montant` |
| j) Transport divers | I202 | P203 | `transport_divers_existe` | `transport_divers_montant` |
| k) Entretien | I205 | P206 | `entretien_existe` | `entretien_montant` |
| l) Carburant | I208 | P209 | `carburant_existe` | `carburant_montant` |
| m) Assurance | I211 | P212 | `assurance_existe` | `assurance_montant` |
| n) Frais bancaires | I214 | P215 | `frais_bancaires_existe` | `frais_bancaires_montant` |
| n) Intérêts emprunts | I217 | P218 | `interets_emprunts_existe` | `interets_emprunts_montant` |
| o) Impôts/Taxes | I220 | P221 | `impots_taxes_existe` | `impots_taxes_montant` |
| p) Honoraires | I223 | P224 | `honoraires_existe` | `honoraires_montant` |
| q) Provisions | I226 | P227 | `provisions_existe` | `provisions_montant` |
| r) Échéance autre crédit | I229 | P230 | `echeance_autre_credit_existe` | `echeance_autre_credit_montant` |
| s) Autres charges | I232 | P233 | `autres_charges_existe` | `autres_charges_montant` |

---

## 📋 SECTION 7: CHARGES PERSONNELLES

| Question | Cellule | Colonne Base de Données | Condition |
|----------|---------|-------------------------|-----------|
| Salaire fixé? | J238 | `salaire_fixe` | - |
| Montant salaire | P238 | `salaire_montant` | Si salaire_fixe = TRUE |
| a) Alimentation | P240 | `alimentation_montant` | Si salaire_fixe = FALSE |
| b) Loyer résidence | P243 | `loyer_residence_montant` | Si salaire_fixe = FALSE |
| c) Transport privé | P246 | `transport_prive_montant` | Si salaire_fixe = FALSE |
| d) Élec/Eau/Comm | P249 | `electricite_eau_comm_montant` | Si salaire_fixe = FALSE |
| e) Habillement | P252 | `habillement_montant` | Si salaire_fixe = FALSE |
| f) Frais médicaux | P255 | `frais_medicaux_montant` | Si salaire_fixe = FALSE |
| g) Échéance crédit | P258 | `echeance_credit_perso_montant` | Si salaire_fixe = FALSE |
| h) Scolarité | P261 | `scolarite_montant` | Si salaire_fixe = FALSE |
| i) Travaux construction | P264 | `travaux_construction_montant` | Si salaire_fixe = FALSE |
| j) Autres charges perso | P267 | `autres_charges_perso_montant` | Si salaire_fixe = FALSE |
| k) Prélevées activité? | P269 | `depenses_prelevees_activite` | Si salaire_fixe = FALSE |

---

## 📋 SECTION 8: AUTRES REVENUS

| Question | Cellule Existe | Cellule Valeur | Colonne existe | Colonne montant |
|----------|----------------|----------------|----------------|-----------------|
| a) Salaire externe | I280 | P280 | `salaire_externe_existe` | `salaire_externe_montant` |
| b) Loyers perçus | I282 | P282 | `loyers_percus_existe` | `loyers_percus_montant` |
| c) Activité secondaire | I284 | P284 | `activite_secondaire_existe` | `activite_secondaire_montant` |
| d) Autres revenus | I286 | P286 | `autres_revenus_existe` | `autres_revenus_montant` |

---

## 📋 SECTION 9: BIENS PERSONNELS

| Question | Cellule Existe | Cellule Valeur | Colonne existe | Colonne valeur |
|----------|----------------|----------------|----------------|----------------|
| a) Terrains vides | I291 | P291 | `terrain_existe` | `terrain_valeur` |
| b) Maisons | I293 | P293 | `maison_existe` | `maison_valeur` |
| c) Véhicules | I295 | P295 | `vehicule_existe` | `vehicule_valeur` |
| d) Motos | I297 | P297 | `moto_existe` | `moto_valeur` |
| e) Autres biens | I299 | P299 | `autre_bien_existe` | `autre_bien_valeur` |

---

## 📋 FEUILLE AMORTS: AMORTISSEMENTS

| Colonne Excel | Colonne Base de Données | Table | Type |
|---------------|-------------------------|-------|------|
| B | `ordre` | collecte_amortissement | INTEGER (1-100) |
| C | `nature_immobilisation` | collecte_amortissement | VARCHAR(255) |
| D | `type_immobilisation` | collecte_amortissement | VARCHAR(50) - ENUM |
| E | `date_acquisition` | collecte_amortissement | DATE |
| F | `duree_amortissement_mois` | collecte_amortissement | INTEGER |
| G | `valeur_acquisition` | collecte_amortissement | NUMERIC(15,2) |
| H | `amortissement_mensuel` | collecte_amortissement | NUMERIC(15,2) - **Calculé** |
| I | `amortissement_cumule` | collecte_amortissement | NUMERIC(15,2) - **Calculé** |
| K | `valeur_nette_comptable` | collecte_amortissement | NUMERIC(15,2) - **Calculé** |
| P | `statut_amortissement` | collecte_amortissement | VARCHAR(20) - "En cours"/"Amorti" |

### Types d'immobilisation et durées standards

| Type | Durée (mois) | Durée (années) |
|------|--------------|----------------|
| Bâtiments et magasin | 120 | 10 ans |
| Installations et agencements | 60 | 5 ans |
| Matériels industriels | 60 | 5 ans |
| Mobilier de bureau | 60 | 5 ans |
| Matériel informatique | 36 | 3 ans |
| Matériel de transport | 36 | 3 ans |
| Autres immobilisations | 60 | 5 ans |

---

## 🔢 FORMULES DE CALCUL

### Amortissement mensuel
```
amortissement_mensuel = valeur_acquisition / duree_amortissement_mois
```

### Amortissement cumulé
```
mois_ecoules = (date_evaluation - date_acquisition) en mois
amortissement_cumule = MIN(valeur_acquisition, amortissement_mensuel × mois_ecoules)
```

### Valeur Nette Comptable (VNC)
```
VNC = valeur_acquisition - amortissement_cumule
Si VNC ≤ 0 → statut = "Amorti", VNC = 0
```

### Taux de marge brute
```
taux_marge = (total_ca - total_cout) / total_ca
         = SUM(prix_vente × quantite) - SUM(cout_achat × quantite)
           ─────────────────────────────────────────────────────────
                        SUM(prix_vente × quantite)
```

### Total charges personnelles (si salaire_fixe = FALSE)
```
total_charges_perso = alimentation + loyer_residence + transport_prive 
                    + electricite_eau_comm + habillement + frais_medicaux
                    + echeance_credit_perso + scolarite + travaux_construction
                    + autres_charges_perso
```

### Total autres revenus
```
total_autres_revenus = salaire_externe + loyers_percus 
                     + activite_secondaire + autres_revenus
```

---

## 📝 NOTES D'IMPLÉMENTATION

### 1. Ordre de création des enregistrements

```
1. INSERT collecte_donnees (crée collecte_id)
2. INSERT collecte_chiffre_affaires
3. INSERT collecte_marge_brute
4. INSERT collecte_produit (multiple)
5. INSERT collecte_actif_passif
6. INSERT collecte_stock_article (multiple)
7. INSERT collecte_charge_entreprise
8. INSERT collecte_charge_personnelle
9. INSERT collecte_autre_revenu
10. INSERT collecte_bien_personnel
11. INSERT collecte_amortissement (multiple)
12. CALL fn_calculer_amortissements(collecte_id)
```

### 2. Validation du pourcentage de complétion

```sql
-- Calculer le pourcentage de complétion
UPDATE collecte_donnees
SET pourcentage_completion = (
    (CASE WHEN activite_description IS NOT NULL THEN 10 ELSE 0 END) +
    (CASE WHEN EXISTS(SELECT 1 FROM collecte_chiffre_affaires WHERE collecte_id = $1) THEN 15 ELSE 0 END) +
    (CASE WHEN EXISTS(SELECT 1 FROM collecte_marge_brute WHERE collecte_id = $1) THEN 15 ELSE 0 END) +
    (CASE WHEN EXISTS(SELECT 1 FROM collecte_actif_passif WHERE collecte_id = $1) THEN 20 ELSE 0 END) +
    (CASE WHEN EXISTS(SELECT 1 FROM collecte_charge_entreprise WHERE collecte_id = $1) THEN 15 ELSE 0 END) +
    (CASE WHEN EXISTS(SELECT 1 FROM collecte_charge_personnelle WHERE collecte_id = $1) THEN 10 ELSE 0 END) +
    (CASE WHEN EXISTS(SELECT 1 FROM collecte_autre_revenu WHERE collecte_id = $1) THEN 10 ELSE 0 END) +
    (CASE WHEN EXISTS(SELECT 1 FROM collecte_bien_personnel WHERE collecte_id = $1) THEN 5 ELSE 0 END)
)
WHERE collecte_id = $1;
```

### 3. Liaison avec analyse_financiere

```sql
-- Après création de la collecte, mettre à jour analyse_financiere
ALTER TABLE analyse_financiere 
ADD COLUMN IF NOT EXISTS collecte_id BIGINT REFERENCES collecte_donnees(collecte_id);

-- Index pour la jointure
CREATE INDEX IF NOT EXISTS idx_analyse_collecte ON analyse_financiere(collecte_id);
```

---

## ✅ CHECKLIST D'IMPLÉMENTATION

- [ ] Exécuter `V100__CREATE_COLLECTE_DONNEES_AMORTISSEMENTS.sql`
- [ ] Créer les DTOs/Entities correspondants (Java/Kotlin/TypeScript)
- [ ] Créer les Repository pour chaque table
- [ ] Créer les Services avec logique métier
- [ ] Créer les Controllers REST API
- [ ] Intégrer avec la maquette React (MAQUETTE_COLLECTE_AMORTS.jsx)
- [ ] Tester les calculs automatiques (amortissements, marge)
- [ ] Ajouter la colonne `collecte_id` à `analyse_financiere`
