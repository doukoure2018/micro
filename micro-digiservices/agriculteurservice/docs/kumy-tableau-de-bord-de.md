# Tableau de bord DE — documentation des API

**Crédit Rural de Guinée · DSIG** · à l'attention de KUMY / AgriScore
Version 1.0 — 28 octobre 2026

Réponse aux onze compléments demandés le 14 octobre pour le tableau de bord de la Direction de
l'exploitation. **Les onze points sont couverts** et en production.

---

## 1. Accès

| | |
|---|---|
| Base URL | `https://digi-creditrural-io.com/agriculteurs` |
| Authentification | en-tête `X-API-Key` sur **toutes** les routes |
| Sans clé | `401`, y compris sur une route inexistante |
| Format | JSON, UTF-8 ; dates ISO `AAAA-MM-JJ` |

### De quand datent les données

Les chiffres SAF servis par cette API viennent de la **sauvegarde restaurée chaque matin vers
07 h 15 GMT**, et non de la base de production. Un crédit mis en place ou un remboursement encaissé
aujourd'hui n'apparaît donc que demain matin.

Chaque réponse paginée porte cette information de deux façons :

- l'en-tête HTTP `X-Donnees-SAF-Au: 2026-10-28 07:45:28`
- le champ `donneesSafAu` dans le corps

> **Heure de lecture recommandée : entre 09 h et 22 h GMT.** Une lecture nocturne avant la
> restauration verrait les données de l'avant-veille.

---

## 2. Ce qui change pour vous

### 2.1 La ligne de portefeuille s'enrichit

Les champs existants sont **inchangés**. Les nouveaux s'ajoutent en fin de ligne.

```json
{
  "codeAgence": "323",
  "numeroCredit": 543013,
  "codeClient": "32300139648",
  "nomClient": "SEKOU KOULIBALY",
  "typePersonne": "PHYSIQUE",
  "typeCredit": 3,
  "libelleTypeCredit": "CREDIT COMMERCIALE SOLIDAIRE",
  "codeActivite": "101",
  "montant": 10000000.00,
  "solde": 10000000.00,
  "dateOuverture": "2026-09-15",
  "dateEcheance": "2027-03-15",
  "statut": "Decaisse",

  "filiere":        { "code": "313", "libelle": "CÉRÉALE RIZ" },
  "joursRetard":    0,
  "montantImpaye":  0,
  "enRetard":       false,
  "prochaineEcheance": { "date": "2026-12-15", "montant": 5900000.00 },
  "montantAttenduMois": 0,
  "montantPayeMois":    0,
  "codeAgent": "MLSIDIBE323",
  "nomAgent":  "MOHAMED LAMINE SIDIBE-323",
  "agentAffecte": {
    "agentId": 730, "identifiant": "MLSIDIBE", "nom": "SIDIBE MOHAMED LAMINE",
    "dateAffectation": "2026-10-22", "type": "CREDIT"
  }
}
```

**Deux agents, et c'est voulu.** `codeAgent` / `nomAgent` sont le gestionnaire déclaré **dans SAF** ;
`agentAffecte` est l'affectation tenue **dans digi** par les directeurs d'agence depuis septembre
2026 (33 101 affectations actives sur 183 points de vente). Les deux peuvent différer, et l'écart
est précisément une information de pilotage. `agentAffecte` est `null` quand aucune affectation
n'existe.

### 2.2 Périmètre par défaut : les crédits vivants

`GET /portfolio` ne rend plus que les crédits qui courent :

```
IND_ESTADO ∉ {C, T, X, I}  et  solde > 0
```

L'état `I` (apuré, passé en perte) en est exclu : il représente **5 286 crédits pour 6,66 Md GNF**
qui gonflaient l'encours sans correspondre à un portefeuille vivant. `inclureClos=true` les rend
de nouveau visibles.

---

## 3. Les routes

### 3.1 Portefeuille

#### `GET /portfolio`

Portefeuille national paginé.

| Paramètre | Défaut | Notes |
|---|---|---|
| `page` | 0 | |
| `size` | 100 | maximum **500** |
| `delegationId` | — | restreint à une délégation |
| `inclureClos` | false | inclut clôturés, transférés, annulés et apurés |

```
GET /agriculteurs/portfolio?page=0&size=500&delegationId=2
```

Réponse : `{ content: [...], page, size, totalElements, totalPages, hasNext, hasPrevious, donneesSafAu }`

> Pour un point de vente précis, utiliser `GET /agencies/{codeAgence}/portfolio`
> (**plafonné à 100 par page**, contrairement à la route nationale).

#### `GET /agencies/{codeAgence}/agents` — point 8

Agents de crédit rattachés à un point de vente, avec leur charge.

```json
[{ "id": 854, "identifiant": "FKOULIBALY323", "matricule": null,
   "nom": "KOULIBALY FAMORO", "codeAgence": "323", "libelleAgence": "Kinieran",
   "actif": true, "creditsAffectes": 35 }]
```

- `identifiant` suit **la même convention** que le code gestionnaire SAF, **sans être garanti
  identique** : `MLSIDIBE` dans digi contre `MLSIDIBE323` dans SAF. Le rapprochement fiable passe
  par `agentAffecte.agentId`, pas par ce code.
- `matricule` n'est renseigné que pour 58 comptes sur 609 : souvent `null`.
- Un seul champ `nom` est exposé, nom de famille d'abord : les colonnes d'origine ne séparent pas
  de façon fiable le nom du prénom, et nous ne voulons pas publier une structure que les données
  ne portent pas.

#### `GET /sorties` — point 10

Crédits sortis du portefeuille entre deux dates.

| Paramètre | Obligatoire | Notes |
|---|---|---|
| `debut`, `fin` | **oui** | `AAAA-MM-JJ`, bornes **incluses** |
| `delegationId`, `codeAgence` | non | `codeAgence` l'emporte sur `delegationId` |
| `page`, `size` | non | maximum 500 |

```json
{ "codeAgence": "352", "numeroCredit": 545430, "nomClient": "MOUSSA TRAORE",
  "libelleTypeCredit": "CREDIT AGRICOLE SOLIDAIRE RENTE",
  "filiere": { "code": "313", "libelle": "CÉRÉALE RIZ" },
  "montant": 16500000.00, "solde": 0.00,
  "dateOuverture": "2026-09-30", "dateSortie": "2026-10-27",
  "statut": "Cloture", "codeAgent": "NDOUMBOUYA352", "nomAgent": "NAGNOUMA DOUMBOUYA-352" }
```

> ⚠️ **Limite à connaître.** SAF ne date que les crédits **clôturés**, et seulement une partie :
> **56 151 clôtures datées contre 45 485 sans date** au 28/10/2026. Les crédits **apurés** (5 694)
> et les **transferts** (34) n'ont **jamais** de date de sortie. Une route bornée par dates ne peut
> donc rendre que les clôtures datées — ce qui répond à « les sorties du mois », mais ne constitue
> pas l'exhaustivité des sorties. Les apurés restent consultables via `inclureClos=true`.

### 3.2 Demandes de crédit — point 9

#### `GET /demandes`

Les dossiers saisis dans digi (9 849 depuis décembre 2025).

| Paramètre | Défaut | Valeurs |
|---|---|---|
| `page` / `size` | 0 / 100 | maximum 500 |
| `depuis` | — | `AAAA-MM-JJ`, date de création minimale |
| `delegationId`, `codeAgence` | — | |
| `etape` | — | `RECU`, `EN_INSTRUCTION`, `ACCORDE`, `REFUSE`, `ANNULE` |

```json
{ "numeroDossier": 9901, "nomClient": "ANGELINE KAMANO", "numeroMembre": "81800377562",
  "typeClient": "PHYSIQUE", "montantDemande": 3000000.00, "montantPropose": null,
  "dureeMois": 12, "typeCredit": 3, "objetCredit": "Fond de roulement",
  "etape": "ACCORDE", "etatDetaille": "VALIDATED_FINAL",
  "dateCreation": "2026-10-27", "dateDecision": "2026-10-28",
  "sourceDateDecision": "JOURNAL",
  "delegationId": 5, "agenceId": 4, "codeAgence": "818",
  "agentId": 349, "nomAgent": "GROVOGUI PASCAL" }
```

**Répartition au 28/10/2026** : accordé 6 971 · en instruction 2 269 · reçu 361 · refusé 237 ·
annulé 11.

- Le circuit interne compte seize états ; ils sont ramenés aux cinq étapes ci-dessus, et l'état
  exact reste exposé dans `etatDetaille` pour que la simplification ne perde rien.
- `sourceDateDecision` dit d'où vient la date : **`JOURNAL`** (journal horodaté des changements
  d'état, en place depuis le 19/09/2026 — fiable) ou **`DOSSIER`** (dates portées par le dossier,
  pour les demandes antérieures). Une date n'est jamais présentée comme plus sûre qu'elle n'est.
- `ANNULE` est une cinquième étape distincte : c'est un désistement du client, pas un refus de
  crédit. Les confondre fausserait le taux d'acceptation.

### 3.3 Historique mensuel — point 6

#### `GET /historique`

| Paramètre | Obligatoire | Notes |
|---|---|---|
| `debut`, `fin` | **oui** | format **`AAAA-MM`**, bornes incluses |
| `codeAgence`, `delegationId` | non | |

```json
[{ "mois": "2026-09-01", "codeAgence": "323", "libelleAgence": "Kinieran", "delegationId": 2,
   "nbCredits": 44, "encours": null, "nbPar30": 1, "encoursPar30": null,
   "nbPar90": 1, "encoursPar90": null, "montantImpaye": 6866666.66,
   "nbProduction": 1, "montantProduction": 15000000.00,
   "nbSorties": 2, "montantSorties": 9000000.00,
   "nbClosSansDate": 232, "source": "RECONSTITUTION" },
 { "mois": "2026-10-01", "...": "...", "encours": 293577937.94, "source": "PHOTO" }]
```

**Deux sources, et la différence est importante.**

| `source` | Ce que c'est | Encours |
|---|---|---|
| `PHOTO` | Mois observé par la plateforme, chaque matin | **renseigné** (le solde de SAF) |
| `RECONSTITUTION` | Mois passé, recalculé depuis l'échéancier | **`null`, délibérément** |

> #### Pourquoi l'encours passé n'est pas fourni
>
> SAF ne conserve aucune photo mensuelle : la table d'historique est une table d'**archive**, pas
> une série. L'encours n'existe donc dans SAF que comme solde **courant**.
>
> Nous avons mesuré si l'échéancier permettait de le reconstituer. Sur les 5 181 crédits agricoles
> vivants au 28/10/2026 :
>
> | Mesure | Total |
> |---|---|
> | Solde SAF (`MON_SALDO`) | **46,73 Md GNF** |
> | Capital des échéances impayées | 27,62 Md (**−41 %**) |
> | Capital restant de l'échéancier | 31,54 Md (−33 %) |
>
> Seuls **2 842 crédits sur 5 181** ont un solde égal au capital restant de leur échéancier — le
> différé étant la norme en crédit agricole. Publier cette approximation aurait donné un encours
> faux de quatre dixièmes, avec une rupture visible le jour où la photo prend le relais. Nous avons
> donc préféré un champ vide à un chiffre faux.
>
> **La série d'encours démarre en octobre 2026** et s'enrichit d'un mois chaque mois.

**Ce qui se reconstitue fidèlement**, parce que cela repose sur des dates réelles (ouverture,
échéance, règlement, clôture) : la production, les sorties datées, le PAR 30 et le PAR 90 **en
nombre de crédits**, et le montant dû non réglé.

`nbClosSansDate` est **un stock, pas un flux mensuel** : le nombre de crédits que SAF ne date pas
et qui ne peuvent donc être situés dans le temps. Il est constant d'un mois à l'autre et ne doit
pas être lu comme une sortie du mois.

**Profondeur disponible** : octobre 2025 → mois en cours, soit 13 mois, 2 355 lignes.

### 3.4 Référentiels

#### `GET /referentiels/statuts`

Les dix états SAF, avec leur sens et leur classement.

```json
[{ "code": "D", "libelle": "Decaisse", "sens": "Credit en cours, decaisse, en remboursement",
   "classement": "sain ou en retard selon joursRetard" },
 { "code": "I", "libelle": "Apure", "sens": "Credit radie ou passe en perte, solde non recouvre",
   "classement": "passe en perte" }]
```

Les états `N` (5 950 crédits) et `R` (965) sont marqués **« à classer »** : leur sens n'est
documenté nulle part chez nous, la question est posée à l'exploitation SAF.

#### `GET /referentiels/activites` — point 11

L'arbre complet : activité → sous-activités → **filières**.

```json
[{ "code": "101", "libelle": "AGRICULTURE ELEVAGE ET PECHE",
   "sousActivites": [
     { "code": "201", "libelle": "PRODUCTION VEGETALE" },
     { "code": "202", "libelle": "PRODUCTION ANIMALE" },
     { "code": "203", "libelle": "TRANSFORMATION AGRICOLE" },
     { "code": "204", "libelle": "COMMERCIALISATION AGRICOLE" }],
   "filieres": [
     { "code": "301", "libelle": "AGRUME" },
     { "code": "313", "libelle": "CÉRÉALE RIZ" },
     { "code": "345", "libelle": "ÉLEVAGE BOVIN" }]}]
```

> **La filière existe, contrairement à ce que nous indiquions le 26 octobre.** Elle correspond à la
> sous-sous-activité de SAF : 11 activités, 30 sous-activités et **109 filières distinctes**
> (229 lignes dans la table, un même code figurant sous plusieurs sous-activités), dont **53 sous
> l'activité agricole** — céréale riz,
> arachide, ananas, anacarde, palmier à huile, hévéa, maraîchage, élevage bovin et porcin, pomme de
> terre… Et elle est renseignée sur **4 955 des 4 988 crédits agricoles vivants, soit 99,3 %**.

**Deux précisions de structure :**

1. Le **niveau sous-activité n'est pas rattachable à un crédit** : la table des crédits ne porte
   pas ce code. Il figure dans le référentiel pour information, mais la ligne de portefeuille ne
   porte que la filière.
2. Un même code de filière se répète sous plusieurs sous-activités, presque toujours **avec le même
   libellé** (AGRUME figure sous 201, 203 et 204). La liste `filieres` de chaque activité est donc
   dédoublonnée. Exception mesurée : sous l'agriculture, un seul code porte deux écritures — 308,
   « CAFÉ » et « CAFE », simple différence d'accent, 35 crédits vivants concernés. Hors agriculture
   (commerce, transport), quelques codes portent de vrais libellés différents : 31 crédits vivants
   au total. Nous retenons alors le premier libellé rencontré.

**Palmarès du portefeuille vivant** (hors crédits non agricoles) :

| Code | Filière | Crédits | Encours |
|---|---|---|---|
| 340 | AUTRES CULTURES | 1 381 | 8,78 Md |
| 313 | CÉRÉALE RIZ | 1 198 | 8,61 Md |
| 336 | POMME DE TERRE | 453 | 4,99 Md |
| 345 | ÉLEVAGE BOVIN | 259 | 1,17 Md |
| 304 | ARACHIDE | 227 | 1,17 Md |
| 351 | ÉLEVAGE PORCIN | 155 | 1,57 Md |

> « AUTRES CULTURES » étant le premier poste, la Direction de l'exploitation examine s'il s'agit
> d'une habitude de saisie à redresser.

### 3.5 Objectifs — point 7

#### `GET /objectifs?annee=2026`

```json
[{ "annee": 2026, "mois": null, "codeAgence": "323", "libelleAgence": "Kinieran",
   "delegationId": 2, "indicateur": "ENCOURS", "valeur": 500000000.00 }]
```

**La route répond, la table est vide** tant que le fichier annuel de la Direction de l'exploitation
n'a pas été chargé. Gabarit attendu :

| Colonne | Contenu |
|---|---|
| `annee` | 2026, 2027… |
| `mois` | 1 à 12, ou vide pour un objectif annuel |
| cible | code SAF du point de vente **ou** identifiant de délégation |
| `indicateur` | `ENCOURS`, `PRODUCTION_MONTANT`, `PRODUCTION_NB`, `TAUX_PAR30`… |
| `valeur` | nombre |

### 3.6 Structure et périmètre (déjà en service)

| Route | Objet |
|---|---|
| `GET /structure/perimetre` | toute la structure : délégations → agences → points de vente |
| `GET /structure/delegations` | liste des délégations |
| `GET /agents/{agentId}/perimetre` | périmètre d'un agent |

Le **code de point de vente est le code SAF** : c'est la clé de jointure avec `codeAgence` du
portefeuille, des sorties, de l'historique et des agents. L'agence de digi n'a pas de code SAF —
ne pas confondre les deux niveaux.

---

## 4. Codes de réponse

| Code | Signification |
|---|---|
| `200` | succès |
| `400` | paramètre invalide (format de date, `etape` inconnue, bornes inversées, `size` hors plage) |
| `401` | clé API absente ou invalide |
| `503` | source de données momentanément indisponible — réessayer |

Un `503` survient pendant la restauration matinale de la sauvegarde (quelques dizaines de minutes
à partir de ~07 h 15 GMT) : une relecture plus tard suffit.

---

## 5. Points ouverts

| Sujet | Qui décide |
|---|---|
| Sens des états SAF `N` et `R` (6 915 crédits) | exploitation SAF |
| Codes de point de vente partagés **337** et **958** | exploitation SAF |
| Regroupement des 109 filières distinctes en familles ; cas « AUTRES CULTURES » | Direction de l'exploitation |
| Fichier annuel d'objectifs | Direction de l'exploitation |
| Heure de lecture et fraîcheur J−1 | KUMY |

---

## 6. Historique des versions

| Date | Contenu |
|---|---|
| 26/10/2026 | Points 1 à 5 : retards, échéances, portefeuille national, dictionnaire des statuts, repère de fraîcheur |
| 28/10/2026 | Points 8 et 9 : agents et affectation digi, demandes de crédit datées |
| 28/10/2026 | Points 10 et 11 : sorties du portefeuille, référentiel des activités et filières |
| 28/10/2026 | Points 6 et 7 : historique mensuel, objectifs |
