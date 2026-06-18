# Authentification fédérée AgriScore × Crédit Rural de Guinée

**Annexe technique d'intégration — Authentification**

> **SPÉCIFICATION TECHNIQUE · AUTHENTIFICATION FÉDÉRÉE**

| | |
|---|---|
| **Document** | Spécification technique SSO — Authentification fédérée (OIDC fédéré — cible scale ; comptes-gérés — pilote) |
| **Version** | 1.0 |
| **Date** | 15 juin 2026 |
| **Émetteur** | KUMY HOLDING SAS — Direction Technique |
| **Destinataire** | Crédit Rural de Guinée — Direction Technique |
| **Statut** | À valider conjointement |

*Document de travail confidentiel — à valider conjointement KUMY × Crédit Rural de Guinée.*

---

## Sommaire

1. [Objectif et principes](#1-objectif-et-principes)
2. [Architecture cible](#2-architecture-cible)
3. [Diagramme de séquence — Flow d'authentification](#3-diagramme-de-séquence--flow-dauthentification)
4. [Chantiers côté Crédit Rural](#4-chantiers-côté-crédit-rural)
5. [Chantiers côté KUMY](#5-chantiers-côté-kumy)
6. [Spécifications techniques détaillées](#6-spécifications-techniques-détaillées)
7. [Matériel à échanger](#7-matériel-à-échanger)
8. [Annexes](#8-annexes)

---

## 1. Objectif et principes

### 1.1 Objectif

Mettre en place un mécanisme d'authentification fédérée permettant aux agents CRG :

- d'utiliser leurs identifiants habituels (matricule + mot de passe) pour accéder à AgriScore
- de bénéficier d'un provisioning automatique (création, modification, désactivation) synchronisé avec le SI de CRG
- de garantir que les mots de passe ne sont jamais stockés par KUMY

**Précision importante (v1.1) :** la garantie « le mot de passe ne quitte jamais le SI de CRG » est tenue par la **Variante A** (OIDC fédéré véritable) et par la **Variante C** (pont JWT), où l'agent s'authentifie sur une page / une app hébergée par CRG. Dans la **Variante B** (proxy de vérification), le mot de passe transite par le connecteur KUMY (en TLS, sans stockage) avant d'être vérifié par CRG.

### 1.2 Principes directeurs

| Principe | Implication |
|---|---|
| **Souveraineté** | Les credentials des agents restent stockés et vérifiés exclusivement par CRG ; KUMY ne les conserve jamais. En Variante A, KUMY ne les voit même pas transiter (cf. §2.0) |
| **Conformité** | Architecture conforme RGPD européen et loi guinéenne L/2016/037/AN |
| **Réversibilité** | Possibilité pour CRG de récupérer toutes ses données et de quitter la plateforme |
| **Auditabilité** | Toute action d'authentification est tracée et conservée 7 ans |
| **Découplage** | KUMY ne connaît pas le système interne CRG ; CRG ne connaît pas le détail de l'infrastructure KUMY |

---

## 2. Architecture cible

### 2.0 Trois variantes assumées

Le choix de l'architecture d'authentification dépend de la capacité réelle de CRG à exposer un service d'identité (point à confirmer — cf. Q1, §8.3). Trois variantes sont donc présentées explicitement, chacune avec ses garanties réelles. Le pilote n'attend pas la résolution de ce choix : il démarre en Variante C (pont JWT) ou B (ou en comptes-gérés), la Variante A étant la cible de montée en charge.

**Contexte CRG (juin 2026) :** CRG dispose d'une solution d'authentification custom (login maison + base d'utilisateurs). La **Variante C — pont JWT** est donc la voie privilégiée pour le pilote, sous réserve de validation des conditions techniques (signature RS256 + JWKS, claims, hand-off — cf. §4.1 et le document détaillé `2026-06-04-custom-authentication-pont-jwt.md`).

| | **Variante A — OIDC fédéré véritable** | **Variante B — Proxy de vérification** | **Variante C — Pont JWT (Firebase Custom Auth)** |
|---|---|---|---|
| **Qui héberge la page de login ?** | CRG (`auth.creditrural.gn`, l'agent y tape son mot de passe) | KUMY (connecteur `idp.kumy.app`, l'agent y tape son mot de passe) | CRG (login custom existant ; l'agent s'authentifie chez CRG) |
| **Le mot de passe transite-t-il par KUMY ?** | Non, jamais — KUMY ne reçoit qu'un authorization code + des claims | Oui — en TLS, sans stockage, relayé immédiatement à l'API CRG | Non, jamais — KUMY ne reçoit qu'un JWT signé déjà émis par CRG |
| **CRG doit fournir** | Un OpenID Provider (OP) conforme OIDC | Un endpoint `POST /auth/verify` (matricule + mot de passe) | Un JWT signé (RS256) + un endpoint JWKS + un hand-off (redirection avec token) |
| **Garantie « le mot de passe ne quitte jamais le SI CRG »** | ✅ Tenue | ❌ Non tenue (garantie repliée sur « jamais stocké par KUMY ») | ✅ Tenue |
| **Surface de risque côté KUMY** | Minimale (jamais de credential en clair) | Le connecteur devient une cible de credential-stuffing → mitigations obligatoires (mTLS, rate-limit strict, lockout, IP whitelist) | Faible — KUMY vérifie cryptographiquement le JWT (signature, `iss`, `aud`, `exp`) avant de forger une session. RS256+JWKS = aucun secret côté KUMY ; HS256 = secret partagé à protéger |
| **Effort CRG** | Élevé (mise en place d'un OP) | Modéré (une API de vérification) | Faible à modéré si un login JWT existe déjà (exposer JWKS + hand-off) |

> **Note :** si CRG ne peut exposer ni un OP, ni un JWT vérifiable, ni une API de vérification dans les délais du pilote, on bascule sur l'option **comptes-gérés / import CSV** décrite en §4.1 (KUMY gère les comptes, synchronisation périodique). C'est le chemin le plus simple pour démarrer les 50 agents.

**Trajectoire :** démarrer en Variante C (le JWT de CRG existe déjà → MVP rapide, souveraineté tenue) ; si CRG monte plus tard un OP OIDC complet, on bascule en Variante A sans casser le mapping rôles/tenant.

Le reste du document décrit l'architecture **Variante A** en cible, en signalant les points où les Variantes B et C diffèrent.

### 2.1 Vue d'ensemble

L'architecture retenue est dite **OIDC fédéré** (OpenID Connect). Elle s'appuie sur :

- **Google Cloud Identity Platform (GCIP)** côté KUMY, configuré en mode multi-tenant (un tenant dédié `credit-rural-gn`)
- Un **Connecteur OIDC** développé par KUMY (service Cloud Run sur `idp.kumy.app/creditrural`) qui sert d'intermédiaire entre GCIP et le système d'authentification de CRG
- Une **API d'authentification** exposée par CRG pour vérifier les credentials des agents

### 2.2 Composants

| Composant | Rôle | Hébergé par |
|---|---|---|
| AgriScore (PWA) | Application frontale utilisée par les agents | KUMY (GCP europe-west1) |
| GCIP | Broker d'identité, émetteur des sessions | KUMY (config) / Google Firebase |
| Connecteur OIDC KUMY | Service de fédération OIDC ↔ API CRG | KUMY (Cloud Run europe-west1) |
| API d'authentification CRG | Vérification des credentials agents | Crédit Rural |
| Firestore KUMY | Stockage des données métier (scoring, parcelles) | KUMY (GCP europe-west1) |

### 2.3 Données stockées

| Donnée | Stockée par GCIP | Stockée par CRG | Commentaire |
|---|---|---|---|
| Mot de passe agent | ❌ | ✅ | Jamais stocké par KUMY. Variante A : ne quitte pas le SI CRG. Variante B : transite par le connecteur KUMY (TLS, sans stockage) |
| Identifiant (matricule) | ✅ | ✅ | Identique des deux côtés |
| Nom, email, téléphone | ✅ | ✅ | Transmis via OIDC au login |
| Agence, rôle, habilitations | ✅ (claims) | ✅ | Rafraîchis à chaque login |
| Données métier (farmers, scoring) | ❌ | ✅ | Stockées dans Firestore KUMY |
| Données bancaires/client | ❌ | ✅ | Restent dans le core banking CRG |

### 2.4 Localisation des données

L'ensemble des données KUMY relatives à CRG sera stocké dans la région **europe-west1 (Belgique)** :

- Conformité RGPD européen
- Latence acceptable depuis la Guinée (~80 ms)
- Indépendance vis-à-vis des juridictions américaines

---

## 3. Diagramme de séquence — Flow d'authentification

**Scénario :** un agent CRG (Mamadou Diallo, matricule CR-042) se connecte à AgriScore depuis l'agence de Labé.

*Flow d'authentification fédérée AgriScore × Crédit Rural (séquence OIDC, Variante A).*

Le diagramme de séquence original couvre les échanges suivants :

- **Phase 1 — Initiation du login fédéré (OIDC Authorization Code Flow — Variante A)** : ouverture de `creditrural.agriscore.kumy.app`, `tenantId = credit-rural-gn`, clic « Se connecter avec mon compte Crédit Rural », `signInWithRedirect` (OIDCProvider: `oidc.creditrural`), redirection `/authorize` (relais OIDC) vers l'OP CRG (`auth.creditrural.gn/authorize`), affichage de la page de login CRG (domaine + branding Crédit Rural).
- **Phase 2 — Authentification CHEZ CRG (le mot de passe ne quitte pas le SI CRG)** : saisie matricule + mot de passe (KUMY ne le voit jamais), vérification des credentials dans l'AD/LDAP interne, redirect avec authorization code (aucun mot de passe transmis), `POST /token` (échange du code), `200 OK` (`agent_id`, `nom`, `agence`, `role`, `actif:true`), construction d'un code d'autorisation temporaire, redirect vers GCIP avec `/code=xxx&state=…`.
  - *Variante B (proxy, pilote)* : l'agent saisit ses credentials sur la page KUMY, qui appelle `POST /auth/verify` côté CRG (cf. §2.0). Mot de passe en transit, jamais stocké.
- **Phase 3 — Échange du code et création de la session Firebase** : callback avec code, `POST /token` (`code`, `client_secret`), ID Token OIDC signé (JWT : `sub`, `agent_id`, `email`, `nom`, `agence`, `Label`, `role:agent`), validation de signature JWT, création/récupération du user dans le tenant `credit-rural-gn`, mapping des claims OIDC → custom claims Firebase, ID Token Firebase (`tenant`, `uid`, `agence`, `role`), écriture `tenants/credit-rural-gn/agents/{uid}` (upsert metadata), session active (dashboard Crédit Rural).
- **Phase 4 — Révocation (le statut CRG est re-vérifié à la RE-AUTHENTIFICATION, pas au simple refresh)** : si CRG désactive l'agent (événement RH), KUMY appelle `revokeRefreshTokens(uid)` via GCIP (cf. doc synchronisation RH). À l'expiration de l'ID token courant (~1 h), tentative de refresh, `refreshToken()`, échec si refresh token révoqué, session terminée → redirect vers login. Au nouveau login, le flow OIDC complet est rejoué : CRG renvoie `actif:false` → accès refusé.

> **Note diagramme :** Firebase NE recontacte PAS l'OP CRG au refresh. L'ID token courant reste valide jusqu'à ~1 h, sauf si le backend KUMY active la vérification de révocation par requête (`verifyIdToken(token, true)`).

### Commentaire des 4 phases

| Phase | Acteur principal | Durée typique | Ce qui est échangé |
|---|---|---|---|
| **Phase 1** | Agent → AgriScore → OP CRG | < 1 seconde | Redirection vers la page de login CRG (Variante A) |
| **Phase 2** | Agent ↔ Core Banking CRG | 1–3 secondes | Saisie + vérification des credentials **chez CRG** |
| **Phase 3** | GCIP → AgriScore | < 1 seconde | Création de la session Firebase avec claims métier |
| **Phase 4** | À la ré-authentification (pas au refresh) | < 1 seconde | Re-vérification du statut agent contre CRG. Au simple refresh, Firebase ne recontacte pas l'OP CRG (cf. note diagramme) |

> La révocation déclenchée par un événement RH (désactivation, mutation) et sa propagation sont détaillées dans `sso-synchronisation-rh-agriscore-crg.md`.

---

## 4. Chantiers côté Crédit Rural

Pour que l'authentification fonctionne, CRG doit livrer les chantiers ci-dessous, listés par ordre de criticité. (Le chantier « Webhooks RH » relève de la synchronisation et est décrit dans le document compagnon.)

### Vue d'ensemble

| Chantier | Effort estimé | Criticité |
|---|---|---|
| 1. Exposer une API d'authentification (service d'identité) | 5–15 jours | 🔴 Bloquant |
| 2. Exposer une API de statut agent | 2–5 jours | 🟠 Important |

### 4.1 Chantier 1 — Service d'identité CRG

**Objectif :** permettre au connecteur KUMY de déléguer l'authentification d'un agent CRG. La forme du livrable dépend de la variante retenue (§2.0) :

- **Variante A (cible scale)** — CRG expose un OpenID Provider (OP) conforme OIDC (`auth.creditrural.gn` avec `/authorize`, `/token`, JWKS). L'agent s'authentifie sur le domaine CRG ; KUMY ne voit jamais le mot de passe.
- **Variante C (pilote — recommandée vu l'auth custom de CRG)** — CRG conserve son login maison ; il signe un JWT (RS256), expose une clé publique / endpoint JWKS, et redirige l'agent vers AgriScore avec le jeton (hand-off). KUMY vérifie la signature (`iss`, `aud`, `exp`) puis forge un Firebase Custom Token. Le mot de passe ne transite jamais par KUMY. Provisioning JIT à la 1ʳᵉ connexion ; deprovisioning à définir explicitement (CRG cesse d'émettre des jetons + révocation de session côté AgriScore). Détail complet, conditions et questions à CRG : `2026-06-04-custom-authentication-pont-jwt.md`.
- **Variante B (repli si pas de JWT vérifiable)** — CRG expose une API de vérification :
  `POST https://api.creditrural.gn/auth/verify`
  KUMY collecte les credentials et les relaie (TLS, sans stockage). Mitigations obligatoires : mTLS, rate-limit strict, lockout après N tentatives, IP whitelist.
- **Repli ultime (si aucune des voies ci-dessus dans les délais)** — comptes-gérés / import CSV : KUMY provisionne les comptes des 50 agents pilotes à partir d'un export CRG, synchronisé périodiquement. C'est le chemin le plus rapide pour démarrer.

**Décisions à prendre en interne CRG :**

- Quelle technologie utiliser ? (REST neuf, wrapper LDAP, module core banking)
- Où héberger ? (DMZ, reverse proxy)
- Rate limit recommandé : 100 req/min par client
- Authentification entrante : API key + IP whitelist du connecteur KUMY

**Scénarios selon l'existant CRG :**

| Scénario | Action CRG | Variante |
|---|---|---|
| CRG dispose d'une auth custom émettant des JWT (cas confirmé juin 2026) | Signer en RS256, exposer un JWKS, mettre en place le hand-off avec token vers AgriScore | C |
| CRG dispose déjà d'un OP / fournisseur OIDC | Déclarer KUMY comme client OIDC, fournir `client_id`/`secret` + JWKS | A |
| CRG dispose d'un Active Directory / LDAP | Exposer un OP (ex. Keycloak devant l'AD) ou une API `/auth/verify` ; whitelister l'IP du connecteur | A ou B |
| CRG peut développer une API REST | Développement d'un service de vérification dédié | B |
| Pas de ressources internes dans les délais | Comptes-gérés / import CSV — chemin pilote recommandé pour démarrer les 50 agents | Repli |

### 4.2 Chantier 2 — API de statut agent

**Objectif :** permettre la révocation en temps réel et le step-up authentication pour les actions sensibles.

**Endpoint attendu :**

```
GET https://api.creditrural.gn/agents/{agent_id}/status
```

**Réponse attendue :**

```json
{
  "agent_id": "CR-042",
  "actif": true,
  "agence_code": "LAB-03",
  "role": "agent_credit",
  "habilitations": ["scoring_consultation", "scoring_validation"],
  "last_modified": "2026-06-09T14:32:00Z"
}
```

Si l'API du Chantier 1 existe, ce chantier est une simple variante. Effort : 2–3 jours.

---

## 5. Chantiers côté KUMY

L'architecture exige aussi des développements côté KUMY, non triviaux : la plateforme AgriScore/AgriPilot est aujourd'hui mono-tenant, avec une authentification téléphone + PIN et une autorisation par `partnerId` lue côté serveur (les rôles ne sont pas portés par des custom claims Firebase). Le SSO CRG introduit un second modèle d'identité qu'il faut bâtir. Ces chantiers conditionnent le go-live au même titre que ceux de CRG.

| # | Chantier KUMY | Détail | Criticité |
|---|---|---|---|
| K1 | Activer GCIP multi-tenant + créer le tenant `credit-rural-gn` | Isoler les agents CRG dans un tenant dédié | 🔴 Bloquant |
| K2 | Connecteur d'identité | Variante A : intégration `signInWithRedirect` + OP CRG. Variante B : OP minimal hébergé par KUMY (`/authorize`, `/token`, signature JWT, JWKS). Variante C : endpoint `POST /auth/cr-sso` qui vérifie le JWT CRG (signature/`iss`/`aud`/`exp`) et forge un Firebase Custom Token (Admin SDK) + JIT provisioning | 🔴 Bloquant |
| K3 | Refonte de l'auth PWA | Ajouter le flux fédéré + sélection de tenant sans casser le login farmer/encadreur existant | 🔴 Bloquant |
| K4 | Modèle d'autorisation par agence | Introduire la notion d'agence + le mapping rôle CRG → permissions AgriScore | 🟠 Important |

> Ces chantiers ne sont pas une simple configuration : ils doivent figurer dans le chiffrage et le planning au même niveau que les chantiers CRG. L'estimation côté CRG (§4) ne couvre pas cet effort.

---

## 6. Spécifications techniques détaillées

### 6.1 API d'authentification CRG — Détail

**Request**

```http
POST /auth/verify HTTP/1.1
Host: api.creditrural.gn
Authorization: Bearer <api_key_kumy>
Content-Type: application/json

{
  "matricule": "CR-042",
  "password": "********",
  "client_id": "kumy-agriscore"
}
```

**Response — Succès (HTTP 200)**

```json
{
  "authenticated": true,
  "agent": {
    "agent_id": "CR-042",
    "matricule": "CR-042",
    "nom_complet": "Diallo Mamadou",
    "email": "m.diallo@creditrural.gn",
    "telephone": "+224612345678",
    "agence_code": "LAB-03",
    "agence_nom": "Labé",
    "agence_region": "Moyenne Guinée",
    "role": "agent_credit",
    "habilitations": ["scoring_consultation", "scoring_validation"],
    "date_embauche": "2021-03-15",
    "actif": true,
    "manager_id": "CR-008"
  }
}
```

**Response — Échec (HTTP 401)**

```json
{
  "authenticated": false,
  "error_code": "INVALID_CREDENTIALS",
  "message": "Identifiants incorrects"
}
```

**Codes d'erreur supportés :**

- `INVALID_CREDENTIALS` : matricule ou mot de passe incorrect
- `ACCOUNT_LOCKED` : compte verrouillé (trop de tentatives)
- `ACCOUNT_DISABLED` : agent désactivé/parti
- `PASSWORD_EXPIRED` : mot de passe expiré, à changer
- `INTERNAL_ERROR` : erreur technique côté CRG

### 6.2 Mapping des claims OIDC

Le connecteur KUMY produit un ID Token JWT signé contenant les claims suivants, dérivés de la réponse de l'API CRG :

| Claim OIDC | Source CRG | Exemple | Utilisation dans AgriScore |
|---|---|---|---|
| `sub` | `agent_id` | `"CR-042"` | Identifiant unique |
| `email` | `email` | `"m.diallo@creditrural.gn"` | Notifications, contact |
| `name` | `nom_complet` | `"Diallo Mamadou"` | Affichage |
| `phone_number` | `telephone` | `"+224612345678"` | MFA optionnel |
| `agence_code` | `agence_code` | `"LAB-03"` | Filtrage Firestore |
| `agence_name` | `agence_nom` | `"Labé"` | Affichage |
| `role` | `role` | `"agent_credit"` | Permissions |
| `habilitations` | `habilitations` | `["scoring_consultation"]` | Permissions fines |

> **Mapping des rôles à définir :** le rôle CRG `agent_credit` et les habilitations ne correspondent à aucun rôle existant d'AgriScore/AgriPilot (`super_admin`, `partner_admin`, `partner_manager`, `engineer`, `partner_viewer`, `farmer`). Une table de correspondance rôle CRG → permissions AgriScore (chantier K4, §5) doit être spécifiée et validée conjointement avant le pilote.

---

## 7. Matériel à échanger

### 7.1 De CRG vers KUMY

**Pour la mise en place**

- [ ] URL de l'API d'authentification
- [ ] URL de l'API de statut agent
- [ ] API key dédiée KUMY (32+ caractères aléatoires)
- [ ] Certificat TLS valide sur les endpoints
- [ ] Confirmation des IP KUMY à whitelister (KUMY les fournit)
- [ ] Compte de service de test (CR-DEMO-001) avec credentials
- [ ] Spécification des codes d'erreur supportés
- [ ] Mapping des attributs agent ↔ claims OIDC
- [ ] Format et liste exhaustive des codes d'agences CRG actives

**Pour la sécurité**

- [ ] Désignation d'un référent technique CRG (email + WhatsApp)
- [ ] Désignation d'un référent sécurité CRG (RSSI)
- [ ] Procédure d'urgence 24/7
- [ ] Politique de rotation des secrets (recommandation : 90 jours)

### 7.2 De KUMY vers CRG

- [ ] Spécification technique du connecteur OIDC (présent document)
- [ ] URLs des endpoints KUMY (`idp.kumy.app/creditrural/*`)
- [ ] IPs sources du connecteur (Cloud Run statiques à whitelister)
- [ ] Documentation des claims OIDC produites
- [ ] Schéma de l'audit log et procédure de consultation par CRG
- [ ] Engagement SLA (99,5% en pilote, 99,9% en scale)
- [ ] Procédure d'incident côté KUMY

---

## 8. Annexes

### 8.1 Sécurité et conformité

**Stockage des données KUMY**

- Région : europe-west1 (Belgique)
- Chiffrement au repos : AES-256
- Chiffrement en transit : TLS 1.3
- Rétention des logs d'audit : 7 ans (export BigQuery)
- Conformité Google Cloud : ISO 27001, ISO 27017, ISO 27018, SOC 1/2/3

**Engagements KUMY**

- Aucun mot de passe agent CRG n'est stocké
- Aucune donnée bancaire ou client CRG n'est exposée à GCIP
- Suppression d'un agent sous 24h sur demande de CRG
- Export complet des données CRG en cas de fin de contrat (30 jours)
- Notification de tout incident de sécurité sous 24h

**Conformité réglementaire**

- RGPD européen : DPA Google Cloud signé, droits des personnes implémentés
- Loi guinéenne L/2016/037/AN : déclaration ARPT à effectuer avant phase scale
- BCRG : architecture compatible avec les exigences bancaires guinéennes

### 8.2 Glossaire

| Terme | Définition |
|---|---|
| **AgriScore** | Plateforme KUMY de scoring de crédit agricole |
| **GCIP** | Google Cloud Identity Platform — service d'authentification Google |
| **OIDC** | OpenID Connect — protocole standard d'authentification fédérée |
| **JWT** | JSON Web Token — format de jeton signé utilisé par OIDC |
| **Claims** | Attributs portés par un JWT (identité, rôle, agence...) |
| **Tenant** | Container isolé d'utilisateurs dans GCIP (un par IMF) |
| **Custom Claims** | Claims métier ajoutés par KUMY (agence, rôle, habilitations) |
| **HMAC** | Hash-based Message Authentication Code — signature des webhooks |
| **MAU** | Monthly Active User — unité de facturation GCIP |
| **DPA** | Data Processing Agreement — accord de traitement des données |
| **SIRH** | Système d'Information Ressources Humaines |
| **Step-up auth** | Re-vérification d'identité pour actions sensibles |
| **SSO** | Single Sign-On — authentification unique |
| **OP** | OpenID Provider — service d'identité qui authentifie l'utilisateur et émet les tokens (ici : CRG en Variante A) |
| **ROPC** | Resource Owner Password Credentials — grant OAuth où l'app collecte le mot de passe (déprécié ; cas de la Variante B) |

### 8.3 Questions ouvertes à clarifier

| # | Question |
|---|---|
| Q1 | CRG dispose-t-il d'un Active Directory / LDAP existant ? |
| Q2 | Le SIRH CRG peut-il émettre des webhooks HTTP sortants ? (cf. doc synchronisation RH) |
| Q3 | Délai acceptable de propagation des changements RH ? (cf. doc synchronisation RH) |
| Q4 | Quel niveau de SLA CRG attend-il sur le connecteur ? |
| Q5 | Format de l'audit log attendu par la conformité CRG ? |
| Q6 | Procédure de rotation des secrets côté CRG ? |

---

**Fin du document**

*Ce document est confidentiel et destiné exclusivement à la collaboration entre KUMY HOLDING SAS et le Crédit Rural de Guinée dans le cadre de la Convention Cadre et du Contrat d'Application N°001.*
