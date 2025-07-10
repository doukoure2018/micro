#!/bin/bash
# fix-http-auth.sh - Quick fix for HTTP authentication

echo "🔧 Fixing HTTP authentication..."

# 1. Update .env.prod
sed -i 's/SESSION_COOKIE_SECURE=true/SESSION_COOKIE_SECURE=false/g' .env.prod

# 2. Create override to force insecure cookies
cat > docker-compose.override.yml << 'EOF'
services:
  authorizationserver:
    environment:
      - SERVER_SERVLET_SESSION_COOKIE_SECURE=false
      - SERVER_SERVLET_SESSION_COOKIE_SAME_SITE=lax
      - LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_SECURITY_WEB_AUTHENTICATION=DEBUG
EOF

# 3. Restart only auth server
docker compose restart authorizationserver

echo "✅ Done! Wait 30 seconds then try logging in again."
echo "🔗 Test URL: http://51.91.254.218:8080/oauth2/authorize?response_type=code&client_id=client&scope=openid&redirect_uri=http://51.91.254.218:4200&code_challenge_method=S256&code_challenge=HK02sitqCRpUlfLEX2xl4JGqaVQhNDsfTWH-oQzJHGw"