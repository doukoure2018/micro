#!/usr/bin/env bash
#
# Envoie une image vers Docker Hub, en réessayant.
#
# Le registre renvoie régulièrement des erreurs passagères — « unexpected status from HEAD
# request … : 502 Bad Gateway » — sur un seul blob, au hasard. Le déploiement comptant
# dix-huit envois répartis sur neuf services, il suffit d'un seul de ces 502 pour arrêter
# toute la livraison, alors que les images déjà envoyées sont bonnes. C'est arrivé deux fois
# le 03/11/2026, à trois heures d'intervalle, sur ecreditservice puis sur gateway, et chaque
# fois il a fallu relancer le déploiement entier.
#
# Cinq essais, espacés de 10, 20, 30 puis 40 secondes : de quoi traverser une indisponibilité
# courte sans masquer une vraie panne, qui échouera quand même au bout de deux minutes.
#
# Usage : bash .github/scripts/pousser-image.sh <image:tag>
#
set -uo pipefail

if [ "$#" -ne 1 ]; then
    echo "Usage : $0 <image:tag>" >&2
    exit 2
fi

IMAGE="$1"
ESSAIS=5

for essai in $(seq 1 "$ESSAIS"); do
    if docker push "$IMAGE"; then
        if [ "$essai" -gt 1 ]; then
            echo "✓ $IMAGE envoyée au ${essai}e essai."
        fi
        exit 0
    fi
    if [ "$essai" -eq "$ESSAIS" ]; then
        break
    fi
    attente=$((essai * 10))
    echo "⚠ Envoi de $IMAGE refusé (essai $essai/$ESSAIS). Nouvel essai dans ${attente} s."
    sleep "$attente"
done

echo "✗ Envoi de $IMAGE impossible après $ESSAIS essais : ce n'est plus une indisponibilité passagère." >&2
exit 1
