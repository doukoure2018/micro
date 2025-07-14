#!/bin/sh

# Attendre que le DNS Docker soit prêt pour "gateway"
echo "⏳ Attente de la résolution DNS de gateway..."
until getent hosts gateway; do
  echo "   (Toujours pas de gateway...)"
  sleep 2
done

echo "✅ Gateway résolu ! Lancement de Nginx..."
nginx -g "daemon off;"
