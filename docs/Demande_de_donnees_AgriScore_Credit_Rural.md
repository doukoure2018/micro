# Demande de données — AgriScore × Crédit Rural

> **SPÉCIFICATION D'INTÉGRATION**
> AGRISCORE × CRÉDIT RURAL · 04 JUIN 2026

**Objet :** la liste des données dont AgriScore a besoin de la part de Crédit Rural, pour spécifier l'API que vous exposerez. Ce document décrit **uniquement** les données que **vous seuls détenez** (identité bancaire, crédit, remboursement, KYC). Tout ce qui est agronomique, satellite, météo, sol ou comportemental est **déjà produit par AgriPilot** — nous ne vous le demandons pas.

**Légende**

| Marque | Signification |
|---|---|
| **O** | Obligatoire |
| **F** | Facultatif / enrichissant — valeur par défaut neutre si absent |
| **O si collectif** | Conditionnel |

---

## 00 — Le préalable : la clé de correspondance `PRÉREQUIS`

Avant toute donnée crédit, il faut pouvoir **rattacher un dossier de crédit à un agriculteur** connu d'AgriPilot. Il nous faut **au moins une clé d'identification commune et stable**.

| CHAMP | DESCRIPTION | TYPE | O/F |
|---|---|---|---|
| **N° de pièce d'identité (CNI)** | Identifiant national de l'agriculteur | `string` | **O** *(au moins une des deux)* |
| **Téléphone (E.164)** | Ex. `+224621234567` | `string` | **O** *(au moins une des deux)* |
| `externalFarmerId` | Votre identifiant interne de l'emprunteur (stable) | `string` | **O** |
| **Nom / Prénom** | Pour contrôle | `string` | F |

> Sans clé de correspondance, **aucun crédit ne peut être raccroché** à un profil → c'est le tout premier prérequis.

---

## 00b — Structure d'emprunt : individuel / coopérative / communauté `PRÉREQUIS`

Un agriculteur peut emprunter **seul**, **via une coopérative**, ou **en communauté villageoise** (crédit collectif à caution solidaire). Il faut distinguer **qui cultive** (l'agriculteur, toujours individuel — volet agronomique) de **qui emprunte** (l'emprunteur, individuel ou collectif — volet financier).

| CHAMP | DESCRIPTION | TYPE | O/F |
|---|---|---|---|
| `borrowerType` | Nature de l'emprunteur : `individual`, `cooperative`, `village_community` | `enum` | **O** |
| `groupId` | Identifiant du groupe emprunteur (si collectif) | `string` | O si collectif |
| `groupName` | Nom du groupe / coopérative / communauté | `string` | F |
| `members[]` | Liste des membres, **chacun avec sa clé de correspondance** (CNI ou téléphone) | `array` | O si collectif |
| `jointLiability` | Caution solidaire entre membres ? | `boolean` | O si collectif |
| `repaymentGranularity` | Suivi `per_member` ou `group_only` ? | `enum` | O si collectif |

### Règle de gestion selon `repaymentGranularity`

- **`per_member`** — Fournissez les crédits / échéances **par membre** (sections 1-2-3, comme pour un individuel). AgriScore score chaque membre + un facteur groupe.
- **`group_only`** — Fournissez les crédits / échéances **au niveau du groupe** (un seul jeu pour `groupId`). AgriScore **propage** le comportement de remboursement du groupe à tous ses membres.

> Conséquence : AgriScore produit **deux scores** — un **score individuel** (potentiel agronomique + remboursement, propre ou hérité du groupe) et un **score de groupe** agrégé, pour décider d'un prêt collectif.

---

## 01 — Dossiers de crédit : par agriculteur ou par groupe

Liste des prêts de l'agriculteur (ou du groupe si `borrowerType` est collectif et `repaymentGranularity = group_only`).

| CHAMP | DESCRIPTION | TYPE | O/F |
|---|---|---|---|
| `creditId` | Identifiant unique du dossier | `string` | **O** |
| `amount` | Montant total du prêt | `number` | **O** |
| `currency` | Devise (défaut GNF) | `string` | F |
| `status` | État du dossier : `active`, `completed`, `defaulted`, `restructured`, `written_off` | `enum` | **O** |
| `disbursementDate` | Date de décaissement | `date ISO` | **O** |
| `maturityDate` | Date d'échéance finale | `date ISO` | **O** |
| `type` | `input_financing`, `working_capital`, `equipment`, `land`, `other` | `enum` | F |
| `purpose` | Objet du prêt (ex. « Semences NERICA + engrais NPK ») | `string` | F |
| `interestRate` | Taux d'intérêt annuel (%) | `number` | F |
| `collateral` | Garantie associée | `string` | F |

> Le champ `status` est central : un dossier `defaulted` pénalise fortement le score. Fournir l'historique complet (dossiers clôturés inclus), pas seulement les prêts en cours.

---

## 02 — Échéances & remboursements : par dossier

Le détail des échéances de chaque crédit — c'est le cœur du signal de remboursement.

| CHAMP | DESCRIPTION | TYPE | O/F |
|---|---|---|---|
| `dueDate` | Date d'échéance prévue | `date ISO` | **O** |
| `amount` | Montant de l'échéance | `number` | **O** |
| `status` | `pending`, `paid`, `late`, `missed` | `enum` | **O** |
| `paidDate` | Date de paiement réelle (null si impayé) | `date ISO` | F |
| `paidAmount` | Montant réellement payé | `number` | F |
| `daysLate` | Nombre de jours de retard (0 si à temps) | `number` | **O** |

---

## 03 — Synthèse de remboursement : par agriculteur

Agrégats que vous pouvez fournir pré-calculés (sinon nous les recalculons depuis les échéances ci-dessus).

| CHAMP | DESCRIPTION | TYPE | O/F |
|---|---|---|---|
| `overallRepaymentRate` | Taux de remboursement à temps, tous crédits (0–100) | `number` | **O** |
| `hasDefault` | Vrai si au moins un crédit est en défaut | `boolean` | **O** |
| `activeAmount` | Encours en cours (somme des crédits `active`) | `number` | **O** |
| `totalAmountBorrowed` | Cumul de tous les montants empruntés | `number` | **O** |
| `avgDaysLate` | Retard moyen (jours) sur les échéances payées | `number` | **O** |
| `activeCredits` | Nombre de crédits en cours | `number` | F |
| `lastCreditDate` | Date du dernier décaissement | `date ISO` | F |

---

## 04 — Épargne & endettement (si disponible)

Améliore la précision du pilier financier (sous-composantes épargne 25 % et endettement 20 %).

| CHAMP | DESCRIPTION | TYPE | O/F |
|---|---|---|---|
| `savingsBalance` | Solde d'épargne actuel | `number` | F |
| `savingsRegularity` | Régularité des dépôts (ex. nb dépôts/an) | `number` | F |
| `existingDebt` | Endettement total en cours (autres prêts) | `number` | F |
| `estimatedIncome` | Revenu estimé connu de la banque | `number` | F |

---

## 05 — Profil KYC (si présent dans votre onboarding)

Ces données nourrissent les piliers social et marché. Si vous ne les avez pas, AgriPilot les collecte sur le terrain — donc facultatif côté banque.

| CHAMP | DESCRIPTION | TYPE | O/F |
|---|---|---|---|
| `cooperativeMembership.name` | Coopérative d'appartenance | `string` | F |
| `cooperativeMembership.joinDate` | Date d'adhésion | `date ISO` | F |
| `farmingExperience` | Années d'expérience agricole | `number` | F |
| `educationLevel` | `none`, `primary`, `secondary`, `high_school`, `vocational`, `university` | `enum` | F |
| `landTenure` | `owned`, `inherited`, `communal`, `rented` | `enum` | F |
| `crops` | Cultures pratiquées | `string[]` | F |

---

## 05b — Modèle d'accès & portefeuilles : qui voit quoi `PRÉREQUIS`

Vos agents se connecteront à AgriScore (via SSO). Pour que **chaque agent ne voie que son périmètre**, nous avons besoin de votre **modèle d'habilitation**.

> **Question préalable :** un agent est-il rattaché à un **portefeuille nominatif** d'agriculteurs, ou voit-il **toute son agence / région** ?

### a) Les agents `utilisateurs CR d'AgriScore`

| CHAMP | DESCRIPTION | TYPE | O/F |
|---|---|---|---|
| `agentId` | Identifiant de l'agent (doit correspondre à son identité SSO) | `string` | **O** |
| `agentName` | Nom de l'agent | `string` | F |
| `agentEmail` / `agentPhone` | Identifiant de connexion (clé de correspondance SSO) | `string` | **O** |
| `role` | `agent`, `superviseur`, `chef_agence`, `risque_siege` | `enum` | **O** |
| `agencyId` | Agence / antenne de rattachement de l'agent | `string` | **O** |
| `managerId` | Responsable hiérarchique (pour que le superviseur voie ses agents) | `string` | F |

### b) La structure `agences / régions`

| CHAMP | DESCRIPTION | TYPE | O/F |
|---|---|---|---|
| `agencyId` | Identifiant de l'agence | `string` | **O** |
| `agencyName` | Nom de l'agence | `string` | F |
| `region` | Région / préfecture de l'agence | `string` | F |
| `parentAgencyId` | Agence parente (hiérarchie) | `string` | F |

### c) L'affectation des agriculteurs `selon le cloisonnement`

| CHAMP | DESCRIPTION | TYPE | O/F |
|---|---|---|---|
| `assignedAgentId` | **Modèle par affectation :** l'agent responsable de cet agriculteur | `string` | O si « par affectation » |
| `farmerAgencyId` | **Modèle par unité :** l'agence de rattachement de l'agriculteur | `string` | O si « par agence » |

### d) La règle d'accès par rôle

| RÔLE | PÉRIMÈTRE VISIBLE |
|---|---|
| `agent` | Ses agriculteurs affectés (ou son agence) |
| `superviseur` / `chef_agence` | Tous les agriculteurs de son agence / de ses agents |
| `risque_siege` | Tout le portefeuille Crédit Rural |

> Ces données alimentent le **cloisonnement** d'AgriScore : un chargé de crédit de Mamou ne verra pas le portefeuille de Kankan.

---

## 06 — Ce que nous NE vous demandons PAS

Déjà produit par AgriPilot — inutile de nous transmettre :

- ✗ Indices de végétation (NDVI / NDWI…), imagerie satellite
- ✗ Données météo / climat / sol
- ✗ Estimations de rendement
- ✗ Santé des cultures, stades ITK
- ✗ Engagement / activité plateforme (pilier comportemental)

---

## 07 — API suggérée : exemples d'endpoints

Vue d'ensemble des points d'entrée dont AgriPilot a besoin (noms indicatifs, à adapter à votre SI).

| ENDPOINT | RÔLE |
|---|---|
| `GET /agents/{agentId}/portfolio` | Portefeuille d'un agent (ses agriculteurs) — cloisonnement |
| `GET /farmers/{externalFarmerId}` | Détail d'un emprunteur (identité + KYC) |
| `GET /farmers/{externalFarmerId}/credit-profile` | Crédits & remboursements d'un emprunteur |
| `GET /groups/{groupId}` · `/credit-profile` | Cas collectif (coopérative / communauté) |
| `GET /agents` · `/agencies` | Modèle d'accès (agents, rôles, agences) — SSO |

**Paramètres communs :** pagination (`?page`, `?limit`) et sync delta (`?updatedSince=2026-06-01T00:00:00Z`) pour ne récupérer que ce qui a changé.

### 7.1 — Portefeuille d'un agent

`GET /agents/{agentId}/portfolio?page=1&limit=50`

```json
{
  "agentId": "AG-Mamou-007",
  "agencyId": "AGENCE-MAMOU",
  "page": 1, "limit": 50, "total": 128,
  "farmers": [
    {
      "externalFarmerId": "CR-EMP-00123",
      "nationalId": "GN-123456789",
      "phone": "+224621234567",
      "fullName": "Mariama Diallo",
      "borrowerType": "individual",
      "agencyId": "AGENCE-MAMOU",
      "assignedAgentId": "AG-Mamou-007",
      "activeCredits": 1, "hasDefault": false
    }
  ]
}
```

### 7.2 — Détail d'un emprunteur (identité + KYC)

`GET /farmers/{externalFarmerId}`

```json
{
  "externalFarmerId": "CR-EMP-00123",
  "nationalId": "GN-123456789",
  "phone": "+224621234567",
  "fullName": "Mariama Diallo",
  "agencyId": "AGENCE-MAMOU",
  "assignedAgentId": "AG-Mamou-007",
  "kyc": {
    "cooperativeMembership": { "name": "Coopérative Agricole de Boffa", "joinDate": "2023-06-.." },
    "farmingExperience": 14,
    "educationLevel": "secondary",
    "landTenure": "inherited",
    "crops": ["riz", "maïs"]
  }
}
```

### 7.3 — Crédits & remboursements d'un emprunteur

`GET /farmers/{externalFarmerId}/credit-profile`

```json
{
  "externalFarmerId": "CR-EMP-00123",
  "credits": [
    {
      "creditId": "CR-2026-001",
      "borrowerType": "individual",
      "amount": 15000000, "currency": "GNF",
      "type": "input_financing",
      "purpose": "Semences NERICA + engrais NPK",
      "status": "active",
      "disbursementDate": "2026-02-01",
      "maturityDate": "2026-09-30",
      "interestRate": 10,
      "installments": [
        { "dueDate": "2026-03-01", "amount": 2250000, "status": "paid", "daysLate": 0 },
        { "dueDate": "2026-04-01", "amount": 2250000, "status": "late", "paidDate": "2026-04-.." }
      ]
    }
  ],
  "summary": {
    "overallRepaymentRate": 85, "hasDefault": false,
    "activeAmount": 9000000, "totalAmountBorrowed": 15000000,
    "avgDaysLate": 3.5, "activeCredits": 1, "lastCreditDate": "2026-02-01"
  }
}
```

> Le besoin d'AgriPilot est d'accéder à ces données, pas d'imposer des noms de champs : nous adaptons notre connecteur à votre structure. Le JSON ci-dessus est l'idéal cible, à ajuster selon ce que votre SI sait produire.

### 7.4 — Cas collectif (coopérative / communauté villageoise)

`GET /groups/{groupId}`

```json
{
  "groupId": "GVEC-Timbi-12",
  "groupType": "village_community",
  "groupName": "Communauté villageoise de Timbi Madina",
  "agencyId": "AGENCE-MAMOU",
  "jointLiability": true,
  "repaymentGranularity": "group_only",
  "members": [
    { "externalFarmerId": "CR-EMP-00123", "nationalId": "GN-123456789", "phone": "+224621234.." },
    { "externalFarmerId": "CR-EMP-00124", "phone": "+224620000002" }
  ]
}
```

`GET /groups/{groupId}/credit-profile` → même structure que le credit-profile d'un emprunteur (7.3), mais au niveau du groupe (quand `repaymentGranularity = group_only`). AgriScore propage ensuite le remboursement aux membres.

### 7.5 — Modèle d'accès : agents & agences (pour le SSO)

`GET /agents` · `GET /agencies`

```json
{
  "agents": [
    {
      "agentId": "AG-Mamou-007",
      "agentName": "Saa Koundouno",
      "agentEmail": "s.koundouno@creditrural.gn",
      "role": "agent",
      "agencyId": "AGENCE-MAMOU",
      "managerId": "AG-Mamou-001"
    }
  ],
  "agencies": [
    { "agencyId": "AGENCE-MAMOU", "agencyName": "Agence de Mamou", "region": "Mamou", "parentAgencyId": "..." }
  ]
}
```

---

## L'essentiel en une phrase

> Pour activer AgriScore, le minimum vital = **une clé de correspondance** (CNI ou téléphone) + le **type d'emprunteur** (individuel / coopérative / communauté) + l'**historique des crédits et de leurs remboursements** (sections 1, 2, 3). Tout le reste (sections 4–5) **enrichit** le score sans le bloquer.

---

**www.kumy.consulting**
Quartier Taouyah, Commune de Ratoma · Conakry, République de Guinée — contact@kumy.consulting · +224 612 59 08 88 · 612 81 77 05
RCCM : GN/TCC.2025.B.12060 · NIF : 940351208
