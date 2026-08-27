package io.digiservices.ecreditservice.query;

public class AnalyseChargesFonctionnaireQuery {

    /**
     * Contexte financier d'une demande fonctionnaire : modalités du prêt + extension.
     */
    public static final String SELECT_CONTEXTE_FONCTIONNAIRE = """
        SELECT d.demandeindividuel_id,
               d.nature_client,
               d.validation_state,
               d.echeance,
               d.periodicite_remboursement,
               df.salaire_net_mensuel,
               df.autres_revenus,
               df.domiciliation_salaire,
               g.type_groupe,
               (SELECT SUM(m.salaire_net_mensuel)
                  FROM membre_groupe m
                 WHERE m.demandeindividuel_id = d.demandeindividuel_id) AS salaires_groupe
        FROM demandeindividuel d
        LEFT JOIN demande_fonctionnaire df ON df.demandeindividuel_id = d.demandeindividuel_id
        LEFT JOIN demande_groupe g ON g.demandeindividuel_id = d.demandeindividuel_id
        WHERE d.demandeindividuel_id = :demandeId
        """;

    public static final String SELECT_ANALYSE_CHARGES_BY_DEMANDE = """
        SELECT * FROM analyse_charges_fonctionnaire WHERE demandeindividuel_id = :demandeId
        """;

    /**
     * Upsert de la grille des charges ; total_charges est une colonne générée,
     * les résultats (quotité, capacité, verdict) sont recalculés par le backend.
     */
    public static final String UPSERT_ANALYSE_CHARGES = """
        INSERT INTO analyse_charges_fonctionnaire (
            demandeindividuel_id,
            charge_loyer, charge_transport, charge_nourriture, charge_vignette,
            charge_assurance, charge_electricite, charge_eau, charge_assurance_maladie,
            charge_scolarite, charge_cas_sociaux, charge_abonnement_image, charge_service_salubrite,
            salaire_net_retenu, autres_revenus_retenus,
            quotite_cessible, capacite_residuelle, verdict,
            avis_agent, analyse_par
        ) VALUES (
            :demandeId,
            :chargeLoyer, :chargeTransport, :chargeNourriture, :chargeVignette,
            :chargeAssurance, :chargeElectricite, :chargeEau, :chargeAssuranceMaladie,
            :chargeScolarite, :chargeCasSociaux, :chargeAbonnementImage, :chargeServiceSalubrite,
            :salaireNetRetenu, :autresRevenusRetenus,
            :quotiteCessible, :capaciteResiduelle, :verdict,
            :avisAgent, :analysePar
        )
        ON CONFLICT (demandeindividuel_id) DO UPDATE SET
            charge_loyer = EXCLUDED.charge_loyer,
            charge_transport = EXCLUDED.charge_transport,
            charge_nourriture = EXCLUDED.charge_nourriture,
            charge_vignette = EXCLUDED.charge_vignette,
            charge_assurance = EXCLUDED.charge_assurance,
            charge_electricite = EXCLUDED.charge_electricite,
            charge_eau = EXCLUDED.charge_eau,
            charge_assurance_maladie = EXCLUDED.charge_assurance_maladie,
            charge_scolarite = EXCLUDED.charge_scolarite,
            charge_cas_sociaux = EXCLUDED.charge_cas_sociaux,
            charge_abonnement_image = EXCLUDED.charge_abonnement_image,
            charge_service_salubrite = EXCLUDED.charge_service_salubrite,
            salaire_net_retenu = EXCLUDED.salaire_net_retenu,
            autres_revenus_retenus = EXCLUDED.autres_revenus_retenus,
            quotite_cessible = EXCLUDED.quotite_cessible,
            capacite_residuelle = EXCLUDED.capacite_residuelle,
            verdict = EXCLUDED.verdict,
            avis_agent = EXCLUDED.avis_agent,
            analyse_par = EXCLUDED.analyse_par,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *
        """;
}
