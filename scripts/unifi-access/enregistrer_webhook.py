#!/usr/bin/env python3
"""Enregistre le webhook UniFi Access -> digi (à lancer depuis une machine du réseau du siège).

Lit l'IP et le jeton dans docs/drh/access-porte (fichier NON versionné).
Usage :
    python3 scripts/unifi-access/enregistrer_webhook.py \
        --endpoint https://digi-creditrural-io.com/api/ecredit/public/drh/mouvements/webhook

Affiche le SECRET retourné par UniFi et la commande SQL à exécuter en base
(drh_parametre MOUVEMENT_WEBHOOK_SECRET) pour que digi accepte les événements.
"""
import argparse
import json
import ssl
import sys
import urllib.request
from pathlib import Path

ACCES = Path(__file__).resolve().parents[2] / "docs" / "drh" / "access-porte"


def lire_acces():
    token = ip = None
    for ligne in ACCES.read_text().splitlines():
        if ":" not in ligne:
            continue
        cle, valeur = ligne.split(":", 1)
        if cle.strip().lower().startswith("api"):
            token = valeur.strip()
        elif cle.strip().upper() == "IP":
            ip = valeur.strip()
    if not token or not ip:
        sys.exit(f"Jeton ou IP introuvable dans {ACCES}")
    return token, ip


def appel(ip, token, methode, chemin, corps=None):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(
        f"https://{ip}:12445/api/v1/developer{chemin}",
        data=json.dumps(corps).encode() if corps is not None else None,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method=methode,
    )
    return json.load(urllib.request.urlopen(req, context=ctx, timeout=20))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--endpoint", required=True, help="URL publique HTTPS du webhook digi")
    p.add_argument("--nom", default="digi-presences")
    args = p.parse_args()

    token, ip = lire_acces()

    existants = appel(ip, token, "GET", "/webhooks/endpoints").get("data") or []
    for w in existants:
        if w.get("name") == args.nom or w.get("endpoint") == args.endpoint:
            print(f"Webhook déjà enregistré (id={w['id']}, endpoint={w['endpoint']})")
            print(f"Secret existant : {w.get('secret')}")
            print(sql(w.get("secret")))
            return

    r = appel(ip, token, "POST", "/webhooks/endpoints", {
        "name": args.nom,
        "endpoint": args.endpoint,
        "events": ["access.door.unlock"],
    })
    data = r.get("data") or {}
    print(f"Webhook enregistré : id={data.get('id')} endpoint={data.get('endpoint')}")
    print(f"SECRET (à conserver) : {data.get('secret')}")
    print(sql(data.get("secret")))


def sql(secret):
    return ("\nÀ exécuter dans la base digi (prod ET/OU locale) :\n"
            f"  UPDATE drh_parametre SET valeur = '{secret}' WHERE cle = 'MOUVEMENT_WEBHOOK_SECRET';")


if __name__ == "__main__":
    main()
