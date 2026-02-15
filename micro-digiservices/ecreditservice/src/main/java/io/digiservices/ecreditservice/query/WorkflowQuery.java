package io.digiservices.ecreditservice.query;

public class WorkflowQuery {

    // ==================== AC APPROVAL ====================

    public static final String UPDATE_APPROUVER_AC = """
            UPDATE demandeindividuel
            SET validation_state = 'APPROVED',
                avis_agent_credit = :avis,
                cod_usuarios = :codUsuarios
            WHERE demandeindividuel_id = :demandeId
              AND validation_state IN ('SELECTION', 'CORRECTION')
            """;

    // ==================== DA LISTS ====================

    public static final String SELECT_A_VALIDER_DA = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.cod_usuarios AS "codUsuarios",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            WHERE d.validation_state = 'APPROVED'
              AND d.agence = :agenceId
            ORDER BY d.createdat DESC
            """;

    public static final String SELECT_EN_CORRECTION_DR_FOR_DA = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.motif_rejet_dr AS "motifRejetDr",
                   d.sections_a_revoir_dr AS "sectionsARevoirDr",
                   d.instructions_da AS "instructionsDa",
                   d.validated_by_dr AS "validatedByDr",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            WHERE d.validation_state = 'CORRECTION_DR'
              AND d.agence = :agenceId
            ORDER BY d.createdat DESC
            """;

    // ==================== DA ACTIONS ====================

    public static final String UPDATE_VALIDER_DA = """
            UPDATE demandeindividuel
            SET validation_state = 'VALIDATED_DA',
                avis_da = :avis,
                validated_by_da = :validatedBy,
                date_validation_da = CURRENT_TIMESTAMP,
                motif_rejet_da = NULL,
                sections_a_revoir_da = NULL,
                instructions_ac = NULL
            WHERE demandeindividuel_id = :demandeId
              AND validation_state IN ('APPROVED', 'CORRECTION_DR')
            """;

    public static final String UPDATE_REJETER_DA = """
            UPDATE demandeindividuel
            SET validation_state = 'CORRECTION',
                motif_rejet_da = :motifRejet,
                sections_a_revoir_da = :sectionsARevoir,
                instructions_ac = :instructions,
                validated_by_da = :validatedBy,
                date_validation_da = NULL
            WHERE demandeindividuel_id = :demandeId
              AND validation_state = 'APPROVED'
            """;

    // ==================== AC LISTS ====================

    public static final String SELECT_EN_CORRECTION_AC = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.motif_rejet_da AS "motifRejetDa",
                   d.sections_a_revoir_da AS "sectionsARevoirDa",
                   d.instructions_ac AS "instructionsAc",
                   d.validated_by_da AS "validatedByDa",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            WHERE d.validation_state = 'CORRECTION'
              AND (
                  (CAST(:agenceId AS BIGINT) IS NOT NULL AND CAST(:pointventeId AS BIGINT) IS NULL AND d.agence = CAST(:agenceId AS BIGINT)) OR
                  (CAST(:pointventeId AS BIGINT) IS NOT NULL AND d.pos = CAST(:pointventeId AS BIGINT))
              )
            ORDER BY d.createdat DESC
            """;

    public static final String SELECT_EN_ATTENTE_DA = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            WHERE d.validation_state = 'APPROVED'
              AND (
                  (CAST(:agenceId AS BIGINT) IS NOT NULL AND CAST(:pointventeId AS BIGINT) IS NULL AND d.agence = CAST(:agenceId AS BIGINT)) OR
                  (CAST(:pointventeId AS BIGINT) IS NOT NULL AND d.pos = CAST(:pointventeId AS BIGINT))
              )
            ORDER BY d.createdat DESC
            """;

    public static final String SELECT_SUIVI_VALIDATION_AC = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.avis_da AS "avisDa",
                   d.avis_dr AS "avisDr",
                   d.validated_by_da AS "validatedByDa",
                   d.validated_by_dr AS "validatedByDr",
                   d.date_validation_da AS "dateValidationDa",
                   d.date_validation_dr AS "dateValidationDr",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            WHERE d.validation_state IN ('APPROVED', 'VALIDATED_DA', 'VALIDATED_DR', 'VALIDATED_FINAL')
              AND (
                  (CAST(:agenceId AS BIGINT) IS NOT NULL AND CAST(:pointventeId AS BIGINT) IS NULL AND d.agence = CAST(:agenceId AS BIGINT)) OR
                  (CAST(:pointventeId AS BIGINT) IS NOT NULL AND d.pos = CAST(:pointventeId AS BIGINT))
              )
            ORDER BY d.createdat DESC
            """;

    public static final String SELECT_EN_CORRECTION_DR_FOR_AC = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.motif_rejet_dr AS "motifRejetDr",
                   d.sections_a_revoir_dr AS "sectionsARevoirDr",
                   d.instructions_da AS "instructionsDa",
                   d.validated_by_dr AS "validatedByDr",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.avis_da AS "avisDa",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            WHERE d.validation_state = 'CORRECTION_DR'
              AND (
                  (CAST(:agenceId AS BIGINT) IS NOT NULL AND CAST(:pointventeId AS BIGINT) IS NULL AND d.agence = CAST(:agenceId AS BIGINT)) OR
                  (CAST(:pointventeId AS BIGINT) IS NOT NULL AND d.pos = CAST(:pointventeId AS BIGINT))
              )
            ORDER BY d.createdat DESC
            """;

    // ==================== DR LISTS ====================

    public static final String SELECT_A_VALIDER_DR = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.avis_da AS "avisDa",
                   d.validated_by_da AS "validatedByDa",
                   d.date_validation_da AS "dateValidationDa",
                   d.createdat AS "createdAt",
                   ag.libele AS "agenceLibele"
            FROM demandeindividuel d
            LEFT JOIN agence ag ON d.agence = ag.id
            WHERE d.validation_state = 'VALIDATED_DA'
              AND d.delegation = :delegationId
            ORDER BY d.createdat DESC
            """;

    public static final String SELECT_EN_CORRECTION_DE_FOR_DR = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.motif_rejet_de AS "motifRejetDe",
                   d.sections_a_revoir_de AS "sectionsARevoirDe",
                   d.instructions_dr AS "instructionsDr",
                   d.validated_by_de AS "validatedByDe",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.avis_da AS "avisDa",
                   d.createdat AS "createdAt",
                   ag.libele AS "agenceLibele"
            FROM demandeindividuel d
            LEFT JOIN agence ag ON d.agence = ag.id
            WHERE d.validation_state = 'CORRECTION_DE'
              AND d.delegation = :delegationId
            ORDER BY d.createdat DESC
            """;

    // ==================== DR ACTIONS ====================

    public static final String UPDATE_VALIDER_DR = """
            UPDATE demandeindividuel
            SET validation_state = 'VALIDATED_DR',
                avis_dr = :avis,
                validated_by_dr = :validatedBy,
                date_validation_dr = CURRENT_TIMESTAMP,
                motif_rejet_dr = NULL,
                sections_a_revoir_dr = NULL,
                instructions_da = NULL
            WHERE demandeindividuel_id = :demandeId
              AND validation_state IN ('VALIDATED_DA', 'CORRECTION_DE')
            """;

    public static final String UPDATE_REJETER_DR = """
            UPDATE demandeindividuel
            SET validation_state = 'CORRECTION_DR',
                motif_rejet_dr = :motifRejet,
                sections_a_revoir_dr = :sectionsARevoir,
                instructions_da = :instructions,
                validated_by_dr = :validatedBy,
                date_validation_dr = NULL
            WHERE demandeindividuel_id = :demandeId
              AND validation_state = 'VALIDATED_DA'
            """;

    // ==================== DE LISTS ====================

    public static final String SELECT_A_VALIDER_DE = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.avis_da AS "avisDa",
                   d.avis_dr AS "avisDr",
                   d.validated_by_da AS "validatedByDa",
                   d.validated_by_dr AS "validatedByDr",
                   d.date_validation_da AS "dateValidationDa",
                   d.date_validation_dr AS "dateValidationDr",
                   d.createdat AS "createdAt",
                   del.libele AS "delegationLibele",
                   ag.libele AS "agenceLibele"
            FROM demandeindividuel d
            LEFT JOIN delegation del ON d.delegation = del.id
            LEFT JOIN agence ag ON d.agence = ag.id
            WHERE d.validation_state = 'VALIDATED_DR'
            ORDER BY d.createdat DESC
            """;

    // ==================== DE ACTIONS ====================

    public static final String UPDATE_VALIDER_DE = """
            UPDATE demandeindividuel
            SET validation_state = 'VALIDATED_FINAL',
                avis_de = :avis,
                validated_by_de = :validatedBy,
                date_validation_de = CURRENT_TIMESTAMP,
                motif_rejet_de = NULL,
                sections_a_revoir_de = NULL,
                instructions_dr = NULL
            WHERE demandeindividuel_id = :demandeId
              AND validation_state = 'VALIDATED_DR'
            """;

    public static final String UPDATE_REJETER_DE = """
            UPDATE demandeindividuel
            SET validation_state = 'CORRECTION_DE',
                motif_rejet_de = :motifRejet,
                sections_a_revoir_de = :sectionsARevoir,
                instructions_dr = :instructions,
                validated_by_de = :validatedBy,
                date_validation_de = NULL
            WHERE demandeindividuel_id = :demandeId
              AND validation_state = 'VALIDATED_DR'
            """;
}
