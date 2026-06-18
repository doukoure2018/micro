# Cadrage CRG — Authentification fédérée AgriScore (Variante A, OIDC)

**Document de cadrage interne Crédit Rural de Guinée**

| | |
|---|---|
| **Objet** | Réponse technique CRG à la spec KUMY `sso-authentification-agriscore-crg.md` — **Variante A (OIDC fédéré)** |
| **Statut** | Cadrage — **design only**, AUCUN code applicatif modifié. Implémentation **suspendue à la revue RSSI** (exposition d'identité vers un tiers). |
| **Date** | 2026-06-17 |
| **Décision** | Variante A retenue (pas C). Justification : `authorizationserver` est un **Spring Authorization Server** = OpenID Provider OIDC déjà en place. |

> Toutes les affirmations ci-dessous sont sourcées (fichier:ligne) à partir du code du dépôt.

---

## 1. Vérifications dans le code (preuves)

### 1.a — Page de login agent : ✅ existe, fonctionnelle, brandable

- **Form login Spring Security** : `authorizationserver/.../security/AuthorizationServerConfig.java:152-153`
  ```java
  http.formLogin(login -> login
        .loginPage("/login")
        .loginProcessingUrl("/login") ...)
  ```
- **Contrôleur** : `controller/LoginController.java:45-53` → `@GetMapping("/login")` retourne le template `login`.
- **Template brandé** : `src/main/resources/templates/login.html` (Thymeleaf + Tailwind, branding « DIGI CRG », titre « Se Connecter », champ `name="username"`, champ `password`, bloc erreur). → **Brandable** (HTML maîtrisé par CRG).
- **Redirection depuis `/oauth2/authorize`** : `AuthorizationServerConfig.java:110-112` — `LoginUrlAuthenticationEntryPoint("/login")` pour les requêtes `text/html` → un agent non authentifié arrivant sur `/oauth2/authorize` est bien renvoyé vers la page de login CRG. ✅
- Support **MFA** présent (handler de succès, `MfaAuthentication*`).

> ⚠️ **Point d'attention identité** : le champ de login `username` correspond en réalité à l'**email** (le template affiche un champ Email, et l'auth se fait par email). Or KUMY décrit « **matricule** + mot de passe » (spec §1.1). → **Écart UX/identifiant à trancher** (login par email actuel vs matricule attendu). Voir §2 et décisions.

### 1.b — Endpoints OIDC : ✅ présents et activés

- **Spring Authorization Server** + OIDC explicitement activé : `AuthorizationServerConfig.java:98-101`
  ```java
  http.with(authorizationConfig, authorizationServer -> authorizationServer
        .oidc(Customizer.withDefaults())
        .authorizationServerSettings(authorizationServerSettings()) ...)
  ```
- **Issuer** : `AuthorizationServerConfig.java:86` (`@Value("${oauth.issuer:http://localhost:8080}")`)
  - dev : `http://localhost:8080` (`application.yml`)
  - **prod : `https://digi-creditrural-io.com/auth`** (`application-prod.yml:182`) + `server.servlet.context-path: /auth` (`application-prod.yml:108`)
- **Endpoints effectifs en prod** (context-path `/auth`) :
  | Endpoint | URL prod |
  |---|---|
  | Discovery | `https://digi-creditrural-io.com/auth/.well-known/openid-configuration` |
  | Authorize | `https://digi-creditrural-io.com/auth/oauth2/authorize` |
  | Token | `https://digi-creditrural-io.com/auth/oauth2/token` |
  | JWKS | `https://digi-creditrural-io.com/auth/oauth2/jwks` |
  | UserInfo | `https://digi-creditrural-io.com/auth/userinfo` |
- **Déjà exposés publiquement** : nginx route `location /auth/ → http://authorizationserver:8080/auth/` (conf serveur), et le conteneur publie `8080:8080` (`docker-compose.yml`). Donc l'OP est **déjà joignable depuis Internet** (utilisé par le SPA/mobile). → exposition à KUMY = quasi nulle en effort, mais **à durcir** (§3.4).

### 1.c — Émission des tokens & claims : ✅ un `OAuth2TokenCustomizer` existe déjà

- **Bean customizer** : `AuthorizationServerConfig.java:299-337`
  - **Access token** : ajoute `authorities` (rôles, CSV) — `:304-307`
  - **ID token** : `:311-335`
    ```java
    context.getClaims()
      .claim("sub", user.getUserId().toString())
      .claim("name", firstName + " " + lastName)
      .claim("given_name", ...).claim("family_name", ...)
      .claim("email", ...).claim("preferred_username", email);
    ```
- **Signature RS256** : `security/UserJwtGenerator.java:54` ; clés RSA chargées depuis PEM (`security/KeyUtils.java:39-57`, prod `/app/keys/private.key|public.key`), **kid fixe** `8ba198c1-...`.
- **Clients enregistrés (persistés JDBC)** : `JdbcRegisteredClientRepository` (`AuthorizationServerConfig.java:348+`) → ajout d'un client KUMY = insertion en base, pas de code en dur. Clients existants : `client` (SPA, consent=true) et `mobile-app-client` (PKCE=true). Grants : `authorization_code` + `refresh_token`, scopes `openid/profile/email`.

> **Conséquence** : pour la Variante A, on **étend** le bloc ID-token de ce customizer (ajout des claims agent) — pas de nouveau mécanisme.

### 1.d — Modèle agent (userservice / migrations)

- **Identité** (`userservice/.../model/User.java`) : `userId`, `userUuid` (unique, non-null), `username` (= email en pratique), `email`, `firstName`, `lastName`, `phone`, **`matricule`** (`:43`, ajouté `V70`, `VARCHAR(50)`, **nullable**, indexé), `role` (String unique), `authorities` (CSV), `service` (`V54`, VARCHAR(100)), `delegationId`/`agenceId`/`pointventeId`, `enabled`, `accountNonLocked`, `isAuthorized` (`V66`).
- **Organisation** (`V6__Create_tables_analyse_credit.sql`) :
  - `delegation(id, libele)`, `agence(id, libele, delegation_id)`, `pointvente(id, libele, **code**, delegation_id, agence_id)`
  - `users` porte seulement les **IDs** (`delegation_id/agence_id/pointvente_id`) → les **libellés** nécessitent une jointure.
  - ⚠️ **`agence` n'a PAS de colonne `code`** (seulement `id` + `libele`). Seul `pointvente` a un `code`. Or KUMY attend `agence_code` (ex. `LAB-03`). → **gap** (§2).
- **Rôles** : table `roles(name, authority)` + `user_roles` (`V4`), mais `User.role` = **une seule chaîne**. Rôles connus : `AGENT_CREDIT, DA, DR, RA, CAISSE, AGENT_CORRECTEUR, SUPER_ADMIN, MANAGER, DIGITAL`.
- **Habilitations fines** : ❌ **inexistantes** — RBAC à gros grain uniquement (aucune table `permission`/`habilitation`). KUMY attend `habilitations: [...]`. → à **dériver du rôle** ou laisser KUMY mapper (leur chantier K4).
- **Endpoints existants utiles** (`resource/UserResource.java`) : `GET /user/getUser/{userId}`, `GET /user/getUserByUuid/{uuid}`, `GET /user/authorization/{userId}/status` (renvoie un **booléen** `isAuthorized`), `GET /user/by-role/{role}`, `GET /user/by-pointvente/{id}`. → **Pas** d'endpoint `GET /agents/{matricule}/status` au format KUMY.

---

## 2. Écarts existant → cible (Variante A)

| # | Domaine | Existant | Cible KUMY | Effort |
|---|---|---|---|---|
| E1 | **Client OIDC KUMY** | clients `client`/`mobile-app-client` | enregistrer `kumy-agriscore` (redirect URIs GCIP, PKCE) | Faible (insert JDBC) |
| E2 | **Claims agent dans l'ID Token** | sub/name/email/preferred_username | + `agent_id`, `agence_code`, `agence_name`, `role`, `habilitations` | Moyen (étendre customizer + résoudre libellés) |
| E3 | **Libellés org** | seuls les IDs sur `users` | besoin `agence_name` (libellé) | Moyen (jointure / lookup dans le customizer) |
| E4 | **`agence_code`** | `agence` sans `code` (libellé seul) | `agence_code` type `LAB-03` | **Décision** (utiliser `agence_id`, ou `pointvente.code`, ou ajouter `agence.code`) |
| E5 | **`habilitations`** | aucune (rôles seuls) | tableau d'habilitations | **Décision** (dériver du rôle vs déléguer à KUMY/K4) |
| E6 | **`agent_id` / matricule** | `matricule` nullable ; login par **email** | `agent_id` = matricule (`CR-042`), login « matricule » | **Décision** (peupler matricule ; identifiant de login) |
| E7 | **API statut agent** | `authorization/{userId}/status` (booléen) | `GET /agents/{matricule}/status` (actif, agence, rôle, habilitations, last_modified) | Moyen (nouvel endpoint userservice) |
| E8 | **Exposition / durcissement** | OP déjà exposé via nginx `/auth/` ; `8080` publié | rate-limit, lockout, PKCE, en-têtes sécu, 8080 non exposé Internet | Moyen (nginx + firewall + client settings) |
| E9 | **Consent screen** | `requireAuthorizationConsent(true)` (client SPA) | flux fédéré sans friction | **Décision** (consent=false pour KUMY ?) |

---

## 3. Plan d'implémentation détaillé (DESIGN ONLY — à n'exécuter qu'après revue RSSI)

### 3.1 Enregistrement du client OIDC KUMY (`authorizationserver`)
Insérer un `RegisteredClient` `kumy-agriscore` (via `JdbcRegisteredClientRepository`, même mécanisme que l'existant) :
- `clientId` = `kumy-agriscore` ; `clientSecret` = secret fort (confidential client, `client_secret_basic`).
- `authorizationGrantTypes` = `AUTHORIZATION_CODE` (+ `REFRESH_TOKEN` si KUMY le souhaite).
- `scopes` = `openid`, `profile`, `email` **+ scope custom `agent_profile`** (pour gater les claims métier).
- `redirectUris` = **fournis par KUMY** (callback GCIP, ex. `https://idp.kumy.app/creditrural/callback` et/ou le handler GCIP `https://<tenant>.firebaseapp.com/__/auth/handler`).
- `ClientSettings` : `requireProofKey(true)` (**PKCE**), `requireAuthorizationConsent(false)` (flux fédéré — voir E9).
- `TokenSettings` : `accessTokenTimeToLive(1h)`, ID token via OIDC ; refresh à décider.

### 3.2 Extension du `OAuth2TokenCustomizer` (claims agent)
Étendre le bloc **ID token** (`AuthorizationServerConfig.java:311-335`) — **et** alimenter `/userinfo` — pour ajouter, **conditionnés au scope `agent_profile`** :
| Claim | Source CRG | Remarque |
|---|---|---|
| `agent_id` | `user.matricule` (fallback `userUuid`) | cf. E6 |
| `agence_code` | à définir (E4) | `agence_id` ou `pointvente.code` ou nouvelle colonne |
| `agence_name` | `agence.libele` (jointure via `agenceId`) | E3 |
| `role` | `user.role` | mono-rôle |
| `habilitations` | dérivé du rôle (table de mapping CRG) ou `[]` | E5 |

- **Où mettre les claims** : recommandation = **ID Token ET `/userinfo`** (ID token pour usage immédiat par GCIP/Firebase ; `/userinfo` pour rafraîchissement). **À CONFIRMER avec KUMY** où ils lisent réellement (la spec §6.2 lit l'ID Token).
- **Plomberie données** : le customizer ne dispose aujourd'hui que de `firstName/lastName/email/userId`. Il faudra lui fournir `matricule`, `role`, `agenceId` + le **libellé agence** (jointure). Option propre : un appel/lecture vers `userservice` (ou enrichir l'objet `User` chargé à l'auth) — à spécifier sans dupliquer la logique.

### 3.3 Endpoint statut agent (`userservice`) — Chantier 2
Nouveau `GET /agents/{matricule}/status` (distinct de l'`authorization/{userId}/status` booléen existant) :
```json
{ "agent_id":"CR-042","actif":true,"agence_code":"LAB-03","role":"agent_credit",
  "habilitations":["scoring_consultation"],"last_modified":"2026-06-09T14:32:00Z" }
```
- `actif` ← `enabled && accountNonLocked && isAuthorized`.
- `last_modified` ← `users.updated_at`.
- Auth entrante : **API key dédiée KUMY + IP whitelist** (pas de JWT agent ici).

### 3.4 Exposition publique & durcissement (le vrai sujet RSSI)
**Déjà exposé** : `https://digi-creditrural-io.com/auth/**` (nginx → authorizationserver). Donc *fonctionnellement* prêt, mais à **durcir avant ouverture à un tiers** :
- **Fermer le port `8080` à Internet** : le conteneur publie `8080:8080` (`docker-compose.yml`) → l'OP est joignable en direct hors nginx/TLS. **À restreindre** (firewall/host : n'exposer que via nginx 443).
- **Rate-limiting nginx** sur `/auth/oauth2/token` et `/auth/oauth2/authorize` (ex. `limit_req`), recommandation KUMY 100 req/min/client.
- **Lockout** : `users.login_attempts` existe déjà → vérifier la politique de verrouillage.
- **PKCE** obligatoire sur le client KUMY (3.1).
- **En-têtes sécu** (HSTS, X-Frame-Options sur la page login, CSP) + TLS 1.3 (déjà Let's Encrypt).
- **JWKS/kid** : kid **fixe** → définir une **procédure de rotation de clés** (aujourd'hui une seule RSA depuis PEM ; rotation = publier 2 clés dans le JWKS le temps de la bascule).
- **Audit** : journaliser les `authorize`/`token` (matricule, client, IP), rétention selon conformité (KUMY évoque 7 ans).

---

## 4. Brouillon de réponse technique à KUMY

> **Objet : CRG confirme la Variante A (OIDC fédéré)**
>
> Bonjour,
>
> Après analyse de votre spécification, **CRG retient la Variante A (OIDC fédéré)**. Notre service d'identité repose sur **Spring Authorization Server** : c'est un **OpenID Provider OIDC complet** déjà en production (discovery, authorize, token, JWKS, userinfo ; signatures **RS256**). Le mot de passe agent **ne quittera jamais le SI CRG** (page de login hébergée par CRG).
>
> **Endpoints OIDC CRG (à finaliser après durcissement) :**
> - Issuer / Discovery : `https://digi-creditrural-io.com/auth/.well-known/openid-configuration`
> - Authorize : `https://digi-creditrural-io.com/auth/oauth2/authorize`
> - Token : `https://digi-creditrural-io.com/auth/oauth2/token`
> - JWKS : `https://digi-creditrural-io.com/auth/oauth2/jwks`
> - UserInfo : `https://digi-creditrural-io.com/auth/userinfo`
>
> **Nous vous fournirons** : `client_id`/`client_secret` dédiés, scopes `openid profile email` (+ scope `agent_profile` pour les claims métier), PKCE activé.
>
> **Merci de nous confirmer / fournir :**
> 1. Vos **redirect URIs** exactes (callback GCIP / `idp.kumy.app/creditrural`, handler Firebase).
> 2. Les **IP sources** de votre connecteur à whitelister.
> 3. **Où vous lisez les claims métier** (`agent_id`, `agence_code`, `agence_name`, `role`, `habilitations`) : **ID Token** et/ou **/userinfo** ? (la §6.2 suggère l'ID Token — à confirmer).
> 4. Le **mapping rôles CRG → permissions AgriScore** (votre chantier K4) : côté CRG nous exposons un **rôle** (`AGENT_CREDIT`, `DA`, …) ; les **habilitations fines n'existent pas** chez nous.
> 5. Format attendu de `agent_id` (matricule type `CR-042`) et de `agence_code` (voir nos questions ci-dessous).
>
> **Points ouverts côté CRG :** identifiant de connexion agent (email vs matricule), définition de `agence_code` (notre référentiel agence n'a pas de code court standardisé). Nous revenons vers vous après revue sécurité (RSSI).

---

## 5. Réponses aux questions ouvertes §8.3

| # | Question KUMY | Réponse CRG (d'après le code) |
|---|---|---|
| **Q1** | AD / LDAP existant ? | **Non.** Base **users PostgreSQL maison** (`users`, `roles`, `user_roles` ; `V4`). L'IdP est notre **Spring Authorization Server**. |
| **Q2** | SIRH peut émettre des webhooks HTTP ? | **À traiter dans le doc compagnon** `sso-synchronisation-rh-agriscore-crg.md` (hors périmètre de ce cadrage auth). À ce stade : pas de webhook RH identifié dans le code. |
| **Q3** | Délai de propagation des changements RH ? | Idem Q2 — doc synchronisation RH. La révocation immédiate s'appuiera sur `GET /agents/{matricule}/status` (§3.3) + `revokeRefreshTokens` côté KUMY. |
| **Q4** | SLA attendu sur le connecteur ? | Décision **métier/direction** (non déductible du code). |
| **Q5** | Format de l'audit log attendu ? | À définir avec le RSSI (§3.4 propose : matricule, client, IP, horodatage ; rétention à fixer). |
| **Q6** | Rotation des secrets côté CRG ? | Aujourd'hui **kid RSA fixe** + secrets clients en base. Procédure de rotation **à définir** (clés JWKS + secret client KUMY ; reco 90 j). |

---

## 6. Décisions à trancher avant implémentation (récap)

1. **Identifiant de login agent** : email (actuel) vs matricule (attendu KUMY) — E6.
2. **`agent_id`** : matricule (à peupler pour tous les agents fédérés) ou `userUuid` en repli.
3. **`agence_code`** : `agence_id` ? `pointvente.code` ? nouvelle colonne `agence.code` ? — E4.
4. **`habilitations`** : dérivées d'un mapping rôle→habilitations côté CRG, ou rôle seul + mapping côté KUMY (K4) — E5.
5. **Claims dans ID Token et/ou /userinfo** — à confirmer avec KUMY (réponse 4.3).
6. **Consent screen** désactivé pour le client KUMY — E9.
7. **Durcissement exposition** : fermeture du `8080` public, rate-limit, rotation de clés — **revue RSSI** (bloquant).

> **Aucun code applicatif n'a été modifié par ce cadrage.** L'implémentation des §3.1–3.4 est conditionnée à la validation RSSI et aux décisions §6.
