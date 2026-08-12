# API — PERSONNE MORALE (PM)

> Ci-dessous notre retour par rapport à l'API de personne morale.

---

## 1. Données générales

| Champs | Commentaires | Descriptions |
|---|---|---|
| **DatCreat** | Ce champ est manquant dans l'API. | Date de création de la personne morale.<br>La date de création de la PM doit être inférieure ou égale à la date de déclaration. La date de création de la PM doit être supérieure ou égale à 1900.<br>Format date : `JJMMAAAA` |
| **Statut** | Ce champ est manquant dans l'API. Il désigne le statut (`01` : en activité ou `02` : radiée) de la PM. | Statut de la PM. Ce champ peut prendre l'une des valeurs suivantes :<br>`01` : En activité<br>`02` : Radiée |
| **FormeJuridique** | Ce champ est présent dans l'API mais n'a pas la bonne valeur ; sa valeur doit appartenir au référentiel. *(voir §F.7)* | Forme juridique.<br>Ce champ doit appartenir au référentiel des formes juridiques des personnes morales. |
| **PaysSiegeSocial** | Ce champ est manquant dans l'API. Il désigne le pays de résidence / siège social et doit appartenir au référentiel des pays et des nationalités. | Pays de résidence / siège social.<br>Doit appartenir au référentiel des pays et des nationalités.<br>Ne peut prendre que la valeur correspondant à la République de Guinée si `Resident = '1'`.<br>Doit prendre une valeur différente du code de la République de Guinée si `Resident = '0'`. |
| **VilleSiegeSocial** | Ce champ est manquant dans l'API. Il désigne la ville de résidence / siège social. | Ville de résidence / siège social. |
| **Mobile** | Ce champ est présent dans l'API mais n'a pas la bonne valeur par moment. Il doit respecter la syntaxe `00224` suivi de 9 chiffres ou `+224` suivi de 9 chiffres. | Numéro de téléphone.<br>Contrôle syntaxique pour les résidents en Guinée. Syntaxes acceptées :<br>`00224` suivi de 9 chiffres ou `+224` suivi de 9 chiffres. |
| **Email** | Ce champ est manquant dans l'API ; sa valeur peut être `null` si l'information n'est pas disponible. | |
| **SiteWeb** | Ce champ est manquant dans l'API ; sa valeur peut être `null` si l'information n'est pas disponible. | |
| **Adress** | L'objet `adresses` dans l'API doit être remplacé par `Adress` qui est une chaîne de caractères : **Obligatoire** | |
| **CommuneAdresse** | Ce champ est manquant dans l'API mais il n'est pas obligatoire. Vous pouvez le mettre et laisser sa valeur vide. | |
| **CodePostal** | Ce champ est présent mais dans l'objet `adresses`. Il faut le retirer et le mettre dans l'objet principal. Aussi il faut le renommer en `CodePostal` au lieu de `codPost`. Vous pouvez le mettre et laisser sa valeur vide. | |
| **Resident** | Ce champ est manquant dans l'API. Il indique si le client est résident ou pas. | Est-ce que le client réside en République de Guinée ?<br>Ce champ peut prendre une des valeurs suivantes :<br>`0` : Non<br>`1` : Oui |
| **RCCM** | Ce champ est présent dans l'API mais n'a pas la bonne valeur. Il est **obligatoire**. Il désigne le numéro registre de commerce et de crédit mobilier. | Numéro registre de commerce et de crédit mobilier.<br>Champ obligatoire si forme juridique différente de `"33"` et `"39"` et si secteur institutionnel différent de État et organismes assimilés (`"011"`, `"012"`, `"013"`).<br>La valeur saisie doit respecter la syntaxe du RCCM.<br>Format : `CodePays.Ville.AnneeCreation.CodeResponsabilite.NNNNN`<br>Exemple : `GN.TCC.2023.A.03833`<br>Ancienne syntaxe du RCCM :<br>Format : `CodePays.CodeCommune.Annee.Lettre.NNNNNN`<br>Exemple : `GC.KAL.2017.B.079985` |
| **NIF** | Ce champ est présent dans l'API mais n'a pas la bonne valeur. Il est **obligatoire**. Il désigne le Numéro d'Immatriculation Fiscale (NIF). | Numéro d'Immatriculation Fiscale (NIF).<br>Ce champ est obligatoire si `NIFP` est non renseigné.<br>La valeur saisie doit être de type alphanumérique, de longueur 7, composée de 6 chiffres suivis d'une lettre. |
| **NIFP** | Ce champ est manquant dans l'API. Il désigne le Numéro d'Immatriculation Fiscale Permanent. | Numéro d'Immatriculation Fiscale Permanent.<br>Le NIFP sera transformé en obligatoire après une période de transition (fin 2023). |
| **NumAgrement** | Ce champ est manquant dans l'API. Il désigne le numéro de l'agrément. Il est obligatoire. | Numéro de l'agrément.<br>Ce champ est obligatoire si le RCCM n'est pas renseigné. |
| **NumSecSoc** | Ce champ est manquant dans l'API. Vous pouvez le mettre et laisser sa valeur vide car sa valeur est facultative. | Numéro de sécurité sociale : **facultatif**. |
| **ActEcon** | Ce champ est manquant dans l'API. Vous devez l'ajouter et laisser sa valeur vide si vous n'avez pas l'information ; mais si vous mettez une valeur, alors cette valeur doit appartenir au référentiel des secteurs d'activité. *(voir §F.4)* | Secteur d'activité économique de la profession : **facultatif**.<br>Doit appartenir au référentiel des secteurs d'activité (Nomenclature NAEMA). |
| **SectInst** | Ce champ est présent dans l'API mais n'a pas la bonne valeur. Il est **obligatoire**. Il désigne le secteur institutionnel et doit appartenir au référentiel des secteurs institutionnels. *(voir §F.5)* | Secteur institutionnel : **Obligatoire**.<br>Doit appartenir au référentiel des secteurs institutionnels.<br>Pour les déclarations de personnes physiques, ce champ ne peut prendre que la valeur `032` : Particuliers ou `033` : Groupes informels. |
| **SitBancaire** | Ce champ est manquant dans l'API. Vous pouvez le mettre et le renseigner si l'information est disponible ou le laisser vide sinon. | Situation bancaire du client.<br>Ce champ est obligatoire si `NatClient = "0"` (client de l'IMF). Doit rester vide sinon.<br>`0` = Information non disponible<br>`1` = Interdit bancaire<br>`2` = Annulation interdiction bancaire<br>Ce champ n'est pas autorisé pour les participants de type autre que banques. |
| **DateDebIB** | Ce champ est manquant dans l'API. Vous pouvez le mettre et le renseigner si l'information est disponible ou le laisser vide sinon. | Date de début d'interdiction bancaire.<br>Ce champ est obligatoire si `SitBancaire = '1'`. Doit rester vide sinon.<br>La date de début de l'interdiction bancaire doit être inférieure ou égale à la date de déclaration.<br>La date de début de l'interdiction bancaire doit être strictement supérieure à la date de création du client chez le participant.<br>Format date : `JJMMAAAA`<br>Ce champ n'est pas autorisé pour les participants de type autre que banques. |
| **DateFinIB** | Ce champ est manquant dans l'API. Vous pouvez le mettre et le renseigner si l'information est disponible ou le laisser vide sinon. | Date de fin d'interdiction bancaire.<br>Ce champ est obligatoire si `SitBancaire = '1'`. Doit rester vide sinon.<br>La date de fin de l'interdiction bancaire doit être supérieure à la date de déclaration.<br>Format date : `JJMMAAAA`<br>Ce champ n'est pas autorisé pour les participants de type autre que banques. |

### F.7 — Référentiel des formes juridiques des personnes morales

| Identifiant | Libellé |
|---|---|
| 00 | Société À Responsabilité Limitée Unipersonnelle |
| 01 | Entreprise Individuelle |
| 02 | Société En Nom Collectif |
| 03 | Société À Responsabilité Limitée |
| 04 | Société Anonyme |
| 05 | Société En Commandite Simple |
| 07 | Société En Participation |
| 08 | Société Civile Immobilière |
| 09 | Autre Sociétés Commerciales |
| 10 | Société Par Act Simplifiées |
| 11 | Société par Actions Simplifiée Unipersonnelle |
| 13 | Groupement Intérêt Économique |
| 14 | Ste Civ Exploitation Agricole |
| 15 | Groupement Foncier Agricole |
| 16 | Société Civ Professionnelle |
| 18 | Société D'exercice Libéral |
| 19 | Autres Sociétés Civiles |
| 21 | Société Cooper Simplifiée |
| 22 | Société Cooper Avec Conseil Administration |
| 24 | Autres Soc Coopératives |
| 25 | Société Mutuelle Assurances Ou Banque |
| 26 | Syndicat Professionnel |
| 28 | Autres Sociétés De Droit Privé |
| 30 | Ordre Professionnel |
| 31 | Autre Sociétés Droit Public |
| 32 | Société À Capital Variable |
| 33 | Association |
| 39 | État Et Ses Démembrements |

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

### F.5 — Référentiel des secteurs institutionnels

> Seuls les codes à 3 chiffres sont autorisés.

| Identifiant | Description |
|---|---|
| **01** | **État et organismes assimilés** |
| 011 | Administrations centrales |
| 012 | Administrations locales & régionales |
| 013 | Administrations de sécurité sociales |
| **02** | **Sociétés non financières (SNF)** |
| 021 | SNF publiques |
| 022 | Autres SNF |
| **03** | **Ménages** |
| 031 | Entreprises individuelles |
| 032 | Particuliers |
| 033 | Groupes informels |
| **04** | **Institutions sans but lucratif au service des ménages (ISBL)** |
| 040 | Institutions sans but lucratif au service des ménages (ISBL) |
| **05** | **Clientèle financière** |
| 051 | Assurances et caisses de retraite |
| 052 | Autres intermédiaires financiers |
| **06** | **Reste du monde** |
| 060 | Reste du monde |

---

## 2. Mandataire — *Facultatif*

| Champs | Commentaire | Description |
|---|---|---|
| **IdInterneClt** | Identifiant interne du client dans l'IMF.<br>**NB : SI UN MANDATAIRE EXISTE ALORS CETTE INFORMATION EST OBLIGATOIRE** | Identifiant interne du client dans l'IMF : c'est l'élément qui permet d'identifier le client de manière unique dans le SIB. Il sera utilisé pour retrouver ses comptes associés, ses actionnaires, ses mandataires, etc. |
| **IdInterneMdt** | Identifiant interne du mandataire dans l'IMF.<br>**NB : SI UN MANDATAIRE EXISTE ALORS CETTE INFORMATION EST OBLIGATOIRE** | Identifiant interne du mandataire dans l'IMF.<br>Le mandataire doit au préalable avoir été déclaré dans le SIC par ce participant. |
| **Qualite** | *(voir §F.8 Référentiel de la qualité des mandataires)* | Qualité du mandataire.<br>Doit appartenir au référentiel de la qualité des mandataires. |
| **DatDebMdt** | La date de début du mandat.<br>**NB : SI UN MANDATAIRE EXISTE ALORS CETTE INFORMATION EST OBLIGATOIRE** | La date de début du mandat doit être supérieure ou égale à la date de création de la personne morale.<br>La date de début du mandat doit être inférieure ou égale à la date de déclaration.<br>Format date : `JJMMAAAA` |
| **DatFinMdt** | La date de fin du mandat.<br>**NB : SI UN MANDATAIRE EXISTE ALORS CETTE INFORMATION EST OBLIGATOIRE** | La date de fin du mandat doit être supérieure ou égale à la date de la déclaration.<br>Format date : `JJMMAAAA` |

### F.8 — Référentiel de la qualité des mandataires

| Identifiant | Libellé |
|---|---|
| 01 | Président Directeur Général |
| 02 | Directeur Administratif Et Financier |
| 03 | Directeur General |
| 04 | Gérant |
| 05 | Gérant Associé |
| 06 | Directeur General Adjoint |
| 07 | Président Du Conseil d'Administration |
| 08 | Directeur Ressources Humaines |
| 09 | Directeur Commercial |
| 10 | Coordinateur |
| 11 | Chef De Projet |
| 12 | Directeur Exécutif |
| 13 | Administrateur General |
| 14 | Administrateur Directeur General |

---

## 3. Compte associé — *Obligatoire*

| Champs | Commentaire | Description |
|---|---|---|
| **NumCpt** | Numéro de compte. Ce champ est présent dans l'API mais est sur 14 positions au lieu de 10. | Numéro de compte de la personne physique (sur 10 positions). |
| **CleRib** | Ce champ est manquant dans l'API. Vous pouvez le mettre et renseigner la bonne valeur. Il est obligatoire, il est sur 2 positions. | Clé RIB.<br>Le champ est obligatoire pour les participants de type Banque.<br>La clé RIB doit correspondre au contrôle clé RIB. |
| **TypCpt** | **À SUPPRIMER** — Ce champ est présent dans l'API mais ne devrait pas l'être. | |
| **StatCpt** | Ce champ est présent dans l'API mais n'a pas la bonne valeur ; les valeurs possibles sont dans la colonne Description. | Statut du compte. Prend l'une des valeurs suivantes :<br>`00` : Actif<br>`01` : Bloqué<br>`02` : Clôturé<br>`03` : En succession<br>`04` : Suspendu<br>Le compte associé ne peut pas être clôturé (si `NatDec = "00"` alors `StatCpt` doit être `!= "02"`). |

---

## 4. Compte associé — Mandataire associé — *Facultatif*

| Champs | Commentaire | Description |
|---|---|---|
| **NumCpt** | Numéro de compte. Ce champ est présent dans l'API mais est sur 14 positions au lieu de 10. | Numéro de compte de la personne physique (sur 10 positions). |
| **CleRib** | Ce champ est manquant dans l'API. Vous pouvez le mettre et renseigner la bonne valeur. Il est obligatoire, il est sur 2 positions. | Clé RIB.<br>Le champ est obligatoire pour les participants de type Banque.<br>La clé RIB doit correspondre au contrôle clé RIB. |
| **TypCpt** | Ce champ est présent dans l'API mais ne devrait pas l'être. | |
| **StatCpt** | Ce champ est présent dans l'API mais n'a pas la bonne valeur ; les valeurs possibles sont dans la colonne Description. | Statut du compte. Prend l'une des valeurs suivantes :<br>`00` : Actif<br>`01` : Bloqué<br>`02` : Clôturé<br>`03` : En succession<br>`04` : Suspendu<br>Le compte associé ne peut pas être clôturé (si `NatDec = "00"` alors `StatCpt` doit être `!= "02"`). |
| **IdInterneClt** | Identifiant interne du client dans l'IMF : c'est l'élément qui permet d'identifier le client de manière unique dans le SI, il sera utilisé pour retrouver ses comptes associés, ses actionnaires, ses mandataires, etc.<br>**NB : SI UN MANDATAIRE EXISTE ET QU'IL A UN COMPTE ASSOCIÉ ALORS CETTE INFORMATION EST OBLIGATOIRE** | Identifiant interne du client dans l'IMF : c'est l'élément qui permet d'identifier le client de manière unique dans le SIB, il sera utilisé pour retrouver ses comptes associés, ses actionnaires, ses mandataires, etc. |
| **IdInterneMdtCpt** | **NB : SI UN MANDATAIRE EXISTE ET QU'IL A UN COMPTE ASSOCIÉ ALORS CETTE INFORMATION EST OBLIGATOIRE** | Identifiant interne du mandataire dans l'IMF.<br>Le participant doit obligatoirement renseigner un identifiant interne pour la personne physique à déclarer comme mandataire.<br>Le mandataire compte doit avoir été déclaré parmi les mandataires de cette personne morale. |
| **DatDebMdtCpt** | **NB : SI UN MANDATAIRE EXISTE ET QU'IL A UN COMPTE ASSOCIÉ ALORS CETTE INFORMATION EST OBLIGATOIRE** | La date de début du mandat doit être supérieure ou égale à la date de création de la personne morale.<br>La date de début du mandat doit être inférieure ou égale à la date de déclaration.<br>Format date : `JJMMAAAA` |
| **DatFinMdtCpt** | **NB : SI UN MANDATAIRE EXISTE ET QU'IL A UN COMPTE ASSOCIÉ ALORS CETTE INFORMATION EST OBLIGATOIRE** | La date de fin du mandat doit être supérieure ou égale à la date de la déclaration.<br>Format date : `JJMMAAAA` |

---

## 5. Actionnaire — *Facultatif*

| Champs | Commentaire | Description |
|---|---|---|
| **IdInterneClt** | Identifiant interne du client dans l'IMF.<br>**NB : SI UN ACTIONNAIRE EXISTE ET QU'IL A UN COMPTE ASSOCIÉ ALORS CETTE INFORMATION EST OBLIGATOIRE** | Identifiant interne du client dans l'IMF : c'est l'élément qui permet d'identifier le client de manière unique dans le SIB, il sera utilisé pour retrouver ses comptes associés, ses actionnaires, ses mandataires, etc. |
| **IdInterneAct** | Identifiant interne de l'actionnaire chez l'IMF.<br>**NB : SI UN ACTIONNAIRE EXISTE ET QU'IL A UN COMPTE ASSOCIÉ ALORS CETTE INFORMATION EST OBLIGATOIRE** | Identifiant interne de l'actionnaire chez l'IMF. |
| **PartAct** | Pourcentage d'actionnariat.<br>**NB : SI UN ACTIONNAIRE EXISTE ET QU'IL A UN COMPTE ASSOCIÉ ALORS CETTE INFORMATION EST OBLIGATOIRE** | Pourcentage d'actionnariat.<br>Format attendu : `NNN.NN` (le séparateur des décimales est `.`)<br>Exemple : pour un pourcentage de 29,34 % il faut renseigner `29.34`.<br>Doit être inférieur ou égal à `100.00`. |
| **DaEntrAct** | Date d'entrée en actionnariat : facultatif. | Date d'entrée en actionnariat : facultatif.<br>La date d'entrée en actionnariat doit être supérieure ou égale à la date de création de la personne morale et inférieure ou égale à la date de déclaration.<br>Format date : `JJMMAAAA` |
