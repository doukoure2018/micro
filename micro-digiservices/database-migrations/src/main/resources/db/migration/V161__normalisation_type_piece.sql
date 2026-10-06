-- =====================================================================
-- Pièce d'identité : normaliser la valeur reçue au lieu de refuser l'écriture
-- Incident de production du 2026-10-06 (demande 2894, agence de Labé)
-- =====================================================================
--
-- Un agent ne pouvait pas enregistrer une correction dès qu'il choisissait la
-- pièce « Possession d'état » : l'écran de correction envoyait la forme SANS
-- accent, que la contrainte demandeindividuel_type_piece_check refuse. L'agent
-- ne voyait qu'un échec générique, sans aucune indication de la cause.
--
-- La forme accentuée est la forme de référence : 728 fiches la portent déjà.
-- Les quatre autres libellés de la liste sont, eux, sans accent — c'est cette
-- incohérence de la liste qui a rendu le piège invisible.
--
-- Élargir la contrainte aux deux orthographes aurait laissé coexister deux
-- écritures de la même pièce et faussé tout dénombrement. La valeur est donc
-- NORMALISÉE avant écriture : un écran qui enverrait une forme sans accent, ou
-- une casse différente, enregistre désormais la forme de référence au lieu
-- d'échouer. La contrainte reste inchangée et continue de rejeter une pièce
-- réellement inconnue.

CREATE OR REPLACE FUNCTION normaliser_type_piece() RETURNS trigger AS $$
DECLARE
    v_cle text;
BEGIN
    IF NEW.type_piece IS NULL OR btrim(NEW.type_piece) = '' THEN
        RETURN NEW;
    END IF;

    -- Comparaison insensible à la casse et aux accents.
    v_cle := translate(lower(btrim(NEW.type_piece)),
                       'àâäéèêëîïôöùûüç',
                       'aaaeeeeiioouuuc');

    NEW.type_piece := CASE v_cle
        WHEN 'carte nationale d''identite'   THEN 'Carte nationale d''identite'
        WHEN 'carte d''identite biometrique' THEN 'Carte d''identite Biometrique'
        WHEN 'possession d''etat'            THEN 'Possession d''état'
        WHEN 'carte d''identite personnelle' THEN 'Carte d''identite personnelle'
        WHEN 'passeport'                     THEN 'Passeport'
        -- Pièce inconnue : laissée telle quelle, la contrainte la rejettera.
        ELSE NEW.type_piece
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_normaliser_type_piece ON demandeIndividuel;

CREATE TRIGGER trg_normaliser_type_piece
    BEFORE INSERT OR UPDATE OF type_piece ON demandeIndividuel
    FOR EACH ROW EXECUTE FUNCTION normaliser_type_piece();

COMMENT ON FUNCTION normaliser_type_piece() IS
    'Ramène type_piece à la forme de référence de la liste autorisée, quelles que soient la casse et les accents reçus (incident 2026-10-06).';
