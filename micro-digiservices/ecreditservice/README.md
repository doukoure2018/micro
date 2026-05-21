# Rapprochement Caisse — Documentation Backend

## Objectif

Comparer les transactions saisies côté **Middleware** (saisie caisse jour-J par le caissier) avec les transactions effectivement comptabilisées côté **base Production CRG** (back-office bancaire), afin d'identifier les écarts en fin de journée.

## Architecture

```
Frontend Angular
      │
      ▼
┌──────────────────────────────────────┐
│  ecreditservice                      │
│  RapprochementResource.java          │  ← contrôle d'horaire + user/agence
└──────────────┬───────────────────────┘
               │ Feign (EbankingClient)
               ▼
┌──────────────────────────────────────┐
│  ebanking                            │
│  ReconciliationController.java       │  ← POST /ebanking/reconciliation/check
└─────┬────────────────────┬───────────┘
      │                    │
      ▼                    ▼
┌──────────┐         ┌──────────┐
│Middleware│         │Production│
│ BD_MIDDLE│         │  BDCRG   │
│  10.x.11 │         │  10.x.8  │
└──────────┘         └──────────┘
TRANSACTIONSAF,      CJ_TRAN_MENSUAL_ENCA,
OPERATIONSRESERVE    CC_MOVIMTO_MENSUAL,
                     CC_CUENTA_EFECTIVO
```

## Endpoints exposés par `RapprochementResource`

| Méthode | Path | Rôle | Description |
|---|---|---|---|
| `GET` | `/ecredit/rapprochement/check` | Caissier | Rapprochement sur **sa propre** caisse (code agence dérivé de `user.pointventeId`) |
| `GET` | `/ecredit/rapprochement/audit` | Auditeur | Rapprochement sur **n'importe quel** point de vente (paramètre `pointVenteCode`) |
| `GET` | `/ecredit/rapprochement/points-vente` | Auditeur | Liste des points de vente disponibles |
| `GET` | `/ecredit/reconciliationcompte/check` | Caissier | Variante : rapprochement par compte (table `CC_MOVIMTO_MENSUAL`) |
| `GET` | `/ecredit/test` | Dev | Endpoint santé |

Tous prennent `dateDebut` et `dateFin` (`ISO.DATE`).

## Contrôles d'accès

### 1. Cutoff horaire — `RapprochementCutoffService`

Avant chaque appel, `cutoffService.isSubmissionAllowed()` vérifie l'heure côté Conakry :

```
cutoffTime          = 10:00   (rapprochement.caisse.cutoff-time)
gracePeriodMinutes  = 15      (rapprochement.caisse.grace-period-minutes)
timezone            = Africa/Conakry
```

Soumission possible jusqu'à **10:15 (Conakry)**. Au-delà, réponse `403 FORBIDDEN` avec code d'erreur `RAPPROCHEMENT_CLOSED`.

### 2. Affectation du caissier à un point de vente

Pour les endpoints non-audit, l'utilisateur **doit** avoir `pointventeId` non-null en base. Sinon → `400 BAD_REQUEST` avec message "Point de vente non configuré".

L'`Authentication` Spring Security est exploitée via `userClient.getUserByUuid(authentication.getName())` puis `userClient.getPointVenteClient(user.getPointventeId())` pour résoudre le `code` de l'agence.

## Logique de rapprochement (côté ebanking)

Deux variantes, chacune dans son propre service :

### `ReconciliationService` — rapprochement transactionnel

- **Middleware** : `TRANSACTIONSAF` + `OPERATIONSRESERVE`.
- **Production** : `CJ.CJ_TRAN_MENSUAL_ENCA`.
- **Règle de match** : appariement par client × type (`TIP_TRANSACCION` 5 = Dépôt, 6 = Retrait, 3 = Réserve) × montant × période.
- **Résultat** : liste des transactions Middleware non rapprochées côté Production (= transactions saisies mais non comptabilisées, ou inversement).

### `ReconciliationCompteService` — rapprochement comptable par compte

- **Middleware** : `TRANSACTIONSAF` + `OPERATIONSRESERVE`.
- **Production** : `CC.CC_MOVIMTO_MENSUAL` (filtre `EST_MOVIMIENTO = 'C'`).
- Variante utilisée quand on veut détecter des écarts au niveau **compte** plutôt qu'au niveau **transaction individuelle**.

## DTO de réponse — `ReconciliationResultDTO`

- `transactionsNonRapprochees` : liste `TRANSACTIONSAF` sans contrepartie
- `operationsReserveNonRapprochees` : opérations réserve sans contrepartie
- `nombreRapprochements` : compteur des matches réussis
- Statistiques de période (date min/max, statuts, etc.)
- Message d'erreur le cas échéant (`ReconciliationResultDTO.error(...)`)

Renvoyé par le contrôleur dans une enveloppe `Response` (`RequestUtils.getResponse(...)`) avec HTTP `201 CREATED` et `Location: /ecredit/rapprochement-caisse`.

---

## Tables Middleware (`BD_MIDDLEWARE` @ 10.220.220.11)

Saisie temps-réel par le caissier — source "front-office".

### `TRANSACTIONSAF` (schéma `dbo`)

Transactions client saisies à la caisse.

| Colonne | Description |
|---|---|
| `NUMTRANSACTION` | Identifiant unique de la transaction (PK logique) |
| `DATEOPERATION` | Date/heure de la saisie côté caisse |
| `CODEAGENCE` | Code agence où la transaction a été saisie |
| `NUMCOMPTE` | Numéro de compte client |
| `CODECLIENT` | Code client |
| `MONTANT` | Montant de la transaction |
| `TYPEOPERATION` | Type d'opération (texte) |
| `TYPETRANSACTION` | Type numérique (5 = Dépôt, 6 = Retrait) |
| `SOUSTYOETRANSACTION` | Sous-type |
| `NUMECRITURECOMPTABLE` | N° d'écriture comptable (lien Production) |
| `SOLDEAVANTOPERATION` / `SOLDEAPRESOPERATION` | Solde compte client avant/après |
| `SOLDECAISSEAVANT` / `SOLDECAISSEAPRES` | Solde caisse avant/après |
| `FAITPAR` | Caissier qui a saisi |
| `ETATSAF` | État (filtre rapprochement : `'Success'` ou `NULL`) |
| `DATEEXECUTION`, `ERRORS`, `NBRE` | Métadonnées d'exécution |

Lue par `getMiddlewareTransactionsPeriod()` dans `ReconciliationService` et `ReconciliationCompteService`.

### `OPERATIONSRESERVE` (schéma `dbo`)

Mouvements de fonds entre caisse et réserve (≠ transactions client).

| Colonne | Description |
|---|---|
| `NUMERO` | Identifiant unique |
| `DATEOPERATION` | Date/heure de l'opération |
| `CODEAGENCE` | Code agence |
| `CODEUSER` | Utilisateur initiateur |
| `MONTANT` | Montant |
| `TRANSACTIONOP` | **1 = Retrait** (réserve → caisse), **2 = Dépôt** (caisse → réserve) |
| `LIBELLEOP` | Libellé |
| `COMPTECAISSE` | Compte caisse |
| `COMPTERESERVE` | Compte réserve |
| `ETATOP` | État (filtre : `'Success'`) |
| `VALIDERPAR` | Validateur |
| `DATEEXECUTION`, `ERRORS`, `NBRE` | Métadonnées |

Lue par `getReserveOperationsPeriod()`. Le mapping vers Production est :
- `TRANSACTIONOP = 1` (Retrait réserve) ↔ Production `NUM_MOV_ENTE = 'D'`
- `TRANSACTIONOP = 2` (Dépôt réserve) ↔ Production `NUM_MOV_ENTE = 'A'`

---

## Tables Production (`BDCRG` @ 10.220.220.8)

Comptabilité bancaire centrale — source "back-office".

### `CJ.CJ_TRAN_MENSUAL_ENCA`

Encaissement caisse mensuel — utilisé par **`ReconciliationService`** (rapprochement transactionnel).

| Colonne | Description |
|---|---|
| `COD_EMPRESA` | Code entité (`'00000'` par défaut) |
| `NUM_SECUENCIA_DOC` | Numéro de séquence du document |
| `COD_AGENCIA` | Code agence (clé de jointure) |
| `COD_CLIENTE` | Code client |
| `COD_SISTEMA` | Système source |
| `TIP_TRANSACCION` | **3 = Réserve**, **5 = Dépôt**, **6 = Retrait** |
| `SUB_TIP_TRANSAC` | Sous-type |
| `FEC_TRANSACCION` | Date de la transaction |
| `IND_ESTADO` | État (filtre rapprochement : `'A'` = Actif/comptabilisé) |
| `MTO_MOVIMIENTO` | Montant du mouvement |
| `MTO_EFECTIVO` | Montant effectif (utilisé pour le match avec `MONTANT` Middleware) |
| `COD_CAJERO` | Caissier comptable |
| `NUM_MOV_ENTE` | **'A' = Dépôt**, **'D' = Retrait** (pour opérations réserve) |
| `ASIENTO_CONTABLE` | Écriture comptable |
| `TIP_ENTE` / `COD_ENTE` | Type/code de l'entité |

Lue par `getProductionTransactionsPeriod()` dans `ReconciliationService.java:425`.

### `CC.CC_MOVIMTO_MENSUAL`

Mouvements de comptes mensuels — utilisé par **`ReconciliationCompteService`** (rapprochement par compte).

| Colonne | Description |
|---|---|
| `COD_EMPRESA` | Code entité |
| `NUM_MOVIMIENTO` | Numéro de mouvement |
| `NUM_CUENTA` | Numéro de compte (clé de jointure côté compte) |
| `COD_PRODUCTO` | Code produit |
| `TIP_TRANSACCION` | Type numérique de transaction |
| `SUBTIP_TRANSAC` | Sous-type |
| `COD_SISTEMA` | Système source |
| `FEC_MOVIMIENTO` | Date du mouvement |
| `NUM_DOCUMENTO` | N° de document |
| `EST_MOVIMIENTO` | État (filtre : **`'C'` = Confirmé**, majoritaire) |
| `IND_APL_CARGO` | Indicateur débit/crédit |
| `MON_MOVIMIENTO` | Montant du mouvement |
| `DES_MOVIMIENTO` | Description |
| `SISTEMA_FUENTE` | Système d'origine |
| `NUM_MOV_FUENTE` | N° mouvement source (lien vers `TRANSACTIONSAF.NUMECRITURECOMPTABLE`) |
| `COD_AGENCIA` | Code agence |
| `COD_USUARIO` | Utilisateur |
| `DES_REFERENCIA` | Référence |

Lue par `ReconciliationCompteService.java:442`.

### `CC.CC_CUENTA_EFECTIVO` (utilisée par la fiche signalétique)

Snapshot des soldes par compte client. Pas directement utilisée par le rapprochement caisse, mais critique pour la fiche signalétique avec rapprochement des soldes Production ↔ Middleware :

| Colonne | Description |
|---|---|
| `COD_EMPRESA`, `COD_CLIENTE` | Clé de filtre |
| `COD_AGENCIA`, `NUM_CUENTA` | Identification du compte |
| `COD_CATEGORIA` | `DEPVU`, `EPTON`, `DAT`, `PLEPA` |
| `SAL_DISPONIBLE`, `SAL_PROMEDIO`, `SAL_CONGELADO`, `SAL_TRANSITO`, `SAL_RESERVA` | Soldes |
| `IND_ESTADO` | `A=Actif`, `I=Inactif`, `B=Bloqué`, `C=Clôturé`, etc. |
| `FEC_ULT_MOVIMIENTO`, `FEC_APERTURA` | Dates |

La **même table** est répliquée côté Middleware ; c'est le rapprochement Production ↔ Middleware sur cette table qui est utilisé pour détecter les écarts de soldes (cf. `FicheSignaletiqueRepository.getComptesSoldes` et `getComptesSoldesMiddleware`).

### `CL.SP_GET_FICHE_SIGNALETIQUE_CLIENT` (procédure stockée)

Procédure stockée Production qui retourne l'identité complète du client. Appelée par `FicheSignaletiqueRepository.getFicheSignaletique`.

---

## Récapitulatif : qui interroge quoi

| Service | Pool JDBC | Tables lues |
|---|---|---|
| `ReconciliationService` | `middlewareJdbcTemplate` | `TRANSACTIONSAF`, `OPERATIONSRESERVE` |
| `ReconciliationService` | `productionJdbcTemplate` | `CJ.CJ_TRAN_MENSUAL_ENCA` |
| `ReconciliationCompteService` | `middlewareJdbcTemplate` | `TRANSACTIONSAF`, `OPERATIONSRESERVE` |
| `ReconciliationCompteService` | `productionJdbcTemplate` | `CC.CC_MOVIMTO_MENSUAL` |
| `FicheSignaletiqueRepository` (rapprochement de soldes) | `entityManager` (Production) | `CC.CC_CUENTA_EFECTIVO`, `CL.SP_GET_FICHE_SIGNALETIQUE_CLIENT` |
| `FicheSignaletiqueRepository` (rapprochement de soldes) | `middlewareJdbcTemplate` | `CC.CC_CUENTA_EFECTIVO` |

## Configuration applicative

`application-prod.yml` (ebanking) :

```yaml
spring:
  datasource:                              # BDCRG (Production)
    url: jdbc:sqlserver://10.220.220.8:1433;databaseName=BDCRG;...
    hikari:
      pool-name: ProductionPool
      maximum-pool-size: 15
  middleware:
    datasource:                            # BD_MIDDLEWARE
      url: jdbc:sqlserver://10.220.220.11;databaseName=BD_MIDDLEWARE;...
```

`application.yml` (ecreditservice) :

```yaml
rapprochement:
  caisse:
    cutoff-time: 10:00
    grace-period-minutes: 15
    timezone: Africa/Conakry
```

## Diagnostic

Endpoint utilitaire pour vérifier la connectivité Middleware :

```
GET /ebanking/reconciliation/verify-setup
```

Retourne le nom de la base connectée et la présence de la table `TRANSACTIONSAF`.
