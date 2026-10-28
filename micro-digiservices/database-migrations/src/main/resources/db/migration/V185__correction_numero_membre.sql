-- =====================================================================================
-- V185 : corriger le numéro de membre d'un dossier (DSIG, 28/10/2026)
-- =====================================================================================
--
-- Le 26 octobre, la vérification des numéros contre SAF a mis au jour 118 dossiers en
-- cours dont le numéro de membre n'existe pas dans SAF. Le 28 octobre, la DSIG a posé la
-- bonne question : comment un agent ou un directeur d'agence corrige-t-il ces dossiers ?
--
-- La réponse était : il ne peut pas. Le numéro n'est écrit qu'une fois, à la création du
-- dossier, par la procédure d'insertion. Aucun écran, pour aucun profil, ne permettait de
-- le modifier ensuite ; les seules issues étaient d'annuler le dossier et de le ressaisir,
-- ce qui fausse le motif d'annulation, ou une correction en base par la DSIG.
--
-- La correction s'ouvre donc, avec trois garde-fous :
--
--   1. seuls l'agent qui porte le dossier et le directeur de son agence corrigent, et
--      seulement tant que le dossier n'est pas validé définitivement ;
--   2. le nouveau numéro est confronté à SAF avant d'être enregistré. Un numéro inconnu
--      est refusé — remplacer un mauvais numéro par un autre mauvais numéro n'avance à
--      rien. Si SAF ne répond pas, la correction attend : on n'écrit pas sans preuve ;
--   3. chaque correction laisse une trace nominative, avec l'ancien et le nouveau numéro,
--      et le nom que SAF a renvoyé. Un numéro de membre identifie le client d'un crédit :
--      le changer doit pouvoir s'expliquer plus tard.

CREATE TABLE IF NOT EXISTS demande_numero_membre_correction (
    id                   BIGSERIAL PRIMARY KEY,
    demandeindividuel_id BIGINT       NOT NULL REFERENCES demandeindividuel(demandeindividuel_id) ON DELETE CASCADE,
    ancien_numero        VARCHAR(50),
    nouveau_numero       VARCHAR(50)  NOT NULL,
    -- Ce que SAF a répondu sur le nouveau numéro, au moment de la correction.
    nom_saf              VARCHAR(200),
    cod_agencia_saf      VARCHAR(20),
    motif                VARCHAR(255),
    par_user_id          BIGINT       NOT NULL REFERENCES users(user_id),
    par_nom              VARCHAR(200),
    par_role             VARCHAR(30),
    date_correction      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_correction_numero_demande
    ON demande_numero_membre_correction (demandeindividuel_id, date_correction DESC);

COMMENT ON TABLE demande_numero_membre_correction IS
'Corrections du numero de membre d''un dossier de credit (V185) : qui a corrige, quand, de quel numero vers quel autre, et le nom que SAF a renvoye sur le nouveau. Le numero identifie le client du credit : chaque changement doit pouvoir s''expliquer.';
