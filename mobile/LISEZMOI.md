# DIGI-CRG mobile — l'application des agents de crédit

Lot 1 : le recouvrement hors ligne. Un agent saisit une visite sur le terrain, sans réseau,
et elle part d'elle-même quand une connexion revient.

## Ce qui commande toute l'architecture

**La saisie ne dépend jamais du réseau.** Une visite s'écrit d'abord dans la base locale, puis
entre dans une file. L'agent ferme l'écran en sachant que c'est gardé ; la transmission est
l'affaire du moteur de synchronisation, pas la sienne.

**Chaque saisie porte un identifiant créé sur le téléphone.** C'est lui qui rend une
transmission rejouable : si la connexion casse après l'envoi mais avant la réponse, la saisie
repart au prochain essai et le serveur répond « doublon » au lieu de l'écrire deux fois.

**Trois chemins mènent à la même transmission** : le réveil du système en arrière-plan, le
retour du réseau, et l'ouverture de l'application. Aucun des trois ne se promet lui-même,
surtout sur iPhone ; le plus rapide gagne, et les deux autres ne font rien.

## Démarrer

```bash
cd mobile
npm install
npx expo start            # développement, sur le serveur de TEST par défaut
npm run verifier          # TypeScript, sans rien compiler
npx expo-doctor           # cohérence des versions Expo
```

L'environnement se choisit à la construction, par `EXPO_PUBLIC_ENV`, et vaut **test** par
défaut : une application lancée sans rien préciser ne touche jamais aux vraies données.

| | test | prod |
|---|---|---|
| API et serveur d'autorisation | `test.digi-creditrural-io.com` | `digi-creditrural-io.com` |

## Construire

```bash
npx eas-cli@latest build --profile test --platform android        # APK interne
npx eas-cli@latest build --profile production --platform all      # magasins
```

Les dossiers `android/` et `ios/` sont régénérés par `npx expo prebuild` et ignorés par git :
rien ne s'y modifie à la main.

## Ce que porte l'application

| Dossier | Rôle |
|---|---|
| `src/config.ts` | l'environnement visé et les quelques limites (taille des lots, durée de la file) |
| `src/api/` | le client HTTP et les types partagés avec le serveur |
| `src/auth/` | OAuth 2.0 avec PKCE, jetons dans le trousseau, renouvellement silencieux |
| `src/db/` | la base locale chiffrée : copie du portefeuille, listes fermées, file d'attente |
| `src/sync/` | le moteur de synchronisation et la tâche de fond |
| `src/app/` | les écrans (Expo Router) |

## Trois points de sécurité

- **Aucun mot de passe ne passe par l'application.** L'agent le tape sur la page du serveur
  d'autorisation, dans le navigateur du téléphone. L'application ne voit que le code de retour.
- **La base locale est chiffrée** par SQLCipher, activé par le greffon `expo-sqlite`
  (`useSQLCipher`). La clé vit dans le trousseau du système, jamais dans le code, et se pose
  par `PRAGMA key` en toute première instruction : une seule lecture faite avant, et la base
  reste illisible pour le reste de la session. Un téléphone perdu ne livre ni les noms des
  membres, ni les montants, ni les positions.
  **Conséquence pratique : le chiffrement n'existe que dans une construction native.** Expo Go
  ouvrira la base en clair ; la recette du chiffrement se fait donc sur l'APK de test.
- **Le blocage d'un compte coupe l'application** : le renouvellement du jeton est refusé, la
  session est effacée, la base locale devient illisible. En revanche une panne de réseau ne
  déconnecte personne : un agent en brousse garde sa session et continue de saisir.

## Ce que le lot 1 ne fait pas encore

- Les photos : la table locale existe, l'envoi reste à écrire.
- Les notifications poussées : l'appareil se déclare, l'envoi viendra avec le canal serveur.
- Les réclamations et la collecte agricole : lots 2 et 3.
- La vue du directeur d'agence : les écrans existent en maquette, pas encore en code.
