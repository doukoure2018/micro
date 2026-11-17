# Activer les notifications poussées de l'application mobile

**État au 17/11/2026.** Tout le code est en production (V215). Chaque notification est déjà
**rangée** en base à l'instant où elle est produite : l'alerte de 08h20, les promesses de
08h50, la fin d'une synchronisation, une réclamation prise en charge, une décision du DA.
Ce qui manque, c'est uniquement le **chemin de livraison vers les téléphones** : Expo ne peut
pas délivrer de jeton tant que l'application n'est pas rattachée à un compte Expo, et Google
ne relaie rien tant que Firebase ne connaît pas l'application.

Conséquence utile : **rien n'est perdu pendant ce temps.** Le journal se remplit, l'agent
retrouve tout dans son centre de notifications, et le jour où les deux pièces ci-dessous sont
en place les notifications commencent à s'afficher sur les écrans verrouillés — sans aucune
livraison de code.

L'écran des notifications le dit d'ailleurs lui-même, pour qu'un silence ne se lise pas comme
« tout va bien » : « Les notifications ne sont pas encore activées sur cette version de
l'application. Vos notifications restent listées ici à chaque synchronisation. »

---

## 1. Rattacher l'application à un compte Expo (≈ 5 min)

Il faut un compte sur **expo.dev** (gratuit). Dans un terminal :

```bash
cd mobile
npx eas-cli@latest login       # le compte expo.dev ; en créer un si besoin
npx eas-cli@latest whoami      # doit afficher le nom du compte
npx eas-cli@latest init        # crée le projet et écrit extra.eas.projectId dans app.json
```

`eas init` modifie `mobile/app.json` : il y ajoute `extra.eas.projectId` (et parfois `owner`).
**Cet identifiant n'est pas un secret** — il se commite, et il doit l'être : sans lui dans
`app.json`, l'APK construit ne saura pas à quel projet demander son jeton.

Vérification : `grep -A3 '"extra"' app.json` doit montrer `"projectId"`.

---

## 2. Déclarer l'application à Firebase (Android)

Expo Push relaie vers **FCM** pour Android. Deux pièces à récupérer sur
<https://console.firebase.google.com> :

1. **Créer un projet** — nom « DIGI-CRG ». Google Analytics est inutile.
2. **Ajouter une application Android** dans ce projet :
   - nom du package : **`com.digiservices.digicrg`** — exactement, c'est ce que porte
     `app.json` (`android.package`) et un écart ici donne un échec silencieux ;
   - télécharger **`google-services.json`** et le poser dans **`mobile/google-services.json`**.
3. Déclarer le fichier dans `app.json`, bloc `android` :

   ```json
   "googleServicesFile": "./google-services.json",
   ```

4. **La clé de service FCM V1**, pour qu'Expo ait le droit de notifier :
   Firebase → *Paramètres du projet* → *Comptes de service* → **Générer une nouvelle clé
   privée** → un fichier JSON. Puis :

   ```bash
   cd mobile
   npx eas-cli@latest credentials      # Android → le profil → Push Notifications: FCM V1 → Upload
   ```

   (ou sur expo.dev : projet → *Credentials* → *FCM V1 service account key*).

> ⚠️ **Le dépôt est public.** `google-services.json` et surtout la clé de compte de service
> sont dans `.gitignore` et doivent y rester : cette clé autorise à notifier **tous** les
> téléphones de la flotte. Gardez-les dans le coffre DSIG, pas dans git.

**Pour iPhone**, il faut en plus le compte Apple Developer (99 $/an) : Expo gère ensuite la
clé APNs tout seul. Rien de ce qui précède n'est perdu — Android et iOS partagent le même
journal et les mêmes déclencheurs.

---

## 3. Reconstruire l'application

```bash
cd mobile
npx expo prebuild --clean -p android
cd android && ./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
```

Un APK construit **avant** l'étape 1 ne recevra jamais de notification, même si Firebase est
en place : l'identifiant de projet est figé dans le paquet.

---

## 4. Vérifier de bout en bout

Sur le serveur (`ssh ubuntu@51.91.254.218`) :

```bash
sudo docker exec -i postgrecontainer sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "
SELECT id, user_id, plateforme, modele, actif, desactive_motif,
       left(jeton_push, 24) || chr(8230) AS jeton, dernier_contact_at
  FROM appareil_mobile ORDER BY id DESC LIMIT 5;"'
```

- **Aucune ligne** = le téléphone ne s'est pas déclaré : l'étape 1 ou 3 manque, ou l'agent a
  refusé les notifications.
- Une ligne avec un jeton `ExponentPushToken[...]` = le chemin est ouvert.

Puis, après avoir provoqué une notification (une synchronisation depuis le téléphone suffit) :

```bash
sudo docker exec -i postgrecontainer sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "
SELECT id, user_id, categorie, titre, envoye_at, nb_appareils, lue_at
  FROM notification_mobile ORDER BY id DESC LIMIT 10;"'
```

| Ce qu'on lit | Ce que ça veut dire |
|---|---|
| `envoye_at` renseigné, `nb_appareils` ≥ 1 | parti vers le téléphone |
| `envoye_at` vide | **rangée mais non poussée** — aucun appareil déclaré, ou envoi en échec |
| `desactive_motif = 'JETON_MORT'` sur l'appareil | Expo a répondu *DeviceNotRegistered* : application désinstallée ou réinstallée |

Les journaux du service disent le reste : `sudo docker logs --tail 200 ecreditservice | grep NOTIF`.

---

## Ce qui est déjà en place, et n'a rien à voir avec Expo

- `mobile.push.actif` vaut **true** par défaut : aucun réglage à poser en production.
- `portefeuille.alertes.actives=true` commande les deux tâches du matin (08h20 et 08h50).
- Les notifications ne portent **ni nom de membre ni montant** — règle de la maquette du
  12/11, parce qu'elles s'affichent sur un écran verrouillé.
- Une notification perdue n'interrompt jamais ce qui l'a déclenchée : tout envoi est tracé
  et avalé.
