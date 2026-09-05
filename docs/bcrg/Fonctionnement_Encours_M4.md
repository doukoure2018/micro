# Fonctionnement de l'encours (module M4) — note explicative

*Crédit Rural de Guinée — API de déclaration réglementaire BCRG · 5 septembre 2026*

Cette note explique, pas à pas, pourquoi `/bcrg/encours` peut renvoyer un `content` vide
alors que l'extraction fonctionne, et comment le remplir.

## 1. Les trois acteurs

- **SAF2000** : le système bancaire, qui contient tous les crédits (~52 000 ouverts ou non décaissés) ;
- **Notre API** (`/bcrg/...`) : elle extrait les données de SAF et les met au format BCRG ;
- **Le SIC de la BCRG** : la plateforme du partenaire, qui intègre nos données chez lui.

## 2. La règle de fond : pas d'encours sans engagement connu

Le SIC raisonne en deux temps :

1. **L'engagement** (module M2) = la fiche d'identité du crédit : qui a emprunté, combien,
   à quel taux, sur quelle durée. Elle se déclare **une seule fois**.
2. **L'encours** (module M4) = la situation chiffrée de ce même crédit à une date
   d'arrêté : capital restant dû, impayés, échéances payées/restantes. Elle se déclare
   **chaque mois**.

Si on envoie au SIC l'encours d'un crédit dont il n'a jamais reçu l'engagement, il le
rejette (erreur **LOG008**) — il reçoit des chiffres sur un dossier qu'il ne connaît pas.

## 3. Le circuit complet (le cœur du mécanisme)

```
Étape 1 : GET /bcrg/engagements
          → le partenaire récupère les engagements (réf. ex : 102540631)

Étape 2 : il les intègre dans son SIC

Étape 3 : POST /bcrg/traitements  (module ENGAGEMENT)
          → il NOUS notifie : « ces références sont intégrées chez moi »
          → notre API mémorise ces références (table bcrg_donnee_traitee)

Étape 4 : GET /bcrg/encours?periode=AAAA-MM
          → notre API ne restitue QUE les crédits dont la référence
            a été mémorisée à l'étape 3
```

L'étape 3 est la clé : **c'est la notification du partenaire qui « ouvre le robinet » de
l'encours, crédit par crédit**. Tant qu'il ne notifie rien, l'encours ne montre rien —
c'est voulu, pour lui éviter de recevoir des encours qu'il serait obligé de rejeter.

## 4. Les deux modes de `/encours`

| Mode | Ce qu'il renvoie | À quoi ça sert |
|---|---|---|
| `filtre=declares` (défaut) | Uniquement les crédits notifiés à l'étape 3 | Le flux normal de déclaration mensuelle |
| `filtre=aucun` | Tous les crédits éligibles, sans condition | Contrôle/audit : vérifier que l'extraction fonctionne |

Un crédit est **éligible** à l'encours s'il est ouvert : capital restant dû > 0, **ou**
montant approuvé non entièrement décaissé (hors bilan, `MntHBil` > 0). Un crédit soldé ou
clôturé n'émet jamais d'encours (règle BCRG v1.3).

## 5. Cas rencontré le 05/09/2026 : « content vide » sur le mode par défaut

Le partenaire avait notifié **64 engagements lors de ses tests d'août** (agence 102
Coyah, anciennes références au format concaténé `10231480` = `102` + `31480`). Depuis,
**ces 64 crédits ont été entièrement remboursés**. L'API répond donc :

- `totalElements: 64` → « j'ai 64 références autorisées » ;
- `content: []` → « aucune n'a plus rien à déclarer » (crédits soldés).

Ce n'est pas une panne : c'est la photo exacte de la réalité. Le même appel avec
`filtre=aucun` renvoie des pages pleines (~52 000 crédits), preuve que l'extraction
fonctionne. **Pour remplir le mode par défaut : notifier des engagements actuels**
(références actuelles type `102540631`) via `POST /bcrg/traitements`.

## 6. Le rôle de `periode`

`periode=2026-09` ne veut pas dire « donne-moi les données de septembre ». Ça veut dire :
« calcule la situation des crédits **arrêtée au 30 septembre** » — capital restant dû,
impayés, dernier paiement sont calculés à cette date (champ `DatEvent`/`DatArr` de la
réponse). Changer la période change les calculs, **pas la liste des crédits**. Il n'y a
donc pas de « bonne » ou « mauvaise » période.

## 7. Ce que la v1.12 a changé (et seulement ça)

Avant : l'API parcourait la photo complète page par page et masquait les crédits non
notifiés → plus de 5 000 pages presque toutes vides. Depuis la v1.12 : elle pagine
**directement sur la liste des références notifiées** → `totalElements` = nombre de
notifications, pages denses. Le rapprochement accepte tous les formats historiques de
référence (concaténé `10231480`, composite avec tiret `102-31480`, numéro nu). Le fond du
mécanisme (étapes 1 à 4) n'a pas bougé.

---

**En une phrase** : l'encours est un robinet fermé par défaut ; chaque
`POST /traitements` du partenaire ouvre le robinet pour un crédit ; la période choisit la
date de la photo, pas les crédits.
