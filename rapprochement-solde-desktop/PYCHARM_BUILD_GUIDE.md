# Guide de build PyCharm — Rapprochement de Solde (Desktop Python)

Guide **pas à pas** pour construire l'application dans **PyCharm**, avec le code concret des
modules clés. À lire avec `CLAUDE.md` (la spec). Cible : un **backend FastAPI** (accès aux 2
bases + validation OIDC) et un **client desktop Tkinter** (login OIDC + affichage).

Client OIDC déjà enregistré côté CRG :
`client_id = crg-rapprochement-desktop`, public, **PKCE S256**, redirect `http://127.0.0.1:8765/callback`.

---

## 0. Prérequis

- **Python 3.12+**
- **ODBC Driver 18 for SQL Server** installé (Windows : Microsoft ; macOS/Linux : `msodbcsql18`)
- **PyCharm** (Community suffit)
- Accès réseau aux 2 bases SQL Server (`BDCRG`, `BD_MIDDLEWARE2`) en lecture seule

---

## 1. Créer le projet dans PyCharm

1. *File → New Project* → dossier `rapprochement-solde-desktop`.
2. **New environment using → Virtualenv**, base interpreter Python 3.12 → *Create*.
3. Crée deux *Sources Root* : clic droit sur `backend` puis `desktop` → *Mark Directory as → Sources Root* (après les avoir créés).
4. Active *Settings → Tools → Python Integrated Tools → Default test runner: pytest*.

Arborescence à créer (clic droit → *New → Directory/File*) :

```
rapprochement-solde-desktop/
├── backend/  (Sources Root)
│   ├── app/__init__.py
│   ├── app/config.py
│   ├── app/main.py
│   ├── app/security/__init__.py  app/security/oidc.py  app/security/roles.py
│   ├── app/db/__init__.py        app/db/connections.py  app/db/queries.py
│   ├── app/services/__init__.py  app/services/reconciliation.py
│   ├── app/models/__init__.py    app/models/schemas.py
│   └── requirements.txt
├── desktop/  (Sources Root)
│   ├── app/__init__.py
│   ├── app/main.py
│   ├── app/config.py
│   ├── app/auth/__init__.py      app/auth/oidc_desktop.py
│   ├── app/api_client.py
│   ├── app/ui/__init__.py        app/ui/main_window.py  app/ui/reconciliation_view.py
│   └── requirements.txt
├── .env
└── .env.example
```

---

## 2. Dépendances

`backend/requirements.txt`
```
fastapi==0.115.*
uvicorn[standard]==0.32.*
pydantic==2.*
pydantic-settings==2.*
pyodbc==5.*
python-jose[cryptography]==3.3.*
httpx==0.27.*
```

`desktop/requirements.txt`
```
httpx==0.27.*
python-jose[cryptography]==3.3.*
pydantic==2.*
pydantic-settings==2.*
```

Installer (Terminal PyCharm, venv actif) :
```bash
pip install -r backend/requirements.txt -r desktop/requirements.txt
```

---

## 3. Configuration `.env`

`.env.example` (copier en `.env`, **ne pas committer `.env`**) :
```dotenv
# OIDC (commun desktop + backend)
OIDC_ISSUER=https://digi-creditrural-io.com/auth
OIDC_DISCOVERY=https://digi-creditrural-io.com/auth/.well-known/openid-configuration
OIDC_CLIENT_ID=crg-rapprochement-desktop
OIDC_REDIRECT_URI=http://127.0.0.1:8765/callback
OIDC_SCOPES=openid profile email agent_profile
ALLOWED_ROLES=AGENT_CREDIT,RA,DA,DR

# Backend
BACKEND_BASE_URL=http://127.0.0.1:8000

# Bases (BACKEND uniquement)
PROD_DB_HOST=
PROD_DB_PORT=1433
PROD_DB_NAME=BDCRG
PROD_DB_USER=
PROD_DB_PASSWORD=
MW_DB_HOST=
MW_DB_PORT=1433
MW_DB_NAME=BD_MIDDLEWARE2
MW_DB_USER=
MW_DB_PASSWORD=
DEFAULT_COD_EMPRESA=00000
DB_QUERY_TIMEOUT=60
PRODUCTION_TIMEOUT=8
```

---

## 4. BACKEND — code

### 4.1 `backend/app/config.py`
```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    oidc_issuer: str
    oidc_discovery: str
    oidc_client_id: str
    allowed_roles: str = "AGENT_CREDIT,RA,DA,DR"

    prod_db_host: str; prod_db_port: int = 1433; prod_db_name: str = "BDCRG"
    prod_db_user: str; prod_db_password: str
    mw_db_host: str; mw_db_port: int = 1433; mw_db_name: str = "BD_MIDDLEWARE2"
    mw_db_user: str; mw_db_password: str
    default_cod_empresa: str = "00000"
    db_query_timeout: int = 60
    production_timeout: int = 8

    @property
    def allowed_roles_set(self) -> set[str]:
        return {r.strip() for r in self.allowed_roles.split(",") if r.strip()}

settings = Settings()
```

### 4.2 `backend/app/security/oidc.py` — validation JWT via JWKS
```python
import time, httpx
from jose import jwt
from jose.exceptions import JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings

_bearer = HTTPBearer(auto_error=True)
_jwks_cache: dict = {"keys": None, "exp": 0, "uri": None}

def _discovery() -> dict:
    return httpx.get(settings.oidc_discovery, timeout=10).raise_for_status().json()

def _jwks() -> dict:
    now = time.time()
    if _jwks_cache["keys"] is None or now > _jwks_cache["exp"]:
        uri = _jwks_cache["uri"] or _discovery()["jwks_uri"]
        _jwks_cache.update(uri=uri, keys=httpx.get(uri, timeout=10).json(), exp=now + 3600)
    return _jwks_cache["keys"]

def _key_for(token: str) -> dict:
    kid = jwt.get_unverified_header(token).get("kid")
    for k in _jwks()["keys"]:
        if k["kid"] == kid:
            return k
    # kid inconnu → forcer un refresh une fois
    _jwks_cache["keys"] = None
    for k in _jwks()["keys"]:
        if k["kid"] == kid:
            return k
    raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Clé de signature inconnue")

class Agent:
    def __init__(self, claims: dict):
        self.agent_id = claims.get("agent_id")
        self.role = claims.get("role")
        self.agence_name = claims.get("agence_name")
        self.email = claims.get("email")
        self.claims = claims

def get_current_agent(cred: HTTPAuthorizationCredentials = Depends(_bearer)) -> Agent:
    token = cred.credentials
    try:
        claims = jwt.decode(
            token, _key_for(token), algorithms=["RS256"],
            issuer=settings.oidc_issuer, options={"verify_aud": False},  # access token: aud variable
        )
    except JWTError as e:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"Token invalide: {e}")
    agent = Agent(claims)
    if agent.role not in settings.allowed_roles_set:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Rôle non autorisé pour le rapprochement")
    return agent
```

### 4.3 `backend/app/db/connections.py` — 2 bases, lecture seule
```python
import pyodbc
from app.config import settings

def _conn_str(host, port, db, user, pwd) -> str:
    return (
        "DRIVER={ODBC Driver 18 for SQL Server};"
        f"SERVER={host},{port};DATABASE={db};UID={user};PWD={pwd};"
        "Encrypt=yes;TrustServerCertificate=yes;ApplicationIntent=ReadOnly;"
    )

def prod_connection() -> pyodbc.Connection:
    c = pyodbc.connect(_conn_str(settings.prod_db_host, settings.prod_db_port,
                                 settings.prod_db_name, settings.prod_db_user,
                                 settings.prod_db_password), timeout=settings.db_query_timeout)
    c.timeout = settings.db_query_timeout
    return c

def mw_connection() -> pyodbc.Connection:
    c = pyodbc.connect(_conn_str(settings.mw_db_host, settings.mw_db_port,
                                 settings.mw_db_name, settings.mw_db_user,
                                 settings.mw_db_password), timeout=settings.db_query_timeout)
    c.timeout = settings.db_query_timeout
    return c
```

### 4.4 `backend/app/db/queries.py` — requêtes réelles + fiche identité
```python
from decimal import Decimal
from app.config import settings
from app.db.connections import prod_connection, mw_connection

SQL_PROD = """
SELECT ce.COD_AGENCIA, ce.NUM_CUENTA, ce.COD_CATEGORIA, ce.COD_SISTEMA,
       ce.COD_PRODUCTO, ce.COD_CLIENTE, ce.COD_USUARIO, ce.FEC_ULT_MOVIMIENTO,
       ce.SAL_DISPONIBLE, ce.SAL_PROMEDIO, ce.SAL_CONGELADO, ce.SAL_TRANSITO,
       ce.SAL_RESERVA, ce.IND_ESTADO, ce.FEC_APERTURA
FROM [CC].[CC_CUENTA_EFECTIVO] ce
WHERE ce.COD_EMPRESA = ? AND ce.COD_CLIENTE = ?
ORDER BY ce.FEC_ULT_MOVIMIENTO DESC
"""

SQL_MW = """
SELECT ce.COD_AGENCIA, ce.NUM_CUENTA, ce.COD_CATEGORIA,
       ce.SAL_DISPONIBLE, ce.SAL_PROMEDIO, ce.SAL_CONGELADO, ce.SAL_TRANSITO,
       ce.SAL_RESERVA, ce.IND_ESTADO
FROM [CC].[CC_CUENTA_EFECTIVO] ce
WHERE ce.COD_EMPRESA = ? AND ce.COD_CLIENTE = ?
ORDER BY ce.NUM_CUENTA
"""

def _d(v) -> Decimal:
    return Decimal(str(v)) if v is not None else Decimal(0)

def fetch_prod_comptes(cod_cliente: str) -> list[dict]:
    with prod_connection() as c:
        cur = c.cursor()
        cur.execute(SQL_PROD, settings.default_cod_empresa, cod_cliente)
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in cur.fetchall()]

def fetch_mw_comptes(cod_cliente: str) -> dict[str, dict]:
    try:
        with mw_connection() as c:
            cur = c.cursor()
            cur.execute(SQL_MW, settings.default_cod_empresa, cod_cliente)
            cols = [d[0] for d in cur.description]
            return {r[cols.index("NUM_CUENTA")]: dict(zip(cols, r)) for r in cur.fetchall()}
    except Exception:
        return {}   # middleware indisponible ne doit jamais bloquer

def fetch_identite(cod_cliente: str) -> dict | None:
    # TODO: porter la requête getFicheSignaletique (table client SAF sur BDCRG)
    # Retourner au minimum: nom_cliente, cod_agencia, statut, telephones, adresse...
    ...
```

### 4.5 `backend/app/models/schemas.py`
```python
from decimal import Decimal
from pydantic import BaseModel

class CompteSolde(BaseModel):
    num_cuenta: str
    cod_categoria: str | None = None
    ind_estado: str | None = None
    sal_disponible: Decimal = Decimal(0)
    sal_promedio: Decimal = Decimal(0)
    sal_disponible_middleware: Decimal | None = None
    sal_promedio_middleware: Decimal | None = None
    ecart_disponible: Decimal | None = None
    ecart_promedio: Decimal | None = None
    rapprochement_ok: bool | None = None

class FicheSolde(BaseModel):
    cod_cliente: str
    nom_cliente: str | None = None
    cod_agencia: str | None = None
    comptes: list[CompteSolde] = []
    total_solde_disponible: Decimal = Decimal(0)
    total_solde_disponible_middleware: Decimal = Decimal(0)
    ecart_total_disponible: Decimal = Decimal(0)
    ecart_total_moyen: Decimal = Decimal(0)
    comptes_avec_ecart: int = 0
    total_comptes: int = 0
    rapprochement_global_ok: bool = False
    rapprochement_partiel: bool = False
```

### 4.6 `backend/app/services/reconciliation.py` — rapprochement
```python
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FTimeout
from decimal import Decimal
from fastapi import HTTPException, status
from app.config import settings
from app.db import queries
from app.models.schemas import CompteSolde, FicheSolde

_pool = ThreadPoolExecutor(max_workers=6)

def _d(v) -> Decimal:
    return Decimal(str(v)) if v is not None else Decimal(0)

def reconcile(cod_cliente: str) -> FicheSolde:
    f_id = _pool.submit(queries.fetch_identite, cod_cliente)
    f_mw = _pool.submit(queries.fetch_mw_comptes, cod_cliente)
    f_prod = _pool.submit(queries.fetch_prod_comptes, cod_cliente)

    identite = f_id.result(timeout=settings.db_query_timeout)
    mw = f_mw.result(timeout=settings.db_query_timeout)

    partiel = False
    try:
        prod = f_prod.result(timeout=settings.production_timeout)  # fail-fast
    except FTimeout:
        prod, partiel = [], True   # fallback middleware seul

    comptes: list[CompteSolde] = []
    if prod:
        for p in prod:
            num = p["NUM_CUENTA"]
            m = mw.get(num)
            c = CompteSolde(
                num_cuenta=num, cod_categoria=p.get("COD_CATEGORIA"), ind_estado=p.get("IND_ESTADO"),
                sal_disponible=_d(p.get("SAL_DISPONIBLE")), sal_promedio=_d(p.get("SAL_PROMEDIO")),
            )
            if m is not None:
                c.sal_disponible_middleware = _d(m.get("SAL_DISPONIBLE"))
                c.sal_promedio_middleware = _d(m.get("SAL_PROMEDIO"))
                c.ecart_disponible = c.sal_disponible - c.sal_disponible_middleware
                c.ecart_promedio = c.sal_promedio - c.sal_promedio_middleware
                c.rapprochement_ok = (c.ecart_disponible == 0 and c.ecart_promedio == 0)
            else:
                c.rapprochement_ok = None  # absent du middleware
            comptes.append(c)
    else:
        for num, m in mw.items():   # fallback : pas d'écarts
            comptes.append(CompteSolde(num_cuenta=num, cod_categoria=m.get("COD_CATEGORIA"),
                ind_estado=m.get("IND_ESTADO"), sal_disponible_middleware=_d(m.get("SAL_DISPONIBLE")),
                sal_promedio_middleware=_d(m.get("SAL_PROMEDIO"))))

    if not comptes and not identite:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Client introuvable")

    avec_ecart = sum(1 for c in comptes if c.rapprochement_ok is False)
    return FicheSolde(
        cod_cliente=cod_cliente,
        nom_cliente=(identite or {}).get("nom_cliente"),
        cod_agencia=(identite or {}).get("cod_agencia"),
        comptes=comptes,
        total_solde_disponible=sum((c.sal_disponible for c in comptes), Decimal(0)),
        total_solde_disponible_middleware=sum((c.sal_disponible_middleware or Decimal(0) for c in comptes), Decimal(0)),
        ecart_total_disponible=sum((c.ecart_disponible or Decimal(0) for c in comptes), Decimal(0)),
        ecart_total_moyen=sum((c.ecart_promedio or Decimal(0) for c in comptes), Decimal(0)),
        comptes_avec_ecart=avec_ecart, total_comptes=len(comptes),
        rapprochement_global_ok=(avec_ecart == 0 and not partiel),
        rapprochement_partiel=partiel,
    )
```

### 4.7 `backend/app/main.py`
```python
from fastapi import FastAPI, Depends
from app.security.oidc import get_current_agent, Agent
from app.services.reconciliation import reconcile
from app.models.schemas import FicheSolde

app = FastAPI(title="Rapprochement Solde - CRG")

@app.get("/health")
def health(): return {"status": "ok"}

@app.get("/api/fiche-signaletique-with-solde/{cod_cliente}", response_model=FicheSolde)
def fiche(cod_cliente: str, agent: Agent = Depends(get_current_agent)):
    # journaliser: agent.agent_id consulte cod_cliente
    return reconcile(cod_cliente)
```

---

## 5. DESKTOP — code

### 5.1 `desktop/app/auth/oidc_desktop.py` — Authorization Code + PKCE (loopback)
```python
import base64, hashlib, http.server, secrets, threading, urllib.parse, webbrowser, httpx
from app.config import settings

def _rand(n=64): return base64.urlsafe_b64encode(secrets.token_bytes(n)).rstrip(b"=").decode()

class _Catcher(http.server.BaseHTTPRequestHandler):
    code = None; state = None
    def do_GET(self):
        q = urllib.parse.urlparse(self.path)
        if q.path != "/callback":
            self.send_response(404); self.end_headers(); return
        p = urllib.parse.parse_qs(q.query)
        _Catcher.code = p.get("code", [None])[0]
        _Catcher.state = p.get("state", [None])[0]
        self.send_response(200); self.send_header("Content-Type", "text/html; charset=utf-8"); self.end_headers()
        self.wfile.write("<h2>Connexion réussie. Vous pouvez fermer cette fenêtre.</h2>".encode())
    def log_message(self, *a): pass

def login() -> dict:
    disc = httpx.get(settings.oidc_discovery, timeout=10).json()
    verifier = _rand()
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()
    state, nonce = _rand(16), _rand(16)

    httpd = http.server.HTTPServer(("127.0.0.1", 8765), _Catcher)  # port FIXE = redirect enregistré
    threading.Thread(target=httpd.handle_request, daemon=True).start()

    params = {
        "response_type": "code", "client_id": settings.oidc_client_id,
        "redirect_uri": settings.oidc_redirect_uri, "scope": settings.oidc_scopes,
        "state": state, "nonce": nonce,
        "code_challenge": challenge, "code_challenge_method": "S256",
    }
    webbrowser.open(disc["authorization_endpoint"] + "?" + urllib.parse.urlencode(params))

    while _Catcher.code is None:  # attente du callback (ajouter un timeout en prod)
        pass
    if _Catcher.state != state:
        raise RuntimeError("State invalide (anti-CSRF)")

    tok = httpx.post(disc["token_endpoint"], data={
        "grant_type": "authorization_code", "code": _Catcher.code,
        "redirect_uri": settings.oidc_redirect_uri, "client_id": settings.oidc_client_id,
        "code_verifier": verifier,
    }, timeout=15).raise_for_status().json()
    return tok   # access_token, id_token, refresh_token
```

### 5.2 `desktop/app/api_client.py`
```python
import httpx
from app.config import settings

class ApiClient:
    def __init__(self, access_token: str):
        self._h = {"Authorization": f"Bearer {access_token}"}

    def fiche_solde(self, cod_cliente: str) -> dict:
        r = httpx.get(f"{settings.backend_base_url}/api/fiche-signaletique-with-solde/{cod_cliente}",
                      headers=self._h, timeout=70)
        r.raise_for_status()
        return r.json()
```

### 5.3 `desktop/app/ui/reconciliation_view.py` — tableau coloré
```python
import tkinter as tk
from tkinter import ttk

def fmt_gnf(v) -> str:
    try: return f"{float(v):,.0f} GNF".replace(",", " ")
    except (TypeError, ValueError): return "—"

class ReconciliationView(ttk.Frame):
    COLS = ("num", "cat", "etat", "dispo_p", "dispo_m", "ecart_d",
            "moyen_p", "moyen_m", "ecart_m", "res")
    HEADERS = ("N° Compte", "Catégorie", "État", "Dispo Prod", "Dispo MW", "Écart Dispo",
               "Moyen Prod", "Moyen MW", "Écart Moyen", "Résultat")

    def __init__(self, master):
        super().__init__(master, padding=8)
        self.banner = ttk.Label(self, font=("Segoe UI", 11, "bold"))
        self.banner.pack(fill="x", pady=(0, 8))
        self.tree = ttk.Treeview(self, columns=self.COLS, show="headings", height=15)
        for c, h in zip(self.COLS, self.HEADERS):
            self.tree.heading(c, text=h)
            self.tree.column(c, width=110, anchor="e" if "p" in c or "m" in c or "ecart" in c else "center")
        self.tree.tag_configure("ecart", background="#fff5f5")
        self.tree.tag_configure("ok", background="#f4fff7")
        self.tree.tag_configure("na", background="#f3f3f3")
        self.tree.pack(fill="both", expand=True)

    def render(self, data: dict):
        ok = data["rapprochement_global_ok"]
        self.banner.configure(
            text=("✓ Rapprochement OK — Production et Middleware concordent" if ok
                  else f"⚠ Écart détecté — {data['comptes_avec_ecart']} compte(s)"),
            foreground=("#1b7d3a" if ok else "#b3261e"))
        self.tree.delete(*self.tree.get_children())
        for i, c in enumerate(data["comptes"], 1):
            ro = c["rapprochement_ok"]
            tag = "ok" if ro is True else ("ecart" if ro is False else "na")
            res = "OK" if ro is True else ("ECART" if ro is False else "N/A")
            self.tree.insert("", "end", tags=(tag,), values=(
                c["num_cuenta"], c.get("cod_categoria") or "", c.get("ind_estado") or "",
                fmt_gnf(c["sal_disponible"]), fmt_gnf(c.get("sal_disponible_middleware")),
                fmt_gnf(c.get("ecart_disponible")), fmt_gnf(c["sal_promedio"]),
                fmt_gnf(c.get("sal_promedio_middleware")), fmt_gnf(c.get("ecart_promedio")), res))
        self.tree.insert("", "end", tags=("ok" if ok else "ecart",), values=(
            "TOTAUX", "", "", fmt_gnf(data["total_solde_disponible"]),
            fmt_gnf(data["total_solde_disponible_middleware"]),
            fmt_gnf(data["ecart_total_disponible"]), "", "", fmt_gnf(data["ecart_total_moyen"]), ""))
```

### 5.4 `desktop/app/ui/main_window.py` — recherche + onglets
```python
import threading, tkinter as tk
from tkinter import ttk, messagebox
from app.api_client import ApiClient
from app.ui.reconciliation_view import ReconciliationView

class MainWindow(tk.Tk):
    def __init__(self, api: ApiClient, agent_label: str):
        super().__init__()
        self.api = api
        self.title("Rapprochement Solde — CRG")
        self.geometry("1100x650")

        top = ttk.Frame(self, padding=8); top.pack(fill="x")
        ttk.Label(top, text=f"Agent : {agent_label}").pack(side="right")
        ttk.Label(top, text="Code client (≥ 11) :").pack(side="left")
        self.var = tk.StringVar()
        self.entry = ttk.Entry(top, textvariable=self.var, width=28)
        self.entry.pack(side="left", padx=6)
        ttk.Button(top, text="Rechercher", command=self.search).pack(side="left")
        self.var.trace_add("write", self._debounce)   # auto-recherche

        nb = ttk.Notebook(self); nb.pack(fill="both", expand=True)
        self.recon = ReconciliationView(nb); nb.add(self.recon, text="Rapprochement Soldes")

        self._after = None

    def _debounce(self, *_):
        if self._after: self.after_cancel(self._after)
        if len(self.var.get().strip()) >= 11:
            self._after = self.after(500, self.search)

    def search(self):
        code = self.var.get().strip()
        if len(code) < 11:
            return
        def work():
            try:
                data = self.api.fiche_solde(code)
                self.after(0, lambda: self.recon.render(data))
            except Exception as e:
                self.after(0, lambda: messagebox.showerror("Erreur", str(e)))
        threading.Thread(target=work, daemon=True).start()
```

### 5.5 `desktop/app/config.py`
```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    oidc_discovery: str
    oidc_client_id: str
    oidc_redirect_uri: str = "http://127.0.0.1:8765/callback"
    oidc_scopes: str = "openid profile email agent_profile"
    backend_base_url: str = "http://127.0.0.1:8000"

settings = Settings()
```

### 5.6 `desktop/app/main.py` — login OBLIGATOIRE puis fenêtre
```python
from jose import jwt
from app.auth.oidc_desktop import login
from app.api_client import ApiClient
from app.ui.main_window import MainWindow

def run():
    tokens = login()                       # ouvre le navigateur, login agent CRG
    claims = jwt.get_unverified_claims(tokens["id_token"])  # affichage seulement; le backend RE-valide la signature
    label = f"{claims.get('name','')} ({claims.get('agent_id','')}) - {claims.get('role','')}"
    api = ApiClient(tokens["access_token"])
    MainWindow(api, label).mainloop()

if __name__ == "__main__":
    run()
```

> ⚠️ Le desktop affiche les claims sans vérifier la signature (UI seulement). **C'est le
> backend qui fait foi** : il revalide la signature RS256 et le rôle sur chaque appel.

---

## 6. Run configurations PyCharm

1. **Backend** : *Run → Edit Configurations → + → Python*
   - *Module name* : `uvicorn` · *Parameters* : `app.main:app --reload --port 8000`
   - *Working directory* : `…/backend` · *Environment* : `EnvFile` = `.env` (plugin EnvFile) ou variables
2. **Desktop** : *+ → Python*
   - *Script path* : `desktop/app/main.py` · *Working directory* : `…/desktop`

Lancer d'abord **Backend**, puis **Desktop**.

---

## 7. Tester

1. `GET http://127.0.0.1:8000/health` → `{"status":"ok"}`.
2. Sans token : `GET /api/fiche-signaletique-with-solde/XXXXXXXXXXX` → **401**.
3. Lancer le desktop → navigateur → login agent (rôle AGENT_CREDIT/RA/DA/DR) → fenêtre s'ouvre.
4. Saisir un code client (≥ 11) → identité + comptes + écarts colorés (vert=0, rouge≠0) + TOTAUX.
5. Couper la base Production → fallback middleware sans crash.

---

## 8. Packaging Windows
```bash
cd desktop
pyinstaller --noconsole --onefile app/main.py -n RapprochementSolde
# dist/RapprochementSolde.exe  (déployer avec un .env à côté, sans secrets de base)
```

---

## 9. Sécurité — rappels
- Le `.env` **backend** (identifiants des bases) ne va **jamais** sur les postes ni dans git.
- Le desktop ne contient **aucun secret** (client public PKCE).
- Ne jamais désactiver la vérif de signature RS256 côté backend.
- Journaliser `agent_id` + code client consulté (audit), jamais les tokens.
```
