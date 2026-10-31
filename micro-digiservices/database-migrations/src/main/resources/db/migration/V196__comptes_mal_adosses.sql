-- =====================================================================================
-- V196 : comptes de remboursement mal adossés — lot 1, détection et alerte (DSIG, 31/10/2026)
-- =====================================================================================
--
-- Le compte de remboursement d'un crédit SAF est `PR.PR_CREDITOS.ID_CUENTA`. C'est de lui que
-- SAF prélève l'échéance. Il doit être un compte courant (014) ou d'épargne (011), appartenir au
-- client lui-même, et être actif. Quand il ne l'est pas, le prélèvement ne peut pas aboutir :
-- l'échéance reste impayée et le crédit entre dans le PAR pour une raison qui n'a rien à voir
-- avec la capacité du client à payer. Le pire cas est le compte d'un autre client : le
-- remboursement part du mauvais compte, et deux dossiers sont faussés à la fois.
--
-- La surveillance lit la base de PRODUCTION toutes les heures. Ce journal retient ce qui est
-- déjà connu, pour que le courriel ne signale que le nouveau : sans lui, chaque passage
-- renverrait les mêmes lignes et l'alerte deviendrait du bruit en deux jours — la leçon de
-- V177 sur les crédits négatifs.
--
-- Les destinataires sont ceux de l'alerte des crédits négatifs (porteurs de la rubrique
-- CREDITS_NEGATIFS) : décision du 31/10/2026. Aucune liste à tenir ici.

CREATE TABLE IF NOT EXISTS credit_compte_anomalie (
    id                 BIGSERIAL     PRIMARY KEY,

    -- Le crédit concerné (identifiants SAF, pas de FK possible)
    cod_agencia        VARCHAR(5)    NOT NULL,
    num_credito        BIGINT        NOT NULL,
    cod_cliente        VARCHAR(20),
    nom_cliente        VARCHAR(150),
    des_agencia        VARCHAR(100),
    tip_credito        INTEGER,
    mon_credito        NUMERIC(20,2),
    mon_saldo          NUMERIC(20,2),
    ind_estado         VARCHAR(5),              -- D/A en cours, I apuré, J contentieux
    fec_apertura       DATE,
    fec_vencimiento    DATE,

    -- Le compte de remboursement tel qu'il a été saisi, et ce qu'il est réellement
    id_cuenta          VARCHAR(40),
    type_compte        VARCHAR(5),              -- positions 4 à 6 du numéro ; NULL si illisible
    famille            VARCHAR(30)   NOT NULL,
    compte_client      VARCHAR(20),             -- propriétaire réel du compte rattaché
    compte_agencia     VARCHAR(5),
    compte_etat        VARCHAR(5),
    compte_solde       NUMERIC(20,2),

    -- À qui l'anomalie est imputable : c'est ce qui la rend corrigeable
    saisi_par          VARCHAR(40),             -- COD_USUARIO, l'usager SAF qui a saisi
    date_saisie        TIMESTAMP,               -- FEC_ADICION
    agent_credit       VARCHAR(40),             -- COD_OFICIAL

    -- Vie de la ligne
    detecte_at         TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dernier_vu_at      TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    famille_changee_at TIMESTAMPTZ,             -- l'anomalie a changé de nature depuis la détection
    signale_at         TIMESTAMPTZ,             -- quand le courriel est parti ; NULL = jamais signalé
    corrige_at         TIMESTAMPTZ,             -- disparu de la liste SAF : le compte a été rattaché

    -- La preuve de ce qu'était l'anomalie au moment de la correction. Écrite UNE fois, jamais
    -- réécrite : c'est exactement l'erreur que V193 a dû réparer sur le solde des crédits
    -- négatifs, où la colonne de preuve était remise à jour à chaque confrontation et ne
    -- prouvait donc plus rien.
    compte_a_la_correction  VARCHAR(40),
    famille_a_la_correction VARCHAR(30),

    -- Suivi côté DSIG : digi ne corrige pas SAF, il note qui s'en occupe (lot 2)
    traite_par_user_id BIGINT        REFERENCES users(user_id),
    traite_at          TIMESTAMPTZ,
    commentaire        VARCHAR(500),

    CONSTRAINT chk_cca_famille CHECK (famille IN
        ('PAS_DE_COMPTE', 'COMPTE_INEXISTANT', 'COMPTE_AUTRE_CLIENT', 'COMPTE_NON_ACTIF', 'TYPE_NON_AUTORISE'))
);

-- Une seule ligne ouverte par crédit : la clé de rapprochement entre deux passages.
CREATE UNIQUE INDEX IF NOT EXISTS uq_credit_compte_anomalie_ouverte
    ON credit_compte_anomalie (cod_agencia, num_credito) WHERE corrige_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_credit_compte_anomalie_famille
    ON credit_compte_anomalie (famille) WHERE corrige_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_credit_compte_anomalie_saisi_par
    ON credit_compte_anomalie (saisi_par) WHERE corrige_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_credit_compte_anomalie_detecte
    ON credit_compte_anomalie (detecte_at DESC);

COMMENT ON TABLE credit_compte_anomalie IS
'Credits SAF dont le compte de remboursement n''est pas un compte courant (014) ou d''epargne (011) actif du client lui-meme. Journal des cas connus, pour que l''alerte ne signale que le nouveau. Lecture seule sur SAF : digi n''y ecrit jamais.';
COMMENT ON COLUMN credit_compte_anomalie.famille IS
'PAS_DE_COMPTE : aucun compte saisi. COMPTE_INEXISTANT : le numero ne correspond a aucun compte. COMPTE_AUTRE_CLIENT : le compte appartient a quelqu''un d''autre. COMPTE_NON_ACTIF : compte ferme ou bloque. TYPE_NON_AUTORISE : compte a terme, interne, ou autre nature. Une seule famille par credit, la plus grave.';
COMMENT ON COLUMN credit_compte_anomalie.compte_a_la_correction IS
'Le compte fautif au moment de la correction, fige une fois pour toutes : sans lui, on ne saurait plus ce qui avait ete corrige.';
