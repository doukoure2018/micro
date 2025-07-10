#!/bin/bash
# Production Configuration Verification Script

echo "🔍 Production Configuration Verification"
echo "========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.prod exists and has required variables
echo ""
echo "📁 Checking .env.prod file..."
if [ -f ".env.prod" ]; then
    echo -e "${GREEN}✅ .env.prod exists${NC}"

    # Check required variables
    required_vars=("SPRING_PROFILES_ACTIVE" "UI_APP_URL" "BACKEND_APP_URL" "POSTGRES_USER" "POSTGRES_PASSWORD")
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" .env.prod; then
            value=$(grep "^$var=" .env.prod | cut -d'=' -f2)
            if [[ "$value" == *"localhost"* ]] && [[ "$var" == *"URL"* ]]; then
                echo -e "${YELLOW}⚠️  $var=$value (localhost detected in production!)${NC}"
            else
                echo -e "${GREEN}✅ $var=$value${NC}"
            fi
        else
            echo -e "${RED}❌ $var missing${NC}"
        fi
    done
else
    echo -e "${RED}❌ .env.prod file not found${NC}"
fi

# Check keys directory
echo ""
echo "🔑 Checking keys directory..."
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

# Check Docker and Docker Compose
echo ""
echo "🐳 Checking Docker environment..."
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

# Test docker-compose config with production env
echo ""
echo "📋 Testing docker-compose configuration..."
if docker compose --env-file .env.prod config &> /dev/null; then
    echo -e "${GREEN}✅ docker-compose.yml syntax valid with .env.prod${NC}"
else
    echo -e "${RED}❌ docker-compose.yml has syntax errors with .env.prod${NC}"
    echo "Run: docker compose --env-file .env.prod config"
fi

# Check network connectivity (if possible)
echo ""
echo "🌐 Checking network connectivity..."
if command -v ping &> /dev/null; then
    if ping -c 1 51.91.254.218 &> /dev/null; then
        echo -e "${GREEN}✅ Production server (51.91.254.218) is reachable${NC}"
    else
        echo -e "${YELLOW}⚠️  Production server (51.91.254.218) is not reachable${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Ping command not available${NC}"
fi

# Check available disk space
echo ""
echo "💾 Checking disk space..."
available_space=$(df -h . | awk 'NR==2 {print $4}')
echo -e "${GREEN}✅ Available disk space: $available_space${NC}"

# Check if logs directory can be created
echo ""
echo "📝 Checking log directory permissions..."
if mkdir -p ./logs/test &> /dev/null; then
    echo -e "${GREEN}✅ Can create log directories${NC}"
    rmdir ./logs/test 2>/dev/null
else
    echo -e "${RED}❌ Cannot create log directories${NC}"
fi

# Production readiness summary
echo ""
echo "🎯 Production Readiness Summary:"
echo "================================"

# Count issues
issues=0

if [ ! -f ".env.prod" ]; then
    ((issues++))
fi

if [ ! -d "./keys" ] || [ ! -f "./keys/private.key" ] || [ ! -f "./keys/public.key" ]; then
    ((issues++))
fi

if ! docker info &> /dev/null; then
    ((issues++))
fi

if ! docker compose --env-file .env.prod config &> /dev/null; then
    ((issues++))
fi

if [ $issues -eq 0 ]; then
    echo -e "${GREEN}🚀 Ready for production deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. ./start-prod.sh"
    echo "2. Monitor logs: ./logs.sh authorizationserver"
    echo "3. Check status: ./status.sh"
else
    echo -e "${RED}❌ $issues issue(s) found. Please fix before production deployment.${NC}"
fi

echo ""
echo "🔗 Production URLs (once deployed):"
echo "Frontend: http://51.91.254.218:4200"
echo "Authorization: http://51.91.254.218:8080"
echo "Gateway: http://51.91.254.218:8000"
echo "Eureka: http://admin:admin2711@51.91.254.218:5002"