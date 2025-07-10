#!/bin/bash
# update-service.sh - Update specific service script

set -e

SERVICE_NAME="${1:-digicrg-app}"
ENV_FILE=".env.docker"

echo "🔄 Updating service: $SERVICE_NAME"
echo "================================="

# Check if service exists in docker-compose
if ! docker-compose --env-file $ENV_FILE config --services | grep -q "^$SERVICE_NAME$"; then
    echo "❌ Service '$SERVICE_NAME' not found in docker-compose.yml"
    echo "Available services:"
    docker-compose --env-file $ENV_FILE config --services
    exit 1
fi

# Check current status
echo "📊 Current status:"
docker-compose --env-file $ENV_FILE ps $SERVICE_NAME

# Pull latest image
echo "⬇️  Pulling latest image for $SERVICE_NAME..."
if docker-compose --env-file $ENV_FILE pull $SERVICE_NAME; then
    echo "✅ Image pulled successfully"
else
    echo "⚠️  Could not pull image (may not exist or network issue)"
fi

# Stop the service
echo "🛑 Stopping $SERVICE_NAME..."
docker-compose --env-file $ENV_FILE stop $SERVICE_NAME

# Remove the container
echo "🗑️  Removing old container..."
docker-compose --env-file $ENV_FILE rm -f $SERVICE_NAME

# Start the service with new image
echo "🚀 Starting $SERVICE_NAME with latest image..."
docker-compose --env-file $ENV_FILE up -d $SERVICE_NAME

# Wait a moment for startup
echo "⏳ Waiting for service to start..."
sleep 10

# Check final status
echo "📊 Updated status:"
docker-compose --env-file $ENV_FILE ps $SERVICE_NAME

# Health check if the service has one
if docker-compose --env-file $ENV_FILE ps $SERVICE_NAME | grep -q "healthy"; then
    echo "✅ Service is healthy"
elif docker-compose --env-file $ENV_FILE ps $SERVICE_NAME | grep -q "Up"; then
    echo "✅ Service is running"
else
    echo "❌ Service may have issues"
    echo "📋 Recent logs:"
    docker-compose --env-file $ENV_FILE logs --tail=20 $SERVICE_NAME
fi

echo ""
echo "✅ Update completed for $SERVICE_NAME"
echo "================================="

# If it's the frontend app, show the URL
if [ "$SERVICE_NAME" = "digicrg-app" ]; then
    echo "🌐 Frontend URL: http://localhost:4200"
fi