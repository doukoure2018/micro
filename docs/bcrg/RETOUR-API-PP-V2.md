# API — Personne Physique V2

Ci-dessous notre retour par rapport à l'API de personnes physiques.

---

## 1. Données générales

| Champ | Description | Commentaire |
|---|---|---|
| `NatClt` | Nationalité du client. Doit appartenir au référentiel des pays et des nationalités. | Champ **obligatoire**. Il doit appartenir au référentiel `pays_nationalites` et prend la valeur de l'identifiant correspondant à la nationalité du client dans le référentiel. Exemple : pour la Guinée, `GN`. |
| `Adress` | Adresse. | **Obligatoire**. |
| `NIN` | Numéro d'Identification National. Actuellement obligatoire si l'une des pièces renseignées est biométrique. | Le champ est **obligatoire si le type de pièce est `2`**. |
| `DatNai` | Date de naissance. L'année de naissance doit être supérieure ou égale à `1900`. La date de naissance doit être inférieure à la date de déclaration. Format : `JJMMAAAA`. | **Obligatoire**, au format `JJMMAAAA`. |
| `PaysNai` | Pays de naissance. | **Obligatoire** — *à confirmer*. Doit appartenir au référentiel des pays et des nationalités. |
| `cleRib` | Clé RIB. | Mettre la valeur `null`. |

---

## 2. Données pièces

| Champ | Description | Commentaire |
|---|---|---|
| `NumPiece` | Numéro de la pièce d'identité. Syntaxe attendue selon le type (voir tableau ci-dessous). | Pas de contrôle syntaxique. Tenir compte de la description en fonction du type de pièce. |
| `DatEmiPiece` | Date d'émission de la pièce. Doit être inférieure ou égale à la date de déclaration. Format : `JJMMAAAA`. | **Obligatoire** — *à renseigner*. |
| `LieuEmiPiece` | Lieu (ville) d'émission de la pièce d'identité. | **Obligatoire** — *à renseigner*. |
| `PaysEmiPiece` | Code pays d'émission. Doit appartenir au référentiel des pays et des nationalités. | Champ **obligatoire**. Il doit appartenir au référentiel `pays_nationalites` et prend la valeur de l'identifiant correspondant dans le référentiel. Exemple : pour la Guinée, `GN`. |
| `FinValPiece` | Date de fin de validité de la pièce d'identité. Doit être supérieure à la date de déclaration **et** à la date d'émission. Format : `JJMMAAAA`. | **Obligatoire**. |

### Syntaxe attendue de `NumPiece` par type de pièce

| Code | Type de pièce | Syntaxe attendue |
|---|---|---|
| `01` | CIN | 7 chiffres **OU** 7 chiffres + `/` + 2 chiffres |
| `02` | CIN biométrique | 16 chiffres |
| `03` | Passeport non biométrique | 1 lettre + 8 chiffres |
| `04` | Passeport biométrique | 1 lettre + 8 chiffres |
| `05` | Carte de séjour | — |
| `06` | Carte de séjour biométrique | — |
| `07` | Extrait de naissance | 1 lettre + 15 chiffres |
| `08` | Carte militaire | — |
| `09` | Carte d'électeur | — |

---

## 3. Données complémentaires

| Champ | Description | Valeurs possibles |
|---|---|---|
| `PropLoc` | Est propriétaire / locataire. | `P` : Propriétaire<br>`L` : Locataire<br>`A` : Autre |

---

## 4. API à mettre en place

Deux APIs sont à mettre en place :

1. Un endpoint qui ramène les clients (personnes physiques) à partir d'une liste d'identifiants internes.
2. Un endpoint qui ramène uniquement les personnes ayant subi une modification après avoir été déclarées à la BCRG.
