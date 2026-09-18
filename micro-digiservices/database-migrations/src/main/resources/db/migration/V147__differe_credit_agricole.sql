-- V147 : différé (moratoire) des crédits agricoles solidaires CAS / CAS-R (règle métier figée le 2026-09-18).
--
-- Règle : durée D (mois) = moratoire G + nombre d'échéances N. Capital constant M/N.
-- Intérêt simple mensuel sur capital restant : la 1re échéance porte (G + 1) mois d'intérêts,
-- les suivantes 1 mois. Dates : octroi + (G + k - 1) mois pour l'échéance k.
-- Exemple : 2 000 000, 9 mois, 2 échéances, moratoire 7, octroi 10/07/2026
--           -> 10/02/2027 : 1 480 000 ; 10/03/2027 : 1 030 000.
--
-- La mise en place dans SAF reste manuelle (l'agent saisit le crédit dans le core banking
-- après accord digi) : digi porte uniquement l'échéancier prévisionnel daté.
-- periode_differe (V26) existait mais était toujours écrit à 0 : il devient la saisie du moratoire.

ALTER TABLE demandeindividuel
    ADD COLUMN IF NOT EXISTS date_octroi_prevue DATE;

COMMENT ON COLUMN demandeindividuel.date_octroi_prevue
    IS 'Date d''octroi (décaissement) prévue, saisie par l''agent : date de référence de l''échéancier prévisionnel (SAF FEC_APERTURA)';
COMMENT ON COLUMN demandeindividuel.periode_differe
    IS 'Moratoire en mois (période de grâce sans remboursement, intérêts courus payés avec la 1re échéance). Pour CAS / CAS-R : durée = moratoire + nombre d''échéances';
COMMENT ON COLUMN demandeindividuel.taux_interet
    IS 'Taux d''intérêt en %. Pour les groupes CAS / CAS-R : taux MENSUEL sur capital restant (3 = 3 %/mois = 36 %/an dans SAF)';
