# INSTRUCTIONS CLAUDE CODE - Implémentation Module Collecte des Données

## 📋 CONTEXTE DU PROJET

Je travaille sur un système d'analyse de crédits PME pour le **Crédit Rural de Guinée (CRG)**. 
Le projet existant gère déjà les demandes de crédit avec les tables `demandeindividuel`, `analyse_financiere`, `analyse_bilan`, `analyse_rentabilite`, `analyse_ratios`.

**Problème actuel**: Les données d'analyse sont saisies manuellement au lieu d'être calculées automatiquement à partir des données de collecte terrain (comme dans le fichier Excel).

**Objectif**: Implémenter le module "Collecte des Données" et "Amortissements" pour que les analyses financières soient générées automatiquement à partir des données collectées sur le terrain.

---

## 📁 FICHIERS DE RÉFÉRENCE DANS LE DOSSIER

Consulte ces fichiers dans le dossier du projet avant de commencer:

1. **`V100__CREATE_COLLECTE_DONNEES_AMORTISSEMENTS.sql`** - Script SQL avec 11 tables à créer
2. **`MAPPING_EXCEL_DATABASE.md`** - Mapping cellule Excel → colonne base de données  
3. **`MAQUETTE_COLLECTE_AMORTS.jsx`** - Maquette React de l'interface utilisateur
4. **`ANALYSE_DES_CREDITS_PME_VERSION_DEFINITIVE_NARCISSE__CAS_PRATIQUE.xlsx`** - Fichier Excel original de référence

---

## 🎯 TÂCHES À RÉALISER

### PHASE 1: Base de données

1. **Exécuter la migration SQL** `V100__CREATE_COLLECTE_DONNEES_AMORTISSEMENTS.sql`
   - Crée les 11 tables: `collecte_donnees`, `collecte_chiffre_affaires`, `collecte_marge_brute`, `collecte_produit`, `collecte_actif_passif`, `collecte_stock_article`, `collecte_charge_entreprise`, `collecte_charge_personnelle`, `collecte_autre_revenu`, `collecte_bien_personnel`, `collecte_amortissement`
   - Vérifie que les triggers et la fonction `fn_calculer_amortissements` sont créés

2. **Ajouter la liaison** entre `analyse_financiere` et `collecte_donnees`:
   ```sql
   ALTER TABLE analyse_financiere 
   ADD COLUMN IF NOT EXISTS collecte_id BIGINT REFERENCES collecte_donnees(collecte_id);
   ```

### PHASE 2: Backend (Entities/DTOs/Repositories/Services/Controllers)

Pour chaque table, créer:

#### Entities JPA (dans le package `entity` ou `model`):
- `CollecteDonnees.java` - Table principale avec relation vers `DemandeIndividuel`
- `CollecteChiffreAffaires.java` - Section 3
- `CollecteMargeBrute.java` - Section 4 paramètres
- `CollecteProduit.java` - Section 4 produits (relation @ManyToOne vers CollecteDonnees)
- `CollecteActifPassif.java` - Section 5
- `CollecteStockArticle.java` - Section 5i détail stock (relation @ManyToOne)
- `CollecteChargeEntreprise.java` - Section 6
- `CollecteChargePersonnelle.java` - Section 7
- `CollecteAutreRevenu.java` - Section 8
- `CollecteBienPersonnel.java` - Section 9
- `CollecteAmortissement.java` - Feuille Amorts (relation @ManyToOne)

#### DTOs (dans le package `dto`):
- `CollecteDonneesDTO.java` - DTO principal incluant toutes les sections
- `CollecteCreateRequest.java` - Pour la création
- `CollecteUpdateRequest.java` - Pour les mises à jour partielles
- `AmortissementDTO.java` - Pour les immobilisations

#### Repositories (dans le package `repository`):
- `CollecteDonneesRepository.java` extends JpaRepository
- Un repository pour chaque table enfant
- Ajouter des méthodes de recherche: `findByDemandeindividuelId()`, `findByCollecteId()`

#### Services (dans le package `service`):
- `CollecteDonneesService.java` - Service principal avec:
  - `createCollecte(Long demandeId)` - Créer une collecte vide
  - `updateSection1(Long collecteId, Section1DTO dto)` - Mettre à jour activité
  - `updateSection3(Long collecteId, ChiffreAffairesDTO dto)` - CA
  - `updateSection4(Long collecteId, MargeBruteDTO dto, List<ProduitDTO> produits)` - Marge
  - `updateSection5(Long collecteId, ActifPassifDTO dto, List<StockArticleDTO> stocks)` - Actifs
  - `updateSection6(Long collecteId, ChargeEntrepriseDTO dto)` - Charges entreprise
  - `updateSection7(Long collecteId, ChargePersonnelleDTO dto)` - Charges perso
  - `updateSection8(Long collecteId, AutreRevenuDTO dto)` - Autres revenus
  - `updateSection9(Long collecteId, BienPersonnelDTO dto)` - Biens perso
  - `getCollecteComplete(Long collecteId)` - Récupérer toute la collecte
  - `calculerPourcentageCompletion(Long collecteId)` - Calculer avancement

- `AmortissementService.java` - Service pour les amortissements:
  - `addAmortissement(Long collecteId, AmortissementDTO dto)`
  - `updateAmortissement(Long amortId, AmortissementDTO dto)`
  - `deleteAmortissement(Long amortId)`
  - `recalculerAmortissements(Long collecteId)` - Appelle la fonction SQL
  - `getAmortissementsByCollecte(Long collecteId)`
  - `getTotalVNC(Long collecteId)` - Somme des VNC par type

#### Controllers REST (dans le package `controller`):
- `CollecteDonneesController.java`:
  ```
  POST   /api/collecte/{demandeId}                    - Créer collecte
  GET    /api/collecte/{collecteId}                   - Récupérer collecte complète
  GET    /api/collecte/demande/{demandeId}            - Récupérer par demande
  PUT    /api/collecte/{collecteId}/section1          - MAJ Section 1
  PUT    /api/collecte/{collecteId}/section3          - MAJ Section 3 (CA)
  PUT    /api/collecte/{collecteId}/section4          - MAJ Section 4 (Marge)
  PUT    /api/collecte/{collecteId}/section5          - MAJ Section 5 (Actifs)
  PUT    /api/collecte/{collecteId}/section6          - MAJ Section 6 (Charges)
  PUT    /api/collecte/{collecteId}/section7          - MAJ Section 7 (Charges perso)
  PUT    /api/collecte/{collecteId}/section8          - MAJ Section 8 (Autres revenus)
  PUT    /api/collecte/{collecteId}/section9          - MAJ Section 9 (Biens perso)
  DELETE /api/collecte/{collecteId}                   - Supprimer collecte
  ```

- `AmortissementController.java`:
  ```
  GET    /api/collecte/{collecteId}/amortissements    - Liste amortissements
  POST   /api/collecte/{collecteId}/amortissements    - Ajouter
  PUT    /api/amortissements/{amortId}                - Modifier
  DELETE /api/amortissements/{amortId}                - Supprimer
  POST   /api/collecte/{collecteId}/amortissements/recalculer - Recalculer tous
  ```

### PHASE 3: Frontend (Angular/React selon le projet)

En utilisant la maquette `MAQUETTE_COLLECTE_AMORTS.jsx` comme référence:

1. **Créer les composants**:
   - `CollecteDonneesComponent` - Composant principal avec onglets
   - `Section1ActiviteComponent` - Section 1
   - `Section2ConditionsComponent` - Section 2 (lecture seule, données de demandeindividuel)
   - `Section3ChiffreAffairesComponent` - Section 3 avec matrice cycles
   - `Section4MargeBruteComponent` - Section 4 avec tableau produits
   - `Section5ActifsComponent` - Section 5 avec tableau stock
   - `Section6ChargesComponent` - Section 6
   - `Section7ChargesPersoComponent` - Section 7 (logique OUI/NON corrigée)
   - `Section8AutresRevenusComponent` - Section 8
   - `Section9BiensPersoComponent` - Section 9
   - `AmortissementsComponent` - Onglet Amortissements

2. **Créer les services Angular/React**:
   - `CollecteService` - Appels API pour collecte
   - `AmortissementService` - Appels API pour amortissements

3. **Intégrer dans le workflow existant**:
   - Ajouter un bouton "Collecte des données" dans la page de détail d'une demande
   - Permettre la navigation entre les sections avec sauvegarde automatique
   - Afficher le pourcentage de complétion

---

## ⚠️ POINTS D'ATTENTION

### Logique Section 7 (Charges personnelles):
```
SI salaire_fixe = OUI:
    → Afficher uniquement le champ "Montant salaire mensuel"
    → prelevement_entrepreneur = salaire_montant
    
SI salaire_fixe = NON:
    → Afficher les 10 sous-questions (a à j)
    → Afficher question k) "Dépenses prélevées dans l'activité?"
    → prelevement_entrepreneur = SUM(a + b + c + d + e + f + g + h + i + j)
```

### Calcul des amortissements:
```
amortissement_mensuel = valeur_acquisition / duree_amortissement_mois
mois_ecoules = MONTHS_BETWEEN(date_evaluation, date_acquisition)
amortissement_cumule = MIN(valeur_acquisition, amortissement_mensuel × mois_ecoules)
VNC = valeur_acquisition - amortissement_cumule
statut = VNC > 0 ? "En cours" : "Amorti"
```

### Durées standard par type d'immobilisation:
| Type | Durée |
|------|-------|
| Bâtiments et magasin | 120 mois (10 ans) |
| Installations et agencements | 60 mois (5 ans) |
| Matériels industriels | 60 mois (5 ans) |
| Mobilier de bureau | 60 mois (5 ans) |
| Matériel informatique | 36 mois (3 ans) |
| Matériel de transport | 36 mois (3 ans) |
| Autres immobilisations | 60 mois (5 ans) |

### Validation:
- La collecte ne peut être marquée "COMPLET" que si toutes les sections obligatoires sont remplies
- Les produits/stocks/amortissements peuvent avoir 0 à N lignes
- Les montants sont en GNF (Franc Guinéen), format NUMERIC(15,2)

---

## 🔗 RELATIONS ENTRE TABLES

```
demandeindividuel (1) ←──→ (1) collecte_donnees
                                    │
                                    ├── (1) collecte_chiffre_affaires
                                    ├── (1) collecte_marge_brute
                                    │       └── (N) collecte_produit
                                    ├── (1) collecte_actif_passif
                                    │       └── (N) collecte_stock_article
                                    ├── (1) collecte_charge_entreprise
                                    ├── (1) collecte_charge_personnelle
                                    ├── (1) collecte_autre_revenu
                                    ├── (1) collecte_bien_personnel
                                    └── (N) collecte_amortissement
```

---

## ✅ CRITÈRES DE SUCCÈS

1. [ ] Les 11 tables sont créées avec les bonnes contraintes
2. [ ] Les API REST fonctionnent (test avec Postman/Swagger)
3. [ ] L'interface reprend le design de la maquette
4. [ ] Les calculs automatiques (marge, amortissements) sont corrects
5. [ ] La logique conditionnelle Section 7 fonctionne
6. [ ] Les données sont liées à la demande de crédit existante
7. [ ] Le pourcentage de complétion se calcule correctement

---

## 🚀 COMMENCE PAR:

1. Lire le fichier `MAPPING_EXCEL_DATABASE.md` pour comprendre la structure
2. Exécuter le script SQL `V100__CREATE_COLLECTE_DONNEES_AMORTISSEMENTS.sql`
3. Créer les entities JPA en commençant par `CollecteDonnees.java`
4. Créer les repositories et services
5. Créer les controllers REST
6. Adapter le frontend selon la stack du projet (Angular/React)

Demande-moi des précisions si nécessaire avant de commencer l'implémentation.
