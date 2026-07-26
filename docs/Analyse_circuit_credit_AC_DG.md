# Analyse complète du circuit de traitement d'une demande de crédit

**De la mise en place par l'Agent de Crédit jusqu'à la validation de la Direction Générale**

*Crédit Rural de Guinée — Plateforme digitale de crédit (e-Crédit)*
*Document établi le 26 juillet 2026*

---

## 1. Vue d'ensemble du circuit

Le traitement d'une demande de crédit individuel suit un circuit de validation hiérarchique à cinq niveaux, entièrement digitalisé. Chaque dossier est matérialisé par un état (`validation_state`) qui trace précisément sa position dans le circuit :

```
AGENT DE CRÉDIT          DA (Agence)        DR (Délégation)      DE (Exploitation)         DG (≥ 100M)
─────────────────        ───────────        ───────────────      ─────────────────         ───────────
Création (NOUVEAU)
   ↓
Sélection (SELECTION)
   ↓
Analyse financière
   ↓
Approbation (APPROVED) →  Validation    →   Validation      →    Validation
                          (VALIDATED_DA)    (VALIDATED_DR)       ├─ < 100M → VALIDATED_FINAL ✅
                                                                 └─ ≥ 100M → PENDING_DG  →  Visa DG → VALIDATED_FINAL ✅
```

À chaque niveau, le valideur peut **valider** (le dossier monte), **rejeter** (le dossier redescend en correction avec motif, sections à revoir et instructions), et — pour le DA uniquement — **renvoyer à l'agent** en cas d'erreur de destination. Chaque action est horodatée et nominative (`validated_by_X`, `date_validation_X`, `avis_X`), garantissant une traçabilité complète.

---

## 2. Acteurs et responsabilités

| Acteur | Rôle système | Périmètre | Responsabilité |
|---|---|---|---|
| **Agent de Crédit (AC)** | `AGENT_CREDIT` | Son point de vente | Création du dossier, analyse financière, approbation initiale, corrections |
| **Directeur d'Agence (DA)** | `DA` | Son agence | 1er contrôle : cohérence du dossier et de l'analyse |
| **Délégué Régional (DR)** | `DR` | Sa délégation | 2e contrôle : validation régionale |
| **Direction de l'Exploitation (DE)** | `MANAGER` + service `DE` | **National** | Validation finale (< 100M) ou transmission au DG (≥ 100M) ; supervision globale |
| **Directeur Général (DG)** | `DG` | National | Visa des gros crédits (≥ 100 000 000 GNF) |
| **Direction de l'Inspection (DI)** | `MANAGER` + service `DI` | National | Consultation de tous les crédits validés DR (lecture seule) |

---

## 3. Étape 1 — Mise en place par l'Agent de Crédit

### 3.1 Création de la demande

L'agent saisit la demande depuis son espace sécurisé (`/dashboards/nouvelle-demande`, accès réservé au rôle AGENT_CREDIT, backend également sécurisé). Le formulaire couvre l'intégralité du dossier :

- **Identification du membre** : nom, prénom, téléphone, numéro de membre, date/lieu de naissance, genre, situation matrimoniale, pièce d'identité ;
- **Rattachement réseau** : délégation → agence → point de vente ;
- **Situation personnelle** : personnes à charge, scolarisées, type de propriété, ancienneté d'habitation ;
- **Activité économique** : type/sous-type d'activité, description, ancienneté, localisation ;
- **Modalités du crédit sollicité** : montant, durée, périodicité, taux, différé, nombre d'échéances, objet du crédit ;
- **Garanties proposées** : type, description et valeur de chaque garantie (saisies dans la même transaction).

À la création : `statut_demande = EN_ATTENTE`, `validation_state = NOUVEAU`.

### 3.2 Sélection (prise en charge)

La demande nouvellement créée est **prise en charge** (état `SELECTION`) : l'agent s'affecte le dossier pour instruction. Une affectation peut être **annulée** (retour à `NOUVEAU`) tant que l'analyse n'est pas engagée.

### 3.3 Analyse financière

L'agent instruit ensuite le dossier à travers quatre volets d'analyse :

- **Analyse du bilan de l'activité** (actifs, passifs de l'activité du membre) ;
- **Analyse des flux de trésorerie** (capacité de remboursement) ;
- **Résumé de l'analyse financière** ;
- **Personnes caution** (garants physiques).

L'analyse soumise porte le statut `SOUMISE` dans la table `analyse_financiere`.

### 3.4 Approbation par l'agent

L'agent formule son **avis** et approuve le dossier → état `APPROVED`. Son nom complet est enregistré comme créateur (`cod_usuarios`), ce qui servira à lui réadresser le dossier en cas de correction ou de renvoi.

**Garde-fou anti-oubli** : un dossier dont l'analyse financière est soumise mais non approuvée remonte automatiquement en tête du tableau de bord de l'agent dans une section « Demandes à approuver » — le dossier ne peut pas être oublié en cours de route.

---

## 4. Étape 2 — Validation du Directeur d'Agence (DA)

Le DA voit les dossiers `APPROVED` **de son agence uniquement**, avec l'avis de l'agent. Depuis le détail du dossier, trois décisions possibles :

| Décision | Effet | État résultant |
|---|---|---|
| **Valider** (avis obligatoire) | Le dossier monte au DR ; horodatage + nom du DA | `VALIDATED_DA` |
| **Rejeter** (motif + sections à revoir + instructions) | Retour à l'agent pour correction | `CORRECTION` |
| **Renvoyer à l'agent** (motif) | Cas particulier : le dossier a été adressé au **mauvais DA** (erreur de délégation/agence/PDV) | `RETOUR_AGENT` |

Dans le cas du **renvoi**, l'agent créateur retrouve le dossier dans une section « Demandes renvoyées », **corrige la destination** (délégation/agence/point de vente en cascade) et resoumet : le dossier repart en `APPROVED` vers le bon DA — sans ressaisie du dossier.

---

## 5. Étape 3 — Validation du Délégué Régional (DR)

Le DR voit les dossiers `VALIDATED_DA` **de sa délégation**, avec l'historique des avis (agent + DA). Deux décisions :

- **Valider** → `VALIDATED_DR` (le dossier monte au DE), horodaté et nominatif ;
- **Rejeter** (motif + sections + instructions au DA) → `CORRECTION_DR` : le dossier redescend, le DA et l'agent voient le retour du DR et le dossier est corrigé puis re-validé par le DA.

C'est l'étape DR qui alimente également l'**environnement d'inspection (DI)** : tout crédit ayant franchi ce niveau (`date_validation_dr` renseignée) devient visible par la Direction de l'Inspection, sur tout le réseau, regroupé gros/petits crédits.

---

## 6. Étape 4 — Validation de la Direction de l'Exploitation (DE)

Le DE opère à l'échelle **nationale** avec trois outils :

1. **File « À valider DE »** : tous les dossiers `VALIDATED_DR` du réseau, présentés par délégation ;
2. **Suivi global des crédits** : tableau de bord de toutes les demandes en cours, avec **calcul du délai d'attente par étape** (jours passés au niveau agent, DA, DR…), filtres par délégation/agence/PDV et compteurs par profil ;
3. **Historique « Crédits validés DE »**.

### 6.1 La règle du seuil de 100 millions

La validation DE applique un **aiguillage automatique** selon le montant :

```
montant_demande ≥ 100 000 000 GNF  →  PENDING_DG        (visa DG requis)
montant_demande < 100 000 000 GNF  →  VALIDATED_FINAL   (crédit définitivement validé)
```

En cas de **rejet DE** (motif + sections + instructions au DR) → `CORRECTION_DE`, visible par le DR et par l'agent pour correction.

### 6.2 Aide à la décision : la synthèse enrichie

Au moment de statuer, le DE (et le DG) dispose d'une **synthèse consolidée du dossier**, croisant les données saisies avec les **données réelles du système bancaire de production (SAF2000)** :

1. **Ancienneté du membre** — date d'adhésion réelle dans l'institution ;
2. **Comptes d'épargne du client** — comptes et soldes (disponible, moyen, gelé), plus les **mouvements dépôts/retraits sur 6 mois glissants** par compte ;
3. **Situation des crédits antérieurs + score de confiance** — historique complet des crédits, avec un **score gradué** calculé sur le comportement de remboursement (notation par jours de retard : ≤ 5 j = 100, ≤ 30 j = 70, ≤ 90 j = 40, > 90 j = 10/0, pondération ×2 des 18 derniers mois) ;
4. **Comparatif dernier crédit vs demande actuelle** — pour situer la nouvelle sollicitation dans la trajectoire du client.

La synthèse regroupe aussi les garanties, cautions, documents, la trésorerie prévisionnelle et l'ensemble des avis émis. En cas d'indisponibilité de la liaison bancaire, ces sections se masquent proprement sans bloquer la validation (dégradation gracieuse). *Depuis le 25 juillet 2026, ces données sont lues directement sur la base de production.*

---

## 7. Étape 5 — Visa de la Direction Générale (DG, crédits ≥ 100M)

Le DG dispose d'un espace dédié « Crédits à valider (≥ 100M) » listant les dossiers `PENDING_DG` **triés par montant décroissant**, avec l'historique complet des avis (agent, DA, DR, DE). Deux décisions :

- **Valider** (avis) → `VALIDATED_FINAL` : le crédit est définitivement approuvé ;
- **Rejeter** (motif libre) → `REJETE_DG`.

### 7.1 Le circuit de rejet DG — double contrôle

Un rejet DG **ne redescend pas directement** à l'agent : il passe par une **confirmation du DE** (« Rejets DG à confirmer »). Le DE prend connaissance du motif du DG, formule ses **instructions** et confirme → le dossier repart en `CORRECTION` chez l'agent créateur. Ce maillon garantit que la Direction de l'Exploitation reste informée et cadre la reprise du dossier.

Le DG dispose en outre d'une **vue miroir en lecture seule** du tableau de bord du DE (« Suivi Direction Exploitation »), lui donnant la même visibilité sans capacité d'action sur les dossiers de niveau DE.

---

## 8. Table de référence des états

| État | Posé par | Signification | Prochain acteur |
|---|---|---|---|
| `NOUVEAU` | Création (AC) | Demande créée, non prise en charge | AC |
| `SELECTION` | AC | En cours d'instruction (analyse financière) | AC |
| `APPROVED` | AC (approbation) | Analysée et approuvée par l'agent | DA |
| `VALIDATED_DA` | DA | Validée par l'agence | DR |
| `VALIDATED_DR` | DR | Validée par la délégation | DE |
| `PENDING_DG` | DE (≥ 100M) | Validée DE, en attente de visa DG | DG |
| `VALIDATED_FINAL` | DE (< 100M) ou DG | **Crédit définitivement validé** | — (mise en place) |
| `CORRECTION` | Rejet DA ou rejet DG confirmé | À corriger par l'agent | AC |
| `CORRECTION_DR` | Rejet DR | À corriger (retour visible DA + AC) | AC → DA |
| `CORRECTION_DE` | Rejet DE | À corriger (retour visible DR + AC) | AC → DR |
| `RETOUR_AGENT` | Renvoi DA | Erreur de destination à corriger | AC |
| `REJETE_DG` | Rejet DG | En attente de confirmation du DE | DE |

Chaque niveau conserve ses colonnes propres : `avis_X`, `validated_by_X`, `date_validation_X`, `motif_rejet_X`, `sections_a_revoir_X`, `instructions_X` — l'historique complet du dossier est donc reconstituable à tout moment.

---

## 9. Points forts du dispositif

1. **Traçabilité intégrale** : chaque décision est nominative, horodatée et motivée ; les avis de tous les niveaux restent attachés au dossier.
2. **Séparation des pouvoirs** : quatre regards indépendants (AC, DA, DR, DE) + un cinquième pour les grands engagements (DG), avec des périmètres étanches (agence, délégation, national).
3. **Boucles de correction ciblées** : le rejet précise motif, *sections à revoir* et *instructions*, ce qui évite les allers-retours flous ; le dossier corrigé reprend le circuit sans ressaisie.
4. **Gestion des erreurs d'aiguillage** : le renvoi à l'agent (`RETOUR_AGENT`) traite proprement le cas du dossier adressé à la mauvaise agence, avec re-destination par l'agent créateur (choix de gouvernance validé : pas de transfert direct entre DA).
5. **Aide à la décision objective** : la synthèse enrichie (ancienneté, épargne, historique + score de confiance, comparatif) ancre la décision dans les données réelles de production du système bancaire.
6. **Garde-fous opérationnels** : rappel « à approuver » côté agent, suivi global DE avec délais d'attente par étape, double contrôle DE sur les rejets DG.

## 10. Axes d'amélioration identifiés

1. **Notifications** : aucune notification automatique (e-mail/SMS) n'est émise aux changements d'état — le suivi repose sur la consultation des écrans. Notifier l'acteur suivant (et l'agent lors d'un rejet) accélérerait le cycle.
2. **Contrainte d'intégrité des états** : `validation_state` est un champ libre en base (pas de contrainte CHECK) ; une contrainte ou une table de référence sécuriserait contre tout état invalide.
3. **Délais cibles (SLA)** : le suivi global calcule les jours d'attente, mais aucun seuil d'alerte n'est défini (ex. dossier > N jours au même niveau → alerte au niveau supérieur).
4. **Délégation de signature** : en cas d'absence d'un valideur (DA/DR), aucun mécanisme d'intérim n'existe — les dossiers attendent.
5. **Tableau de bord DG dédié aux volumes** : le DG voit les dossiers ≥ 100M à l'unité ; un cumul des engagements approuvés par période compléterait utilement sa vue.

---

*Fin du document.*
