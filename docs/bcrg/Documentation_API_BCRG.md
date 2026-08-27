# API de déclaration réglementaire — Centrale des Risques BCRG

**Crédit Rural de Guinée S.A. — Documentation technique d'intégration**

*Version 1.7 — 27 août 2026 (v1.1 contrat complet PP/PM · v1.2 extraction incrémentale + notifications · v1.3 refonte Engagements/Encours · v1.4 retours PP V2 : état civil réel, référentiel pays, NIN, API par liste d'identifiants et API des personnes modifiées · v1.5 PM V2 : VilleSiegeSocial et CommuneAdresse depuis les référentiels géographiques SAF, RCCM depuis les pièces du client moral · v1.6 correctifs des retours de validation du 20/08/2026 : ND retiré des champs typés, référence d'engagement composite, périodicité dérivée, circuit ordonné · v1.7 : API personnes morales par ids + variantes POST des /par-ids, ids dans le corps de requête)*

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
| Méthodes | `GET` (extraction, lecture seule) et `POST`/`DELETE` sur `/bcrg/traitements` (notification des données traitées, voir § 3.6) |
| Authentification | Clé API via en-tête HTTP `X-API-Key` |
| Pagination | Paramètres `page` (défaut 0) et `size` (défaut 20, **maximum 100**) |
| Dates | Format BCRG `JJMMAAAA` sur tous les modules (M1, M2, M4) ; taux et pourcentages au format `NN.NN` |
| Montants | Nombres décimaux, devise indiquée par le champ `codDev` (GNF sauf mention contraire) |

### 2.0 Politique de complétude (révision 1.1)

Conformément aux retours de la BCRG, **tous les champs du modèle de déclaration sont
désormais présents** dans les réponses des modules M1, selon la règle suivante :

| Cas | Valeur émise |
|---|---|
| Information **non portée par le SI du CRG** (aucune source SAF2000) — champ **texte libre** | `"ND"` |
| Information non portée par le SI — champ **typé** (date, montant, taux, téléphone, référentiel) | `null` — **révision 1.6** : la validation de la plateforme contrôle la syntaxe avant l'obligation, `"ND"` y déclenchait SYN001/SYN003/SYN004 |
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

### 2.3 Extraction incrémentale (v1.2)

Les modules **M1 (PP/PM) et M2 (engagements)** ne renvoient plus, par défaut, que les
**données non encore traitées** par la plateforme BCRG :

- après intégration d'un lot, la plateforme **notifie les références traitées** via
  `POST /bcrg/traitements` (§ 3.6) ; ces références disparaissent des extractions suivantes ;
- paramètre `statut` sur `/personnes-physiques`, `/personnes-morales`, `/engagements` :
  `restantes` (défaut) ou `toutes` (extraction complète, comportement historique) ;
- **usage recommandé** : requêter `page=0`, intégrer, notifier les références traitées,
  puis requêter à nouveau `page=0` — jusqu'à ce que la liste soit vide ;
- en mode `restantes`, `totalElements` est une **estimation** (total SAF − références
  notifiées) ; `hasNext` reflète le parcours réel ;
- le module **M4 (encours)** reste une photo complète de la période d'arrêté (la
  notion de « déjà traité » ne s'y applique pas).

### 2.4 Correctifs v1.6 — retours de validation du 20/08/2026

1. **Référence d'engagement composite** : `RefIntEng = <codAgence>-<numéroCrédit>` (ex.
   `102-540631`), identique entre M2 (engagement + bénéficiaire) et M4 (encours). Le numéro
   de crédit seul n'est pas unique entre agences — cause des rejets LOG008 sur l'encours.
   Le détail se lit désormais `GET /engagements/{codAgence}-{numéro}`.
2. **Circuit de soumission ordonné** : par défaut, `/engagements` (statut=restantes) ne sert
   que les engagements dont le **bénéficiaire a été notifié traité** (module PP ou PM), et
   `/encours` (filtre=declares, défaut) ne couvre que les **engagements notifiés traités** —
   `filtre=aucun` restitue la photo complète. Ordre : PP/PM → notification → engagements →
   notification → encours.
3. **`ND` retiré des champs typés** (§ 2.0) : `DatCreat`, `NIFP`, `RCCM`, `NIF`,
   `NumAgrement`, `DatNai`, `RevMensMoy`, `TxEffGlob`, `DatClo`, `DatPremEch`,
   `DatEmiPiece`, `PaysEmiPiece` valent `null` quand la donnée n'existe pas dans le SI.
4. **`Mobile`** : repli sur les téléphones secondaires SAF ; un numéro non conforme au
   format `+224XXXXXXXXX` après normalisation n'est plus transmis (`null`).
5. **`SecActEcon` (PM)** : obligatoire — repli transitoire `O` (services collectifs) quand
   l'activité SAF est absente ou non transcodable.
6. **`Sigle`** : tronqué à 50 caractères.
7. **`PeriodRemb`** : dérivée du plan de paiement (écart moyen entre échéances) — codes
   transitoires `01` hebdomadaire … `06` annuel, `07` échéance unique, dans l'attente du
   référentiel BCRG des périodicités.
8. **Crédits jamais décaissés** (sans date de mise en place) : **exclus du module M2**
   (22 rejets `dateMEP`) — un engagement non mis en place n'est pas déclarable.

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
| `NIN` | Numéro de la CIN biométrique (16 chiffres) si le client en possède une (type `02`), `null` sinon — convention validée en réunion du 16/08 |
| `DatCreaPart` | Date de création du client (`JJMMAAAA`) |
| `NomNaiClt` / `PrenomClt` / `NomComp` | Nom de naissance, prénom(s), nom complet |
| `NomMtlClt` | Nom marital si sexe `F` et `EtatCivil=2` (nom du conjoint SAF, `ND` si inconnu) ; `null` sinon |
| `Sexe` | `M` / `F` |
| `DatNai` | Date de naissance réelle (`JJMMAAAA`, fiche associé SAF), `ND` si non renseignée |
| `EtatCivil` | `1`..`4` (référentiel BCRG) |
| `NomPere` / `PrenomPere` / `NomNaiMere` / `PrmMre` | `ND` — filiation non portée (valeur par défaut convenue) |
| `VilleNai` | Lieu de naissance |
| `PaysNai` | Dérivé de la nationalité (référentiel pays, repli `GN`) — approximation documentée |
| `NatClt` | Référentiel `pays_nationalites` (ex. `GN`), dérivé de la nationalité SAF |
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
| `DonneeComplementaire` | NbPersCharge (personnes à charge, repli enfants), RevMensMoy (salaire de la fiche associé), DepMensMoy (`ND`), PropLoc au référentiel `P`/`L`/`A` |
| `TuteurCurateur` / `DonneesAdditionelles` | Listes vides (non portés par le SI) |
| `Employeurs` | Renseigné depuis la fiche associé (lieu de travail) quand disponible, liste vide sinon |

### 3.1 bis — Nouvelles API Personnes Physiques (v1.4)

| Requête | Description |
|---|---|
| `GET /personnes-physiques/par-ids?ids=id1,id2,...` | Personnes physiques à partir d'une liste d'identifiants internes (1 à **200** par appel) |
| `POST /personnes-physiques/par-ids` — corps `{"ids": ["id1", "id2"]}` | **v1.7 (recommandé)** : même service, identifiants dans le corps de la requête — évite les limites de longueur d'URL sur les gros lots. Le GET reste disponible |
| `GET /personnes-physiques/modifiees?page=0&size=100` | Personnes **modifiées depuis leur déclaration** : à chaque notification (`POST /traitements`, module `PERSONNE_PHYSIQUE`), une empreinte du contenu déclaré est stockée ; cet endpoint compare l'empreinte actuelle à celle stockée et ne renvoie que les écarts. Après réintégration, notifier à nouveau les références pour rafraîchir l'empreinte. Parcours complet des références déclarées : extraction recommandée hors heures d'affluence |

### 3.2 Module M1 — Personnes morales

| Requête | Description |
|---|---|
| `GET /personnes-morales?page=0&size=100` | Liste paginée des personnes morales |
| `GET /personnes-morales/{idClient}` | Détail d'une personne morale par identifiant interne |
| `GET /personnes-morales/par-ids?ids=id1,id2,...` | **v1.7** : personnes morales à partir d'une liste d'identifiants internes (1 à **200** par appel) |
| `POST /personnes-morales/par-ids` — corps `{"ids": ["id1", "id2"]}` | **v1.7 (recommandé)** : même service, identifiants dans le corps de la requête |

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

### 3.3 Module M2 — Engagements (contrat v1.3)

| Requête | Description |
|---|---|
| `GET /engagements?page=0&size=100&statut=restantes` | Liste paginée des engagements (extraction incrémentale, § 2.3) |
| `GET /engagements/{refEng}` | Détail d'un engagement — référence composite `<codAgence>-<numéro>` (v1.6) |

**Champs de la réponse (retour BCRG pris en compte : `beneficiaireId/Nom`, `codActivite`, `solde` et `statut` supprimés ; l'état du contrat est porté par `Cloture`/`MotifCloture`/`DatClo`) :**

| Champ | Valeur servie par le CRG |
|---|---|
| `RefIntEng` | Référence composite `<codAgence>-<n° de crédit SAF>` (v1.6) |
| `TypEve` | `01` — engagement accordé (les demandes d'engagement ne sont pas encore déclarées) |
| `LigneParent` / `RefIntLigne` | `01` (pas de lignes mère/fils au CRG) / `null` |
| `RefDemandeEng` / `DatDem` | `null` (facultatifs) |
| `TypModif` / `EstDout` | `01` — aucune modification / `null` |
| `Cloture` | `0` en cours, `1` clôturé (dérivé de l'état SAF et du solde) |
| `MotifCloture` | Si clôturé : `01` totalement remboursé (`06` autre si annulé) |
| `DatClo` | Date de solde SAF (`JJMMAAAA`), `null` si clôturé sans date (v1.6) |
| `DatAccord` / `DateMEP` / `DatFin` / `DatPremEch` | `JJMMAAAA` — accord, mise en place, fin prévue, première échéance du plan |
| `TypEng` | Code SI transitoire — **en attente du référentiel F.9** (voir § 5) |
| `MntEng` / `MntEch` / `NbrEch` | Montant accordé, montant d'échéance, nombre d'échéances |
| `MntInt` | Total des intérêts prévus (somme du plan de remboursement) |
| `CodDev` | `GNF` |
| `PeriodRemb` | Dérivée du plan de paiement (v1.6) : codes transitoires `01` hebdo, `02` quinzaine, `03` mensuel, `04` trimestriel, `05` semestriel, `06` annuel, `07` unique — **codes cibles à caler sur le référentiel des périodicités** |
| `TxIntEng` / `TypTxInt` | Taux au format `NN.NN` / `00` (taux fixe, politique CRG) |
| `TxComm` / `IndRef` / `Sprd` | `null` (pas de commission ; taux fixe) |
| `TxEffGlob` | `null` — TEG non calculé par le SI (v1.6) |
| `MoyRemb` | `01` débit de compte (convention CRG, à confirmer) |
| `TypAmo` / `TypDiffAmo` / `UnitDur` / `PerDiffAmo` | `05` échéance constante (`04` in fine si échéance unique) / `A` aucun différé / `null` / `null` |
| `MntFrais` / `MntComm` | `0` (convention) |
| `CodAgce` | Code agence SI — table transmise pour intégration au référentiel |
| `EstRachatCreance` / `ParCont` / `ValNom` / `ValCess` | `02` non / `null` / `null` / `null` |
| `DatEvent` | Date de session (`JJMMAAAA`) |
| `Beneficiaires` | **Obligatoire** : `{RefIntEng, IdIntBen, PourBenef}` — titulaire unique, `IdIntBen` = identifiant M1, `PourBenef` = `100.00` |
| `Garanties` | Liste vide (non portées par SAF — facultatif) |
| `Consolidations` | Liste vide (`TypModif` = `01`) |

### 3.4 Module M4 — Encours d'engagements (contrat v1.3)

| Requête | Description |
|---|---|
| `GET /encours?periode=AAAA-MM&page=0&size=100&filtre=declares` | Encours à la période d'arrêté indiquée — `filtre=declares` (défaut) : seuls les engagements notifiés traités ; `filtre=aucun` : photo complète. En mode filtré une page peut contenir moins de `size` éléments : se fier à `hasNext` |

Le paramètre **`periode` est obligatoire** au format `AAAA-MM`. Conformément au retour BCRG :
un encours n'est **jamais émis pour un engagement clôturé** ; sont couverts les crédits à
capital restant dû > 0 **ou** à montant non entièrement décaissé (hors bilan). Tous les
calculs (échéances, impayés, dernier paiement) sont arrêtés à la fin de la période.
`beneficiaireId/Nom`, `codAgce`, `mntEng` et `datFin` sont supprimés du contrat.

**Champs de la réponse (catégorie d'engagement `01` pour tous les crédits CRG) :**

| Champ | Valeur servie par le CRG |
|---|---|
| `RefIntEng` | Référence composite `<codAgence>-<n° de crédit SAF>`, identique au module M2 (v1.6) |
| `CodDev` | `GNF` |
| `DatEch` / `MntDerEch` | Dernière tombée d'échéance ≤ arrêté (`JJMMAAAA`) et son montant |
| `MonPai` / `DatPai` | Dernier paiement réalisé (`0`/`null` si aucun) — approximation : échéance soldée la plus récente |
| `MntHBil` | Hors bilan = montant de l'engagement non décaissé |
| `MntUtilise` | Montant décaissé |
| `MntCRDU` | Capital restant dû |
| `MntCapImp` | Capital impayé (`0` si aucun) |
| `MntTotImp` | Total des impayés = capital + intérêts des échéances échues non réglées |
| `DatDefaill` | Plus ancienne échéance impayée (`JJMMAAAA`), renseignée si `MntTotImp > 0` |
| `MntRemAnt` | `null` (facultatif, non porté) |
| `MntCreRat` / `MntPro` / `MntPerte` | `0` — régime transitoire (données comptables hors module crédit, voir § 5) |
| `MntAgi` | `null` (réservé à la catégorie `02`) |
| `NbrEchPay` / `NbrEchImp` / `NbrEchRest` | Compteurs d'échéances à l'arrêté |
| `QualiCre` | Codes transitoires dérivés du retard : `01` saine, `02` < 90 j, `03` 90-180 j, `04` > 180 j — **en attente du référentiel de classification IMF** |
| `PD` / `LGD` / `CCF` / `IFRSStage` | `null` (non produits / facultatifs) |
| `DatEvent` | Date de session (`JJMMAAAA`) |

### 3.5 Sous-objets communs (M1)

**Compte associé (`ComptesAssocies[]`)**

| Champ | Description |
|---|---|
| `IdInterneClt` | Identifiant du client titulaire |
| `CodAgce` | Agence du client |
| `NumCpt` | Numéro de compte SAF (14 positions — la règle de réduction à 10 positions est en attente d'arbitrage BCRG, voir § 5) |
| `CleRib` | `null` (consigne PP V2 du 16/08) |
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

### 3.6 Notification des données traitées (v1.2)

| Requête | Description |
|---|---|
| `POST /bcrg/traitements` | Notifie un lot de références intégrées par la plateforme BCRG (idempotent) |
| `GET /bcrg/traitements/{module}` | État du suivi : nombre de références traitées, dernière notification |
| `DELETE /bcrg/traitements/{module}/{reference}` | Retire une référence du suivi — elle réapparaît dans l'extraction `restantes` (retraitement) |

**Corps du POST :**

```json
{
  "module": "PERSONNE_PHYSIQUE",
  "references": ["10200007832", "10200007833"],
  "dateTraitement": "2026-08-12T10:30:00"
}
```

- `module` : `PERSONNE_PHYSIQUE`, `PERSONNE_MORALE` ou `ENGAGEMENT` ;
- `references` : 1 à **1000** identifiants par appel — `IdInterneClt` pour les modules M1,
  `RefIntEng` pour les engagements ;
- `dateTraitement` : facultatif (horodatage du traitement côté BCRG).

**Réponse :**

```json
{
  "module": "PERSONNE_PHYSIQUE",
  "referencesRecues": 2,
  "referencesNouvelles": 2,
  "referencesDejaConnues": 0,
  "totalTraitees": 1250
}
```

L'appel est **idempotent** : renvoyer une référence déjà notifiée ne crée pas de doublon.

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
- **Personnes morales** : `DatCreat`, `NIF`, `NIFP`, `NumAgrement` (la table `CL_PERSONAS_JURIDICAS` ne porte ni date de constitution ni identifiant fiscal). Depuis la **v1.5 (PM V2)** : `VilleSiegeSocial` = libellé de la préfecture du siège (référentiel `PA_PROVINCIAS`, renseignée pour la quasi-totalité des PM), `CommuneAdresse` = libellé du district (repli canton), et `RCCM` repris de la pièce SAF « NUMERO DU RCCM » quand elle existe (`null` sinon depuis la v1.6 — la collecte du RCCM/NIF reste un chantier du CRG, et la règle transitoire pour la donnée manquante est à arbitrer avec la BCRG) ;
- **Comptes** : `CleRib` (le CRG n'est pas un participant de type banque) ;
- **Encours** : indicateurs IFRS (`pd`, `lgd`, `ccf`, `ifrsStage`) restent à `null` ;
- **Engagements** : garanties et consolidations (différés).

**Référentiels attendus de la BCRG pour finaliser la v1.3 (M2/M4)** :

- **F.9 — types, natures et catégories d'engagements** (indispensable pour `TypEng`) ;
- **périodicités des engagements** (`PeriodRemb`) ;
- **agences** (`CodAgce`) — la table des agences du CRG est transmise pour intégration ;
- **classification des créances applicable aux IMF** (`QualiCre`) — en attendant, codes
  transitoires dérivés des jours de retard (§ 3.4).

**Conventions transitoires v1.3 à valider par la BCRG** : `MoyRemb = 01` (débit de
compte), `TypAmo = 05` (échéance constante), `TypDiffAmo = A`, `MntCreRat`/`MntPro`/
`MntPerte` à `0` (données comptables hors module crédit SAF), `MonPai` approximé par
l'échéance soldée la plus récente (les paiements partiels ne sont pas tracés
unitairement dans le plan SAF).

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

# Cycle incrémental : extraire les restantes, puis notifier les références traitées
curl -H "X-API-Key: $CLE" \
  "https://digi-creditrural-io.com/bcrg/personnes-physiques?page=0&size=100&statut=restantes"

curl -X POST -H "X-API-Key: $CLE" -H "Content-Type: application/json" \
  -d '{"module":"PERSONNE_PHYSIQUE","references":["10200007832","10200007833"]}' \
  "https://digi-creditrural-io.com/bcrg/traitements"

# Extraction complète (comportement historique)
curl -H "X-API-Key: $CLE" \
  "https://digi-creditrural-io.com/bcrg/personnes-physiques?page=0&size=100&statut=toutes"
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
