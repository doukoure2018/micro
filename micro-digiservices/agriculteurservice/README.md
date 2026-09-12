# agriculteurservice — API AgriPilot (intégration KUMY)

API REST d'agrégation du **périmètre agricole** (données SAF2000 / BDCRG), exposée à
AgriPilot. **Lecture seule**, contrat stable en français, indépendant des noms internes SAF.

## Architecture

```
AgriPilot (KUMY)
   │  HTTPS + X-API-Key (cle publique)
   ▼
nginx  ──/agriculteurs/**──►  agriculteurservice:8088   (location dediee, bypass du gateway)
                                  │  Feign + X-API-Key (cle interne)
                                  ▼
                              ebanking:8081  /ebanking/agri/**
                                  │  JDBC
                                  ▼
                              SQL Server BDCRG (SAF2000)
```

`agriculteurservice` n'a **pas de base de données** : il agrège ebanking via Feign et
traduit les codes SAF en libellés français.

## Authentification

- **Clé API** dans le header **`X-API-Key`**, comparée à `AGRIPILOT_PUBLIC_API_KEY`
  (clé **publique**, distincte de la clé interne agriculteurservice→ebanking).
- Sans clé / clé invalide → **401**.

```
GET /agriculteurs/agencies HTTP/1.1
Host: digi-creditrural-io.com
X-API-Key: <cle-publique>
```

> Deux clés distinctes : `AGRIPILOT_PUBLIC_API_KEY` (KUMY → agriculteurservice) et
> `AGRIPILOT_API_KEY` / `EBANKING_AGRI_API_KEY` (agriculteurservice → ebanking).
> Rotation indépendante.

## Base URL

| Environnement | Base URL |
|---|---|
| Public (nginx, recommandé) | `https://digi-creditrural-io.com` |
| Direct (debug, sur le serveur) | `http://<host>:8088` |

## Endpoints

| Méthode | Chemin | Description | Pagination |
|---|---|---|---|
| GET | `/agriculteurs/agencies` | Liste des agences SAF | non |
| GET | `/agriculteurs/agencies/{agencyId}/portfolio` | Portefeuille agricole d'une agence SAF | oui |
| GET | `/agriculteurs/farmers` | Agriculteurs (clients ayant un crédit agricole) | oui |
| GET | `/agriculteurs/farmers/{clientId}` | Détail d'un agriculteur | non |
| GET | `/agriculteurs/farmers/{clientId}/credits` | Crédits agricoles d'un agriculteur | non |
| GET | `/agriculteurs/credits/{creditId}` | Détail d'un crédit agricole | non |
| GET | `/agriculteurs/credits/{creditId}/repayment-schedule` | Échéancier d'un crédit (statut `pending`/`paid`/`late`/`missed`, jours de retard) | non |
| GET | `/agriculteurs/cooperatives` | Coopératives / groupements | oui |
| GET | `/agriculteurs/cooperatives/{groupId}` | Détail d'une coopérative | non |
| GET | `/agriculteurs/cooperatives/{groupId}/members` | Membres d'une coopérative | oui |
| GET | `/agriculteurs/structure/delegations` | Délégations (« régions ») du réseau CRG | non |
| GET | `/agriculteurs/structure/delegations/{delegationId}/agences` | Agences CRG d'une délégation | non |
| GET | `/agriculteurs/structure/agences/{agenceId}/points-de-vente` | Points de service d'une agence | non |
| GET | `/agriculteurs/structure/delegations/{delegationId}/points-de-vente` | Points de service d'une délégation | non |
| GET | `/agriculteurs/agents/{agentId}/perimetre` | **Périmètre d'un agent** (ce qu'il a le droit de voir), voir ci-dessous | non |

### Périmètre d'un agent (cloisonnement)

`agentId` = claim `agent_id` du SSO (format `CR-<n>`). La réponse est **toujours de la même forme**
(délégations → agences → points de service), élaguée au niveau de l'agent :

| Rôle | `perimetre.niveau` | Contenu |
|---|---|---|
| `AGENT_CREDIT` | `POINT_DE_SERVICE` | sa délégation → son agence → son seul point de service |
| `DA`, `RA` | `AGENCE` | sa délégation → son agence → tous ses points de service |
| `DR` | `DELEGATION` | sa délégation → toutes ses agences → tous leurs points de service |
| `DE`, `DG` | `NATIONAL` | tout le réseau (5 délégations, 38 agences, 188 points de service) |
| autre | `AUCUN` | `delegations: []` (agent hors périmètre AgriScore) |

```json
{
  "agentId": "CR-39", "role": "DA", "active": true,
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

> **Clé de jointure** : `points_de_service[].code` est le code agence SAF, c'est-à-dire le
> `codeAgence` renvoyé sur chaque agriculteur (`/farmers`) et chaque crédit (`/credits`).
> Un agent voit donc les agriculteurs dont `codeAgence` ∈ codes de son périmètre.
> Fiche agent incomplète : l'agent n'est pas refusé, l'arbre contient ce qui est connu (ex. DA sans
> agence → `agences: []`). Référentiel mis en cache 5 min côté CRG. `active` suit la règle du
> contrôle de statut. Erreurs : `400` agentId mal formé, `404` agent inconnu.

### Pagination
Paramètres `page` (≥ 0, défaut 0) et `size` (1–100, défaut 20). Hors bornes → **400**.
Réponse paginée :
```json
{
  "content": [ /* ... */ ],
  "page": 0,
  "size": 20,
  "totalElements": 65371,
  "totalPages": 3269,
  "hasNext": true,
  "hasPrevious": false
}
```

### Exemples de réponses

`GET /agriculteurs/farmers/{clientId}`
```json
{
  "codeClient": "95100000001",
  "nom": "...",
  "typePersonne": "PHYSIQUE",
  "telephone": "...",
  "dateAdhesion": "2019-04-12",
  "codeAgence": "001",
  "agence": "Kankan",
  "activite": "...",
  "secteur": "Agriculture",
  "nombreCredits": 3,
  "montantTotal": 1500000.00,
  "detailsPhysique": { "prenom": "...", "nomFamille": "...", "sexe": "M", "nationalite": "...", "lieuNaissance": "...", "profession": "..." },
  "detailsMorale": null
}
```

`GET /agriculteurs/credits/{creditId}`
```json
{
  "codeAgence": "001",
  "numeroCredit": 123456,
  "codeClient": "95100000001",
  "nomClient": "...",
  "typePersonne": "PHYSIQUE",
  "typeCredit": 5,
  "libelleTypeCredit": "Credit agricole campagne",
  "codeActivite": "101",
  "montant": 2000000.00,
  "solde": 850000.00,
  "dateOuverture": "2024-01-15",
  "dateEcheance": "2024-12-15",
  "statut": "Actif",
  "hectares": 3.5,
  "planInvestissement": "...",
  "codeGroupeSollicitant": null,
  "groupeSollicitant": null,
  "codeAssociation": null,
  "association": null
}
```

## Codes d'erreur

| Code | Signification |
|---|---|
| 200 | OK |
| 400 | Paramètre invalide (pagination) |
| 401 | Clé API (`X-API-Key`) absente ou invalide |
| 404 | Ressource introuvable dans le périmètre agricole |
| 502 | Erreur amont (service de données) |
| 503 | Base de données (BDCRG) momentanément indisponible |

Corps d'erreur :
```json
{ "status": 404, "error": "Not Found", "message": "Ressource introuvable" }
```

## Documentation interactive (Swagger / OpenAPI)
- Swagger UI : `http://<host>:8088/swagger-ui.html`
- OpenAPI JSON : `http://<host>:8088/v3/api-docs`

## Outils de test fournis
- Collection Postman : [`docs/AgriPilot.postman_collection.json`](docs/AgriPilot.postman_collection.json)
  (auth `X-API-Key` ; variables `baseUrl`, `publicApiKey`, `agencyId`, `clientId`, `creditId`, `groupId`)
- Requêtes REST Client : [`docs/agriculteurs.http`](docs/agriculteurs.http)

Exemple :
```bash
curl -H "X-API-Key: <cle-publique>" https://digi-creditrural-io.com/agriculteurs/agencies
```

## Notes d'exploitation
- Variables d'environnement :
  - **`AGRIPILOT_PUBLIC_API_KEY`** — clé publique protégeant `/agriculteurs/**` (KUMY).
  - **`EBANKING_AGRI_API_KEY`** — clé interne vers ebanking (doit être identique à
    `AGRIPILOT_API_KEY` côté ebanking).
- Exposition : `location /agriculteurs/` dans nginx pointe **directement** sur
  `agriculteurservice:8088` (bypass du gateway, qui exige un JWT).
- Port : `8088`. Health : `/actuator/health`.
