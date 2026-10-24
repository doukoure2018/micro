# Modèle de courriel au partenaire

À adapter avant envoi : le nom du destinataire, le délai de retour, et le canal retenu pour la clé.
Joindre `API_Membre_Identite_Comptes.md`, ou le lien de la page si vous préférez.

---

**Objet :** Mise à disposition de deux nouvelles interfaces : identité et comptes d'un membre

---

Bonjour [Prénom Nom],

Nous avons mis en service deux nouvelles interfaces sur l'API que vous utilisez déjà. Elles
complètent les routes existantes sans en modifier aucune : vos intégrations actuelles continuent de
fonctionner à l'identique.

**Ce que ces interfaces apportent**

La première renvoie, à partir du code membre, l'identité du client et ses moyens de contact : nom et
prénom séparés, type de personne, agence de rattachement, les trois numéros de téléphone et les
adresses déclarées. Un indicateur signale directement un membre sans aucun numéro, ce qui évite de
tester les champs un à un lors d'une campagne de rappel.

La seconde renvoie les comptes du membre avec leurs soldes, ainsi que ses crédits en cours de
remboursement. Pour chaque crédit, elle donne le capital restant dû, le compte sur lequel les
échéances sont prélevées, et les cinq premières échéances restant à payer avec leur état, à échoir
ou impayée, et le nombre de jours de retard le cas échéant.

**Les adresses**

```
GET /agriculteurs/farmers/{codeMembre}/identite
GET /agriculteurs/farmers/{codeMembre}/comptes
```

Elles s'utilisent comme les autres : même adresse de base, même en-tête d'authentification, même
format de réponse. La documentation ci-jointe détaille chaque champ et donne un exemple de réponse
complet pour chacune.

**Authentification**

Votre clé actuelle donne accès à ces deux routes, il n'y a rien à demander ni à renouveler. Si vous
avez besoin d'une nouvelle clé, elle vous sera transmise par un canal distinct de ce courriel.

**Deux points à connaître**

Un membre introuvable, ou sans compte, ne renvoie pas une erreur mais une réponse en succès avec une
liste vide et un message explicite. Il n'y a donc pas lieu de traiter ce cas comme un incident.

Les données sont lues en direct dans notre système bancaire, sans cache : ce que renvoie l'appel est
l'état du moment.

**Ce que nous attendons de vous**

Pourriez-vous procéder à vos essais d'intégration et nous confirmer d'ici le [date] que les réponses
correspondent à vos besoins ? Si un champ manque ou si un format vous pose difficulté, dites-le nous
à ce stade : il est plus simple d'ajuster maintenant qu'une fois l'intégration en place.

Nous restons à votre disposition pour toute précision.

Cordialement,

**Salifou Doukouré**
Chef du Service Innovation et Développement
Direction des Systèmes d'Information
Crédit Rural de Guinée S.A.

---

## Variante courte

Si vous préférez un message bref, par messagerie instantanée ou en relance :

> Bonjour [Prénom],
>
> Deux nouvelles routes sont disponibles sur l'API, avec votre clé actuelle :
> `/agriculteurs/farmers/{codeMembre}/identite` pour l'identité et les contacts d'un membre, et
> `/agriculteurs/farmers/{codeMembre}/comptes` pour ses comptes, ses crédits en cours et ses
> prochaines échéances.
>
> La documentation est en pièce jointe. Les routes existantes ne changent pas. Pouvez-vous nous
> confirmer après vos essais que cela répond à votre besoin ?
>
> Merci, bien cordialement.

---

## Rappels avant d'envoyer

- **Ne jamais écrire la clé d'API dans le courriel.** Si une clé doit être transmise, utiliser un
  canal distinct et prévenir le destinataire par un autre moyen.
- Joindre `API_Membre_Identite_Comptes.md`, ou son équivalent en PDF si votre correspondant préfère.
- Remplacer `[date]` par un délai réaliste, deux semaines conviennent généralement pour une
  intégration de cette taille.
- Mettre en copie la personne qui suit la relation côté Crédit Rural, afin que le suivi ne repose
  pas sur une seule boîte.
