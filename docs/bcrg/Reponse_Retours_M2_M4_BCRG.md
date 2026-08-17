# Réponse du CRG aux retours BCRG — API Engagements (M2) & Encours (M4)

**Crédit Rural de Guinée S.A. — Direction des Systèmes d'Information**

*17 août 2026 — fait suite aux documents « RETOUR-API-ENGAGEMENTS » et « RETOUR-API-ENCOURS »*

---

Madame, Monsieur,

Nous vous remercions pour la revue des API Engagements et Encours. L'ensemble de vos
observations a été pris en compte : la **version 1.3** de l'API est déployée et la
documentation technique mise à jour vous est transmise ci-joint.

## 1. Corrections appliquées — Engagements (M2)

| Retour BCRG | Traitement |
|---|---|
| Champs à supprimer (`beneficiaireId/Nom`, `codActivite`, `solde`, `statut`) | Supprimés — l'état du contrat est porté par `Cloture`/`MotifCloture`/`DatClo`, dérivés de notre système bancaire |
| ~30 champs manquants (`TypEve`, `LigneParent`, `TypModif`, `Cloture`, `PeriodRemb`, `TypTxInt`, `TypAmo`, `DatPremEch`, `MntInt`, `EstRachatCreance`, `DatEvent`…) | **Tous présents** — valorisés depuis SAF2000 (plan de remboursement, dates de solde) ou par conventions stables : nos crédits sont exclusivement des crédits amortissables à la clientèle (catégorie `01`), à taux fixe, sans lignes mère/fils ni rachat de créance |
| Sous-objet **Bénéficiaires** (obligatoire) | Ajouté : titulaire unique par crédit, `IdIntBen` = identifiant interne déclaré au module M1, `PourBenef` = `100.00` |
| Sous-objets Garanties (facultatif) et Consolidations (conditionné) | Présents en listes vides — les garanties ne sont pas portées par notre système bancaire ; aucune consolidation (`TypModif` = `01`) |
| Formats (`JJMMAAAA`, taux `NN.NN`, `CodDev` = `GNF`) | Appliqués sur l'ensemble du module |

## 2. Corrections appliquées — Encours (M4)

| Retour BCRG | Traitement |
|---|---|
| Champs à supprimer (`beneficiaireId/Nom`, `codAgce`, `mntEng`, `datFin`) | Supprimés |
| Champs d'arrêté manquants (`DatEch`, `MntDerEch`, `MonPai`, `DatPai`, `MntHBil`, `MntUtilise`, `MntTotImp`, `DatDefaill`, `DatEvent`…) | **Tous présents**, calculés à la date d'arrêté depuis le plan de remboursement : dernière tombée d'échéance, dernier paiement, hors bilan (montant non décaissé), montant utilisé (décaissé), total des impayés (capital + intérêts), date de défaillance |
| Encours interdit sur engagement clôturé | Appliqué : les crédits clôturés sont exclus ; sont couverts les crédits à capital restant dû > 0 ou à montant non entièrement décaissé |
| `MntCRDU`, `MntCapImp`, compteurs d'échéances | Conservés et conformes aux descriptions (catégorie `01`) |
| `QualiCre` au référentiel adapté | Codes transitoires dérivés des jours de retard (saine / < 90 j / 90-180 j / > 180 j) **dans l'attente du référentiel de classification des IMF** |

## 3. Référentiels attendus de votre part

Pour finaliser la mise en conformité, merci de nous transmettre :

1. le **référentiel F.9** (types, natures et catégories d'engagements) — indispensable pour `TypEng` ;
2. le **référentiel des périodicités** des engagements (`PeriodRemb`, actuellement `ND`) ;
3. les modalités du **référentiel des agences** (`CodAgce`) — nous vous transmettons notre table des agences pour intégration ;
4. le **référentiel de classification des créances applicable aux IMF** (`QualiCre`).

## 4. Conventions transitoires soumises à votre validation

- `MoyRemb` = `01` (débit de compte) ; `TypAmo` = `05` (échéance constante, `04` in fine si échéance unique) ; `TypDiffAmo` = `A` ;
- `MntCreRat`, `MntPro`, `MntPerte` = `0` : les créances rattachées, provisions et radiations relèvent de la comptabilité et non du module crédit de notre système bancaire — un enrichissement ultérieur est possible ;
- `MonPai`/`DatPai` : les paiements partiels n'étant pas tracés unitairement dans le plan de remboursement, le dernier paiement correspond à l'échéance soldée la plus récente ;
- `TxEffGlob` = `ND` (TEG non calculé par le système) ;
- les **demandes d'engagement** (`TypEve` = `02`) ne sont pas encore déclarées : notre plateforme de crédit digitale les gère et pourra les exposer dans une phase ultérieure si vous le souhaitez.

Nous restons à votre disposition pour toute précision ou une séance de tests conjointe.

**Contact** : salifou.doucoure@creditruralgn.com — +224 621 09 18 95
