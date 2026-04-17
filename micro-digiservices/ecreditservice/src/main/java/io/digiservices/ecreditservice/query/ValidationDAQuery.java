package io.digiservices.ecreditservice.query;

public class ValidationDAQuery {

    public static final String UPSERT_VALIDER = """
            INSERT INTO validation_da (demandeindividuel_id, type_validation, statut, valide_par_id, valide_par_nom, date_validation)
            VALUES (:demandeId, :typeValidation, 'VALIDE', :userId, :nomDA, CURRENT_TIMESTAMP)
            ON CONFLICT (demandeindividuel_id, type_validation)
            DO UPDATE SET
                statut = 'VALIDE',
                motif_rejet = NULL,
                sections_a_revoir = NULL,
                instructions_ac = NULL,
                valide_par_id = :userId,
                valide_par_nom = :nomDA,
                date_validation = CURRENT_TIMESTAMP,
                date_rejet = NULL
            RETURNING validation_da_id
            """;

    public static final String UPSERT_REJETER = """
            INSERT INTO validation_da (demandeindividuel_id, type_validation, statut, motif_rejet, sections_a_revoir, instructions_ac, valide_par_id, valide_par_nom, date_rejet)
            VALUES (:demandeId, :typeValidation, 'REJETE', :motifRejet, :sectionsARevoir, :instructionsAc, :userId, :nomDA, CURRENT_TIMESTAMP)
            ON CONFLICT (demandeindividuel_id, type_validation)
            DO UPDATE SET
                statut = 'REJETE',
                motif_rejet = :motifRejet,
                sections_a_revoir = :sectionsARevoir,
                instructions_ac = :instructionsAc,
                valide_par_id = :userId,
                valide_par_nom = :nomDA,
                date_validation = NULL,
                date_rejet = CURRENT_TIMESTAMP
            RETURNING validation_da_id
            """;

    public static final String SELECT_BY_DEMANDE = """
            SELECT validation_da_id AS "validationDaId",
                   demandeindividuel_id AS "demandeindividuelId",
                   type_validation AS "typeValidation",
                   statut AS "statut",
                   motif_rejet AS "motifRejet",
                   sections_a_revoir AS "sectionsARevoir",
                   instructions_ac AS "instructionsAc",
                   valide_par_id AS "valideParId",
                   valide_par_nom AS "valideParNom",
                   date_validation AS "dateValidation",
                   date_rejet AS "dateRejet",
                   created_at AS "createdAt",
                   updated_at AS "updatedAt"
            FROM validation_da
            WHERE demandeindividuel_id = :demandeId
            ORDER BY type_validation
            """;

    public static final String RESET_ANALYSE_STATUT_BROUILLON = """
            UPDATE analyse_financiere
            SET statut = 'BROUILLON',
                motif_rejet = :motifRejet,
                updated_at = CURRENT_TIMESTAMP
            WHERE demandeindividuel_id = :demandeId
              AND statut = 'SOUMISE'
            """;

    public static final String SELECT_DEMANDES_REJETEES = """
            SELECT vd.validation_da_id AS "validationDaId",
                   vd.demandeindividuel_id AS "demandeindividuelId",
                   vd.type_validation AS "typeValidation",
                   vd.motif_rejet AS "motifRejet",
                   vd.sections_a_revoir AS "sectionsARevoir",
                   vd.instructions_ac AS "instructionsAc",
                   vd.valide_par_nom AS "valideParNom",
                   vd.date_rejet AS "dateRejet",
                   d.nom AS "nom",
                   d.prenom AS "prenom",
                   d.numero_membre AS "numeroMembre",
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.telephone AS "telephone",
                   af.statut AS "statutAnalyse",
                   af.date_soumission AS "dateSoumission",
                   af.updated_at AS "analyseUpdatedAt",
                   CASE
                       WHEN af.statut = 'SOUMISE' AND af.date_soumission > vd.date_rejet
                           THEN 'CORRIGE'
                       WHEN af.statut = 'BROUILLON'
                           THEN 'EN_COURS_CORRECTION'
                       ELSE 'EN_ATTENTE_CORRECTION'
                   END AS "statutCorrection"
            FROM validation_da vd
            JOIN demandeindividuel d ON d.demandeindividuel_id = vd.demandeindividuel_id
            LEFT JOIN analyse_financiere af ON af.demandeindividuel_id = vd.demandeindividuel_id
            WHERE vd.statut = 'REJETE'
            ORDER BY vd.date_rejet DESC
            """;

    public static final String SELECT_DEMANDES_VALIDEES_IDS = """
            SELECT DISTINCT d.demandeindividuel_id AS "demandeindividuelId"
            FROM demandeindividuel d
            JOIN validation_da f ON f.demandeindividuel_id = d.demandeindividuel_id
                AND f.type_validation = 'FLUX_TRESORERIE' AND f.statut = 'VALIDE'
            LEFT JOIN validation_da b ON b.demandeindividuel_id = d.demandeindividuel_id
                AND b.type_validation = 'BILAN_ACTIVITE'
            WHERE (
                -- Montant >= 50M : bilan + flux obligatoires
                (COALESCE(d.montant_demande, 0) >= 50000000 AND b.statut = 'VALIDE')
                OR
                -- Montant < 50M : flux seul suffit
                (COALESCE(d.montant_demande, 0) < 50000000)
            )
            """;

    public static final String SELECT_MONTANT_DEMANDE = """
            SELECT montant_demande
            FROM demandeindividuel
            WHERE demandeindividuel_id = :demandeId
            """;

    public static final String SELECT_BY_DEMANDE_AND_TYPE = """
            SELECT validation_da_id AS "validationDaId",
                   demandeindividuel_id AS "demandeindividuelId",
                   type_validation AS "typeValidation",
                   statut AS "statut",
                   motif_rejet AS "motifRejet",
                   sections_a_revoir AS "sectionsARevoir",
                   instructions_ac AS "instructionsAc",
                   valide_par_id AS "valideParId",
                   valide_par_nom AS "valideParNom",
                   date_validation AS "dateValidation",
                   date_rejet AS "dateRejet",
                   created_at AS "createdAt",
                   updated_at AS "updatedAt"
            FROM validation_da
            WHERE demandeindividuel_id = :demandeId
              AND type_validation = :typeValidation
            """;
}
