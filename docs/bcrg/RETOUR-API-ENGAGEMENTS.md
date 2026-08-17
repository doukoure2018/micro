# API-ENGAGEMENT

Ci-dessous notre retour par rapport à l'API d'engagement.

> **NB :** Les champs `beneficiaireId`, `beneficiaireNom`, `codActivite`, `solde`, `statut` sont à supprimer de l'API.

## Données générales

| Champ | Commentaire | Description |
|---|---|---|
| **RefIntEng** | **OK** | Référence interne de l'engagement chez l'IMF.<br>Ce champ est obligatoire si `TypEve = '01'`. Le champ ne doit pas être renseigné si `TypEve = '02'`.<br>Ne doit pas concerner un contrat existant si `NatDec = '00'`.<br>La référence doit exister dans le SIC si `NatDec = '01'`. |
| **TypEve** | **Manquant dans l'API** | Type d'évènement à déclarer.<br>Ce champ prend l'une des valeurs suivantes :<br>`01` : Engagement accordé<br>`02` : Demande d'engagement |
| **LigneParent** | **Manquant dans l'API** | Ce champ prend l'une des valeurs suivantes :<br>`01` : Ne s'applique pas<br>`02` : Ligne Mère<br>`03` : Contrat fils |
| **RefIntLigne** | **Manquant dans l'API** | Référence interne de la ligne.<br>Ce champ est obligatoire si `LigneParent = '03'`.<br>La ligne mère doit avoir été déclarée au préalable. |
| **RefDemandeEng** | **Manquant dans l'API** | Référence interne de la demande d'engagement chez l'IMF.<br>Ce champ est obligatoire si `TypEve = '02'`. Ne doit pas concerner un contrat existant si `NatDec = '00'`.<br>Il est facultatif si `TypEve = '01'` (engagement accordé).<br>Le participant pourra y renseigner la référence de la demande d'engagement rattachée au contrat accordé, objet de la déclaration. Si la demande est référencée dans le SIC, elle ne doit pas avoir été rejetée ou annulée (`Cloture = '1'`). |
| **DatDem** | **Manquant dans l'API** | Date de la demande d'engagement.<br>Ce champ est obligatoire si `RefDemandeEng` est renseignée.<br>La date de la demande d'engagement doit être inférieure ou égale à la date de déclaration.<br>Format date : `JJMMAAAA` |
| **TypModif** | **Manquant dans l'API** | Type de modification sur le contrat objet de la déclaration ou les contrats sous-jacents. Ce champ prend les valeurs suivantes :<br>`01` — **Aucune modification** : le contrat n'a pas fait l'objet d'une modification (à saisir dans le cas de création d'un nouveau contrat).<br>`02` — **Consolidation** : le contrat est issu de la consolidation de plusieurs contrats d'engagement ou d'un unique contrat précédemment existant dont la modification a nécessité un changement de référence (déclaration de création).<br>`03` — **Autre modification** : le contrat a fait l'objet d'un autre type de modification (déclaration de modification).<br>`04` — **Renouvellement** : le contrat est contractuellement renouvelable (sans changement de référence interne). La modification a pour but de déclarer une modification de son terme. Les autres modifications sont autorisées (déclaration de modification). |
| **EstDout** | **Manquant dans l'API** | La créance est douteuse (si restructuration).<br>Le champ prend une des valeurs suivantes : `0` : Non — `1` : Oui.<br>À renseigner si le contrat est concerné par une restructuration (`TypModif = '02'` : Consolidation, ou `TypModif = '03'` : Autre modification).<br>Le champ doit rester vide sinon. |
| **Cloture** | **Manquant dans l'API** | Statut à déclarer pour l'engagement (actif ou clôturé).<br>Le champ prend une des valeurs suivantes : `0` : Non — `1` : Oui.<br>• Prend la valeur `0` si le contrat ou la demande d'engagement est en cours (actif).<br>• Prend la valeur `1` pour une déclaration relative à une clôture de contrat ou de demande d'engagement. Cette valeur n'est autorisée que si `NatDec = '01'` lorsque `TypEve = '01'` (l'engagement doit avoir été créé avant sa clôture).<br>Avant de clôturer un contrat d'engagement, une déclaration d'encours « de clôture » doit précéder pour solder l'ensemble des encours bilan et hors bilan du contrat. |
| **MotifCloture** | **Manquant dans l'API** | Motif de clôture du contrat ou de la demande d'engagement.<br>Valeurs possibles si `TypEve = '01'` :<br>`01` : Totalement remboursé<br>`02` : Remboursement anticipé total<br>`03` : Consolidation<br>`04` : Cession de créance<br>`05` : Passage en perte<br>`06` : Autre<br>Valeurs possibles si `TypEve = '02'` :<br>`07` : Demande refusée par l'institution<br>`08` : Annulation de la demande |
| **DatClo** | **Manquant dans l'API** | Date de clôture de l'engagement ou de la demande d'engagement.<br>Ce champ est obligatoire si `Cloture = '1'`. Il ne doit pas être renseigné si `Cloture = '0'`.<br>La date de clôture doit être inférieure ou égale à la date de déclaration.<br>Format date : `JJMMAAAA` |
| **DatAccord** | Présent dans l'API mais **la date n'a pas le bon format** | Date d'obtention de l'accord de crédit.<br>Ce champ est obligatoire si `TypEve = '01'`. Il ne doit pas être renseigné si `TypEve = '02'`.<br>La date d'accord doit être inférieure ou égale à la date de mise en place (`DateMEP`).<br>Format date : `JJMMAAAA` |
| **DateMEP** | Présent dans l'API mais **la date n'a pas le bon format** — Format date : `JJMMAAAA` | Date de mise en place. **Champ obligatoire.**<br>La date de mise en place doit être supérieure ou égale à la date d'obtention de l'accord de crédit (`DatAccord`).<br>La date de mise en place doit être strictement inférieure à la date de fin prévue.<br>Pour les demandes d'engagement, saisir une estimation de la date de mise en place.<br>Format date : `JJMMAAAA` |
| **TypEng** | Présent dans l'API mais **n'a pas la bonne valeur**. Voir *F.9 Référentiel des types, natures et catégories d'engagements* | Type de l'engagement (objet financement).<br>Doit appartenir au référentiel des types d'engagements.<br>Si `LigneParent = '02'`, le type de l'engagement doit obligatoirement être égal à `054` : « Autres engagements accordés à la clientèle ».<br>Le type d'engagement ne peut pas être modifié lors d'une déclaration de modification pour les contrats accordés. |
| **MntEng** | **OK** | Montant de l'engagement. |
| **MntInt** | **Manquant dans l'API** | Montant total des intérêts.<br>Ce champ ne peut être renseigné que si le type d'engagement prévoit des intérêts (cf. référentiel des types d'engagements). La valeur saisie doit être `>= 0`.<br>Laisser le champ vide sinon. |
| **CodDev** | Présent dans l'API mais **n'a pas la bonne valeur** — Code devise du financement `GNF` | Code devise du financement `GNF`. |
| **PeriodRemb** | **Manquant dans l'API** | Périodicité des remboursements.<br>Doit appartenir au référentiel des périodicités des engagements.<br>La valeur du champ doit être différente de `'00'` si le type d'engagement est rattaché à la catégorie d'engagement `01`.<br>La valeur du champ doit être `'00'` si le type d'engagement est rattaché à la catégorie d'engagement `02` ou `03`. |
| **TxIntEng** | Présent dans l'API mais **n'a pas le bon format**. Format attendu : `NN.NN` (exemple : pour un taux de 12,35 %, saisir `12.35`). Le séparateur des décimales est le `.`. Doit être inférieur à `100.00` | Taux d'intérêt du contrat.<br>Ce champ est obligatoire si le type d'engagement prévoit un taux d'intérêt (cf. référentiel des types d'engagements).<br>Format attendu : `NNN.NN` (exemple : pour un taux de 12,35 %, saisir `12.35`). Le séparateur des décimales est le `.`. Doit être inférieur à `100.00`. |
| **TypTxInt** | **Manquant dans l'API** | Type de taux d'intérêt. Ce champ prend l'une des deux valeurs :<br>`00` : Fixe<br>`01` : Variable<br>Ce champ est obligatoire si le type d'engagement prévoit un taux d'intérêt (cf. référentiel des types d'engagements). |
| **TxComm** | **Manquant dans l'API** | Taux de commission.<br>Ce champ est obligatoire si `TypEng` prend l'une des valeurs suivantes : `051`, `052`, `053`, `061`, `062`.<br>Il est à renseigner pour les autres types d'engagements si le contrat prévoit un taux de commission (cf. référentiel des types d'engagements).<br>Doit être inférieur à `100.00`. |
| **IndRef** | **Manquant dans l'API** | Indice de référence servant à calculer le taux d'intérêt nominal. Ce champ prend les valeurs suivantes :<br>`01` : TBB<br>`02` : LIBOR<br>`03` : EURIBOR<br>Il est obligatoire si : type d'engagement avec taux d'intérêt (cf. référentiel des types d'engagements) **et** type de taux d'intérêt « Variable » (`TypTxInt = '01'`).<br>Aucune valeur ne doit être saisie si `TypTxInt != '01'`. |
| **Sprd** | **Manquant dans l'API** | Spread : marge appliquée au-delà du taux de référence.<br>Champ obligatoire si : type d'engagement avec taux d'intérêt (cf. référentiel des types d'engagements) **et** type de taux d'intérêt Variable (`TypTxInt = '01'`).<br>Aucune valeur ne doit être saisie si `TypTxInt != '01'`.<br>Format attendu : `NNN.NN` (exemple : pour un spread de 4,35 %, saisir `04.35`). Le séparateur des décimales est le `.`. |
| **TxEffGlob** | **Manquant dans l'API** | Taux Effectif Global (TEG).<br>Le TEG doit être supérieur ou égal au taux d'intérêt.<br>Format attendu : `NNN.NN` (exemple : pour un taux de 12,35 %, saisir `12.35`). Le séparateur des décimales est le `.`.<br>Doit être inférieur à `100.00`. |
| **MoyRemb** | **Manquant dans l'API** | Moyen de remboursement.<br>`01` : Débit de compte<br>`02` : Virement<br>`03` : Chèque<br>`04` : Effet de commerce<br>`05` : Versement en compte |
| **TypAmo** | **Manquant dans l'API** | Type d'amortissement.<br>Ce champ est obligatoire si le type d'engagement est rattaché à la catégorie d'engagement `01`. Il ne doit pas être rempli pour les autres catégories (`02` et `03`).<br>Le champ prend une des valeurs suivantes :<br>`00` : Aucun<br>`01` : Amortissement constant<br>`02` : Amortissement dégressif<br>`03` : Amortissement variable<br>`04` : Amortissement in fine<br>`05` : Échéance constante |
| **TypDiffAmo** | **Manquant dans l'API** | Type différé d'amortissement.<br>Ce champ est obligatoire si le type d'engagement est rattaché à la catégorie d'engagement `01`. Il ne doit pas être rempli pour les autres catégories (`02` et `03`).<br>Le champ prend une des valeurs suivantes :<br>`A` : Aucun différé<br>`P` : Différé partiel<br>`T` : Différé total |
| **UnitDur** | **Manquant dans l'API** | Unité de durée.<br>Ce champ est obligatoire si l'engagement prévoit une période de différé du paiement des échéances (`TypDiffAmo = 'P'` ou `'T'`). Il doit rester vide sinon.<br>Le champ prend une des valeurs suivantes :<br>`0` : jours<br>`1` : mois<br>`2` : année |
| **PerDiffAmo** | **Manquant dans l'API** | Période de différé d'amortissement (en `UnitDur`).<br>Ce champ est obligatoire si `TypDiffAmo = 'P'` ou `TypDiffAmo = 'T'`, avec une valeur strictement positive. Ne pas renseigner sinon.<br>La valeur doit être saisie selon l'unité de durée choisie dans `UnitDur`.<br>Ex. : si l'engagement prévoit un différé de 2 mois, saisir `1` dans `UnitDur` et `2` dans `PerDiffAmo`. |
| **MntEch** | **OK** pour ce champ, mais il faut tenir compte de sa description | Montant échéance.<br>Ce champ doit être renseigné si le type de l'engagement est rattaché à la catégorie `01`. Renseigner le montant maximum des échéances prévues.<br>Le champ doit rester vide sinon. |
| **NbrEch** | **OK** pour ce champ, mais il faut tenir compte de sa description | Nombre initial d'échéances prévues.<br>Ce champ doit être renseigné si le type de l'engagement est rattaché à la catégorie `01`. Le champ doit rester vide sinon.<br>Le nombre d'échéances doit être égal à `1` en cas de périodicité unique. |
| **DatPremEch** | **Manquant dans l'API** | Date de première échéance.<br>Ce champ doit être renseigné si le type d'engagement est rattaché à la catégorie `01`. Le champ doit rester vide sinon.<br>La date de la première échéance doit être supérieure ou égale à la date de mise en place (MEP).<br>La date de la première échéance doit être inférieure ou égale à la date de fin prévue (`DatFin`).<br>Format date : `JJMMAAAA` |
| **DatFin** | Présent dans l'API mais **la date n'a pas le bon format** — Format date : `JJMMAAAA` | Date de fin prévue.<br>C'est la date prévue de la dernière échéance pour les crédits amortissables (`CatEng = '01'`) et la date de fin du contrat pour les autres engagements (`CatEng = '02'` ou `'03'`).<br>La date doit être strictement supérieure à la date de mise en place (`DateMEP`).<br>Format date : `JJMMAAAA` |
| **MntFrais** | **Manquant dans l'API** | Montant frais annexes (frais de dossiers et autres).<br>`0` si rien à déclarer. |
| **MntComm** | **Manquant dans l'API** | Commissions (perçues à l'avance).<br>`0` si rien à déclarer. |
| **CodAgce** | Présent dans l'API mais **n'a pas la bonne valeur**. Il doit appartenir au référentiel des agences | Code agence.<br>Doit appartenir au référentiel des agences. |
| **EstRachatCreance** | **Manquant dans l'API** | Est rachat de créance : le contrat est un rachat de créance d'un autre participant.<br>`01` : Oui<br>`02` : Non |
| **ParCont** | **Manquant dans l'API** | Participant contrepartie.<br>Ce champ peut être renseigné si le contrat est issu d'un rachat de créance d'un autre participant (`EstRachatCreance = '01'`) — code référentiel des participants.<br>Laisser le champ vide sinon. |
| **ValNom** | **Manquant dans l'API** | Valeur nominale de la créance.<br>C'est la valeur nominale de la créance rachetée. Ce champ est obligatoire si `EstRachatCreance = '01'`. |
| **ValCess** | **Manquant dans l'API** | Valeur de cession.<br>Ce champ est à renseigner en cas de clôture pour motif de cession de créance (`MotifCloture = '04'`). |
| **DatEvent** | **Manquant dans l'API** | Date événement, fonction de la nature de la déclaration :<br>• Date de création du contrat d'engagement ou de la demande d'engagement chez le participant si `NatDec = '00'` (nouveau contrat)<br>• Date de modification du contrat si `NatDec = '01'` (modification contrat)<br>• Date de session : par défaut |

## Données bénéficiaires *(obligatoire)*

> **NB :** cet objet est **totalement absent de l'API**, il est **obligatoire**.

Obligatoire et répétitive. Chaque contrat d'engagement est rattaché à un ou plusieurs titulaires. Chaque bénéficiaire doit être au préalable déclaré au SIC comme PP ou PM.

| Champ | Description |
|---|---|
| **RefIntEng** | Référence interne de l'engagement chez la micro-finance. |
| **IdIntBen** | Identifiant interne du bénéficiaire dans l'IMF.<br>Le bénéficiaire doit avoir fait l'objet d'une déclaration préalable au SIC.<br>Si un bénéficiaire de type Personne Morale est présent, il doit être unique. |
| **PourBenef** | Pourcentage bénéficiaire.<br>Format attendu : `NN.NN`. Doit être inférieur à `100.00`. |

## Données garanties *(facultatif)*

> **NB :** cet objet est **totalement absent de l'API**, il est **facultatif** : si l'information est disponible, vous pouvez l'ajouter, sinon le laisser vide.

Facultative. L'IMF doit spécifier les caractéristiques de la garantie rattachée au contrat. Chaque garantie est déclarée dans une balise spécifique.

| Champ | Description |
|---|---|
| **RefIntEng** | Référence interne de l'engagement chez l'IMF. |
| **RefIntGar** | Référence interne de la garantie chez le participant. |
| **TypGar** | Type garantie. Doit appartenir au référentiel des garanties. |
| **DesGar** | Description de la garantie. |
| **CodDev** | Devise de la garantie : `GNF`. |
| **MntGar** | Valeur de la garantie. |
| **TypIdent** | Type identifiant unique. Doit appartenir au référentiel des types d'identifiants des garanties. |
| **CodIdent** | Code identification de la garantie. |
| **DatEval** | Date évaluation. |
| **DatExp** | Date expiration. |
| **MntAffecGar** | Montant affecté : valeur affectée de la garantie. |
| **StatutGarantie** | Statut de la garantie :<br>`1` : Actif<br>`2` : En cours de mise en place<br>`3` : Mainlevée<br>`4` : Mis en jeu |
| **IdIntGarant** | Identifiant interne du garant dans la micro-finance.<br>À renseigner si le garant est différent du bénéficiaire.<br>Le garant doit faire l'objet d'une déclaration préalable au SIC. |

## Données consolidation *(conditionnée)*

> **NB :** cet objet est **totalement absent de l'API**, il est **conditionné** : si la condition est remplie, alors l'objet devient obligatoire.

- Cette information est conditionnée et répétitive. Elle doit être déclarée suite à une altération des termes du contrat ayant engendré une modification de la référence initiale du contrat, ou la consolidation de deux ou plusieurs contrats d'engagements en un nouveau contrat avec une nouvelle référence.
- L'information devient obligatoire si `TypModif = '02'` (Consolidation). À ne pas déclarer sinon.

| Champ | Description |
|---|---|
| **RefIntEng** | Référence interne de l'engagement chez la micro-finance. |
| **RefIntEng** *(engagement clôturé)* | Référence interne de l'engagement clôturé chez la banque.<br>L'engagement à consolider doit avoir été déclaré au SIC par ce participant.<br>Les bénéficiaires du ou des contrats référencés dans cette balise doivent être les mêmes que ceux listés dans ce contrat.<br>L'engagement référencé à consolider doit être différent de l'engagement objet de cette déclaration. L'engagement à consolider doit avoir été clôturé au préalable. |

## Synthèse

| Statut | Champs |
|---|---|
| **À supprimer de l'API** | `beneficiaireId`, `beneficiaireNom`, `codActivite`, `solde`, `statut` |
| **Manquants dans l'API** | `TypEve`, `LigneParent`, `RefIntLigne`, `RefDemandeEng`, `DatDem`, `TypModif`, `EstDout`, `Cloture`, `MotifCloture`, `DatClo`, `MntInt`, `PeriodRemb`, `TypTxInt`, `TxComm`, `IndRef`, `Sprd`, `TxEffGlob`, `MoyRemb`, `TypAmo`, `TypDiffAmo`, `UnitDur`, `PerDiffAmo`, `DatPremEch`, `MntFrais`, `MntComm`, `EstRachatCreance`, `ParCont`, `ValNom`, `ValCess`, `DatEvent` |
| **Format de date à corriger** (`JJMMAAAA`) | `DatAccord`, `DateMEP`, `DatFin` |
| **Format à corriger** | `TxIntEng` (`NN.NN`) |
| **Valeur non conforme au référentiel** | `TypEng`, `CodDev` (`GNF`), `CodAgce` |
| **OK (description à respecter)** | `RefIntEng`, `MntEng`, `MntEch`, `NbrEch` |
| **Objets absents** | Données bénéficiaires *(obligatoire)*, Données garanties *(facultatif)*, Données consolidation *(conditionnée)* |
