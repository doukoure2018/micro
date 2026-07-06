**DOCUMENTATION API**

**CANAL+ Actualisation Décodeur (Réactivation des chaînes)**

*Guide Complet pour Développeurs*

Version 1.0 - Juillet 2026

# Table des matières

1.  Présentation

2.  Environnements et Configuration

3.  Authentification

4.  Étape 1: Consultation du Statut de l'Abonnement (OBLIGATOIRE)

5.  Étape 2: Actualisation des Chaînes du Décodeur

6.  Workflow Complet

7.  Gestion des Erreurs

# 1. Présentation

L'**actualisation des chaînes** (réactivation) permet de relancer le signal d'un décodeur Canal+ dont l'**abonnement est encore actif** mais dont les chaînes ne s'affichent plus (après une coupure, un déplacement du décodeur, etc.).

| **Caractéristique** | **Valeur**                                                        |
|---------------------|-------------------------------------------------------------------|
| **Coût**            | GRATUIT — aucun débit du compte partenaire                        |
| **Pré-requis**      | **OBLIGATOIRE** : consulter d'abord le statut de l'abonnement (Étape 1) — le contrat doit être **Active** |
| **Limite**          | 1 actualisation toutes les **10 minutes** par décodeur            |
| **Notification**    | Un SMS de confirmation est envoyé au client                       |
| **Durée**           | 30 à 90 secondes (traitement temps réel côté Canal+)              |

**⚠️ ATTENTION:** L'actualisation ne doit JAMAIS être appelée directement. Vous devez **d'abord consulter le statut du réabonnement** du décodeur (Étape 1, endpoint check-decoder). Si le contrat est expiré ou résilié, l'actualisation renvoie une erreur 422 — utilisez alors l'API **Réabonnement** (voir *Documentation API Canal+ Réabonnement V2*).

# 2. Environnements et Configuration

## 2.1 - URLs de Base

| **Environnement** | **URL de Base**            | **Description** |
|-------------------|----------------------------|-----------------|
| **TEST**          | http://162.19.114.155:8088 | Développement   |
| **PRODUCTION**    | https://api.yigui-io.com   | Production      |

**ℹ️ Note:** Remplacez {URL_DE_BASE} dans tous les endpoints par l'URL correspondant à votre environnement.

## 2.2 - Headers Requis

| **Header**        | **Valeur**           | **Obligatoire** |
|-------------------|----------------------|-----------------|
| **Content-Type**  | application/json     | Oui             |
| **Authorization** | Bearer {accessToken} | Oui             |

# 3. Authentification

L'authentification est **identique** à celle de l'API Réabonnement : obtenez un token JWT via `POST {URL_DE_BASE}/auth/login` avec vos identifiants partenaires, puis utilisez-le dans le header `Authorization` (voir la section 2 de la *Documentation API Canal+ Réabonnement V2* pour le détail du login et du rafraîchissement de token).

**⚠️ ATTENTION:** Le token expire après 1 heure. Utilisez le refreshToken pour en obtenir un nouveau sans vous reconnecter.

# 4. Étape 1: Consultation du Statut de l'Abonnement (OBLIGATOIRE)

Avant toute actualisation, vous **devez** consulter le statut du réabonnement du décodeur. Cette étape permet de vérifier que l'abonné existe, que son contrat est **Active**, et d'afficher ses informations au client avant de déclencher l'opération.

## 4.1 - Détails de l'Endpoint

| **Propriété**        | **Valeur**                                            |
|----------------------|--------------------------------------------------------|
| **Méthode**          | POST                                                   |
| **Endpoint**         | {URL_DE_BASE}/securecanal/api/check-decoder            |
| **Authentification** | Bearer Token (Obligatoire)                             |
| **Paramètre Query**  | numAbonne (String) - Numéro du décodeur (14 chiffres)  |

## 4.2 - URLs Concrètes

| **Environnement** | **URL Complète**                                          |
|-------------------|------------------------------------------------------------|
| **TEST**          | http://162.19.114.155:8088/securecanal/api/check-decoder  |
| **PRODUCTION**    | https://api.yigui-io.com/securecanal/api/check-decoder    |

## 4.3 - Exemple d'Appel

```bash
curl -X POST \
"{URL_DE_BASE}/securecanal/api/check-decoder?numAbonne=24510062007092" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {votre_token}"
```

## 4.4 - Réponse Success (200)

```json
{
"type_recherche": "DECODEUR",
"existe": true,
"unique": true,
"message": "Abonné trouvé",
"decoder_number": "11499203",
"nom": "KONE",
"statut": "Active",
"offre": "EVASION",
"date_fin": "04/01/2027",
"ville": "CONAKRY"
}
```

## 4.5 - Règle de Décision (AVANT l'actualisation)

| **Résultat du check-decoder**      | **Action à effectuer**                                     |
|------------------------------------|-------------------------------------------------------------|
| existe = false                     | ARRÊT — abonné introuvable, vérifier le numéro saisi        |
| existe = true et statut = "Active" | ✅ Poursuivre vers l'**Étape 2 : Actualisation**            |
| existe = true et statut ≠ "Active" | ARRÊT — proposer le **Réabonnement** (contrat expiré/résilié) |

**⚠️ ATTENTION:** N'appelez l'endpoint d'actualisation (Étape 2) QUE si `existe=true` et `statut="Active"`. Dans tous les autres cas, l'actualisation échouera (422) et vous ferez patienter le client inutilement (~1 minute de traitement).

**ℹ️ Note:** Pour le détail complet des champs de réponse du check-decoder, voir la section 3 de la *Documentation API Canal+ Réabonnement V2*.

# 5. Étape 2: Actualisation des Chaînes du Décodeur

## 5.1 - Détails de l'Endpoint

| **Propriété**        | **Valeur**                              |
|----------------------|------------------------------------------|
| **Méthode**          | POST                                     |
| **Endpoint**         | {URL_DE_BASE}/securecanal/reactivation   |
| **Authentification** | Bearer Token (Obligatoire)               |
| **Content-Type**     | application/json                         |

**⚠️ ATTENTION:** Contrairement aux endpoints de réabonnement, cet endpoint est sous `/securecanal/` (et **non** `/securecanal/api/`).

## 5.2 - URLs Concrètes

| **Environnement** | **URL Complète**                                      |
|-------------------|--------------------------------------------------------|
| **TEST**          | http://162.19.114.155:8088/securecanal/reactivation   |
| **PRODUCTION**    | https://api.yigui-io.com/securecanal/reactivation     |

## 5.3 - Paramètres du Corps de Requête

| **Champ**       | **Type** | **Requis** | **Description**                                              |
|-----------------|----------|------------|--------------------------------------------------------------|
| **numAbonne**   | String   | **OUI**    | Numéro du décodeur — exactement **14 chiffres**              |
| **phoneNumber** | String   | **OUI**    | Téléphone du client SANS indicatif pays (SMS de confirmation) |

**⚠️ ATTENTION:** Le numéro de téléphone doit être envoyé SANS l'indicatif pays. Exemple: 621091895 (pas 00224621091895)

## 5.4 - Exemple de Requête

```json
{
"numAbonne": "24510062007092",
"phoneNumber": "621091895"
}
```

**Exemple cURL (TEST):**

```bash
curl -X POST \
"http://162.19.114.155:8088/securecanal/reactivation" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {votre_token}" \
-d '{"numAbonne": "24510062007092", "phoneNumber": "621091895"}'
```

**Exemple cURL (PRODUCTION):**

```bash
curl -X POST \
"https://api.yigui-io.com/securecanal/reactivation" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {votre_token}" \
-d '{"numAbonne": "24510062007092", "phoneNumber": "621091895"}'
```

## 5.5 - Réponse Success (201 Created)

L'actualisation a été déclenchée avec succès côté Canal+ :

```json
{
"timeStamp": "2026-07-06T15:12:45.806487",
"statusCode": 201,
"status": "CREATED",
"message": "Actualisation des chaînes déclenchée avec succès",
"data": {
"resultat": "Réactivation effectuée avec succès",
"decodeur": "24510062007092",
"cooldownMinutes": 10,
"dureeExecution": "42137ms"
}
}
```

| **Champ**            | **Type** | **Description**                                        |
|----------------------|----------|--------------------------------------------------------|
| **data.decodeur**    | String   | Décodeur actualisé                                     |
| **data.cooldownMinutes** | Integer | Délai avant qu'une nouvelle actualisation soit possible |
| **data.dureeExecution**  | String  | Durée du traitement côté serveur                       |

## 5.6 - Réponse Success Idempotente (200 OK)

Une réactivation était **déjà en cours** côté Canal+ pour ce décodeur — le client recevra ses chaînes sous peu, il n'y a rien d'autre à faire :

```json
{
"statusCode": 200,
"status": "OK",
"message": "Réactivation déjà en cours côté Canal+. Le client recevra les chaînes sous peu.",
"data": {
"decodeur": "24510062007092",
"cooldownMinutes": 10
}
}
```

**ℹ️ Note:** Traitez les codes 200 et 201 comme un **succès** dans votre intégration.

# 6. Workflow Complet

**ÉTAPE 0: AUTHENTIFICATION**

> POST /auth/login
>
> → Stocker l'accessToken pour les requêtes suivantes

**ÉTAPE 1 (OBLIGATOIRE): CONSULTATION DU STATUT DU RÉABONNEMENT**

> POST /securecanal/api/check-decoder?numAbonne=XXX
>
> → Vérifier existe=true et **statut=Active**
>
> → Afficher les infos au client (nom, offre actuelle, date_fin)
>
> → Si existe=false : ARRÊT (numéro invalide)
>
> → Si statut ≠ Active : ARRÊT — proposer le RÉABONNEMENT au lieu de l'actualisation

**ÉTAPE 2: ACTUALISATION (uniquement si statut = Active)**

> POST /securecanal/reactivation
>
> → Envoyer numAbonne (14 chiffres) + phoneNumber (sans indicatif)
>
> → 200/201 = succès : informer l'utilisateur que les chaînes reviennent sous quelques minutes
>
> → 429 = déjà actualisé récemment : afficher le temps restant (data.cooldownSecondsRemaining)
>
> → 422 = contrat non actif : rediriger vers le parcours Réabonnement

# 7. Gestion des Erreurs

## 7.1 - Codes HTTP

| **Code** | **Status**            | **Description**                                                          |
|----------|-----------------------|--------------------------------------------------------------------------|
| **201**  | Created               | Actualisation déclenchée avec succès                                     |
| **200**  | OK                    | Réactivation déjà en cours côté Canal+ (succès idempotent)               |
| **400**  | Bad Request           | numAbonne manquant, erreur du portail Canal+ (CGA_ERROR) ou erreur métier |
| **401**  | Unauthorized          | Token manquant ou expiré                                                 |
| **422**  | Unprocessable Entity  | Contrat non actif (expiré/résilié) → utiliser le Réabonnement            |
| **429**  | Too Many Requests     | Actualisation trop récente pour ce décodeur (cooldown 10 min)            |
| **503**  | Service Unavailable   | Service d'actualisation temporairement suspendu par l'administrateur     |
| **500**  | Server Error          | Erreur interne du serveur                                                |

## 7.2 - Codes d'Erreur Spécifiques (champ data.errorCode)

| **errorCode**           | **Code HTTP** | **Description**                                                | **Champs additionnels**            |
|-------------------------|---------------|----------------------------------------------------------------|-------------------------------------|
| REACTIVATION_COOLDOWN   | 429           | Une actualisation a déjà eu lieu il y a moins de 10 minutes    | data.cooldownSecondsRemaining       |
| CONTRACT_NOT_ACTIVE     | 422           | Le contrat du décodeur est expiré ou résilié                   | data.suggestion (→ réabonnement)    |
| REACTIVATION_SUSPENDED  | 503           | Service suspendu temporairement                                | data.reason                         |
| CGA_ERROR               | 400           | Erreur renvoyée par le portail Canal+                          | data.resultat (message détaillé)    |

### Exemple de réponse 429 (cooldown)

```json
{
"statusCode": 429,
"status": "TOO_MANY_REQUESTS",
"message": "Réactivation récente. Réessayez dans 7min 32s.",
"data": {
"errorCode": "REACTIVATION_COOLDOWN",
"cooldownSecondsRemaining": 452,
"decodeur": "24510062007092"
}
}
```

### Exemple de réponse 422 (contrat non actif)

```json
{
"statusCode": 422,
"status": "UNPROCESSABLE_ENTITY",
"message": "Contrat non actif. La réactivation n'est disponible que pour les décodeurs déjà abonnés. Utilisez le réabonnement.",
"data": {
"errorCode": "CONTRACT_NOT_ACTIVE",
"errorType": "CONTRAT_EXPIRE_OU_RESILIE",
"decodeur": "24510062007092",
"suggestion": "Utilisez la fonction Réabonnement pour ce décodeur"
}
}
```

## 7.3 - Bonnes Pratiques

- **Timeout:** Configurez un timeout de **120 secondes minimum** — le traitement est effectué en temps réel côté Canal+ et prend généralement 30 à 90 secondes

- **Double-clic:** Désactivez le bouton pendant l'appel ; en cas de doublon, le serveur répond 200 (déjà en cours) ou 429 (cooldown), jamais deux actualisations

- **429:** N'effectuez PAS de retry automatique — affichez le temps restant (data.cooldownSecondsRemaining) à l'utilisateur

- **422:** Redirigez l'utilisateur vers votre parcours de réabonnement existant

- **Retry:** En cas d'erreur 500, réessayez après quelques secondes (max 3 tentatives)

- **Logs:** Conservez les logs des requêtes et réponses pour le débogage

## 7.4 - Support

Pour toute question technique ou problème d'intégration, contactez l'équipe de support avec:

- L'environnement utilisé (TEST ou PRODUCTION)

- La requête complète (URL, headers, body)

- La réponse reçue (code HTTP et body)

- L'horodatage de l'erreur
