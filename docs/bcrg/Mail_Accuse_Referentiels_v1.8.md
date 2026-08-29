# Mail — Accusé de réception des référentiels + intégration (API v1.8)

> Destinataires : équipe technique plateforme BCRG (Nerhy Group)
> ✅ v1.8 déployée en production le 29/08/2026 — mail prêt à l'envoi (vérifier le CD avant envoi)

---

**Objet : CRG — Référentiels bien reçus et intégrés (API v1.8) : types d'engagements F.9, périodicités, agences, classification des créances — 4 points à confirmer**

Madame, Monsieur,

Nous vous remercions pour la transmission des référentiels (types/natures/catégories
d'engagements, périodicités, agences, classification des créances IMF, formes juridiques,
secteurs d'activités et institutionnels, pays, devises, garanties, participants). Ils ont
été **intégralement intégrés** : la **version 1.8** de l'API est déployée sur
`https://digi-creditrural-io.com/bcrg` (mêmes URL et clé `X-API-Key`). Les modules
Engagements et Encours émettent désormais exclusivement des codes de vos référentiels.

---

## 1. Ce qui a été intégré

| Champ | Traitement v1.8 |
|---|---|
| `TypEng` | Transcodé au **référentiel F.9** depuis le libellé du type de crédit de notre SI : `011` escompte, `012` habitat, `013` exportation, `014` équipement, `015` consommation, `016` trésorerie, `0161` découvert, repli `017` autres. Tous nos engagements relèvent de la nature `01` (crédits), catégorie `01` (avec échéanciers) |
| `PeriodRemb` | Codes officiels dérivés du plan de remboursement : `01` échéance unique, `02` mensuelle, `03` trimestrielle, `04` semestrielle, `05` annuelle |
| `CodAgce` | Code du **référentiel agences** (participant GN/101, 182 agences), apparié automatiquement par libellé d'agence — voir point 2.2 |
| `QualiCre` | Classification officielle des créances IMF : `21` saines, `22` impayées (1 à 360 j), `24` autres créances en souffrance (> 360 j) — voir point 2.3 |
| `SectInst` | ISBL corrigé en `04` (nous émettions `040`) ; `032` particuliers et `022` autres SNF confirmés |
| `FormeJuridique` / `SecActEcon` | Nos transcodifications validées contre vos référentiels F.7 et secteurs d'activités (ONG désormais assimilée à `33` Association) |
| Pays / devises | `GN` / `GNF` confirmés |

Les données peuvent être **re-soumises dès maintenant** selon le circuit ordonné décrit
dans notre précédent courrier (personnes → notification → engagements → notification →
encours).

## 2. Quatre points nécessitant votre confirmation

### 2.1 Périodicités hebdomadaire et quinzaine absentes du référentiel

Le référentiel des périodicités ne comporte ni cadence **hebdomadaire** ni **quinzaine**,
pourtant courantes en microfinance. En transitoire, ces crédits sont déclarés en
périodicité **mensuelle (`02`)**. Merci de confirmer ce rapprochement, ou de nous indiquer
si des codes dédiés seront ajoutés.

### 2.2 Appariement des agences — et observation sur le contrôle actuel

Vos codes agences (001..182) diffèrent de nos codes internes : la correspondance est faite
**par libellé d'agence**. Une agence non appariée est journalisée de notre côté et `CodAgce`
est omis — nous vous transmettrons la liste des éventuels écarts après la première
extraction complète, pour arbitrage (renommages, agences récentes).

**Observation** : lors de la soumission du 20/08, 50 engagements portant nos codes internes
avaient **passé** le contrôle `codAgce` — ces codes correspondaient en réalité à des agences
d'**autres participants** (GN/002). Le contrôle ne semble pas vérifier que l'agence
appartient au participant déclarant ; nous vous le signalons à toutes fins utiles.

### 2.3 Classification des créances — code 23 et données comptables

Le code `23` (créances restructurées ou rééchelonnées) n'est pas dérivable de notre système
de gestion des crédits : il ne sera pas émis en régime transitoire. La qualification est
dérivée du nombre de jours de retard de la plus ancienne échéance impayée (`21`/`22`/`24`).

### 2.4 Référentiel des moyens de remboursement vide

Le fichier des moyens de remboursement transmis ne contient que l'en-tête (aucune valeur).
Dans l'attente, `MoyRemb` reste à `01` (débit de compte, notre convention précédente).
Merci de nous transmettre les valeurs de ce référentiel.

---

Sauf objection de votre part sur les points ci-dessus, nous considérons le dispositif prêt
pour une **nouvelle campagne de soumission complète**. Nous restons disponibles pour une
séance de travail si vous souhaitez valider ensemble les tables de correspondance
(types de crédit → F.9, agences).

Bien cordialement,

**L'équipe technique — Crédit Rural de Guinée S.A.**
