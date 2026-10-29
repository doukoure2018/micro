# Courriel à envoyer à KUMY

**Objet :** Tableau de bord DE — les onze compléments sont livrés, et une bonne nouvelle sur les filières

**Pièce jointe :** `kumy-tableau-de-bord-de.md` (documentation des API)

---

Bonjour,

Faisant suite à votre demande du 14 octobre et à votre message de dimanche, **les onze compléments
d'API que vous attendez pour le tableau de bord de la Direction de l'exploitation sont en
production.** Vous pouvez commencer vos développements sans attendre.

La documentation complète est en pièce jointe. Voici l'essentiel, et les trois points qui
demandent votre attention.

## Ce qui est disponible

La ligne de portefeuille porte désormais, en plus des champs existants qui n'ont pas bougé : les
jours de retard, le montant impayé, la prochaine échéance, l'attendu et le payé du mois, l'agent
gestionnaire, et la filière agricole.

Cinq nouvelles routes s'y ajoutent :

- **`/portfolio`** — le portefeuille national paginé jusqu'à 500 lignes, filtrable par délégation
- **`/demandes`** — vos 9 849 dossiers de crédit avec leur étape et leur date de décision
- **`/sorties`** — les crédits sortis du portefeuille entre deux dates
- **`/historique`** — la série mensuelle par point de vente, treize mois disponibles
- **`/referentiels/activites`** et **`/agencies/{code}/agents`** — les référentiels

## Trois points qui demandent votre attention

### 1. La filière existe — nous nous étions trompés

Nous vous avions indiqué le 26 octobre que la notion de filière n'existait nulle part. **C'est
inexact**, et nous tenons à le corriger : SAF porte un référentiel d'activités à trois niveaux, et
le troisième niveau **est** la filière. Il compte **109 filières distinctes**, dont **53 sous
l'activité agricole** — céréale riz, arachide, ananas, anacarde, palmier à huile, maraîchage,
élevage bovin et porcin, pomme de terre…

Surtout, cette information est **réellement renseignée** : sur les 4 988 crédits agricoles vivants,
4 955 portent leur filière, soit **99,3 %**.

Chaque ligne de portefeuille porte donc sa filière, et le référentiel complet est exposé. Il n'y a
plus de table de correspondance à construire : vous pouvez agréger par filière directement.

Les premières filières du portefeuille vivant : céréale riz (1 198 crédits, 8,61 Md GNF), pomme de
terre (453), élevage bovin (259), arachide (227). Nous attirons votre attention sur le premier
poste, **« AUTRES CULTURES » avec 1 381 crédits et 8,78 Md GNF** : la Direction de l'exploitation
examine s'il s'agit d'une habitude de saisie à redresser plutôt que d'une réalité agronomique.

### 2. L'encours des mois passés n'est pas fourni, et c'est délibéré

L'historique mensuel distingue deux sources, indiquées dans chaque ligne par le champ `source` :

- **`PHOTO`** — les mois que la plateforme observe elle-même, à partir d'octobre 2026. L'encours
  est celui de SAF.
- **`RECONSTITUTION`** — les mois antérieurs, recalculés. **L'encours y est volontairement vide.**

Nous avons vérifié s'il était possible de reconstituer l'encours passé à partir des échéanciers.
Sur les 5 181 crédits agricoles vivants, le solde réel totalise 46,73 milliards quand le capital
des échéanciers en donne 27,62, soit **41 % d'écart** — le différé étant la norme en crédit
agricole, l'échéancier ne reflète pas le solde. Nous avons préféré un champ vide à un chiffre faux
de quatre dixièmes, qui aurait de surcroît créé une rupture visible le jour où la photo prend le
relais.

Ce qui **est** reconstitué fidèlement sur les douze mois passés, parce que cela repose sur des dates
réelles — ouverture, échéance, règlement, clôture : la production, les sorties datées, le PAR 30 et
le PAR 90 en nombre de crédits, et le montant dû non réglé. La série d'encours, elle, démarre en
octobre 2026 et s'enrichira d'un mois chaque mois.

Une réserve de lecture sur les mois reconstitués : les crédits que SAF a clôturés **sans date de
clôture** ne peuvent pas être situés dans le temps et sont donc absents des mois passés. Les
effectifs reconstitués sont à ce titre un plancher. Nous avons vérifié la portée de ce biais sur la
période qui vous intéresse : ces crédits sans date ont été ouverts pour l'essentiel entre 2007 et
2019, et une centaine seulement depuis 2023 — l'effet sur les douze derniers mois est donc
négligeable, et la tendance ci-dessous est solide.

À titre indicatif, ce que la série montre déjà : les impayés du réseau agricole sont passés de
6,18 milliards en octobre 2025 à **2,40 milliards en octobre 2026**, et le nombre de crédits en
PAR 30 de 945 à 192.

### 3. L'heure de lecture — à confirmer de votre côté

Les chiffres SAF que sert cette API proviennent de la **sauvegarde restaurée chaque matin vers
07 h 15 GMT**, et non de la base de production : un crédit mis en place aujourd'hui apparaît demain
matin. Vous nous aviez indiqué une lecture nocturne — à 2 h du matin, elle verrait les données de
**l'avant-veille**.

Nous recommandons donc une **lecture entre 09 h et 22 h GMT**. Pour que ce point ne repose jamais
sur une supposition, chaque réponse porte désormais la date exacte des données, dans l'en-tête
`X-Donnees-SAF-Au` et dans le champ `donneesSafAu`.

Merci de nous confirmer l'horaire que vous retiendrez.

## Deux limites à connaître avant de construire vos écrans

- **Les sorties de portefeuille ne sont pas exhaustives.** SAF ne date que les crédits clôturés, et
  seulement une partie : 56 151 clôtures datées contre 45 485 sans date. Les crédits passés en perte
  et les transferts n'ont jamais de date. La route `/sorties` répond donc à « les sorties du mois »,
  mais ne constitue pas le total des sorties.
- **Deux codes de point de vente sont partagés dans SAF** — 337 et 958, chacun porté par deux points
  de service. Les 185 autres sont uniques. Nous avons saisi l'exploitation SAF ; d'ici là, ces deux
  codes agrègent deux points de service.

Nous avons également posé à l'exploitation SAF la question du sens des états `N` et `R`
(6 915 crédits), aujourd'hui marqués « à classer » dans le dictionnaire que nous vous exposons.

## Session de présentation

Nous sommes disponibles pour la séance que vous proposez. Nous vous suggérons :

- *[à compléter : créneau 1]*
- *[à compléter : créneau 2]*

Côté Crédit Rural : *[à compléter : participants]*.

Nous proposons d'y couvrir la documentation ci-jointe, vos questions d'intégration, et les points
restant à arbitrer avec la Direction de l'exploitation — le regroupement des filières et le fichier
d'objectifs annuels, que la route `/objectifs` attend.

Restant à votre disposition,

Cordialement,

**Direction du Système d'Information et de la Gestion**
Crédit Rural de Guinée
