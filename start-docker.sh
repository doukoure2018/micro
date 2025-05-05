#!/bin/bash
# File: start-docker.sh
# Docker environment startup script

# Print header
echo "========================================"
echo "Starting Docker container environment..."
echo "========================================"

# Set environment file
ENV_FILE=./.env.docker

# Create docker network if it doesn't exist
echo "Setting up docker network..."
docker network inspect spring >/dev/null 2>&1 || docker network create spring

# Pull latest images
if [ "$1" = "--pull" ]; then
  echo "Pulling latest images..."
  docker compose --env-file $ENV_FILE pull
fi

# Start containers
echo "Starting services with Docker configuration..."
docker compose --env-file $ENV_FILE up -d

# Check status
echo "Checking container status..."
docker compose ps

echo "========================================"
echo "Docker environment startup complete!"
echo "========================================"
echo "PostgreSQL: localhost:5432"
echo "PgAdmin: localhost:7000"
echo "API Gateway: localhost:8000"
echo "========================================"