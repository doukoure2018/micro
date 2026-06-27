# CLAUDE.md — Rapprochement de Solde (Desktop Python) — Crédit Rural de Guinée

Prompt d'implémentation pour construire une **application desktop Python** de rapprochement
de solde par code client, destinée au **service digital / centre de validation** du CRG.
Réimplémente la fonctionnalité existante (Java/Spring `ecreditservice` + `ebanking`) en
**FastAPI** (backend/API + accès bases) + **Tkinter** (interface desktop), avec
**authentification OIDC obligatoire** des agents auprès du fournisseur d'identité CRG.

---

## 1. Objectif fonctionnel

Un agent du **centre digital** saisit un **code client** (≥ 11 caractères). L'application
récupère, pour ce client, ses comptes et leurs soldes depuis **deux bases distinctes** et
les **rapproche compte par compte** :

| Source | Base | Rôle |
|---|---|---|
| **Production (SAF2000)** | `BDCRG` (SQL Server) | la **vérité comptable** |
| **Middleware** | `BD_MIDDLEWARE2` (SQL Server) | le **réplica / cache applicatif** à contrôler |

Le rapprochement vérifie que le **middleware est en phase avec le cœur bancaire**. Pour
chaque compte on calcule un **écart disponible** et un **écart moyen** ; un écart non nul
signale une désynchronisation à corriger.

---

## 2. Architecture

```
┌─────────────────────────────┐        OIDC (navigateur système)        ┌──────────────────────────┐
│   DESKTOP (Tkinter)         │  ───────────────────────────────────►   │  CRG OpenID Provider     │
│   - login OIDC (PKCE)       │      login agent (mot de passe          │  (Spring Auth Server,    │
│   - saisie code client      │       JAMAIS dans l'app)                │   RS256, déjà en prod)   │
│   - affichage rapprochement │  ◄───── id_token + access_token ──────  │  /auth/oauth2/*          │
└──────────────┬──────────────┘                                         └──────────────────────────┘
               │ HTTPS + Bearer access_token
               ▼
┌─────────────────────────────┐        ┌────────────────────────────┐
│   BACKEND (FastAPI)         │ ─────► │ Production BDCRG (SQL Srv)  │  ← soldes "vérité"
│   - valide le JWT (JWKS)    │        └────────────────────────────┘
│   - contrôle le rôle        │        ┌────────────────────────────┐
│   - rapprochement 2 bases   │ ─────► │ Middleware BD_MIDDLEWARE2   │  ← soldes "réplica"
└─────────────────────────────┘        └────────────────────────────┘
```

**Décision de sécurité importante :** le **backend FastAPI est centralisé** (un service,
pas embarqué dans chaque poste). Il détient **seul** les accès aux bases. Les postes desktop
ne contiennent **aucun identifiant de base** : ils s'authentifient en OIDC et appellent
l'API avec le `access_token`. (Pour le dev local, FastAPI peut tourner en `localhost`.)

---

## 3. Stack technique

- **Python 3.12+**
- **Backend** : FastAPI, Uvicorn, Pydantic v2, `httpx`
- **Accès SQL Server** : `pyodbc` (+ *ODBC Driver 18 for SQL Server*) ou SQLAlchemy 2 (Core)
- **OIDC / JWT** : `authlib` (ou flux manuel) + `python-jose[cryptography]` (validation RS256)
- **Desktop** : Tkinter (stdlib) + `ttk` ; `tkinter.ttk.Treeview` pour les tableaux
- **Parallélisme** : `concurrent.futures.ThreadPoolExecutor` (requêtes DB en parallèle)
- **Packaging desktop** : PyInstaller (exécutable Windows `.exe`)
- **Config** : `pydantic-settings` (variables d'environnement / `.env`)

---

## 4. Structure du dépôt

```
rapprochement-solde-desktop/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI app + routes
│   │   ├── config.py              # settings (env)
│   │   ├── security/
│   │   │   ├── oidc.py            # validation JWT via JWKS, dépendance get_current_agent
│   │   │   └── roles.py           # contrôle des rôles autorisés
│   │   ├── db/
│   │   │   ├── connections.py     # 2 connexions (prod / middleware), pools, read-only
│   │   │   └── queries.py         # requêtes SQL (cf. §6)
│   │   ├── services/
│   │   │   └── reconciliation.py  # logique de rapprochement (parallèle + écarts + fallback)
│   │   └── models/
│   │       └── schemas.py         # Pydantic: CompteSolde, FicheSignaletiqueSolde…
│   └── requirements.txt
├── desktop/
│   ├── app/
│   │   ├── main.py                # bootstrap Tkinter + login OIDC obligatoire
│   │   ├── auth/
│   │   │   └── oidc_desktop.py    # flux Authorization Code + PKCE (RFC 8252, loopback)
│   │   ├── api_client.py          # appels backend avec Bearer + refresh token
│   │   └── ui/
│   │       ├── login_window.py
│   │       ├── main_window.py     # barre de recherche + onglets
│   │       └── reconciliation_view.py  # bandeau, cartes, comparaison, tableau (cf. §8)
│   └── requirements.txt
├── .env.example
└── CLAUDE.md
```

---

## 5. Authentification OIDC des agents (OBLIGATOIRE)

> **Règle absolue :** tout agent s'authentifie sur la **page hébergée par le CRG** ;
> son mot de passe **ne transite jamais** par l'application. Le CRG est un OpenID Provider
> OIDC complet (Spring Authorization Server, **RS256**).

### 5.1 Endpoints OIDC CRG (production)

| Endpoint | URL |
|---|---|
| Discovery | `https://digi-creditrural-io.com/auth/.well-known/openid-configuration` |
| Authorize | `https://digi-creditrural-io.com/auth/oauth2/authorize` |
| Token | `https://digi-creditrural-io.com/auth/oauth2/token` |
| JWKS | `https://digi-creditrural-io.com/auth/oauth2/jwks` |
| UserInfo | `https://digi-creditrural-io.com/auth/userinfo` |

### 5.2 Client OIDC à enregistrer côté CRG (prérequis)

L'app desktop est un **client PUBLIC** → suivre **RFC 8252** (native app) :

- `client_id` : `crg-rapprochement-desktop`
- `client_authentication_method` : **none** (public, pas de secret embarqué)
- **PKCE : OBLIGATOIRE** (`code_challenge_method=S256`) — c'est requis pour un client public
  (contrairement à un broker confidentiel).
- `redirect_uri` : **boucle locale** `http://127.0.0.1:<port_éphémère>/callback`
  (enregistrer `http://127.0.0.1` ; le port est dynamique, autorisé par RFC 8252).
- `scopes` : `openid profile email agent_profile`
- grant types : `authorization_code`, `refresh_token`

> À enregistrer dans le `RegisteredClientRepository` du Spring Authorization Server (même
> mécanisme que les clients existants).

### 5.3 Flux desktop (Authorization Code + PKCE, loopback)

`desktop/app/auth/oidc_desktop.py` :

1. Lire la **discovery** pour obtenir les endpoints + `jwks_uri`.
2. Démarrer un **serveur HTTP local** sur un port éphémère (`http.server`), route `/callback`.
3. Générer `code_verifier` (43–128 chars aléatoires) + `code_challenge = BASE64URL(SHA256(verifier))`,
   un `state` et un `nonce` aléatoires.
4. Ouvrir le **navigateur système** (`webbrowser.open`) vers `/authorize?...`
   (`response_type=code`, `client_id`, `redirect_uri`, `scope`, `state`, `nonce`,
   `code_challenge`, `code_challenge_method=S256`).
5. L'agent se connecte sur la page CRG → redirection vers `http://127.0.0.1:port/callback?code=…&state=…`.
6. Vérifier le `state`, échanger le `code` sur `/token` (avec `code_verifier`, **sans secret**)
   → `id_token`, `access_token`, `refresh_token`.
7. **Valider l'`id_token`** : signature **RS256** via le JWKS (cache des clés par `kid`),
   `iss == https://digi-creditrural-io.com/auth`, `aud == crg-rapprochement-desktop`,
   `exp`/`nbf`, `nonce`.
8. Extraire les claims : `agent_id`, `role`, `agence_region`, `agence_name`, `agence_code`,
   `point_de_service`, `email`, `name`.
9. **Contrôle d'accès** : autoriser uniquement les rôles habilités au service digital
   (configurable, ex. `AGENT_CREDIT,RA,DA,DR` — voir `ALLOWED_ROLES`). Sinon, refuser.
10. Stocker les tokens en mémoire ; rafraîchir via `refresh_token` à l'expiration.

### 5.4 Validation côté backend

`backend/app/security/oidc.py` — dépendance FastAPI `get_current_agent` :

- Lire le header `Authorization: Bearer <access_token>`.
- Récupérer les clés via **JWKS** (`jwks_uri` de la discovery, cache + refresh sur `kid` inconnu).
- Valider **signature RS256**, `iss`, `exp`, et le scope/claims.
- Charger l'agent (claims `agent_id`, `role`, `agence_*`) ; rejeter si `role ∉ ALLOWED_ROLES` → `403`.
- Toute route métier dépend de `get_current_agent` (aucune route ouverte hormis `/health`).

---

## 6. Accès aux bases à rapprocher (préciser explicitement)

> Les deux bases sont **SQL Server**, table **`[CC].[CC_CUENTA_EFECTIVO]`**, filtrées par
> `COD_EMPRESA` + `COD_CLIENTE`, clé de jointure compte = **`NUM_CUENTA`**.
> `COD_EMPRESA` par défaut = **`"00000"`**. **Accès en LECTURE SEULE** (utilisateur SQL
> dédié `db_datareader`, `ApplicationIntent=ReadOnly` si réplica de lecture).

### 6.1 Variables d'environnement (backend uniquement)

```dotenv
# --- Production (SAF2000 / cœur bancaire) ---
PROD_DB_HOST=...                 # hôte SQL Server BDCRG
PROD_DB_PORT=1433
PROD_DB_NAME=BDCRG
PROD_DB_USER=svc_rapprochement_ro
PROD_DB_PASSWORD=...             # secret (jamais committé)

# --- Middleware (réplica applicatif) ---
MW_DB_HOST=...                   # hôte SQL Server BD_MIDDLEWARE2
MW_DB_PORT=1433
MW_DB_NAME=BD_MIDDLEWARE2
MW_DB_USER=svc_rapprochement_ro
MW_DB_PASSWORD=...

DB_QUERY_TIMEOUT_SECONDS=60
PRODUCTION_TIMEOUT_SECONDS=8     # fail-fast Production (cf. fallback §7)
DEFAULT_COD_EMPRESA=00000
```

Chaîne pyodbc type :
`DRIVER={ODBC Driver 18 for SQL Server};SERVER=<host>,<port>;DATABASE=<name>;UID=<user>;PWD=<pwd>;Encrypt=yes;TrustServerCertificate=yes;ApplicationIntent=ReadOnly;`

### 6.2 Requête Production (`BDCRG`) — soldes "vérité"

```sql
SELECT ce.COD_AGENCIA, ce.NUM_CUENTA, ce.COD_CATEGORIA, ce.COD_SISTEMA,
       ce.COD_PRODUCTO, ce.COD_CLIENTE, ce.COD_USUARIO, ce.FEC_ULT_MOVIMIENTO,
       ce.SAL_DISPONIBLE, ce.SAL_PROMEDIO, ce.SAL_CONGELADO, ce.SAL_TRANSITO,
       ce.SAL_RESERVA, ce.IND_ESTADO, ce.FEC_APERTURA
FROM [CC].[CC_CUENTA_EFECTIVO] ce
WHERE ce.COD_EMPRESA = ? AND ce.COD_CLIENTE = ?
ORDER BY ce.FEC_ULT_MOVIMIENTO DESC;
```

### 6.3 Requête Middleware (`BD_MIDDLEWARE2`) — soldes "réplica"

```sql
SELECT ce.COD_AGENCIA, ce.NUM_CUENTA, ce.COD_CATEGORIA,
       ce.SAL_DISPONIBLE, ce.SAL_PROMEDIO, ce.SAL_CONGELADO, ce.SAL_TRANSITO,
       ce.SAL_RESERVA, ce.IND_ESTADO
FROM [CC].[CC_CUENTA_EFECTIVO] ce
WHERE ce.COD_EMPRESA = ? AND ce.COD_CLIENTE = ?
ORDER BY ce.NUM_CUENTA;
```

### 6.4 Identité client (Production)

Porter la requête `getFicheSignaletique(codEmpresa, codCliente)` existante (sur `BDCRG`) qui
retourne l'identité : `nomCliente`, `indPersona`, `fecIngreso`, téléphones, adresse, pièce
d'identité, `codAgencia`, `indRelacion` (statut), etc. (à mapper depuis la table client SAF).

> ⚠️ Tous les montants sont des **`DECIMAL`** → utiliser `decimal.Decimal` côté Python
> (jamais `float`) pour des écarts exacts.

---

## 7. Logique de rapprochement (`services/reconciliation.py`)

Réplique fidèle de `FicheSignaletiqueServiceImpl` :

1. Lancer **3 requêtes en parallèle** (`ThreadPoolExecutor`) :
   identité (Prod), soldes Production (Prod), soldes Middleware (MW).
2. **Identité + Middleware** sont attendus avec le timeout normal.
3. **Production en fail-fast** : timeout court `PRODUCTION_TIMEOUT_SECONDS`. Si Production
   est lente/indisponible → **fallback Middleware seul** (`rapprochement_partiel = True`,
   écarts non calculés). Le Middleware ne doit **jamais** faire échouer la réponse.
4. Indexer les comptes Middleware par `NUM_CUENTA` (dict).
5. Pour **chaque compte Production**, retrouver l'équivalent Middleware :
   ```python
   ecart_disponible = (prod.sal_disponible or 0) - (mw.sal_disponible or 0)
   ecart_promedio   = (prod.sal_promedio   or 0) - (mw.sal_promedio   or 0)
   if mw is None:
       rapprochement_ok = None        # N/A : absent du middleware
   else:
       rapprochement_ok = (ecart_disponible == 0 and ecart_promedio == 0)
   ```
6. Agrégats : `total_solde_disponible` (Prod), `total_solde_disponible_middleware`,
   `ecart_total_disponible`, `ecart_total_moyen`, `comptes_avec_ecart`,
   `rapprochement_global_ok = (comptes_avec_ecart == 0 and not rapprochement_partiel)`.
7. Client introuvable (aucun compte ni identité) → `404`.

---

## 8. Interface desktop (Tkinter) — rendu des données

Fenêtre principale = barre de recherche + **3 onglets** (`ttk.Notebook`). Reproduire le rendu
de `DigitalVerificationComponent` :

**Saisie** : champ `cod_cliente` (≥ 11 caractères, requis), recherche **auto avec debounce
500 ms** dès 11 caractères + bouton « Rechercher ». États : « Recherche en cours… »,
bandeau d'erreur, sinon affichage.

**Onglet 2 « Rapprochement Soldes » (cœur) :**

- **a) Bandeau de synthèse** : vert ✓ « Rapprochement OK » si `rapprochement_global_ok`,
  sinon rouge ⚠ « Écart détecté — N compte(s) » + montants d'écart.
- **b) 4 cartes** : Nb comptes · Solde Production · Solde Middleware · Écart Total
  (la carte écart passe en rouge si ≠ 0).
- **c) Comparaison Prod ↔ MW** : deux cartes (bleu *Production (Saf2000)*, orange
  *Middleware (BD_MIDDLEWARE2)*) reliées par une pastille verte (OK) / rouge (écart).
- **d) Barre d'écarts** : Écart Disponible | Écart Moyen | Comptes en écart `N / total`.
- **e) Tableau détaillé** (`ttk.Treeview`, trié/paginable) — colonnes :
  `# | N° Compte | Catégorie | État | Dispo Prod | Dispo MW | Écart Dispo | Moyen Prod |
  Moyen MW | Écart Moyen | Résultat`.
  - Lignes colorées par **tag Treeview** : `row_ecart` (fond rosé) si écart, `row_ok`,
    `row_na` (grisé) si compte absent du MW.
  - Écart : **vert** si `0`, **rouge** si `≠ 0`. Colonne Résultat : `OK` / `ECART` / `N/A`.
  - **Ligne TOTAUX** (sommes Prod / MW / écart).

**Onglet 1** « Informations client » (identité). **Onglet 3** « Comptes & Soldes »
(liste avec indicateur d'inactivité par jours sans mouvement).

**Formatage** : montants en **GNF sans décimales** (`f"{value:,.0f} GNF".replace(",", " ")`),
dates en `JJ/MM/AAAA`.

---

## 9. API backend (contrat)

```
GET /health                                  → 200 (public)
GET /api/fiche-signaletique-with-solde/{cod_cliente}
    Authorization: Bearer <access_token>     (get_current_agent requis)
    → 200 FicheSignaletiqueSolde | 401 (token) | 403 (rôle) | 404 (client) | 504 (timeout DB)
```

`FicheSignaletiqueSolde` (Pydantic) : identité + `comptes: list[CompteSolde]` +
agrégats + `rapprochement_partiel: bool`. `CompteSolde` :
`num_cuenta, cod_categoria, ind_estado, sal_disponible, sal_promedio,
sal_disponible_middleware, sal_promedio_middleware, ecart_disponible, ecart_promedio,
rapprochement_ok` (Decimal sérialisés en string ou number selon besoin frontend).

---

## 10. Sécurité (exigences)

- **Aucun identifiant de base** sur les postes ; secrets backend via env (`.env` hors git).
- Utilisateur SQL **lecture seule** dédié sur chaque base.
- **OIDC obligatoire** ; validation **RS256 via JWKS** (jamais désactiver la vérif de
  signature) ; contrôle `iss`/`aud`/`exp`/`nonce` ; **contrôle de rôle** (`ALLOWED_ROLES`).
- PKCE **S256** côté desktop ; `state` anti-CSRF ; tokens en mémoire (pas sur disque).
- TLS pour tous les appels (OP + backend).
- Journaliser les accès (agent_id, code client consulté) ; ne jamais logger de secret/token.

---

## 11. Configuration (`.env.example`)

```dotenv
# OIDC
OIDC_ISSUER=https://digi-creditrural-io.com/auth
OIDC_DISCOVERY=https://digi-creditrural-io.com/auth/.well-known/openid-configuration
OIDC_CLIENT_ID=crg-rapprochement-desktop
OIDC_AUDIENCE=crg-rapprochement-desktop
ALLOWED_ROLES=AGENT_CREDIT,RA,DA,DR

# Backend
BACKEND_BASE_URL=https://rapprochement.digi-creditrural-io.com   # ou http://127.0.0.1:8000 en dev

# Bases (backend uniquement) — cf. §6.1
PROD_DB_HOST=...
MW_DB_HOST=...
# ...
```

---

## 12. Build & exécution

```bash
# Backend
cd backend && pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Desktop (dev)
cd desktop && pip install -r requirements.txt
python -m app.main

# Desktop (packaging Windows)
pyinstaller --noconsole --onefile desktop/app/main.py -n RapprochementSolde
```

---

## 13. Critères d'acceptation

1. Au lancement, l'app **force le login OIDC** (navigateur) ; sans rôle autorisé → accès refusé.
2. Saisie d'un code client valide → identité + comptes + soldes Prod & MW affichés.
3. Les **écarts** sont calculés en `Decimal` et colorés (vert = 0, rouge ≠ 0) ; badge
   OK/ECART/N/A correct ; ligne TOTAUX juste.
4. Si Production est indisponible → **fallback Middleware** sans crash (`rapprochement_partiel`).
5. Le backend **rejette** tout appel sans Bearer valide (`401`) ou hors rôle (`403`).
6. Aucun identifiant de base sur le poste ; mot de passe agent jamais vu par l'app.
7. Montants en **GNF sans décimales**, dates `JJ/MM/AAAA`.

---

## 14. Notes de portage (depuis l'existant Java)

- Source de vérité : `ebanking/FicheSignaletiqueServiceImpl` (logique) +
  `FicheSignaletiqueRepository` (requêtes §6) + `CorrectionResource:153` (endpoint) +
  frontend `DigitalVerificationComponent` (UI §8).
- Ne **pas** confondre avec le *rapprochement caisse par période* (`RapprochementResource`,
  transactions `TRANSACTIONSAF`/`OPERATIONSRESERVE` vs `CJ.CJ_TRAN_MENSUAL_ENCA`, cutoff
  10h15) : c'est un autre flux, transactionnel et daté.
