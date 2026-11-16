#!/bin/bash
# Rafraichit la base de TEST depuis une sauvegarde de la production.
#
#   ./rafraichir-base-test.sh                      # la sauvegarde la plus recente de backups_db
#   ./rafraichir-base-test.sh /chemin/sauvegarde.sql.gz
#
# Ce que fait le script, dans l ordre : il arrete les services de test qui tiennent des
# connexions, supprime et recree la base de TEST, y restaure la sauvegarde, rejoue les
# migrations, puis redemarre la pile par start-test.sh (et ses controles).
#
# Ce qu il ne peut PAS faire : toucher a la production. Le conteneur vise est ecrit en dur,
# et le script verifie qu il appartient bien au projet compose digi-test avant d y supprimer
# quoi que ce soit.
set -euo pipefail

CONTENEUR="postgrecontainer-test"
PROJET_ATTENDU="digi-test"
COMPOSE="docker compose -f docker-compose.test.yml --env-file .env.test"
SAUVEGARDE="${1:-$(ls -t /home/ubuntu/backups_db/backup_localdb_*.sql.gz 2>/dev/null | head -1)}"

echo "🧪 Rafraichissement de la base de TEST"
echo "======================================="

[ -f .env.test ] || { echo "❌ .env.test introuvable : lancer depuis le dossier de la pile de test."; exit 1; }
[ -n "$SAUVEGARDE" ] && [ -f "$SAUVEGARDE" ] || { echo "❌ aucune sauvegarde trouvee (${SAUVEGARDE:-vide})."; exit 1; }

# Les identifiants de la base de test, lus dans .env.test et nulle part ailleurs.
BASE=$(grep -E '^POSTGRES_DB=' .env.test | cut -d= -f2-)
UTILISATEUR=$(grep -E '^POSTGRES_USER=' .env.test | cut -d= -f2-)
[ -n "$BASE" ] && [ -n "$UTILISATEUR" ] || { echo "❌ POSTGRES_DB ou POSTGRES_USER manquant dans .env.test"; exit 1; }

# La garde qui compte : le conteneur vise est bien celui de la pile de test.
PROJET=$(docker inspect "$CONTENEUR" --format '{{index .Config.Labels "com.docker.compose.project"}}' 2>/dev/null || true)
if [ "$PROJET" != "$PROJET_ATTENDU" ]; then
    echo "❌ $CONTENEUR n appartient pas au projet $PROJET_ATTENDU (trouve : '${PROJET:-aucun}'). Arret."
    exit 1
fi
echo "✅ cible : $CONTENEUR, projet $PROJET, base $BASE"
echo "ℹ️  sauvegarde : $SAUVEGARDE ($(du -h "$SAUVEGARDE" | cut -f1))"

# 1. Les services qui tiennent des connexions s arretent ; la base de test reste debout.
EN_MARCHE=$($COMPOSE ps --services --status running 2>/dev/null | grep -v '^postgresdb-test$' || true)
if [ -n "$EN_MARCHE" ]; then
    echo "⏸  arret des services de test : $(echo $EN_MARCHE | tr '\n' ' ')"
    $COMPOSE stop $EN_MARCHE >/dev/null
fi

# 2. Base supprimee puis recreee : une restauration par-dessus l ancienne laisserait des restes.
echo "🗑  suppression et recreation de la base $BASE"
docker exec "$CONTENEUR" psql -U "$UTILISATEUR" -d postgres -q \
    -c "DROP DATABASE IF EXISTS \"$BASE\" WITH (FORCE);" \
    -c "CREATE DATABASE \"$BASE\" OWNER \"$UTILISATEUR\";"

# 3. Restauration. Les erreurs eventuelles sont listees, pas cachees.
echo "📥 restauration"
ERREURS=$(gunzip -c "$SAUVEGARDE" | docker exec -i "$CONTENEUR" psql -U "$UTILISATEUR" -d "$BASE" -q 2>&1 | grep -E '^ERROR' | head -5 || true)
if [ -n "$ERREURS" ]; then
    echo "⚠️  erreurs pendant la restauration (les 5 premieres) :"; echo "$ERREURS" | sed 's/^/   /'
fi

# 4. Les migrations que la sauvegarde ne contient pas encore.
echo "🗄  migrations"
$COMPOSE --profile migration up flyway-test 2>&1 | grep -E "Successfully|Migrating|ERROR|now at version" | sed 's/^/   /' || true

# 5. Compte-rendu, puis redemarrage par le script et ses controles.
docker exec "$CONTENEUR" psql -U "$UTILISATEUR" -d "$BASE" -At \
    -c "SELECT 'comptes : ' || count(*) FROM users;" \
    -c "SELECT 'derniere migration : ' || max(version::numeric) FROM flyway_schema_history;" | sed 's/^/   /'
echo ""
./start-test.sh
