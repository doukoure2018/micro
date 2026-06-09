# agriculteurservice — API AgriPilot (intégration KUMY)

API REST d'agrégation du **périmètre agricole** (données SAF2000 / BDCRG), exposée à
AgriPilot. **Lecture seule**, contrat stable en français, indépendant des noms internes SAF.

## Architecture

```
AgriPilot (KUMY)
   │  HTTPS + JWT (rôle AGRIPILOT)
   ▼
gateway:8000  ──/agriculteurs/**──►  agriculteurservice:8088
                                         │  Feign + X-API-Key
                                         ▼
                                     ebanking:8081  /ebanking/agri/**
                                         │  JDBC
                                         ▼
                                     SQL Server BDCRG (SAF2000)
```

`agriculteurservice` n'a **pas de base de données** : il agrège ebanking via Feign et
traduit les codes SAF en libellés français.

## Authentification

- **JWT Bearer** obtenu auprès du serveur d'autorisation, contenant le rôle **`AGRIPILOT`**
  (claim `authorities` incluant `ROLE_AGRIPILOT`).
- En-tête : `Authorization: Bearer <jwt>`
- Sans token → **401** ; rôle insuffisant → **403**.

```
GET /agriculteurs/agencies HTTP/1.1
Host: <gateway>
Authorization: Bearer eyJ...
```

## Base URL

| Environnement | Base URL |
|---|---|
| Via gateway (recommandé) | `http://<host>:8000` |
| Direct (debug) | `http://<host>:8088` |

## Endpoints

| Méthode | Chemin | Description | Pagination |
|---|---|---|---|
| GET | `/agriculteurs/agencies` | Liste des agences | non |
| GET | `/agriculteurs/agencies/{agencyId}/portfolio` | Portefeuille agricole d'une agence | oui |
| GET | `/agriculteurs/farmers` | Agriculteurs (clients ayant un crédit agricole) | oui |
| GET | `/agriculteurs/farmers/{clientId}` | Détail d'un agriculteur | non |
| GET | `/agriculteurs/farmers/{clientId}/credits` | Crédits agricoles d'un agriculteur | non |
| GET | `/agriculteurs/credits/{creditId}` | Détail d'un crédit agricole | non |
| GET | `/agriculteurs/cooperatives` | Coopératives / groupements | oui |
| GET | `/agriculteurs/cooperatives/{groupId}` | Détail d'une coopérative | non |
| GET | `/agriculteurs/cooperatives/{groupId}/members` | Membres d'une coopérative | oui |

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
| 401 | JWT absent / invalide |
| 403 | Rôle insuffisant (AGRIPILOT requis) |
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
  (variables `baseUrl`, `token`, `agencyId`, `clientId`, `creditId`, `groupId`)
- Requêtes REST Client : [`docs/agriculteurs.http`](docs/agriculteurs.http)

## Notes d'exploitation
- Variable d'environnement requise : **`EBANKING_AGRI_API_KEY`** (clé API interne vers
  ebanking — doit être identique à `AGRIPILOT_API_KEY` côté ebanking).
- Port : `8088`. Health : `/actuator/health`.
