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
              AND (agent_credit_affecte IS NULL OR agent_credit_affecte = CAST(:userId AS BIGINT))
            """;

    /**
     * Demandes RENSEIGNEES mais NON APPROUVEES par l'agent : l'analyse financiere a ete
     * soumise (bilan/tresorerie/cautions saisis) mais la demande est restee en SELECTION
     * faute d'un clic sur "Approuver". A afficher en rappel sur le tableau de bord de l'agent.
     */
    public static final String SELECT_A_APPROUVER_AC = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.cod_usuarios AS "codUsuarios",
                   d.avis_agent_credit AS "avisAgentCredit",
                   af.statut AS "statutAnalyse",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            INNER JOIN analyse_financiere af ON af.demandeindividuel_id = d.demandeindividuel_id
            WHERE d.validation_state = 'SELECTION'
              AND d.statut_demande = 'EN_ATTENTE'
              AND af.statut IN ('BROUILLON', 'SOUMISE')
              AND (
                  (CAST(:agenceId AS BIGINT) IS NOT NULL AND CAST(:pointventeId AS BIGINT) IS NULL AND d.agence = CAST(:agenceId AS BIGINT)) OR
                  (CAST(:pointventeId AS BIGINT) IS NOT NULL AND d.pos = CAST(:pointventeId AS BIGINT))
              )
              AND (d.agent_credit_affecte IS NULL OR d.agent_credit_affecte = CAST(:userId AS BIGINT))
            ORDER BY d.createdat DESC
            """;

    // ==================== DA LISTS ====================

    public static final String SELECT_A_VALIDER_DA = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
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
                   d.nature_client AS "natureClient",
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

    /*
     * Echelle de delegation de pouvoirs (decision 2026-08-11) — le circuit s'arrete
     * au niveau competent pour le montant demande :
     *   1 a 25 000 000            -> validation finale DA
     *   25 000 001 a 50 000 000   -> validation finale DR
     *   50 000 001 a 100 000 000  -> validation finale DE
     *   100 000 001 et plus       -> visa final DG (PENDING_DG apres le DE)
     * Chaque UPDATE_VALIDER_X fait un CASE sur montant_demande : etat final si le
     * montant est dans son plafond, sinon transmission au niveau suivant.
     */
    public static final String UPDATE_VALIDER_DA = """
            UPDATE demandeindividuel
            SET validation_state = CASE
                                       WHEN COALESCE(montant_demande, 0) <= 25000000 THEN 'VALIDATED_FINAL'
                                       ELSE 'VALIDATED_DA'
                                   END,
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
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.motif_rejet_da AS "motifRejetDa",
                   d.sections_a_revoir_da AS "sectionsARevoirDa",
                   d.instructions_ac AS "instructionsAc",
                   d.validated_by_da AS "validatedByDa",
                   d.motif_rejet_dg AS "motifRejetDg",
                   d.sections_a_revoir_de AS "sectionsARevoirDe",
                   d.instructions_de AS "instructionsDe",
                   d.confirmed_by_de AS "confirmedByDe",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            WHERE d.validation_state = 'CORRECTION'
              AND (
                  (CAST(:agenceId AS BIGINT) IS NOT NULL AND CAST(:pointventeId AS BIGINT) IS NULL AND d.agence = CAST(:agenceId AS BIGINT)) OR
                  (CAST(:pointventeId AS BIGINT) IS NOT NULL AND d.pos = CAST(:pointventeId AS BIGINT))
              )
              AND (d.agent_credit_affecte IS NULL OR d.agent_credit_affecte = CAST(:userId AS BIGINT))
            ORDER BY d.createdat DESC
            """;

    // ==================== RENVOI DA -> AGENT (erreur de destination) ====================

    /** Le DA renvoie une demande "a valider" (APPROVED) vers l'agent createur. */
    public static final String UPDATE_RENVOYER_AGENT = """
            UPDATE demandeindividuel
            SET validation_state = 'RETOUR_AGENT',
                renvoi_agent_motif = :motif,
                renvoi_agent_by = :renvoyePar
            WHERE demandeindividuel_id = :demandeId
              AND validation_state = 'APPROVED'
            """;

    /** Demandes renvoyees a l'agent createur (identifie par cod_usuarios = nom complet). */
    public static final String SELECT_RENVOYEES_AC = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.cod_usuarios AS "codUsuarios",
                   d.renvoi_agent_motif AS "renvoiAgentMotif",
                   d.renvoi_agent_by AS "renvoiAgentBy",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            WHERE d.validation_state = 'RETOUR_AGENT'
              AND d.cod_usuarios = :codUsuarios
            ORDER BY d.createdat DESC
            """;

    /** L'agent corrige la destination et renvoie la demande au bon DA (-> APPROVED). */
    public static final String UPDATE_RESOUMETTRE_DA = """
            UPDATE demandeindividuel
            SET delegation = :delegation,
                agence = :agence,
                pos = :pos,
                validation_state = 'APPROVED',
                renvoi_agent_motif = NULL,
                renvoi_agent_by = NULL
            WHERE demandeindividuel_id = :demandeId
              AND validation_state = 'RETOUR_AGENT'
            """;

    public static final String SELECT_EN_ATTENTE_DA = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
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
              AND (d.agent_credit_affecte IS NULL OR d.agent_credit_affecte = CAST(:userId AS BIGINT))
            ORDER BY d.createdat DESC
            """;

    public static final String SELECT_SUIVI_VALIDATION_AC = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
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
              AND (d.agent_credit_affecte IS NULL OR d.agent_credit_affecte = CAST(:userId AS BIGINT))
            ORDER BY d.createdat DESC
            """;

    public static final String SELECT_EN_CORRECTION_DR_FOR_AC = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
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
              AND (d.agent_credit_affecte IS NULL OR d.agent_credit_affecte = CAST(:userId AS BIGINT))
            ORDER BY d.createdat DESC
            """;

    public static final String SELECT_EN_CORRECTION_DE_FOR_AC = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.motif_rejet_de AS "motifRejetDe",
                   d.sections_a_revoir_de AS "sectionsARevoirDe",
                   d.instructions_dr AS "instructionsDr",
                   d.validated_by_de AS "validatedByDe",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.avis_da AS "avisDa",
                   d.avis_dr AS "avisDr",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            WHERE d.validation_state = 'CORRECTION_DE'
              AND (
                  (CAST(:agenceId AS BIGINT) IS NOT NULL AND CAST(:pointventeId AS BIGINT) IS NULL AND d.agence = CAST(:agenceId AS BIGINT)) OR
                  (CAST(:pointventeId AS BIGINT) IS NOT NULL AND d.pos = CAST(:pointventeId AS BIGINT))
              )
              AND (d.agent_credit_affecte IS NULL OR d.agent_credit_affecte = CAST(:userId AS BIGINT))
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
                   d.nature_client AS "natureClient",
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
                   d.nature_client AS "natureClient",
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

    // Echelle de delegation : <= 50M le DR est le validateur final, au-dela transmission au DE.
    public static final String UPDATE_VALIDER_DR = """
            UPDATE demandeindividuel
            SET validation_state = CASE
                                       WHEN COALESCE(montant_demande, 0) <= 50000000 THEN 'VALIDATED_FINAL'
                                       ELSE 'VALIDATED_DR'
                                   END,
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
                   d.nature_client AS "natureClient",
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

    public static final String SELECT_VALIDES_DE = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.avis_da AS "avisDa",
                   d.avis_dr AS "avisDr",
                   d.avis_de AS "avisDe",
                   d.validated_by_da AS "validatedByDa",
                   d.validated_by_dr AS "validatedByDr",
                   d.validated_by_de AS "validatedByDe",
                   d.date_validation_da AS "dateValidationDa",
                   d.date_validation_dr AS "dateValidationDr",
                   d.date_validation_de AS "dateValidationDe",
                   d.createdat AS "createdAt",
                   del.libele AS "delegationLibele",
                   ag.libele AS "agenceLibele",
                   pv.libele AS "pointventeLibele"
            FROM demandeindividuel d
            LEFT JOIN delegation del ON d.delegation = del.id
            LEFT JOIN agence ag ON d.agence = ag.id
            LEFT JOIN pointvente pv ON d.pos = pv.id
            WHERE d.validation_state = 'VALIDATED_FINAL'
            ORDER BY d.date_validation_de DESC NULLS LAST, d.createdat DESC
            """;

    // ==================== DE ACTIONS ====================

    // Echelle de delegation : <= 100M le DE est le validateur final, au-dela (100 000 001 et plus)
    // le dossier part au DG (PENDING_DG) pour visa final.
    public static final String UPDATE_VALIDER_DE = """
            UPDATE demandeindividuel
            SET validation_state = CASE
                                       WHEN COALESCE(montant_demande, 0) > 100000000 THEN 'PENDING_DG'
                                       ELSE 'VALIDATED_FINAL'
                                   END,
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

    // ==================== DE - SUIVI GLOBAL ====================

    public static final String SELECT_SUIVI_GLOBAL_DE = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.cod_usuarios AS "codUsuarios",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.avis_da AS "avisDa",
                   d.avis_dr AS "avisDr",
                   d.validated_by_da AS "validatedByDa",
                   d.validated_by_dr AS "validatedByDr",
                   d.date_validation_da AS "dateValidationDa",
                   d.date_validation_dr AS "dateValidationDr",
                   d.createdat AS "createdAt",
                   del.libele AS "delegationLibele",
                   ag.libele AS "agenceLibele",
                   pv.libele AS "pointventeLibele",
                   CASE
                       WHEN d.validation_state IN ('NOUVEAU', 'SELECTION') THEN
                           (CURRENT_DATE - DATE(d.createdat))
                       WHEN d.validation_state IN ('APPROVED', 'CORRECTION') THEN
                           (CURRENT_DATE - DATE(COALESCE(d.date_validation_da, d.createdat)))
                       WHEN d.validation_state IN ('VALIDATED_DA', 'CORRECTION_DR') THEN
                           (CURRENT_DATE - DATE(COALESCE(d.date_validation_da, d.createdat)))
                       WHEN d.validation_state IN ('VALIDATED_DR', 'CORRECTION_DE') THEN
                           (CURRENT_DATE - DATE(COALESCE(d.date_validation_dr, d.createdat)))
                       ELSE (CURRENT_DATE - DATE(d.createdat))
                   END AS "joursAttente"
            FROM demandeindividuel d
            LEFT JOIN delegation del ON d.delegation = del.id
            LEFT JOIN agence ag ON d.agence = ag.id
            LEFT JOIN pointvente pv ON d.pos = pv.id
            WHERE d.statut_demande = 'EN_ATTENTE'
              AND d.validation_state IN (
                  'NOUVEAU', 'SELECTION', 'APPROVED',
                  'CORRECTION', 'CORRECTION_DR', 'CORRECTION_DE',
                  'VALIDATED_DA', 'VALIDATED_DR'
              )
            ORDER BY d.createdat DESC
            """;

    // ==================== DA / DR - SUIVI DES CREDITS DE MON RESEAU ====================

    /**
     * Suivi reseau (DA = son agence, DR = sa delegation) : tous les dossiers en cours du
     * circuit + ceux en attente de visa DG, rejetes DG et definitivement valides DE/DG
     * (VALIDATED_FINAL, limites aux 12 derniers mois). Un seul des deux parametres est
     * renseigne — agenceId pour un DA, delegationId pour un DR — le perimetre etant impose
     * cote serveur depuis le compte de l'appelant.
     */
    public static final String SELECT_SUIVI_GLOBAL_RESEAU = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.cod_usuarios AS "codUsuarios",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.avis_da AS "avisDa",
                   d.avis_dr AS "avisDr",
                   d.avis_de AS "avisDe",
                   d.avis_dg AS "avisDg",
                   d.validated_by_da AS "validatedByDa",
                   d.validated_by_dr AS "validatedByDr",
                   d.validated_by_de AS "validatedByDe",
                   d.validated_by_dg AS "validatedByDg",
                   d.date_validation_da AS "dateValidationDa",
                   d.date_validation_dr AS "dateValidationDr",
                   d.date_validation_de AS "dateValidationDe",
                   d.date_validation_dg AS "dateValidationDg",
                   d.createdat AS "createdAt",
                   del.libele AS "delegationLibele",
                   ag.libele AS "agenceLibele",
                   pv.libele AS "pointventeLibele",
                   CASE
                       WHEN d.validation_state = 'VALIDATED_FINAL' THEN 0
                       WHEN d.validation_state IN ('NOUVEAU', 'SELECTION', 'RETOUR_AGENT') THEN
                           (CURRENT_DATE - DATE(d.createdat))
                       WHEN d.validation_state IN ('APPROVED', 'CORRECTION') THEN
                           (CURRENT_DATE - DATE(COALESCE(d.date_validation_da, d.createdat)))
                       WHEN d.validation_state IN ('VALIDATED_DA', 'CORRECTION_DR') THEN
                           (CURRENT_DATE - DATE(COALESCE(d.date_validation_da, d.createdat)))
                       WHEN d.validation_state IN ('VALIDATED_DR', 'CORRECTION_DE') THEN
                           (CURRENT_DATE - DATE(COALESCE(d.date_validation_dr, d.createdat)))
                       WHEN d.validation_state IN ('PENDING_DG', 'REJETE_DG') THEN
                           (CURRENT_DATE - DATE(COALESCE(d.date_validation_de, d.createdat)))
                       ELSE (CURRENT_DATE - DATE(d.createdat))
                   END AS "joursAttente"
            FROM demandeindividuel d
            LEFT JOIN delegation del ON d.delegation = del.id
            LEFT JOIN agence ag ON d.agence = ag.id
            LEFT JOIN pointvente pv ON d.pos = pv.id
            WHERE ((CAST(:agenceId AS BIGINT) IS NOT NULL AND d.agence = CAST(:agenceId AS BIGINT))
                OR (CAST(:agenceId AS BIGINT) IS NULL AND CAST(:delegationId AS BIGINT) IS NOT NULL
                    AND d.delegation = CAST(:delegationId AS BIGINT)))
              AND (
                    (d.statut_demande = 'EN_ATTENTE' AND d.validation_state IN (
                        'NOUVEAU', 'SELECTION', 'APPROVED',
                        'CORRECTION', 'CORRECTION_DR', 'CORRECTION_DE', 'RETOUR_AGENT',
                        'VALIDATED_DA', 'VALIDATED_DR', 'PENDING_DG', 'REJETE_DG'
                    ))
                 OR (d.validation_state = 'VALIDATED_FINAL'
                     AND COALESCE(d.date_validation_dg, d.date_validation_de, d.createdat)
                         >= CURRENT_DATE - INTERVAL '12 months')
              )
            ORDER BY d.createdat DESC
            """;

    // ==================== DI - INSPECTION (credits valides par le DR) ====================

    /**
     * Inspection : tous les credits (gros ou petit) valides par un DR, sur TOUT le reseau
     * (aucun filtre de perimetre). Critere = date_validation_dr renseignee, donc quel que soit
     * l'etat courant du dossier apres le DR (VALIDATED_DR, PENDING_DG, VALIDATED_FINAL, etc.).
     * Trie par montant decroissant pour faire ressortir les gros credits en tete.
     */
    public static final String SELECT_INSPECTION_CREDITS_DR = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.cod_usuarios AS "codUsuarios",
                   d.avis_da AS "avisDa",
                   d.avis_dr AS "avisDr",
                   d.avis_de AS "avisDe",
                   d.avis_dg AS "avisDg",
                   d.validated_by_da AS "validatedByDa",
                   d.validated_by_dr AS "validatedByDr",
                   d.validated_by_de AS "validatedByDe",
                   d.date_validation_da AS "dateValidationDa",
                   d.date_validation_dr AS "dateValidationDr",
                   d.date_validation_de AS "dateValidationDe",
                   d.date_validation_dg AS "dateValidationDg",
                   d.createdat AS "createdAt",
                   del.libele AS "delegationLibele",
                   ag.libele AS "agenceLibele",
                   pv.libele AS "pointventeLibele"
            FROM demandeindividuel d
            LEFT JOIN delegation del ON d.delegation = del.id
            LEFT JOIN agence ag ON d.agence = ag.id
            LEFT JOIN pointvente pv ON d.pos = pv.id
            WHERE d.date_validation_dr IS NOT NULL
               OR (d.validation_state = 'VALIDATED_FINAL' AND d.date_validation_da IS NOT NULL)
            ORDER BY d.montant_demande DESC, COALESCE(d.date_validation_dr, d.date_validation_da) DESC
            """;

    // ==================== DA - DEMANDES AFFECTEES ====================

    public static final String SELECT_DEMANDES_AFFECTEES_DA = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.cod_usuarios AS "codUsuarios",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            WHERE d.validation_state IN ('SELECTION', 'APPROVED')
              AND d.statut_demande = 'EN_ATTENTE'
              AND d.agence = :agenceId
            ORDER BY d.createdat DESC
            """;

    public static final String UPDATE_ANNULER_AFFECTATION = """
            UPDATE demandeindividuel
            SET validation_state = 'NOUVEAU',
                cod_usuarios = NULL
            WHERE demandeindividuel_id = :demandeId
              AND validation_state = 'SELECTION'
              AND statut_demande = 'EN_ATTENTE'
            """;

    // ==================== DG (Directeur General) ====================

    /** Credits en attente de visa DG : valides par le DE avec montant >= 100M (etat PENDING_DG). National. */
    public static final String SELECT_A_VALIDER_DG = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.avis_agent_credit AS "avisAgentCredit",
                   d.avis_da AS "avisDa",
                   d.avis_dr AS "avisDr",
                   d.avis_de AS "avisDe",
                   d.validated_by_de AS "validatedByDe",
                   d.date_validation_de AS "dateValidationDe",
                   d.createdat AS "createdAt",
                   del.libele AS "delegationLibele",
                   ag.libele AS "agenceLibele"
            FROM demandeindividuel d
            LEFT JOIN delegation del ON d.delegation = del.id
            LEFT JOIN agence ag ON d.agence = ag.id
            WHERE d.validation_state = 'PENDING_DG'
            ORDER BY d.montant_demande DESC, d.createdat DESC
            """;

    /** Rejets DG en attente de confirmation par le DE. National. */
    public static final String SELECT_REJETS_DG_A_CONFIRMER = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.avis_de AS "avisDe",
                   d.motif_rejet_dg AS "motifRejetDg",
                   d.validated_by_dg AS "validatedByDg",
                   d.date_rejet_dg AS "dateRejetDg",
                   d.createdat AS "createdAt",
                   del.libele AS "delegationLibele",
                   ag.libele AS "agenceLibele"
            FROM demandeindividuel d
            LEFT JOIN delegation del ON d.delegation = del.id
            LEFT JOIN agence ag ON d.agence = ag.id
            WHERE d.validation_state = 'REJETE_DG'
            ORDER BY d.date_rejet_dg DESC NULLS LAST, d.createdat DESC
            """;

    /** Credits vises favorablement par le DG (historique). */
    public static final String SELECT_VALIDES_DG = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.avis_de AS "avisDe",
                   d.avis_dg AS "avisDg",
                   d.validated_by_dg AS "validatedByDg",
                   d.date_validation_dg AS "dateValidationDg",
                   d.createdat AS "createdAt",
                   del.libele AS "delegationLibele",
                   ag.libele AS "agenceLibele"
            FROM demandeindividuel d
            LEFT JOIN delegation del ON d.delegation = del.id
            LEFT JOIN agence ag ON d.agence = ag.id
            WHERE d.validation_state = 'VALIDATED_FINAL'
              AND d.date_validation_dg IS NOT NULL
            ORDER BY d.date_validation_dg DESC NULLS LAST, d.createdat DESC
            """;

    public static final String UPDATE_VALIDER_DG = """
            UPDATE demandeindividuel
            SET validation_state = 'VALIDATED_FINAL',
                avis_dg = :avis,
                validated_by_dg = :validatedBy,
                date_validation_dg = CURRENT_TIMESTAMP,
                motif_rejet_dg = NULL,
                date_rejet_dg = NULL
            WHERE demandeindividuel_id = :demandeId
              AND validation_state = 'PENDING_DG'
            """;

    /** Rejet DG : remarques simples (motif libre, pas de sections). */
    public static final String UPDATE_REJETER_DG = """
            UPDATE demandeindividuel
            SET validation_state = 'REJETE_DG',
                motif_rejet_dg = :motifRejet,
                validated_by_dg = :validatedBy,
                date_rejet_dg = CURRENT_TIMESTAMP,
                date_validation_dg = NULL
            WHERE demandeindividuel_id = :demandeId
              AND validation_state = 'PENDING_DG'
            """;

    /** Le DE confirme le rejet DG -> la demande repart en CORRECTION vers l'agent. */
    public static final String UPDATE_CONFIRMER_REJET_DG = """
            UPDATE demandeindividuel
            SET validation_state = 'CORRECTION',
                instructions_de = :instructions,
                sections_a_revoir_de = :sectionsARevoir,
                confirmed_by_de = :confirmedBy,
                date_confirmation_rejet_de = CURRENT_TIMESTAMP
            WHERE demandeindividuel_id = :demandeId
              AND validation_state = 'REJETE_DG'
            """;

    // ==================== ACCUEIL (reception des demandes) ====================

    /**
     * Marque une demande fraichement creee comme receptionnee par l'agent d'accueil :
     * traceur de saisie uniquement. L'accueil n'affecte pas ; la demande part en
     * file EN_ATTENTE_DA et c'est le DA qui choisit l'agent de credit.
     */
    public static final String UPDATE_MARQUER_RECEPTION = """
            UPDATE demandeindividuel
            SET validation_state = 'EN_ATTENTE_DA',
                saisie_par = :userId,
                saisie_par_role = 'AGENT_ACCUEIL',
                cod_usuarios = :codUsuarios
            WHERE demandeindividuel_id = :demandeId
              AND validation_state IN ('NOUVEAU', 'EN_ATTENTE_DA')
            """;

    /**
     * Suivi des affectations pour le DA : toutes les demandes de son agence encore en
     * phase d'instruction (proprietaire = agent_credit_affecte), pour REORIENTATION
     * si l'agent n'est plus disponible. Inclut les EN_ATTENTE_DA legacy.
     */
    public static final String SELECT_A_AFFECTER_DA = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.cod_usuarios AS "codUsuarios",
                   d.saisie_par AS "saisiePar",
                   d.saisie_par_role AS "saisieParRole",
                   d.agent_credit_affecte AS "agentCreditAffecte",
                   TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) AS "agentAffecteNom",
                   d.affecte_par_da AS "affecteParDa",
                   d.date_affectation_ac AS "dateAffectationAc",
                   d.createdat AS "createdAt",
                   pv.libele AS "pointventeLibele"
            FROM demandeindividuel d
            LEFT JOIN users u ON u.user_id = d.agent_credit_affecte
            LEFT JOIN pointvente pv ON d.pos = pv.id
            WHERE d.validation_state IN ('EN_ATTENTE_DA', 'AFFECTEE', 'SELECTION', 'CORRECTION', 'CORRECTION_ACCUEIL', 'CORRECTION_DR', 'CORRECTION_DE')
              AND d.agence = :agenceId
            ORDER BY CASE d.validation_state WHEN 'EN_ATTENTE_DA' THEN 0 WHEN 'AFFECTEE' THEN 1 ELSE 2 END, d.createdat DESC
            """;

    /**
     * Le DA reoriente la demande vers un autre agent de credit (agent indisponible).
     * L'etat d'instruction est conserve ; seule une demande non encore affectee passe en AFFECTEE.
     */
    public static final String UPDATE_AFFECTER_AC = """
            UPDATE demandeindividuel
            SET validation_state = CASE WHEN validation_state = 'EN_ATTENTE_DA' THEN 'AFFECTEE' ELSE validation_state END,
                agent_credit_affecte = :agentUserId,
                affecte_par_da = :affectePar,
                date_affectation_ac = CURRENT_TIMESTAMP,
                motif_annulation_da = NULL,
                date_annulation_da = NULL
            WHERE demandeindividuel_id = :demandeId
              AND validation_state IN ('EN_ATTENTE_DA', 'AFFECTEE', 'SELECTION', 'CORRECTION', 'CORRECTION_DR', 'CORRECTION_DE')
            """;

    /**
     * Le DA annule une demande saisie par l'accueil : retour en correction avec motif.
     * L'agent affecte est conserve : apres correction et rediligence, le dossier lui revient.
     */
    public static final String UPDATE_ANNULER_ACCUEIL = """
            UPDATE demandeindividuel
            SET validation_state = 'CORRECTION_ACCUEIL',
                motif_annulation_da = :motif,
                date_annulation_da = CURRENT_TIMESTAMP
            WHERE demandeindividuel_id = :demandeId
              AND validation_state IN ('EN_ATTENTE_DA', 'AFFECTEE')
            """;

    /** Suivi de l'agent d'accueil : ses saisies encore dans le circuit de reception. */
    public static final String SELECT_MES_RECEPTIONS = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.motif_annulation_da AS "motifAnnulationDa",
                   d.date_annulation_da AS "dateAnnulationDa",
                   TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) AS "agentAffecteNom",
                   d.date_affectation_ac AS "dateAffectationAc",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            LEFT JOIN users u ON u.user_id = d.agent_credit_affecte
            WHERE d.saisie_par = :userId
              AND d.validation_state IN ('EN_ATTENTE_DA', 'CORRECTION_ACCUEIL', 'AFFECTEE')
            ORDER BY CASE d.validation_state WHEN 'CORRECTION_ACCUEIL' THEN 0 ELSE 1 END, d.createdat DESC
            """;

    /** L'accueil rediligente une demande corrigee : retour vers l'agent de credit affecte. */
    public static final String UPDATE_REDILIGENTER_ACCUEIL = """
            UPDATE demandeindividuel
            SET validation_state = CASE WHEN agent_credit_affecte IS NOT NULL THEN 'AFFECTEE' ELSE 'EN_ATTENTE_DA' END,
                motif_annulation_da = NULL,
                date_annulation_da = NULL
            WHERE demandeindividuel_id = :demandeId
              AND validation_state = 'CORRECTION_ACCUEIL'
              AND saisie_par = :userId
            """;

    /** Demandes affectees a l'agent de credit connecte (a prendre en charge). */
    public static final String SELECT_MES_AFFECTATIONS_AC = """
            SELECT d.demandeindividuel_id AS "demandeIndividuelId",
                   d.nom, d.prenom, d.telephone,
                   d.numero_membre AS "numeroMembre",
                   d.delegation, d.agence, d.pos,
                   d.montant_demande AS "montantDemande",
                   d.object_credit AS "objectCredit",
                   d.nature_client AS "natureClient",
                   d.validation_state AS "validationState",
                   d.statut_demande AS "statutDemande",
                   d.cod_usuarios AS "codUsuarios",
                   d.affecte_par_da AS "affecteParDa",
                   d.date_affectation_ac AS "dateAffectationAc",
                   d.createdat AS "createdAt"
            FROM demandeindividuel d
            WHERE d.agent_credit_affecte = :userId
              AND d.validation_state = 'AFFECTEE'
            ORDER BY d.date_affectation_ac DESC NULLS LAST
            """;

    /** L'AC prend en charge une demande affectee -> SELECTION (circuit existant). */
    public static final String UPDATE_PRENDRE_EN_CHARGE_AC = """
            UPDATE demandeindividuel
            SET validation_state = 'SELECTION'
            WHERE demandeindividuel_id = :demandeId
              AND validation_state = 'AFFECTEE'
              AND agent_credit_affecte = :userId
            """;

    // ==================== DA - GESTION DES FONCTIONS D'AGENCE ====================

    /** Agents (credit + accueil) de l'agence avec l'etat de leurs fonctions. */
    public static final String SELECT_AGENTS_AGENCE = """
            SELECT u.user_id AS "userId",
                   u.first_name AS "firstName",
                   u.last_name AS "lastName",
                   u.email,
                   u.username,
                   r.name AS "role",
                   u.pointvente_id AS "pointventeId",
                   pv.libele AS "pointventeLibele",
                   COALESCE(BOOL_OR(af.fonction = 'ACCUEIL' AND af.actif), FALSE) AS "fonctionAccueil",
                   COALESCE(BOOL_OR(af.fonction = 'CREDIT' AND af.actif), FALSE) AS "fonctionCredit"
            FROM users u
            JOIN user_roles ur ON ur.user_id = u.user_id
            JOIN roles r ON r.role_id = ur.role_id
            LEFT JOIN pointvente pv ON u.pointvente_id = pv.id
            LEFT JOIN agent_fonctions af ON af.user_id = u.user_id
            WHERE r.name IN ('AGENT_CREDIT', 'AGENT_ACCUEIL')
              AND u.agence_id = :agenceId
            GROUP BY u.user_id, u.first_name, u.last_name, u.email, u.username, r.name, u.pointvente_id, pv.libele
            ORDER BY u.last_name, u.first_name
            """;

    /** Active/desactive une fonction pour un agent (upsert, horodate et nominatif). */
    public static final String UPSERT_AGENT_FONCTION = """
            INSERT INTO agent_fonctions (user_id, fonction, actif, affecte_par, date_affectation, date_desaffectation)
            VALUES (:userId, :fonction, :actif, :affectePar, CURRENT_TIMESTAMP, CASE WHEN :actif THEN NULL ELSE CURRENT_TIMESTAMP END)
            ON CONFLICT (user_id, fonction) DO UPDATE
            SET actif = :actif,
                affecte_par = :affectePar,
                date_affectation = CASE WHEN :actif THEN CURRENT_TIMESTAMP ELSE agent_fonctions.date_affectation END,
                date_desaffectation = CASE WHEN :actif THEN NULL ELSE CURRENT_TIMESTAMP END
            """;

    /** Agence de rattachement d'un utilisateur (controle de perimetre du DA). */
    public static final String SELECT_AGENCE_OF_USER = """
            SELECT u.agence_id FROM users u WHERE u.user_id = :userId
            """;

    /** Fonctions actives de l'utilisateur connecte (pilote l'affichage du menu). */
    public static final String SELECT_MES_FONCTIONS = """
            SELECT af.fonction FROM agent_fonctions af
            WHERE af.user_id = :userId AND af.actif
            """;

    /** Roles de connexion d'un utilisateur (controle d'eligibilite a l'affectation). */
    public static final String SELECT_ROLES_OF_USER = """
            SELECT r.name FROM user_roles ur
            JOIN roles r ON r.role_id = ur.role_id
            WHERE ur.user_id = :userId
            """;
}
