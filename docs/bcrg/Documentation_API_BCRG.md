# API de déclaration réglementaire — Centrale des Risques BCRG

**Crédit Rural de Guinée S.A. — Documentation technique d'intégration**

*Version 1.1 — 12 août 2026 (révisée suite aux retours BCRG sur les API Personne Physique et Personne Morale)*

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
| Dates | Modules M1 (PP/PM) : format BCRG `JJMMAAAA` — Modules M2/M4 : ISO 8601 `AAAA-MM-JJ` |
| Montants | Nombres décimaux, devise indiquée par le champ `codDev` (GNF sauf mention contraire) |

### 2.0 Politique de complétude (révision 1.1)

Conformément aux retours de la BCRG, **tous les champs du modèle de déclaration sont
désormais présents** dans les réponses des modules M1, selon la règle suivante :

| Cas | Valeur émise |
|---|---|
| Information **non portée par le SI du CRG** (aucune source SAF2000) | `"ND"` |
| Information **sourcée mais vide** pour le client concerné | `null` |
| Champ **conditionnel non applicable** (« doit rester vide sinon » : `NomMtlClt`, `DateDeces`, `SitBancaire`, `DateDebIB`, `DateFinIB`...) | `null` |
| Sous-objet facultatif non porté (mandataires, actionnaires, tuteurs, employeurs) | liste vide `[]` |

Les noms de champs suivent désormais **exactement** les classeurs de mapping BCRG
(`IdInterneClt`, `NomPere`, `DatCreat`, `CleRib`...).

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

**Champs de la réponse (36 champs, feuille PersonnePhysique du classeur de mapping) :**

| Champ | Valeur servie par le CRG |
|---|---|
| `IdInterneClt` | Identifiant interne du client (SAF `COD_CLIENTE`) |
| `NatDec` | `null` — géré par le middleware BCRG |
| `NatClient` | `0` = client du participant, `1` = tiers |
| `NIN` | `ND` — non porté par le SI |
| `DatCreaPart` | Date de création du client (`JJMMAAAA`) |
| `NomNaiClt` / `PrenomClt` / `NomComp` | Nom de naissance, prénom(s), nom complet |
| `NomMtlClt` | Nom marital si sexe `F` et `EtatCivil=2` (nom du conjoint SAF, `ND` si inconnu) ; `null` sinon |
| `Sexe` | `M` / `F` |
| `DatNai` | `ND` — non portée par le SI |
| `EtatCivil` | `1`..`4` (référentiel BCRG) |
| `NomPere` / `PrenomPere` / `NomNaiMere` / `PrmMre` | `ND` — filiation non portée (valeur par défaut convenue) |
| `VilleNai` | Lieu de naissance |
| `PaysNai` | `ND` — non porté |
| `NatClt` | Nationalité (code SI, transcodification pays à convenir) |
| `Resident` / `PaysRes` | `1` / `GN` — réseau exclusivement domestique |
| `Mobile` | Normalisé `+224` + 9 chiffres |
| `Email` / `CommuneAdress` / `NumSecSoc` | `null` (facultatifs, non portés) |
| `Adress` | Chaîne d'adresse (1re adresse SAF), `ND` si aucune |
| `CodePostal` | `COD_POSTAL` SAF (au niveau principal) |
| `Profession` | Libellé de profession |
| `SecActEcon` | Lettre NAEMA `A`..`Q` (transcodée) ou `null` |
| `SectInst` | `032` (Particuliers) |
| `STutelle` | `0` par défaut |
| `StatutClt` | `0` = Actif |
| `DateDeces` / `SitBancaire` / `DateDebIB` / `DateFinIB` | `null` (conditionnels ; situation bancaire réservée aux banques) |
| `ComptesAssocies` | Comptes du client (voir § 3.5) |
| `Pieces` | Pièces d'identité (voir § 3.5) |
| `DonneeComplementaire` | NbPersCharge, RevMensMoy (`ND`), DepMensMoy (`ND`), PropLoc (voir § 3.5) |
| `TuteurCurateur` / `Employeurs` / `DonneesAdditionelles` | Listes vides (non portés par le SI) |

### 3.2 Module M1 — Personnes morales

| Requête | Description |
|---|---|
| `GET /personnes-morales?page=0&size=100` | Liste paginée des personnes morales |
| `GET /personnes-morales/{idClient}` | Détail d'une personne morale par identifiant interne |

**Champs de la réponse (28 champs, feuille PersonneMorale du classeur de mapping) :**

| Champ | Valeur servie par le CRG |
|---|---|
| `IdInterneClt` | Identifiant interne du client (SAF `COD_CLIENTE`) |
| `NatDec` | `null` — géré par le middleware BCRG |
| `NatClient` | `0` = client, `1` = tiers |
| `DenomSocial` / `Sigle` | Dénomination sociale / nom commercial |
| `DatCreat` | `ND` — date de création juridique non portée par le SI |
| `Statut` | `01` = En activité (défaut ; la radiation n'est pas portée par le SI) |
| `DatCreaPart` | Date de création du client (`JJMMAAAA`) |
| `FormeJuridique` | Code du référentiel BCRG **F.7** (transcodé depuis le libellé SAF ; repli `28`) |
| `PaysSiegeSocial` / `Resident` | `GN` / `1` |
| `VilleSiegeSocial` | `ND` — seuls des codes sans libellé sont portés |
| `Mobile` | Normalisé `+224` + 9 chiffres |
| `Email` / `SiteWeb` / `CommuneAdresse` / `NumSecSoc` | `null` (facultatifs, non portés) |
| `Adress` | Chaîne d'adresse (1re adresse SAF), `ND` si aucune |
| `CodePostal` | `COD_POSTAL` SAF (au niveau principal) |
| `RCCM` / `NIF` / `NIFP` / `NumAgrement` | `ND` — non portés par le SI (régime transitoire à convenir, voir § 5) |
| `ActEcon` | Lettre NAEMA `A`..`Q` (transcodée) ou `null` |
| `SectInst` | Référentiel **F.5** : `040` (ISBL) si association, sinon `022` (Autres SNF) |
| `SitBancaire` / `DateDebIB` / `DateFinIB` | `null` (réservés aux participants de type banque) |
| `ComptesAssocies` | Comptes du client — **sans `TypCpt`** (retiré à la demande de la BCRG, voir § 3.5) |
| `Mandataires` / `MandatairesComptes` / `Actionnaires` / `DonneesAdditionelles` | Listes vides (non portés par le SI) |

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

**Compte associé (`ComptesAssocies[]`)**

| Champ | Description |
|---|---|
| `IdInterneClt` | Identifiant du client titulaire |
| `CodAgce` | Agence du client |
| `NumCpt` | Numéro de compte SAF (14 positions — la règle de réduction à 10 positions est en attente d'arbitrage BCRG, voir § 5) |
| `CleRib` | `ND` — le CRG n'est pas un participant de type banque |
| `TypCpt` | **Personnes physiques uniquement** : `01` = Compte individuel (défaut). Retiré des comptes PM |
| `StatCpt` | Référentiel BCRG : `00` Actif, `01` Bloqué, `02` Clôturé, `03` Succession, `04` Suspendu |

**Pièce d'identité (`Pieces[]`)**

| Champ | Description |
|---|---|
| `IdInterneClt` | Identifiant du client |
| `TypPiece` | Référentiel BCRG `01`..`09` (transcodé depuis le libellé SAF `CL_TIPOS_ID`) |
| `NumPiece` | Numéro de la pièce (tel que saisi dans le SI) |
| `DatEmiPiece` / `LieuEmiPiece` / `PaysEmiPiece` | `ND` — non portés par le SI |
| `FinValPiece` | Date de fin de validité (`JJMMAAAA`) |

**Données complémentaires PP (`DonneeComplementaire`)**

| Champ | Description |
|---|---|
| `NbPersCharge` | Nombre de personnes à charge (SAF `NUM_HIJOS`) |
| `RevMensMoy` / `DepMensMoy` | `ND` — non portés par le SI |
| `PropLoc` | Statut d'occupation du logement (code SAF `TENENCIA_VIVIENDA`, transcodification à convenir) |

> L'objet `adresses[]` de la version 1.0 est supprimé : conformément au retour BCRG,
> l'adresse est désormais la chaîne `Adress` au niveau principal, accompagnée de
> `CommuneAdress`/`CommuneAdresse` et `CodePostal`.

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

## 5. Champs non portés par le SI et points d'arbitrage

Depuis la version 1.1, la règle de complétude convenue est appliquée : les champs
sans source dans le SI du CRG sont émis avec la valeur **`ND`** (et non plus omis),
les champs sourcés mais vides sont émis à `null` (voir § 2.0).

**Champs émis à `ND` (aucune source SAF2000)** :

- **Personnes physiques** : `NIN`, `DatNai`, `PaysNai`, filiation (`NomPere`, `PrenomPere`, `NomNaiMere`, `PrmMre`), date/lieu/pays d'émission des pièces, `RevMensMoy`/`DepMensMoy` ;
- **Personnes morales** : `DatCreat`, `VilleSiegeSocial`, `RCCM`, `NIF`, `NIFP`, `NumAgrement` ;
- **Comptes** : `CleRib` (le CRG n'est pas un participant de type banque) ;
- **Encours** : indicateurs IFRS (`pd`, `lgd`, `ccf`, `ifrsStage`) restent à `null` ;
- **Engagements** : garanties et consolidations (différés).

**Points soumis à l'arbitrage de la BCRG** :

1. **`NumCpt` sur 10 positions** : les numéros de compte SAF comptent 14 positions ; la règle d'extraction/réduction attendue reste à préciser (en attendant, le numéro complet est transmis) ;
2. **`ND` dans les champs typés** (dates, codes de référentiels) : confirmer que le middleware l'accepte, ou préciser la valeur attendue ;
3. **`RCCM`/`NIF` obligatoires PM** : confirmer la tolérance de `ND` en régime transitoire ;
4. **Transcodifications** : les tables de correspondance appliquées (formes juridiques F.7, secteurs NAEMA, types de pièce, statuts de compte) sont établies par mots-clés sur les libellés SAF — le CRG transmettra ses tables pour validation, et intégrera les tables officielles dès réception ;
5. **`SitBancaire`/`DateDebIB`/`DateFinIB`** : réservés aux banques selon le modèle — émis à `null` par le CRG (IMF).

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
