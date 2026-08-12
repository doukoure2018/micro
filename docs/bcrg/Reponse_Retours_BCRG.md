# Réponse du CRG aux retours BCRG — API Personne Physique & Personne Morale

**Crédit Rural de Guinée S.A. — Direction des Systèmes d'Information**

*12 août 2026 — fait suite aux documents « RETOUR-API-PERSONNE-PHYSIQUE » et « RETOUR-API-PERSONNE-MORALE »*

---

Madame, Monsieur,

Nous vous remercions pour la revue détaillée de nos API de déclaration. L'ensemble
de vos remarques a été pris en compte ; la **version 1.1** de l'API est déployée et
la documentation technique mise à jour vous est transmise ci-joint.

## 1. Corrections appliquées

| Retour BCRG | Traitement |
|---|---|
| Champs manquants (PP : `NomMtlClt`, `NomPere`, `PrenomPere`, `NomNaiMere`, `PrmMre`, `PaysNai`, `Resident`, `PaysRes`, `Email`, `CommuneAdress`, `NumSecSoc`, `STutelle`, `DateDeces`, `SitBancaire`, `DateDebIB`, `DateFinIB` ; PM : `DatCreat`, `Statut`, `PaysSiegeSocial`, `VilleSiegeSocial`, `Email`, `SiteWeb`, `Resident`, `NIFP`, `NumAgrement`, `NumSecSoc`, `ActEcon`...) | **Tous les champs des classeurs de mapping sont désormais présents** dans les réponses, avec la règle de complétude du § 2 |
| Objet `adresses` à remplacer par `Adress` (chaîne) + `CodePostal` au niveau principal | Fait — l'objet `adresses` est supprimé, `Adress`/`CommuneAdress(e)`/`CodePostal` figurent au niveau principal |
| `FormeJuridique` hors référentiel | Transcodée vers le référentiel **F.7** (repli `28` « Autres sociétés de droit privé » ; table jointe pour validation, cf. § 3) |
| `SectInst` obligatoire | PP : `032` (Particuliers) ; PM : `040` (ISBL) pour les associations, `022` (Autres SNF) sinon |
| `SecActEcon`/`ActEcon` hors référentiel | Transcodés vers la nomenclature **NAEMA (F.4)** ; `null` en l'absence de correspondance sûre |
| `Mobile` mal formé | Normalisé : `+224` suivi de 9 chiffres pour les numéros locaux |
| `EtatCivil` invalide par moments | Restreint au référentiel `1`..`4` ; toute valeur SI non transcodable est émise à `null` |
| `TypPiece`/`NumPiece` hors référentiel | `TypPiece` transcodé vers `01`..`09` depuis le libellé du SI ; `NumPiece` transmis tel que saisi (cf. § 3.4) |
| `TypCpt` à supprimer (PM) | Fait — les comptes PM ne portent plus `TypCpt` ; côté PP, `TypCpt` = `01` (comptes individuels) |
| `StatCpt` hors référentiel | Transcodé vers `00`..`04` |
| Filiation obligatoire avec `ND` par défaut | `NomPere`, `PrenomPere`, `NomNaiMere`, `PrmMre` émis à `ND` (non portés par notre SI) |
| Dates | Format `JJMMAAAA` sur l'ensemble des modules M1 |

## 2. Règle de complétude appliquée

- Information **non portée par notre système d'information** (SAF2000) → valeur **`ND`** ;
- Information **sourcée mais vide** pour le client concerné → **`null`** ;
- Champ **conditionnel non applicable** (« doit rester vide sinon ») → **`null`** ;
- Sous-objets facultatifs sans source (mandataires, actionnaires, tuteurs/curateurs, employeurs) → **listes vides**.

## 3. Points nécessitant votre arbitrage

1. **`NumCpt` sur 10 positions** : nos numéros de compte comptent 14 positions.
   Merci de préciser la règle de réduction attendue (troncature, extraction,
   transcodage RIB) ; dans l'attente, le numéro complet est transmis.
2. **`ND` dans les champs typés** (dates telles que `DatNai`/`DatCreat`, codes de
   référentiels) : merci de confirmer que le middleware accepte `ND`, ou de préciser
   la convention attendue pour ces types.
3. **`RCCM` / `NIF` (obligatoires PM)** : ces identifiants ne sont pas portés par
   notre SI ; nous les émettons à `ND` et proposons un enrichissement progressif.
   Merci de confirmer la tolérance en régime transitoire.
4. **`CleRib` et `SitBancaire`/`DateDebIB`/`DateFinIB`** : vos descriptions les
   réservent aux participants de type banque ; le CRG étant une IMF, nous émettons
   respectivement `ND` et `null`. Merci de confirmer.
5. **Tables de transcodification** : nos correspondances (formes juridiques → F.7,
   activités → NAEMA, types de pièce → 01..09, statuts de compte → 00..04) sont
   établies à partir des libellés de nos catalogues internes. Nous les tenons à
   votre disposition pour validation et intégrerons les tables officielles dès
   réception.
6. **Syntaxe `NumPiece`** : les numéros sont transmis tels que saisis historiquement
   dans notre SI ; une mise en conformité syntaxique de masse (CIN 7 chiffres, etc.)
   relèverait d'un chantier de fiabilisation des données que nous proposons de
   planifier séparément.

Nous restons à votre disposition pour toute précision.

**Contact** : salifou.doucoure@creditruralgn.com — +224 621 09 18 95
