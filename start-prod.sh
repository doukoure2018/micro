#!/bin/bash
# File: start-prod.sh
# Production environment startup script

echo "Starting production environment..."
ENV_FILE=./.env.prod docker compose --env-file ./.env.prod up -d
echo "Production services started"