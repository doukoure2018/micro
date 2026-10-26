-- =====================================================================================
-- Credits negatifs : la preuve de la correction (2026-10-26)
--
-- « Corrige » voulait dire « n'apparait plus dans la liste des negatifs » : un credit annule ou
-- clos dans SAF avait la meme apparence qu'un credit regularise, et « pris en charge » etait une
-- declaration que rien ne confrontait a SAF. Quinze credits etaient marques pris en charge depuis
-- la veille alors que SAF les voyait toujours negatifs.
--
-- Chaque cloture garde desormais ce que SAF montrait a cet instant (solde, etat), qui a conclu
-- et comment : le passage horaire (AUTO) ou un agent depuis la page (MANUEL). La conclusion
-- distingue la regularisation (CORRIGE) de la disparition du credit (CLOS_SAF).
-- =====================================================================================

ALTER TABLE credit_negatif ADD COLUMN IF NOT EXISTS verifie_saf_at      TIMESTAMPTZ;
ALTER TABLE credit_negatif ADD COLUMN IF NOT EXISTS solde_apres         NUMERIC(18,2);
ALTER TABLE credit_negatif ADD COLUMN IF NOT EXISTS etat_apres          VARCHAR(2);
ALTER TABLE credit_negatif ADD COLUMN IF NOT EXISTS corrige_mode        VARCHAR(12);
ALTER TABLE credit_negatif ADD COLUMN IF NOT EXISTS corrige_par_user_id BIGINT;
ALTER TABLE credit_negatif ADD COLUMN IF NOT EXISTS conclusion          VARCHAR(20);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'credit_negatif_corrige_mode_check') THEN
        ALTER TABLE credit_negatif ADD CONSTRAINT credit_negatif_corrige_mode_check
            CHECK (corrige_mode IS NULL OR corrige_mode IN ('AUTO', 'MANUEL'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'credit_negatif_conclusion_check') THEN
        ALTER TABLE credit_negatif ADD CONSTRAINT credit_negatif_conclusion_check
            CHECK (conclusion IS NULL OR conclusion IN ('CORRIGE', 'CLOS_SAF'));
    END IF;
END $$;

COMMENT ON COLUMN credit_negatif.conclusion IS
    'CORRIGE : solde revenu a zero ou positif, credit en cours. CLOS_SAF : le credit a disparu (clos, annule, apure) sans preuve de regularisation.';
COMMENT ON COLUMN credit_negatif.verifie_saf_at IS
    'Derniere confrontation a SAF production depuis la page ou par le passage horaire, que le credit soit corrige ou toujours negatif.';

-- Les neuf clotures anterieures a cette migration restent sans preuve : mode AUTO, conclusion inconnue.
UPDATE credit_negatif SET corrige_mode = 'AUTO' WHERE corrige_at IS NOT NULL AND corrige_mode IS NULL;
