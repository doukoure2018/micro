DIGI-CRG · Analyse de crédit · Proposition

# Le score de confiance : ce qu'il mesure aujourd'hui, ce qu'il devrait mesurer

La page « Analyse de crédit » affiche déjà un score de confiance tiré de l'historique SAF du membre. Il est calculé à la volée, jamais conservé, jamais confronté à ce qui s'est réellement passé ensuite — et il traite un nouveau membre comme un défaillant. Cette note explique le calcul actuel, relève sept constats vérifiés dans le code, et propose une version 2 : expliquée, mémorisée, calibrée.

Page analysée/dashboards/credit/analyse-credit

Date5 novembre 2026

Source du calcule-banking · CreditosServiceImpl

StatutProposition, à arbitrer

I · État des lieux

## Ce que fait la page aujourd'hui

Une recherche par numéro de membre. La réponse vient de SAF2000 en quatre blocs : les crédits, leurs échéanciers, un résumé par crédit, et une « évaluation de risque » calculée au passage.

1 · InterfaceSaisie du numéro de membreanalyse-credit.component

2 · E-créditRelais vers e-bankingGET /ecredit/seachCreditos/{membre}

3 · E-bankingLecture SAF : crédits + échéanciersobtenerCreditosYPlanPagosPorCliente

4 · CalculScore à la volée, non conservécalcularEvaluacionRiesgo

**Le calcul actuel, en clair.** Toutes les échéances échues du membre, tous crédits confondus, sont notées une par une selon leur retard. Les échéances des 18 derniers mois comptent double. Le score est le rapport entre les points obtenus et les points possibles.

| Retard de l'échéance | Points | Lecture |
| --- | --- | --- |
| 0 à 5 jours | 100 | Respectée (tolérance de 5 jours) |
| 6 à 30 jours | 70 | Léger retard |
| 31 à 90 jours | 40 | Retard sérieux |
| Plus de 90 jours, payée | 10 | Régularisée très tard |
| Plus de 90 jours, jamais payée | 0 | Impayée à ce jour |

Cinq niveaux en sortent : **≥ 90** très faible risque · **≥ 75** faible · **≥ 60** modéré · **≥ 40** élevé · en dessous, très élevé. Sans aucune échéance échue, le résultat est « INDÉTERMINÉ », score 0, risque 100 %.

Le principe est sain — une notation graduée du retard, pondérée par la récence, sur tout l'historique — et nettement meilleur que la version binaire qu'il a remplacée. Les problèmes sont ailleurs : dans ce que le score ne dit pas, dans ce qu'il ne retient pas, et dans la façon dont il est affiché.

II · Constats

## Sept constats, tous vérifiés dans le code

1. 01

   ### Un nouveau membre est affiché comme un défaillant grave

   Sans historique, le service renvoie score 0 et risque 100 %. Sur l'écran de détail du dossier, la pastille passe au rouge dès que le score est sous 40 : un premier emprunteur arrive donc devant son DA avec « Score 0/100 » en rouge. Dans une institution de crédit rural, c'est le cas le plus fréquent — et c'est exactement le profil qu'on ne veut pas pénaliser par construction.

   CreditosServiceImpl : scoreConfiance(ZERO) · detail.component.html l.385 : score ≥ 40 sinon 'danger'
2. 02

   ### Deux calculs différents pour le même membre grave

   Il existe deux implémentations. Celle de la page note les *échéances* (tolérance 5 jours, paliers 30/90, récence 18 mois). Celle de la lecture SAF directe note les *crédits* entiers (tolérance 15 jours, paliers 60/180, récence 24 mois). Un même membre peut obtenir deux scores et deux niveaux selon l'écran qui l'interroge. Le DA ne sait pas lequel il regarde.

   calcularEvaluacionRiesgo (l.604) vs calcularEvaluacionRiesgoDesdeCreditos (l.435)
3. 03

   ### Rien n'est conservé : le score n'a pas de mémoire grave

   Le score est recalculé à chaque consultation et n'est écrit nulle part. Conséquences : on ne sait pas quel score le DA a vu le jour où il a décidé ; on ne peut pas vérifier si les membres notés « élevé » en 2025 ont réellement fait défaut en 2026 ; on ne peut pas suivre la dégradation d'un membre dans le temps. Un score jamais confronté aux faits n'est pas un score, c'est une opinion.
4. 04

   ### Les couleurs de niveau ne s'affichent pas visible

   Le gabarit compare le niveau à `MODERE`, `ELEVE`, `TRES_ELEVE` ; le serveur renvoie `MODÉRÉ`, `ÉLEVÉ`, `TRÈS ÉLEVÉ`. Seul « FAIBLE » est coloré ; « TRÈS FAIBLE » et les trois niveaux de risque restent en noir. La méthode correcte existe dans le composant mais le gabarit ne l'appelle pas.

   analyse-credit.component.html l.418-423 · getRiskLevelColorClass() non utilisée
5. 05

   ### Des seuils différents d'un écran à l'autre cohérence

   Le serveur découpe à 90/75/60/40. L'écran de détail du dossier recolore à 70/40. La synthèse DE a sa propre règle. Trois lectures du même nombre.
6. 06

   ### Une échéance de 50 000 GNF pèse autant qu'une de 5 millions méthode

   La notation compte des échéances, pas des montants. Un membre qui a réglé en retard de petites traites de fin de crédit est noté comme celui qui a laissé l'essentiel du capital impayé. Le score ne voit pas non plus les restructurations : un crédit soldé le jour où un autre s'ouvre ressemble à un crédit remboursé.
7. 07

   ### Le score ne s'explique pas crédit par crédit lisibilité

   Le détail par crédit est prévu dans le DTO mais commenté. Le DA voit un pourcentage et deux phrases ; il ne voit pas *quel* crédit a fait baisser la note, ni quelles échéances. Il ne peut donc ni contester ni confirmer ce qu'il lit — et seul SAF est regardé : ce que digi sait déjà du membre (dossier annulé, demande refusée, numéro de membre incohérent, caution) n'entre pas dans le calcul.

   EvaluationRisqueDTO : detailsParCredit en commentaire

III · Proposition

## Score de confiance v2 : un calcul, quatre composantes, une classe

Quatre principes : un seul calcul pour tous les écrans ; un score qui s'explique composante par composante ; un état « nouveau membre » distinct du défaut ; un score conservé, pour pouvoir un jour prouver qu'il prédit quelque chose.

Ponctualité · 60

Profondeur · 15

Situation · 15

digi · 10

### Ponctualité des remboursements 60 points

Le cœur du calcul actuel, conservé, avec deux corrections : chaque échéance pèse son **montant** (une traite de 5 M compte cent fois plus qu'une de 50 000), et la récence reste à double poids sur 18 mois.

- Paliers inchangés : 100 / 70 / 40 / 10 / 0 points.
- Restructuration détectée (crédit soldé à ± 3 jours de l'ouverture d'un autre, même membre) : les échéances du crédit soldé sont notées comme impayées à la date de clôture.

### Profondeur de la relation 15 points

Ce qui manque aujourd'hui : la différence entre « je ne sais rien » et « je sais que c'est mauvais ». Un membre qui a soldé trois crédits en dix ans n'est pas un inconnu.

- Aucun crédit soldé : 0 · un : 8 · deux : 12 · trois et plus : 15.
- Bonus d'ancienneté intégré : relation de plus de cinq ans, +3 plafonnés à 15.

### Situation courante 15 points

L'état des crédits en cours aujourd'hui, indépendamment du passé : c'est ce qui pèsera sur la capacité de rembourser le nouveau crédit demandé.

- Aucune échéance impayée : 15 · retard \< 30 j : 8 · 30 à 90 j : 3 · plus : 0.
- Taux d'endettement SAF (encours restant / crédit demandé) affiché à côté, non noté.

### Signaux digi 10 points

Ce que la plateforme sait déjà et que SAF ignore. Aucun signal : 10 points. Chaque signal en retire.

- Dossier annulé pour désistement dans les 12 mois : −3.
- Demande refusée dans les 12 mois : −4.
- Numéro de membre incohérent avec SAF, ou pièces corrigées plus de deux fois : −3.

**Deux règles dures, au-dessus du score.** Un crédit passé en perte ou déclaré en contentieux place le membre en classe E quel que soit le total. Une restructuration détectée plafonne le score à 60 et l'écrit en clair. Le score prépare, le DA décide — il ne bloque jamais seul.

A85 – 100Historique excellent, aucune réserve

B70 – 84Bon, retards légers isolés

C55 – 69À surveiller, analyse renforcée conseillée

D40 – 54Fragile, visite et caution exigées

E\< 40Défaillant ou en contentieux

NnouveauAucun historique SAF : pas un score, un état

La classe N remplace l'actuel « INDÉTERMINÉ 0 % ». Elle s'affiche en gris, jamais en rouge, avec la mention « premier crédit — analyse sur pièces et visite ». Les mêmes lettres que le score des agents de crédit, déjà connues des DA.

IV · Ce que verra l'agent

## L'historique rendu lisible : une frise par crédit

Le tableau actuel liste les échéances ; il ne montre pas la trajectoire. Une frise par crédit — un point par échéance, teinté par le retard — fait voir en une seconde si le membre s'améliore ou se dégrade. Exemple sur deux crédits.

À l'heure 6–30 jours 31–90 jours Impayée à ce jour Non échue

Sous la frise, la lecture que le DA attend : **« Classe C · 61 »**, puis trois lignes au plus — *Ponctualité 38/60 : deux échéances impayées sur le crédit en cours (38 et 68 jours). Profondeur 12/15 : deux crédits soldés depuis 2021. Signaux digi 10/10 : aucun.* Le détail par crédit, déjà prévu dans le DTO, est simplement réactivé.

Sur l'écran de décision (DA, DR, DE), la même classe et les mêmes trois lignes remplacent la pastille actuelle. Classe C, D, E ou N : la mention « analyse renforcée » apparaît, sans rien bloquer.

V · Mémoire et calibrage

## Conserver le score pour pouvoir le juger

**Une table, deux écritures.** `score_confiance_historique` — membre, date, score, classe, les quatre composantes, la version de l'algorithme, et le dossier concerné quand le calcul a lieu pendant une instruction. Écrite à chaque consultation depuis un écran de décision, et par une photo mensuelle de tous les membres ayant un crédit en cours, la nuit, dans la sauvegarde SAF plutôt qu'en production.

**Ce que cela rend possible, dans l'ordre.**

| Usage | Question à laquelle on peut enfin répondre | Quand |
| --- | --- | --- |
| Traçabilité | Quel score le DA avait-il sous les yeux le jour de la décision du dossier 7425 ? | Dès le lot 2 |
| Test rétrospectif | Parmi les crédits octroyés en 2025, les membres notés D ou E ont-ils fait plus de PAR90 que les A et B douze mois après ? De combien ? | Lot 2, sur l'historique SAF |
| Calibrage | Les seuils 85/70/55/40 séparent-ils réellement les comportements, ou faut-il les déplacer ? | Après le test, puis chaque année |
| Portefeuille | Quelle est la répartition des classes par agence et par agent ? Où se concentrent les D et E ? | Lot 3 |
| Alerte | Quels membres sont passés de B à D ce mois-ci ? | Lot 3 |

Le test rétrospectif est le point qui change tout : il peut se faire **sans attendre**, puisque SAF contient déjà les échéanciers de 2025 et leur sort en 2026. On calcule le score tel qu'il aurait été fin 2025, on regarde ce qui s'est passé, et on sait si le score vaut quelque chose avant de le mettre devant les DA.

VI · Réalisation

## Quatre lots, du plus urgent au plus structurant

Lot 0\
1 à 2 jours

### Corriger ce qui trompe déjà

Couleurs des niveaux (accents), seuils unifiés dans une fonction unique partagée par les trois écrans, remplacement de « INDÉTERMINÉ 0 % » par l'état « Nouveau membre » en gris, suppression de la double implémentation au profit du calcul par échéances.

Lot 1\
1 semaine

### Score v2 et historique lisible

Les quatre composantes, la pondération par montant, la détection de restructuration, les classes A–E et N, le détail par crédit réactivé, la frise par crédit sur la page et les trois lignes d'explication sur les écrans de décision.

Lot 2\
1 semaine

### Mémoire et test rétrospectif

Table d'historique, écriture à la consultation et photo mensuelle, puis le test sur les crédits 2025 : rapport chiffré de la capacité du score à séparer les bons des mauvais payeurs, et ajustement des seuils si les chiffres l'exigent.

Lot 3\
à planifier

### Portefeuille et décision

Répartition des classes par agence et par agent dans l'écran portefeuille à risque, alerte de dégradation mensuelle, règle d'analyse renforcée inscrite dans le circuit, et — quand la consultation sera ouverte — enrichissement par la centrale des risques BCRG.

### Trois points à arbitrer avant le lot 1

1. **Les poids 60 / 15 / 15 / 10** sont une proposition de départ ; le test rétrospectif du lot 2 dira s'ils tiennent. Faut-il les figer maintenant ou attendre le test ?
2. **La pondération par montant** favorise mécaniquement les petits crédits en retard. Est-ce le comportement voulu, ou faut-il un plancher par échéance ?
3. **Les signaux digi** font entrer dans le score des décisions internes (refus, annulation). Un refus de 2025 doit-il encore peser en 2027 ? Douze mois est une proposition.

Score de confiance · analyse et proposition · DIGI-CRG Service Innovation et Développement · 5 novembre 2026