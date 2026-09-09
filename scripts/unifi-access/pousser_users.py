#!/usr/bin/env python3
"""Pousse le référentiel des users UniFi (employee_number = matricule) vers digi.

À lancer depuis une machine du réseau du siège (Mac ou Windows avec Python),
après chaque changement de badges/personnel dans UniFi — ou périodiquement.

Usage :
    python3 scripts/unifi-access/pousser_users.py \
        --digi https://digi-creditrural-io.com/api --secret <MOUVEMENT_WEBHOOK_SECRET>

Pour la plateforme locale : --digi http://localhost:8000
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


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--digi", required=True, help="Base URL de l'API digi (ex. https://digi-creditrural-io.com/api)")
    p.add_argument("--secret", required=True, help="Valeur de MOUVEMENT_WEBHOOK_SECRET")
    args = p.parse_args()

    token, ip = lire_acces()
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    users, page = [], 1
    while True:
        req = urllib.request.Request(
            f"https://{ip}:12445/api/v1/developer/users?page_num={page}&page_size=100",
            headers={"Authorization": f"Bearer {token}"})
        data = json.load(urllib.request.urlopen(req, context=ctx, timeout=30)).get("data") or []
        users.extend(data)
        if len(data) < 100:
            break
        page += 1
    print(f"{len(users)} users lus depuis la centrale UniFi")

    req = urllib.request.Request(
        f"{args.digi.rstrip('/')}/ecredit/public/drh/mouvements/unifi-users",
        data=json.dumps(users).encode(),
        headers={"Content-Type": "application/json", "X-Sync-Secret": args.secret},
        method="POST")
    reponse = urllib.request.urlopen(req, context=ctx, timeout=60).read().decode()
    print(f"digi : {reponse}")


if __name__ == "__main__":
    main()
