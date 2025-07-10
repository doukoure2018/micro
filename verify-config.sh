#!/bin/bash
# Unified Configuration Verification Script

echo "🔍 Configuration Verification (Docker & Production)"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check environment file
check_env_file() {
    local env_file=$1
    local env_name=$2

    echo ""
    echo -e "${BLUE}📁 Checking $env_name environment file ($env_file)...${NC}"

    if [ -f "$env_file" ]; then
        echo -e "${GREEN}✅ $env_file exists${NC}"

        # Check required variables
        required_vars=("SPRING_PROFILES_ACTIVE" "UI_APP_URL" "BACKEND_APP_URL" "POSTGRES_USER" "DB_USERNAME")
        for var in "${required_vars[@]}"; do
            if grep -q "^$var=" "$env_file"; then
                value=$(grep "^$var=" "$env_file" | cut -d'=' -f2)

                # Check for localhost in production
                if [[ "$env_file" == ".env.prod" ]] && [[ "$value" == *"localhost"* ]] && [[ "$var" == *"URL"* ]]; then
                    echo -e "${YELLOW}⚠️  $var=$value (localhost in production!)${NC}"
                elif [[ "$env_file" == ".env.docker" ]] && [[ "$value" == *"51.91.254.218"* ]]; then
                    echo -e "${YELLOW}⚠️  $var=$value (production IP in docker!)${NC}"
                else
                    echo -e "${GREEN}✅ $var=$value${NC}"
                fi
            else
                echo -e "${RED}❌ $var missing${NC}"
            fi
        done

        # Check profile-specific variables
        if [[ "$env_file" == ".env.prod" ]]; then
            if grep -q "SESSION_COOKIE_SECURE=true" "$env_file"; then
                echo -e "${GREEN}✅ Production security: SESSION_COOKIE_SECURE=true${NC}"
            else
                echo -e "${YELLOW}⚠️  SESSION_COOKIE_SECURE should be true in production${NC}"
            fi
        elif [[ "$env_file" == ".env.docker" ]]; then
            if grep -q "SESSION_COOKIE_SECURE=false" "$env_file"; then
                echo -e "${GREEN}✅ Development security: SESSION_COOKIE_SECURE=false${NC}"
            else
                echo -e "${YELLOW}⚠️  SESSION_COOKIE_SECURE should be false in docker${NC}"
            fi
        fi
    else
        echo -e "${RED}❌ $env_file file not found${NC}"
        return 1
    fi
    return 0
}

# Check both environment files
docker_ok=false
prod_ok=false

if check_env_file ".env.docker" "Docker"; then
    docker_ok=true
fi

if check_env_file ".env.prod" "Production"; then
    prod_ok=true
fi

# Check keys directory
echo ""
echo -e "${BLUE}🔑 Checking keys directory...${NC}"
if [ -d "./keys" ]; then
    echo -e "${GREEN}✅ Keys directory exists${NC}"
    if [ -f "./keys/private.key" ]; then
        echo -e "${GREEN}✅ private.key exists${NC}"
    else
        echo -e "${RED}❌ private.key missing${NC}"
    fi
    if [ -f "./keys/public.key" ]; then
        echo -e "${GREEN}✅ public.key exists${NC}"
    else
        echo -e "${RED}❌ public.key missing${NC}"
    fi
else
    echo -e "${RED}❌ Keys directory missing${NC}"
fi

# Check logs directory structure
echo ""
echo -e "${BLUE}📁 Checking logs directory structure...${NC}"
log_dirs=("logs/authorizationserver" "logs/discoveryserver" "logs/userservice" "logs/ecreditservice" "logs/notificationservice" "logs/gateway")
for dir in "${log_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $dir exists${NC}"
    else
        echo -e "${YELLOW}⚠️  $dir will be created on startup${NC}"
    fi
done

# Check Docker and Docker Compose
echo ""
echo -e "${BLUE}🐳 Checking Docker environment...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker installed: $(docker --version)${NC}"
    if docker info &> /dev/null; then
        echo -e "${GREEN}✅ Docker daemon running${NC}"
    else
        echo -e "${RED}❌ Docker daemon not running${NC}"
    fi
else
    echo -e "${RED}❌ Docker not installed${NC}"
fi

if command -v docker compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose available${NC}"
else
    echo -e "${RED}❌ Docker Compose not available${NC}"
fi

# Test docker-compose config with both environments
echo ""
echo -e "${BLUE}📋 Testing docker-compose configuration...${NC}"

if [ "$docker_ok" = true ]; then
    if docker compose --env-file .env.docker config &> /dev/null; then
        echo -e "${GREEN}✅ docker-compose.yml valid with .env.docker${NC}"
    else
        echo -e "${RED}❌ docker-compose.yml has errors with .env.docker${NC}"
    fi
fi

if [ "$prod_ok" = true ]; then
    if docker compose --env-file .env.prod config &> /dev/null; then
        echo -e "${GREEN}✅ docker-compose.yml valid with .env.prod${NC}"
    else
        echo -e "${RED}❌ docker-compose.yml has errors with .env.prod${NC}"
    fi
fi

# Environment-specific readiness
echo ""
echo -e "${BLUE}🎯 Environment Readiness Summary:${NC}"
echo "=================================="

if [ "$docker_ok" = true ]; then
    echo -e "${GREEN}🐳 Docker Environment: Ready${NC}"
    echo "   Command: ./start-docker.sh"
else
    echo -e "${RED}🐳 Docker Environment: Not Ready${NC}"
    echo "   Fix .env.docker file first"
fi

if [ "$prod_ok" = true ]; then
    echo -e "${GREEN}🚀 Production Environment: Ready${NC}"
    echo "   Command: ./start-prod.sh"
else
    echo -e "${RED}🚀 Production Environment: Not Ready${NC}"
    echo "   Fix .env.prod file first"
fi

echo ""
echo -e "${BLUE}🔗 Environment URLs:${NC}"
echo "Docker Environment:"
echo "  Frontend: http://localhost:4200"
echo "  Authorization: http://localhost:8080"
echo "  Gateway: http://localhost:8000"
echo ""
echo "Production Environment:"
echo "  Frontend: http://51.91.254.218:4200"
echo "  Authorization: http://51.91.254.218:8080"
echo "  Gateway: http://51.91.254.218:8000"

echo ""
echo -e "${BLUE}📝 Unified docker-compose.yml benefits:${NC}"
echo "✅ Same configuration structure for both environments"
echo "✅ Environment variables handle the differences"
echo "✅ Health checks and resource limits applied everywhere"
echo "✅ Easier maintenance and debugging"