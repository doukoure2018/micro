#!/bin/bash
# Production Startup Script with Database Migrations
mkdir -p backups
cp docker-compose.yml ./backups/docker-compose.yml_$(date +%Y%m%d_%H%M%S).bak
set -e  # Exit on error

echo "🚀 Starting microservices in PRODUCTION environment..."
echo "=================================================="

# Production safety checks
echo "🔍 Running production safety checks..."

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo "❌ Error: .env.prod file not found!"
    echo "Please create .env.prod with production configuration."
    exit 1
fi

# Check if keys directory exists
if [ ! -d "./keys" ]; then
    echo "❌ Error: ./keys directory not found!"
    echo "Please ensure SSH keys are available in ./keys directory."
    exit 1
fi

# Check if required key files exist
if [ ! -f "./keys/private.key" ] || [ ! -f "./keys/public.key" ]; then
    echo "❌ Error: Required key files missing!"
    echo "Please ensure private.key and public.key exist in ./keys directory."
    echo ""
    echo "To generate production keys, run:"
    echo "  ./generate-keys.sh"
    exit 1
fi

# Check if migration files exist
if [ ! -d "./micro-digiservices/database-migrations/src/main/resources/db/migration" ]; then
    echo "❌ Error: Database migration directory not found!"
    echo "Please ensure migration files exist in ./micro-digiservices/database-migrations/src/main/resources/db/migration/"
    exit 1
fi

# Check if migration files exist
migration_count=$(find "./micro-digiservices/database-migrations/src/main/resources/db/migration" -name "*.sql" | wc -l)
if [ "$migration_count" -eq 0 ]; then
    echo "❌ Error: No migration files found!"
    echo "Please create migration files in ./micro-digiservices/database-migrations/src/main/resources/db/migration/"
    exit 1
else
    echo "✅ Found $migration_count migration files"
fi

# Create logs directory for production
echo "📁 Creating production logs directory..."
mkdir -p ./logs/{authorizationserver,discoveryserver,userservice,ecreditservice,notificationservice,gateway,flyway}

# Backup existing data (optional)
echo "💾 Creating backup timestamp..."
BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
echo "Backup timestamp: $BACKUP_TIMESTAMP" > ./logs/deployment_$BACKUP_TIMESTAMP.log

# Verify production environment variables
echo "🔧 Verifying production environment variables..."
source .env.prod

required_vars=("UI_APP_URL" "BACKEND_APP_URL" "POSTGRES_USER" "POSTGRES_PASSWORD" "POSTGRES_DATABASE")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: Required environment variable $var is not set!"
        exit 1
    else
        echo "✅ $var is configured"
    fi
done

# Check if production IPs are used (not localhost)
if [[ "$UI_APP_URL" == *"localhost"* ]] || [[ "$BACKEND_APP_URL" == *"localhost"* ]]; then
    echo "⚠️  Warning: localhost URLs detected in production environment!"
    echo "UI_APP_URL: $UI_APP_URL"
    echo "BACKEND_APP_URL: $BACKEND_APP_URL"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled."
        exit 1
    fi
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Pull latest images (for production)
echo "📥 Pulling latest Docker images..."
docker compose --env-file .env.prod pull

# Start database first
echo "🗄️  Starting database services..."
docker compose --env-file .env.prod up -d postgresdb zookeeper kafka

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 20

# Check database health
echo "🏥 Checking database health..."
if ! timeout 30 bash -c "until docker compose exec -T postgresdb pg_isready -U $POSTGRES_USER -d $POSTGRES_DATABASE; do sleep 1; done"; then
    echo "❌ Database failed to start properly!"
    echo "Database logs:"
    docker compose logs postgresdb
    exit 1
fi
echo "✅ Database is ready"

# Run database migrations
echo "🗃️  Running database migrations..."
docker compose --env-file .env.prod --profile migration up flyway-migrations

# Check migration status
migration_exit_code=$?
if [ $migration_exit_code -ne 0 ]; then
    echo "❌ Database migrations failed!"
    echo "Migration logs:"
    docker compose logs flyway-migrations
    exit 1
fi

# Show migration logs
echo "📋 Migration results:"
docker compose logs flyway-migrations | tail -10

echo "✅ Database migrations completed successfully"

# Start application services
echo "🚀 Starting application services..."
docker compose --env-file .env.prod --profile services up -d

# Wait for services to start
echo "⏳ Waiting for services to initialize..."
sleep 45

# Health check
echo "🏥 Running health checks..."
services=("postgresdb:5432" "discoveryserver:5002" "authorizationserver:8080" "gateway:8000")
for service in "${services[@]}"; do
    IFS=':' read -r name port <<< "$service"
    if timeout 15 bash -c "</dev/tcp/localhost/$port" 2>/dev/null; then
        echo "✅ $name is responding on port $port"
    else
        echo "❌ $name is not responding on port $port"
        echo "Checking logs for $name..."
        docker compose logs --tail=20 $name
    fi
done

# Check migration status in database
echo "🔍 Verifying migration status in database..."
migration_status=$(docker compose exec -T postgresdb psql -U $POSTGRES_USER -d $POSTGRES_DATABASE -c "SELECT version, description, installed_on FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 3;" 2>/dev/null || echo "Could not check migration status")
echo "Recent migrations:"
echo "$migration_status"

# Display service status
echo ""
echo "📊 Service Status:"
docker compose ps

echo ""
echo "✅ Production deployment completed!"
echo "=================================================="
echo "🌐 Frontend: $UI_APP_URL"
echo "🔐 Authorization: $BACKEND_APP_URL"
echo "🌉 Gateway: ${API_BASE_URL:-http://51.91.254.218:8000}"
echo "🔍 Eureka: http://admin:admin2711@51.91.254.218:5002"
echo "🗄️  Database: PostgreSQL on localhost:5432"
echo "📊 PgAdmin: http://localhost:7000"
echo ""
echo "📋 Useful commands:"
echo "  Monitor logs: ./logs.sh [service_name]"
echo "  Check status: ./status.sh"
echo "  Stop services: ./stop.sh"
echo "  Run new migrations: docker compose --env-file .env.prod --profile migration up flyway-migrations"
echo ""
echo "📁 Logs are stored in: ./logs/"
echo "🎯 Environment: Production"
echo "=================================================="