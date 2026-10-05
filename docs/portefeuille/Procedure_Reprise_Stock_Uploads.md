# Reprise du stock des pièces déposées — procédure

DSIG, 5 octobre 2026. À exécuter de nuit, après validation sur échantillon.

## Ce que le traitement fait

Il relit chaque fichier de `uploads/`, réduit les photographies à 1 600 pixels sur le plus grand
côté et recompresse les images internes des PDF, puis remplace le fichier par renommage atomique
en conservant sa date de modification d'origine.

Il réutilise exactement le code appliqué aux dépôts neufs (`ImageOptimizer`, `PdfOptimizer`) :
un seul code, donc un seul résultat possible.

| Type | Fichiers | Volume actuel | Après | Gain attendu |
|---|---|---|---|---|
| Photographies | 27 568 | 68,7 Go | ≈ 9 Go | ≈ 60 Go |
| PDF | 8 553 | 27,1 Go | ≈ 12 Go | ≈ 15 Go |
| Autres | 345 | 0,4 Go | inchangé | — |
| **Total** | **36 450** | **96,2 Go** | **≈ 21 Go** | **≈ 75 Go** |

## Étape 0 — figer les originaux hors du serveur (OBLIGATOIRE)

La synchronisation fait correspondre le site distant au serveur. Sans cette étape, la prochaine
exécution remplacerait les originaux distants par les versions réduites, et les originaux
disparaîtraient des deux côtés.

```bash
# Copie interne au fournisseur : rapide, ne transite pas par le serveur.
rclone copy backblaze2:backups-digi-microservices/uploads \
            backblaze2:backups-digi-microservices/uploads-originaux-20261006 \
            --transfers 16

# Contrôle : les deux doivent afficher le même nombre d'objets.
rclone size backblaze2:backups-digi-microservices/uploads
rclone size backblaze2:backups-digi-microservices/uploads-originaux-20261006
```

Le stockage distant passe à environ 190 Go, soit 1,15 $ par mois, loin du plafond de 1 089 Go.
Cette copie pourra être supprimée après quelques semaines d'exploitation sans incident.

## Étape 1 — simulation sur tout le stock (aucune écriture)

```bash
docker run --rm --network none \
  -v /home/ubuntu/microservices/uploads:/app/uploads:ro \
  -e SPRING_PROFILES_ACTIVE=prod \
  doukoure93/ecreditservice:latest \
  --reprise.active=true --reprise.simulation=true --reprise.dossier=/app/uploads \
  2>&1 | grep REPRISE | tail -20
```

Le bilan annonce le gain réel sans rien modifier. S'il s'écarte fortement des 75 Go attendus,
s'arrêter et comprendre pourquoi avant d'aller plus loin.

## Étape 2 — écriture sur un échantillon de 200 fichiers

```bash
docker run --rm \
  -v /home/ubuntu/microservices/uploads:/app/uploads \
  -e SPRING_PROFILES_ACTIVE=prod \
  doukoure93/ecreditservice:latest \
  --reprise.active=true --reprise.simulation=false --reprise.limite=200 \
  --reprise.dossier=/app/uploads 2>&1 | grep REPRISE | tail -20
```

**Vérification avant de généraliser.** Ouvrir dans la plateforme une dizaine de pièces parmi les
fichiers traités — une carte d'identité, un titre de garantie, un PDF de plusieurs pages — et
s'assurer qu'elles restent parfaitement lisibles et complètes. C'est le seul contrôle qui compte :
le reste est mesurable, la lisibilité se juge à l'œil.

## Étape 3 — traitement complet, de nuit

```bash
nohup docker run --rm --cpus=2 \
  -v /home/ubuntu/microservices/uploads:/app/uploads \
  -e SPRING_PROFILES_ACTIVE=prod \
  doukoure93/ecreditservice:latest \
  --reprise.active=true --reprise.simulation=false --reprise.dossier=/app/uploads \
  > /home/ubuntu/reprise_uploads.log 2>&1 &
```

Durée estimée : cinq heures environ. La limite à deux processeurs laisse la machine disponible
pour le service. Suivi : `grep REPRISE /home/ubuntu/reprise_uploads.log | tail -5`.

## Étape 4 — resynchroniser le site distant

```bash
/home/ubuntu/backup_uploads_incremental.sh
rclone size backblaze2:backups-digi-microservices/uploads
```

Le dépôt distant reflète alors les fichiers allégés, les originaux restant dans la copie figée
à l'étape 0.

## Points de vigilance

- **Le traitement est inerte par défaut.** Sans `--reprise.active=true`, il ne fait rien ; sans
  `--reprise.simulation=false`, il ne fait que mesurer.
- **Aucune ligne de base n'est modifiée.** Les noms de fichiers ne changent pas, donc les liens
  enregistrés dans la base restent valides.
- **Écriture atomique.** Un agent qui ouvre une pièce pendant le traitement voit l'ancienne
  version ou la nouvelle, jamais un fichier tronqué.
- **Les fichiers HEIC et bureautiques ne sont pas touchés**, non plus que les images déjà sous
  300 Ko et les PDF sous 800 Ko.
- **En cas de doute sur un fichier**, l'original est récupérable dans la copie figée à l'étape 0.
