# API de déclaration réglementaire — Centrale des Risques BCRG

**Crédit Rural de Guinée S.A. — Documentation technique d'intégration**

*Version 1.0 — 3 août 2026*

---

## 1. Objet

Le présent document décrit l'interface de programmation (API REST) mise à disposition de la **Banque Centrale de la République de Guinée (BCRG)** par le **Crédit Rural de Guinée (CRG)** pour l'extraction automatisée des données de déclaration à la centrale des risques.

Les données exposées sont issues directement du système bancaire de production du CRG (SAF2000) et couvrent les modules suivants :

| Module | Contenu | Endpoints |
|---|---|---|
| **M1** | Personnes physiques et personnes morales (clients et tiers), avec comptes associés, pièces d'identité et adresses | `/personnes-physiques`, `/personnes-morales` |
| **M2** | Engagements (crédits) | `/engagements` |
| **M4** | Encours d'engagements à une période d'arrêté | `/encours` |

---

## 2. Informations générales

| Élément | Valeur |
|---|---|
| URL de base | `https://digi-creditrural-io.com/bcrg` |
| Protocole | HTTPS uniquement (TLS) |
| Format d'échange | JSON (UTF-8) |
| Méthode | `GET` uniquement (lecture seule) |
| Authentification | Clé API via en-tête HTTP `X-API-Key` |
| Pagination | Paramètres `page` (défaut 0) et `size` (défaut 20, **maximum 100**) |
| Dates | Format ISO 8601 : `AAAA-MM-JJ` |
| Montants | Nombres décimaux, devise indiquée par le champ `codDev` (GNF sauf mention contraire) |

### 2.1 Authentification

Chaque requête doit porter l'en-tête :

```
X-API-Key: <clé transmise par canal sécurisé séparé>
```

- La clé API **n'est jamais transmise par e-mail** ; elle est communiquée par un canal sécurisé distinct et peut être renouvelée sur demande.
- Toute requête sans clé ou avec une clé invalide reçoit une réponse `401 Unauthorized` :

```json
{ "error": "Unauthorized", "message": "Cle API manquante ou invalide" }
```

### 2.2 Pagination

Toutes les listes renvoient une enveloppe de pagination :

```json
{
  "content": [ ... ],
  "page": 0,
  "size": 20,
  "totalElements": 12345,
  "totalPages": 618,
  "hasNext": true,
  "hasPrevious": false
}
```

Pour une extraction complète, itérer sur `page` de `0` à `totalPages - 1` tant que `hasNext` est vrai.

---

## 3. Endpoints

### 3.1 Module M1 — Personnes physiques

| Requête | Description |
|---|---|
| `GET /personnes-physiques?page=0&size=100` | Liste paginée des personnes physiques |
| `GET /personnes-physiques/{idClient}` | Détail d'une personne physique par identifiant interne |

**Champs de la réponse :**

| Champ | Type | Description |
|---|---|---|
| `idInterneClt` | texte | Identifiant interne du client chez le participant |
| `natClient` | texte | Nature du client : `0` = client du participant, `1` = tiers |
| `nin` | texte | Numéro d'identification national — *non porté par le SI actuel, `null` (voir § 5)* |
| `datCreaPart` | date | Date de création du client chez le participant |
| `nomNaiClt` | texte | Nom de naissance |
| `prenomClt` | texte | Prénom(s) |
| `nomComp` | texte | Nom complet |
| `sexe` | texte | `M` / `F` |
| `etatCivil` | texte | `1` = Célibataire, `2` = Marié(e), `3` = Divorcé(e), `4` = Veuf(ve) |
| `villeNai` | texte | Lieu de naissance |
| `natClt` | texte | Nationalité |
| `mobile` | texte | Téléphone principal |
| `profession` | texte | Profession (libellé) |
| `secActEcon` / `secActEconLibelle` | texte | Code et libellé du secteur d'activité économique |
| `sectInst` | texte | Secteur institutionnel — `032` (Particuliers) par défaut |
| `statutClt` | texte | `0` = Actif (défaut) |
| `codAgce` / `agenceLibele` | texte | Code et libellé de l'agence de rattachement |
| `comptesAssocies` | liste | Comptes du client (voir § 3.5) |
| `pieces` | liste | Pièces d'identité (voir § 3.5) |
| `adresses` | liste | Adresses (voir § 3.5) |

### 3.2 Module M1 — Personnes morales

| Requête | Description |
|---|---|
| `GET /personnes-morales?page=0&size=100` | Liste paginée des personnes morales |
| `GET /personnes-morales/{idClient}` | Détail d'une personne morale par identifiant interne |

**Champs de la réponse :**

| Champ | Type | Description |
|---|---|---|
| `idInterneClt` | texte | Identifiant interne du client |
| `natClient` | texte | `0` = client, `1` = tiers |
| `denomSocial` | texte | Dénomination sociale |
| `sigle` | texte | Sigle / nom commercial |
| `formeJuridique` | texte | Forme juridique (code SI en attendant l'alignement sur le référentiel BCRG, voir § 5) |
| `datCreaPart` | date | Date de création du client chez le participant |
| `mobile` | texte | Téléphone principal |
| `actEcon` / `actEconLibelle` | texte | Code et libellé de l'activité économique |
| `rccm` | texte | RCCM — *non porté par le SI actuel, `null` (voir § 5)* |
| `nif` | texte | NIF — *non porté par le SI actuel, `null` (voir § 5)* |
| `sectInst` | texte | Secteur institutionnel — *en cours d'arbitrage, `null`* |
| `codAgce` / `agenceLibele` | texte | Code et libellé de l'agence |
| `comptesAssocies`, `pieces`, `adresses` | listes | Voir § 3.5 |

### 3.3 Module M2 — Engagements

| Requête | Description |
|---|---|
| `GET /engagements?page=0&size=100` | Liste paginée des engagements (tous statuts) |
| `GET /engagements/{refEng}` | Détail d'un engagement par référence interne |

**Champs de la réponse :**

| Champ | Type | Description |
|---|---|---|
| `refIntEng` | texte | Référence interne de l'engagement |
| `beneficiaireId` / `beneficiaireNom` | texte | Identifiant interne et nom du bénéficiaire (joignable aux modules M1) |
| `typEng` | texte | Type d'engagement (code SI) |
| `mntEng` | décimal | Montant accordé |
| `solde` | décimal | Solde actuel |
| `codDev` | texte | Devise |
| `txIntEng` | décimal | Taux d'intérêt |
| `mntEch` | décimal | Montant d'échéance |
| `nbrEch` | entier | Nombre d'échéances |
| `datAccord` | date | Date d'accord (ouverture) |
| `dateMEP` | date | Date de mise en place (premier déboursement) |
| `datFin` | date | Date de fin (échéance finale) |
| `statut` | texte | Actif, Décaissé, Clôturé, Terminé, Échu, Judiciaire, Annulé |
| `codAgce` | texte | Code agence |
| `codActivite` | texte | Code activité économique financée |

### 3.4 Module M4 — Encours d'engagements

| Requête | Description |
|---|---|
| `GET /encours?periode=AAAA-MM&page=0&size=100` | Encours (soldes > 0) à la période d'arrêté indiquée |

Le paramètre **`periode` est obligatoire** au format `AAAA-MM` (ex. `2026-06` pour l'arrêté de fin juin 2026). Les compteurs d'échéances (payées / impayées / restantes) et le capital impayé sont calculés par rapport à la fin de la période.

**Champs de la réponse :**

| Champ | Type | Description |
|---|---|---|
| `refIntEng` | texte | Référence interne de l'engagement |
| `beneficiaireId` / `beneficiaireNom` | texte | Bénéficiaire |
| `codDev` | texte | Devise |
| `codAgce` | texte | Code agence |
| `mntEng` | décimal | Montant initial de l'engagement |
| `mntCRDU` | décimal | Capital restant dû |
| `mntCapImp` | décimal | Capital impayé (échéances échues non réglées à la période) |
| `nbrEchPay` | entier | Nombre d'échéances payées |
| `nbrEchImp` | entier | Nombre d'échéances impayées |
| `nbrEchRest` | entier | Nombre d'échéances restantes |
| `qualiCre` | texte | Qualité du crédit (même nomenclature que `statut` M2) |
| `datFin` | date | Date de fin de l'engagement |
| `pd`, `lgd`, `ccf`, `ifrsStage` | — | Indicateurs IFRS — *non produits par le SI actuel, `null` (voir § 5)* |

### 3.5 Sous-objets communs (M1)

**Compte associé (`comptesAssocies[]`)**

| Champ | Description |
|---|---|
| `idInterneClt` | Identifiant du client titulaire |
| `codAgce` | Agence du client |
| `numCpt` | Numéro de compte |
| `typCpt` | Type de compte — *mapping vers référentiel BCRG en cours, `null`* |
| `statCpt` | Statut du compte — *mapping en cours, `null`* |

**Pièce d'identité (`pieces[]`)**

| Champ | Description |
|---|---|
| `idInterneClt` | Identifiant du client |
| `typPiece` | Type de pièce (code SI en attendant l'alignement référentiel BCRG) |
| `numPiece` | Numéro de la pièce |
| `finValPiece` | Date de fin de validité |

**Adresse (`adresses[]`)**

| Champ | Description |
|---|---|
| `typAdr` | Type d'adresse |
| `adresse` | Adresse détaillée |
| `pays` | Code pays |
| `region` | Code région/province |
| `ville` | Code ville |
| `codPost` | Code postal / district |

---

## 4. Codes de réponse et erreurs

| Code HTTP | Signification |
|---|---|
| `200 OK` | Requête traitée, données dans le corps de la réponse |
| `400 Bad Request` | Paramètre invalide (`page` < 0, `size` hors [1;100], `periode` mal formée) |
| `401 Unauthorized` | Clé API absente ou invalide |
| `404 Not Found` | Ressource introuvable (détail par identifiant inexistant) |
| `502 Bad Gateway` | Défaillance technique amont |
| `503 Service Unavailable` | Liaison avec le système bancaire momentanément indisponible — réessayer ultérieurement |

Format des erreurs (hors 401) :

```json
{ "status": 400, "error": "Bad Request", "message": "Le parametre 'size' doit etre compris entre 1 et 100" }
```

---

## 5. Champs en cours de consolidation

Certains champs du modèle de déclaration BCRG ne sont pas portés par le système d'information actuel du CRG. Ils sont exposés à `null` dans l'attente d'un arbitrage métier ou d'une source complémentaire :

- **Personnes physiques** : `nin` (numéro d'identification national), filiation (nom/prénom du père, nom de naissance de la mère), date de naissance ;
- **Personnes morales** : `rccm`, `nif`, `sectInst` (secteur institutionnel), numéro d'agrément, date de création juridique ;
- **Engagements** : garanties et consolidations ;
- **Encours** : indicateurs IFRS (`pd`, `lgd`, `ccf`, `ifrsStage`) ;
- **Comptes** : type et statut de compte au format référentiel BCRG ;
- **Nomenclatures** : la forme juridique et le type de pièce sont transmis avec les codes du SI source ; leur transcodification vers les référentiels BCRG sera finalisée dès réception des tables de correspondance officielles.

Le CRG reste à la disposition de la BCRG pour convenir de la règle de complétude attendue (valeur « ND », enrichissement progressif, etc.).

---

## 6. Exemples d'appels

```bash
# Personnes morales, page 0, 50 par page
curl -H "X-API-Key: $CLE" \
  "https://digi-creditrural-io.com/bcrg/personnes-morales?page=0&size=50"

# Détail d'un client
curl -H "X-API-Key: $CLE" \
  "https://digi-creditrural-io.com/bcrg/personnes-physiques/10200007832"

# Encours à l'arrêté de juin 2026
curl -H "X-API-Key: $CLE" \
  "https://digi-creditrural-io.com/bcrg/encours?periode=2026-06&page=0&size=100"
```

Une **collection Postman** prête à l'emploi (`BCRG.postman_collection.json`) est jointe à la présente documentation : renseigner la variable `apiKey` puis exécuter les requêtes.

---

## 7. Sécurité et bonnes pratiques

- Accès en **lecture seule**, chiffré de bout en bout (HTTPS) ;
- Clé API dédiée à la BCRG, comparée en temps constant côté serveur, révocable et renouvelable à tout moment sur simple demande ;
- Toute tentative d'accès non autorisée est journalisée (horodatage et adresse IP source) ;
- Recommandation : conserver la clé dans un coffre-fort de secrets et ne pas l'inclure dans des scripts versionnés ;
- Volumétrie : privilégier `size=100` et des extractions séquentielles ; l'API s'appuie sur la base de production, les extractions massives sont à planifier de préférence en dehors des heures d'affluence (avant 8h ou après 18h).

---

## 8. Contact

Pour toute question technique (accès, clé API, structure des données) ou fonctionnelle (règles de gestion, complétude) :

**Crédit Rural de Guinée S.A. — Direction des Systèmes d'Information**
E-mail : *(salifou.doucoure@creditruralgn.com)*
Téléphone : *(+224 621 09 18 95)*

---

*Fin du document.*
