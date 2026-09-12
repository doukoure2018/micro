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
| `role` | Rôle CRG exposé à AgriScore (voir §6) | `AGENT_CREDIT` |
| `perimetre_niveau` | Niveau de ce que l'agent a le droit de voir : `POINT_DE_SERVICE`, `AGENCE`, `DELEGATION`, `NATIONAL` (voir §6) | `AGENCE` |
| `delegation_id` | Identifiant de la délégation (= `id` des routes `/agriculteurs/structure/delegations`) | `5` |
| `agence_region` | Libellé de la délégation (région) | `Guinée Forestière` |
| `agence_id` | Identifiant de l'agence (= `id` de `/agriculteurs/structure/delegations/{id}/agences`) | `7` |
| `agence_name` | Libellé de l'agence | `NZEREKORE` |
| `pointvente_id` | Identifiant du point de service | `30` |
| `pointvente_code` | Code du point de service. **C'est aussi le `codeAgence` renvoyé par `/agriculteurs/farmers` et `/agriculteurs/credits`** : clé de jointure pour cloisonner les agriculteurs par agent | `420` |
| `point_de_service` | Libellé du point de service | `N'Zerekoré 2` |
| `agence_code` | *Déprécié* — ancien nom de `pointvente_code`, même valeur, conservé pour compatibilité | `420` |

> Les claims de rattachement sont limités au niveau de l'agent : un DA reçoit `delegation_id` et
> `agence_id` mais pas de point de service ; un DR ne reçoit que `delegation_id` ; un DE/DG ne
> reçoit aucun rattachement. Dans l'**ID Token**, un rattachement manquant (fiche agent incomplète)
> est **omis** (un claim JWT ne peut pas valoir null) ; sur **/userinfo**, il vaut **`null`**.

### 5.1 Périmètre géographique complet (`/userinfo` uniquement)

`/userinfo` renvoie en plus l'objet **`perimetre`** : l'arbre des entités visibles par l'agent,
**toujours de la même forme** quel que soit le rôle (délégations → agences → points de service),
élagué à son niveau. Un seul parseur côté KUMY suffit.

```json
{
  "agent_id": "CR-260", "role": "DA", "perimetre_niveau": "AGENCE",
  "delegation_id": 2, "agence_region": "Haute Guinée",
  "agence_id": 22, "agence_name": "DINGUIRAYE",
  "perimetre": {
    "niveau": "AGENCE",
    "delegations": [
      { "id": 2, "libelle": "Haute Guinée",
        "agences": [
          { "id": 22, "libelle": "DINGUIRAYE",
            "points_de_service": [
              { "id": 113, "code": "555", "libelle": "Dialakoro" },
              { "id": 112, "code": "556", "libelle": "Kalinko" },
              { "id": 111, "code": "558", "libelle": "Dinguiraye" },
              { "id": 110, "code": "560", "libelle": "Mbonet" }
            ] }
        ] }
    ]
  }
}
```

| Rôle | `perimetre.delegations` contient |
|---|---|
| `AGENT_CREDIT` | sa délégation → son agence → **son seul** point de service |
| `DA`, `RA` | sa délégation → son agence → **tous** les points de service de l'agence |
| `DR` | sa délégation → **toutes** ses agences → tous leurs points de service |
| `DE`, `DG` | **toutes** les délégations (5) → toutes les agences (38) → tous les points de service (188) |

> L'arbre n'est **pas** dans l'ID Token (jusqu'à ~10 Ko au niveau national, incompatible avec les
> custom claims Firebase limités à 1 000 octets). Fiche agent incomplète : l'agent n'est pas refusé,
> l'arbre contient ce qui est connu et reste vide en dessous (ex. DA sans agence → `agences: []`).
> Le référentiel est mis en cache 5 minutes côté CRG.

---

## 6. Rôles CRG et niveaux

Le CRG expose **le rôle** ; KUMY gère les permissions fines de son côté
(pas de claim `habilitations`).

| Rôle | Niveau organisationnel | `perimetre_niveau` |
|---|---|---|
| `AGENT_CREDIT` | Point de service | `POINT_DE_SERVICE` |
| `RA` | Agence | `AGENCE` |
| `DA` | Agence | `AGENCE` |
| `DR` | Délégation | `DELEGATION` |
| `DE` | Direction de l'Exploitation (siège) | `NATIONAL` |
| `DG` | Direction Générale (siège) | `NATIONAL` |

> Organisation CRG à 3 niveaux : **délégation → agence → point de service**.
> Seuls ces six rôles accèdent à AgriScore ; pour tout autre compte (caisse, administration,
> autres directions du siège), aucun claim `agent_profile` n'est émis.

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

## 7b. Périmètre géographique agent (API, recommandé)

Même objet `perimetre` que `/userinfo` (§5.1), obtenu **par API à partir de l'`agent_id`** du SSO,
sans dépendre du contenu du jeton. C'est la voie recommandée pour le cloisonnement : elle utilise la
**clé publique de l'API agriculteurs** (celle des données) et suit les changements de référentiel
(nouvelle agence, mutation) sans nouveau login.

**Requête**
```
GET https://digi-creditrural-io.com/agriculteurs/agents/{agent_id}/perimetre
Header: X-API-Key: <clé publique API agriculteurs>
```

**Réponse `200`**
```json
{
  "agentId": "CR-39",
  "role": "DA",
  "active": true,
  "perimetre": {
    "niveau": "AGENCE",
    "delegations": [
      { "id": 5, "libelle": "Guinée Forestière",
        "agences": [
          { "id": 5, "libelle": "NZEREKORE",
            "points_de_service": [ { "id": 30, "code": "420", "libelle": "N'Zerekoré 2" } ] }
        ] }
    ]
  }
}
```

| Code HTTP | Signification |
|---|---|
| `200` | périmètre calculé ; `active` suit la règle de `/status` |
| `200` + `"niveau":"AUCUN"` et `delegations: []` | agent hors périmètre AgriScore (`role` = rôle brut CRG) |
| `400` | format d'`agent_id` invalide (attendu `CR-<n>`) |
| `401` | clé API absente ou invalide |
| `404` | agent inconnu |

> `points_de_service[].code` = `codeAgence` des agriculteurs et crédits de l'API `/agriculteurs` :
> un agent voit les agriculteurs dont le `codeAgence` appartient aux codes de son périmètre.
> Fréquence recommandée : à chaque login et une fois par jour côté serveur.

Le même périmètre reste disponible sur `GET /api/agents/{agent_id}/perimeter` avec la clé du
contrôle de statut (§7), et sous forme de claim `perimetre` sur `/userinfo` (§5.1).

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
