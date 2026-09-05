# Mail d'annonce v1.12 — Encours (M4)

**Objet : API Centrale des Risques — v1.12 : réponse à votre question sur l'encours (content vide) et amélioration de la pagination**

---

Madame, Monsieur,

Suite à votre retour concernant le module M4 (encours) — champ `content` vide pour les périodes 2026-06 à 2026-09 —, nous vous apportons les précisions suivantes ainsi qu'une amélioration de l'API, déployée ce jour.

## 1. Sur les périodes

Toutes les périodes que vous avez testées sont valides. Le paramètre `periode` (format `AAAA-MM`) fixe la **date d'arrêté** des calculs (champ `DatArr`, échéances, impayés, dernier paiement) mais **ne filtre pas les données** : l'API restitue la photo des engagements ouverts, arrêtée à la fin du mois demandé. Il n'y a donc pas de « bonne » ou « mauvaise » période.

## 2. Sur le `content` vide

Le comportement observé venait du filtre par défaut `filtre=declares` : conformément à la règle du SIC (un encours portant sur un engagement inconnu est rejeté — LOG008), l'encours ne restitue que les crédits dont **l'engagement a été notifié « traité » via `POST /bcrg/traitements` (module ENGAGEMENT)**. À ce jour, 64 engagements ont été notifiés de votre côté : les pages de la photo complète ne contenant aucun de ces 64 crédits ressortaient vides.

## 3. Amélioration déployée (v1.12)

Pour rendre ce parcours praticable, la pagination du mode filtré porte désormais **directement sur le sous-ensemble des engagements notifiés traités** :

- `totalElements` = nombre d'engagements notifiés traités (64 actuellement), et non plus le volume de la photo complète ;
- les pages sont denses : avec `size=10`, vos 64 engagements tiennent en 7 pages, contre plus de 5 000 pages auparavant ;
- une page peut exceptionnellement contenir moins de `size` éléments si un engagement notifié est devenu inextractible (crédit soldé entre-temps) : le champ `hasNext` fait foi.

Exemple :

```
GET /bcrg/encours?periode=2026-09&page=0&size=10
→ totalElements: 64, totalPages: 7, content: 10 encours
```

Le mode `filtre=aucun` (photo complète, à des fins de contrôle) reste disponible et inchangé.

## 4. Conduite à tenir

Le circuit reste celui de la documentation : extraction des engagements (`GET /bcrg/engagements`) → intégration au SIC → notification (`POST /bcrg/traitements`, module ENGAGEMENT) → l'encours (`GET /bcrg/encours`) se remplit automatiquement au fur et à mesure de vos notifications.

La documentation de l'API a été mise à jour en version 1.12 en ce sens.

Nous restons à votre disposition pour toute question ou test complémentaire.

Cordialement,

**Salifou Doukouré**
Chef Service Innovation et Développement
Crédit Rural de Guinée S.A.
