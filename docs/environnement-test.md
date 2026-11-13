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
| Courriels | vrais envois | **capturés par mailpit-test**, visibles par tunnel SSH sur le port 18025 |
| SMS, Slack, API partenaires | actifs | **coupés** (hôte inexistant, webhook vide, clés propres au test) |
| SAF | production, plus la sauvegarde selon l'aiguillage | **sauvegarde seule (10.9.0.168)** |
| Dépôt sur le serveur | `~/microservices`, branche `main` | `~/microservices-test`, branche `test` |
| Images | `latest`, construites par `backend-cd` depuis `main` | `test`, construites par `test-cd` depuis la branche `test` |

Fichiers : `docker-compose.test.yml`, `.env.test.example`, `start-test.sh`, `stop-test.sh`, `rafraichir-base-test.sh`, `nginx-test/`, `.github/workflows/test-cd.yml`.

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

## Le jumeau complet, pour la machine à 16 Go

Depuis le 13 novembre 2026 la pile déclare les quatorze services de la production, avec
leurs tailles de tas réduites. Trois d'entre eux changent de nature en test :

- **mailpit-test, le piège à courriels.** Le service de notification de test lui envoie tout
  ce qu'il enverrait d'ordinaire à Gmail : rien n'atteint une vraie boîte, et tout se lit dans
  une interface web. C'est ce qui permet d'activer les alertes du portefeuille en test
  (`TEST_ALERTES_ACTIVES=true`) et de voir le digest de 08h20 tel que les agents le recevront.
  Pour lire les courriels : `ssh -L 18025:127.0.0.1:18025 ubuntu@51.91.254.218`, puis
  `http://localhost:18025`.
- **kafka-test et zookeeper-test**, propres à la pile : le notificationservice de production
  ne voit jamais un événement de test.
- **digicrg-app-test**, l'application web construite pour le test par `test-cd`, avec les
  adresses de test figées dans l'image. Profil `web` : `start-test.sh` l'ajoute de lui-même
  quand l'image est sur la machine. Sans elle, la racine du site affiche une page texte.

Les clés d'API des services agriculteur et BCRG sont propres au test ; KUMY et la BCRG
appellent la production, jamais ce nom. ebanking lit toujours la seule sauvegarde SAF.

Mémoire attendue : environ 3 500 Mo pour le jumeau complet. Le contrôle de `start-test.sh`
compte 4 200 Mo de besoin, déduction faite de ce que les conteneurs de test consomment déjà.
Sur la machine à 8 Go il refuse, et c'est voulu.

## La chaîne : la branche test avant main

1. Un développement est fusionné sur la branche **`test`**.
2. Le workflow `test-cd` construit les neuf images et l'application web sous le marqueur
   `test`, les pousse, met à jour `~/microservices-test` sur le serveur, recopie le bloc
   nginx de test s'il a changé, et relance `start-test.sh`. Si la mémoire manque, le run
   échoue et la pile en place n'est pas touchée.
3. La recette se fait sur `https://test.digi-creditrural-io.com`, depuis un téléphone ou
   un navigateur, sur une copie des vraies données, sans qu'aucun courriel ni SMS ne sorte.
4. Le même développement est fusionné de `test` vers **`main`**, et `backend-cd` le porte
   en production.

Les migrations de la pile de test sont jouées depuis `~/microservices-test`, donc depuis la
branche `test` : une migration s'éprouve là avant d'atteindre la production.

## Rafraîchir la base de test

```bash
./rafraichir-base-test.sh                        # la sauvegarde de la nuit
./rafraichir-base-test.sh ~/backups_db/backup_localdb_20261113_011909.sql.gz
```

Le script arrête les services de test, supprime et recrée la base de test, restaure la
sauvegarde, rejoue les migrations et relance la pile. Il refuse d'agir si le conteneur visé
n'appartient pas au projet compose `digi-test`.

## Ce qui reste hors de la pile de test

- **pgAdmin et certbot** restent uniques, du côté de la production : l'un n'a pas de raison
  d'exister en double, l'autre renouvelle déjà le certificat de test.
- **Le nginx** est celui de la production, qui sert les deux noms ; le bloc de test est
  versionné dans `nginx-test/` et recopié par `test-cd`.
