# Mail unique — Réponse aux retours PP/PM + Notification des données traitées

> Pièce jointe à inclure : `BCRG.postman_collection.json` (collection v1.2)
> Destinataires : équipe technique plateforme BCRG (Nerhy Group)

---

**Objet : CRG — API de déclaration v1.2 : prise en compte de vos retours PP/PM et mise en place de la notification des données traitées (collection Postman jointe)**

Madame, Monsieur,

Nous espérons que vous allez bien. Faisant suite, d'une part, à vos retours détaillés
sur les API Personne Physique et Personne Morale et, d'autre part, à votre demande de
disposer d'une API de notification des données traitées, nous avons le plaisir de vous
informer que l'ensemble est **implémenté et déployé en production** sur
`https://digi-creditrural-io.com/bcrg` (version 1.2 de l'API, même clé `X-API-Key`).
Vous trouverez ci-dessous le détail des évolutions, et en pièce jointe la **collection
Postman mise à jour** prête à l'emploi.

---

## PARTIE 1 — Prise en compte de vos retours sur les API Personne Physique et Personne Morale

### 1.1 Corrections appliquées

| Votre retour | Traitement appliqué |
|---|---|
| Champs manquants (PP : `NomMtlClt`, `NomPere`, `PrenomPere`, `NomNaiMere`, `PrmMre`, `PaysNai`, `Resident`, `PaysRes`, `Email`, `CommuneAdress`, `NumSecSoc`, `STutelle`, `DateDeces`, `SitBancaire`, `DateDebIB`, `DateFinIB` — PM : `DatCreat`, `Statut`, `PaysSiegeSocial`, `VilleSiegeSocial`, `Email`, `SiteWeb`, `Resident`, `NIFP`, `NumAgrement`, `NumSecSoc`, `ActEcon`) | **Tous les champs des classeurs de mapping sont désormais présents** dans les réponses (36 champs PP, 28 champs PM), avec la règle de complétude décrite au § 1.2 |
| Objet `adresses` à remplacer par `Adress` (chaîne) + `CodePostal` au niveau principal | Fait — l'objet `adresses` est supprimé ; `Adress`, `CommuneAdress(e)` et `CodePostal` figurent au niveau principal |
| `FormeJuridique` hors référentiel | Transcodée vers le référentiel **F.7** (valeur de repli `28` « Autres sociétés de droit privé » ; nos tables de correspondance sont à votre disposition pour validation) |
| `SectInst` obligatoire | PP : `032` (Particuliers) ; PM : `040` (ISBL) pour les associations, `022` (Autres SNF) sinon |
| `SecActEcon` / `ActEcon` hors référentiel | Transcodés vers la nomenclature **NAEMA (F.4)** ; `null` en l'absence de correspondance sûre (jamais un code hors référentiel) |
| `Mobile` mal formé | Normalisé : `+224` suivi de 9 chiffres pour les numéros locaux |
| `EtatCivil` invalide par moments | Restreint au référentiel `1`..`4` ; toute valeur non transcodable est émise à `null` |
| `TypPiece` hors référentiel | Transcodé vers `01`..`09` depuis le libellé de notre SI |
| `TypCpt` à supprimer (comptes PM) | Fait — les comptes PM ne portent plus `TypCpt` ; côté PP, `TypCpt` = `01` (comptes individuels) |
| `StatCpt` hors référentiel | Transcodé vers `00`..`04` (`00` Actif, `01` Bloqué, `02` Clôturé, `03` Succession, `04` Suspendu) |
| Filiation obligatoire avec `ND` par défaut | `NomPere`, `PrenomPere`, `NomNaiMere`, `PrmMre` émis à `ND` (non portés par notre SI) |
| Format des dates | `JJMMAAAA` sur l'ensemble des modules M1 |

### 1.2 Règle de complétude appliquée

- Information **non portée par notre système d'information** (SAF2000) → valeur **`ND`** ;
- Information **sourcée mais vide** pour le client concerné → **`null`** ;
- Champ **conditionnel non applicable** (« doit rester vide sinon » : `NomMtlClt` hors
  femme mariée, `DateDeces`, `SitBancaire`, `DateDebIB`, `DateFinIB`) → **`null`** ;
- Sous-objets facultatifs sans source (mandataires, actionnaires, tuteurs/curateurs,
  employeurs) → **listes vides**.

### 1.3 Points nécessitant votre arbitrage

1. **`NumCpt` sur 10 positions** : nos numéros de compte comptent 14 positions.
   Merci de préciser la règle de réduction attendue (troncature, extraction, transcodage
   RIB) ; dans l'attente, le numéro complet est transmis.
2. **`ND` dans les champs typés** (dates telles que `DatNai`/`DatCreat`, codes de
   référentiels) : merci de confirmer que votre middleware l'accepte, ou de préciser la
   convention attendue pour ces types.
3. **`RCCM` / `NIF` (obligatoires PM)** : non portés par notre SI ; nous les émettons à
   `ND` et proposons un enrichissement progressif. Merci de confirmer la tolérance en
   régime transitoire.
4. **`CleRib` et `SitBancaire`/`DateDebIB`/`DateFinIB`** : vos descriptions les réservent
   aux participants de type banque ; le CRG étant une IMF, nous émettons respectivement
   `ND` et `null`. Merci de confirmer.
5. **Tables de transcodification** : nos correspondances (formes juridiques → F.7,
   activités → NAEMA, types de pièce → 01..09, statuts de compte → 00..04) sont établies
   à partir des libellés de nos catalogues internes ; nous les tenons à votre disposition
   et intégrerons vos tables officielles dès réception.
6. **Syntaxe `NumPiece`** : les numéros sont transmis tels que saisis historiquement dans
   notre SI ; une mise en conformité syntaxique de masse relèverait d'un chantier de
   fiabilisation des données que nous proposons de planifier séparément.

---

## PARTIE 2 — Notification des données traitées & extraction incrémentale

En réponse à votre demande (« prévoir une API sur laquelle on vous notifiera les données
traitées ; actuellement votre API renvoie toujours toutes les données »), le mécanisme
suivant est **opérationnel dès à présent** :

### 2.1 Principe : le cycle « extraire → intégrer → notifier »

1. **Extraction** — vos appels habituels ne renvoient désormais, par défaut, que les
   **données non encore traitées** :
   ```
   GET /bcrg/personnes-physiques?page=0&size=100
   ```
2. **Intégration** — vous traitez le lot dans votre plateforme.
3. **Notification** — vous nous transmettez les références intégrées :
   ```
   POST /bcrg/traitements
   {
     "module": "PERSONNE_PHYSIQUE",
     "references": ["10200007832", "10200007833"],
     "dateTraitement": "2026-08-12T10:30:00"
   }
   ```
4. **Reboucler sur l'étape 1** (toujours `page=0`) : les références notifiées ont disparu
   du flux. Quand la liste revient vide, l'intégralité a été déclarée.

### 2.2 Contrat de l'API de notification

| Requête | Rôle |
|---|---|
| `POST /bcrg/traitements` | Notifier un lot de références traitées |
| `GET /bcrg/traitements/{module}` | Point de contrôle : total notifié, dernière notification |
| `DELETE /bcrg/traitements/{module}/{reference}` | Retirer une référence — elle réapparaît dans l'extraction (cas de retraitement) |

- `module` : `PERSONNE_PHYSIQUE`, `PERSONNE_MORALE` ou `ENGAGEMENT` ;
- `references` : 1 à **1000** identifiants par appel — `IdInterneClt` (modules M1) ou
  `RefIntEng` (engagements) ;
- `dateTraitement` : facultatif ;
- l'appel est **idempotent** : renvoyer une référence déjà notifiée ne crée pas de doublon
  (réponse : `referencesRecues`, `referencesNouvelles`, `referencesDejaConnues`,
  `totalTraitees`).

### 2.3 Comportement des extractions

- `statut=restantes` (**défaut**) : seules les données jamais notifiées sont renvoyées ;
- `statut=toutes` : extraction complète (comportement historique), pour une
  resynchronisation totale ;
- en mode `restantes`, `totalElements` est une estimation (total SI − références
  notifiées) ; `hasNext` reflète le parcours réel ;
- le module **M4 (encours)** reste une **photo complète** de la période d'arrêté.

### 2.4 Point à convenir ensemble

En cas de **modification ultérieure** d'un dossier déjà déclaré (changement d'état civil,
nouvelle pièce...), deux options possibles : soit vous retirez la référence (`DELETE`)
pour re-recevoir le dossier, soit nous convenons d'un flux « modifications » dédié
(`NatDec = 01`). Nous sommes à votre écoute sur la formule qui s'intègre le mieux à
votre middleware.

---

## Pièce jointe

- **`BCRG.postman_collection.json`** (v1.2) : toutes les requêtes prêtes à l'emploi —
  extractions M1/M2/M4 (`statut=restantes`/`toutes`), les trois endpoints
  `/bcrg/traitements`, et un test de sécurité. Renseigner la variable `apiKey` puis
  exécuter.

Volumétrie recommandée inchangée : `size=100`, extractions séquentielles de préférence
en dehors des heures d'affluence (avant 8h ou après 18h).

Nous restons à votre entière disposition pour toute précision technique ou pour une
séance de tests conjointe.

Bien cordialement,

**Salifou DOUCOURE**
Direction des Systèmes d'Information — Crédit Rural de Guinée S.A.
salifou.doucoure@creditruralgn.com — +224 621 09 18 95
