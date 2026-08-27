# Mail — Réponse aux rapports d'erreurs de validation du 20/08/2026 (v1.6/v1.7) + relance référentiels

> Destinataires : équipe technique plateforme BCRG (Nerhy Group)
> ✅ v1.6 et v1.7 déployées en production le 27/08/2026 — mail prêt à l'envoi

---

**Objet : CRG — Rapports d'erreurs de validation du 20/08 : correctifs (API v1.6), nouvelles API par identifiants (v1.7) et demande de référentiels indispensables (types d'engagements, périodicités, agences)**

Madame, Monsieur,

Nous espérons que vous allez bien, et vous remercions pour les rapports d'erreurs de
validation transmis suite à la soumission du 20/08/2026 (fichiers `personnemorale`,
`engagement`, `beneficiaire` et `encoursengagement`). Nous les avons analysés ligne à
ligne : l'ensemble des anomalies relevant de notre périmètre est **corrigé dans la
version 1.6 de l'API** (mêmes URL `https://digi-creditrural-io.com/bcrg` et clé
`X-API-Key`). Trois familles d'erreurs nécessitent en revanche des **éléments de votre
côté** — en particulier les référentiels demandés dans nos précédents échanges et
toujours en attente — sans lesquels les modules Engagements et Encours ne pourront pas
passer votre validation. Le détail suit.

---

## PARTIE 1 — Correctifs appliqués (API v1.6)

### 1.1 Personnes morales

| Erreur constatée | Traitement appliqué |
|---|---|
| `nifp` SYN003 ×300, `datCreat` SYN004 ×300, `rccm` SYN001 ×269 — valeur `ND` | Nous avons constaté que votre validation contrôle la **syntaxe avant l'obligation** : la convention `ND` (donnée non portée par notre SI), actée lors de nos échanges de mi-août, est rejetée dans les champs typés. En v1.6, `ND` est **retiré de tous les champs typés** (dates, montants, taux, téléphones, codes de référentiels) : la donnée non portée y est désormais **omise (`null`)**. Voir le point d'arbitrage § 2.3 |
| `mobile` OBL002 ×285 | Recherche élargie aux **téléphones secondaires** de notre SI (trois champs sources au lieu d'un). Le reliquat sans aucun numéro relève d'une collecte terrain — voir § 2.3 |
| `mobile` SYN003 ×7 | Normalisation durcie : seul un numéro ramenable au format `+224` + 9 chiffres est transmis ; les numéros historiques à 8 chiffres ou étrangers non conformes ne sont plus émis |
| `secActEcon` OBL002 ×272 | Le champ étant obligatoire pour une personne morale, un **code de repli transitoire `O`** (services collectifs, sociaux et personnels — notre clientèle PM est dominée par les associations et groupements) est émis lorsque l'activité est absente de notre SI ou non transcodable. Les libellés non transcodés sont journalisés pour enrichir progressivement notre table de correspondance |
| `sigle` SYN001 ×11 (longueur > 50) | Sigle tronqué à 50 caractères |

### 1.2 Engagements et bénéficiaires

| Erreur constatée | Traitement appliqué |
|---|---|
| `dateMEP` OBL002/SYN003/SYN004 ×22 | Ces 22 crédits n'ont **jamais été décaissés** (aucune date de mise en place). Ils sont désormais **exclus du module Engagements** — merci de confirmer ce traitement (§ 2.4) |
| `periodRemb` SYN002 ×300 | La périodicité est désormais **dérivée du plan de remboursement** (écart moyen entre échéances). Dans l'attente de votre référentiel des périodicités (§ 2.1), nous émettons des codes transitoires documentés : `01` hebdomadaire, `02` quinzaine, `03` mensuel, `04` trimestriel, `05` semestriel, `06` annuel, `07` échéance unique. Le recalage sur vos codes officiels sera immédiat à réception |
| `typEng` SYN002 ×300 | **Bloqué de notre côté** : sans le référentiel F.9 des types d'engagements (§ 2.1), aucune transcodification n'est possible ; nous émettons le code de notre SI en transitoire |
| `codAgce` SYN002 ×250 | **Bloqué également** : nos codes agences ne sont pas connus de votre plateforme (§ 2.2). À noter : 50 engagements sur 300 n'ont **pas** déclenché cette erreur — certaines de nos agences semblent donc déjà référencées chez vous |
| `idIntBen` SYN002 ×300 (bénéficiaire inconnu) | Cause : des engagements soumis avant l'acceptation des personnes correspondantes. En v1.6 l'API **applique l'ordre du circuit** : `/engagements` ne sert par défaut que les engagements dont le bénéficiaire nous a été **notifié comme traité** (`POST /bcrg/traitements`, modules PP/PM). Voir § 1.4 |

### 1.3 Encours (LOG008 ×300 « aucun engagement trouvé »)

Deux causes, toutes deux corrigées :

1. **Référence interne non unique** : notre numéro de crédit est unique **par agence**,
   pas globalement — les références de l'encours soumis (333 à 2793) et celles des
   engagements déclarés (540407 à 540885) provenaient d'agences différentes. En v1.6,
   la référence d'engagement devient **composite** :
   **`RefIntEng = <codeAgence>-<numéroCrédit>`** (exemple : `102-540631`), **identique
   entre le module Engagements (y compris le sous-objet Bénéficiaires) et le module
   Encours**. Le détail d'un engagement se lit désormais
   `GET /engagements/{codeAgence}-{numéro}`. Merci de confirmer que ce format vous
   convient (§ 2.5).
2. **Ordre de soumission** : `/encours` ne restitue plus par défaut que les engagements
   déjà notifiés comme traités (paramètre `filtre=declares`, défaut ; `filtre=aucun`
   pour la photo complète d'audit).

### 1.4 Circuit de soumission recommandé

Pour éviter tout rejet de dépendance, le cycle à respecter est :

1. **Personnes** : `GET /personnes-physiques` et `/personnes-morales` (statut=restantes)
   → intégration → `POST /bcrg/traitements` (références acceptées) ;
2. **Engagements** : `GET /engagements` (ne sert que les bénéficiaires déjà notifiés)
   → intégration → `POST /bcrg/traitements` (module ENGAGEMENT, références composites) ;
3. **Encours** : `GET /encours?periode=AAAA-MM` (limité par défaut aux engagements
   notifiés). En mode filtré, une page peut contenir moins de `size` éléments : le
   parcours se poursuit tant que `hasNext` est vrai.

---

## PARTIE 2 — Éléments attendus de votre côté (bloquants pour les modules M2/M4)

### 2.1 Référentiels non transmis (3e demande)

Demandés dans nos courriers précédents et indispensables pour lever les erreurs SYN002
résiduelles, nous restons en attente de :

1. le **référentiel F.9 des types d'engagements** (champ `TypEng` — 300 rejets) ;
2. le **référentiel des périodicités de remboursement** (champ `PeriodRemb` — 300 rejets) ;
3. le **référentiel de classification des créances des IMF** (champ `QualiCre` du module
   Encours, actuellement dérivé du nombre de jours de retard en codes transitoires).

Nos transcodifications sont prêtes à être recalées dès réception — le délai
d'intégration de notre côté sera de quelques jours au plus.

### 2.2 Référentiel et procédure d'enregistrement des agences

250 engagements sur 300 ont été rejetés sur `codAgce` (« donnée inexistante dans le
référentiel agences ») — mais 50 sont passés. Merci de nous transmettre :

- la **liste des codes agences du CRG actuellement connus** de votre plateforme ;
- la **procédure d'enregistrement** des agences manquantes (ou le référentiel cible si
  une transcodification est attendue de notre côté). Notre réseau compte une
  quarantaine d'agences ; nous pouvons vous transmettre la table complète
  (code, libellé, localisation) sans délai.

### 2.3 Règle officielle pour la donnée indisponible dans le SI

Vos contrôles rejettent `ND` en erreur de **syntaxe** dans les champs typés, et
l'absence de valeur en champ **obligatoire manquant** : il n'existe donc aujourd'hui
aucune modalité conforme pour déclarer une donnée qui n'existe pas dans notre système.
Sont concernés côté personnes morales : `DatCreat`, `RCCM`, `NIF`, `NIFP` (notre SI ne
porte pas ces informations — le RCCM n'est saisi que pour 74 clients sur 107 307
personnes morales), ainsi que `Mobile` et `SecActEcon` pour le stock historique.

Nous proposons l'un des traitements suivants, à votre convenance :

- une **dérogation transitoire** (champ omis accepté pour les IMF, avec plan
  d'enrichissement progressif — la collecte RCCM/NIF est un chantier que le CRG peut
  engager sur les dossiers actifs) ; ou
- une **valeur sentinelle** conforme à vos contrôles syntaxiques, que vous nous
  préciseriez par champ.

### 2.4 Engagements jamais décaissés

Merci de confirmer qu'un crédit accordé mais **jamais mis en place** (aucun
décaissement) ne doit **pas** être déclaré en module Engagements — c'est le traitement
appliqué en v1.6. S'il doit l'être en « demande d'engagement » (`TypEve = 02`), nous
l'implémenterons dans une version ultérieure.

### 2.5 Format de la référence composite

Merci de confirmer que le format **`<codeAgence>-<numéroCrédit>`** (chiffres, séparateur
tiret, longueur ≤ 15) est accepté pour `RefIntEng` — et, le cas échéant, la longueur
maximale et les caractères autorisés par votre middleware.

---

## PARTIE 3 — Nouvelles API « par identifiants » (v1.7)

Conformément à votre demande de ce jour (récupération des personnes morales par liste
d'identifiants, et passage des identifiants dans le corps de la requête plutôt que dans
l'URL), les endpoints suivants sont disponibles :

| Requête | Description |
|---|---|
| `POST /bcrg/personnes-physiques/par-ids` — corps `{"ids": ["id1", "id2", ...]}` | **Recommandé** : personnes physiques par liste d'identifiants internes (1 à 200 par appel), identifiants dans le payload |
| `POST /bcrg/personnes-morales/par-ids` — corps `{"ids": ["id1", "id2", ...]}` | **Nouveau** : personnes morales par liste d'identifiants internes (1 à 200 par appel) |
| `GET /bcrg/personnes-physiques/par-ids?ids=id1,id2,...` | Conservé pour compatibilité |
| `GET /bcrg/personnes-morales/par-ids?ids=id1,id2,...` | Variante GET du nouvel endpoint |

Les variantes `POST` évitent les limites de longueur d'URL sur les gros lots ; les
réponses sont identiques à celles des extractions paginées (mêmes contrats M1). Au-delà
de 200 identifiants, la requête est refusée en `400` — merci de découper vos lots.

---

## Disponibilité

Les versions 1.6 et 1.7 sont déployées sur `https://digi-creditrural-io.com/bcrg` (documentation
technique mise à jour transmise sur demande). Les données précédemment soumises et
rejetées peuvent être re-extraites immédiatement selon le circuit du § 1.4 — les
références d'engagement ayant changé de format, aucune collision avec les soumissions
antérieures n'est possible.

Nous restons à votre entière disposition pour une séance de travail technique sur les
référentiels et la règle de la donnée indisponible, qui sont désormais les deux seuls
préalables à une intégration complète.

Bien cordialement,

**L'équipe technique — Crédit Rural de Guinée S.A.**
