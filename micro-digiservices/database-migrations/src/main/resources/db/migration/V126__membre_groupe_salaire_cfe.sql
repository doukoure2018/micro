-- V126 : salaire net mensuel des membres d'un groupe CFE (Credit Fonctionnaire Epargne).
-- Meme principe que le credit fonctionnaire individuel, a l'echelle du groupe :
-- le salaire retenu a l'analyse charges & quotite = SOMME des salaires nets des membres
-- (quotite cessible = 35 % du cumul, capacite residuelle = 65 % du cumul + autres revenus - charges).
-- Renseigne uniquement pour le type CFE, comme les champs PE.

ALTER TABLE membre_groupe
    ADD COLUMN IF NOT EXISTS salaire_net_mensuel NUMERIC(15,2)
    CHECK (salaire_net_mensuel IS NULL OR salaire_net_mensuel >= 0);

COMMENT ON COLUMN membre_groupe.salaire_net_mensuel IS
'Salaire net mensuel du membre (type CFE uniquement). Le cumul du groupe sert de base a la quotite cessible (35 %) a l''analyse charges.';
