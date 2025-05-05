#!/bin/bash
# File: restart.sh
# Restart services with current environment

echo "Restarting services..."
docker compose down
if [ -f "$ENV_FILE" ]; then
  docker compose --env-file $ENV_FILE up -d
else
  docker compose up -d
fi
echo "Services restarted"