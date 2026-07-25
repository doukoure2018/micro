# bcrgservice — API de déclaration réglementaire BCRG

Service d'agrégation qui expose à la **plateforme de déclaration de la BCRG** (Banque
Centrale de la République de Guinée) les données réglementaires du CRG, extraites de
SAF2000. Même patron d'architecture que `agriculteurservice` (KUMY) : **sans base
propre**, sécurisé par **clé API**, agrège `ebanking` via Feign.

> **Périmètre livré** : M1 « Déclarations Clients » (Personnes Physiques + Morales, avec
> comptes, pièces et adresses), **M2 Engagements**, **M4 Encours d'engagements** (instantané mensuel).
> Restent optionnels/différés : sous-objets non présents dans SAF (employeur, tuteur,
> actionnaires, mandataires, garanties, consolidation) et indicateurs IFRS (PD/LGD/CCF/stage).

## Architecture

```
Plateforme BCRG ──/bcrg/**  (X-API-Key)──► nginx ──► bcrgservice:8089
                                                        │ Feign (X-API-Key interne)
                                                        └──► ebanking /ebanking/reg/** ──► SAF2000 (schéma CL)
                                                                                            via tertiaryJdbcTemplate
```

- **Accès données** : `tertiaryJdbcTemplate` d'ebanking — **le même accès VPN éprouvé que
  le crédit agricole**, pas la base de production. Schéma `CL` (CL_CLIENTES,
  CL_PERSONAS_FISICAS/JURIDICAS, CL_ID_CLIENTES, CL_CTAS_CLIENTE).
- **Stateless** : aucune datasource dans `bcrgservice`.

## Authentification

Deux clés API distinctes (rotation indépendante) :

| Clé | Variable d'env | Rôle |
|---|---|---|
| Publique | `BCRG_PUBLIC_API_KEY` | protège `/bcrg/**` (plateforme BCRG → bcrgservice) |
| Interne | `EBANKING_REG_API_KEY` (bcrgservice) = `BCRG_INTERNAL_API_KEY` (ebanking) | protège `/ebanking/reg/**` (bcrgservice → ebanking) |

En-tête attendu : `X-API-Key: <clé>`. Défaut vide ⇒ **fail-closed** (401).

## Endpoints (port 8089)

| Méthode | Chemin | Description |
|---|---|---|
| GET | `/bcrg/personnes-physiques?page&size` | liste paginée des PP (champs cœur) |
| GET | `/bcrg/personnes-physiques/{idClient}` | une PP + comptes associés + pièces |
| GET | `/bcrg/personnes-morales?page&size` | liste paginée des PM |
| GET | `/bcrg/personnes-morales/{idClient}` | une PM + comptes associés + pièces + adresses |
| GET | `/bcrg/engagements?page&size` | liste paginée des engagements (crédits) |
| GET | `/bcrg/engagements/{refEng}` | un engagement |
| GET | `/bcrg/encours?periode=AAAA-MM&page&size` | encours à la période d'arrêté (mensuel) |

`periode` (encours) : format **AAAA-MM** obligatoire (ex. `2026-06`), sinon **400**.
Pagination : `page ≥ 0`, `1 ≤ size ≤ 100` (défaut `page=0, size=20`), sinon **400**.
Erreurs amont : **404** ressource absente, **503** SAF/BDCRG indisponible, **502** autre.

Swagger : `http://<host>:8089/swagger-ui.html` · Santé : `/actuator/health`.

## Champs à arbitrer avec le métier (absents de SAF)

Exposés `null` en attendant la règle (ND / calcul / source annexe) :
- **PP** : `nin`, `nomPere`, `prenomPere`, `nomNaiMere`, `datNai`.
- **PM** : `rccm`, `nif`, `numAgrement`, `sectInst`.
- Traductions à valider dans `BcrgTranslator` (sexe, état civil, forme juridique, type de pièce).

## Config nginx (à ajouter côté serveur, comme `/agriculteurs/`)

```nginx
location /bcrg/ {
    proxy_pass http://bcrgservice:8089;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

> Comme pour KUMY, cette location **bypasse le gateway** (pas de JWT) ; la sécurité est
> assurée par la clé API. Prévoir aussi une **whitelist d'IP** de la plateforme BCRG.
