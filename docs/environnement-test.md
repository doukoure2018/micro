# L'environnement de test, sur la machine de production

Arbitrage du 12 novembre 2026 : l'environnement de formation n'existe pas encore, le test
vit donc à côté de la production, **jamais dans sa base**. Il sert d'abord à recetter
l'application mobile des agents, qui se teste depuis un téléphone et non depuis un poste de
développement.

| | Production | Test |
|---|---|---|
| Projet compose | `microservices` | `digi-test` |
| Réseau | `microservices_spring` | `digi_test_spring` |
| Base | `postgrecontainer`, volume `microservices_postgres_data_v16` | `postgrecontainer-test`, volume `digi_test_postgres_data` |
| Ports | 5432, 5002, 8000, 8080, 8085, 8087, 8081 | 15432, 15002, 18000, 18080, 18085, 18087, 18081 |
| Adresse | `digi-creditrural-io.com` | `test.digi-creditrural-io.com` |
| Alertes, courriels, SMS | actifs | **tous coupés** |
| SAF | production, plus la sauvegarde selon l'aiguillage | **sauvegarde seule (10.9.0.168)** |

Fichiers : `docker-compose.test.yml`, `.env.test.example`, `start-test.sh`, `stop-test.sh`.

## Avant la première mise en route

**1. Mesurer la mémoire.** La machine a 7,6 Go et la production tourne dessus. La pile de
test demande environ 2,4 Go en pointe, 1,8 Go sans le profil `saf`.

```bash
free -m && docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}"
```

S'il reste moins de 2,6 Go disponibles, `start-test.sh` refuse de démarrer. Démarrer quand
même ferait tomber la production, pas le test.

**2. Le nom et le certificat.** Un enregistrement DNS `test.digi-creditrural-io.com` vers
51.91.254.218, puis un certificat par le conteneur certbot déjà en place :

```bash
docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
  -d test.digi-creditrural-io.com
```

**3. Le bloc nginx.** Partir du bloc de production, en changeant le nom et les deux
destinations. La configuration nginx vit sur le serveur, pas dans le dépôt : la recopier,
ne pas la réinventer. La forme attendue :

```nginx
server {
    listen 443 ssl;
    server_name test.digi-creditrural-io.com;
    ssl_certificate     /etc/letsencrypt/live/test.digi-creditrural-io.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/test.digi-creditrural-io.com/privkey.pem;

    location /api/  { proxy_pass http://gateway-test:8000/; }
    location /auth/ { proxy_pass http://authorizationserver-test:8080/; }
    # mêmes en-têtes proxy que le bloc de production
}
```

`gateway-test` et `authorizationserver-test` rejoignent le réseau de production pour que
nginx les résolve par leur nom. C'est la seule jonction entre les deux piles, et elle
impose la vérification que fait `start-test.sh` : aucun service de test ne doit nommer
`postgresdb`, l'hôte de la base de production.

**4. Les clés de signature.** Une paire RSA propre au test, dans `/etc/crg/keys-test`.
Réutiliser celle de production ferait accepter un jeton de test par les services de
production.

**5. Le fichier d'environnement.** Copier `.env.test.example` en `.env.test` sur le serveur
et le renseigner. Il n'est jamais versionné.

## Mettre des données dans la base de test

Une copie de la production, restaurée dans le conteneur de test. La sauvegarde nocturne
existe déjà (`backup_db.sh`, copie distante Backblaze, rétention 7 jours en local).

```bash
gunzip -c ~/backups/base/localdb_<date>.sql.gz \
  | docker exec -i postgrecontainer-test psql -U user2711 -d localdb
```

Puis les migrations, que `start-test.sh` joue de lui-même :

```bash
docker compose -f docker-compose.test.yml --env-file .env.test --profile migration up flyway-test
```

> **La base de test porte de vraies données de membres.** Elle se protège comme la
> production : mêmes accès restreints, pas de partage plus large sous prétexte que « c'est
> du test ». Une anonymisation serait un chantier en soi, et elle n'est pas faite.

## Au quotidien

```bash
./start-test.sh                 # contrôles, migrations, démarrage
./start-test.sh --profile saf   # avec ebanking, en lecture de la sauvegarde SAF
./stop-test.sh                  # arrêt, le volume est conservé
docker compose -f docker-compose.test.yml --env-file .env.test logs -f ecreditservice-test
```

**Arrêter la pile de test pendant la sauvegarde du matin** (restauration de la sauvegarde
SAF vers 07h15, sauvegarde de la base ensuite). Deux piles qui lisent en même temps
allongent la fenêtre et c'est la production qui le paie.

Pour essayer une version avant de la livrer, poser `TEST_IMAGE_TAG` sur un autre marqueur
que `latest` dans `.env.test`, puis `docker compose ... pull && ./start-test.sh`.

## Les garde-fous, et ce qu'ils empêchent

| Garde-fou | Ce qu'il empêche |
|---|---|
| `PORTEFEUILLE_ALERTES_ACTIVES=false` | les 244 courriels du digest de 08h20, envoyés depuis des données de test |
| `CREDIT_NEGATIF_ACTIF=false`, `SAF_SANTE_ACTIF=false` | les alertes techniques en double chez la DSIG |
| `SIGNALEMENT_TELEPHONE_SMS_ACTIF=false`, `SLACK_WEBHOOK_URL=` | un SMS ou un message Slack parti d'un essai |
| `TEST_KAFKA=kafka-absent:9092` | que le notificationservice **de production** consomme un événement de test et envoie un vrai courriel |
| Les deux sources SAF sur 10.9.0.168 | qu'une requête de test atteigne la base bancaire vivante |
| Volume, réseau et projet distincts | qu'un `docker compose down` de l'un emporte l'autre |

`start-test.sh` vérifie les quatre premiers avant chaque démarrage, et refuse de partir si
l'un manque.

## Ce que cette pile n'a pas

- **Pas de Kafka, donc aucun courriel ni notification poussée.** C'est voulu au lot 0. Le
  jour où la recette des notifications l'exigera, ajouter un courtier **propre au test**,
  jamais celui de production, et un notificationservice de test avec sa propre boîte
  d'envoi.
- **Pas d'application Angular.** Le client, ici, c'est le téléphone. Ajouter `digicrg-app`
  en profil le jour où les écrans web des réclamations se recettent.
- **Pas d'agriculteurservice ni de bcrgservice** : hors du périmètre mobile.
- **SAF en lecture de la sauvegarde**, donc des données à J-1 et pas de mouvement du jour.
