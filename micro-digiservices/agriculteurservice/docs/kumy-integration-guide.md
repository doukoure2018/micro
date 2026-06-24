# Intégration KUMY / AgriScore ↔ Crédit Rural de Guinée (CRG)

**Authentification fédérée OIDC (Variante A) + contrôle de statut agent**

Ce document décrit comment KUMY/AgriScore se connecte au fournisseur d'identité du
CRG pour authentifier les agents, et comment vérifier en temps réel le statut d'un agent.

> Les agents s'authentifient sur une page hébergée par le CRG : **leur mot de passe ne
> transite jamais par KUMY**. Le CRG est un OpenID Provider OIDC complet (Spring
> Authorization Server, signatures RS256).

---

## 1. Endpoints OIDC (production)

| Endpoint | URL |
|---|---|
| Discovery | `https://digi-creditrural-io.com/auth/.well-known/openid-configuration` |
| Authorization | `https://digi-creditrural-io.com/auth/oauth2/authorize` |
| Token | `https://digi-creditrural-io.com/auth/oauth2/token` |
| JWKS | `https://digi-creditrural-io.com/auth/oauth2/jwks` |
| UserInfo | `https://digi-creditrural-io.com/auth/userinfo` |

> Privilégier la **discovery** pour découvrir automatiquement les endpoints et les clés.

---

## 2. Clients OIDC

Un client par environnement (confidentiel, serveur-à-serveur).

| Paramètre | Production | Test |
|---|---|---|
| `client_id` | `kumy-agriscore-prod` | `kumy-agriscore-test` |
| `redirect_uri` | `https://idp.kumy.app/creditrural/callback` | `https://idp.kumy.app/creditrural-test/callback` |
| `client_secret` | *transmis par canal sécurisé séparé* | *transmis par canal sécurisé séparé* |
| Méthode d'auth client | `client_secret_basic` ou `client_secret_post` | idem |
| **PKCE** | **obligatoire** (`code_challenge_method=S256`) | idem |
| Grant types | `authorization_code`, `refresh_token` | idem |

---

## 3. Scopes

| Scope | Contenu |
|---|---|
| `openid` | obligatoire OIDC |
| `profile` | nom / prénom |
| `email` | email de l'agent |
| `agent_profile` | **claims métier CRG** (voir §5) — à demander pour récupérer le rattachement de l'agent |

Exemple : `scope=openid profile email agent_profile`

---

## 4. Flux d'authentification (Authorization Code + PKCE)

1. KUMY génère `code_verifier` + `code_challenge` (S256).
2. Redirection vers l'**Authorization endpoint** avec `client_id`, `redirect_uri`,
   `scope`, `state`, `nonce`, `code_challenge`, `code_challenge_method=S256`.
3. L'agent se connecte sur la page CRG (par **email** aujourd'hui).
4. Le CRG redirige vers le `redirect_uri` avec un `code`.
5. KUMY échange le `code` au **Token endpoint** (auth client + `code_verifier`) →
   reçoit `id_token`, `access_token`, `refresh_token`.
6. Les claims agent sont dans l'**ID Token** (et disponibles sur **/userinfo**).

---

## 5. Claims métier (`agent_profile`)

Émis dans l'**ID Token** et exposés sur **/userinfo** (mêmes valeurs), lorsque le scope
`agent_profile` est accordé.

| Claim | Description | Exemple |
|---|---|---|
| `agent_id` | Identifiant **stable et jamais réattribué** de l'agent (clé d'identité) | `CR-42` |
| `role` | Rôle CRG (voir §6) | `AGENT_CREDIT` |
| `agence_region` | Délégation (région) de rattachement | `Guinée Forestière` |
| `agence_name` | Agence de rattachement | `NZEREKORE` |
| `agence_code` | Code du point de service | `420` |
| `point_de_service` | Libellé du point de service | `N'Zerekoré 2` |

> Les claims géographiques absents (ex. un DR n'a pas de point de service) sont
> simplement **omis**.

---

## 6. Rôles CRG et niveaux

Le CRG expose **le rôle** ; KUMY gère les permissions fines de son côté
(pas de claim `habilitations`).

| Rôle | Niveau organisationnel |
|---|---|
| `AGENT_CREDIT` | Point de service |
| `RA` | Agence |
| `DA` | Agence |
| `DR` | Délégation |

> Organisation CRG à 3 niveaux : **délégation → agence → point de service**.

---

## 7. Contrôle de statut agent (temps réel)

Pour bloquer immédiatement un agent désactivé sans attendre l'expiration du token,
KUMY interroge un endpoint dédié (serveur-à-serveur, **clé API**, pas de JWT).

**Requête**
```
GET https://digi-creditrural-io.com/api/agents/{agent_id}/status
Header: X-API-Key: <clé transmise par canal sécurisé séparé>
```

**Réponse `200`**
```json
{
  "agentId": "CR-42",
  "active": true,
  "status": "ACTIVE",
  "enabled": true,
  "accountNonLocked": true,
  "accountNonExpired": true
}
```

| Code HTTP | Signification |
|---|---|
| `200` + `"status":"ACTIVE"` | agent actif |
| `200` + `"status":"DISABLED"` | agent désactivé/verrouillé/expiré |
| `401` | clé API absente ou invalide |
| `404` | agent inconnu |
| `400` | format d'`agent_id` invalide (attendu `CR-<n>`) |

**Exemple**
```bash
curl -H "X-API-Key: <clé>" \
  https://digi-creditrural-io.com/api/agents/CR-42/status
```

---

## 8. Secrets (canal sécurisé séparé)

Transmis **hors de ce document** (pas par email en clair) :

- `client_secret` du client `kumy-agriscore-prod`
- `client_secret` du client `kumy-agriscore-test`
- Clé API `X-API-Key` du endpoint de statut agent

Ces secrets sont **rotables** indépendamment côté CRG.

---

## 9. Environnements

| Environnement | IP source connecteur KUMY (whitelistée) |
|---|---|
| Production | `34.38.11.85` |
| Test | `35.187.117.108` |

Contact technique CRG : *(à compléter)*
