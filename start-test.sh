#!/bin/bash
# Demarrage de la pile de TEST, sur la machine de production.
# Les controles qui precedent le demarrage sont la raison d'etre de ce script :
# une pile de test mal configuree ecrit dans la base de production ou envoie de vrais
# courriels aux 244 agents.
set -e

COMPOSE="docker compose -f docker-compose.test.yml --env-file .env.test"

echo "🧪 Pile de TEST — controles avant demarrage"
echo "==========================================="

if [ ! -f ".env.test" ]; then
    echo "❌ .env.test introuvable. Le copier depuis .env.test.example et le renseigner."
    exit 1
fi

# 1. La base. Aucun service de test ne doit nommer l'hote de la base de PRODUCTION.
if $COMPOSE config 2>/dev/null | grep -q "postgresdb:5432"; then
    echo "❌ Un service de test pointe sur « postgresdb », la base de PRODUCTION."
    echo "   Corriger docker-compose.test.yml avant toute chose."
    exit 1
fi
echo "✅ base : aucun service ne nomme la base de production"

# 2. Ce qui sort. Les alertes doivent toutes etre coupees.
for interrupteur in 'PORTEFEUILLE_ALERTES_ACTIVES: "false"' 'CREDIT_NEGATIF_ACTIF: "false"' \
                    'SAF_SANTE_ACTIF: "false"' 'SIGNALEMENT_TELEPHONE_SMS_ACTIF: "false"'; do
    if ! $COMPOSE config 2>/dev/null | grep -q "$interrupteur"; then
        echo "❌ Interrupteur manquant ou a true : $interrupteur"
        echo "   Cette pile enverrait de vrais courriels ou de vrais SMS."
        exit 1
    fi
done
echo "✅ alertes : courriels, SMS, surveillance SAF et credits negatifs coupes"

# 3. Kafka. Jamais celui de production : le notificationservice de production
#    consommerait les evenements de test et enverrait de vrais courriels.
if $COMPOSE config 2>/dev/null | grep -qE "SPRING_KAFKA_BOOTSTRAP_SERVERS: \"?kafka:9092"; then
    echo "❌ La pile de test pointe sur le Kafka de production."
    exit 1
fi
echo "✅ kafka : aucun lien avec le courtier de production"

# 4. La memoire. La machine a 7,6 Go et la production tourne a cote.
LIBRE=$(free -m 2>/dev/null | awk '/^Mem:/{print $7}')
if [ -n "$LIBRE" ]; then
    echo "ℹ️  memoire disponible : ${LIBRE} Mo (la pile de test en demande environ 2 400 en pointe)"
    if [ "$LIBRE" -lt 2600 ]; then
        echo "❌ Moins de 2,6 Go disponibles : demarrer la pile de test ferait tomber la production."
        echo "   Liberer de la memoire, ou demarrer sans le profil saf (ebanking)."
        exit 1
    fi
fi

echo ""
echo "🚀 Demarrage"
$COMPOSE --profile migration up flyway-test
$COMPOSE up -d "$@"

echo ""
$COMPOSE ps
echo ""
echo "✅ Pile de test demarree. Journaux : $COMPOSE logs -f <service>"
echo "   Arret : ./stop-test.sh"
