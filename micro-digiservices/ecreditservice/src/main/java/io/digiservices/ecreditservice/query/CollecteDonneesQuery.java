package io.digiservices.ecreditservice.query;

public class CollecteDonneesQuery {

    // ==================== COLLECTE DONNEES (Header + Section 1) ====================

    public static final String INSERT_COLLECTE = """
            INSERT INTO collecte_donnees (demandeindividuel_id, date_evaluation, agent_collecte_cod, agent_collecte_nom,
                activite_description, secteur_activite, sous_secteur_activite, sous_sous_secteur)
            VALUES (:demandeindividuelId, :dateEvaluation, :agentCollecteCod, :agentCollecteNom,
                :activiteDescription, :secteurActivite, :sousSecteurActivite, :sousSousSecteur)
            RETURNING collecte_id
            """;

    public static final String SELECT_COLLECTE_BY_ID = """
            SELECT collecte_id as "collecteId", demandeindividuel_id as "demandeindividuelId",
                date_evaluation as "dateEvaluation", agent_collecte_cod as "agentCollecteCod",
                agent_collecte_nom as "agentCollecteNom", activite_description as "activiteDescription",
                secteur_activite as "secteurActivite", sous_secteur_activite as "sousSecteurActivite",
                sous_sous_secteur as "sousSousSecteur", statut, pourcentage_completion as "pourcentageCompletion",
                created_at as "createdAt", updated_at as "updatedAt"
            FROM collecte_donnees
            WHERE collecte_id = :collecteId
            """;

    public static final String SELECT_COLLECTE_BY_DEMANDE = """
            SELECT collecte_id as "collecteId", demandeindividuel_id as "demandeindividuelId",
                date_evaluation as "dateEvaluation", agent_collecte_cod as "agentCollecteCod",
                agent_collecte_nom as "agentCollecteNom", activite_description as "activiteDescription",
                secteur_activite as "secteurActivite", sous_secteur_activite as "sousSecteurActivite",
                sous_sous_secteur as "sousSousSecteur", statut, pourcentage_completion as "pourcentageCompletion",
                created_at as "createdAt", updated_at as "updatedAt"
            FROM collecte_donnees
            WHERE demandeindividuel_id = :demandeindividuelId
            """;

    public static final String UPDATE_SECTION1 = """
            UPDATE collecte_donnees
            SET date_evaluation = :dateEvaluation, agent_collecte_cod = :agentCollecteCod,
                agent_collecte_nom = :agentCollecteNom, activite_description = :activiteDescription,
                secteur_activite = :secteurActivite, sous_secteur_activite = :sousSecteurActivite,
                sous_sous_secteur = :sousSousSecteur
            WHERE collecte_id = :collecteId
            """;

    public static final String DELETE_COLLECTE = """
            DELETE FROM collecte_donnees WHERE collecte_id = :collecteId
            """;

    public static final String CHECK_COLLECTE_EXISTS = """
            SELECT EXISTS(SELECT 1 FROM collecte_donnees WHERE collecte_id = :collecteId)
            """;

    public static final String CHECK_DEMANDE_HAS_COLLECTE = """
            SELECT EXISTS(SELECT 1 FROM collecte_donnees WHERE demandeindividuel_id = :demandeindividuelId)
            """;

    // ==================== CHIFFRE D'AFFAIRES (Section 3) ====================

    public static final String UPSERT_CHIFFRE_AFFAIRES = """
            INSERT INTO collecte_chiffre_affaires (collecte_id, ca_hebdomadaire_declare, ca_mensuel_declare,
                cycle_mensuel_json, cycle_hebdo_json, ca_jour_fort, ca_jour_moyen, ca_jour_faible,
                ca_hebdo_calcule, ca_mensuel_calcule)
            VALUES (:collecteId, :caHebdomadaireDeclare, :caMensuelDeclare,
                :cycleMensuelJson::jsonb, :cycleHebdoJson::jsonb, :caJourFort, :caJourMoyen, :caJourFaible,
                :caHebdoCalcule, :caMensuelCalcule)
            ON CONFLICT (collecte_id) DO UPDATE SET
                ca_hebdomadaire_declare = EXCLUDED.ca_hebdomadaire_declare,
                ca_mensuel_declare = EXCLUDED.ca_mensuel_declare,
                cycle_mensuel_json = EXCLUDED.cycle_mensuel_json,
                cycle_hebdo_json = EXCLUDED.cycle_hebdo_json,
                ca_jour_fort = EXCLUDED.ca_jour_fort,
                ca_jour_moyen = EXCLUDED.ca_jour_moyen,
                ca_jour_faible = EXCLUDED.ca_jour_faible,
                ca_hebdo_calcule = EXCLUDED.ca_hebdo_calcule,
                ca_mensuel_calcule = EXCLUDED.ca_mensuel_calcule
            RETURNING ca_id
            """;

    public static final String SELECT_CA_BY_COLLECTE = """
            SELECT ca_id as "caId", collecte_id as "collecteId",
                ca_hebdomadaire_declare as "caHebdomadaireDeclare", ca_mensuel_declare as "caMensuelDeclare",
                cycle_mensuel_json::text as "cycleMensuelJson", cycle_hebdo_json::text as "cycleHebdoJson",
                ca_jour_fort as "caJourFort", ca_jour_moyen as "caJourMoyen", ca_jour_faible as "caJourFaible",
                ca_hebdo_calcule as "caHebdoCalcule", ca_mensuel_calcule as "caMensuelCalcule"
            FROM collecte_chiffre_affaires
            WHERE collecte_id = :collecteId
            """;

    // ==================== MARGE BRUTE (Section 4) ====================

    public static final String UPSERT_MARGE_BRUTE = """
            INSERT INTO collecte_marge_brute (collecte_id, connait_taux_marge, taux_marge_declare,
                calculer_taux_marge, frequence_ventes, total_ca_calcule, total_cout_calcule, taux_marge_calcule)
            VALUES (:collecteId, :connaitTauxMarge, :tauxMargeDeclare,
                :calculerTauxMarge, :frequenceVentes, :totalCaCalcule, :totalCoutCalcule, :tauxMargeCalcule)
            ON CONFLICT (collecte_id) DO UPDATE SET
                connait_taux_marge = EXCLUDED.connait_taux_marge,
                taux_marge_declare = EXCLUDED.taux_marge_declare,
                calculer_taux_marge = EXCLUDED.calculer_taux_marge,
                frequence_ventes = EXCLUDED.frequence_ventes,
                total_ca_calcule = EXCLUDED.total_ca_calcule,
                total_cout_calcule = EXCLUDED.total_cout_calcule,
                taux_marge_calcule = EXCLUDED.taux_marge_calcule
            RETURNING marge_id
            """;

    public static final String SELECT_MARGE_BY_COLLECTE = """
            SELECT marge_id as "margeId", collecte_id as "collecteId",
                connait_taux_marge as "connaitTauxMarge", taux_marge_declare as "tauxMargeDeclare",
                calculer_taux_marge as "calculerTauxMarge", frequence_ventes as "frequenceVentes",
                total_ca_calcule as "totalCaCalcule", total_cout_calcule as "totalCoutCalcule",
                taux_marge_calcule as "tauxMargeCalcule"
            FROM collecte_marge_brute
            WHERE collecte_id = :collecteId
            """;

    // ==================== PRODUIT (Section 4 detail) ====================

    public static final String INSERT_PRODUIT = """
            INSERT INTO collecte_produit (collecte_id, ordre, nom_produit, prix_vente, cout_achat, quantite)
            VALUES (:collecteId, :ordre, :nomProduit, :prixVente, :coutAchat, :quantite)
            RETURNING produit_id
            """;

    public static final String SELECT_PRODUITS_BY_COLLECTE = """
            SELECT produit_id as "produitId", collecte_id as "collecteId",
                ordre, nom_produit as "nomProduit", prix_vente as "prixVente", cout_achat as "coutAchat",
                quantite, chiffre_affaires as "chiffreAffaires", cout_total as "coutTotal",
                marge_unitaire as "margeUnitaire"
            FROM collecte_produit
            WHERE collecte_id = :collecteId
            ORDER BY ordre
            """;

    public static final String DELETE_PRODUITS_BY_COLLECTE = """
            DELETE FROM collecte_produit WHERE collecte_id = :collecteId
            """;

    // ==================== ACTIF PASSIF (Section 5) ====================

    public static final String UPSERT_ACTIF_PASSIF = """
            INSERT INTO collecte_actif_passif (collecte_id,
                terrain_existe, terrain_valeur,
                batiment_existe, batiment_propriete,
                installation_existe, installation_propriete,
                materiel_roulant_existe, materiel_roulant_propriete,
                mobilier_existe, mobilier_propriete,
                machine_existe, machine_propriete,
                caution_financiere_existe, caution_financiere_valeur,
                pret_employe_existe, pret_employe_fonds_activite, pret_employe_valeur,
                stock_existe, stock_connait_valeur, stock_valeur_estimee, stock_evaluer_detail,
                credit_fournisseur_existe, credit_fournisseur_prevu, credit_fournisseur_valeur,
                creance_client_existe, creance_plus_3_mois, creance_moins_3_mois,
                cash_existe, cash_valeur,
                compte_crg_existe, compte_crg_valeur,
                tontinier_existe, tontinier_valeur,
                compte_banque_existe, compte_banque_valeur,
                emprunt_imf_existe, emprunt_imf_valeur,
                emprunt_bancaire_lt_existe, emprunt_bancaire_lt_valeur,
                emprunt_bancaire_ct_existe, emprunt_bancaire_ct_valeur,
                avance_client_existe, avance_client_valeur,
                dette_fournisseur_existe, dette_fournisseur_valeur,
                impot_non_paye_existe, impot_non_paye_valeur,
                loyer_non_paye_existe, loyer_non_paye_valeur,
                facture_non_payee_existe, facture_non_payee_valeur,
                tontine_dette_existe, tontine_dette_valeur,
                autre_dette_existe, autre_dette_valeur)
            VALUES (:collecteId,
                :terrainExiste, :terrainValeur,
                :batimentExiste, :batimentPropriete,
                :installationExiste, :installationPropriete,
                :materielRoulantExiste, :materielRoulantPropriete,
                :mobilierExiste, :mobilierPropriete,
                :machineExiste, :machinePropriete,
                :cautionFinanciereExiste, :cautionFinanciereValeur,
                :pretEmployeExiste, :pretEmployeFondsActivite, :pretEmployeValeur,
                :stockExiste, :stockConnaitValeur, :stockValeurEstimee, :stockEvaluerDetail,
                :creditFournisseurExiste, :creditFournisseurPrevu, :creditFournisseurValeur,
                :creanceClientExiste, :creancePlus3Mois, :creanceMoins3Mois,
                :cashExiste, :cashValeur,
                :compteCrgExiste, :compteCrgValeur,
                :tontinierExiste, :tontinierValeur,
                :compteBanqueExiste, :compteBanqueValeur,
                :empruntImfExiste, :empruntImfValeur,
                :empruntBancaireLtExiste, :empruntBancaireLtValeur,
                :empruntBancaireCtExiste, :empruntBancaireCtValeur,
                :avanceClientExiste, :avanceClientValeur,
                :detteFournisseurExiste, :detteFournisseurValeur,
                :impotNonPayeExiste, :impotNonPayeValeur,
                :loyerNonPayeExiste, :loyerNonPayeValeur,
                :factureNonPayeeExiste, :factureNonPayeeValeur,
                :tontineDetteExiste, :tontineDetteValeur,
                :autreDetteExiste, :autreDetteValeur)
            ON CONFLICT (collecte_id) DO UPDATE SET
                terrain_existe = EXCLUDED.terrain_existe, terrain_valeur = EXCLUDED.terrain_valeur,
                batiment_existe = EXCLUDED.batiment_existe, batiment_propriete = EXCLUDED.batiment_propriete,
                installation_existe = EXCLUDED.installation_existe, installation_propriete = EXCLUDED.installation_propriete,
                materiel_roulant_existe = EXCLUDED.materiel_roulant_existe, materiel_roulant_propriete = EXCLUDED.materiel_roulant_propriete,
                mobilier_existe = EXCLUDED.mobilier_existe, mobilier_propriete = EXCLUDED.mobilier_propriete,
                machine_existe = EXCLUDED.machine_existe, machine_propriete = EXCLUDED.machine_propriete,
                caution_financiere_existe = EXCLUDED.caution_financiere_existe, caution_financiere_valeur = EXCLUDED.caution_financiere_valeur,
                pret_employe_existe = EXCLUDED.pret_employe_existe, pret_employe_fonds_activite = EXCLUDED.pret_employe_fonds_activite,
                pret_employe_valeur = EXCLUDED.pret_employe_valeur,
                stock_existe = EXCLUDED.stock_existe, stock_connait_valeur = EXCLUDED.stock_connait_valeur,
                stock_valeur_estimee = EXCLUDED.stock_valeur_estimee, stock_evaluer_detail = EXCLUDED.stock_evaluer_detail,
                credit_fournisseur_existe = EXCLUDED.credit_fournisseur_existe, credit_fournisseur_prevu = EXCLUDED.credit_fournisseur_prevu,
                credit_fournisseur_valeur = EXCLUDED.credit_fournisseur_valeur,
                creance_client_existe = EXCLUDED.creance_client_existe, creance_plus_3_mois = EXCLUDED.creance_plus_3_mois,
                creance_moins_3_mois = EXCLUDED.creance_moins_3_mois,
                cash_existe = EXCLUDED.cash_existe, cash_valeur = EXCLUDED.cash_valeur,
                compte_crg_existe = EXCLUDED.compte_crg_existe, compte_crg_valeur = EXCLUDED.compte_crg_valeur,
                tontinier_existe = EXCLUDED.tontinier_existe, tontinier_valeur = EXCLUDED.tontinier_valeur,
                compte_banque_existe = EXCLUDED.compte_banque_existe, compte_banque_valeur = EXCLUDED.compte_banque_valeur,
                emprunt_imf_existe = EXCLUDED.emprunt_imf_existe, emprunt_imf_valeur = EXCLUDED.emprunt_imf_valeur,
                emprunt_bancaire_lt_existe = EXCLUDED.emprunt_bancaire_lt_existe, emprunt_bancaire_lt_valeur = EXCLUDED.emprunt_bancaire_lt_valeur,
                emprunt_bancaire_ct_existe = EXCLUDED.emprunt_bancaire_ct_existe, emprunt_bancaire_ct_valeur = EXCLUDED.emprunt_bancaire_ct_valeur,
                avance_client_existe = EXCLUDED.avance_client_existe, avance_client_valeur = EXCLUDED.avance_client_valeur,
                dette_fournisseur_existe = EXCLUDED.dette_fournisseur_existe, dette_fournisseur_valeur = EXCLUDED.dette_fournisseur_valeur,
                impot_non_paye_existe = EXCLUDED.impot_non_paye_existe, impot_non_paye_valeur = EXCLUDED.impot_non_paye_valeur,
                loyer_non_paye_existe = EXCLUDED.loyer_non_paye_existe, loyer_non_paye_valeur = EXCLUDED.loyer_non_paye_valeur,
                facture_non_payee_existe = EXCLUDED.facture_non_payee_existe, facture_non_payee_valeur = EXCLUDED.facture_non_payee_valeur,
                tontine_dette_existe = EXCLUDED.tontine_dette_existe, tontine_dette_valeur = EXCLUDED.tontine_dette_valeur,
                autre_dette_existe = EXCLUDED.autre_dette_existe, autre_dette_valeur = EXCLUDED.autre_dette_valeur
            RETURNING actif_passif_id
            """;

    public static final String SELECT_ACTIF_PASSIF_BY_COLLECTE = """
            SELECT actif_passif_id as "actifPassifId", collecte_id as "collecteId",
                terrain_existe as "terrainExiste", terrain_valeur as "terrainValeur",
                batiment_existe as "batimentExiste", batiment_propriete as "batimentPropriete",
                installation_existe as "installationExiste", installation_propriete as "installationPropriete",
                materiel_roulant_existe as "materielRoulantExiste", materiel_roulant_propriete as "materielRoulantPropriete",
                mobilier_existe as "mobilierExiste", mobilier_propriete as "mobilierPropriete",
                machine_existe as "machineExiste", machine_propriete as "machinePropriete",
                caution_financiere_existe as "cautionFinanciereExiste", caution_financiere_valeur as "cautionFinanciereValeur",
                pret_employe_existe as "pretEmployeExiste", pret_employe_fonds_activite as "pretEmployeFondsActivite",
                pret_employe_valeur as "pretEmployeValeur",
                stock_existe as "stockExiste", stock_connait_valeur as "stockConnaitValeur",
                stock_valeur_estimee as "stockValeurEstimee", stock_evaluer_detail as "stockEvaluerDetail",
                credit_fournisseur_existe as "creditFournisseurExiste", credit_fournisseur_prevu as "creditFournisseurPrevu",
                credit_fournisseur_valeur as "creditFournisseurValeur",
                creance_client_existe as "creanceClientExiste", creance_plus_3_mois as "creancePlus3Mois",
                creance_moins_3_mois as "creanceMoins3Mois",
                cash_existe as "cashExiste", cash_valeur as "cashValeur",
                compte_crg_existe as "compteCrgExiste", compte_crg_valeur as "compteCrgValeur",
                tontinier_existe as "tontinierExiste", tontinier_valeur as "tontinierValeur",
                compte_banque_existe as "compteBanqueExiste", compte_banque_valeur as "compteBanqueValeur",
                emprunt_imf_existe as "empruntImfExiste", emprunt_imf_valeur as "empruntImfValeur",
                emprunt_bancaire_lt_existe as "empruntBancaireLtExiste", emprunt_bancaire_lt_valeur as "empruntBancaireLtValeur",
                emprunt_bancaire_ct_existe as "empruntBancaireCtExiste", emprunt_bancaire_ct_valeur as "empruntBancaireCtValeur",
                avance_client_existe as "avanceClientExiste", avance_client_valeur as "avanceClientValeur",
                dette_fournisseur_existe as "detteFournisseurExiste", dette_fournisseur_valeur as "detteFournisseurValeur",
                impot_non_paye_existe as "impotNonPayeExiste", impot_non_paye_valeur as "impotNonPayeValeur",
                loyer_non_paye_existe as "loyerNonPayeExiste", loyer_non_paye_valeur as "loyerNonPayeValeur",
                facture_non_payee_existe as "factureNonPayeeExiste", facture_non_payee_valeur as "factureNonPayeeValeur",
                tontine_dette_existe as "tontineDetteExiste", tontine_dette_valeur as "tontineDetteValeur",
                autre_dette_existe as "autreDetteExiste", autre_dette_valeur as "autreDetteValeur"
            FROM collecte_actif_passif
            WHERE collecte_id = :collecteId
            """;

    // ==================== STOCK ARTICLE (Section 5i detail) ====================

    public static final String INSERT_STOCK_ARTICLE = """
            INSERT INTO collecte_stock_article (collecte_id, ordre, nom_article, quantite, cout_unitaire)
            VALUES (:collecteId, :ordre, :nomArticle, :quantite, :coutUnitaire)
            RETURNING stock_article_id
            """;

    public static final String SELECT_STOCKS_BY_COLLECTE = """
            SELECT stock_article_id as "stockArticleId", collecte_id as "collecteId",
                ordre, nom_article as "nomArticle", quantite, cout_unitaire as "coutUnitaire",
                valeur_stock as "valeurStock"
            FROM collecte_stock_article
            WHERE collecte_id = :collecteId
            ORDER BY ordre
            """;

    public static final String DELETE_STOCKS_BY_COLLECTE = """
            DELETE FROM collecte_stock_article WHERE collecte_id = :collecteId
            """;

    // ==================== CHARGE ENTREPRISE (Section 6) ====================

    public static final String UPSERT_CHARGE_ENTREPRISE = """
            INSERT INTO collecte_charge_entreprise (collecte_id,
                loyer_existe, loyer_montant, salaire_existe, salaire_montant,
                fourniture_existe, fourniture_montant, publicite_existe, publicite_montant,
                telephone_existe, telephone_montant, electricite_existe, electricite_montant,
                eau_existe, eau_montant, transport_achat_existe, transport_achat_montant,
                transport_vente_existe, transport_vente_montant, transport_divers_existe, transport_divers_montant,
                entretien_existe, entretien_montant, carburant_existe, carburant_montant,
                assurance_existe, assurance_montant, frais_bancaires_existe, frais_bancaires_montant,
                interets_emprunts_existe, interets_emprunts_montant, impots_taxes_existe, impots_taxes_montant,
                honoraires_existe, honoraires_montant, provisions_existe, provisions_montant,
                echeance_autre_credit_existe, echeance_autre_credit_montant,
                autres_charges_existe, autres_charges_montant)
            VALUES (:collecteId,
                :loyerExiste, :loyerMontant, :salaireExiste, :salaireMontant,
                :fournitureExiste, :fournitureMontant, :publiciteExiste, :publiciteMontant,
                :telephoneExiste, :telephoneMontant, :electriciteExiste, :electriciteMontant,
                :eauExiste, :eauMontant, :transportAchatExiste, :transportAchatMontant,
                :transportVenteExiste, :transportVenteMontant, :transportDiversExiste, :transportDiversMontant,
                :entretienExiste, :entretienMontant, :carburantExiste, :carburantMontant,
                :assuranceExiste, :assuranceMontant, :fraisBancairesExiste, :fraisBancairesMontant,
                :interetsEmpruntsExiste, :interetsEmpruntsMontant, :impotsTaxesExiste, :impotsTaxesMontant,
                :honorairesExiste, :honorairesMontant, :provisionsExiste, :provisionsMontant,
                :echeanceAutreCreditExiste, :echeanceAutreCreditMontant,
                :autresChargesExiste, :autresChargesMontant)
            ON CONFLICT (collecte_id) DO UPDATE SET
                loyer_existe = EXCLUDED.loyer_existe, loyer_montant = EXCLUDED.loyer_montant,
                salaire_existe = EXCLUDED.salaire_existe, salaire_montant = EXCLUDED.salaire_montant,
                fourniture_existe = EXCLUDED.fourniture_existe, fourniture_montant = EXCLUDED.fourniture_montant,
                publicite_existe = EXCLUDED.publicite_existe, publicite_montant = EXCLUDED.publicite_montant,
                telephone_existe = EXCLUDED.telephone_existe, telephone_montant = EXCLUDED.telephone_montant,
                electricite_existe = EXCLUDED.electricite_existe, electricite_montant = EXCLUDED.electricite_montant,
                eau_existe = EXCLUDED.eau_existe, eau_montant = EXCLUDED.eau_montant,
                transport_achat_existe = EXCLUDED.transport_achat_existe, transport_achat_montant = EXCLUDED.transport_achat_montant,
                transport_vente_existe = EXCLUDED.transport_vente_existe, transport_vente_montant = EXCLUDED.transport_vente_montant,
                transport_divers_existe = EXCLUDED.transport_divers_existe, transport_divers_montant = EXCLUDED.transport_divers_montant,
                entretien_existe = EXCLUDED.entretien_existe, entretien_montant = EXCLUDED.entretien_montant,
                carburant_existe = EXCLUDED.carburant_existe, carburant_montant = EXCLUDED.carburant_montant,
                assurance_existe = EXCLUDED.assurance_existe, assurance_montant = EXCLUDED.assurance_montant,
                frais_bancaires_existe = EXCLUDED.frais_bancaires_existe, frais_bancaires_montant = EXCLUDED.frais_bancaires_montant,
                interets_emprunts_existe = EXCLUDED.interets_emprunts_existe, interets_emprunts_montant = EXCLUDED.interets_emprunts_montant,
                impots_taxes_existe = EXCLUDED.impots_taxes_existe, impots_taxes_montant = EXCLUDED.impots_taxes_montant,
                honoraires_existe = EXCLUDED.honoraires_existe, honoraires_montant = EXCLUDED.honoraires_montant,
                provisions_existe = EXCLUDED.provisions_existe, provisions_montant = EXCLUDED.provisions_montant,
                echeance_autre_credit_existe = EXCLUDED.echeance_autre_credit_existe, echeance_autre_credit_montant = EXCLUDED.echeance_autre_credit_montant,
                autres_charges_existe = EXCLUDED.autres_charges_existe, autres_charges_montant = EXCLUDED.autres_charges_montant
            RETURNING charge_id
            """;

    public static final String SELECT_CHARGE_ENTREPRISE_BY_COLLECTE = """
            SELECT charge_id as "chargeId", collecte_id as "collecteId",
                loyer_existe as "loyerExiste", loyer_montant as "loyerMontant",
                salaire_existe as "salaireExiste", salaire_montant as "salaireMontant",
                fourniture_existe as "fournitureExiste", fourniture_montant as "fournitureMontant",
                publicite_existe as "publiciteExiste", publicite_montant as "publiciteMontant",
                telephone_existe as "telephoneExiste", telephone_montant as "telephoneMontant",
                electricite_existe as "electriciteExiste", electricite_montant as "electriciteMontant",
                eau_existe as "eauExiste", eau_montant as "eauMontant",
                transport_achat_existe as "transportAchatExiste", transport_achat_montant as "transportAchatMontant",
                transport_vente_existe as "transportVenteExiste", transport_vente_montant as "transportVenteMontant",
                transport_divers_existe as "transportDiversExiste", transport_divers_montant as "transportDiversMontant",
                entretien_existe as "entretienExiste", entretien_montant as "entretienMontant",
                carburant_existe as "carburantExiste", carburant_montant as "carburantMontant",
                assurance_existe as "assuranceExiste", assurance_montant as "assuranceMontant",
                frais_bancaires_existe as "fraisBancairesExiste", frais_bancaires_montant as "fraisBancairesMontant",
                interets_emprunts_existe as "interetsEmpruntsExiste", interets_emprunts_montant as "interetsEmpruntsMontant",
                impots_taxes_existe as "impotsTaxesExiste", impots_taxes_montant as "impotsTaxesMontant",
                honoraires_existe as "honorairesExiste", honoraires_montant as "honorairesMontant",
                provisions_existe as "provisionsExiste", provisions_montant as "provisionsMontant",
                echeance_autre_credit_existe as "echeanceAutreCreditExiste", echeance_autre_credit_montant as "echeanceAutreCreditMontant",
                autres_charges_existe as "autresChargesExiste", autres_charges_montant as "autresChargesMontant"
            FROM collecte_charge_entreprise
            WHERE collecte_id = :collecteId
            """;

    // ==================== CHARGE PERSONNELLE (Section 7) ====================

    public static final String UPSERT_CHARGE_PERSONNELLE = """
            INSERT INTO collecte_charge_personnelle (collecte_id,
                salaire_fixe, salaire_montant,
                alimentation_montant, loyer_residence_montant, transport_prive_montant,
                electricite_eau_comm_montant, habillement_montant, frais_medicaux_montant,
                echeance_credit_perso_montant, scolarite_montant, travaux_construction_montant,
                autres_charges_perso_montant, depenses_prelevees_activite)
            VALUES (:collecteId,
                :salaireFixe, :salaireMontant,
                :alimentationMontant, :loyerResidenceMontant, :transportPriveMontant,
                :electriciteEauCommMontant, :habillementMontant, :fraisMedicauxMontant,
                :echeanceCreditPersoMontant, :scolariteMontant, :travauxConstructionMontant,
                :autresChargesPersoMontant, :depensesPreleveesActivite)
            ON CONFLICT (collecte_id) DO UPDATE SET
                salaire_fixe = EXCLUDED.salaire_fixe, salaire_montant = EXCLUDED.salaire_montant,
                alimentation_montant = EXCLUDED.alimentation_montant, loyer_residence_montant = EXCLUDED.loyer_residence_montant,
                transport_prive_montant = EXCLUDED.transport_prive_montant,
                electricite_eau_comm_montant = EXCLUDED.electricite_eau_comm_montant,
                habillement_montant = EXCLUDED.habillement_montant, frais_medicaux_montant = EXCLUDED.frais_medicaux_montant,
                echeance_credit_perso_montant = EXCLUDED.echeance_credit_perso_montant,
                scolarite_montant = EXCLUDED.scolarite_montant, travaux_construction_montant = EXCLUDED.travaux_construction_montant,
                autres_charges_perso_montant = EXCLUDED.autres_charges_perso_montant,
                depenses_prelevees_activite = EXCLUDED.depenses_prelevees_activite
            RETURNING charge_perso_id
            """;

    public static final String SELECT_CHARGE_PERSONNELLE_BY_COLLECTE = """
            SELECT charge_perso_id as "chargePersoId", collecte_id as "collecteId",
                salaire_fixe as "salaireFixe", salaire_montant as "salaireMontant",
                alimentation_montant as "alimentationMontant", loyer_residence_montant as "loyerResidenceMontant",
                transport_prive_montant as "transportPriveMontant",
                electricite_eau_comm_montant as "electriciteEauCommMontant",
                habillement_montant as "habillementMontant", frais_medicaux_montant as "fraisMedicauxMontant",
                echeance_credit_perso_montant as "echeanceCreditPersoMontant",
                scolarite_montant as "scolariteMontant", travaux_construction_montant as "travauxConstructionMontant",
                autres_charges_perso_montant as "autresChargesPersoMontant",
                depenses_prelevees_activite as "depensesPreleveesActivite"
            FROM collecte_charge_personnelle
            WHERE collecte_id = :collecteId
            """;

    // ==================== AUTRE REVENU (Section 8) ====================

    public static final String UPSERT_AUTRE_REVENU = """
            INSERT INTO collecte_autre_revenu (collecte_id,
                salaire_externe_existe, salaire_externe_montant,
                loyers_percus_existe, loyers_percus_montant,
                activite_secondaire_existe, activite_secondaire_montant,
                autres_revenus_existe, autres_revenus_montant)
            VALUES (:collecteId,
                :salaireExterneExiste, :salaireExterneMontant,
                :loyersPercusExiste, :loyersPercusMontant,
                :activiteSecondaireExiste, :activiteSecondaireMontant,
                :autresRevenusExiste, :autresRevenusMontant)
            ON CONFLICT (collecte_id) DO UPDATE SET
                salaire_externe_existe = EXCLUDED.salaire_externe_existe, salaire_externe_montant = EXCLUDED.salaire_externe_montant,
                loyers_percus_existe = EXCLUDED.loyers_percus_existe, loyers_percus_montant = EXCLUDED.loyers_percus_montant,
                activite_secondaire_existe = EXCLUDED.activite_secondaire_existe, activite_secondaire_montant = EXCLUDED.activite_secondaire_montant,
                autres_revenus_existe = EXCLUDED.autres_revenus_existe, autres_revenus_montant = EXCLUDED.autres_revenus_montant
            RETURNING autre_revenu_id
            """;

    public static final String SELECT_AUTRE_REVENU_BY_COLLECTE = """
            SELECT autre_revenu_id as "autreRevenuId", collecte_id as "collecteId",
                salaire_externe_existe as "salaireExterneExiste", salaire_externe_montant as "salaireExterneMontant",
                loyers_percus_existe as "loyersPercusExiste", loyers_percus_montant as "loyersPercusMontant",
                activite_secondaire_existe as "activiteSecondaireExiste", activite_secondaire_montant as "activiteSecondaireMontant",
                autres_revenus_existe as "autresRevenusExiste", autres_revenus_montant as "autresRevenusMontant"
            FROM collecte_autre_revenu
            WHERE collecte_id = :collecteId
            """;

    // ==================== BIEN PERSONNEL (Section 9) ====================

    public static final String UPSERT_BIEN_PERSONNEL = """
            INSERT INTO collecte_bien_personnel (collecte_id,
                terrain_existe, terrain_valeur,
                maison_existe, maison_valeur,
                vehicule_existe, vehicule_valeur,
                moto_existe, moto_valeur,
                autre_bien_existe, autre_bien_valeur)
            VALUES (:collecteId,
                :terrainExiste, :terrainValeur,
                :maisonExiste, :maisonValeur,
                :vehiculeExiste, :vehiculeValeur,
                :motoExiste, :motoValeur,
                :autreBienExiste, :autreBienValeur)
            ON CONFLICT (collecte_id) DO UPDATE SET
                terrain_existe = EXCLUDED.terrain_existe, terrain_valeur = EXCLUDED.terrain_valeur,
                maison_existe = EXCLUDED.maison_existe, maison_valeur = EXCLUDED.maison_valeur,
                vehicule_existe = EXCLUDED.vehicule_existe, vehicule_valeur = EXCLUDED.vehicule_valeur,
                moto_existe = EXCLUDED.moto_existe, moto_valeur = EXCLUDED.moto_valeur,
                autre_bien_existe = EXCLUDED.autre_bien_existe, autre_bien_valeur = EXCLUDED.autre_bien_valeur
            RETURNING bien_perso_id
            """;

    public static final String SELECT_BIEN_PERSONNEL_BY_COLLECTE = """
            SELECT bien_perso_id as "bienPersoId", collecte_id as "collecteId",
                terrain_existe as "terrainExiste", terrain_valeur as "terrainValeur",
                maison_existe as "maisonExiste", maison_valeur as "maisonValeur",
                vehicule_existe as "vehiculeExiste", vehicule_valeur as "vehiculeValeur",
                moto_existe as "motoExiste", moto_valeur as "motoValeur",
                autre_bien_existe as "autreBienExiste", autre_bien_valeur as "autreBienValeur"
            FROM collecte_bien_personnel
            WHERE collecte_id = :collecteId
            """;

    // ==================== AMORTISSEMENT ====================

    public static final String INSERT_AMORTISSEMENT = """
            INSERT INTO collecte_amortissement (collecte_id, ordre, nature_immobilisation, type_immobilisation,
                date_acquisition, duree_amortissement_mois, valeur_acquisition)
            VALUES (:collecteId, :ordre, :natureImmobilisation, :typeImmobilisation,
                :dateAcquisition, :dureeAmortissementMois, :valeurAcquisition)
            RETURNING amortissement_id
            """;

    public static final String UPDATE_AMORTISSEMENT = """
            UPDATE collecte_amortissement
            SET ordre = :ordre, nature_immobilisation = :natureImmobilisation,
                type_immobilisation = :typeImmobilisation, date_acquisition = :dateAcquisition,
                duree_amortissement_mois = :dureeAmortissementMois, valeur_acquisition = :valeurAcquisition
            WHERE amortissement_id = :amortissementId
            """;

    public static final String DELETE_AMORTISSEMENT = """
            DELETE FROM collecte_amortissement WHERE amortissement_id = :amortissementId
            """;

    public static final String SELECT_AMORTISSEMENTS_BY_COLLECTE = """
            SELECT amortissement_id as "amortissementId", collecte_id as "collecteId",
                ordre, nature_immobilisation as "natureImmobilisation",
                type_immobilisation as "typeImmobilisation", date_acquisition as "dateAcquisition",
                duree_amortissement_mois as "dureeAmortissementMois", valeur_acquisition as "valeurAcquisition",
                amortissement_mensuel as "amortissementMensuel", amortissement_cumule as "amortissementCumule",
                valeur_nette_comptable as "valeurNetteComptable", statut_amortissement as "statutAmortissement"
            FROM collecte_amortissement
            WHERE collecte_id = :collecteId
            ORDER BY ordre
            """;

    public static final String RECALCULER_AMORTISSEMENTS = """
            SELECT fn_calculer_amortissements(:collecteId)
            """;

    // ==================== CONDITION CREDIT (Section 2) ====================

    public static final String UPSERT_CONDITION_CREDIT = """
            INSERT INTO collecte_condition_credit (collecte_id, capacite_remboursement_declaree)
            VALUES (:collecteId, :capaciteRemboursementDeclaree)
            ON CONFLICT (collecte_id) DO UPDATE SET
                capacite_remboursement_declaree = EXCLUDED.capacite_remboursement_declaree
            RETURNING condition_credit_id
            """;

    public static final String SELECT_CONDITION_CREDIT_BY_COLLECTE = """
            SELECT condition_credit_id as "conditionCreditId", collecte_id as "collecteId",
                capacite_remboursement_declaree as "capaciteRemboursementDeclaree"
            FROM collecte_condition_credit
            WHERE collecte_id = :collecteId
            """;

    // ==================== AUTO-REMPLIR (lecture groupee pour calcul analyse) ====================

    public static final String SELECT_COLLECTE_FOR_AUTO_REMPLIR = """
            SELECT
                -- Actif/Passif
                COALESCE(ap.terrain_valeur, 0) AS "terrainValeur",
                COALESCE(ap.caution_financiere_valeur, 0) AS "cautionFinanciereValeur",
                COALESCE(ap.pret_employe_valeur, 0) AS "pretEmployeValeur",
                COALESCE(ap.stock_evaluer_detail, false) AS "stockEvaluerDetail",
                COALESCE(ap.stock_valeur_estimee, 0) AS "stockValeurEstimee",
                COALESCE(ap.creance_moins_3_mois, 0) AS "creanceMoins3Mois",
                COALESCE(ap.creance_plus_3_mois, 0) AS "creancePlus3Mois",
                COALESCE(ap.cash_valeur, 0) AS "cashValeur",
                COALESCE(ap.compte_crg_valeur, 0) AS "compteCrgValeur",
                COALESCE(ap.tontinier_valeur, 0) AS "tontinierValeur",
                COALESCE(ap.compte_banque_valeur, 0) AS "compteBanqueValeur",
                COALESCE(ap.emprunt_bancaire_lt_valeur, 0) AS "empruntBancaireLtValeur",
                COALESCE(ap.emprunt_bancaire_ct_valeur, 0) AS "empruntBancaireCtValeur",
                COALESCE(ap.avance_client_valeur, 0) AS "avanceClientValeur",
                COALESCE(ap.dette_fournisseur_valeur, 0) AS "detteFournisseurValeur",
                COALESCE(ap.impot_non_paye_valeur, 0) AS "impotNonPayeValeur",
                COALESCE(ap.loyer_non_paye_valeur, 0) AS "loyerNonPayeValeur",
                COALESCE(ap.facture_non_payee_valeur, 0) AS "factureNonPayeeValeur",
                COALESCE(ap.tontine_dette_valeur, 0) AS "tontineDetteValeur",
                COALESCE(ap.autre_dette_valeur, 0) AS "autreDetteValeur",
                COALESCE(ap.credit_fournisseur_valeur, 0) AS "creditFournisseurValeur",
                -- Chiffre d'affaires
                COALESCE(ca.ca_mensuel_calcule, 0) AS "caMensuelCalcule",
                COALESCE(ca.ca_mensuel_declare, 0) AS "caMensuelDeclare",
                COALESCE(ca.ca_jour_fort, 0) AS "caJourFort",
                COALESCE(ca.ca_jour_moyen, 0) AS "caJourMoyen",
                COALESCE(ca.ca_jour_faible, 0) AS "caJourFaible",
                -- Marge brute
                COALESCE(mb.connait_taux_marge, false) AS "connaitTauxMarge",
                COALESCE(mb.taux_marge_declare, 0) AS "tauxMargeDeclare",
                COALESCE(mb.calculer_taux_marge, false) AS "calculerTauxMarge",
                COALESCE(mb.taux_marge_calcule, 0) AS "tauxMargeCalcule",
                -- Charges entreprise
                COALESCE(ce.salaire_montant, 0) AS "salaireMontant",
                COALESCE(ce.loyer_montant, 0) AS "loyerMontant",
                COALESCE(ce.fourniture_montant, 0) AS "fournitureMontant",
                COALESCE(ce.publicite_montant, 0) AS "publiciteMontant",
                COALESCE(ce.telephone_montant, 0) AS "telephoneMontant",
                COALESCE(ce.electricite_montant, 0) AS "electriciteMontant",
                COALESCE(ce.eau_montant, 0) AS "eauMontant",
                COALESCE(ce.transport_achat_montant, 0) AS "transportAchatMontant",
                COALESCE(ce.transport_vente_montant, 0) AS "transportVenteMontant",
                COALESCE(ce.transport_divers_montant, 0) AS "transportDiversMontant",
                COALESCE(ce.entretien_montant, 0) AS "entretienMontant",
                COALESCE(ce.carburant_montant, 0) AS "carburantMontant",
                COALESCE(ce.assurance_montant, 0) AS "assuranceMontant",
                COALESCE(ce.frais_bancaires_montant, 0) AS "fraisBancairesMontant",
                COALESCE(ce.interets_emprunts_montant, 0) AS "interetsEmpruntsMontant",
                COALESCE(ce.impots_taxes_montant, 0) AS "impotsTaxesMontant",
                COALESCE(ce.honoraires_montant, 0) AS "honorairesMontant",
                COALESCE(ce.provisions_montant, 0) AS "provisionsMontant",
                COALESCE(ce.echeance_autre_credit_montant, 0) AS "echeanceAutreCreditMontant",
                COALESCE(ce.autres_charges_montant, 0) AS "autresChargesMontant",
                -- Charges personnelles
                COALESCE(cp.salaire_fixe, false) AS "salaireFixe",
                COALESCE(cp.salaire_montant, 0) AS "salairePersoMontant",
                COALESCE(cp.depenses_prelevees_activite, false) AS "depensesPreleveesActivite",
                COALESCE(cp.alimentation_montant, 0) AS "alimentationMontant",
                COALESCE(cp.loyer_residence_montant, 0) AS "loyerResidenceMontant",
                COALESCE(cp.transport_prive_montant, 0) AS "transportPriveMontant",
                COALESCE(cp.electricite_eau_comm_montant, 0) AS "electriciteEauCommMontant",
                COALESCE(cp.habillement_montant, 0) AS "habillementMontant",
                COALESCE(cp.frais_medicaux_montant, 0) AS "fraisMedicauxMontant",
                COALESCE(cp.echeance_credit_perso_montant, 0) AS "echeanceCreditPersoMontant",
                COALESCE(cp.scolarite_montant, 0) AS "scolariteMontant",
                COALESCE(cp.travaux_construction_montant, 0) AS "travauxConstructionMontant",
                COALESCE(cp.autres_charges_perso_montant, 0) AS "autresChargesPersoMontant",
                -- Autres revenus
                COALESCE(ar.salaire_externe_montant, 0) AS "salaireExterneMontant",
                COALESCE(ar.loyers_percus_montant, 0) AS "loyersPercusMontant",
                COALESCE(ar.activite_secondaire_montant, 0) AS "activiteSecondaireMontant",
                COALESCE(ar.autres_revenus_montant, 0) AS "autresRevenusMontant",
                -- Stock articles total
                COALESCE((SELECT SUM(sa.valeur_stock) FROM collecte_stock_article sa
                          WHERE sa.collecte_id = :collecteId), 0) AS "totalStockArticles",
                -- Amortissements VNC par type
                COALESCE((SELECT SUM(a.valeur_nette_comptable) FROM collecte_amortissement a
                          WHERE a.collecte_id = :collecteId AND a.type_immobilisation = 'Batiments et magasin'), 0) AS "vncBatiments",
                COALESCE((SELECT SUM(a.valeur_nette_comptable) FROM collecte_amortissement a
                          WHERE a.collecte_id = :collecteId AND a.type_immobilisation = 'Installations et agencements'), 0) AS "vncInstallations",
                COALESCE((SELECT SUM(a.valeur_nette_comptable) FROM collecte_amortissement a
                          WHERE a.collecte_id = :collecteId AND a.type_immobilisation = 'Materiels industriels'), 0) AS "vncMaterielsIndustriels",
                COALESCE((SELECT SUM(a.valeur_nette_comptable) FROM collecte_amortissement a
                          WHERE a.collecte_id = :collecteId AND a.type_immobilisation = 'Mobilier de bureau'), 0) AS "vncMobilier",
                COALESCE((SELECT SUM(a.valeur_nette_comptable) FROM collecte_amortissement a
                          WHERE a.collecte_id = :collecteId AND a.type_immobilisation = 'Materiel informatique'), 0) AS "vncInformatique",
                COALESCE((SELECT SUM(a.valeur_nette_comptable) FROM collecte_amortissement a
                          WHERE a.collecte_id = :collecteId AND a.type_immobilisation = 'Materiel de transport'), 0) AS "vncTransport",
                -- Amortissement mensuel total (en cours seulement)
                COALESCE((SELECT SUM(a.amortissement_mensuel) FROM collecte_amortissement a
                          WHERE a.collecte_id = :collecteId AND a.statut_amortissement = 'En cours'), 0) AS "totalAmortMensuelEnCours"
            FROM collecte_donnees cd
            LEFT JOIN collecte_actif_passif ap ON ap.collecte_id = cd.collecte_id
            LEFT JOIN collecte_chiffre_affaires ca ON ca.collecte_id = cd.collecte_id
            LEFT JOIN collecte_marge_brute mb ON mb.collecte_id = cd.collecte_id
            LEFT JOIN collecte_charge_entreprise ce ON ce.collecte_id = cd.collecte_id
            LEFT JOIN collecte_charge_personnelle cp ON cp.collecte_id = cd.collecte_id
            LEFT JOIN collecte_autre_revenu ar ON ar.collecte_id = cd.collecte_id
            WHERE cd.collecte_id = :collecteId
            """;

    // ==================== COMPLETION ====================

    public static final String UPDATE_POURCENTAGE_COMPLETION = """
            UPDATE collecte_donnees
            SET pourcentage_completion = (
                (CASE WHEN activite_description IS NOT NULL THEN 10 ELSE 0 END) +
                (CASE WHEN EXISTS(SELECT 1 FROM collecte_chiffre_affaires WHERE collecte_id = :collecteId) THEN 15 ELSE 0 END) +
                (CASE WHEN EXISTS(SELECT 1 FROM collecte_marge_brute WHERE collecte_id = :collecteId) THEN 15 ELSE 0 END) +
                (CASE WHEN EXISTS(SELECT 1 FROM collecte_actif_passif WHERE collecte_id = :collecteId) THEN 20 ELSE 0 END) +
                (CASE WHEN EXISTS(SELECT 1 FROM collecte_charge_entreprise WHERE collecte_id = :collecteId) THEN 15 ELSE 0 END) +
                (CASE WHEN EXISTS(SELECT 1 FROM collecte_charge_personnelle WHERE collecte_id = :collecteId) THEN 10 ELSE 0 END) +
                (CASE WHEN EXISTS(SELECT 1 FROM collecte_autre_revenu WHERE collecte_id = :collecteId) THEN 10 ELSE 0 END) +
                (CASE WHEN EXISTS(SELECT 1 FROM collecte_bien_personnel WHERE collecte_id = :collecteId) THEN 5 ELSE 0 END)
            ),
            statut = CASE
                WHEN pourcentage_completion >= 100 THEN 'COMPLET'
                ELSE 'BROUILLON'
            END
            WHERE collecte_id = :collecteId
            """;
}
