-- =====================================================================================
-- V215 : les notifications de l'application mobile (maquettes du 12/11, écran « Notifications »)
-- =====================================================================================
--
-- POURQUOI UN JOURNAL, ET PAS SEULEMENT UN ENVOI. Une notification poussée est un signal
-- volatil : elle s'efface d'un balayage, n'arrive pas si le téléphone est éteint, et disparaît
-- à la réinstallation. L'agent qui balaie « 7 échéances dans 3 jours » à 8 h 20 en marchant
-- n'a plus aucun moyen de la retrouver. Le centre de notifications de la maquette suppose donc
-- que chaque notification soit RANGÉE : le push annonce, le journal conserve.
--
-- Corollaire : une notification existe même si le push échoue — téléphone jamais déclaré,
-- projet Expo non rattaché, réseau absent. `envoye_at` vide dit « rangée, pas poussée », et
-- l'agent la retrouvera à sa prochaine ouverture. L'inverse — ne rien garder quand l'envoi
-- échoue — ferait disparaître l'information pour une panne de messagerie.
--
-- CE QU'ELLE NE PORTE PAS. Ni nom de membre, ni montant : une notification s'affiche sur un
-- écran verrouillé, que n'importe qui lit par-dessus l'épaule de l'agent. C'est la règle
-- écrite sur la maquette, et elle vaut pour le titre comme pour le corps. Le détail s'ouvre
-- dans l'application, après déverrouillage.

CREATE TABLE IF NOT EXISTS notification_mobile (
    id          BIGSERIAL     PRIMARY KEY,
    user_id     BIGINT        NOT NULL REFERENCES users (user_id),
    categorie   VARCHAR(20)   NOT NULL,
    titre       VARCHAR(120)  NOT NULL,
    corps       VARCHAR(300)  NOT NULL,

    -- Où l'application doit ouvrir quand l'agent touche la notification, et avec quoi.
    -- Volontairement libre : un écran nouveau ne demandera pas de migration.
    ecran       VARCHAR(40),
    parametres  JSONB,

    creee_at    TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    envoye_at   TIMESTAMPTZ,                    -- quand le push est parti ; vide = rangée seulement
    nb_appareils INTEGER      NOT NULL DEFAULT 0,
    lue_at      TIMESTAMPTZ,

    CONSTRAINT ck_notification_categorie CHECK (categorie IN (
        'PORTEFEUILLE',     -- échéances et impayés du matin
        'RECOUVREMENT',     -- promesses à vérifier
        'SYNCHRONISATION',  -- ce qui est parti tout seul
        'RECLAMATION',      -- prise en charge, réponse
        'DOSSIER'           -- avancée dans le circuit de validation
    ))
);

COMMENT ON TABLE notification_mobile IS
'V215 : journal des notifications de l''application mobile. Le push annonce, le journal conserve : une notification balayee sur l''ecran verrouille reste lisible dans le centre de notifications. envoye_at vide = rangee mais non poussee (aucun appareil declare, ou envoi en echec). Ni nom de membre ni montant : elle s''affiche sur un ecran verrouille.';

COMMENT ON COLUMN notification_mobile.ecran IS
'Ecran que l''application ouvre au toucher (accueil, portefeuille, synchronisation, reclamations, dossiers...). Chaine libre : un ecran nouveau ne demande pas de migration.';

-- Ce que l'écran demande : mes notifications, les plus récentes d'abord.
CREATE INDEX IF NOT EXISTS ix_notification_mobile_agent
    ON notification_mobile (user_id, creee_at DESC);

-- Le compteur de non lues, en tête de l'écran et sur la pastille.
CREATE INDEX IF NOT EXISTS ix_notification_mobile_non_lues
    ON notification_mobile (user_id) WHERE lue_at IS NULL;

-- Une notification de plus de quatre-vingt-dix jours n'apprend plus rien ; la purge vit
-- avec le ménage des lots de synchronisation, pas dans une tâche de plus.
