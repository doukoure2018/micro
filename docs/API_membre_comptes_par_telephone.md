# API membre : comptes et échéances par numéro de téléphone

**Crédit Rural de Guinée S.A. · DSIG · Service Innovation et Développement**
Documentation du 15 octobre 2026 · Complément de « API membre : identité et comptes » · Lecture seule

Un troisième point d'entrée qui fait exactement ce que fait `/farmers/{codeMembre}/comptes`,
mais à partir d'un **numéro de téléphone** du membre — principal, secondaire ou autre
(`TEL_PRINCIPAL`, `TEL_SECUNDARIO`, `TEL_OTRO` de la fiche client) — au lieu de son code.

---

## 3. Comptes, crédits et échéances par téléphone

```
GET /agriculteurs/telephones/{telephone}/comptes
X-API-Key: <votre clé>
```

Même adresse de base, même clé et mêmes codes de réponse que les deux points d'entrée existants.

### Le numéro accepté

Le numéro est normalisé avant toute recherche : espaces, points, tirets et parenthèses sont
retirés, ainsi que l'indicatif `+224`, `00224` ou `224`. Il doit rester **neuf chiffres
commençant par 6**. Ces écritures désignent le même membre :

```
622451230      +224 622 45 12 30      00224622451230      622-45-12-30
```

Tout autre contenu renvoie **400** sans interroger le système bancaire. C'est voulu : dans la
base, des valeurs comme `1` ou `0000` sont portées par des milliers de fiches et ne désignent
personne.

### Un numéro, plusieurs membres

Un numéro de téléphone n'est pas un identifiant : il peut être porté par plusieurs membres
(famille, groupement, agent de collecte). La réponse est donc une **liste de membres**, chacun
avec ses comptes et ses crédits en cours, dans la structure exacte de `/farmers/{codeMembre}/comptes`.

- Les trois téléphones de la fiche sont consultés ; `champTelephone` dit sur lequel le numéro a
  été trouvé (`principal`, `secondaire`, `autre`), les membres trouvés sur le principal d'abord.
- Seuls les membres qui ont **au moins un compte de crédit ou de remboursement, ou un crédit en
  cours** sont servis ; un membre qui porte le numéro sans rien de cela n'est pas listé.
- Au-delà de **20 membres** pour un même numéro (numéro collectif : certains sont portés par plus
  de mille fiches), seuls les **20 premiers** sont listés, avec leur code, leur nom et leur agence
  **sans leurs comptes** ; `nombreMembres` donne le total, `comptesNonLus` vaut `true` et le
  `message` invite à passer par `/farmers/{codeMembre}/comptes`.

### Champs de la réponse

| Champ | Sens |
|---|---|
| `telephone` | Le numéro cherché, normalisé (9 chiffres) |
| `nombreMembres` | Nombre de membres qui portent ce numéro en téléphone principal |
| `comptesNonLus` | `true` si le seuil est dépassé et que les comptes n'ont pas été lus |
| `membres[]` | Un membre par ligne : `codeMembre`, `nomMembre`, `codeAgence`, `libelleAgence`, `champTelephone`, puis `comptes` et `creditsEnCours` — mêmes champs que dans `/farmers/{codeMembre}/comptes` |
| `message` | `null`, ou « Aucun membre avec ce numero », ou l'explication du seuil |

### Exemple de réponse

```json
{
  "telephone": "622451230",
  "nombreMembres": 1,
  "comptesNonLus": false,
  "membres": [
    {
      "codeMembre": "0322000202659",
      "nomMembre": "DIALLO MAMADOU SALIOU",
      "codeAgence": "322",
      "libelleAgence": "COYAH",
      "champTelephone": "principal",
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
          "numeroCredit": 541437, "libelleTypeCredit": "CREDIT AGRICOLE",
          "montantAccorde": 5000000, "capitalRestantDu": 4250000, "montantEcheance": 1480000,
          "dateOuverture": "2026-09-23", "dateEcheanceFinale": "2027-03-22",
          "statut": "En cours de remboursement", "compteRemboursement": "32201400202660",
          "prochainesEcheances": [
            { "numeroEcheance": 1, "dateEcheance": "2026-10-22", "montant": 1480000,
              "capital": 1000000, "interets": 480000, "resteAPayer": 1480000,
              "etat": "A_ECHOIR", "joursRetard": 0 }
          ],
          "nbEcheancesRestantes": 5, "resteTotalAPayer": 7400000
        }
      ]
    }
  ],
  "message": null
}
```

### Réponses et erreurs

| Code | Situation | Ce qu'il faut faire |
|---|---|---|
| **200** | Succès | Lire `membres`. Aucun membre, ou seuil dépassé : liste vide ou sans comptes, avec un `message` — **ce n'est pas une erreur** |
| **400** | Numéro invalide | Vérifier le numéro : 9 chiffres commençant par 6, indicatif +224 accepté |
| **401** | Clé absente, erronée ou révoquée | Vérifier l'en-tête `X-API-Key` |
| **503** | Système bancaire momentanément indisponible | Réessayer plus tard |
| **502** | Erreur inattendue en amont | Signaler à la DSIG avec l'heure de l'appel |

---

## Deux points à savoir

- **Les trois téléphones de la fiche sont consultés.** Un même numéro peut donc ressortir
  comme « principal » chez un membre et « autre » chez un autre : `champTelephone` le dit.
- **Chaque appel est journalisé** (numéro, nombre de membres trouvés et servis). Ce point
  d'entrée expose des soldes à partir d'une donnée plus facile à deviner qu'un code membre :
  la clé d'API reste strictement personnelle.

---

*Pour toute question : Direction des Systèmes d'Information, Service Innovation et Développement.*
