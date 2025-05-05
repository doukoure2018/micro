#!/bin/bash
# File: stop.sh
# Stop all services

echo "Stopping all services..."
docker compose down
echo "All services stopped"