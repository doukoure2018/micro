#!/bin/bash
# Database Migration Script

set -e

echo "🗃️  Database Migration Tool"
echo "========================="

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

# Check if migration files exist
if [ ! -d "./micro-digiservices/database-migrations/src/main/resources/db/migration" ]; then
    echo "❌ Error: Migration directory not found!"
    echo "Expected: ./micro-digiservices/database-migrations/src/main/resources/db/migration"
    exit 1
fi

# Count migration files
migration_count=$(find "./micro-digiservices/database-migrations/src/main/resources/db/migration" -name "*.sql" | wc -l)
if [ "$migration_count" -eq 0 ]; then
    echo "❌ Error: No migration files found!"
    exit 1
fi

echo "✅ Found $migration_count migration files"

# Start database if not running
echo "🗄️  Ensuring database is running..."
docker compose --env-file "$ENV_FILE" up -d postgresdb

# Wait for database
echo "⏳ Waiting for database to be ready..."
if ! timeout 30 bash -c "until docker compose exec -T postgresdb pg_isready -U $POSTGRES_USER -d $POSTGRES_DATABASE; do sleep 1; done"; then
    echo "❌ Database is not responding!"
    exit 1
fi

echo "✅ Database is ready"

# Show current migration status
echo ""
echo "📋 Current migration status:"
if docker compose exec -T postgresdb psql -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" -c "SELECT version, description, installed_on FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;" 2>/dev/null; then
    echo ""
else
    echo "No previous migrations found or flyway_schema_history table doesn't exist yet."
    echo ""
fi

# Run migrations
echo "🚀 Running database migrations..."
docker compose --env-file "$ENV_FILE" --profile migration up --force-recreate flyway-migrations

# Check migration result
migration_exit_code=$?
if [ $migration_exit_code -eq 0 ]; then
    echo ""
    echo "✅ Migrations completed successfully!"

    # Show updated migration status
    echo ""
    echo "📋 Updated migration status:"
    docker compose exec -T postgresdb psql -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" -c "SELECT version, description, installed_on FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;"
else
    echo ""
    echo "❌ Migrations failed!"
    echo "Migration logs:"
    docker compose logs flyway-migrations
    exit 1
fi

echo ""
echo "🎉 Migration process completed!"
echo "Environment: $ENV_FILE"
echo "Database: $POSTGRES_DATABASE"
echo "========================="