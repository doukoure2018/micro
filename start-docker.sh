#!/bin/bash
# Docker Development Startup Script

set -e  # Exit on error

echo "🐳 Starting microservices with Docker environment..."
echo "=================================================="

# Check if .env.docker exists
if [ ! -f ".env.docker" ]; then
    echo "❌ Error: .env.docker file not found!"
    echo "Please create .env.docker with Docker configuration."
    exit 1
fi

# Check if keys directory exists, create if missing
if [ ! -d "./keys" ]; then
    echo "📁 Creating keys directory..."
    mkdir -p ./keys
fi

# Check if required key files exist, create dummy ones if missing
if [ ! -f "./keys/private.key" ] || [ ! -f "./keys/public.key" ]; then
    echo "🔑 Creating dummy key files for Docker development..."

    # Create dummy private key
    cat > ./keys/private.key << 'EOF'
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDVT5JsF5...
(This is a dummy key for Docker development only)
-----END PRIVATE KEY-----
EOF

    # Create dummy public key
    cat > ./keys/public.key << 'EOF'
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw1U+SbBeaH4+...
(This is a dummy key for Docker development only)
-----END PUBLIC KEY-----
EOF

    echo "✅ Dummy key files created for Docker development"
    echo "⚠️  Note: These are dummy keys for development only!"
fi

# Create logs directory for Docker
echo "📁 Creating Docker logs directory..."
mkdir -p ./logs/{authorizationserver,discoveryserver,userservice,ecreditservice,notificationservice,gateway}

# Verify Docker environment variables
echo "🔧 Verifying Docker environment variables..."
if ! source .env.docker; then
    echo "❌ Error: Could not load .env.docker file"
    exit 1
fi

required_vars=("UI_APP_URL" "BACKEND_APP_URL" "POSTGRES_USER" "POSTGRES_PASSWORD")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: Required environment variable $var is not set!"
        exit 1
    else
        echo "✅ $var is configured: ${!var}"
    fi
done

# Check if Docker URLs are localhost (expected for Docker)
if [[ "$UI_APP_URL" == *"localhost"* ]] && [[ "$BACKEND_APP_URL" == *"localhost"* ]]; then
    echo "✅ Docker environment correctly configured with localhost URLs"
else
    echo "⚠️  Warning: Expected localhost URLs in Docker environment"
    echo "UI_APP_URL: $UI_APP_URL"
    echo "BACKEND_APP_URL: $BACKEND_APP_URL"
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Start services with Docker configuration
echo "🚀 Starting Docker services..."
docker compose --env-file .env.docker up -d

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
echo "✅ Docker deployment completed!"
echo "=================================================="
echo "🌐 Frontend: $UI_APP_URL"
echo "🔐 Authorization: $BACKEND_APP_URL"
echo "🌉 Gateway: ${API_BASE_URL:-http://localhost:8000}"
echo "🔍 Eureka: http://admin:admin2711@localhost:5002"
echo ""
echo "📋 Useful commands:"
echo "  Monitor logs: ./logs.sh [service_name]"
echo "  Check status: ./status.sh"
echo "  Stop services: ./stop.sh"
echo ""
echo "📁 Logs are stored in: ./logs/"
echo "🎯 Environment: Docker Development"
echo "=================================================="