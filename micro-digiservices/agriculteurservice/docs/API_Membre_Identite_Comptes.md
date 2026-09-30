# API membre : identité et comptes

**Crédit Rural de Guinée S.A. · DSIG · Service Innovation et Développement**
Documentation du 30 septembre 2026 · Version en production · Lecture seule

Deux points d'entrée qui, à partir du code membre, renvoient l'identité et les contacts d'un
client, puis ses comptes, ses crédits en cours et ses prochaines échéances.

---

## Avant de commencer

| | |
|---|---|
| **Adresse de base** | `https://digi-creditrural-io.com/agriculteurs` |
| **Authentification** | En-tête `X-API-Key` sur chaque appel. Sans clé valable, la réponse est **401**. |
| **Méthode** | `GET` uniquement. Ces deux points d'entrée ne modifient rien. |
| **Format** | JSON, UTF-8. Dates au format `AAAA-MM-JJ`, montants en francs guinéens sans séparateur. |
| **Code membre** | Le numéro du client dans le système, par exemple `0322000202659`. |

> La clé d'API est transmise séparément. Elle ne doit figurer ni dans un dépôt de code, ni dans
> une adresse, ni dans un message non chiffré.

---

## 1. Identité et contacts d'un membre

```
GET /agriculteurs/farmers/{codeMembre}/identite
X-API-Key: <votre clé>
```

Renvoie l'état civil du membre et ses moyens de contact. Le nom complet et les numéros de
téléphone viennent de la fiche client ; le nom et le prénom séparés de la fiche personne
physique, quand le membre en est une. Une personne morale porte sa raison sociale à la place.

### Champs de la réponse

| Champ | Sens |
|---|---|
| `nomComplet` | Nom tel qu'il est enregistré, en un seul champ |
| `nom`, `prenom` | Séparés ; vides pour une personne morale |
| `typePersonne` | Personne physique ou Personne morale |
| `raisonSociale` | Renseignée pour une personne morale |
| `sexe`, `nationalite`, `profession` | Issus de la fiche personne physique |
| `codeAgence`, `libelleAgence` | Agence de rattachement |
| `dateAdhesion` | Date d'entrée du membre |
| `telephonePrincipal`, `telephoneSecondaire`, `telephoneAutre` | Les trois numéros ; `null` quand le champ est vide |
| `telephones` | Liste ne contenant que les numéros réellement renseignés |
| `sansTelephone` | **Vrai si le membre n'a aucun numéro.** Champ à utiliser pour repérer les injoignables |
| `adresses` | Adresses déclarées, avec province, préfecture et district |
| `message` | « Membre introuvable » si le code ne correspond à personne ; `null` sinon |

### Exemple de réponse

```json
{
  "codeMembre": "0322000202659",
  "nomComplet": "DIALLO MAMADOU SALIOU",
  "nom": "DIALLO",
  "prenom": "MAMADOU SALIOU",
  "typePersonne": "Personne physique",
  "sexe": "M",
  "nationalite": "GUINEENNE",
  "profession": "AGRICULTEUR",
  "codeAgence": "322",
  "libelleAgence": "COYAH",
  "dateAdhesion": "2024-03-12",
  "telephonePrincipal": "622451230",
  "telephoneSecondaire": null,
  "telephoneAutre": null,
  "telephones": ["622451230"],
  "sansTelephone": false,
  "adresses": [
    { "type": "1", "detail": "Quartier Kagbelen", "province": "Kindia",
      "prefecture": "Coyah", "district": "Kagbelen" }
  ],
  "message": null
}
```

---

## 2. Comptes, crédits et échéances

```
GET /agriculteurs/farmers/{codeMembre}/comptes
X-API-Key: <votre clé>
```

Renvoie les deux comptes qui portent la vie d'un crédit, puis les crédits encore en
remboursement avec leurs prochaines échéances.

### Les deux comptes

| Type | Rôle |
|---|---|
| `CREDIT` | Compte sur lequel le montant du crédit a été versé au membre |
| `REMBOURSEMENT` | Compte que le membre alimente, et sur lequel les échéances sont prélevées |

Le numéro de compte se lit en trois blocs : **trois chiffres d'agence, trois de produit, huit de
séquence**. Ainsi `32200800202659` est le compte de crédit de l'agence 322, et `32201400202660`
le compte de remboursement du même membre.

Chaque compte porte son solde disponible, son solde réservé, son solde bloqué, son statut, sa
date d'ouverture et celle du dernier mouvement. **Le solde du compte de remboursement est la
provision disponible** pour la prochaine échéance.

### Les crédits en cours

| Champ | Sens |
|---|---|
| `capitalRestantDu` | Capital restant dû sur le crédit |
| `montantEcheance` | Montant d'une échéance |
| `compteRemboursement` | Compte sur lequel les échéances sont prélevées |
| `prochainesEcheances` | Les **cinq premières échéances restant à payer**, les plus proches d'abord. Une échéance déjà soldée n'y figure pas |
| `… etat` | `A_ECHOIR` si la date est à venir, `IMPAYEE` si elle est passée |
| `… joursRetard` | Nombre de jours de retard, zéro si l'échéance est à venir |
| `nbEcheancesRestantes` | Nombre total d'échéances non soldées, au-delà des cinq listées |
| `resteTotalAPayer` | Somme restant due sur l'ensemble du plan |

### Exemple de réponse

```json
{
  "codeMembre": "0322000202659",
  "nomMembre": "DIALLO MAMADOU SALIOU",
  "comptes": [
    { "numeroCompte": "32200800202659", "type": "CREDIT", "produit": "CC008",
      "codeAgence": "322", "libelleAgence": "COYAH", "statut": "Actif",
      "dateOuverture": "2026-09-23", "soldeDisponible": 0 },
    { "numeroCompte": "32201400202660", "type": "REMBOURSEMENT", "produit": "CC014",
      "codeAgence": "322", "libelleAgence": "COYAH", "statut": "Actif",
      "dateOuverture": "2026-09-23", "dernierMouvement": "2026-09-28",
      "soldeDisponible": 250000, "soldeReserve": 0, "soldeBloque": 0 }
  ],
  "creditsEnCours": [
    {
      "numeroCredit": 541437,
      "libelleTypeCredit": "CREDIT AGRICOLE",
      "montantAccorde": 5000000,
      "capitalRestantDu": 4250000,
      "montantEcheance": 1480000,
      "dateOuverture": "2026-09-23",
      "dateEcheanceFinale": "2027-03-22",
      "statut": "En cours de remboursement",
      "compteRemboursement": "32201400202660",
      "prochainesEcheances": [
        { "numeroEcheance": 1, "dateEcheance": "2026-10-22", "montant": 1480000,
          "capital": 1000000, "interets": 480000, "resteAPayer": 1480000,
          "etat": "A_ECHOIR", "joursRetard": 0 }
      ],
      "nbEcheancesRestantes": 5,
      "resteTotalAPayer": 7400000
    }
  ],
  "message": null
}
```

---

## Réponses et erreurs

| Code | Situation | Ce qu'il faut faire |
|---|---|---|
| **200** | Succès | Lire la réponse. Un membre sans compte ou introuvable renvoie aussi 200, avec une liste vide et un `message` : **ce n'est pas une erreur** |
| **401** | Clé absente, erronée ou révoquée | Vérifier l'en-tête `X-API-Key` |
| **400** | Requête mal formée | Vérifier le code membre |
| **503** | Système bancaire momentanément indisponible | Réessayer plus tard. Les clôtures bancaires rendent la base inaccessible quelques minutes |
| **502** | Erreur inattendue en amont | Signaler à la DSIG avec l'heure de l'appel |

---

## Trois points à savoir

- **Toujours interroger l'identité avant une campagne de rappel.** Le champ `sansTelephone`
  évite de tester trois champs séparément et donne directement la liste des membres injoignables.
- **Un membre peut avoir plusieurs crédits en cours.** Le tableau `creditsEnCours` en porte alors
  plusieurs, chacun avec ses propres échéances.
- **Les données sont lues en direct dans le système bancaire.** Il n'y a pas de cache : ce que
  renvoie l'appel est l'état du moment.

---

*Pour toute question : Direction des Systèmes d'Information, Service Innovation et Développement.*
