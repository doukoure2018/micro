#!/bin/bash
# File: start-dev.sh
# Development environment startup script

echo "Starting development environment..."
ENV_FILE=./.env.dev docker compose --env-file ./.env.dev up -d
echo "Development services started"