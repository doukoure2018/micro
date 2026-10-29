-- =====================================================================================
-- V193 : le solde corrigé d'un crédit négatif, figé une fois pour toutes (DSIG, 29/10/2026)
-- =====================================================================================
--
-- Demande du jour : une colonne « solde corrigé » qui porte le montant constaté après la
-- régularisation et qui ne change plus. Un crédit à -12 000 ramené à 20 000 garde 20 000,
-- quoi qu'il arrive ensuite.
--
-- La plateforme gardait déjà deux soldes, et aucun des deux ne faisait cela :
--
--   * `solde_apres` (V183) est réécrit à CHAQUE confrontation à SAF — la clôture, mais aussi
--     le bouton « Lire le solde dans SAF aujourd'hui », le passage horaire et la vérification
--     des prises en charge. Il dit donc le DERNIER solde lu, pas celui de la correction. C'est
--     lui qui alimentait la colonne « Solde après correction » de l'écran, d'où la demande.
--   * `solde_a_la_correction` (V177) est bien figé, mais il n'est lu nulle part (absent de la
--     requête de l'écran et de l'objet envoyé au navigateur) et l'ancienne voie de clôture y
--     écrivait 0 au lieu du solde réel.
--
-- Les deux lectures sont utiles et restent : le dernier solde lu détecte une rechute, c'est lui
-- qui fait apparaître « Encore négatif aujourd'hui » sur une clôture prématurée. Le solde figé,
-- lui, sert la traçabilité et le chiffrage. L'écran les montre côte à côte, avec deux libellés
-- qui ne se confondent pas.

ALTER TABLE credit_negatif ADD COLUMN IF NOT EXISTS solde_corrige        NUMERIC(20,2);
ALTER TABLE credit_negatif ADD COLUMN IF NOT EXISTS solde_corrige_at     TIMESTAMPTZ;
ALTER TABLE credit_negatif ADD COLUMN IF NOT EXISTS solde_corrige_source VARCHAR(10);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'credit_negatif_solde_corrige_source_check') THEN
        ALTER TABLE credit_negatif ADD CONSTRAINT credit_negatif_solde_corrige_source_check
            CHECK (solde_corrige_source IS NULL OR solde_corrige_source IN ('SAF', 'REPRISE'));
    END IF;
END $$;

COMMENT ON COLUMN credit_negatif.solde_corrige IS
    'Solde que SAF montrait au moment ou la regularisation a ete constatee. Ecrit UNE SEULE FOIS, jamais ecrase : une relecture ulterieure ne touche que solde_apres. NULL quand il n''y a rien eu a figer (credit disparu de SAF, arrondi, cloture sans preuve).';
COMMENT ON COLUMN credit_negatif.solde_corrige_source IS
    'SAF : valeur lue au moment de la correction. REPRISE : valeur reconstituee apres coup, depuis la derniere lecture connue — elle vaut une preuve approchee, pas une observation.';
COMMENT ON COLUMN credit_negatif.solde_apres IS
    'Dernier solde lu dans SAF, remis a jour a chaque verification. Sert a detecter une rechute ; pour le montant de la regularisation, voir solde_corrige.';

-- ------------------------------------------------------------------ reprise du passé
-- Meilleure preuve disponible pour les lignes déjà closes, dans cet ordre : le dernier solde lu
-- quand la conclusion est « Corrigé » et qu'il est positif ou nul, sinon l'ancienne colonne figée
-- quand elle n'est pas à zéro. Toutes ces lignes sont marquées REPRISE.
--
-- Les clôtures antérieures à la preuve de correction (celles de septembre) restent sans solde
-- figé : rien dans la base ne permet de le reconstituer, et une case vide vaut mieux qu'un
-- chiffre fabriqué. Un crédit clos dans SAF sans régularisation n'en reçoit pas non plus.

UPDATE credit_negatif
   SET solde_corrige = solde_apres,
       solde_corrige_at = corrige_at,
       solde_corrige_source = 'REPRISE'
 WHERE solde_corrige IS NULL
   AND corrige_at IS NOT NULL
   AND conclusion = 'CORRIGE'
   AND solde_apres IS NOT NULL
   AND solde_apres >= 0;

UPDATE credit_negatif
   SET solde_corrige = solde_a_la_correction,
       solde_corrige_at = corrige_at,
       solde_corrige_source = 'REPRISE'
 WHERE solde_corrige IS NULL
   AND corrige_at IS NOT NULL
   AND solde_a_la_correction IS NOT NULL
   AND solde_a_la_correction > 0
   AND (conclusion IS NULL OR conclusion = 'CORRIGE');
