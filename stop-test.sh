#!/bin/bash
# Arret de la pile de TEST. La production n'est pas touchee : projet, reseau et volume
# sont distincts. Le volume digi_test_postgres_data survit a l'arret.
echo "Arret de la pile de test..."
docker compose -f docker-compose.test.yml --env-file .env.test --profile saf --profile migration down
echo "Pile de test arretee (le volume digi_test_postgres_data est conserve)."
