# Credit Money — Parcours utilisateur Token Advance

## 🎬 En une phrase

> Un client EDG ouvre l'app **Credit Money**, choisit un montant d'avance dans le nouveau parcours "Token Advance", confirme avec son wallet Credit Money, et reçoit un token EDG à recharger dans son compteur. Plus tard, il rembourse sa dette via le même wallet pour pouvoir redemander une avance.

---

## 📌 Contexte technique — qui fait quoi

L'application **Credit Money** propose déjà un parcours de **recharge directe** (achat de tokens EDG avec son propre argent, via l'intégration EDG existante). Le nouveau parcours **"Token Advance"** documenté ici ajoute la possibilité d'acheter **à crédit** — pour les clients qui n'ont pas immédiatement les fonds disponibles.

**Architecture côté application** :
- 📱 **App mobile Credit Money** → parle uniquement à **l'API backend CRG**
- 🖥 **Backend CRG** → orchestre toute la logique externe en coulisses :
  - Récupère les offres de crédit auprès de **Finergi**
  - Génère le **token EDG** via l'intégration EDG existante (la même que pour la recharge directe)
  - Notifie ensuite Finergi avec le token généré pour créer le prêt

Du point de vue du développeur mobile, **il n'y a qu'un seul interlocuteur** : l'API CRG. Tout ce qui se passe au-delà est invisible et géré par l'équipe backend.

```
       ┌────────────────────┐
       │  📱 App mobile     │
       │   Credit Money     │
       └──────────┬─────────┘
                  │  ◀── Périmètre mobile
                  │      (seul lien à coder)
                  ▼
       ┌────────────────────┐
       │  🖥 Backend CRG    │
       │   (orchestrateur)  │
       └─────┬──────────┬───┘
             │          │
             │          │  ◀── Invisible côté mobile
             ▼          ▼
       ┌─────────┐  ┌─────────┐
       │   EDG   │  │ Finergi │
       │ (token) │  │ (prêt)  │
       └─────────┘  └─────────┘
```

> 🔑 **Point clé** : le token reçu par l'app mobile est **généré par CRG via EDG**, strictement identique au format des tokens du parcours "Recharge directe" existant. Le développeur mobile peut **réutiliser le même composant UI d'affichage**.

---

## 🚶 Le parcours complet — pas à pas

### 🔹 Étape 1 — Connexion à l'app

Le client ouvre l'application **Credit Money** sur son téléphone. Il utilise sa session existante (login Credit Money déjà en place) — aucune nouvelle authentification n'est nécessaire pour le parcours Token Advance.

### 🔹 Étape 2 — Choix du parcours

Sur l'écran d'accueil, le client voit son **solde Credit Money** et **deux gros boutons d'action** :
- ⚡ **Avance Tokens** — pour acheter de l'électricité **à crédit** (nouveau)
- 💰 **Rembourser** — pour solder un prêt en cours

Il appuie sur **Avance Tokens**.

### 🔹 Étape 3 — Saisie des informations

L'écran suivant lui demande de confirmer :
- Son **numéro de compteur EDG** (ex: `09993421569`)
- Son **numéro de téléphone** (ex: `+224 612 123 123`)

Les deux champs sont pré-remplis avec les dernières valeurs utilisées dans Credit Money.

### 🔹 Étape 4 — Affichage des offres disponibles

L'app interroge l'**API backend CRG** pour récupérer les offres d'avance disponibles pour ce compteur. Quelques options s'affichent, par exemple :

| Montant total | Token reçu | Frais (15%) |
|---|---|---|
| 3 300 GNF | 2 805 GNF | 495 GNF |
| 6 700 GNF | 5 695 GNF | 1 005 GNF |
| **10 000 GNF** | **8 500 GNF** | **1 500 GNF** |

Le client choisit le montant qu'il veut emprunter. Plus le montant est élevé, plus le token reçu est gros.

### 🔹 Étape 5 — Récapitulatif et confirmation

Un écran récapitulatif lui montre exactement ce qu'il va devoir rembourser plus tard. La source de remboursement est automatiquement son **wallet Credit Money** (aucune sélection MTN / Orange / Cellcom — le wallet est intégré dans l'app).

L'écran affiche :
- Le détail des montants (token reçu, frais, total à rembourser)
- Le **solde actuel de son wallet Credit Money** (pour qu'il sache qu'il pourra rembourser plus tard)
- Un seul bouton **"Confirmer l'avance"**

### 🔹 Étape 6 — Traitement

L'app affiche un écran de chargement pendant environ 5 secondes. Pendant ce temps, en arrière-plan, le **backend CRG** orchestre les opérations dans cet ordre :
1. Récupère les détails de l'offre choisie auprès de Finergi
2. **Génère le token EDG** via son intégration EDG existante (la même que pour la recharge directe), en utilisant le `tokenAmount` de l'offre
3. **Notifie Finergi** avec le token généré et l'identifiant de l'offre pour créer le prêt côté Finergi
4. Renvoie le token à l'app mobile

Côté mobile, c'est totalement transparent : un seul appel à l'API CRG, qui retourne directement le token.

### 🔹 Étape 7 — Token reçu

🎉 L'écran de succès affiche le **token à 16 chiffres généré par EDG** :

```
1234 · 5678 · 9012 · 3456 · 7890
```

> 📌 **Note importante** : ce token est généré par CRG via son intégration EDG (même méthode que la recharge directe). Il est strictement identique au format des tokens du parcours **"Recharge directe"** existant — le client le saisit dans son compteur EDG normalement.

Le client peut le **copier d'un appui** et aller le saisir dans son compteur EDG. La dette correspondante est désormais inscrite à son nom dans le système Finergi via l'API CRG.

---

## 💸 Plus tard — le remboursement

### 🔹 Étape 8 — Vue de la dette

Quelques jours plus tard, le client revient dans l'app et appuie sur **"Rembourser"** depuis l'accueil. Il voit clairement :
- Le **montant restant à rembourser** : 10 000 GNF
- La **date d'échéance** : dans 365 jours
- Les détails du prêt initial

L'app a récupéré ces informations en appelant l'API CRG à l'ouverture de l'écran.

### 🔹 Étape 9 — Choix du montant

Il peut choisir de rembourser :
- **25%** (2 500 GNF)
- **50%** (5 000 GNF)
- **Totalité** (10 000 GNF)

La source de paiement est **automatiquement son wallet Credit Money**. L'app affiche le solde disponible pour qu'il vérifie qu'il a assez.

### 🔹 Étape 10 — Confirmation du paiement

Il appuie sur **"Confirmer le paiement"**. L'app envoie la requête à l'API backend CRG, qui :
- Débite le wallet Credit Money du montant choisi
- Notifie le système de prêt
- Confirme à l'app

Aucune interaction avec MTN, Orange ou Cellcom — tout reste dans l'app.

### 🔹 Étape 11 — Dette soldée

🎉 L'écran de succès confirme :
- ✅ **Prêt remboursé**
- Référence du paiement
- Bouton **"Demander une avance"** redevient disponible

Le cycle peut recommencer.

---

## 🚦 États particuliers (cas réels)

### Le client a déjà une dette en cours

S'il appuie sur **"Avance Tokens"** alors qu'une dette n'est pas soldée :

> ⚠️ **Dette en cours**
> Tu as 10 000 GNF à rembourser. Solde ton prêt actuel pour pouvoir en demander un nouveau.
> [ Rembourser maintenant ]

L'app le redirige vers le flux de remboursement.

### Le client n'a pas de connexion

Si Internet est instable au moment de la confirmation :

> ❌ **Connexion impossible**
> Vérifie ta connexion internet, puis réessaie. Aucune somme n'a été débitée.
> [ Réessayer ]

⚠️ Important : ne **jamais** retry automatiquement une opération de paiement — risque de double débit. Toujours demander à l'utilisateur de confirmer.

### Le compteur n'est pas éligible

Si le compteur saisi n'est pas autorisé aux avances :

> ⚠️ **Compteur non éligible**
> Ce compteur ne peut pas bénéficier d'avances pour le moment. Contacte le support CRG.
> [ Contacter le support ]

---

## ⏱ Durée totale du parcours

| Étape | Durée typique |
|---|---|
| Ouverture app | ~1 seconde (session déjà active) |
| Saisie compteur + msisdn | ~5 secondes |
| Chargement des offres | ~2 secondes |
| Choix offre + confirmation | ~10 secondes |
| Génération token | ~5 secondes |
| **Total Token Advance** | **~25 secondes** |
| **Total Remboursement** | **~20 secondes** |

Parcours optimisé pour les réseaux 3G de Guinée, avec très peu de saisie utilisateur (numéros pré-remplis depuis le profil Credit Money).

---

## 🎯 Points clés à retenir pour le développement mobile

1. **Un seul interlocuteur** — l'app mobile appelle uniquement l'API backend CRG. Aucun appel à des systèmes externes (EDG, partenaire de crédit, MNO).
2. **Auth simplifiée** — session Credit Money existante + API Key statique entre mobile et backend CRG.
3. **Pas de saisie manuelle des montants** — le client choisit parmi des offres pré-calculées.
4. **Wallet intégré** — paiement et remboursement directement depuis le wallet Credit Money. Aucun écran MTN / Orange / Cellcom à coder.
5. **Le token affiché est un vrai token EDG** — réutiliser le composant UI du parcours "Recharge directe" existant.
6. **Pas de retry automatique sur les paiements** — risque de double débit, toujours faire confirmer à l'utilisateur.
