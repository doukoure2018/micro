# API-ENCOURS

Ci-dessous notre retour par rapport à l'API d'encours.

- `"ifrsStage": null`

> **NB :** Les champs `beneficiaireId`, `beneficiaireNom`, `codAgce`, `mntEng`, `datFin` sont à supprimer de l'API.

## Données générales

| Champ | Commentaire | Description |
|---|---|---|
| **RefIntEng** | — | Référence interne, participant et date d'arrêté.<br>Une déclaration de création doit être unique par référence interne, participant et date d'arrêté.<br>Une déclaration de mise à jour doit porter sur une référence existante (référence interne de l'engagement, participant déclarant et date d'arrêté).<br>Une déclaration d'encours ne peut pas porter sur un engagement clôturé. |
| **CodDev** | **OK** : devise de l'encours | Il s'agit de la devise dans laquelle est libellé l'engagement.<br>Les montants déclarés des encours doivent l'être en **GNF**, quelle que soit la devise de l'engagement.<br>Le champ doit prendre l'une des valeurs prévues dans le référentiel des devises. |
| **DatEch** | **ABSENT DE L'API — VALEUR CONDITIONNÉE** | Date de dernière tombée d'échéance.<br>Obligatoire si le type de l'engagement est rattaché à la catégorie `01` et si date d'arrêté >= date de première échéance (`DatPremEch`).<br>La date d'échéance doit être supérieure ou égale à la date de première échéance.<br>La date d'échéance doit être inférieure ou égale à la date de déclaration. |
| **MntDerEch** | **ABSENT DE L'API — VALEUR CONDITIONNÉE** | Montant de l'échéance de la dernière date de tombée d'échéance.<br>Obligatoire si le type d'engagement est rattaché à la catégorie d'engagement `01`.<br>Ce champ doit être vide si le type d'engagement référencé est rattaché à une catégorie d'engagement différente de `01`. |
| **MonPai** | **ABSENT DE L'API — VALEUR CONDITIONNÉE** | Montant du dernier paiement réalisé.<br>Obligatoire si le type d'engagement est rattaché à la catégorie d'engagement `01`.<br>Mettre `0` si pas de paiement.<br>Ne pas renseigner sinon. |
| **DatPai** | **ABSENT DE L'API — VALEUR CONDITIONNÉE** | Date du dernier paiement réalisé.<br>Concerne uniquement les types d'engagements rattachés à la catégorie d'engagement `01`.<br>À remplir si `MonPai > 0`. Le participant doit renseigner le montant du dernier paiement réalisé.<br>La date de paiement doit être inférieure ou égale à la date d'arrêté.<br>Format date : `JJMMAAAA` |
| **MntHBil** | **ABSENT DE L'API — VALEUR OBLIGATOIRE** | Montant Engagement Hors Bilan.<br>• C'est le montant **non décaissé** si le type d'engagement est rattaché à la catégorie d'engagement `01`.<br>• C'est le montant **non utilisé** si le type d'engagement est rattaché à la catégorie d'engagement `02` ou `03`.<br>• La valeur de ce champ doit être inférieure ou égale au montant de l'engagement. |
| **MntRemAnt** | **ABSENT DE L'API — VALEUR FACULTATIVE** | Montant remboursement anticipé.<br>À renseigner si l'engagement a fait l'objet d'un remboursement anticipé, total ou partiel.<br>Uniquement si le type d'engagement est rattaché à la catégorie d'engagement `01`. |
| **MntCRDU** | Champ présent dans l'API, il faut juste tenir compte de sa description | Capital Restant Dû (CRDU) de l'engagement.<br>Le champ doit être renseigné si le type d'engagement est rattaché à la catégorie d'engagement `01`.<br>Doit rester vide sinon. |
| **MntCreRat** | **ABSENT DE L'API — VALEUR CONDITIONNÉE** | Montant des créances rattachées.<br>Obligatoire si le type d'engagement est rattaché à la catégorie d'engagement `01`.<br>Doit rester vide sinon. |
| **MntUtilise** | **ABSENT DE L'API — VALEUR OBLIGATOIRE** | Montant utilisé.<br>• Montant décaissé si `CatEng = '01'`.<br>• Montant utilisé pour les autres engagements. Tout dépassement d'autorisation sera comptabilisé en impayé.<br>• Ce champ ne peut prendre que la valeur `0` pour les EPS de type contrat unique (si `EstLigne != '02'`). Le montant de l'engagement pour ce type de contrat est comptabilisé en encours hors bilan. En cas de défaut, le montant total sera transféré en impayé (ainsi que les frais éventuels y afférents).<br>• Pour les EPS de type Contrat Global (`EstLigne = '02'`), le montant utilisé représente le montant affecté aux « Contrats Fils » liés au contrat global. |
| **MntAgi** | **ABSENT DE L'API — VALEUR CONDITIONNÉE** | Montant des agios.<br>Ce champ est obligatoire si le type d'engagement est rattaché à la catégorie d'engagement `02`.<br>Le champ doit rester vide sinon. |
| **MntCapImp** | Champ présent dans l'API, il faut juste tenir compte de sa description | Capital en impayé.<br>Ce champ est obligatoire si le type d'engagement est rattaché à la catégorie d'engagement `01`.<br>Mettre `0` si pas de capital en impayé. |
| **MntTotImp** | **ABSENT DE L'API — VALEUR OBLIGATOIRE** | Montant total des impayés.<br>Le montant total impayé est la somme de tous les montants impayés constatés à la date d'arrêté (capital, intérêts, commissions, dépassement d'autorisation…).<br>Mettre `0` si pas d'impayé ou si `EstLigne = 02`. |
| **DatDefaill** | **ABSENT DE L'API — VALEUR CONDITIONNÉE** | Date de défaillance (date de la plus ancienne échéance de l'impayé en cours ou du dépassement de l'autorisation…).<br>Ce champ est obligatoire si `MntTotImp > 0`. Laisser le champ vide sinon.<br>La date de défaillance doit être inférieure ou égale à la date d'arrêté.<br>La date de défaillance doit être strictement supérieure à la date de mise en place.<br>La date de défaillance doit être supérieure ou égale à la date de défaillance de l'encours de l'arrêté précédent.<br>Format date : `JJMMAAAA` |
| **MntPro** | **ABSENT DE L'API — VALEUR OBLIGATOIRE** | Montant total des provisions passées sur la créance.<br>Mettre `0` si aucune provision n'a été passée sur la créance. |
| **MntPerte** | **ABSENT DE L'API — VALEUR OBLIGATOIRE** | Montant passé en pertes (créances radiées).<br>Mettre `0` si aucun montant n'a été passé en perte.<br>Sinon la valeur doit être égale à :<br>• (`MntHBilan` + `CRDU` + montant total des impayés) de l'encours précédent si `CatEng = '01'`<br>• (`MntHBilan` + `Utilisé` + montant total des impayés) de l'encours précédent si `CatEng != '01'` |
| **NbrEchPay** | Champ présent dans l'API, il faut juste tenir compte de sa description | Nombre d'échéances payées.<br>• Ce champ est obligatoire si le type d'engagement est rattaché à la catégorie d'engagement `01`.<br>• Dans le cas des engagements avec différé total, considérer les échéances de la période de différé comme payées avec montant `0`.<br>• Renseigner `0` lorsqu'aucune échéance n'a été payée. |
| **NbrEchImp** | Champ présent dans l'API, il faut juste tenir compte de sa description | Nombre d'échéances en impayé.<br>Ce champ est obligatoire si le type d'engagement est rattaché à la catégorie d'engagement `01`.<br>Le nombre renseigné doit être :<br>• `= 0` si aucune échéance n'est en impayé.<br>• `> 0` si `MntTotImp > 0`. |
| **NbrEchRest** | Champ présent dans l'API, il faut juste tenir compte de sa description | Nombre d'échéances restantes.<br>Ce champ est obligatoire si le type d'engagement est rattaché à la catégorie d'engagement `01`.<br>Le nombre renseigné doit être :<br>• `= 0` si `MntCRDU = 0`.<br>• `> 0` si `MntCRDU > 0`. |
| **QualiCre** | Champ présent dans l'API, il faut juste tenir compte de sa description et prendre sa valeur dans le référentiel adapté | Qualité de la créance.<br>Fait partie du référentiel de la classification des engagements en fonction du type du participant (Banques vs IMF). |
| **PD** | Champ présent dans l'API, il faut juste tenir compte de sa description | Probabilité de défaut.<br>Séparateur de décimales à utiliser : `.`<br>Pour une valeur de 0,05 %, saisir `0.05`. Pour une valeur de 10 %, saisir `10`. |
| **LGD** | Champ présent dans l'API : sa valeur est **facultative** | Loss Given Default (perte en cas de défaut). |
| **CCF** | Champ présent dans l'API : sa valeur est **facultative** | Credit Conversion Factor.<br>Ce champ ne peut être renseigné que pour les engagements comptabilisés en hors bilan (`MntHBil > 0`). |
| **IFRSStage** | Champ présent dans l'API : sa valeur est **facultative** | Stage IFRS de la créance.<br>`01` : Bucket 1<br>`02` : Bucket 2<br>`03` : Bucket 3 |
| **DatEvent** | **ABSENT DE L'API — VALEUR OBLIGATOIRE** | Date Événement.<br>En fonction de la nature de la déclaration, il s'agit de la date de :<br>• Création<br>• Modification<br>Par défaut, saisir la date de session.<br>Format date : `JJMMAAAA` |

## Synthèse

| Statut | Champs |
|---|---|
| **À supprimer de l'API** | `beneficiaireId`, `beneficiaireNom`, `codAgce`, `mntEng`, `datFin` |
| **Absents — obligatoires** | `MntHBil`, `MntUtilise`, `MntTotImp`, `MntPro`, `MntPerte`, `DatEvent` |
| **Absents — conditionnés** | `DatEch`, `MntDerEch`, `MonPai`, `DatPai`, `MntCreRat`, `MntAgi`, `DatDefaill` |
| **Absents — facultatifs** | `MntRemAnt` |
| **Présents — description à respecter** | `MntCRDU`, `MntCapImp`, `NbrEchPay`, `NbrEchImp`, `NbrEchRest`, `QualiCre`, `PD` |
| **Présents — facultatifs** | `LGD`, `CCF`, `IFRSStage` |
| **Présents — OK** | `RefIntEng`, `CodDev` |
