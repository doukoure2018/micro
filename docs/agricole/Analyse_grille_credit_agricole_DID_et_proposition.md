# Analyse de la grille d'analyse de crédit agricole DID-Guinée et proposition d'implémentation

*Source : `docs/agricole/Grille danalyse agricole DID-Guinée V ajusté.xlsx` — « Fiche d'analyse des demandes de crédits agricoles », proposition de Développement International Desjardins (DID), adaptation Guinée, août 2022.*
*Document établi le 31 juillet 2026.*

---

## PARTIE 1 — ANALYSE COMPLÈTE DU CLASSEUR EXCEL

### 1.1 Structure générale

Le classeur est un **outil d'instruction complet pour l'agent de crédit**, organisé en 8 étapes numérotées qui s'enchaînent (chaque feuille alimente la suivante par formule), plus des feuilles annexes de comptes d'exploitation spécialisés et deux feuilles techniques cachées (`PARAMETRAGE`, `GRILLE`) qui portent les référentiels, les barèmes et les textes de commentaires automatiques.

| Feuille | Rôle |
|---|---|
| `1. DEMANDE` | Identification du client, activité, modalités du crédit demandé, garanties proposées |
| `2. PROD` | Compte d'exploitation **production végétale** : jusqu'à 6 cultures par campagne |
| `TRFM1/2/3` | Comptes d'exploitation **transformation** (3 lignes de produits possibles) |
| `ANIMAL` | Compte d'exploitation **production animale** |
| `COMM` | Compte d'exploitation **commercialisation** (ou activité commerce) |
| `3. BILAN` | Bilan reconstitué N / N-1 + analyse des besoins réels en crédit |
| `4. BUDGET FAMILIAL` | Autres revenus et dépenses du ménage → excédent/manquant |
| `5. RESULTAT` | Compte de résultat consolidé + **8 ratios financiers** commentés automatiquement |
| `6. MATRICE` | Matrice d'analyse qualitative : 8 critères cotés de 1 à 6 avec commentaires types |
| `7. RISQUE` | Synthèse pondérée → **cote de risque globale 1 à 6** |
| `8. PROPOSITION` | Recommandation de l'AC (conditions proposées vs sollicitées), avis hiérarchie, décision comité |
| `BIENS` | Inventaire valorisé des biens (commerciaux/personnels) pour le choix des garanties |
| `PARAMETRAGE` (cachée) | Référentiels (filières, pôles PDA, zones), barèmes des ratios, textes des commentaires |

Le même classeur gère aussi les activités **non agricoles** (COMMERCE, SERVICE, ARTISANAT, INDUSTRIE) : les libellés et l'aiguillage des comptes d'exploitation s'adaptent dynamiquement au type d'activité choisi en `1. DEMANDE`.

### 1.2 Feuille 1. DEMANDE — le dossier

Sections et champs clés (au-delà de ce que la plateforme collecte déjà) :

1. **En-tête** : agence, date de demande, agent de crédit.
2. **Catégorie de clientèle** : Individuel / **Groupe** / **Groupement** (avec nom, numéro, nombre de personnes F/H) — la grille prévoit le crédit collectif.
3. **Membre/Client** : identité complète, pièce, adresse, personnes à charge, enfants scolarisés, ancienneté à l'adresse, type de propriété (identique à l'existant).
4. **Activités** :
   - Type d'activité (AGRICULTURE, COMMERCE…) → sous-activité (Production_végétale / Production_animale / Transformation / Commercialisation) → **filière** (Ananas, Riz, Anacarde… ~20 filières) ;
   - **Superficie disponible / superficie emblavée** (hectares) — ou « nombre de têtes » si production animale ;
   - **Localisation agricole** : région administrative, préfecture, **pôle de développement agricole (PDA)** A→I, village. Le pôle sélectionné affiche automatiquement les filières recommandées de la zone (référentiel des 9 pôles avec cultures et préfectures) ;
   - Autres activités et leur lieu.
5. **Modalités de la demande** : montant, durée, périodicité, taux, **période de différé**, nombre d'échéances, échéance estimée, objet (Investissement / production), détail, nouveau crédit vs renouvellement + **rang du crédit**.
6. **Garanties proposées** : 4 lignes types (Caution solidaire, Dépôt à terme, Sûretés réelles, Autre) avec description, **valeur de la garantie** et **valeur d'emprunt** (valeur pondérée) totalisée.

### 1.3 Comptes d'exploitation (2. PROD, ANIMAL, TRFM1-3, COMM)

- `2. PROD` : période de campagne (du/au), **matrice de 6 cultures** en colonnes ; par culture : type, surface (ha), détail des coûts de production (intrants, main-d'œuvre…), chiffre d'affaires, **marge brute = CA − coût de production**. Deux lignes clés supplémentaires :
  - **Évaluation de l'apport personnel en main-d'œuvre** (force de travail personnelle et familiale) — reprise ensuite dans le calcul du besoin réel ;
  - **Besoins en crédit exprimés pour la production**.
- `ANIMAL`, `TRFM1-3`, `COMM` : même canevas simplifié en lignes (éléments / unité / quantité / prix unitaire / montant) : coûts (frais variables, achats, main-d'œuvre/usinage) vs CA (ventes), marge brute signée POSITIF/NÉGATIF.
- La feuille cachée consolide : le **coût de production** et le **CA retenus** pour le compte de résultat sont aiguillés selon la sous-activité (végétale → PROD, animale → ANIMAL, transformation → somme TRFM1-3, commercialisation/commerce → COMM).

### 1.4 Feuille 3. BILAN — bilan reconstitué et besoins réels

**Bilan reconstitué** en 24 postes numérotés, colonnes N et N-1 + commentaires :
- Actif court terme (encaisse/épargne IMF, stocks, clients, autres à recevoir) ;
- Actif long terme (terres cultivables, bâtiments, moyens de transport, équipements, animaux de trait, autres) ;
- Passif court terme (fournisseurs, avances clients, intérêts à payer, autres), emprunts > 1 an ;
- **Capitaux propres = Total actif − Dettes totales** ; contrôles Total actif = Total passif ;
- **Fonds de roulement = Actif CT − Passif CT** ; **BFR = FR − Encaisse**.

**Analyse des besoins réels en crédit** (le cœur de l'aide à la décision sur le montant) :
- **Crédit investissement** : Besoins d'investissement (25) + Dépenses rattachées (26) − Apport personnel/subvention (27) = **Besoin réel investissement (28)** ;
- **Crédit production/exploitation** : Besoins pour tout le cycle (29 = coût de production consolidé) − Trésorerie disponible (30) − Stock actuel (31) − Comptes à recevoir (32) + Dettes fournisseurs (33) − Crédit fournisseur/subvention (34) − **Apport personnel en main-d'œuvre (35)** = **Besoin réel production (36)**.
- Alertes intégrées si le besoin est négatif (« Pas de besoin ») et, plus loin, si le crédit proposé dépasse ou ne couvre pas le besoin réel.

### 1.5 Feuille 4. BUDGET FAMILIAL

- **Revenus hors activité financée** : lignes (autres sources, revenus nets d'autres activités, locations…) en montant mensuel × nombre de mois = revenu attendu sur la période, avec observations.
- **Dépenses familiales** structurées en 5 blocs : alimentation (vivriers, condiments, énergie), redevances-loyer (loyer, électricité-eau, télécom), transport (commun, entretien, carburant), autres subsistances (habillement, médicaux, scolarité, autres), constructions privées.
- **Excédent / Manquant du budget familial = Total revenus − Total dépenses** — réinjecté dans la capacité de remboursement.

### 1.6 Feuille 5. RESULTAT — compte de résultat et 8 ratios

**Compte de résultat** (période n / n-1) : CA (37), coût de production (38), **marge brute (39)**, autres charges détaillées (40-49, dont amortissements, provisions, prélèvement de l'exploitant — typés via une liste), total dépenses d'exploitation (51), **bénéfice net d'exploitation (52)**, ± surplus/manquant du budget familial (53), + **réintégrations** (54 : pour un crédit investissement, la fraction de capital + amortissements/provisions réintégrés), − échéances des autres crédits en cours (55) = **Montant disponible pour le remboursement (56)**.

**Les 8 ratios d'aide à la décision** — chacun avec formule, norme, et **commentaire automatique à 5 niveaux** (Excellent / Bon / Passable / Insuffisant / Médiocre) piloté par des bornes paramétrées :

| # | Ratio | Formule | Norme | Bornes de commentaire |
|---|---|---|---|---|
| R1 | Niveau de financement | Crédit proposé / Total dépenses (invest. ou exploitation) | ≤ 65 % | ≤20 / 20-50 / 50-65 / 65-100 / >100 % |
| R2 | Capacité de remboursement | Disponible par échéance / Échéance du crédit | ≥ 1,5 | >4 / 2-4 / 1,5-2 / 1-1,5 / <1 |
| R3 | Fonds de roulement | Actif CT / Passif CT | ≥ 1,5 | >4 / 2-4 / 1,5-2 / 1-1,5 / <1 |
| R4 | Solvabilité | Dettes totales / Fonds propres | ≤ 0,5 | <0,1 / 0,1-0,5 / 0,5-1 / >1 |
| R5 | Liquidité à échéance | (Actif circulant − Stock) / Passif CT | ≥ 1 | >4 / 2-4 / 1-2 / 0,75-1 / <0,75 |
| R6 | Endettement | (Dettes totales + Crédit) / (Actif total + Crédit) | ≤ 65 % | <10 / 10-25 / 25-75 / 75-100 / >100 % |
| R7 | Consommation familiale | Dépenses familiales / Revenus totaux | 35 % < R ≤ 65 % | ≤35 / 35-65 / 65-100 / >100 % |
| R8 | Dépendance autres revenus | Autres revenus / Revenus totaux | ≤ 50 % | <0 / =0 / 0-50 / 50-100 / >100 % |

Précisions issues des formules :
- « Disponible par échéance » (R2) = Montant disponible pour remboursement (56) / **nombre d'échéances** proposé ;
- Les ratios s'appuient sur le **crédit proposé** de la feuille 8 (pas le montant demandé) — tant que la proposition n'est pas remplie, les ratios restent vides ;
- Des messages de garde s'insèrent en amont du commentaire : besoin réel négatif, capacité de remboursement négative, fonds propres négatifs, écart crédit/besoin réel (« Le crédit dépasse le besoin réel de X % » / « ne couvre pas le besoin réel ») ;
- Code couleur (commentaire du concepteur) : vert = continuer, jaune = attention, rouge = s'arrêter et approfondir.

### 1.7 Feuilles 6. MATRICE et 7. RISQUE — le scoring qualitatif

**Matrice (6. MATRICE)** : 8 critères qualitatifs, chacun apprécié par l'agent sur 6 niveaux (**Excellent=1, Très bien=2, Bien=3, Passable=4, Faible=5, Très faible=6** ; « Nouveau Client »=3 pour le critère B). Chaque niveau déclenche un **commentaire type** décrivant précisément la situation (ex. critère B : « Entre 3 et 5 crédits remboursés - Retards compris entre 60 et 90 jours »), et l'agent ajoute son commentaire libre pour justifier sa cotation.

| Critère | Pondération |
|---|---|
| A. Direction de l'activité (compétences, expérience, moralité, stabilité) | 10 % |
| B. Historique de crédits et scoring de remboursement | 10 % |
| C. Accès aux intrants | 10 % |
| D. Accès et position dans le marché | 10 % |
| E. Qualité des actifs de l'exploitation | 10 % |
| F. Production et exploitation (climat, maladies, main-d'œuvre) | **20 %** |
| G. Environnement (catégorisation A/B/C, pratiques) | 10 % |
| H. Capacité de remboursement, solvabilité, endettement (synthèse des ratios) | **20 %** |

**Synthèse (7. RISQUE)** : pondérations proposées vs **ajustées** (l'ajustement est réservé à la direction générale — commentaire du concepteur), contrôle Σ pondérations = 100 %, **cote de risque = Σ (pondération × cote)**, arrondie à l'entier supérieur → **classe de risque 1 à 6**, chacune assortie d'un texte de politique de crédit (classe 1 : « élite des producteurs… conditions favorables » ; classe 4 : « prudence, redressement possible » ; classe 6 : « fortes probabilités de défaut… valider le rejet »).

### 1.8 Feuille 8. PROPOSITION — recommandation et décision

- **Conditions sollicitées** (reprises de la demande) vs **conditions proposées par l'AC** : montant, taux, durée (mois), **différé (mois)**, nombre d'échéances, montant d'échéance (C+I), intérêts totaux = (échéance × nombre) − capital, périodicité ;
- **Ratio de couverture des garanties = Valeur d'emprunt des garanties / Crédit proposé, norme > 125 %** avec verdict automatique « Norme respectée / Hors norme » ;
- Commentaire et signature de l'AC ; **Avis du supérieur hiérarchique** ; **Décision du comité de crédit** (montant accordé, durée, taux, observations, signatures) — c'est exactement le circuit DA/DR/DE/DG déjà digitalisé sur la plateforme.

### 1.9 Feuille BIENS — évaluation des garanties potentielles

Inventaire valorisé par catégorie : terrains/constructions, matériels de transport, mobilier/matériel, stocks, biens personnels. Par bien : nature, localisation/référence, date d'acquisition, superficie, coût d'acquisition, **valeur marchande**, **% maximum applicable**, **valeur d'emprunt = valeur marchande × %**. Sert à choisir et chiffrer les garanties de la feuille 1.

### 1.10 Référentiels embarqués (PARAMETRAGE)

- **9 pôles de développement agricole (PDA)** A→I avec leurs zones (préfectures) et filières recommandées ;
- Régions administratives et préfectures de Guinée (avec sous-préfectures pour certaines) ;
- Nomenclatures : types d'activité, sous-activités, ~20 filières par sous-activité, catégories de clientèle, périodicités autorisées selon la durée, listes de charges types ;
- Barèmes des 8 ratios (bornes × 5 niveaux de commentaire) et textes des 6 classes de risque ;
- Une partie des listes provient du modèle béninois d'origine (départements du Bénin) — à ignorer dans l'implémentation.

### 1.11 Constats pour l'implémentation

1. La grille est **le pendant agricole de l'« analyse financière » individuelle existante** (bilan, flux de trésorerie, résumé) : même position dans le circuit (instruction par l'AC entre SELECTION et APPROVED), mêmes acteurs de validation ensuite.
2. Presque toute la feuille 1. DEMANDE existe déjà dans `demandeindividuel` (identité, rattachement réseau, modalités, garanties). Les **champs réellement nouveaux** sont : filière, superficies, région/préfecture/PDA/village, rang de crédit/renouvellement, catégorie de clientèle (groupe/groupement) et la valeur d'emprunt des garanties.
3. Toute l'intelligence (consolidations, besoins réels, ratios, commentaires, cote de risque) est **déterministe et paramétrée** → à implémenter comme un moteur de calcul serveur avec les barèmes en base (paramétrables), jamais en dur côté client.
4. La décision reste humaine : la grille **n'automatise pas l'octroi**, elle outille l'avis de l'AC puis le circuit de validation existant (DA → DR → DE → DG).

---

## PARTIE 2 — PROPOSITION D'IMPLÉMENTATION

### 2.1 Principe directeur

Créer un module **« Analyse agricole »** dans ecreditservice, activé quand le type d'activité de la demande est AGRICULTURE, qui remplace les volets « bilan/flux de trésorerie » génériques par le canevas DID : comptes d'exploitation par filière → bilan reconstitué + besoins réels → budget familial → compte de résultat + ratios calculés serveur → matrice de risque → synthèse → proposition. Le dossier reprend ensuite **le circuit de validation existant sans modification** (APPROVED → VALIDATED_DA → … → VALIDATED_FINAL), la synthèse DE/DG étant enrichie des ratios et de la cote de risque.

### 2.2 Modèle de données (nouvelles tables, migration Flyway)

Toutes liées à `demandeindividuel_id`, en 1-1 sauf mention :

1. **`analyse_agricole`** (en-tête, 1-1) : date d'évaluation, période de campagne (début/fin), statut (BROUILLON/SOUMISE — même mécanique que `analyse_financiere`), filière, superficie disponible/emblavée (ou nombre de têtes), région, préfecture, pole_pda (A-I), village, rang de crédit, renouvellement (bool), catégorie de clientèle + infos groupe/groupement.
2. **`agri_compte_exploitation`** (1-N) : type (PRODUCTION_VEGETALE, PRODUCTION_ANIMALE, TRANSFORMATION, COMMERCIALISATION), numéro d'ordre (cultures 1-6, TRFM 1-3), libellé (culture/produit), surface_ha ; et **`agri_ligne_exploitation`** (1-N par compte) : sens (COUT/CA), libellé, unité, quantité, prix unitaire, montant, observation. + Par compte végétal : apport personnel main-d'œuvre, besoin en crédit exprimé.
3. **`agri_bilan`** (1-1) : les 24 postes en colonnes N et N-1 (mêmes intitulés que la grille) + commentaires par poste (JSONB) ; les agrégats (actif CT/LT, dettes, capitaux propres, FR, BFR) sont **calculés, pas stockés**.
4. **`agri_besoins_credit`** (1-1) : les postes 25-27 (investissement) et 29-35 (production) saisis ; besoins réels calculés.
5. **`agri_budget_familial`** (1-N lignes) : type (REVENU/DEPENSE), catégorie (référentiel des blocs), libellé, montant mensuel, nombre de mois, observation.
6. **`agri_matrice_risque`** (8 lignes par analyse) : critère (A-H), cote (1-6, avec NOUVEAU_CLIENT pour B), commentaire agent ; la pondération appliquée est jointe depuis le paramétrage (avec possibilité d'ajustement réservée à un rôle habilité).
7. **`agri_proposition`** (1-1) : montant/taux/durée/différé/nb échéances/périodicité **proposés**, montant échéance, commentaire AC ; le comparatif avec le sollicité vient de `demandeindividuel`.
8. **`agri_bien_client`** (1-N, optionnel Lot 2) : catégorie, nature, référence, dates, coût d'acquisition, valeur marchande, % applicable, valeur d'emprunt calculée.
9. **Paramétrage** : `agri_parametre_ratio` (ratio, bornes, niveau, texte de commentaire), `agri_parametre_ponderation` (critère → poids), `agri_classe_risque` (1-6 → texte), `agri_referentiel` (filières par sous-activité, pôles PDA avec zones/filières, catégories de charges/dépenses). Seed initial = valeurs exactes de la grille DID.

Compléments sur l'existant : ajouter à la table des garanties la **valeur d'emprunt** (pondérée) si absente.

### 2.3 Moteur de calcul serveur (le cœur)

Un service `AgriAnalyseCalculService` **sans état, seule source de vérité des chiffres**, qui produit un DTO `AgriSyntheseDto` à partir des données saisies :

- consolidation des comptes d'exploitation (coût de production et CA retenus selon la sous-activité — aiguillage identique à la grille) ;
- agrégats du bilan, FR, BFR, contrôles de cohérence (actif = passif, valeurs négatives) ;
- besoins réels investissement et production (formules 28 et 36) + alertes (« pas de besoin », « le crédit dépasse le besoin réel de X % », « ne couvre pas le besoin ») ;
- budget familial (totaux, excédent/manquant) ;
- compte de résultat, réintégrations selon l'objet du crédit, **montant disponible pour le remboursement** et **disponible par échéance** ;
- les **8 ratios** avec leur niveau (5 paliers) et le commentaire paramétré + les messages de garde prioritaires (capacité négative, fonds propres négatifs…) ;
- **cote de risque pondérée** (Σ P×C, arrondi sup) → classe 1-6 + texte de politique ;
- **ratio de couverture des garanties** (norme 125 %).

Le front n'affiche que ce que renvoie ce service (recalcul à chaque sauvegarde de section) ; un **snapshot JSONB** de la synthèse est figé sur `agri_analyse` au moment de l'approbation AC pour l'auditabilité (les validateurs voient les chiffres au moment de l'avis, même si les barèmes changent ensuite).

### 2.4 API (ecreditservice, préfixe `/ecredit/agri-analyse`)

- `GET /{demandeId}` — dossier complet (toutes sections + synthèse calculée) ;
- `PUT /{demandeId}/exploitation` · `/bilan` · `/besoins` · `/budget-familial` · `/matrice` · `/proposition` — sauvegarde par section (upsert), chacune renvoyant la synthèse recalculée ;
- `GET /{demandeId}/synthese` — synthèse seule (pour le détail DA/DR/DE/DG) ;
- `PUT /{demandeId}/soumettre` — passe l'analyse en SOUMISE (préalable à l'approbation AC, réutilise le garde-fou « Dossiers à finaliser ou approuver » existant) ;
- `GET /referentiels` — filières, pôles PDA, barèmes (mis en cache) ;
- Sécurité : écriture réservée à AGENT_CREDIT (même matcher que `addDemandeInd`), lecture pour le circuit ; **ne pas oublier le `skipUrls` du TokenInterceptor** (piège déjà rencontré).

### 2.5 Frontend (Angular)

1. **Formulaire de demande** : quand Type d'activité = AGRICULTURE, afficher le bloc complémentaire (filière, superficies, région/préfecture/PDA/village avec les filières du pôle affichées en aide, rang/renouvellement) — extension du composant `nouvelle-demande` existant.
2. **Espace d'instruction agricole** (nouvelle page `dashboards/analyse-agricole/:demandeId`, accessible depuis le dossier comme l'analyse financière actuelle) : **stepper 6 étapes** reproduisant la grille — ① Comptes d'exploitation (onglets par type, tableau cultures en colonnes pour le végétal) ; ② Bilan reconstitué (N/N-1, agrégats calculés affichés en lecture seule) ; ③ Besoins réels (avec alertes) ; ④ Budget familial ; ⑤ Résultat & ratios (cartes R1-R8 avec code couleur vert/jaune/rouge et commentaires automatiques) ; ⑥ Matrice de risque (8 critères, dropdown 6 niveaux, commentaire type affiché, commentaire agent) + jauge de cote 1-6 ; puis un écran **Proposition** (comparatif sollicité/proposé, couverture des garanties, avis AC) qui débouche sur l'approbation AC existante.
3. **Synthèse validateurs** : dans le détail dossier (`credit/individuel/attente/detail`), pour une demande agricole, insérer un volet « Analyse agricole » en lecture seule (ratios, cote de risque, besoins réels vs crédit proposé, couverture garanties) à côté de la synthèse SAF existante — DA, DR, DE et DG décident sur cette base sans changement du circuit.

### 2.6 Ce qui est réutilisé tel quel

- Circuit de validation complet (états, endpoints, écrans DA/DR/DE/DG, seuil 100M, rejets/corrections) ;
- Garanties, personnes caution, documents, synthèse SAF (ancienneté, épargne, score de confiance — complémentaire du critère B de la matrice) ;
- Garde-fou anti-oubli (BROUILLON/SOUMISE), suivi global et suivi réseau DA/DR.

### 2.7 Lotissement proposé

- **Lot 1 — Socle (MVP)** : migration + référentiels, bloc agricole du formulaire de demande, comptes d'exploitation + bilan + besoins + budget familial, moteur de calcul avec les 8 ratios et commentaires, écran stepper AC. *(l'essentiel de la valeur : l'AC instruit en ligne au lieu d'Excel)*
- **Lot 2 — Scoring & proposition** : matrice de risque + cote pondérée (pondérations ajustables par la DG), écran proposition avec couverture des garanties, snapshot à l'approbation, volet synthèse pour les validateurs.
- **Lot 3 — Confort** : feuille BIENS (inventaire des garanties potentielles), export PDF de la fiche complète au format DID, statistiques par filière/pôle PDA, crédit collectif (Groupe/Groupement) si le métier le confirme.

### 2.8 Points à arbitrer avec le métier

1. **Périmètre clientèle** : la grille couvre Groupe/Groupement — le circuit actuel est individuel. Lot 1 en individuel seulement ?
2. **Pondérations et barèmes** : figés (valeurs DID) ou écran d'administration (réservé DG/DE) dès le Lot 2 ?
3. **Critère B (historique)** : proposer automatiquement la cote à partir du score de confiance SAF existant (l'agent garde la main) ?
4. **Cohabitation** : pour une demande AGRICULTURE, l'analyse agricole remplace-t-elle totalement l'analyse financière générique, ou les deux coexistent-elles ? (Recommandation : remplacement, le canevas DID inclut bilan et capacité de remboursement.)
5. **Réutilisation multi-activités** : la grille gère aussi COMMERCE/SERVICE — l'implémentation peut-elle à terme servir de canevas unique ? (L'architecture proposée le permet : l'aiguillage par type d'activité est déjà dans le moteur.)

---

*Fin du document.*
