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
| GET | `/agriculteurs/farmers/{clientId}/identite` | **Identité et contacts d'un membre** : nom, prénom, type de personne, agence, téléphones et adresses | non |
| GET | `/agriculteurs/farmers/{clientId}/comptes` | **Comptes du membre** : compte de crédit (`CC008`) et compte de remboursement (`CC014`) avec leurs soldes, **plus les crédits en cours et leurs prochaines échéances** | non |
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
| GET | `/agriculteurs/structure/perimetre` | **Périmètre de toute la structure** (même forme, niveau `NATIONAL`, sans agent) — administration/maintenance AgriScore | non |

### Identité et contacts d'un membre

`GET /agriculteurs/farmers/{clientId}/identite` renvoie l'identité du membre et ses moyens de
contact. Le nom complet et les trois numéros viennent de la fiche client du core banking ; le
**nom et le prénom séparés** de la fiche personne physique, quand le membre en est une. Une
personne morale porte à la place sa raison sociale.

Le champ `telephones` ne contient que les numéros réellement renseignés, dans l'ordre principal,
secondaire, autre. Quand il est vide, `sansTelephone` vaut `true` : le membre est injoignable,
ce qui est l'information utile pour une campagne de rappel.

Un membre introuvable ne provoque pas d'erreur : la réponse porte le message « Membre introuvable ».

```json
{
  "codeMembre": "0322000202659",
  "nomComplet": "DIALLO MAMADOU SALIOU",
  "nom": "DIALLO",
  "prenom": "MAMADOU SALIOU",
  "typePersonne": "Personne physique",
  "sexe": "M",
  "nationalite": "GUINEENNE",
  "profession": "AGRICULTEUR",
  "codeAgence": "322",
  "libelleAgence": "COYAH",
  "dateAdhesion": "2024-03-12",
  "telephonePrincipal": "622451230",
  "telephoneSecondaire": null,
  "telephoneAutre": null,
  "telephones": ["622451230"],
  "sansTelephone": false,
  "adresses": [
    { "type": "1", "detail": "Quartier Kagbelen", "province": "Kindia",
      "prefecture": "Coyah", "district": "Kagbelen" }
  ],
  "message": null
}
```

### Comptes d'un membre

`GET /agriculteurs/farmers/{clientId}/comptes` renvoie les deux comptes qui portent la vie d'un
crédit chez le Crédit Rural :

| Produit | Type renvoyé | Rôle |
|---|---|---|
| `CC008` | `CREDIT` | Compte sur lequel le montant du crédit a été déboursé |
| `CC014` | `REMBOURSEMENT` | Compte alimenté par le membre, sur lequel SAF prélève les échéances |

Le numéro de compte se lit en trois blocs : **trois chiffres d'agence, trois de produit, huit de
séquence**. Ainsi `32200800202659` est le compte de crédit de l'agence 322 et `32201400202660`
le compte de remboursement du même membre.

Quand le membre n'a aucun de ces deux comptes, la réponse reste un **200** avec une liste vide et
le message « Compte non disponible » ; ce n'est pas une erreur.

```json
{
  "codeMembre": "0322000202659",
  "nomMembre": "DIALLO MAMADOU SALIOU",
  "comptes": [
    { "numeroCompte": "32200800202659", "type": "CREDIT", "produit": "CC008",
      "codeAgence": "322", "libelleAgence": "COYAH", "devise": "4", "statut": "Actif",
      "dateOuverture": "2026-09-23", "dernierMouvement": "2026-09-23",
      "soldeDisponible": 0, "soldeReserve": 0, "soldeBloque": 0 },
    { "numeroCompte": "32201400202660", "type": "REMBOURSEMENT", "produit": "CC014",
      "codeAgence": "322", "libelleAgence": "COYAH", "devise": "4", "statut": "Actif",
      "dateOuverture": "2026-09-23", "dernierMouvement": "2026-09-28",
      "soldeDisponible": 250000, "soldeReserve": 0, "soldeBloque": 0 }
  ],
  "message": null
}
```

### Crédits en cours et prochaines échéances

La même réponse porte, sous `creditsEnCours`, les crédits du membre encore en remboursement
(états SAF `D` décaissé et `J` contentieux) et, pour chacun, ses **cinq premières échéances
restant à payer**, les plus proches d'abord. Une échéance déjà soldée n'apparaît pas.

| Champ | Sens |
|---|---|
| `capitalRestantDu` | capital restant dû sur le crédit |
| `compteRemboursement` | compte `CC014` sur lequel SAF prélève les échéances |
| `prochainesEcheances[].etat` | `A_ECHOIR` si la date est à venir, `IMPAYEE` si elle est passée |
| `prochainesEcheances[].resteAPayer` | solde restant dû sur cette échéance |
| `nbEcheancesRestantes` | nombre total d'échéances non soldées, au-delà de celles listées |
| `resteTotalAPayer` | somme des soldes restant dus sur tout le plan |

```json
"creditsEnCours": [
  {
    "numeroCredit": 541437,
    "libelleTypeCredit": "CREDIT AGRICOLE",
    "montantAccorde": 5000000,
    "capitalRestantDu": 4250000,
    "montantEcheance": 1480000,
    "dateOuverture": "2026-09-23",
    "dateEcheanceFinale": "2027-03-22",
    "statut": "En cours de remboursement",
    "compteRemboursement": "32201400202660",
    "prochainesEcheances": [
      { "numeroEcheance": 1, "dateEcheance": "2026-10-22", "montant": 1480000,
        "capital": 1000000, "interets": 480000, "resteAPayer": 1480000,
        "etat": "A_ECHOIR", "joursRetard": 0 }
    ],
    "nbEcheancesRestantes": 5,
    "resteTotalAPayer": 7400000
  }
]
```

Les codes produits et le nombre d'échéances servies sont **paramétrables** côté service bancaire
(`agri.comptes.produit-credit`, `agri.comptes.produit-remboursement`, `agri.comptes.nb-echeances`) :
si le core banking retenait d'autres codes, il suffit de les changer en configuration.

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

#### Périmètre de toute la structure (administration)

`GET /agriculteurs/structure/perimetre`, sans paramètre, renvoie **exactement la même forme** que
le périmètre d'un agent de niveau `NATIONAL` : toutes les délégations → agences → points de service.
Destiné à l'administration et à la maintenance d'AgriScore (un administrateur peut se placer sur
n'importe quel point de service pour analyser un incident). Champs d'en-tête fixes :
`"agentId": null`, `"role": "STRUCTURE"`, `"active": true`, `"perimetre.niveau": "NATIONAL"`.
Erreurs : `401` clé absente ou invalide uniquement.

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
