# Clés RSA OIDC (authorizationserver)

L'authorizationserver signe les JWT (ID Token / access token) avec une **clé privée RSA**
et expose la **clé publique** correspondante sur `/auth/oauth2/jwks`. KUMY et les autres
services vérifient les signatures via ce JWKS.

> ⚠️ **La clé privée ne doit JAMAIS être committée dans git.** Les fichiers `keys/*.key`
> sont dans `.gitignore`. Elles se déploient **manuellement** sur le serveur, montées en
> lecture seule dans le conteneur.

## Générer une paire (2048 bits minimum)

```bash
# Clé privée PKCS#8 (-----BEGIN PRIVATE KEY-----)
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out private.key
# Clé publique X.509 SubjectPublicKeyInfo (-----BEGIN PUBLIC KEY-----)
openssl pkey -in private.key -pubout -out public.key
```

Format attendu par `KeyUtils.loadKeysFromPEM` : privée **PKCS#8**, publique **X.509 SPKI**.

## Déployer sur le serveur

```bash
# 1. Créer le dossier hors du repo
sudo mkdir -p /etc/crg/keys

# 2. Y copier les 2 fichiers (depuis votre poste)
scp private.key public.key ubuntu@<serveur>:/tmp/
sudo mv /tmp/private.key /tmp/public.key /etc/crg/keys/

# 3. Permissions restrictives (privée lisible par le seul propriétaire)
sudo chmod 600 /etc/crg/keys/private.key
sudo chmod 644 /etc/crg/keys/public.key

# 4. Indiquer le dossier à docker-compose (dans .env.prod)
echo 'KEYS_DIR=/etc/crg/keys' >> .env.prod
```

`docker-compose` monte `${KEYS_DIR}:/app/keys:ro`, et l'application lit
`/app/keys/private.key` + `/app/keys/public.key` (surchageables via
`KEY_PRIVATE_PATH` / `KEY_PUBLIC_PATH`).

## Vérifier après déploiement

- Logs de l'authorizationserver : `Loading RSA keys from file paths` puis
  `Successfully loaded RSA keys from files` (et **pas** « Generating in-memory RSA keys »).
- `/auth/oauth2/jwks` expose la clé publique correspondante, **kid stable**.
- Un access_token reste vérifiable sur `/auth/userinfo` **après un redémarrage**
  (la clé ne change plus).

## Rotation / incident

- Pour changer de clé : générer une nouvelle paire, la déployer, redémarrer. Les tokens
  émis avec l'ancienne clé deviennent invalides (les agents se reconnectent) et KUMY
  re-télécharge le JWKS automatiquement.
- Si une clé privée a fuité : la révoquer et en régénérer une immédiatement.
  *(À ce jour, seules des clés PLACEHOLDER invalides avaient été committées — aucune
  vraie clé privée n'a fuité, pas de révocation nécessaire.)*
