# CRG × Finergi — Parcours Utilisateur

## 🎬 En une phrase

> Un client EDG ouvre l'app CRG, saisit son numéro de compteur et son téléphone, choisit un montant d'avance, paye via Mobile Money, et reçoit un token à recharger dans son compteur. Plus tard, il rembourse sa dette via le même app pour pouvoir redemander une avance.

---

## 📌 Contexte technique — qui fait quoi

L'application **CRG Credit Money** propose déjà un parcours de **recharge directe** (le client achète des tokens EDG avec son propre argent via une API EDG existante). Le nouveau parcours **"Token Advance"** documenté ici **n'utilise pas l'API EDG directement** depuis l'app mobile — il passe entièrement par **Finergi**.

**Architecture côté serveur** :
- 📱 **App mobile** → parle uniquement à **Finergi** (1 seul interlocuteur)
- 🏢 **Finergi** → gère le prêt (crédit, dette, remboursement) ET appelle EDG en backend (B2B) pour générer le token
- ⚡ **EDG** → produit le vrai token cryptographique de recharge (seul EDG peut le faire)

> Le token reçu dans l'app est un **vrai token EDG**, généré par EDG, transité par Finergi. Il est strictement identique au format des tokens du parcours "Recharge directe" existant — le client le saisit dans son compteur EDG de la même façon.

```
            App mobile CRG
                   │
                   │ 1 seul appel API
                   ▼
              Finergi
              /      \
             /        \  (interactions B2B en backend,
            ▼          ▼   invisibles pour l'app mobile)
          EDG       Mobile Money
        (génère    (encaisse / 
        le token)   débite)
```

---

## 🚶 Le parcours complet — pas à pas

### 🔹 Étape 1 — Connexion à l'app

Le client ouvre l'application **CRG Energy** sur son téléphone. L'application l'identifie automatiquement (session sauvegardée) et récupère silencieusement un jeton d'authentification auprès de Finergi en arrière-plan.

### 🔹 Étape 2 — Saisie des informations

Sur l'écran d'accueil, le client voit son **solde actuel** et deux gros boutons :
- ⚡ **Avance Tokens** — pour acheter de l'électricité à crédit
- 💰 **Rembourser** — pour solder un prêt en cours

Il appuie sur **Avance Tokens**. L'écran suivant lui demande de confirmer :
- Son **numéro de compteur EDG** (ex: `09993421569`)
- Son **numéro de téléphone** (ex: `+224 612 123 123`)

Les deux champs sont pré-remplis avec les dernières valeurs utilisées.

### 🔹 Étape 3 — Choix de l'offre

L'app interroge Finergi pour récupérer les **offres disponibles** pour ce compteur. Quelques options apparaissent, par exemple :

| Montant total | Token reçu | Frais (15%) |
|---|---|---|
| 3 300 GNF | 2 805 GNF | 495 GNF |
| 6 700 GNF | 5 695 GNF | 1 005 GNF |
| **10 000 GNF** | **8 500 GNF** | **1 500 GNF** |

Le client choisit le montant qu'il veut emprunter. Plus le montant est élevé, plus le token reçu est gros.

### 🔹 Étape 4 — Récapitulatif et paiement

Un écran récapitulatif lui montre exactement ce qu'il va devoir rembourser plus tard. Il sélectionne ensuite son **wallet Mobile Money** :
- 🟡 MTN Mobile Money
- 🟠 Orange Money
- 🔵 Cellcom Wallet

Il appuie sur **"Confirmer l'avance"**.

### 🔹 Étape 5 — Génération du token

L'app affiche un écran de chargement pendant environ 5 secondes. Pendant ce temps, en arrière-plan :
1. **Finergi** crée le prêt et enregistre la dette du client
2. **Finergi appelle EDG** (B2B) pour acheter un token avec le montant accordé
3. **EDG génère le token cryptographique** et le retourne à Finergi
4. **Finergi transmet le tout** (loanId + token + références) à l'app mobile

Côté mobile, c'est totalement transparent : un seul appel à Finergi suffit.

### 🔹 Étape 6 — Token reçu

🎉 L'écran de succès affiche le **token à 16 chiffres généré par EDG** :

```
1234 · 5678 · 9012 · 3456 · 7890
```

> 📌 **Note importante** : ce token est un **vrai token EDG** (produit par EDG, pas par Finergi). Il a exactement le même format que les tokens du parcours "Recharge directe" existant — le client le saisit dans son compteur EDG normalement.

Le client peut le **copier d'un appui** et aller le saisir dans son compteur EDG pour recharger son électricité. La dette de 10 000 GNF est désormais inscrite à son nom **chez Finergi** (CRG est intermédiaire).

---

## 💸 Plus tard — le remboursement

### 🔹 Étape 7 — Vue de la dette

Quelques jours plus tard, le client revient dans l'app et appuie sur **"Rembourser"** depuis l'accueil. Il voit clairement :
- Le **montant restant à rembourser** : 10 000 GNF
- La **date d'échéance** : dans 365 jours
- Les détails du prêt initial

### 🔹 Étape 8 — Choix du montant

Il peut choisir de rembourser :
- **25%** (2 500 GNF)
- **50%** (5 000 GNF)
- **Totalité** (10 000 GNF)

Il sélectionne son **wallet Mobile Money** pour le paiement.

### 🔹 Étape 9 — Confirmation du paiement

Il appuie sur **"Confirmer le paiement"**. Son téléphone reçoit alors une **demande de confirmation MTN/Orange/Cellcom** avec son code PIN. Il valide.

### 🔹 Étape 10 — Dette soldée

🎉 L'écran de succès confirme :
- ✅ **Prêt remboursé**
- Référence de paiement archivée
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

### Le compteur n'est pas reconnu

Si le compteur saisi n'est pas éligible aux avances :

> ⚠️ **Compteur non éligible**
> Ce compteur ne peut pas bénéficier d'avances pour le moment. Contacte le support CRG.
> [ Contacter le support ]

---

## ⏱ Durée totale du parcours

| Étape | Durée typique |
|---|---|
| Ouverture app + auth | ~2 secondes |
| Saisie compteur + msisdn | ~5 secondes |
| Chargement des offres | ~2 secondes |
| Choix offre + wallet | ~10 secondes |
| Génération token | ~5 secondes |
| **Total Token Advance** | **~25 secondes** |
| **Total Remboursement** | **~20 secondes** |

Un parcours optimisé pour les réseaux 3G de Guinée, avec très peu de saisie utilisateur (numéros pré-remplis depuis le profil).

---

## 🎯 Points clés à retenir pour le partenaire mobile

1. **Pas de saisie manuelle des montants** — le client choisit parmi des offres pré-calculées par Finergi
2. **Pas de double saisie** — `meterNo` et `msisdn` sont pré-remplis depuis le profil utilisateur
3. **Un seul appui de validation** par flow (pas de wizard à rallonge)
4. **Le token affiché doit être copiable d'un appui** — c'est l'élément critique de l'écran de succès
5. **Mobile Money intégré** — le client ne quitte jamais l'app CRG (les MNO confirment via leur propre prompt système)
