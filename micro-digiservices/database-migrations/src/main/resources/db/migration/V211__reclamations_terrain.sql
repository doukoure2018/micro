-- =====================================================================================
-- V211 : les réclamations du terrain (lot 2 de l'application mobile)
-- =====================================================================================
--
-- V207 a posé la rubrique RECLAMATIONS et les six catégories, avec la direction responsable
-- de chacune. Il manquait la réclamation elle-même. La voici.
--
-- CE QU'ELLE PORTE. Un agent signale depuis le terrain ; la réclamation garde le contexte
-- qu'il avait sous les yeux — le crédit et le membre quand elle en vient, rien quand elle
-- n'en vient pas. Elle est acheminée par courriel au responsable de sa catégorie, les autres
-- porteurs de la rubrique en copie ; son acheminement est daté pour qu'un courriel perdu se
-- voie.
--
-- IDEMPOTENCE. Comme une visite : l'identifiant est créé sur le téléphone et unique en base.
-- Une transmission rejouée après une coupure répond « déjà reçue » et n'écrit rien deux fois.
-- C'est la seule garantie qui tienne quand le réseau coupe au milieu d'un envoi.
--
-- POURQUOI UN STATUT, ET SI PEU. Trois états et pas davantage : OUVERTE, EN_COURS, TRAITEE.
-- Un circuit de validation serait une autre demande ; ici il s'agit de savoir qui s'en occupe
-- et si l'agent a eu sa réponse. Le passage à EN_COURS nomme celui qui prend en charge — sans
-- cela, six directions destinataires veut dire que personne ne s'en occupe.

CREATE TABLE IF NOT EXISTS reclamation (
    id                       BIGSERIAL     PRIMARY KEY,
    identifiant_client       VARCHAR(64)   NOT NULL UNIQUE,   -- créé sur le téléphone
    categorie                VARCHAR(40)   NOT NULL REFERENCES reclamation_categorie (code),
    objet                    VARCHAR(160)  NOT NULL,
    message                  TEXT          NOT NULL,

    -- Le contexte, quand la réclamation part d'un dossier : tout est facultatif.
    cod_agencia              VARCHAR(5),
    num_credito              BIGINT,
    cod_cliente              VARCHAR(15),

    auteur_user_id           BIGINT        NOT NULL REFERENCES users (user_id),
    appareil_id              BIGINT        REFERENCES appareil_mobile (id),
    sync_lot_id              BIGINT        REFERENCES sync_lot (id),
    saisie_at                TIMESTAMPTZ   NOT NULL,          -- l'heure du téléphone
    recue_at                 TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    statut                   VARCHAR(20)   NOT NULL DEFAULT 'OUVERTE',
    prise_en_charge_user_id  BIGINT        REFERENCES users (user_id),
    prise_en_charge_at       TIMESTAMPTZ,
    reponse                  TEXT,
    repondu_par_user_id      BIGINT        REFERENCES users (user_id),
    repondu_at               TIMESTAMPTZ,
    notifiee_at              TIMESTAMPTZ,                     -- quand le courriel est parti
    nb_destinataires         INTEGER,

    CONSTRAINT ck_reclamation_statut
        CHECK (statut IN ('OUVERTE', 'EN_COURS', 'TRAITEE')),
    -- Dix caractères : en dessous, ce n'est pas un signalement, c'est un accident de saisie.
    CONSTRAINT ck_reclamation_message
        CHECK (length(trim(message)) >= 10),
    -- Une réclamation traitée porte sa réponse : l'agent doit savoir ce qui lui a été répondu.
    CONSTRAINT ck_reclamation_reponse
        CHECK (statut <> 'TRAITEE' OR (reponse IS NOT NULL AND length(trim(reponse)) >= 2))
);

COMMENT ON TABLE reclamation IS
'V211 : reclamations saisies depuis l''application mobile, acheminees par courriel au responsable de la categorie (V207) et aux autres porteurs de la rubrique RECLAMATIONS en copie. identifiant_client = idempotence de la transmission.';
COMMENT ON COLUMN reclamation.notifiee_at IS
'Moment ou le courriel est parti. Nul = la reclamation est en base mais personne n''a ete prevenu : c''est une anomalie a voir.';

-- Ce que l'agent demande : « mes réclamations », les plus récentes en tête.
CREATE INDEX IF NOT EXISTS ix_reclamation_auteur
    ON reclamation (auteur_user_id, saisie_at DESC);

-- Ce que les directions demandent : la file de ce qui n'est pas traité.
CREATE INDEX IF NOT EXISTS ix_reclamation_file
    ON reclamation (statut, categorie, recue_at DESC);

CREATE INDEX IF NOT EXISTS ix_reclamation_credit
    ON reclamation (cod_agencia, num_credito) WHERE num_credito IS NOT NULL;

-- ------------------------------------------------------------------ les pièces jointes
-- Même forme que recouvrement_photo (V209) : identifiant créé sur le téléphone, fichier
-- rangé par le stockage de la plateforme, envoi APRÈS la réclamation et rejouable seul.

CREATE TABLE IF NOT EXISTS reclamation_piece (
    id                 BIGSERIAL     PRIMARY KEY,
    identifiant_client VARCHAR(64)   NOT NULL UNIQUE,
    reclamation_id     BIGINT        NOT NULL REFERENCES reclamation (id) ON DELETE CASCADE,
    fichier            VARCHAR(255)  NOT NULL,
    taille_octets      BIGINT,
    prise_at           TIMESTAMPTZ,
    recue_at           TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_reclamation_piece_reclamation
    ON reclamation_piece (reclamation_id);

COMMENT ON TABLE reclamation_piece IS
'V211 : pieces jointes a une reclamation du terrain. Envoyees apres la reclamation, une par une, rejouables par leur identifiant_client.';
