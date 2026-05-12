# CRG × Finergi — Mobile Integration Spec

**Version** : 1.0 — May 2026
**Pour** : Équipe développement mobile (iOS / Android)
**Référence** : Maquettes UI dans `crg-mobile-mockups.html`

---

## 🎯 Objectif

Intégrer le service **Finergi Token Advance** dans l'application mobile CRG pour permettre aux clients EDG d'acheter des tokens d'électricité à crédit, puis de rembourser via Mobile Money.

Deux parcours utilisateur :

1. **Token Advance Flow** — le client achète des tokens à crédit (étapes 1 à 6)
2. **Repayment Flow** — le client rembourse sa dette (étapes 7 à 10)

---

## 🏗 Architecture — qui parle à qui

> **Important pour le dev mobile** : l'app mobile parle **uniquement à Finergi** pour ce parcours. Pas d'appel direct à EDG depuis le mobile dans le flow Token Advance.

```
┌──────────────────┐
│   App mobile CRG │
└────────┬─────────┘
         │ HTTPS / 1 seul interlocuteur API
         ▼
┌──────────────────┐
│     Finergi      │  ◀── orchestre tout
└────┬──────┬──────┘
     │      │
     │      │ B2B en backend (invisible pour l'app)
     ▼      ▼
  ┌─────┐ ┌─────────────┐
  │ EDG │ │ Mobile Money│
  └─────┘ └─────────────┘
```

**Rôles** :

| Acteur | Responsabilité |
|---|---|
| **App mobile** | UI + appels Finergi uniquement |
| **Finergi** | Gestion du prêt (crédit, dette, remboursement) + orchestration EDG/Mobile Money en backend |
| **EDG** | Génère le **token cryptographique** de recharge (renvoyé via Finergi) |

> 🔑 **Le token retourné par `/advances/crg/notification` est un vrai token EDG** — généré par EDG, transité par Finergi. Il est strictement identique au format des tokens du parcours "Recharge directe" existant dans Credit Money. Réutiliser le même composant UI d'affichage.

> ⚠️ **Distinction avec le parcours existant "Recharge directe"** :
> - **Recharge directe** (existant) : app mobile → API EDG → token (le client paye lui-même)
> - **Token Advance** (nouveau, ce doc) : app mobile → Finergi → token (le client emprunte, Finergi gère)
>
> Les deux parcours coexistent dans Credit Money — le client choisit selon qu'il dispose d'argent ou pas.

---

## 🔌 Environnements

| Env | Base URL | Statut |
|---|---|---|
| **DEV** | `https://api-dev.finergi.cloud/integration` | ✅ Validé end-to-end |
| **PROD** | *(à fournir par Finergi avant mise en prod)* | ⏳ Non testé |

**Auth method** : OAuth 2.0 — `client_credentials` flow
**Token format** : JWT Bearer
**Token TTL** : ~22 ans sur DEV (très long, cacher avec marge)

---

## 🔑 Authentification

À l'ouverture de l'app (ou si le token cache est expiré), appeler :

### `POST /api/v1/security/accessToken`

```http
Content-Type: application/json
Authorization: NONE
```

**Body** :
```json
{
  "grantType": "client_credentials",
  "clientId": "crg",
  "clientSecret": "<À FOURNIR PAR ANTHONY — différent DEV/PROD>"
}
```

**Réponse** :
```json
{
  "access_token": "eyJhbGc...",
  "expires_in": 172800000,
  "token_type": "Bearer"
}
```

**Mobile side** :
- Cacher le token de manière sécurisée (Keychain iOS / EncryptedSharedPreferences Android)
- Re-fetcher si HTTP 401 reçu sur n'importe quel autre endpoint
- Ne **jamais** logger le token, même en debug

> Toutes les requêtes suivantes doivent inclure : `Authorization: Bearer <access_token>`

---

## 📱 FLOW 1 — Token Advance

### Écran 1 → Écran 2 : Accueil → Confirmer compteur

Aucune API à appeler. Affichage du dernier compteur connu et du solde local.

### Écran 2 → Écran 3 : Get Loan Offers

#### `POST /api/v3/offers`

**Body** :
```json
{
  "meterNo": "09993421569",
  "msisdn": "224612123123"
}
```

**Réponse — cas nominal** :
```json
{
  "tcl": 10000.0,
  "outstandingAmount": 0.0,
  "meterNo": "09993421569",
  "msisdn": "224612123123",
  "loanOffers": [
    { "offerId": "...", "totalAmount": 2.0,    "upFrontFee": 0.3,   "tokenAmount": 1.7 },
    { "offerId": "...", "totalAmount": 3300.0, "upFrontFee": 495.0, "tokenAmount": 2805.0 },
    { "offerId": "...", "totalAmount": 6700.0, "upFrontFee": 1005.0, "tokenAmount": 5695.0 },
    { "offerId": "...", "totalAmount": 10000.0, "upFrontFee": 1500.0, "tokenAmount": 8500.0 }
  ]
}
```

**Logique d'affichage** :

| Cas | Action mobile |
|---|---|
| `loanOffers.length > 0` | Afficher Écran 3 (liste d'offres) |
| `loanOffers.length === 0` AND `outstandingAmount > 0` | Afficher écran "Dette en cours" (état d'erreur) |
| `loanOffers.length === 0` AND `tcl === 0` | Afficher écran "Compteur non éligible" |
| HTTP 4xx/5xx | Afficher écran "Erreur réseau" avec bouton Retry |

**Tri recommandé** : `loanOffers` triées par `totalAmount` ascendant. Pré-sélectionner la dernière (la plus grosse).

**Champs à stocker pour l'écran suivant** :
- `offerId` de l'offre sélectionnée
- `totalAmount`, `upFrontFee`, `tokenAmount` de cette même offre

### Écran 3 → Écran 4 : Sélection offre → Confirmation

Aucune API. Affichage récap + sélection du wallet mobile money.

### Écran 4 → Écran 5 : Notify Advance

#### `POST /api/v1/advances/crg/notification`

> ⚠️ **Path vendor** : utiliser `/advances/crg/notification` pour CRG. Ne **pas** utiliser `/textgenesys/` (exemple générique de la doc Finergi).

**Body** :
```json
{
  "transactionId": "<UUID v4 GÉNÉRÉ À CHAQUE APPEL>",
  "receiptNumber": "67284910537",
  "transactionDate": "2026-05-04T10:45:00Z",
  "meterNo": "09993421569",
  "municipality": "",
  "msisdn": "224612123123",
  "units": "15.50",
  "token": "1234-5678-9012-3456-7890",
  "totalAmount": 10000.0,
  "vat": 1500.0,
  "tokenAmount": 8500.0,
  "commission": 0,
  "offerId": "<offerId capturé à l'écran 3>",
  "channel": "CRG APP",
  "issuingMno": "CRG",
  "switchId": "CRG",
  "utilityName": "EDG"
}
```

> 🚨 **CRITIQUE — Idempotence sur transactionId**
> Finergi déduplique les requêtes sur `transactionId`. Si tu envoies 2 fois le même ID :
> - 1ère fois → 200 OK, transaction créée
> - 2ème fois → 200 OK mais **rien ne se passe** côté serveur
>
> **TOUJOURS** générer un nouvel UUID v4 juste avant l'appel :
> ```swift
> // iOS
> let transactionId = UUID().uuidString.lowercased()
> ```
> ```kotlin
> // Android
> val transactionId = UUID.randomUUID().toString()
> ```

**Réponse — succès** (HTTP 200) :
```json
{
  "requestId": "f98063cd-0e15-424d-b383-683200f1cc78",
  "meterNo": "09993421569",
  "tokenAmount": 8500.0,
  "advanceAmount": 10000.0,
  "upFrontFee": 1500.0,
  "referenceNo": "<TON_transactionId>",
  "token": "1234-5678-9012-3456-7890",
  "loanId": "02daf4d0-813f-43b1-b52f-6b956af310e2",
  "status": "Completed",
  "statusCode": "200",
  "statusDescription": "Loan Created",
  "receiptNo": "67284910537",
  "agreementRef": "FG-AGR-ADV-ELEC-GN-ARR-CRG-202601-V1",
  "currency": "GNF",
  "advanceDuration": 365.0,
  "timestamp": "2026-05-11T14:58:28Z"
}
```

**À stocker en BDD locale CRG** :
- `loanId` — identifiant unique du prêt (pour suivi / historique)
- `agreementRef` — référence contractuelle
- `token` — le code à saisir dans le compteur EDG
- `tokenAmount`, `advanceAmount`, `upFrontFee`
- `timestamp` — date du prêt

> 🔑 **Origine du token** : le champ `token` dans la réponse est **un vrai token EDG** (généré par EDG en backend lors de l'appel B2B Finergi → EDG). Il est strictement équivalent à un token obtenu via le parcours "Recharge directe" existant. Réutiliser le même composant UI d'affichage et la même logique de validation/copie.

**Réponses d'erreur connues** :

| Code | Message | Cause | Action mobile |
|---|---|---|---|
| `1043` | Vendor doesn't exist or not active | Path URL mal formé | Bug fix côté code |
| `1005` | METER NUMBER NOT AVAILABLE | Compteur non éligible | Afficher écran "Compteur non éligible" |
| `400` | (autre) | Payload invalide | Logger + afficher erreur générique |

### Écran 5 → Écran 6 : Loading → Success

Pas d'API. Animation de chargement (max 30s timeout), puis affichage du token.

---

## 📱 FLOW 2 — Repayment

### Écran 7 : Vue de la dette

#### `GET /api/v1/debt-outstanding/{meterNo}`

Exemple : `GET /api/v1/debt-outstanding/09993421569`

**Réponse** :
```json
{
  "requiredAmount": "10000.0"
}
```

> ⚠️ Note : `requiredAmount` est retourné en **String**, pas en number. Parser en `Double` côté mobile.

**Logique d'affichage** :

| `requiredAmount` | Action mobile |
|---|---|
| `"0.0"` | État "À jour" — masquer le bouton "Rembourser", afficher "Demander une avance" |
| `> 0` | Afficher Écran 7 avec montant à rembourser |

**Quand l'appeler** :
- Au chargement de l'écran "Mon prêt"
- Après chaque paiement réussi (polling pour vérifier le settlement)

### Écran 7 → Écran 8 : Saisie montant

Aucune API. Validation locale : `amount ≤ requiredAmount`.

### Écran 8 → Écran 9 : Make Payment

#### `POST /api/v1/payments`

**Body** :
```json
{
  "meterNumber": "09993421569",
  "amount": 10000,
  "transactionId": "<UUID v4 GÉNÉRÉ À CHAQUE APPEL>",
  "origin": "CRG",
  "msisdn": "224612123123",
  "posId": "",
  "paymentVendor": "MOBILE WALLET",
  "voucherRef": [],
  "receiptNumber": "",
  "mno": "MTN"
}
```

> 🚨 **Même règle d'idempotence que pour Notify Advance** : nouveau UUID v4 à chaque appel.

**Champs dynamiques** :

| Champ | Source |
|---|---|
| `meterNumber` | Du contexte utilisateur |
| `amount` | Saisie utilisateur à l'écran 8 |
| `msisdn` | Du contexte utilisateur |
| `mno` | Selon wallet sélectionné : `"MTN"`, `"ORANGE"`, `"CELLCOM"` (valeurs à confirmer par Finergi) |
| `paymentVendor` | Toujours `"MOBILE WALLET"` pour l'instant |
| `origin` | Toujours `"CRG"` |

**Réponse** :
```json
{
  "transactionId": "9d5fb7ad-3cd6-4786-bd61-7aed90e63377"
}
```

> 📌 Le `transactionId` retourné est généré par Finergi, **différent** de celui envoyé. Le stocker comme référence de paiement.

### Écran 9 → Écran 10 : Polling et succès

Après le 200 OK de `/payments`, **re-appeler** `GET /debt-outstanding/{meterNo}` pour vérifier que `requiredAmount` est passé à `"0.0"`.

⚠️ Pas de webhook côté Finergi pour l'instant. Polling toutes les 2 secondes pendant 10s max, puis afficher succès.

---

## 🚨 Gestion des erreurs

### Codes HTTP

| Code | Cause possible | Action |
|---|---|---|
| 200 | OK | Continuer le flow |
| 400 | Body invalide | Logger + afficher erreur générique |
| 401 | Token expiré | Re-fetch le token, retry **avec nouvel UUID** |
| 5xx | Serveur indisponible | Afficher écran "Erreur réseau" avec retry |
| Timeout réseau | Pas de réponse en 30s | ⚠️ Ne pas auto-retry POST, demander à l'user |

### Codes métier (dans le body)

| Code | Message | Sens |
|---|---|---|
| 1005 | METER NUMBER NOT AVAILABLE | Compteur non provisionné pour CRG (DEV : msisdn = meterNo requis) |
| 1043 | Vendor doesn't exist or not active | Path URL mal formé |
| (autres) | À découvrir au fur et à mesure | Logger systématiquement |

### Règles de retry

> 🚨 **NE JAMAIS auto-retry un POST avec le même transactionId.**
>
> Si tu auto-retries `/advances/crg/notification` ou `/payments` avec le même UUID et que le 1er appel a réussi côté serveur (timeout côté client), tu vas voir un 200 OK mais **rien ne se passera** (idempotence).
>
> Si tu auto-retries avec un nouvel UUID et que le 1er a réussi → **double débit** côté client.
>
> **Stratégie recommandée** :
> 1. Pas de retry automatique sur les POST critiques
> 2. Bouton "Retry" manuel pour l'utilisateur, avec **nouvel UUID**
> 3. Avant retry, appeler `GET /debt-outstanding` pour voir l'état réel côté serveur

---

## 🧪 Test

Pour tester l'intégration sur DEV, utiliser :
- **Meter test** : `09993421569`
- **MSISDN test** : `224612123123` (ou `09993421569` selon endpoint, cf. spec ci-dessus)
- **clientSecret** : voir `finergi-crg-postman-test-guide.md`

Une collection Postman complète est disponible — coordonner avec l'équipe backend CRG.

---

## 📋 Checklist d'intégration

Avant la mise en prod :

- [ ] OAuth flow implémenté avec cache sécurisé du token
- [ ] Auto-refresh du token sur HTTP 401
- [ ] Génération de **nouveau UUID v4** avant chaque POST critique
- [ ] **Aucun retry automatique** sur `POST /advances/*` et `POST /payments`
- [ ] Mapping correct `mno` selon wallet sélectionné (MTN / Orange / Cellcom)
- [ ] Polling `/debt-outstanding` après paiement réussi
- [ ] Gestion des codes métier 1005 et 1043 avec écran dédié
- [ ] Stockage local sécurisé de `loanId` et `agreementRef`
- [ ] Pas de logs contenant le token JWT ou les credentials
- [ ] Test sur réseau dégradé (2G/3G Guinée)
- [ ] Test du flow complet end-to-end sur DEV avant PROD

---

## 📞 Contacts

| Sujet | Contact |
|---|---|
| API Finergi | *(contact Finergi technique — à compléter)* |
| API CRG | *(contact CRG technique — à compléter)* |
| Design UI/UX | Voir `crg-mobile-mockups.html` |

---

## 📚 Annexes

- **Maquettes UI** : `crg-mobile-mockups.html` — ouvrir dans un navigateur
- **Postman collection (test backend)** : `finergi-crg-postman-test-guide.md`
- **Doc officielle Finergi** : *(URL Swagger ou Confluence — à compléter)*
