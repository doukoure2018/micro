#!/bin/bash
cd "$(dirname "$0")"
source .env.docker
echo "Running migrations for DOCKER environment..."

# Compile and migrate in one command
mvn -pl database-migrations clean compile flyway:migrate -Pdocker
mvn -pl database-migrations flyway:info -Pdocker