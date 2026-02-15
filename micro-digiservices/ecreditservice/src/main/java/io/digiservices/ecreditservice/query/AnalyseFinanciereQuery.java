package io.digiservices.ecreditservice.query;

public class AnalyseFinanciereQuery {

    // ==================== ANALYSE FINANCIERE (En-tete) ====================

    public static final String INSERT_ANALYSE_FINANCIERE = """
        INSERT INTO analyse_financiere (
            demandeindividuel_id, date_evaluation, analyste_cod_usuario, analyste_nom,
            cycle_affaires, facteur_cycle, hypothese_ca, type_marge, taux_marge_retenu,
            type_cdr, capacite_remb_declaree, valeur_garantie, commentaire_orientation
        ) VALUES (
            :demandeindividuelId, :dateEvaluation, :analysteCodUsuario, :analysteNom,
            :cycleAffaires, :facteurCycle, :hypotheseCa, :typeMarge, :tauxMargeRetenu,
            :typeCdr, :capaciteRembDeclaree, :valeurGarantie, :commentaireOrientation
        ) RETURNING analyse_id
        """;

    public static final String SELECT_ANALYSE_BY_ID = """
        SELECT
            analyse_id as "analyseId",
            demandeindividuel_id as "demandeindividuelId",
            date_evaluation as "dateEvaluation",
            analyste_cod_usuario as "analysteCodUsuario",
            analyste_nom as "analysteNom",
            cycle_affaires as "cycleAffaires",
            facteur_cycle as "facteurCycle",
            hypothese_ca as "hypotheseCa",
            type_marge as "typeMarge",
            taux_marge_retenu as "tauxMargeRetenu",
            type_cdr as "typeCdr",
            capacite_remb_declaree as "capaciteRembDeclaree",
            valeur_garantie as "valeurGarantie",
            commentaire_orientation as "commentaireOrientation",
            statut as "statut",
            date_soumission as "dateSoumission",
            soumis_par_nom as "soumisPar",
            created_at as "createdAt",
            updated_at as "updatedAt"
        FROM analyse_financiere
        WHERE analyse_id = :analyseId
        """;

    public static final String SELECT_ANALYSE_BY_DEMANDE_ID = """
        SELECT
            analyse_id as "analyseId",
            demandeindividuel_id as "demandeindividuelId",
            date_evaluation as "dateEvaluation",
            analyste_cod_usuario as "analysteCodUsuario",
            analyste_nom as "analysteNom",
            cycle_affaires as "cycleAffaires",
            facteur_cycle as "facteurCycle",
            hypothese_ca as "hypotheseCa",
            type_marge as "typeMarge",
            taux_marge_retenu as "tauxMargeRetenu",
            type_cdr as "typeCdr",
            capacite_remb_declaree as "capaciteRembDeclaree",
            valeur_garantie as "valeurGarantie",
            commentaire_orientation as "commentaireOrientation",
            statut as "statut",
            date_soumission as "dateSoumission",
            soumis_par_nom as "soumisPar",
            created_at as "createdAt",
            updated_at as "updatedAt"
        FROM analyse_financiere
        WHERE demandeindividuel_id = :demandeindividuelId
        """;

    public static final String UPDATE_ANALYSE_FINANCIERE = """
        UPDATE analyse_financiere SET
            cycle_affaires = COALESCE(:cycleAffaires, cycle_affaires),
            facteur_cycle = COALESCE(:facteurCycle, facteur_cycle),
            hypothese_ca = COALESCE(:hypotheseCa, hypothese_ca),
            type_marge = COALESCE(:typeMarge, type_marge),
            taux_marge_retenu = COALESCE(:tauxMargeRetenu, taux_marge_retenu),
            type_cdr = COALESCE(:typeCdr, type_cdr),
            capacite_remb_declaree = COALESCE(:capaciteRembDeclaree, capacite_remb_declaree),
            valeur_garantie = COALESCE(:valeurGarantie, valeur_garantie),
            commentaire_orientation = COALESCE(:commentaireOrientation, commentaire_orientation)
        WHERE analyse_id = :analyseId
        """;

    public static final String DELETE_ANALYSE_FINANCIERE = """
        DELETE FROM analyse_financiere WHERE analyse_id = :analyseId
        """;

    // ==================== BILAN ====================

    public static final String INSERT_BILAN = """
        INSERT INTO analyse_bilan (
            analyse_id, type_periode, terrain, batiment_magasin, installation_agencement,
            materiel_industriel, mobilier_bureau, materiel_informatique, materiel_transport,
            autre_immobilisation, stocks, creances_clients, tresorerie_caisse_banque,
            capitaux_propre, emprunt_long_terme, emprunt_court_terme, autres_dettes,
            observations_actif, observations_passif
        ) VALUES (
            :analyseId, :typePeriode, :terrain, :batimentMagasin, :installationAgencement,
            :materielIndustriel, :mobilierBureau, :materielInformatique, :materielTransport,
            :autreImmobilisation, :stocks, :creancesClients, :tresorerieCaisseBanque,
            :capitauxPropre, :empruntLongTerme, :empruntCourtTerme, :autresDettes,
            :observationsActif, :observationsPassif
        )
        ON CONFLICT (analyse_id, type_periode) DO UPDATE SET
            terrain = EXCLUDED.terrain,
            batiment_magasin = EXCLUDED.batiment_magasin,
            installation_agencement = EXCLUDED.installation_agencement,
            materiel_industriel = EXCLUDED.materiel_industriel,
            mobilier_bureau = EXCLUDED.mobilier_bureau,
            materiel_informatique = EXCLUDED.materiel_informatique,
            materiel_transport = EXCLUDED.materiel_transport,
            autre_immobilisation = EXCLUDED.autre_immobilisation,
            stocks = EXCLUDED.stocks,
            creances_clients = EXCLUDED.creances_clients,
            tresorerie_caisse_banque = EXCLUDED.tresorerie_caisse_banque,
            capitaux_propre = EXCLUDED.capitaux_propre,
            emprunt_long_terme = EXCLUDED.emprunt_long_terme,
            emprunt_court_terme = EXCLUDED.emprunt_court_terme,
            autres_dettes = EXCLUDED.autres_dettes,
            observations_actif = EXCLUDED.observations_actif,
            observations_passif = EXCLUDED.observations_passif
        RETURNING bilan_id
        """;

    public static final String SELECT_BILANS_BY_ANALYSE = """
        SELECT
            bilan_id as "bilanId",
            analyse_id as "analyseId",
            type_periode as "typePeriode",
            terrain, batiment_magasin as "batimentMagasin",
            installation_agencement as "installationAgencement",
            materiel_industriel as "materielIndustriel",
            mobilier_bureau as "mobilierBureau",
            materiel_informatique as "materielInformatique",
            materiel_transport as "materielTransport",
            autre_immobilisation as "autreImmobilisation",
            stocks, creances_clients as "creancesClients",
            tresorerie_caisse_banque as "tresorerieCaisseBanque",
            capitaux_propre as "capitauxPropre",
            emprunt_long_terme as "empruntLongTerme",
            emprunt_court_terme as "empruntCourtTerme",
            autres_dettes as "autresDettes",
            observations_actif as "observationsActif",
            observations_passif as "observationsPassif",
            total_immobilisations as "totalImmobilisations",
            total_actif as "totalActif",
            total_dettes as "totalDettes",
            capitaux_propres as "capitauxPropres",
            fonds_roulement as "fondsRoulement",
            besoin_fonds_roulement as "besoinFondsRoulement"
        FROM v_bilan_complet
        WHERE analyse_id = :analyseId
        """;

    public static final String SELECT_BILAN_BY_PERIODE = """
        SELECT
            bilan_id as "bilanId",
            analyse_id as "analyseId",
            type_periode as "typePeriode",
            terrain, batiment_magasin as "batimentMagasin",
            installation_agencement as "installationAgencement",
            materiel_industriel as "materielIndustriel",
            mobilier_bureau as "mobilierBureau",
            materiel_informatique as "materielInformatique",
            materiel_transport as "materielTransport",
            autre_immobilisation as "autreImmobilisation",
            stocks, creances_clients as "creancesClients",
            tresorerie_caisse_banque as "tresorerieCaisseBanque",
            capitaux_propre as "capitauxPropre",
            emprunt_long_terme as "empruntLongTerme",
            emprunt_court_terme as "empruntCourtTerme",
            autres_dettes as "autresDettes",
            observations_actif as "observationsActif",
            observations_passif as "observationsPassif",
            total_immobilisations as "totalImmobilisations",
            total_actif as "totalActif",
            total_dettes as "totalDettes",
            capitaux_propres as "capitauxPropres",
            fonds_roulement as "fondsRoulement",
            besoin_fonds_roulement as "besoinFondsRoulement"
        FROM v_bilan_complet
        WHERE analyse_id = :analyseId AND type_periode = :typePeriode
        """;

    public static final String UPDATE_BILAN = """
        UPDATE analyse_bilan SET
            terrain = :terrain, batiment_magasin = :batimentMagasin,
            installation_agencement = :installationAgencement,
            materiel_industriel = :materielIndustriel, mobilier_bureau = :mobilierBureau,
            materiel_informatique = :materielInformatique, materiel_transport = :materielTransport,
            autre_immobilisation = :autreImmobilisation, stocks = :stocks,
            creances_clients = :creancesClients, tresorerie_caisse_banque = :tresorerieCaisseBanque,
            capitaux_propre = :capitauxPropre,
            emprunt_long_terme = :empruntLongTerme, emprunt_court_terme = :empruntCourtTerme,
            autres_dettes = :autresDettes, observations_actif = :observationsActif,
            observations_passif = :observationsPassif
        WHERE bilan_id = :bilanId
        """;

    // ==================== RENTABILITE ====================

    public static final String INSERT_RENTABILITE = """
        INSERT INTO analyse_rentabilite (
            analyse_id, type_periode, chiffre_affaires, cout_achat_marchandises, marge_brute,
            salaires, prelevement_entrepreneur, loyers, transport, electricite_eau_telephone,
            fournitures_autres_besoins, entretien_reparation, carburant_lubrifiants,
            publicite_promotion, impots_taxes, frais_bancaires_interets,
            echeance_autre_credit, diverses_charges, amortissements_provisions,
            autres_revenus_hors_activite
        ) VALUES (
            :analyseId, :typePeriode, :chiffreAffaires, :coutAchatMarchandises, :margeBrute,
            :salaires, :prelevementEntrepreneur, :loyers, :transport, :electriciteEauTelephone,
            :fournituresAutresBesoins, :entretienReparation, :carburantLubrifiants,
            :publicitePromotion, :impotsTaxes, :fraisBancairesInterets,
            :echeanceAutreCredit, :diversesCharges, :amortissementsProvisions,
            :autresRevenusHorsActivite
        )
        ON CONFLICT (analyse_id, type_periode) DO UPDATE SET
            chiffre_affaires = EXCLUDED.chiffre_affaires,
            cout_achat_marchandises = EXCLUDED.cout_achat_marchandises,
            marge_brute = EXCLUDED.marge_brute,
            salaires = EXCLUDED.salaires,
            prelevement_entrepreneur = EXCLUDED.prelevement_entrepreneur,
            loyers = EXCLUDED.loyers,
            transport = EXCLUDED.transport,
            electricite_eau_telephone = EXCLUDED.electricite_eau_telephone,
            fournitures_autres_besoins = EXCLUDED.fournitures_autres_besoins,
            entretien_reparation = EXCLUDED.entretien_reparation,
            carburant_lubrifiants = EXCLUDED.carburant_lubrifiants,
            publicite_promotion = EXCLUDED.publicite_promotion,
            impots_taxes = EXCLUDED.impots_taxes,
            frais_bancaires_interets = EXCLUDED.frais_bancaires_interets,
            echeance_autre_credit = EXCLUDED.echeance_autre_credit,
            diverses_charges = EXCLUDED.diverses_charges,
            amortissements_provisions = EXCLUDED.amortissements_provisions,
            autres_revenus_hors_activite = EXCLUDED.autres_revenus_hors_activite
        RETURNING rentabilite_id
        """;

    public static final String SELECT_RENTABILITES_BY_ANALYSE = """
        SELECT
            rentabilite_id as "rentabiliteId",
            analyse_id as "analyseId",
            type_periode as "typePeriode",
            chiffre_affaires as "chiffreAffaires",
            cout_achat_marchandises as "coutAchatMarchandises",
            marge_brute as "margeBrute",
            salaires, prelevement_entrepreneur as "prelevementEntrepreneur",
            loyers, transport,
            electricite_eau_telephone as "electriciteEauTelephone",
            fournitures_autres_besoins as "fournituresAutresBesoins",
            entretien_reparation as "entretienReparation",
            carburant_lubrifiants as "carburantLubrifiants",
            publicite_promotion as "publicitePromotion",
            impots_taxes as "impotsTaxes",
            frais_bancaires_interets as "fraisBancairesInterets",
            echeance_autre_credit as "echeanceAutreCredit",
            diverses_charges as "diversesCharges",
            amortissements_provisions as "amortissementsProvisions",
            autres_revenus_hors_activite as "autresRevenusHorsActivite",
            total_charges_exploitation as "totalChargesExploitation",
            resultat_exploitation as "resultatExploitation",
            cash_flow as "cashFlow",
            capacite_remboursement as "capaciteRemboursement"
        FROM v_rentabilite_complete
        WHERE analyse_id = :analyseId
        """;

    public static final String SELECT_RENTABILITE_BY_PERIODE = """
        SELECT
            rentabilite_id as "rentabiliteId",
            analyse_id as "analyseId",
            type_periode as "typePeriode",
            chiffre_affaires as "chiffreAffaires",
            cout_achat_marchandises as "coutAchatMarchandises",
            marge_brute as "margeBrute",
            salaires, prelevement_entrepreneur as "prelevementEntrepreneur",
            loyers, transport,
            electricite_eau_telephone as "electriciteEauTelephone",
            fournitures_autres_besoins as "fournituresAutresBesoins",
            entretien_reparation as "entretienReparation",
            carburant_lubrifiants as "carburantLubrifiants",
            publicite_promotion as "publicitePromotion",
            impots_taxes as "impotsTaxes",
            frais_bancaires_interets as "fraisBancairesInterets",
            echeance_autre_credit as "echeanceAutreCredit",
            diverses_charges as "diversesCharges",
            amortissements_provisions as "amortissementsProvisions",
            autres_revenus_hors_activite as "autresRevenusHorsActivite",
            total_charges_exploitation as "totalChargesExploitation",
            resultat_exploitation as "resultatExploitation",
            cash_flow as "cashFlow",
            capacite_remboursement as "capaciteRemboursement"
        FROM v_rentabilite_complete
        WHERE analyse_id = :analyseId AND type_periode = :typePeriode
        """;

    public static final String UPDATE_RENTABILITE = """
        UPDATE analyse_rentabilite SET
            chiffre_affaires = :chiffreAffaires, cout_achat_marchandises = :coutAchatMarchandises,
            marge_brute = :margeBrute, salaires = :salaires,
            prelevement_entrepreneur = :prelevementEntrepreneur, loyers = :loyers,
            transport = :transport, electricite_eau_telephone = :electriciteEauTelephone,
            fournitures_autres_besoins = :fournituresAutresBesoins,
            entretien_reparation = :entretienReparation, carburant_lubrifiants = :carburantLubrifiants,
            publicite_promotion = :publicitePromotion,
            impots_taxes = :impotsTaxes, frais_bancaires_interets = :fraisBancairesInterets,
            echeance_autre_credit = :echeanceAutreCredit, diverses_charges = :diversesCharges,
            amortissements_provisions = :amortissementsProvisions,
            autres_revenus_hors_activite = :autresRevenusHorsActivite
        WHERE rentabilite_id = :rentabiliteId
        """;

    // ==================== BESOIN CREDIT ====================

    public static final String INSERT_BESOIN_CREDIT = """
        INSERT INTO analyse_besoin_credit (
            analyse_id, cout_equipement, depenses_rattachees, apport_personnel,
            ajust_cout_equipement, ajust_depenses_rattachees, ajust_apport_personnel,
            cout_achat_cycle, nbre_cycle_financer, tresorerie_disponible, stock_actuel,
            comptes_recevoir, dettes_fournisseurs, credit_fournisseur,
            ajust_cout_achat_cycle, ajust_tresorerie_dispo, ajust_stock_actuel,
            ajust_comptes_recevoir, ajust_dettes_fournisseurs, ajust_credit_fournisseur
        ) VALUES (
            :analyseId, :coutEquipement, :depensesRattachees, :apportPersonnel,
            :ajustCoutEquipement, :ajustDepensesRattachees, :ajustApportPersonnel,
            :coutAchatCycle, :nbreCycleFinancer, :tresorerieDisponible, :stockActuel,
            :comptesRecevoir, :dettesFournisseurs, :creditFournisseur,
            :ajustCoutAchatCycle, :ajustTresorerieDispo, :ajustStockActuel,
            :ajustComptesRecevoir, :ajustDettesFournisseurs, :ajustCreditFournisseur
        )
        ON CONFLICT (analyse_id) DO UPDATE SET
            cout_equipement = EXCLUDED.cout_equipement,
            depenses_rattachees = EXCLUDED.depenses_rattachees,
            apport_personnel = EXCLUDED.apport_personnel,
            ajust_cout_equipement = EXCLUDED.ajust_cout_equipement,
            ajust_depenses_rattachees = EXCLUDED.ajust_depenses_rattachees,
            ajust_apport_personnel = EXCLUDED.ajust_apport_personnel,
            cout_achat_cycle = EXCLUDED.cout_achat_cycle,
            nbre_cycle_financer = EXCLUDED.nbre_cycle_financer,
            tresorerie_disponible = EXCLUDED.tresorerie_disponible,
            stock_actuel = EXCLUDED.stock_actuel,
            comptes_recevoir = EXCLUDED.comptes_recevoir,
            dettes_fournisseurs = EXCLUDED.dettes_fournisseurs,
            credit_fournisseur = EXCLUDED.credit_fournisseur,
            ajust_cout_achat_cycle = EXCLUDED.ajust_cout_achat_cycle,
            ajust_tresorerie_dispo = EXCLUDED.ajust_tresorerie_dispo,
            ajust_stock_actuel = EXCLUDED.ajust_stock_actuel,
            ajust_comptes_recevoir = EXCLUDED.ajust_comptes_recevoir,
            ajust_dettes_fournisseurs = EXCLUDED.ajust_dettes_fournisseurs,
            ajust_credit_fournisseur = EXCLUDED.ajust_credit_fournisseur
        RETURNING besoin_credit_id
        """;

    public static final String SELECT_BESOIN_CREDIT_BY_ANALYSE = """
        SELECT
            besoin_credit_id as "besoinCreditId",
            analyse_id as "analyseId",
            cout_equipement as "coutEquipement",
            depenses_rattachees as "depensesRattachees",
            apport_personnel as "apportPersonnel",
            ajust_cout_equipement as "ajustCoutEquipement",
            ajust_depenses_rattachees as "ajustDepensesRattachees",
            ajust_apport_personnel as "ajustApportPersonnel",
            cout_achat_cycle as "coutAchatCycle",
            nbre_cycle_financer as "nbreCycleFinancer",
            tresorerie_disponible as "tresorerieDisponible",
            stock_actuel as "stockActuel",
            comptes_recevoir as "comptesRecevoir",
            dettes_fournisseurs as "dettesFournisseurs",
            credit_fournisseur as "creditFournisseur",
            ajust_cout_achat_cycle as "ajustCoutAchatCycle",
            ajust_tresorerie_dispo as "ajustTresorerieDispo",
            ajust_stock_actuel as "ajustStockActuel",
            ajust_comptes_recevoir as "ajustComptesRecevoir",
            ajust_dettes_fournisseurs as "ajustDettesFournisseurs",
            ajust_credit_fournisseur as "ajustCreditFournisseur",
            eff_cout_equipement as "effCoutEquipement",
            eff_depenses_rattachees as "effDepensesRattachees",
            eff_apport_personnel as "effApportPersonnel",
            eff_cout_achat_cycle as "effCoutAchatCycle",
            eff_tresorerie_dispo as "effTresorerieDispo",
            eff_stock_actuel as "effStockActuel",
            eff_comptes_recevoir as "effComptesRecevoir",
            eff_dettes_fournisseurs as "effDettesFournisseurs",
            eff_credit_fournisseur as "effCreditFournisseur",
            besoin_reel_investissement as "besoinReelInvestissement",
            besoin_reel_exploitation as "besoinReelExploitation"
        FROM v_besoin_credit_complet
        WHERE analyse_id = :analyseId
        """;

    public static final String UPDATE_BESOIN_CREDIT = """
        UPDATE analyse_besoin_credit SET
            cout_equipement = :coutEquipement, depenses_rattachees = :depensesRattachees,
            apport_personnel = :apportPersonnel, ajust_cout_equipement = :ajustCoutEquipement,
            ajust_depenses_rattachees = :ajustDepensesRattachees,
            ajust_apport_personnel = :ajustApportPersonnel, cout_achat_cycle = :coutAchatCycle,
            nbre_cycle_financer = :nbreCycleFinancer, tresorerie_disponible = :tresorerieDisponible,
            stock_actuel = :stockActuel, comptes_recevoir = :comptesRecevoir,
            dettes_fournisseurs = :dettesFournisseurs, credit_fournisseur = :creditFournisseur,
            ajust_cout_achat_cycle = :ajustCoutAchatCycle,
            ajust_tresorerie_dispo = :ajustTresorerieDispo, ajust_stock_actuel = :ajustStockActuel,
            ajust_comptes_recevoir = :ajustComptesRecevoir,
            ajust_dettes_fournisseurs = :ajustDettesFournisseurs,
            ajust_credit_fournisseur = :ajustCreditFournisseur
        WHERE analyse_id = :analyseId
        """;

    // ==================== PROPOSITION (dans demandeindividuel) ====================

    public static final String UPDATE_PROPOSITION = """
        UPDATE demandeindividuel SET
            montant_propose = :montantPropose,
            duree_proposee = :dureeProposee,
            nombre_echeance_propose = :nombreEcheancePropose,
            echeance_proposee = :echeanceProposee,
            taux_interet_propose = :tauxInteretPropose,
            periodicite_proposee = :periodiciteProposee
        WHERE demandeindividuel_id = :demandeindividuelId
        """;

    public static final String SELECT_PROPOSITION = """
        SELECT
            demandeindividuel_id as "demandeindividuelId",
            montant_propose as "montantPropose",
            duree_proposee as "dureeProposee",
            nombre_echeance_propose as "nombreEcheancePropose",
            echeance_proposee as "echeanceProposee",
            taux_interet_propose as "tauxInteretPropose",
            periodicite_proposee as "periodiciteProposee"
        FROM demandeindividuel
        WHERE demandeindividuel_id = :demandeindividuelId
        """;

    public static final String DELETE_PROPOSITION = """
        UPDATE demandeindividuel SET
            montant_propose = NULL,
            duree_proposee = NULL,
            nombre_echeance_propose = NULL,
            echeance_proposee = NULL,
            taux_interet_propose = NULL,
            periodicite_proposee = NULL
        WHERE demandeindividuel_id = :demandeindividuelId
        """;

    // ==================== RATIOS ====================

    public static final String CALCULATE_RATIOS = """
        SELECT * FROM fn_calculer_ratios(:analyseId)
        """;

    public static final String SELECT_RATIOS_BY_ANALYSE = """
        SELECT
            ratio_id as "ratioId",
            analyse_id as "analyseId",
            r1_sollicite as "r1Sollicite", r2_sollicite as "r2Sollicite",
            r3_sollicite as "r3Sollicite", r4_sollicite as "r4Sollicite",
            r5_sollicite as "r5Sollicite", r6_sollicite as "r6Sollicite",
            r1_propose as "r1Propose", r2_propose as "r2Propose",
            r3_propose as "r3Propose", r4_propose as "r4Propose",
            r5_propose as "r5Propose", r6_propose as "r6Propose",
            tous_ratios_conformes_sollicite as "tousRatiosConformesSollicite",
            tous_ratios_conformes_propose as "tousRatiosConformesPropose",
            date_calcul as "dateCalcul",
            created_at as "createdAt", updated_at as "updatedAt"
        FROM analyse_ratios
        WHERE analyse_id = :analyseId
        """;

    // ==================== SYNTHESE ====================

    public static final String SELECT_SYNTHESE_BY_ANALYSE = """
        SELECT
            analyse_id as "analyseId",
            demandeindividuel_id as "demandeindividuelId",
            date_evaluation as "dateEvaluation",
            cycle_affaires as "cycleAffaires",
            facteur_cycle as "facteurCycle",
            type_cdr as "typeCdr",
            valeur_garantie as "valeurGarantie",
            COALESCE(total_valeur_emprunte, 0) as "totalValeurEmprunte",
            montant_demande as "montantDemande",
            duree_demande as "dureeDemande",
            nombre_echeance as "nombreEcheance",
            echeance,
            object_credit as "objectCredit",
            periodicite_remboursement as "periodiciteRemboursement",
            montant_propose as "montantPropose",
            duree_proposee as "dureeProposee",
            nombre_echeance_propose as "nombreEcheancePropose",
            echeance_proposee as "echeanceProposee",
            total_actif as "totalActif",
            total_immobilisations as "totalImmobilisations",
            total_dettes as "totalDettes",
            capitaux_propres as "capitauxPropres",
            fonds_roulement as "fondsRoulement",
            besoin_fonds_roulement as "besoinFondsRoulement",
            creances_clients as "creancesClients",
            tresorerie_caisse_banque as "tresorerieCaisseBanque",
            emprunt_long_terme as "empruntLongTerme",
            emprunt_court_terme as "empruntCourtTerme",
            autres_dettes as "autresDettes",
            chiffre_affaires as "chiffreAffaires",
            marge_brute as "margeBrute",
            total_charges_exploitation as "totalChargesExploitation",
            resultat_exploitation as "resultatExploitation",
            cash_flow as "cashFlow",
            autres_revenus_hors_activite as "autresRevenusHorsActivite",
            capacite_remboursement as "capaciteRemboursement",
            calc_r1_sollicite as "calcR1Sollicite",
            calc_r1_propose as "calcR1Propose",
            calc_r2 as "calcR2",
            calc_r3 as "calcR3",
            calc_r4_sollicite as "calcR4Sollicite",
            calc_r4_propose as "calcR4Propose",
            calc_r5 as "calcR5",
            calc_r6_sollicite as "calcR6Sollicite",
            calc_r6_propose as "calcR6Propose"
        FROM v_synthese_analyse
        WHERE analyse_id = :analyseId
        """;

    public static final String SELECT_SYNTHESE_BY_DEMANDE = """
        SELECT
            af.analyse_id as "analyseId",
            af.demandeindividuel_id as "demandeindividuelId",
            af.date_evaluation as "dateEvaluation",
            af.cycle_affaires as "cycleAffaires",
            af.facteur_cycle as "facteurCycle",
            af.type_cdr as "typeCdr",
            COALESCE(gar.total_valeur_emprunte, 0) as "valeurGarantie",

            -- ══════ DEMANDE DE CRÉDIT ══════
            d.montant_demande as "montantDemande",
            d.duree_demande as "dureeDemande",
            d.nombre_echeance as "nombreEcheance",
            d.echeance,
            d.object_credit as "objectCredit",
            d.periodicite_remboursement as "periodiciteRemboursement",
            d.montant_propose as "montantPropose",
            d.duree_proposee as "dureeProposee",
            d.nombre_echeance_propose as "nombreEcheancePropose",
            d.echeance_proposee as "echeanceProposee",

            -- ══════ BILAN N (Évaluation actuelle) ══════
            COALESCE(bilN.terrain, 0) as "terrainN",
            COALESCE(bilN.batiment_magasin, 0) as "batimentMagasinN",
            COALESCE(bilN.installation_agencement, 0) as "installationAgencementN",
            COALESCE(bilN.materiel_industriel, 0) as "materielIndustrielN",
            COALESCE(bilN.mobilier_bureau, 0) as "mobilierBureauN",
            COALESCE(bilN.materiel_informatique, 0) as "materielInformatiqueN",
            COALESCE(bilN.materiel_transport, 0) as "materielTransportN",
            COALESCE(bilN.autre_immobilisation, 0) as "autreImmobilisationN",
            COALESCE(bilN.stocks, 0) as "stocksN",
            COALESCE(bilN.creances_clients, 0) as "creancesClientsN",
            COALESCE(bilN.tresorerie_caisse_banque, 0) as "tresorerieCaisseBanqueN",
            COALESCE(bilN.emprunt_long_terme, 0) as "empruntLongTermeN",
            COALESCE(bilN.emprunt_court_terme, 0) as "empruntCourtTermeN",
            COALESCE(bilN.autres_dettes, 0) as "autresDettesN",
            COALESCE(bilN.total_immobilisations, 0) as "totalImmobilisationsN",
            COALESCE(bilN.total_actif, 0) as "totalActifN",
            COALESCE(bilN.total_dettes, 0) as "totalDettesN",
            COALESCE(bilN.capitaux_propres, 0) as "capitauxPropresN",
            COALESCE(bilN.fonds_roulement, 0) as "fondsRoulementN",
            COALESCE(bilN.besoin_fonds_roulement, 0) as "besoinFondsRoulementN",

            -- ══════ BILAN N-1 (Évaluation précédente) ══════
            COALESCE(bilN1.terrain, 0) as "terrainN1",
            COALESCE(bilN1.batiment_magasin, 0) as "batimentMagasinN1",
            COALESCE(bilN1.installation_agencement, 0) as "installationAgencementN1",
            COALESCE(bilN1.materiel_industriel, 0) as "materielIndustrielN1",
            COALESCE(bilN1.mobilier_bureau, 0) as "mobilierBureauN1",
            COALESCE(bilN1.materiel_informatique, 0) as "materielInformatiqueN1",
            COALESCE(bilN1.materiel_transport, 0) as "materielTransportN1",
            COALESCE(bilN1.autre_immobilisation, 0) as "autreImmobilisationN1",
            COALESCE(bilN1.stocks, 0) as "stocksN1",
            COALESCE(bilN1.creances_clients, 0) as "creancesClientsN1",
            COALESCE(bilN1.tresorerie_caisse_banque, 0) as "tresorerieCaisseBanqueN1",
            COALESCE(bilN1.emprunt_long_terme, 0) as "empruntLongTermeN1",
            COALESCE(bilN1.emprunt_court_terme, 0) as "empruntCourtTermeN1",
            COALESCE(bilN1.autres_dettes, 0) as "autresDettesN1",
            COALESCE(bilN1.total_immobilisations, 0) as "totalImmobilisationsN1",
            COALESCE(bilN1.total_actif, 0) as "totalActifN1",
            COALESCE(bilN1.total_dettes, 0) as "totalDettesN1",
            COALESCE(bilN1.capitaux_propres, 0) as "capitauxPropresN1",
            COALESCE(bilN1.fonds_roulement, 0) as "fondsRoulementN1",
            COALESCE(bilN1.besoin_fonds_roulement, 0) as "besoinFondsRoulementN1",

            -- ══════ RENTABILITÉ N ══════
            COALESCE(rentN.chiffre_affaires, 0) as "chiffreAffairesN",
            COALESCE(rentN.cout_achat_marchandises, 0) as "coutAchatMarchandisesN",
            COALESCE(rentN.marge_brute, 0) as "margeBruteN",
            COALESCE(rentN.salaires, 0) as "salairesN",
            COALESCE(rentN.prelevement_entrepreneur, 0) as "prelevementEntrepreneurN",
            COALESCE(rentN.loyers, 0) as "loyersN",
            COALESCE(rentN.transport, 0) as "transportN",
            COALESCE(rentN.electricite_eau_telephone, 0) as "electriciteEauTelephoneN",
            COALESCE(rentN.fournitures_autres_besoins, 0) as "fournituresAutresBesoinsN",
            COALESCE(rentN.entretien_reparation, 0) as "entretienReparationN",
            COALESCE(rentN.carburant_lubrifiants, 0) as "carburantLubrifiantsN",
            COALESCE(rentN.publicite_promotion, 0) as "publicitePromotionN",
            COALESCE(rentN.impots_taxes, 0) as "impotsTaxesN",
            COALESCE(rentN.frais_bancaires_interets, 0) as "fraisBancairesInteretsN",
            COALESCE(rentN.echeance_autre_credit, 0) as "echeanceAutreCreditN",
            COALESCE(rentN.diverses_charges, 0) as "diversesChargesN",
            COALESCE(rentN.amortissements_provisions, 0) as "amortissementsProvisionsN",
            COALESCE(rentN.autres_revenus_hors_activite, 0) as "autresRevenusHorsActiviteN",
            COALESCE(rentN.total_charges_exploitation, 0) as "totalChargesExploitationN",
            COALESCE(rentN.resultat_exploitation, 0) as "resultatExploitationN",
            COALESCE(rentN.cash_flow, 0) as "cashFlowN",
            COALESCE(rentN.capacite_remboursement, 0) as "capaciteRemboursementN",

            -- ══════ RENTABILITÉ N-1 ══════
            COALESCE(rentN1.chiffre_affaires, 0) as "chiffreAffairesN1",
            COALESCE(rentN1.cout_achat_marchandises, 0) as "coutAchatMarchandisesN1",
            COALESCE(rentN1.marge_brute, 0) as "margeBruteN1",
            COALESCE(rentN1.salaires, 0) as "salairesN1",
            COALESCE(rentN1.prelevement_entrepreneur, 0) as "prelevementEntrepreneurN1",
            COALESCE(rentN1.loyers, 0) as "loyersN1",
            COALESCE(rentN1.transport, 0) as "transportN1",
            COALESCE(rentN1.electricite_eau_telephone, 0) as "electriciteEauTelephoneN1",
            COALESCE(rentN1.fournitures_autres_besoins, 0) as "fournituresAutresBesoinsN1",
            COALESCE(rentN1.entretien_reparation, 0) as "entretienReparationN1",
            COALESCE(rentN1.carburant_lubrifiants, 0) as "carburantLubrifiantsN1",
            COALESCE(rentN1.publicite_promotion, 0) as "publicitePromotionN1",
            COALESCE(rentN1.impots_taxes, 0) as "impotsTaxesN1",
            COALESCE(rentN1.frais_bancaires_interets, 0) as "fraisBancairesInteretsN1",
            COALESCE(rentN1.echeance_autre_credit, 0) as "echeanceAutreCreditN1",
            COALESCE(rentN1.diverses_charges, 0) as "diversesChargesN1",
            COALESCE(rentN1.amortissements_provisions, 0) as "amortissementsProvisionsN1",
            COALESCE(rentN1.autres_revenus_hors_activite, 0) as "autresRevenusHorsActiviteN1",
            COALESCE(rentN1.total_charges_exploitation, 0) as "totalChargesExploitationN1",
            COALESCE(rentN1.resultat_exploitation, 0) as "resultatExploitationN1",
            COALESCE(rentN1.cash_flow, 0) as "cashFlowN1",
            COALESCE(rentN1.capacite_remboursement, 0) as "capaciteRemboursementN1",

            -- ══════ RENTABILITÉ N+1 (Prévisionnel) ══════
            COALESCE(rentNplus1.chiffre_affaires, 0) as "chiffreAffairesNplus1",
            COALESCE(rentNplus1.cout_achat_marchandises, 0) as "coutAchatMarchandisesNplus1",
            COALESCE(rentNplus1.marge_brute, 0) as "margeBruteNplus1",
            COALESCE(rentNplus1.salaires, 0) as "salairesNplus1",
            COALESCE(rentNplus1.prelevement_entrepreneur, 0) as "prelevementEntrepreneurNplus1",
            COALESCE(rentNplus1.loyers, 0) as "loyersNplus1",
            COALESCE(rentNplus1.transport, 0) as "transportNplus1",
            COALESCE(rentNplus1.electricite_eau_telephone, 0) as "electriciteEauTelephoneNplus1",
            COALESCE(rentNplus1.fournitures_autres_besoins, 0) as "fournituresAutresBesoinsNplus1",
            COALESCE(rentNplus1.entretien_reparation, 0) as "entretienReparationNplus1",
            COALESCE(rentNplus1.carburant_lubrifiants, 0) as "carburantLubrifiantsNplus1",
            COALESCE(rentNplus1.publicite_promotion, 0) as "publicitePromotionNplus1",
            COALESCE(rentNplus1.impots_taxes, 0) as "impotsTaxesNplus1",
            COALESCE(rentNplus1.frais_bancaires_interets, 0) as "fraisBancairesInteretsNplus1",
            COALESCE(rentNplus1.echeance_autre_credit, 0) as "echeanceAutreCreditNplus1",
            COALESCE(rentNplus1.diverses_charges, 0) as "diversesChargesNplus1",
            COALESCE(rentNplus1.amortissements_provisions, 0) as "amortissementsProvisionsNplus1",
            COALESCE(rentNplus1.autres_revenus_hors_activite, 0) as "autresRevenusHorsActiviteNplus1",
            COALESCE(rentNplus1.total_charges_exploitation, 0) as "totalChargesExploitationNplus1",
            COALESCE(rentNplus1.resultat_exploitation, 0) as "resultatExploitationNplus1",
            COALESCE(rentNplus1.cash_flow, 0) as "cashFlowNplus1",
            COALESCE(rentNplus1.capacite_remboursement, 0) as "capaciteRemboursementNplus1",

            -- ══════ BESOIN EN CRÉDIT - Investissement ══════
            COALESCE(bcRaw.cout_equipement, 0) as "coutEquipement",
            COALESCE(bcRaw.ajust_cout_equipement, 0) as "ajustCoutEquipement",
            COALESCE(bcRaw.depenses_rattachees, 0) as "depensesRattachees",
            COALESCE(bcRaw.ajust_depenses_rattachees, 0) as "ajustDepensesRattachees",
            COALESCE(bcRaw.apport_personnel, 0) as "apportPersonnel",
            COALESCE(bcRaw.ajust_apport_personnel, 0) as "ajustApportPersonnel",
            COALESCE(bc.besoin_reel_investissement, 0) as "besoinReelInvestissement",

            -- ══════ BESOIN EN CRÉDIT - Exploitation ══════
            COALESCE(bcRaw.cout_achat_cycle, 0) as "coutAchatCycle",
            COALESCE(bcRaw.ajust_cout_achat_cycle, 0) as "ajustCoutAchatCycle",
            COALESCE(bcRaw.nbre_cycle_financer, 0) as "nbreCycleFinancer",
            COALESCE(bcRaw.tresorerie_disponible, 0) as "tresorerieDisponible",
            COALESCE(bcRaw.ajust_tresorerie_dispo, 0) as "ajustTresorerieDispo",
            COALESCE(bcRaw.stock_actuel, 0) as "stockActuel",
            COALESCE(bcRaw.ajust_stock_actuel, 0) as "ajustStockActuel",
            COALESCE(bcRaw.comptes_recevoir, 0) as "comptesRecevoir",
            COALESCE(bcRaw.ajust_comptes_recevoir, 0) as "ajustComptesRecevoir",
            COALESCE(bcRaw.dettes_fournisseurs, 0) as "dettesFournisseurs",
            COALESCE(bcRaw.ajust_dettes_fournisseurs, 0) as "ajustDettesFournisseurs",
            COALESCE(bcRaw.credit_fournisseur, 0) as "creditFournisseur",
            COALESCE(bcRaw.ajust_credit_fournisseur, 0) as "ajustCreditFournisseur",
            COALESCE(bc.besoin_reel_exploitation, 0) as "besoinReelExploitation",

            -- ══════ RATIOS CALCULÉS ══════
            CASE WHEN COALESCE(d.echeance, 0) > 0
                 THEN rentN.capacite_remboursement / d.echeance ELSE NULL END as "calcR1Sollicite",
            CASE WHEN COALESCE(d.echeance_proposee, 0) > 0
                 THEN rentN.capacite_remboursement / d.echeance_proposee ELSE NULL END as "calcR1Propose",
            CASE WHEN COALESCE(bilN.total_actif, 0) > 0
                 THEN bilN.capitaux_propres / bilN.total_actif ELSE NULL END as "calcR2",
            CASE WHEN (COALESCE(bilN.emprunt_court_terme, 0) + COALESCE(bilN.autres_dettes, 0)) > 0
                 THEN (bilN.creances_clients + bilN.tresorerie_caisse_banque) / (bilN.emprunt_court_terme + bilN.autres_dettes) ELSE NULL END as "calcR3",
            CASE WHEN (COALESCE(bilN.total_actif, 0) + COALESCE(d.montant_demande, 0)) > 0
                 THEN (bilN.total_dettes + d.montant_demande) / (bilN.total_actif + d.montant_demande) ELSE NULL END as "calcR4Sollicite",
            CASE WHEN (COALESCE(bilN.total_actif, 0) + COALESCE(d.montant_propose, 0)) > 0
                 THEN (bilN.total_dettes + COALESCE(d.montant_propose, 0)) / (bilN.total_actif + COALESCE(d.montant_propose, 0)) ELSE NULL END as "calcR4Propose",
            CASE WHEN (COALESCE(rentN.resultat_exploitation, 0) + COALESCE(rentN.autres_revenus_hors_activite, 0)) > 0
                 THEN rentN.autres_revenus_hors_activite / (rentN.resultat_exploitation + rentN.autres_revenus_hors_activite) ELSE NULL END as "calcR5",
            -- R.6 = SUM(garantie_propose.valeur_emprunte) / montant_demande
            CASE WHEN COALESCE(d.montant_demande, 0) > 0
                 THEN COALESCE(gar.total_valeur_emprunte, 0) / d.montant_demande ELSE NULL END as "calcR6Sollicite",
            CASE WHEN COALESCE(d.montant_propose, 0) > 0
                 THEN COALESCE(gar.total_valeur_emprunte, 0) / d.montant_propose ELSE NULL END as "calcR6Propose"

        FROM analyse_financiere af
        JOIN demandeindividuel d ON d.demandeindividuel_id = af.demandeindividuel_id
        LEFT JOIN v_bilan_complet bilN ON bilN.analyse_id = af.analyse_id AND bilN.type_periode = 'N'
        LEFT JOIN v_bilan_complet bilN1 ON bilN1.analyse_id = af.analyse_id AND bilN1.type_periode = 'N_MOINS_1'
        LEFT JOIN v_rentabilite_complete rentN ON rentN.analyse_id = af.analyse_id AND rentN.type_periode = 'N'
        LEFT JOIN v_rentabilite_complete rentN1 ON rentN1.analyse_id = af.analyse_id AND rentN1.type_periode = 'N_MOINS_1'
        LEFT JOIN v_rentabilite_complete rentNplus1 ON rentNplus1.analyse_id = af.analyse_id AND rentNplus1.type_periode = 'N_PLUS_1'
        LEFT JOIN v_besoin_credit_complet bc ON bc.analyse_id = af.analyse_id
        LEFT JOIN analyse_besoin_credit bcRaw ON bcRaw.analyse_id = af.analyse_id
        -- Sous-requête pour SUM(valeur_emprunte) des garanties
        LEFT JOIN (
            SELECT demandeindividuel_id, SUM(COALESCE(valeur_emprunte, 0)) as total_valeur_emprunte
            FROM garantie_propose
            GROUP BY demandeindividuel_id
        ) gar ON gar.demandeindividuel_id = af.demandeindividuel_id
        WHERE af.demandeindividuel_id = :demandeindividuelId
        """;

    // ==================== UTILITY ====================

    public static final String CHECK_ANALYSE_EXISTS = """
        SELECT COUNT(*) > 0 FROM analyse_financiere WHERE analyse_id = :analyseId
        """;

    public static final String CHECK_DEMANDE_HAS_ANALYSE = """
        SELECT COUNT(*) > 0 FROM analyse_financiere
        WHERE demandeindividuel_id = :demandeindividuelId
        """;

    public static final String CHECK_BILAN_EXISTS = """
        SELECT COUNT(*) > 0 FROM analyse_bilan WHERE bilan_id = :bilanId
        """;

    public static final String CHECK_RENTABILITE_EXISTS = """
        SELECT COUNT(*) > 0 FROM analyse_rentabilite WHERE rentabilite_id = :rentabiliteId
        """;

    // ==================== SOUMISSION ====================

    public static final String SOUMETTRE_ANALYSE = """
        SELECT
            succes,
            analyse_id as "analyseId",
            demandeindividuel_id as "demandeindividuelId",
            statut,
            date_soumission as "dateSoumission",
            nombre_erreurs as "nombreErreurs",
            erreurs,
            r1_sollicite as "r1Sollicite",
            r2_sollicite as "r2Sollicite",
            r3_sollicite as "r3Sollicite",
            r4_sollicite as "r4Sollicite",
            r5_sollicite as "r5Sollicite",
            r6_sollicite as "r6Sollicite",
            conformite_sollicite as "conformiteSollicite",
            r1_propose as "r1Propose",
            r2_propose as "r2Propose",
            r3_propose as "r3Propose",
            r4_propose as "r4Propose",
            r5_propose as "r5Propose",
            r6_propose as "r6Propose",
            conformite_propose as "conformitePropose",
            total_actif as "totalActif",
            capitaux_propres as "capitauxPropres",
            cash_flow as "cashFlow",
            capacite_remboursement as "capaciteRemboursement",
            besoin_reel_investissement as "besoinReelInvestissement",
            besoin_reel_exploitation as "besoinReelExploitation"
        FROM fn_soumettre_analyse(
            :analyseId,
            :codUsuario,
            :nomAnalyste,
            :forcerSoumission
        )
        """;

    public static final String VALIDER_ANALYSE = """
        SELECT
            est_valide as "estValide",
            nombre_erreurs as "nombreErreurs",
            erreurs
        FROM fn_valider_analyse(:analyseId)
        """;

    // ==================== PERSONNES CAUTION ====================

    public static final String SELECT_PERSONNES_CAUTION_BY_DEMANDE = """
        SELECT
            personnecaution_id as "personnecautionId",
            entreprise_id as "entrepriseId",
            demandeindividuel_id as "demandeindividuelId",
            nom,
            prenom,
            telephone,
            activite,
            age,
            profession
        FROM personnecaution
        WHERE demandeindividuel_id = :demandeindividuelId
        ORDER BY personnecaution_id
        """;
}
