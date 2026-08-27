# Plan de correctifs v1.6 — retours de validation plateforme BCRG (2026-08-20)

**Source** : rapports d'erreur `docs/bcrg/errorbcrg/` (lot de 300 enregistrements par module, tout rejeté).

**Synthèse des rejets** :

| Fichier | Erreurs | Causes |
|---|---|---|
| personnemorale.csv | 1 444 sur 300 PM | `nifp` SYN003 ×300, `datCreat` SYN004 ×300, `mobile` OBL002 ×285 (+7 SYN003), `secActEcon` OBL002 ×272, `rccm` SYN001 ×269, `sigle` SYN001 ×11 |
| engagement.csv | 916 sur 300 eng. | `typEng` SYN002 ×300, `periodRemb` SYN002 ×300, `codAgce` SYN002 ×250, `dateMEP` ×22 (OBL002+SYN003+SYN004) |
| beneficiaire.csv | 300 | `idIntBen` SYN002 ×300 (bénéficiaire non déclaré dans le SIC) |
| encoursengagement.csv | 300 | LOG008 ×300 (refIntEng 333–2793 inconnus, engagements déclarés = 540407–540885) |

**4 causes racines** : (1) « ND » rejeté par la validation sur les champs typés/format ; (2) référentiels BCRG jamais fournis (F.9 types d'engagement, périodicités, agences) ; (3) ordonnancement non respecté (PP/PM avant engagements, engagements avant encours) ; (4) `RefIntEng = NUM_CREDITO` seul n'est **pas unique** (PK SAF = COD_EMPRESA+COD_AGENCIA+NUM_CREDITO) → références disjointes entre M2 et M4.

---

## Lot A — Personnes morales (bcrgservice `BcrgMapper.toPersonneMorale` + ebanking)

### A1. Fin de la politique « ND » sur les champs typés — **code**
La plateforme valide le format AVANT l'obligation : « ND » déclenche SYN001/SYN003/SYN004. Remplacer par `null` (champ omis) pour les champs sans source SI :
- `datCreat` : `ND` → `null` (BcrgMapper.java:131).
- `rccm` / `nif` / `nifp` / `numAgrement` : `coalesceND(...)` → `blankToNull(...)` (BcrgMapper.java:154-157) — la valeur pièce est conservée quand elle existe.
- Balayer les autres ND typés du mapper PP par cohérence (`datNai` repli, `datEmiPiece`…) — même règle : une date/un numérique ne portent jamais « ND ».
- ⚠️ Si la plateforme répond alors OBL002 (champ obligatoire manquant), c'est un **arbitrage BCRG** (Lot E), pas un correctif technique : la donnée n'existe pas dans SAF (RCCM = 74/107 307 PM).

### A2. `mobile` obligatoire (285 manquants + 7 mal formés) — **code**
- ebanking `RegulatoryRepository` (requêtes PM) : remplacer `TEL_PRINCIPAL` par `COALESCE(NULLIF(TEL_PRINCIPAL,''), NULLIF(TEL_SECUNDARIO,''), NULLIF(TEL_OTRO,''))` (colonnes existantes de CL_CLIENTES) ; en 2e repli, jointure `CL_CONTACTOS_X_CLIENTE.TEL_CONTACTO` (téléphone du contact/gérant de la PM).
- `BcrgTranslator.normaliserMobile` (BcrgTranslator.java:63-71) : ne plus renvoyer les numéros non conformes « nettoyés » (source des 7 SYN003) → si le résultat ne matche pas `\+224\d{9}`, renvoyer `null`.
- Le reliquat sans aucun téléphone = collecte CRG / dérogation (Lot E).

### A3. `secActEcon` (ActEcon) obligatoire (272 manquants) — **code + arbitrage**
- Enrichir `translateSecteurNaema` : ajouter des mots-clés manquants et **journaliser les libellés non mappés** pour compléter la table.
- Décision à prendre : code NAEMA de **repli** quand `DES_ACTIVIDAD` est vide (proposition : « S » autres activités de services — à confirmer, sinon dérogation Lot E). La plupart des 272 sont probablement des PM sans activité saisie dans SAF.

### A4. `sigle` > 50 caractères (11 cas) — **code**
- `BcrgMapper` : tronquer à 50 caractères (`s.substring(0, 50)` après trim) — méthode utilitaire `truncate(valeur, 50)` réutilisable pour tout champ borné du contrat.

---

## Lot B — Engagements M2 (bcrgservice `toEngagement` + ebanking)

### B1. `typEng` hors référentiel F.9 (×300) — **bloqué référentiel + préparation code**
- On envoie aujourd'hui `TIP_CREDITO` brut (3, 10, 33, 58, 66…) (BcrgMapper.java:198). Sans le référentiel F.9, aucun mapping possible → **relance BCRG (Lot E, bloquant)**.
- Préparer le terrain : exposer le **libellé** du type de crédit SAF (jointure table des types PR) dans `RegEngagementDto`, et créer `BcrgTranslator.translateTypeEngagement(code, libellé)` par mots-clés (même procédé que NAEMA/F.7), à remplir dès réception du référentiel.

### B2. `periodRemb` = ND (×300) — **code (dérivable) + référentiel**
- La périodicité est **dérivable du plan de paiement** : intervalle en jours entre les 2 premières échéances (`PR_PLAN_PAGOS`, NUM_CUOTA 1→2) → nouvelle colonne dérivée dans `ENG_SELECT` (ex. `DATEDIFF(day, ech1, ech2)`).
- `BcrgTranslator.translatePeriodicite(jours)` : ~7→hebdomadaire, ~15→quinzaine, 28-31→mensuel, ~90→trimestriel, ~180→semestriel, ~360→annuel, CANT_CUOTAS=1→unique. Les **codes cibles** restent à caler sur le référentiel BCRG (relance Lot E) — mais la dérivation peut être codée et testée dès maintenant.

### B3. `codAgce` hors référentiel agences (×250, 42 agences concernées) — **procédure + code**
- Les codes agences SAF (201…962) ne sont pas connus de la plateforme. Demander à la BCRG (Lot E) : la **procédure de déclaration des agences** de l'IMF (module conformité ?) ou leur table de correspondance.
- Prévoir une table de transcodage `codeAgenceSaf → codeAgenceBcrg` (fichier de conf ou table Postgres bcrgservice) appliquée dans le mapper — identité par défaut si la BCRG reprend nos codes après enregistrement des agences.
- Curiosité : 50 des 300 engagements n'ont PAS l'erreur codAgce → certaines agences sont déjà connues de la plateforme ; demander la liste acceptée pour cadrer le mapping.

### B4. `dateMEP` manquante/invalide (×22) — **code**
- 22 crédits sans `FEC_PRIMER_DESEMBOLSO` (jamais décaissés). Un engagement non mis en place n'a pas de MEP → **exclure de l'extraction M2** : `WHERE cr.FEC_PRIMER_DESEMBOLSO IS NOT NULL` (ou `MON_DESEMBOLSADO > 0`) dans `ENG_SELECT`/`SQL_COUNT_ENG`/lots keyset.
- Option future (déjà notée en v1.3) : les déclarer en TypEve=02 « demande d'engagement » — hors périmètre v1.6.

---

## Lot C — Unification et unicité de `RefIntEng` (M2 = bénéficiaires = M4)

**Constat** : `refIntEng = NUM_CREDITO` seul (BcrgMapper.java:179 et 247) alors que la clé SAF est `COD_EMPRESA+COD_AGENCIA+NUM_CREDITO`. Les plages disjointes des rejets (engagements 540xxx vs encours 333–2793) le prouvent : deux crédits d'agences différentes peuvent porter le même NUM_CREDITO, et l'encours (photo toutes agences) référence des crédits jamais déclarés en M2.

### C1. Référence composite — **code, à faire AVANT toute redéclaration**
- Définir `refIntEng = codAgencia + "-" + numCredito` (ou concaténation zéro-paddée si la BCRG refuse le tiret — à confirmer Lot E, longueur max du champ).
- Appliquer au **même endroit** pour les 3 usages : `toEngagement` (RefIntEng + RefIntEng du bénéficiaire), `toEncours` → méthode partagée `BcrgTranslator.refIntEng(codAgencia, numCredito)`.
- ebanking : `SQL_FIND_ENG_BY_ID` filtre sur `NUM_CREDITO` seul (RegulatoryRepository.java:236) → ajouter `COD_AGENCIA` ; idem détail encours. Le keyset `WHERE NUM_CREDITO > :afterId ORDER BY NUM_CREDITO` est ambigu → paginer sur `(COD_AGENCIA, NUM_CREDITO)`.
- bcrgservice : endpoints `/engagements/{id}` et notifications `bcrg_donnee_traitee` (module ENGAGEMENT) passent à la référence composite. Aucun engagement n'ayant été accepté par le SIC, **c'est le moment ou jamais** de changer la référence (aucun historique à préserver côté BCRG).

### C2. Cohérence M4 → M2 — **code**
- L'encours ne doit contenir QUE des crédits dont l'engagement est déclaré : filtrer la photo M4 sur `bcrg_donnee_traitee` (module ENGAGEMENT) — voir Lot D.

---

## Lot D — Ordonnancement du circuit de soumission (bcrgservice)

Le rejet des 300 `idIntBen` et des 300 encours vient de soumissions hors ordre. Verrouiller côté API :

### D1. Engagements « éligibles »
- Nouveau paramètre (ou comportement du défaut `statut=restantes`) : ne servir que les engagements dont le `COD_CLIENTE` du bénéficiaire figure dans `bcrg_donnee_traitee` (module PP ou PM). Requête : jointure Postgres sur les références notifiées, appliquée dans `BcrgServiceImpl` après le lot ebanking (ou en filtre sur `/par-ids`).
- Documente le circuit : **1)** déclarer PP/PM → accusé → notifier `/bcrg/traitements` ; **2)** déclarer les engagements éligibles → notifier ; **3)** soumettre l'encours.

### D2. Encours « éligibles »
- Filtrer la photo M4 sur les refIntEng présents dans `bcrg_donnee_traitee` (module ENGAGEMENT). Paramètre d'échappement `filtre=aucun` pour audit.

### D3. Garde-fou qualité avant soumission (optionnel mais recommandé)
- Petit endpoint `/bcrg/controles?module=PM` (ou script) qui rejoue les règles de la plateforme (formats JJMMAAAA, longueurs rccm/sigle, mobile +224, champs obligatoires) et sort le décompte des enregistrements non conformes AVANT envoi — évite de griller des lots de 300.

---

## Lot E — Réponse BCRG + relances (bloquants externes)

Rédiger `Reponse_Retours_Validation_BCRG.md` (même format que les précédentes) :
1. **Relance référentiels** (3e demande, bloquant absolu pour M2) : F.9 types d'engagements, périodicités de remboursement, procédure/référentiel des **agences** (+ liste des codes déjà acceptés, cf. B3), classification des créances IMF (QualiCre M4).
2. **Règle officielle pour donnée indisponible** : ND rejeté en champ typé, absence rejetée en champ obligatoire → demander la convention transitoire pour `datCreat`, `rccm`, `nif`, `nifp`, `mobile`, `secActEcon` des PM (dérogation ou valeur sentinelle acceptée), en rappelant l'état du SI (RCCM porté par 74 PM sur 107 307).
3. **Annoncer les correctifs v1.6** : référence composite RefIntEng (demander confirmation du format accepté), exclusion des crédits non décaissés, troncature sigle, mobile normalisé strict, circuit ordonné PP/PM→Eng→Encours.
4. Question B4 : confirmation que les engagements non décaissés ne se déclarent pas (ou TypEve=02).

---

## Ordre d'exécution proposé

| # | Contenu | Dépendance |
|---|---|---|
| 1 | Lot C1 (refIntEng composite) + B4 (exclusion non décaissés) | aucune — à faire d'abord, structurel |
| 2 | Lot A (A1 ND→null, A2 mobile, A3 secActEcon, A4 sigle) | aucune |
| 3 | Lot D (éligibilité + circuit) + D3 contrôles | C1 |
| 4 | Lot E (réponse/relance BCRG) | s'écrit en parallèle, envoi dès 1-2 finis |
| 5 | Lot B1/B2/B3 (typEng, periodRemb, codAgce) | **référentiels BCRG** — dérivation périodicité (B2) codable dès maintenant |

Livraison : branche dédiée (ex. `feat/bcrg-v16-correctifs`), pas de migration Flyway nécessaire sauf si la table de transcodage agences (B3) est retenue en Postgres. Doc API à passer en v1.6.
