# Proposition d'implémentation — Notification des données traitées & extraction incrémentale

**Crédit Rural de Guinée S.A. — Direction des Systèmes d'Information**

*12 août 2026 — fait suite à votre demande : « prévoir une API sur laquelle on vous notifiera les données traitées ; actuellement votre API renvoie toujours toutes les données »*

---

Madame, Monsieur,

Pour répondre à votre demande, nous proposons le mécanisme suivant, articulé en deux
volets : une **API de notification** côté CRG, et le passage de nos extractions M1/M2
en **mode incrémental**. L'implémentation est réalisée et disponible sur notre
environnement de production pour vos tests (`https://digi-creditrural-io.com/bcrg`,
même clé `X-API-Key` que le reste de l'API).

## 1. Principe : le cycle « extraire → intégrer → notifier »

1. **Extraction** — votre plateforme appelle nos endpoints habituels ; par défaut,
   ils ne renvoient désormais que les **données non encore traitées** :
   ```
   GET /bcrg/personnes-physiques?page=0&size=100
   ```
2. **Intégration** — vous traitez le lot dans votre plateforme.
3. **Notification** — vous nous transmettez les références intégrées :
   ```
   POST /bcrg/traitements
   {
     "module": "PERSONNE_PHYSIQUE",
     "references": ["10200007832", "10200007833"],
     "dateTraitement": "2026-08-12T10:30:00"
   }
   ```
4. **Reboucler sur l'étape 1** (toujours `page=0`) : les références notifiées ont
   disparu du flux. Quand la liste revient vide, l'intégralité a été déclarée.

## 2. Contrat de l'API de notification

| Requête | Rôle |
|---|---|
| `POST /bcrg/traitements` | Notifier un lot de références traitées |
| `GET /bcrg/traitements/{module}` | Point de contrôle : total notifié, dernière notification |
| `DELETE /bcrg/traitements/{module}/{reference}` | Retirer une référence (elle réapparaît dans l'extraction — cas de retraitement) |

- `module` : `PERSONNE_PHYSIQUE`, `PERSONNE_MORALE` ou `ENGAGEMENT` ;
- `references` : 1 à **1000** identifiants par appel — `IdInterneClt` (modules M1)
  ou `RefIntEng` (engagements) ;
- `dateTraitement` : facultatif ;
- l'appel est **idempotent** : renvoyer une référence déjà notifiée ne crée pas de
  doublon (réponse : `referencesRecues`, `referencesNouvelles`, `referencesDejaConnues`,
  `totalTraitees`).

## 3. Comportement des extractions

- `statut=restantes` (**défaut**) : seules les données jamais notifiées sont renvoyées ;
- `statut=toutes` : extraction complète (comportement historique), utile pour une
  resynchronisation totale ;
- en mode `restantes`, `totalElements` est une estimation (total SI − références
  notifiées) ; `hasNext` reflète le parcours réel ;
- le module **M4 (encours)** reste une **photo complète** de la période d'arrêté :
  la notion de « déjà traité » ne s'y applique pas.

## 4. Points de fonctionnement

- Le suivi est persisté côté CRG (une référence notifiée reste exclue définitivement,
  sauf `DELETE` explicite de votre part) ;
- en cas de **modification ultérieure** d'un client déjà déclaré (changement d'état
  civil, nouvelle pièce...), deux options possibles — à convenir ensemble :
  soit vous retirez la référence (`DELETE`) pour re-recevoir le dossier, soit nous
  convenons ultérieurement d'un flux « modifications » dédié (`NatDec=01`) ;
- la collection **Postman v1.2** jointe contient toutes les requêtes prêtes à l'emploi
  (dossier « Traitements ») ;
- volumétrie recommandée inchangée : `size=100`, extractions séquentielles de
  préférence en dehors des heures d'affluence.

Nous restons à votre disposition pour ajuster ce contrat (nom des champs, taille des
lots, sémantique des modules) avant votre branchement définitif.

**Contact** : salifou.doucoure@creditruralgn.com — +224 621 09 18 95
