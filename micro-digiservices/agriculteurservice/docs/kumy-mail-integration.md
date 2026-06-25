# Mail à envoyer à KUMY — intégration OIDC terminée

> Modèle de mail. Les secrets (client_secret prod/test, clé API) ne figurent PAS ici :
> ils se transmettent par canal sécurisé séparé.

**Objet :** CRG ↔ KUMY/AgriScore — implémentation OIDC terminée et en production + guide d'intégration

---

Bonjour,

Merci pour vos réponses détaillées. De notre côté, l'implémentation est **terminée et déployée en production**. Vous trouverez ci-joint le **guide d'intégration technique** (`kumy-integration-guide.md`) ; voici l'essentiel et les réponses à vos questions en retour.

**1. Endpoints OIDC (prod)** — via discovery :
`https://digi-creditrural-io.com/auth/.well-known/openid-configuration`

**2. Clients (2 environnements, sur notre OP)**
- Prod : `client_id = kumy-agriscore-prod`, redirect `https://idp.kumy.app/creditrural/callback`
- Test : `client_id = kumy-agriscore-test`, redirect `https://idp.kumy.app/creditrural-test/callback`
- PKCE (S256) **obligatoire**, auth client `client_secret_basic` / `client_secret_post`.
- Nous n'avons pas encore d'OP non-prod dédié : les deux clients sont **isolés sur le même OP**. Un compte de démo `CR-DEMO-001` peut être préparé sur demande.

**3. `agent_id`** — confirmé : basé sur un identifiant interne **stable, unique et jamais réattribué**, inchangé même en cas de mutation. Format `CR-<n>` (ex. `CR-42`).

**4. Claims `agent_profile`** — émis dans l'**ID Token** ET sur **/userinfo** : `agent_id`, `role`, `agence_region` (délégation), `agence_name` (agence), `agence_code` (point de service), `point_de_service`.

**5. Rôles CRG (liste complète + niveaux)**

| Rôle | Niveau |
|---|---|
| AGENT_CREDIT | Point de service |
| RA | Agence |
| DA | Agence |
| DR | Délégation |

Pas de claim `habilitations` : vous gérez les permissions fines de votre côté.

**6. Contrôle de statut agent (temps réel)** — endpoint dédié, authentifié par clé API :
`GET https://digi-creditrural-io.com/api/agents/{agent_id}/status` (header `X-API-Key`).

**7. Secrets** — `client_secret` (prod/test) et clé API du endpoint de statut vous sont transmis **par canal sécurisé séparé** (jamais par email).

**8. IP** — vos IP connecteur (`34.38.11.85` prod, `35.187.117.108` test) seront whitelistées côté CRG.

Nous restons disponibles pour un point technique si besoin lors de votre intégration.

Bien cordialement,
*[Votre nom]*
Crédit Rural de Guinée
