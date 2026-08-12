-- V121 : Pieces jointes d'une demande individuelle (phase 3 du credit fonctionnaire).
-- Premiere utilisation : bulletin de salaire et attestation de service exiges
-- au dossier fonctionnaire. La table reste generique (type_piece libre) pour
-- accueillir plus tard les pieces des autres natures de credit.

CREATE TABLE IF NOT EXISTS demande_piece_jointe (
    piece_jointe_id         BIGSERIAL PRIMARY KEY,
    demandeindividuel_id    BIGINT NOT NULL
                            REFERENCES demandeindividuel(demandeindividuel_id) ON DELETE CASCADE,
    type_piece              VARCHAR(50) NOT NULL,
    nom_fichier             VARCHAR(255),
    url_fichier             TEXT NOT NULL,
    ajoute_par              VARCHAR(255),
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_demande_piece_jointe_demande
    ON demande_piece_jointe(demandeindividuel_id);

COMMENT ON TABLE demande_piece_jointe IS
'Pieces jointes d''une demande individuelle (fichiers stockes par FileStorageService, servis sur /ecredit/files/**). Types utilises par le credit fonctionnaire : BULLETIN_SALAIRE, ATTESTATION_SERVICE, AUTRE.';
COMMENT ON COLUMN demande_piece_jointe.type_piece IS
'Type de piece : BULLETIN_SALAIRE, ATTESTATION_SERVICE, AUTRE (valeurs libres pour extension future).';
