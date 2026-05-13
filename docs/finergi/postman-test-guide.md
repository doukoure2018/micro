# Finergi ↔ CRG — Postman Test Guide (DEV)

Guide rapide pour tester l'intégration Finergi sur l'environnement **DEV**, validé end-to-end le 11/05/2026.

> **Base URL** : `https://api-dev.finergi.cloud/integration`
> **Auth** : Bearer Token via Keycloak (`client_credentials`)
> **Client ID** : `crg`

---

## 🔧 Setup initial (à faire une fois)

### Variables de collection Postman

Va dans la collection → onglet **Variables** et configure :

| Variable        | Valeur                                                       | Source                  |
|-----------------|--------------------------------------------------------------|-------------------------|
| `baseUrl`       | `https://api-dev.finergi.cloud/integration`                  | fixe                    |
| `clientId`      | `crg`                                                        | fixe                    |
| `clientSecret`  | `<DEMANDER À L'ÉQUIPE BACKEND>`                           | fixe (DEV)              |
| `meterNo`       | `09993421569`                                                | meter de test DEV       |
| `msisdn`        | `09993421569`                                                | = meterNo sur DEV ⚠️    |
| `accessToken`   | *(vide)*                                                     | auto par Test script    |
| `offerId`       | *(vide)*                                                     | auto par Test script    |
| `totalAmount`   | *(vide)*                                                     | auto par Test script    |
| `upFrontFee`    | *(vide)*                                                     | auto par Test script    |
| `tokenAmount`   | *(vide)*                                                     | auto par Test script    |
| `advanceTxId`   | *(vide)*                                                     | auto par Pre-request    |
| `paymentTxId`   | *(vide)*                                                     | auto par Pre-request    |

> ⚠️ **CRITIQUE** : `meterNo` et `msisdn` doivent **toutes les deux** être définies — sinon les payloads envoient littéralement `{{meterNo}}` au serveur et l'API renvoie `METER NUMBER NOT AVAILABLE`.

### Authorization au niveau de la collection

`Authorization` → `Bearer Token` → `{{accessToken}}`

Toutes les requêtes héritent automatiquement (sauf `Get Access Token` qui doit être en `No Auth`).

---

## 📋 Ordre d'exécution validé

```
0. Get Access Token        → récupère le JWT
1. Get Loan Offers         → capture offerId + amounts
2. Notify Advance          → crée le prêt (+ dette)
3. Get Outstanding         → vérifie la dette
4. Make Payment            → solde la dette
5. Get Outstanding (re)    → confirme requiredAmount = 0
```

---

## 0️⃣ Get Access Token

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/api/v1/security/accessToken` |
| **Auth** | `No Auth` *(important — pas de Bearer)* |

**Body** (raw JSON) :
```json
{
  "grantType": "client_credentials",
  "clientId": "{{clientId}}",
  "clientSecret": "{{clientSecret}}"
}
```

**Tests script** :
```javascript
const r = pm.response.json();
const token = r.access_token || r.accessToken || r.token;
if (token) pm.collectionVariables.set("accessToken", token);
pm.test("Status 200", () => pm.response.to.have.status(200));
pm.test("Token captured", () => pm.expect(token).to.not.be.undefined);
```

---

## 1️⃣ Get Loan Offers

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/api/v3/offers` |
| **Auth** | inherit |

**Body** :
```json
{
  "meterNo": "{{meterNo}}",
  "msisdn": "{{msisdn}}"
}
```

**Tests script** :
```javascript
const r = pm.response.json();
pm.test("Status 200", () => pm.response.to.have.status(200));

if (r.loanOffers && r.loanOffers.length > 0) {
    // Dernière offre = la plus grosse (10000)
    const offer = r.loanOffers[r.loanOffers.length - 1];
    pm.collectionVariables.set("offerId", offer.offerId);
    pm.collectionVariables.set("totalAmount", offer.totalAmount);
    pm.collectionVariables.set("upFrontFee", offer.upFrontFee);
    pm.collectionVariables.set("tokenAmount", offer.tokenAmount);
    console.log("✅ Offer:", offer);
} else {
    console.log("⚠️ Pas d'offre. outstandingAmount =", r.outstandingAmount);
    console.log("→ Solder la dette via /v1/payments avant de relancer");
}
```

**Réponse attendue** (compteur sans dette) :
```json
{
  "tcl": 10000.0,
  "outstandingAmount": 0.0,
  "meterNo": "09993421569",
  "msisdn": "224612123123",
  "loanOffers": [
    { "offerId": "...", "totalAmount": 2.0,     "upFrontFee": 0.3,    "tokenAmount": 1.7 },
    { "offerId": "...", "totalAmount": 3300.0,  "upFrontFee": 495.0,  "tokenAmount": 2805.0 },
    { "offerId": "...", "totalAmount": 6700.0,  "upFrontFee": 1005.0, "tokenAmount": 5695.0 },
    { "offerId": "...", "totalAmount": 10000.0, "upFrontFee": 1500.0, "tokenAmount": 8500.0 }
  ]
}
```

> 📌 La formule est `tokenAmount = totalAmount − upFrontFee` (frais de 15% pour le maximum).

> ⚠️ Si `loanOffers: []` et `outstandingAmount > 0` → solder la dette d'abord via l'étape 4.

---

## 2️⃣ Notify Advance

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/api/v1/advances/crg/notification` |
| **Auth** | inherit |

> ⚠️ Le path contient le **vendor** : pour CRG → `/advances/crg/`. Ne **pas** utiliser `/advances/textgenesys/` (vendor par défaut de la doc Finergi).

**Pre-request Script** :
```javascript
pm.collectionVariables.set("advanceTxId", crypto.randomUUID());
```

**Body** :
```json
{
  "transactionId": "{{advanceTxId}}",
  "receiptNumber": "67284910537",
  "transactionDate": "2026-05-04T10:45:00Z",
  "meterNo": "{{meterNo}}",
  "municipality": "",
  "msisdn": "{{msisdn}}",
  "units": "15.50",
  "token": "1234-5678-9012-3456-7890",
  "totalAmount": {{totalAmount}},
  "vat": {{upFrontFee}},
  "tokenAmount": {{tokenAmount}},
  "commission": 0,
  "offerId": "{{offerId}}",
  "channel": "CRG APP",
  "issuingMno": "CRG",
  "switchId": "CRG",
  "utilityName": "EDG"
}
```

> 📌 Sur DEV, `msisdn` = `meterNo` pour ce compteur de test (mapping particulier côté Finergi). En PROD, utiliser le vrai msisdn du client.

**Réponse attendue** (200 OK) :
```json
{
  "requestId": "f98063cd-...",
  "meterNo": "09993421569",
  "tokenAmount": 8500.0,
  "advanceAmount": 10000.0,
  "upFrontFee": 1500.0,
  "referenceNo": "813c879d-...",
  "token": "1234-5678-9012-3456-7890",
  "loanId": "02daf4d0-...",
  "status": "Completed",
  "statusCode": "200",
  "statusDescription": "Loan Created",
  "agreementRef": "FG-AGR-ADV-ELEC-GN-ARR-CRG-202601-V1",
  "currency": "GNF",
  "advanceDuration": 365.0
}
```

> ⭐ **À stocker en BDD CRG** : `loanId`, `agreementRef`, `referenceNo` pour le suivi des prêts.

---

## 3️⃣ Get Outstanding

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/api/v1/debt-outstanding/{{meterNo}}` |
| **Auth** | inherit |
| **Body** | aucun |

**Réponse attendue** :
```json
{
  "requiredAmount": "10000.0"
}
```

---

## 4️⃣ Make Payment

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/api/v1/payments` |
| **Auth** | inherit |

**Pre-request Script** :
```javascript
pm.collectionVariables.set("paymentTxId", crypto.randomUUID());
```

**Body** :
```json
{
  "meterNumber": "{{meterNo}}",
  "amount": {{totalAmount}},
  "transactionId": "{{paymentTxId}}",
  "origin": "CRG",
  "msisdn": "{{msisdn}}",
  "posId": "",
  "paymentVendor": "MOBILE WALLET",
  "voucherRef": [],
  "receiptNumber": "",
  "mno": "MTN"
}
```

> 📌 `amount` doit correspondre exactement au `requiredAmount` retourné par l'étape 3.

**Réponse attendue** :
```json
{
  "transactionId": "9d5fb7ad-..."
}
```

---

## 5️⃣ Get Outstanding (final)

Relance l'étape 3. Attendu :
```json
{
  "requiredAmount": "0.0"
}
```

✅ Cycle complet validé.

---

## 🚨 Troubleshooting (issues rencontrées et résolues)

| Erreur                                      | Cause                                                  | Solution                                                                |
|---------------------------------------------|--------------------------------------------------------|-------------------------------------------------------------------------|
| `METER NUMBER NOT AVAILABLE` (1005)         | Variable `{{meterNo}}` ou `{{msisdn}}` non définie     | Vérifier dans la page Variables que les deux ont une valeur             |
| `Vendor doesn't exist or not active` (1043) | Path URL avec mauvais vendor                           | URL doit être `/advances/crg/notification` (pas `/textgenesys/`)        |
| `loanOffers: []`                            | Dette en cours sur le meter                            | Solder la dette via Payment avant de relancer Offers                    |
| 200 OK mais `outstandingAmount` figé        | `transactionId` réutilisé → idempotence Finergi        | Vérifier que le pre-request script génère un nouveau UUID v4            |
| `401 Unauthorized`                          | Token expiré ou non envoyé                             | Relancer `Get Access Token`                                             |

### 🐛 Le piège majeur : l'idempotence sur `transactionId`

Finergi déduplique sur `transactionId`. Si tu réutilises le même ID :
- Première fois : la transaction est créée → 200 OK
- Fois suivantes : Finergi voit que cet ID existe déjà → 200 OK mais **aucun effet**

**Solution** : pre-request script dans Notify Advance ET Make Payment :
```javascript
pm.collectionVariables.set("advanceTxId", crypto.randomUUID());
// ou
pm.collectionVariables.set("paymentTxId", crypto.randomUUID());
```

---

## 🔄 Workflow rapide (run all)

Clic droit sur la collection → **Run collection** → ordre par défaut → **Run**.

Vérifications attendues :
- ✅ Étape 0 : token capturé
- ✅ Étape 1 : 4 offres listées, offerId capturé
- ✅ Étape 2 : `status: "Completed"`, `loanId` retourné
- ✅ Étape 3 : `requiredAmount: "10000.0"`
- ✅ Étape 4 : `transactionId` retourné
- ✅ Étape 5 : `requiredAmount: "0.0"`

---

## 📚 Notes additionnelles

### Champs de réponse à stocker côté CRG

Pour l'intégration applicative, ces champs de la réponse `Notify Advance` sont importants :

- **`loanId`** : identifiant unique du prêt côté Finergi → à stocker
- **`agreementRef`** : référence du contrat (format `FG-AGR-ADV-ELEC-GN-ARR-CRG-YYYYMM-V1`)
- **`advanceDuration`** : durée du prêt en jours (365 = 1 an)
- **`currency`** : `GNF` pour la Guinée
- **`productName`** : peut afficher `"Namibia Electricity Schema - test"` sur DEV — c'est normal

### Sécurité

- Le `clientSecret` partagé ici est celui de l'environnement DEV uniquement.
- Pour PROD, créer un secret différent et le stocker dans un gestionnaire de secrets (jamais en clair dans le code ou dans Postman public).
- Le JWT a une durée de vie limitée — relancer `Get Access Token` si erreur 401.
