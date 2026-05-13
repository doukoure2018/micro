# Credit Money — Token Advance — Spec d'intégration mobile

**Version** : 2.0 — May 2026
**Pour** : Équipe développement mobile (iOS / Android)
**Référence visuelle** : Maquettes UI dans `index.html`

---

## 🎯 Objectif

Intégrer le nouveau parcours **Token Advance** (achat d'énergie EDG à crédit) dans l'application **Credit Money** existante.

Deux parcours utilisateur :

1. **Token Advance Flow** — le client achète des tokens à crédit (écrans 1 à 6)
2. **Repayment Flow** — le client rembourse sa dette (écrans 7 à 10)

---

## 🏗 Architecture mobile

```
┌──────────────────┐
│  App Credit Money│
└────────┬─────────┘
         │ HTTPS — API Key statique
         ▼
┌──────────────────┐
│   Backend CRG    │  ◀── Seul interlocuteur de l'app
└──────────────────┘
         │
         │ Logique externe (partenaire, EDG)
         │ — invisible pour l'app mobile
         ▼
       (Hors périmètre mobile)
```

**Périmètre du développement mobile** : uniquement la communication **App ↔ Backend CRG**. Tout ce qui se passe derrière est géré par l'équipe backend.

> ⚠️ **À retenir** : pour ce parcours, l'app n'appelle **aucun système externe** — pas d'EDG, pas de MTN/Orange/Cellcom, pas de partenaire bancaire. Uniquement l'API CRG.

> 🔑 **Origine du token** : le token retourné par l'API CRG est un **vrai token EDG**, strictement équivalent à celui du parcours **"Recharge directe"** existant dans Credit Money. **Réutiliser le même composant UI d'affichage**.

---

## 🔌 Authentification mobile ↔ Backend CRG

| Paramètre | Valeur |
|---|---|
| **Auth method** | API Key statique |
| **Session utilisateur** | Login Credit Money existant |
| **Header HTTP** | À confirmer avec l'équipe backend (probablement `X-API-Key` ou `Authorization: ApiKey ...`) |

⚠️ L'API Key doit être :
- Stockée de manière sécurisée (Keychain iOS / EncryptedSharedPreferences Android)
- **Jamais loggée**, même en debug
- **Jamais embarquée en clair dans le code** — utiliser une variable de build / un secret store

L'identification de l'utilisateur courant se fait via la session Credit Money existante (le backend CRG sait quel utilisateur fait l'appel grâce à un identifiant transmis dans la requête — à confirmer avec l'équipe backend).

---

## 📋 Vue d'ensemble des appels API

L'app mobile fait au total **4 types d'appels** à l'API backend CRG :

| # | Action utilisateur | Endpoint logique | Méthode |
|---|---|---|---|
| 1 | Consulter les offres disponibles | Récupérer les offres | À fournir |
| 2 | Confirmer l'avance | Créer le prêt | À fournir |
| 3 | Voir la dette actuelle | Consulter la dette | À fournir |
| 4 | Rembourser | Effectuer un paiement | À fournir |

Les URL exactes et formats de payload seront fournis par l'équipe backend CRG. La structure ci-dessous est indicative.

---

## 📱 FLOW 1 — Token Advance

### Écran 1 → Écran 2 : Accueil → Choix du parcours

Aucun appel API. L'app affiche l'écran d'accueil avec le solde Credit Money (déjà disponible via la session existante) et les boutons d'action.

### Écran 2 → Écran 3 : Récupérer les offres

**Action utilisateur** : clic sur "Voir les offres"

**Appel API** : récupération des offres d'avance disponibles pour le compteur du client.

**Payload de requête** (transmis au backend CRG) :
- `meterNo` — numéro du compteur EDG (ex: `09993421569`)
- `msisdn` — numéro de téléphone du client (ex: `224612123123`)

**Réponse attendue** : 
- Liste d'offres, chacune avec : identifiant unique, montant total à rembourser, frais, montant du token à recevoir
- Total Credit Limit (crédit maximum accordé au client)
- Outstanding Amount (dette en cours, le cas échéant)

**Logique d'affichage** :

| Cas | Action mobile |
|---|---|
| Liste d'offres non vide | Afficher écran 3 (liste des offres triée par montant) |
| Liste vide + dette > 0 | Afficher écran "Dette en cours" (Repayment requis) |
| Liste vide + crédit = 0 | Afficher écran "Compteur non éligible" |
| Erreur réseau | Afficher écran "Connexion impossible" avec retry |

**Stockage local** : conserver l'identifiant de l'offre sélectionnée pour l'étape suivante.

### Écran 3 → Écran 4 : Sélection offre → Récapitulatif

Aucun appel API. Affichage récap basé sur l'offre choisie.

### Écran 4 → Écran 5 : Création de l'avance

**Action utilisateur** : clic sur "Confirmer l'avance"

**Appel API** : création de l'avance et débit du wallet Credit Money.

**Payload de requête** :
- Identifiant de l'offre sélectionnée
- (Le backend récupère automatiquement le wallet à débiter via la session Credit Money)

**Réponse attendue** (en cas de succès) :
- `token` — code à 16 chiffres à afficher (vrai token EDG)
- `tokenAmount` — montant du token reçu
- `loanId` — identifiant unique du prêt (à stocker localement pour suivi)
- `referenceNo` — référence de la transaction

**Affichage de la réponse** : navigation vers l'écran de succès (Écran 6).

### Écran 5 : Écran de chargement

Pas d'appel API supplémentaire. Affichage d'un spinner pendant que le backend traite la requête.

⚠️ **Recommandations** :
- Timeout côté mobile : **30 secondes**
- Désactiver le bouton "back" pendant l'attente
- Afficher un message rassurant ("Ne ferme pas l'app, ça prend ~5 secondes")

### Écran 6 : Token reçu

Affichage du token reçu en réponse de l'étape précédente.

**Recommandations UI** :
- Afficher le token en **gros caractères** lisibles
- Bouton **"Copier le token"** d'un seul tap
- Bouton secondaire **"Voir mes prêts"** pour accéder à l'historique
- **Réutiliser le composant d'affichage de token du parcours "Recharge directe"** existant

**Stockage local** : sauvegarder `loanId`, `tokenAmount`, `referenceNo`, `timestamp` dans la BDD locale pour l'historique des prêts.

---

## 📱 FLOW 2 — Repayment

### Écran 7 : Consulter la dette

**Action utilisateur** : à l'ouverture de l'écran "Mon prêt" / "Rembourser"

**Appel API** : consultation du montant restant à rembourser pour le compteur du client.

**Payload de requête** :
- `meterNo` — numéro du compteur

**Réponse attendue** :
- `requiredAmount` — montant restant à rembourser (en GNF)
- Informations sur le prêt en cours (date, montant initial, token reçu, frais)

**Logique d'affichage** :

| `requiredAmount` | Action mobile |
|---|---|
| `0` ou `null` | Afficher état "À jour" + masquer le bouton "Rembourser", afficher "Demander une avance" |
| `> 0` | Afficher l'écran 7 avec montant à rembourser et bouton "Rembourser maintenant" |

**Quand l'appeler** :
- À l'ouverture de l'écran "Mon prêt"
- Après chaque paiement réussi (pour confirmer le settlement)

### Écran 8 : Saisie du montant

Aucun appel API. Validation locale :
- `amount` doit être ≤ `requiredAmount`
- `amount` doit être ≤ solde du wallet Credit Money
- Si paiement partiel autorisé : prévoir un minimum (à confirmer avec backend)

### Écran 9 : Effectuer le paiement

**Action utilisateur** : clic sur "Confirmer le paiement"

**Appel API** : remboursement via débit du wallet Credit Money.

**Payload de requête** :
- `meterNo` — numéro du compteur
- `amount` — montant à rembourser
- (Le backend récupère automatiquement le wallet à débiter)

**Réponse attendue** :
- Confirmation du paiement (transactionId ou référence)
- Nouvelle dette restante (peut être inclus directement ou nécessiter un nouvel appel)

### Écran 10 : Confirmation du paiement

Après la réponse OK de l'étape précédente, l'app peut **re-consulter la dette** pour confirmer que `requiredAmount` est passé à zéro (équivalent à un polling court). Si oui :
- Débloquer le bouton "Demander une avance" sur l'accueil
- Afficher l'écran de succès avec récap

---

## 🚨 Gestion des erreurs

### Erreurs réseau / serveur

| Type d'erreur | Action recommandée |
|---|---|
| Pas de connexion internet | Écran "Connexion impossible" + bouton Réessayer manuel |
| Timeout (>30s) | Idem, **ne pas auto-retry** |
| HTTP 4xx (erreur client) | Logger + écran erreur générique |
| HTTP 5xx (erreur serveur) | Logger + écran erreur générique + bouton Réessayer |
| HTTP 401 / Auth refusée | Re-fetch de la session Credit Money ou redirection vers login |

### Erreurs métier

| Cas | Détection | UI à afficher |
|---|---|---|
| Compteur non éligible | Code/message dans la réponse API CRG | Écran "Compteur non éligible" + bouton Support |
| Solde Credit Money insuffisant | Validation locale ou réponse API | Pop-up "Solde insuffisant" + bouton Recharger Credit Money |
| Dette bloque une nouvelle avance | Liste d'offres vide + outstanding > 0 | Écran "Dette en cours" + bouton "Rembourser" |
| Offre expirée | Code/message dans la réponse | Pop-up + rafraîchir la liste d'offres |

### ⚠️ Règle critique — Pas de retry automatique

> 🚨 **NE JAMAIS auto-retry** un appel de création d'avance ou de paiement.
>
> Si l'app perd la connexion juste après l'envoi de la requête (et que le serveur l'a déjà traitée), un retry automatique pourrait créer un **double prêt** ou un **double débit**.
>
> **Stratégie recommandée** :
> 1. En cas d'erreur réseau, afficher un écran clair à l'utilisateur
> 2. Avant qu'il clique "Réessayer", appeler l'API de consultation (offres ou dette) pour voir l'état réel
> 3. Adapter l'UI en fonction de l'état observé

---

## 🧪 Stockage local recommandé

| Donnée | Où | Pourquoi |
|---|---|---|
| API Key | Keychain / EncryptedSharedPreferences | Sécurité |
| Session Credit Money | Existant (réutiliser) | Auth utilisateur |
| Liste des prêts (loanId, montant, date, token) | BDD locale (SQLite/Room/CoreData) | Historique offline |
| Dernier compteur utilisé | Préférences | Pré-remplissage UX |
| Dernier MSISDN utilisé | Préférences | Pré-remplissage UX |

---

## 📋 Checklist d'intégration mobile

Avant la mise en prod :

- [ ] API Key stockée de manière sécurisée
- [ ] Aucune valeur sensible loguée (token, API Key, identifiants)
- [ ] Gestion correcte des 4 appels API (offres, avance, dette, paiement)
- [ ] **Aucun retry automatique** sur les POST de création d'avance et de paiement
- [ ] Réutilisation du composant UI d'affichage de token (parcours "Recharge directe" existant)
- [ ] Gestion des états : "dette en cours", "compteur non éligible", "erreur réseau"
- [ ] Polling de la dette après paiement réussi pour confirmer le settlement
- [ ] Test sur réseau dégradé (2G / 3G typique Guinée)
- [ ] Bouton "Copier le token" testé et fonctionnel
- [ ] Test du flow complet sur l'environnement de pré-production

---

## 📞 Coordination équipe

| Question | Contact |
|---|---|
| URLs et formats exacts des endpoints CRG | Équipe backend CRG (Doukouré Salifou) |
| API Key + environnements (DEV / PROD) | Équipe backend CRG |
| Format du composant token UI existant | Équipe mobile Credit Money |
| Maquettes UI | Voir `index.html` (en ligne sur GitHub Pages) |

---

## 📎 Annexe — Pour l'équipe backend CRG

> Cette section est destinée à l'équipe backend CRG qui implémente l'API. Elle décrit comment le backend orchestre EDG + Finergi en coulisses.
>
> Pour le détail Postman et les tests, voir `postman-test-guide.md`.

### 🔄 Ordre exact des appels backend (Token Advance)

Quand l'app mobile demande une avance, le backend CRG doit faire **3 appels séquentiels** :

```
1. CRG  →  Finergi /api/v3/offers
              ├─ Récupère la liste des offres d'avance disponibles
              └─ Retourne notamment : offerId, tokenAmount, upFrontFee, totalAmount

[ L'utilisateur choisit une offre côté mobile ]

2. CRG  →  EDG API (intégration existante "Recharge directe")
              ├─ Génère le token EDG en utilisant tokenAmount de l'offre choisie
              └─ Retourne le token cryptographique à 16 chiffres

3. CRG  →  Finergi /api/v1/advances/crg/notification
              ├─ Notifie Finergi avec le token généré + offerId + autres champs
              ├─ Finergi crée le prêt côté serveur
              └─ Retourne loanId, agreementRef, etc. pour traçabilité
```

> 📌 **Point critique** : Finergi **ne génère pas le token**. C'est CRG qui génère le token via son intégration EDG existante, puis envoie ce token à Finergi via `/advances/crg/notification`. Finergi ne fait que créer et gérer le prêt.

### 🔄 Ordre des appels (Repayment)

Pour le remboursement, deux appels distincts :

```
1. CRG  →  Finergi /api/v1/debt-outstanding/{meterNo}
              └─ Consulte la dette en cours

2. CRG  →  débit du wallet Credit Money (interne CRG)
              └─ Encaisse le montant chez le client

3. CRG  →  Finergi /api/v1/payments
              └─ Notifie Finergi du remboursement pour mettre à jour la dette
```

### ⚠️ Points d'attention côté backend Finergi

1. **Idempotence Finergi** : générer un nouveau UUID v4 pour `transactionId` à **chaque appel** Finergi. Réutiliser le même UUID = 200 OK silencieux mais aucune action côté Finergi.

2. **Path vendor** : utiliser `/api/v1/advances/crg/notification` (vendor `crg` dans le path) — **pas** `/textgenesys/` comme dans la doc Finergi par défaut.

3. **Format des champs** : sur DEV, le champ `msisdn` doit valoir `meterNo` (mapping particulier). À confirmer en PROD.

4. **Champs critiques à envoyer à Finergi dans `/advances/crg/notification`** :
   - `offerId` (issu de l'étape 1, le client a choisi cette offre)
   - `token` (issu de l'étape 2, généré par CRG via EDG)
   - `tokenAmount`, `vat`, `totalAmount` (issus de l'offre, doivent matcher)
   - `transactionId` (UUID v4 unique)

5. **Réponse Finergi à conserver côté CRG** : `loanId`, `agreementRef`, `referenceNo`. Le `loanId` est l'identifiant à exposer côté API CRG pour le suivi des prêts.

6. **Codes d'erreur Finergi connus** :
   - `1005` METER NUMBER NOT AVAILABLE → mapper en erreur "Compteur non éligible" côté API CRG
   - `1043` Vendor doesn't exist or not active → bug interne, ne devrait pas arriver

