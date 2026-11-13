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

## La mise en route, telle qu'elle a été faite le 13 novembre 2026

**1. Mesurer la mémoire.** La machine a 7,6 Go et la production tourne dessus. La pile de
test demande environ 2,4 Go en pointe, 1,8 Go sans le profil `saf`.

```bash
free -m && docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}"
```

S'il reste moins de 2,6 Go disponibles, `start-test.sh` refuse de démarrer. Démarrer quand
même ferait tomber la production, pas le test.

**2. Le nom et le certificat.** ✅ Faits le 13 novembre 2026. L'enregistrement DNS
`test.digi-creditrural-io.com` pointe vers 51.91.254.218, et le certificat Let's Encrypt a
été obtenu par le conteneur certbot déjà en place :

```bash
docker compose --env-file .env.prod run --rm --entrypoint certbot certbot \
  certonly --webroot -w /var/www/certbot -d test.digi-creditrural-io.com \
  --non-interactive --agree-tos --no-eff-email
```

Il expire le 10 février 2027 et se renouvelle tout seul : le conteneur certbot lance
`certbot renew` toutes les douze heures, ce qui couvre tous les certificats de la machine.

**3. Le bloc nginx.** ✅ Fait. Il vit sur le serveur, dans
`nginx/sites-enabled/test-digi-creditrural.conf`, et sa copie de référence est versionnée
ici dans `nginx-test/`. La configuration nginx n'étant pas suivie par git, cette copie est
le seul moyen de la retrouver si le serveur est reconstruit.

Deux choses à savoir sur ce bloc. D'abord, il faut le poser **en deux temps** : le bloc sur
le port 80 d'abord, qui sert le défi de validation, puis le bloc chiffré une fois le
certificat obtenu, nginx refusant de démarrer s'il référence un certificat absent. Ensuite,
il ne dessert que la passerelle et le serveur d'autorisation de test, les deux seuls
conteneurs de test à rejoindre le réseau de production ; tout le reste de l'API passe par la
passerelle, comme le fait un téléphone.

Les adresses y sont résolues à chaque appel, par `resolver 127.0.0.11 valid=10s` et une
variable dans `proxy_pass`. Sans cela, un conteneur de test redémarré change d'adresse et
nginx garde l'ancienne, ce qui donne des 502 jusqu'au prochain rechargement.

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
