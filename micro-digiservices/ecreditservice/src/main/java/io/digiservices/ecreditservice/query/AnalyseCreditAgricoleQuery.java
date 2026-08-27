package io.digiservices.ecreditservice.query;

public class AnalyseCreditAgricoleQuery {

    private static final String COLONNES = """
            analyse_agricole_id, demandeindividuel_id,
            frais_labour, frais_cloture, achat_intrant, achat_phytosanitaire, achat_outillage,
            frais_entretien, frais_semis, frais_recolte, transport, stockage, frais_conservation,
            charges_familiales, quantite_recolte, prix_vente_unitaire, autres_produits,
            total_charges, total_produits, total_echeances, marge_nette, verdict,
            analyse_par, created_at, updated_at
            """;

    public static final String SELECT_ANALYSE_AGRICOLE_BY_DEMANDE =
            "SELECT " + COLONNES + " FROM analyse_credit_agricole WHERE demandeindividuel_id = :demandeId";

    public static final String UPSERT_ANALYSE_AGRICOLE = """
            INSERT INTO analyse_credit_agricole (
                demandeindividuel_id,
                frais_labour, frais_cloture, achat_intrant, achat_phytosanitaire, achat_outillage,
                frais_entretien, frais_semis, frais_recolte, transport, stockage, frais_conservation,
                charges_familiales, quantite_recolte, prix_vente_unitaire, autres_produits,
                total_charges, total_produits, total_echeances, marge_nette, verdict, analyse_par
            ) VALUES (
                :demandeId,
                :fraisLabour, :fraisCloture, :achatIntrant, :achatPhytosanitaire, :achatOutillage,
                :fraisEntretien, :fraisSemis, :fraisRecolte, :transport, :stockage, :fraisConservation,
                :chargesFamiliales, :quantiteRecolte, :prixVenteUnitaire, :autresProduits,
                :totalCharges, :totalProduits, :totalEcheances, :margeNette, :verdict, :analysePar
            )
            ON CONFLICT (demandeindividuel_id) DO UPDATE SET
                frais_labour = EXCLUDED.frais_labour,
                frais_cloture = EXCLUDED.frais_cloture,
                achat_intrant = EXCLUDED.achat_intrant,
                achat_phytosanitaire = EXCLUDED.achat_phytosanitaire,
                achat_outillage = EXCLUDED.achat_outillage,
                frais_entretien = EXCLUDED.frais_entretien,
                frais_semis = EXCLUDED.frais_semis,
                frais_recolte = EXCLUDED.frais_recolte,
                transport = EXCLUDED.transport,
                stockage = EXCLUDED.stockage,
                frais_conservation = EXCLUDED.frais_conservation,
                charges_familiales = EXCLUDED.charges_familiales,
                quantite_recolte = EXCLUDED.quantite_recolte,
                prix_vente_unitaire = EXCLUDED.prix_vente_unitaire,
                autres_produits = EXCLUDED.autres_produits,
                total_charges = EXCLUDED.total_charges,
                total_produits = EXCLUDED.total_produits,
                total_echeances = EXCLUDED.total_echeances,
                marge_nette = EXCLUDED.marge_nette,
                verdict = EXCLUDED.verdict,
                analyse_par = EXCLUDED.analyse_par,
                updated_at = CURRENT_TIMESTAMP
            RETURNING """ + COLONNES;

    /** Contexte de la demande pour le recalcul : nature, état, type de groupe, modalités du prêt. */
    public static final String SELECT_CONTEXTE_AGRICOLE = """
            SELECT d.demandeindividuel_id,
                   d.nature_client,
                   d.validation_state,
                   d.montant_demande,
                   d.nombre_echeance,
                   d.taux_interet,
                   g.type_groupe
            FROM demandeindividuel d
            LEFT JOIN demande_groupe g ON g.demandeindividuel_id = d.demandeindividuel_id
            WHERE d.demandeindividuel_id = :demandeId
            """;
}
