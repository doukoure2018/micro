#!/bin/bash
# Production Startup Script
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

# Create logs directory for production
echo "📁 Creating production logs directory..."
mkdir -p ./logs/{authorizationserver,discoveryserver,userservice,ecreditservice,notificationservice,gateway}

# Backup existing data (optional)
echo "💾 Creating backup timestamp..."
BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
echo "Backup timestamp: $BACKUP_TIMESTAMP" > ./logs/deployment_$BACKUP_TIMESTAMP.log

# Verify production environment variables
echo "🔧 Verifying production environment variables..."
source .env.prod

required_vars=("UI_APP_URL" "BACKEND_APP_URL" "POSTGRES_USER" "POSTGRES_PASSWORD")
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

# Start services with production configuration
echo "🚀 Starting production services..."
docker compose --env-file .env.prod up -d

# Wait for services to start
echo "⏳ Waiting for services to initialize..."
sleep 30

# Health check
echo "🏥 Running health checks..."
services=("postgresdb:5432" "discoveryserver:5002" "authorizationserver:8080" "gateway:8000")
for service in "${services[@]}"; do
    IFS=':' read -r name port <<< "$service"
    if timeout 10 bash -c "</dev/tcp/localhost/$port" 2>/dev/null; then
        echo "✅ $name is responding on port $port"
    else
        echo "❌ $name is not responding on port $port"
    fi
done

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
echo ""
echo "📋 Useful commands:"
echo "  Monitor logs: ./logs.sh [service_name]"
echo "  Check status: ./status.sh"
echo "  Stop services: ./stop.sh"
echo ""
echo "📁 Logs are stored in: ./logs/"
echo "🎯 Environment: Production"
echo "=================================================="