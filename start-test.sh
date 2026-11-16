#!/bin/bash
# Demarrage de la pile de TEST, sur la machine de production.
# Les controles qui precedent le demarrage sont la raison d etre de ce script : une pile de
# test mal configuree ecrirait dans la base de production, ou enverrait de vrais courriels
# et de vrais SMS a partir de donnees d essai.
set -e

COMPOSE="docker compose -f docker-compose.test.yml --env-file .env.test"

echo "🧪 Pile de TEST — controles avant demarrage"
echo "==========================================="

if [ ! -f ".env.test" ]; then
    echo "❌ .env.test introuvable. Le copier depuis .env.test.example et le renseigner."
    exit 1
fi

# Profils optionnels, ajoutes quand leurs prerequis sont la :
#  - saf : ebanking en lecture de la SAUVEGARDE SAF, si le mot de passe de lecture est renseigne ;
#  - web : l application web de test, si son image (construite par test-cd) est sur la machine.
PROFILS=""
if grep -qE '^SAF_SAUVEGARDE_PASSWORD=.+' .env.test; then PROFILS="$PROFILS --profile saf"; fi
APP_TAG=$(grep -E '^TEST_APP_IMAGE_TAG=' .env.test | cut -d= -f2-); APP_TAG=${APP_TAG:-test}
# L image de l application web est tiree ICI, avant le choix des profils : le pull general
# ne porte que sur les profils actifs, et le profil web ne s active que si l image est la.
# Sans cette ligne, le profil ne pouvait jamais s activer au premier passage.
docker pull --quiet "doukoure93/digicrg-app:$APP_TAG" >/dev/null 2>&1 || true
if docker image inspect "doukoure93/digicrg-app:$APP_TAG" >/dev/null 2>&1; then PROFILS="$PROFILS --profile web"; fi
echo "ℹ️  profils : ${PROFILS:-aucun (base, annuaire, auth, utilisateurs, credit, passerelle, kafka, notification, agriculteur, bcrg, piege a courriels)}"

CONFIG=$($COMPOSE $PROFILS config 2>/dev/null)

# 1. La base. Aucun service de test ne doit nommer l hote de la base de PRODUCTION.
if echo "$CONFIG" | grep -q "postgresdb:5432"; then
    echo "❌ Un service de test pointe sur « postgresdb », la base de PRODUCTION."
    exit 1
fi
echo "✅ base : aucun service ne nomme la base de production"

# 2. Ce qui sort. Les courriels vont dans le piege, les SMS et Slack sont coupes.
for attendu in "MAIL_HOST: mailpit-test" 'SIGNALEMENT_TELEPHONE_SMS_ACTIF: "false"' "canal-absent"; do
    if ! echo "$CONFIG" | grep -q "$attendu"; then
        echo "❌ Garde manquante : $attendu"
        echo "   Sans elle, cette pile enverrait de vrais courriels ou de vrais SMS."
        exit 1
    fi
done
if echo "$CONFIG" | grep -qE "MAIL_HOST: smtp\."; then
    echo "❌ Un service de test pointe sur un vrai serveur SMTP."
    exit 1
fi
ALERTES=$(echo "$CONFIG" | grep -oE 'PORTEFEUILLE_ALERTES_ACTIVES: "?[a-z]+' | head -1 | grep -oE '[a-z]+$')
echo "✅ sorties : courriels captures par mailpit-test, SMS et Slack coupes (alertes portefeuille : ${ALERTES:-false}, vers le piege)"

# 3. Kafka. Jamais celui de production : le notificationservice de production consommerait
#    les evenements de test et enverrait de vrais courriels.
if echo "$CONFIG" | grep -qE 'SPRING_KAFKA_BOOTSTRAP_SERVERS: "?kafka:9092'; then
    echo "❌ La pile de test pointe sur le Kafka de production."
    exit 1
fi
if echo "$CONFIG" | grep -q "kafka-absent"; then
    echo "❌ TEST_KAFKA pointe encore sur kafka-absent (valeur d avant le jumeau complet)."
    echo "   Le consommateur du service de notification refuse de demarrer sur une adresse qui ne"
    echo "   resout pas. Mettre TEST_KAFKA=kafka-test:9092 dans .env.test."
    exit 1
fi
echo "✅ kafka : courtier propre au test"

# 4. La memoire. Ce que les conteneurs de test consomment DEJA est deduit du besoin : sans
#    cela, un redemarrage partiel serait refuse alors que la pile tourne en partie.
BESOIN_TOTAL=4200
LIBRE=$(free -m 2>/dev/null | awk '/^Mem:/{print $7}')
DEJA=$(docker stats --no-stream --format '{{.Name}}|{{.MemUsage}}' 2>/dev/null \
       | grep -- '-test' \
       | awk -F'|' '{split($2, a, " / "); v = a[1] + 0; if (a[1] ~ /GiB/) v = v * 1024; s += v} END {printf "%d", s}')
DEJA=${DEJA:-0}
BESOIN=$((BESOIN_TOTAL - DEJA))
if [ -n "$LIBRE" ]; then
    echo "ℹ️  memoire : ${LIBRE} Mo disponibles, ${DEJA} Mo deja pris par la pile de test, ${BESOIN} Mo encore necessaires"
    if [ "$LIBRE" -lt "$BESOIN" ]; then
        echo "❌ Pas assez de memoire : demarrer la pile de test ferait tomber la production."
        echo "   Liberer de la memoire, ou attendre l augmentation du serveur."
        exit 1
    fi
fi

echo ""
echo "🚀 Demarrage"
# Les images au marqueur demande (TEST_IMAGE_TAG) : « up » ne remplace pas une image deja
# presente sous le meme marqueur, il faut tirer d abord. Une image absente n arrete pas tout.
$COMPOSE $PROFILS pull --quiet --ignore-pull-failures 2>&1 | grep -viE "^\s*$" | tail -3 || true
$COMPOSE --profile migration up flyway-test 2>&1 | grep -E "Successfully|Migrating|ERROR|now at version" || true
$COMPOSE $PROFILS up -d "$@"

echo ""
$COMPOSE $PROFILS ps --format "table {{.Name}}\t{{.Status}}"
echo ""
echo "✅ Pile de test demarree. Journaux : $COMPOSE logs -f <service>"
echo "   Courriels captures : tunnel SSH vers 127.0.0.1:18025, puis http://localhost:18025"
echo "   Arret : ./stop-test.sh"
