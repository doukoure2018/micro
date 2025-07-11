#!/bin/bash
# Docker Development Startup Script with Database Migrations

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

# Check if migration files exist, create basic ones if missing
if [ ! -d "./micro-digiservices/database-migrations/src/main/resources/db/migration" ]; then
    echo "📁 Creating migration directory structure..."
    mkdir -p "./micro-digiservices/database-migrations/src/main/resources/db/migration"
fi

# Check if migration files exist
migration_count=$(find "./micro-digiservices/database-migrations/src/main/resources/db/migration" -name "*.sql" | wc -l)
if [ "$migration_count" -eq 0 ]; then
    echo "🗃️  Creating sample migration files for Docker development..."

    # Create basic user table migration
    cat > "./micro-digiservices/database-migrations/src/main/resources/db/migration/V1__Create_user_tables.sql" << 'EOF'
-- User Service Tables
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
EOF

    # Create basic banking tables migration
    cat > "./micro-digiservices/database-migrations/src/main/resources/db/migration/V2__Create_banking_tables.sql" << 'EOF'
-- Banking Service Tables
CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    reference_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
EOF

    echo "✅ Sample migration files created"
else
    echo "✅ Found $migration_count migration files"
fi

# Create logs directory for Docker
echo "📁 Creating Docker logs directory..."
mkdir -p ./logs/{authorizationserver,discoveryserver,userservice,ecreditservice,notificationservice,gateway,flyway}

# Verify Docker environment variables
echo "🔧 Verifying Docker environment variables..."
if ! source .env.docker; then
    echo "❌ Error: Could not load .env.docker file"
    exit 1
fi

required_vars=("UI_APP_URL" "BACKEND_APP_URL" "POSTGRES_USER" "POSTGRES_PASSWORD" "POSTGRES_DATABASE")
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

# Start database and infrastructure services
echo "🗄️  Starting database and infrastructure services..."
docker compose --env-file .env.docker up -d postgresdb zookeeper kafka

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 15

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
docker compose --env-file .env.docker --profile migration up flyway-migrations

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
docker compose --env-file .env.docker --profile services up -d

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
        echo "Checking logs for $name..."
        docker compose logs --tail=10 $name
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
echo "✅ Docker deployment completed!"
echo "=================================================="
echo "🌐 Frontend: $UI_APP_URL"
echo "🔐 Authorization: $BACKEND_APP_URL"
echo "🌉 Gateway: ${API_BASE_URL:-http://localhost:8000}"
echo "🔍 Eureka: http://admin:admin2711@localhost:5002"
echo "🗄️  Database: PostgreSQL on localhost:5432"
echo "📊 PgAdmin: http://localhost:7000"
echo ""
echo "📋 Useful commands:"
echo "  Monitor logs: ./logs.sh [service_name]"
echo "  Check status: ./status.sh"
echo "  Stop services: ./stop.sh"
echo "  Run new migrations: docker compose --env-file .env.docker --profile migration up flyway-migrations"
echo ""
echo "📁 Logs are stored in: ./logs/"
echo "🎯 Environment: Docker Development"
echo "=================================================="