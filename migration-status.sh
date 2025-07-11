#!/bin/bash
# Check Database Migration Status

set -e

echo "📊 Database Migration Status"
echo "============================"

# Default environment
ENV_FILE=".env.docker"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --env|-e)
            ENV_FILE="$2"
            shift 2
            ;;
        --prod|-p)
            ENV_FILE=".env.prod"
            shift
            ;;
        --docker|-d)
            ENV_FILE=".env.docker"
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --env, -e <file>    Use specific environment file"
            echo "  --prod, -p          Use production environment (.env.prod)"
            echo "  --docker, -d        Use docker environment (.env.docker) [default]"
            echo "  --help, -h          Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: Environment file $ENV_FILE not found!"
    exit 1
fi

echo "🔧 Using environment file: $ENV_FILE"

# Load environment variables
source "$ENV_FILE"

# Check if database is running
if ! docker compose ps postgresdb | grep -q "Up"; then
    echo "⚠️  Database is not running. Starting it..."
    docker compose --env-file "$ENV_FILE" up -d postgresdb

    echo "⏳ Waiting for database to be ready..."
    if ! timeout 30 bash -c "until docker compose exec -T postgresdb pg_isready -U $POSTGRES_USER -d $POSTGRES_DATABASE; do sleep 1; done"; then
        echo "❌ Database failed to start!"
        exit 1
    fi
fi

echo "✅ Database is running"
echo ""

# Check if flyway schema history table exists
echo "🔍 Checking migration history..."
if docker compose exec -T postgresdb psql -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" -c "\dt flyway_schema_history" >/dev/null 2>&1; then
    echo "✅ Migration history table exists"
    echo ""

    # Show all migrations
    echo "📋 All Migrations:"
    echo "=================="
    docker compose exec -T postgresdb psql -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" -c "
        SELECT
            installed_rank as \"Rank\",
            version as \"Version\",
            description as \"Description\",
            type as \"Type\",
            script as \"Script\",
            installed_on as \"Installed On\",
            execution_time as \"Exec Time (ms)\",
            success as \"Success\"
        FROM flyway_schema_history
        ORDER BY installed_rank;
    "

    echo ""

    # Show recent migrations
    echo "📋 Recent Migrations (Last 5):"
    echo "==============================="
    docker compose exec -T postgresdb psql -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" -c "
        SELECT
            version as \"Version\",
            description as \"Description\",
            installed_on as \"Installed On\",
            success as \"Success\"
        FROM flyway_schema_history
        ORDER BY installed_rank DESC
        LIMIT 5;
    "

    echo ""

    # Show migration summary
    echo "📊 Migration Summary:"
    echo "===================="
    total_migrations=$(docker compose exec -T postgresdb psql -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" -t -c "SELECT COUNT(*) FROM flyway_schema_history;")
    successful_migrations=$(docker compose exec -T postgresdb psql -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" -t -c "SELECT COUNT(*) FROM flyway_schema_history WHERE success = true;")
    failed_migrations=$(docker compose exec -T postgresdb psql -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" -t -c "SELECT COUNT(*) FROM flyway_schema_history WHERE success = false;")

    echo "Total migrations: $(echo $total_migrations | xargs)"
    echo "Successful: $(echo $successful_migrations | xargs)"
    echo "Failed: $(echo $failed_migrations | xargs)"

    if [ "$(echo $failed_migrations | xargs)" -gt 0 ]; then
        echo ""
        echo "❌ Failed Migrations:"
        docker compose exec -T postgresdb psql -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" -c "
            SELECT
                version as \"Version\",
                description as \"Description\",
                installed_on as \"Failed On\"
            FROM flyway_schema_history
            WHERE success = false
            ORDER BY installed_rank;
        "
    fi

else
    echo "⚠️  No migration history found - flyway_schema_history table doesn't exist"
    echo "This means no migrations have been run yet."
fi

echo ""

# Check available migration files
echo "📁 Available Migration Files:"
echo "============================="
if [ -d "./micro-digiservices/database-migrations/src/main/resources/db/migration" ]; then
    migration_files=$(find "./micro-digiservices/database-migrations/src/main/resources/db/migration" -name "*.sql" | sort)
    if [ -n "$migration_files" ]; then
        echo "$migration_files" | while read -r file; do
            filename=$(basename "$file")
            echo "📄 $filename"
        done
        echo ""
        migration_count=$(echo "$migration_files" | wc -l)
        echo "Total available migration files: $migration_count"
    else
        echo "⚠️  No migration files found in ./micro-digiservices/database-migrations/src/main/resources/db/migration"
    fi
else
    echo "❌ Migration directory not found: ./micro-digiservices/database-migrations/src/main/resources/db/migration"
fi

echo ""
echo "🎯 Environment: $ENV_FILE"
echo "🗄️  Database: $POSTGRES_DATABASE"
echo "============================"