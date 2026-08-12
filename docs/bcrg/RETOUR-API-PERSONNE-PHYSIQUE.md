# API — PERSONNE PHYSIQUE

> Ci-dessous notre retour par rapport à l'API de personnes physiques.

---

## 1. Données générales

| Champs | Commentaire | Description |
|---|---|---|
| **DatCreaPart** | Ce champ est déjà présent dans votre API mais n'a pas la bonne valeur par moment. | C'est la date de création du client dans le SIB.<br>**Obligatoire** |
| **NomMtlClt** | Ce champ est manquant dans l'API. | Nom marital du client.<br>Doit être renseigné si le client est de sexe Féminin (`sexe = F`) **et** s'il est marié (`etatCivil = 2`).<br>Doit rester vide sinon. |
| **EtatCivil** | Ce champ est présent dans l'API mais il n'a pas la bonne valeur par moment. | État civil. Le champ peut prendre une des valeurs suivantes :<br>`1` : Célibataire<br>`2` : Marié(e)<br>`3` : Divorcé(e)<br>`4` : Veuf (ve) |
| **NomPere** | Ce champ est manquant dans l'API, il est obligatoire. Si vous n'avez pas l'information, merci de mettre `ND` comme valeur par défaut. | Nom du père.<br>Le champ doit obligatoirement être renseigné. En cas d'information manquante, renseigner « ND ». |
| **PrenomPere** | Ce champ est manquant dans l'API, il est obligatoire. Si vous n'avez pas l'information, merci de mettre `ND` comme valeur par défaut. | Prénom du père.<br>Le champ doit obligatoirement être renseigné. En cas d'information manquante, renseigner « ND ». |
| **NomNaiMere** | Ce champ est manquant dans l'API, il est obligatoire. Si vous n'avez pas l'information, merci de mettre `ND` comme valeur par défaut. | Nom de naissance de la mère.<br>Le champ doit obligatoirement être renseigné. En cas d'information manquante, renseigner « ND ». |
| **PrmMre** | Ce champ est manquant dans l'API, il est obligatoire. Si vous n'avez pas l'information, merci de mettre `ND` comme valeur par défaut. | Prénom de la mère.<br>Le champ doit obligatoirement être renseigné. En cas d'information manquante, renseigner « ND ». |
| **PaysNai** | Ce champ est manquant dans l'API. | Pays de naissance.<br>Doit appartenir au référentiel des pays et des nationalités. |
| **Resident** | Ce champ est manquant dans l'API. Il indique si le client est résident ou pas. | Est-ce que le client réside en République de Guinée ?<br>Ce champ peut prendre une des valeurs suivantes :<br>`0` : Non<br>`1` : Oui |
| **PaysRes** | Ce champ est manquant dans l'API. | Pays de résidence.<br>Doit appartenir au référentiel des pays et des nationalités.<br>Le pays de résidence doit être la République de Guinée si `Resident = '1'`.<br>Le pays de résidence doit être différent de la République de Guinée si `Resident = '0'`. |
| **Mobile** | Ce champ est présent dans l'API mais il n'a pas la bonne valeur par moment. Il désigne le numéro de téléphone : il doit commencer par `00224` ou `+224` suivi de 9 chiffres si c'est un numéro local. Sinon il commencera par le préfixe du pays concerné. | Numéro de téléphone.<br>Contrôle syntaxique pour les résidents en Guinée. Syntaxes acceptées :<br>`00224` suivi de 9 chiffres, ou `+224` suivi de 9 chiffres. |
| **Email** | Ce champ est manquant dans l'API mais il n'est pas obligatoire. Vous pouvez le mettre et laisser sa valeur vide. | |
| **Adress** | L'objet `adresses` dans l'API doit être remplacé par `Adresse`, une chaîne de caractères : **Obligatoire** | C'est une chaîne de caractères. |
| **CommuneAdress** | Ce champ est manquant dans l'API mais il n'est pas obligatoire. Vous pouvez le mettre et laisser sa valeur vide. | |
| **CodePostal** | Ce champ est présent mais dans l'objet `adresses`. Il faut le retirer et le mettre dans l'objet principal. Vous pouvez le mettre et laisser sa valeur vide. | |
| **SecActEcon** | Ce champ est présent dans l'API mais il n'a pas la bonne valeur. Il n'est pas obligatoire, donc si vous n'avez pas l'information vous pouvez le laisser vide. Mais le champ doit être présent dans l'API. *(voir §F.4 Référentiel des secteurs d'activités)* | Secteur d'activité économique de la profession : **facultatif**.<br>Doit appartenir au référentiel des secteurs d'activité (Nomenclature NAEMA). |
| **NumSecSoc** | Ce champ est manquant dans l'API mais il n'est pas obligatoire. Vous pouvez le mettre et laisser sa valeur vide. | Numéro de sécurité sociale. |
| **Stutelle** | Ce champ est manquant dans l'API. Vous devez le mettre et mettre sa valeur à `0` ou `1`. | Est sous tutelle / curatelle ?<br>Les valeurs possibles sont :<br>`0` : Non<br>`1` : Oui<br>Ce champ prend la valeur `1` si le client est sous tutelle ou curatelle.<br>L'IMF sera alerté si un mineur n'est pas déclaré sous tutelle. |
| **DateDeces** | Ce champ est manquant dans l'API. Vous pouvez le mettre et le laisser vide si le client est toujours en vie ; mais s'il est décédé vous devez renseigner la date de décès. | Date de décès.<br>Obligatoire si `StatutClt = '1'`.<br>La date de décès doit être antérieure à la date de la déclaration et postérieure à la date de création du client chez le participant. |
| **SitBancaire** | Ce champ est manquant dans l'API. Vous pouvez le mettre et le renseigner si l'information est disponible, ou le laisser vide sinon. | Situation bancaire du client.<br>Ce champ est obligatoire si `NatClient = "0"` (client de l'IMF). Doit rester vide sinon.<br>`0` = Information non disponible<br>`1` = Interdit bancaire<br>`2` = Annulation interdiction bancaire<br>Ce champ n'est pas autorisé pour les participants de type autre que banques. |
| **DateDebIB** | Ce champ est manquant dans l'API. Vous pouvez le mettre et le renseigner si l'information est disponible, ou le laisser vide sinon. | Date de début d'interdiction bancaire.<br>Ce champ est obligatoire si `SitBancaire = '1'`. Doit rester vide sinon.<br>La date de début de l'interdiction bancaire doit être inférieure ou égale à la date de déclaration.<br>La date de début de l'interdiction bancaire doit être strictement supérieure à la date de création du client chez le participant.<br>Format date : `JJMMAAAA`<br>Ce champ n'est pas autorisé pour les participants de type autre que banques. |
| **DateFinIB** | Ce champ est manquant dans l'API. Vous pouvez le mettre et le renseigner si l'information est disponible, ou le laisser vide sinon. | Date de fin d'interdiction bancaire.<br>Ce champ est obligatoire si `SitBancaire = '1'`. Doit rester vide sinon.<br>La date de fin de l'interdiction bancaire doit être supérieure à la date de déclaration.<br>Format date : `JJMMAAAA`<br>Ce champ n'est pas autorisé pour les participants de type autre que banques. |

### F.4 — Référentiel des secteurs d'activités

| Identifiant | Libellé |
|---|---|
| A | Agriculture, chasse et sylviculture |
| B | Pêche, pisciculture, aquaculture |
| C | Activités extractives |
| D | Activités de fabrication |
| E | Production et distribution d'électricité, de gaz et d'eau |
| F | Construction |
| G | Commerce ; réparation de véhicules automobiles et d'articles domestiques |
| H | Hôtels et restaurants |
| I | Transports, activités des auxiliaires de transport et communications |
| J | Activités financières |
| K | Immobilier, locations et services aux entreprises |
| L | Activités d'administration publique |
| M | Éducation |
| N | Activités de santé et d'action sociale |
| O | Activités à caractère collectif ou personnel |
| P | Activités des ménages en tant qu'employeurs de personnel domestique |
| Q | Activités des organisations extraterritoriales |

---

## 2. Comptes associés

| Champs | Commentaire | Description |
|---|---|---|
| **NumCpt** | Numéro de compte. Ce champ est présent dans l'API mais est sur 14 positions au lieu de 10. | Numéro de compte de la personne physique (sur 10 positions). |
| **CleRib** | Ce champ est manquant dans l'API. Vous pouvez le mettre et renseigner la bonne valeur. Il est obligatoire, il est sur 2 positions. | Clé RIB.<br>Le champ est obligatoire pour les participants de type Banque.<br>La clé RIB doit correspondre au contrôle clé RIB. |
| **TypCpt** | Ce champ est présent dans l'API mais n'a pas la bonne valeur ; les valeurs possibles sont dans la colonne Description. | Type de compte. Prend l'une des valeurs suivantes :<br>`01` : Compte individuel<br>`02` : Compte joint<br>`03` : Compte en indivision<br>`04` : Compte collectif |
| **StatCpt** | Ce champ est présent dans l'API mais n'a pas la bonne valeur ; les valeurs possibles sont dans la colonne Description. | Statut du compte. Prend l'une des valeurs suivantes :<br>`00` : Actif<br>`01` : Bloqué<br>`02` : Clôturé<br>`03` : En succession<br>`04` : Suspendu<br>Le compte associé ne peut pas être clôturé (si `NatDec = "00"` alors `StatCpt` doit être `!= "02"`). |

---

## 3. Pièces

| Champs | Commentaire | Description |
|---|---|---|
| **TypPiece** | Type de pièce d'identité. Ce champ est présent dans l'API mais n'a pas la bonne valeur ; les valeurs possibles sont dans la colonne Description. | Le champ doit prendre l'une des valeurs suivantes :<br>`01` : CIN<br>`02` : CIN biométrique<br>`03` : Passeport<br>`04` : Passeport biométrique<br>`05` : Carte de séjour<br>`06` : Carte de séjour biométrique<br>`07` : Extrait de naissance<br>`08` : Carte militaire<br>`09` : Carte d'électeur<br><br>La valeur saisie doit être cohérente avec la nationalité et la résidence du client :<br>• Nationalité guinéenne : valeurs possibles `01, 02, 03, 04, 07, 08, 09`<br>• Nationalité non guinéenne et `Resident = '0'` : valeurs possibles `03, 04`<br>• Nationalité non guinéenne et `Resident = '1'` : valeurs possibles `03, 04, 05, 06` |
| **NumPiece** | Numéro de la pièce d'identité, **obligatoire**. Ce champ est présent dans l'API mais ne respecte pas la syntaxe. | Numéro de la pièce d'identité : **Obligatoire**.<br>Syntaxe attendue :<br>`01` CIN : 7 chiffres OU 7 chiffres + `/` + 2 chiffres<br>`02` CIN biométrique : 16 chiffres<br>`03` Passeport non biométrique : 1 lettre + 8 chiffres<br>`04` Passeport biométrique : 1 lettre + 8 chiffres<br>`05` Carte de séjour<br>`06` Carte de séjour biométrique<br>`07` Extrait de naissance : 1 lettre + 15 chiffres<br>`08` Carte militaire<br>`09` Carte d'électeur : 1 lettre + 10 chiffres |
| **DatEmiPiece** | Ce champ est manquant dans l'API, il est obligatoire. | Date d'émission de la pièce d'identité.<br>La date d'émission de la pièce doit être inférieure ou égale à la date de déclaration.<br>Format date : `JJMMAAAA` |
| **LieuEmiPiece** | Ce champ est manquant dans l'API, il est obligatoire. | Lieu (ville) d'émission de la pièce d'identité : **Obligatoire**. |
| **PaysEmiPiece** | Ce champ est manquant dans l'API, il est obligatoire. | Code pays d'émission de la pièce d'identité.<br>Ce champ doit appartenir au référentiel des pays et des nationalités. |
