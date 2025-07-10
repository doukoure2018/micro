#!/bin/bash
# Key Generation Script for OAuth2/JWT

echo "🔑 Generating RSA Key Pair for OAuth2/JWT..."
echo "============================================="

# Create keys directory if it doesn't exist
mkdir -p ./keys

# Check if keys already exist
if [ -f "./keys/private.key" ] && [ -f "./keys/public.key" ]; then
    echo "⚠️  Key files already exist!"
    echo "Existing files:"
    ls -la ./keys/
    echo ""
    read -p "Do you want to overwrite them? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Key generation cancelled."
        exit 1
    fi
    echo "🗑️  Backing up existing keys..."
    mv ./keys/private.key "./keys/private.key.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true
    mv ./keys/public.key "./keys/public.key.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true
fi

# Generate private key (RSA 2048 bit)
echo "🔐 Generating private key..."
openssl genrsa -out ./keys/private.key 2048

# Generate public key from private key
echo "🔓 Generating public key..."
openssl rsa -in ./keys/private.key -pubout -out ./keys/public.key

# Set appropriate permissions
echo "🔒 Setting file permissions..."
chmod 600 ./keys/private.key  # Read/write for owner only
chmod 644 ./keys/public.key   # Read for everyone

# Display key information
echo ""
echo "✅ Key generation completed!"
echo "============================="
echo "📁 Keys location: ./keys/"
echo "🔐 Private key: ./keys/private.key"
echo "🔓 Public key: ./keys/public.key"
echo ""
echo "📋 File permissions:"
ls -la ./keys/

echo ""
echo "🔍 Key fingerprints:"
echo "Private key fingerprint:"
openssl rsa -in ./keys/private.key -noout -modulus | openssl md5

echo "Public key fingerprint:"
openssl rsa -pubin -in ./keys/public.key -noout -modulus | openssl md5

echo ""
echo "⚠️  IMPORTANT SECURITY NOTES:"
echo "================================"
echo "🚨 Keep private.key SECRET and secure!"
echo "🚨 Never commit private.key to version control!"
echo "🚨 Add keys/ to your .gitignore file"
echo "✅ Public key can be shared safely"
echo ""
echo "📝 Add to .gitignore:"
echo "echo 'keys/' >> .gitignore"

# Check if .gitignore exists and add keys/ if not present
if [ -f ".gitignore" ]; then
    if ! grep -q "keys/" .gitignore; then
        echo "📝 Adding keys/ to .gitignore..."
        echo "keys/" >> .gitignore
        echo "✅ Added keys/ to .gitignore"
    else
        echo "✅ keys/ already in .gitignore"
    fi
else
    echo "📝 Creating .gitignore with keys/..."
    echo "keys/" > .gitignore
    echo "✅ Created .gitignore with keys/"
fi

echo ""
echo "🎯 Next steps:"
echo "=============="
echo "For Docker development: ./start-docker.sh"
echo "For Production: ./start-prod.sh"