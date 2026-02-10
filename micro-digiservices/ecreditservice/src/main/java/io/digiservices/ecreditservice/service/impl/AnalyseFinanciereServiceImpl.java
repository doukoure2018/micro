package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.AnalyseFinanciereRepository;
import io.digiservices.ecreditservice.repository.CollecteDonneesRepository;
import io.digiservices.ecreditservice.service.AnalyseFinanciereService;
import io.digiservices.ecreditservice.validation.AnalyseFinanciereValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyseFinanciereServiceImpl implements AnalyseFinanciereService {

    private final AnalyseFinanciereRepository repository;
    private final CollecteDonneesRepository collecteRepository;

    // ==================== ANALYSE ====================

    @Override
    @Transactional
    public AnalyseFinanciereDto createAnalyse(CreateAnalyseRequest request,
                                               String codUsuario, String nomAnalyste) {
        AnalyseFinanciereValidator.validateCreateAnalyseRequest(request);

        if (repository.demandeHasAnalyse(request.getDemandeindividuelId())) {
            throw new ApiException("Une analyse existe deja pour cette demande");
        }

        Long analyseId = repository.createAnalyse(request, codUsuario, nomAnalyste);
        log.info("Created analyse financiere with ID: {} for demande: {}",
                analyseId, request.getDemandeindividuelId());

        return repository.getAnalyseById(analyseId);
    }

    @Override
    public AnalyseFinanciereDto getAnalyseById(Long analyseId) {
        return repository.getAnalyseById(analyseId);
    }

    @Override
    public AnalyseFinanciereDto getAnalyseByDemandeId(Long demandeindividuelId) {
        return repository.getAnalyseByDemandeId(demandeindividuelId);
    }

    @Override
    @Transactional
    public AnalyseFinanciereDto updateAnalyse(Long analyseId, AnalyseFinanciereDto dto) {
        if (!repository.analyseExists(analyseId)) {
            throw new ApiException("Analyse non trouvee avec ID: " + analyseId);
        }

        repository.updateAnalyse(analyseId, dto);
        log.info("Updated analyse financiere with ID: {}", analyseId);

        return repository.getAnalyseById(analyseId);
    }

    @Override
    @Transactional
    public void deleteAnalyse(Long analyseId) {
        if (!repository.analyseExists(analyseId)) {
            throw new ApiException("Analyse non trouvee avec ID: " + analyseId);
        }

        repository.deleteAnalyse(analyseId);
        log.info("Deleted analyse financiere with ID: {}", analyseId);
    }

    // ==================== BILAN ====================

    @Override
    @Transactional
    public AnalyseBilanDto createBilan(CreateBilanRequest request) {
        AnalyseFinanciereValidator.validateCreateBilanRequest(request);

        if (!repository.analyseExists(request.getAnalyseId())) {
            throw new ApiException("Analyse non trouvee avec ID: " + request.getAnalyseId());
        }

        Long bilanId = repository.createBilan(request);
        log.info("Created bilan with ID: {} for analyse: {}", bilanId, request.getAnalyseId());

        return repository.getBilanByPeriode(request.getAnalyseId(), request.getTypePeriode());
    }

    @Override
    public List<AnalyseBilanDto> getBilansByAnalyse(Long analyseId) {
        return repository.getBilansByAnalyse(analyseId);
    }

    @Override
    public AnalyseBilanDto getBilanByPeriode(Long analyseId, String typePeriode) {
        return repository.getBilanByPeriode(analyseId, typePeriode);
    }

    @Override
    @Transactional
    public AnalyseBilanDto updateBilan(Long bilanId, AnalyseBilanDto dto) {
        if (!repository.bilanExists(bilanId)) {
            throw new ApiException("Bilan non trouve avec ID: " + bilanId);
        }

        repository.updateBilan(bilanId, dto);
        log.info("Updated bilan with ID: {}", bilanId);

        return repository.getBilanByPeriode(dto.getAnalyseId(), dto.getTypePeriode());
    }

    // ==================== RENTABILITE ====================

    @Override
    @Transactional
    public AnalyseRentabiliteDto createRentabilite(CreateRentabiliteRequest request) {
        AnalyseFinanciereValidator.validateCreateRentabiliteRequest(request);

        if (!repository.analyseExists(request.getAnalyseId())) {
            throw new ApiException("Analyse non trouvee avec ID: " + request.getAnalyseId());
        }

        Long rentabiliteId = repository.createRentabilite(request);
        log.info("Created rentabilite with ID: {} for analyse: {}", rentabiliteId, request.getAnalyseId());

        return repository.getRentabiliteByPeriode(request.getAnalyseId(), request.getTypePeriode());
    }

    @Override
    public List<AnalyseRentabiliteDto> getRentabilitesByAnalyse(Long analyseId) {
        return repository.getRentabilitesByAnalyse(analyseId);
    }

    @Override
    public AnalyseRentabiliteDto getRentabiliteByPeriode(Long analyseId, String typePeriode) {
        return repository.getRentabiliteByPeriode(analyseId, typePeriode);
    }

    @Override
    @Transactional
    public AnalyseRentabiliteDto updateRentabilite(Long rentabiliteId, AnalyseRentabiliteDto dto) {
        if (!repository.rentabiliteExists(rentabiliteId)) {
            throw new ApiException("Rentabilite non trouvee avec ID: " + rentabiliteId);
        }

        repository.updateRentabilite(rentabiliteId, dto);
        log.info("Updated rentabilite with ID: {}", rentabiliteId);

        return repository.getRentabiliteByPeriode(dto.getAnalyseId(), dto.getTypePeriode());
    }

    // ==================== BESOIN CREDIT ====================

    @Override
    @Transactional
    public AnalyseBesoinCreditDto createBesoinCredit(CreateBesoinCreditRequest request) {
        if (request.getAnalyseId() == null) {
            throw new ApiException("L'ID de l'analyse est obligatoire");
        }

        if (!repository.analyseExists(request.getAnalyseId())) {
            throw new ApiException("Analyse non trouvee avec ID: " + request.getAnalyseId());
        }

        // Check if besoin credit already exists for this analyse (UPSERT logic)
        AnalyseBesoinCreditDto existing = repository.getBesoinCreditByAnalyse(request.getAnalyseId());
        if (existing != null) {
            // Update existing besoin credit
            AnalyseBesoinCreditDto dto = mapRequestToDto(request);
            repository.updateBesoinCredit(request.getAnalyseId(), dto);
            log.info("Updated existing besoin credit for analyse: {}", request.getAnalyseId());
        } else {
            // Create new besoin credit
            Long besoinCreditId = repository.createBesoinCredit(request);
            log.info("Created besoin credit with ID: {} for analyse: {}", besoinCreditId, request.getAnalyseId());
        }

        return repository.getBesoinCreditByAnalyse(request.getAnalyseId());
    }

    private AnalyseBesoinCreditDto mapRequestToDto(CreateBesoinCreditRequest request) {
        return AnalyseBesoinCreditDto.builder()
                .analyseId(request.getAnalyseId())
                .coutEquipement(request.getCoutEquipement())
                .depensesRattachees(request.getDepensesRattachees())
                .apportPersonnel(request.getApportPersonnel())
                .ajustCoutEquipement(request.getAjustCoutEquipement())
                .ajustDepensesRattachees(request.getAjustDepensesRattachees())
                .ajustApportPersonnel(request.getAjustApportPersonnel())
                .coutAchatCycle(request.getCoutAchatCycle())
                .nbreCycleFinancer(request.getNbreCycleFinancer())
                .tresorerieDisponible(request.getTresorerieDisponible())
                .stockActuel(request.getStockActuel())
                .comptesRecevoir(request.getComptesRecevoir())
                .dettesFournisseurs(request.getDettesFournisseurs())
                .creditFournisseur(request.getCreditFournisseur())
                .ajustCoutAchatCycle(request.getAjustCoutAchatCycle())
                .ajustTresorerieDispo(request.getAjustTresorerieDispo())
                .ajustStockActuel(request.getAjustStockActuel())
                .ajustComptesRecevoir(request.getAjustComptesRecevoir())
                .ajustDettesFournisseurs(request.getAjustDettesFournisseurs())
                .ajustCreditFournisseur(request.getAjustCreditFournisseur())
                .build();
    }

    @Override
    public AnalyseBesoinCreditDto getBesoinCreditByAnalyse(Long analyseId) {
        return repository.getBesoinCreditByAnalyse(analyseId);
    }

    @Override
    @Transactional
    public AnalyseBesoinCreditDto updateBesoinCredit(Long analyseId, AnalyseBesoinCreditDto dto) {
        if (!repository.analyseExists(analyseId)) {
            throw new ApiException("Analyse non trouvee avec ID: " + analyseId);
        }

        repository.updateBesoinCredit(analyseId, dto);
        log.info("Updated besoin credit for analyse: {}", analyseId);

        return repository.getBesoinCreditByAnalyse(analyseId);
    }

    // ==================== PROPOSITION ====================

    @Override
    @Transactional
    public PropositionDto updateProposition(Long demandeindividuelId, PropositionDto dto) {
        AnalyseFinanciereValidator.validatePeriodicite(dto.getPeriodiciteProposee());

        repository.updateProposition(demandeindividuelId, dto);
        log.info("Updated proposition for demande: {}", demandeindividuelId);

        return repository.getProposition(demandeindividuelId);
    }

    @Override
    public PropositionDto getProposition(Long demandeindividuelId) {
        return repository.getProposition(demandeindividuelId);
    }

    @Override
    @Transactional
    public void deleteProposition(Long demandeindividuelId) {
        repository.deleteProposition(demandeindividuelId);
        log.info("Deleted proposition for demande: {}", demandeindividuelId);
    }

    // ==================== RATIOS ====================

    @Override
    @Transactional
    public AnalyseRatiosDto calculateRatios(Long analyseId) {
        if (!repository.analyseExists(analyseId)) {
            throw new ApiException("Analyse non trouvee avec ID: " + analyseId);
        }

        AnalyseRatiosDto ratios = repository.calculateRatios(analyseId);

        if (ratios != null) {
            log.info("Calculated ratios for analyse ID: {}, Sollicite conforme: {}, Propose conforme: {}",
                    analyseId, ratios.getTousRatiosConformesSollicite(), ratios.getTousRatiosConformesPropose());
        } else {
            log.warn("Ratios calculation returned null for analyse ID: {}", analyseId);
        }

        return ratios;
    }

    @Override
    public AnalyseRatiosDto getRatiosByAnalyse(Long analyseId) {
        return repository.getRatiosByAnalyse(analyseId);
    }

    // ==================== SYNTHESE ====================

    @Override
    public AnalyseSyntheseDto getSyntheseByAnalyse(Long analyseId) {
        return repository.getSyntheseByAnalyse(analyseId);
    }

    @Override
    public AnalyseSyntheseDto getSyntheseByDemande(Long demandeindividuelId) {
        return repository.getSyntheseByDemande(demandeindividuelId);
    }

    // ==================== PERSONNES CAUTION ====================

    @Override
    public List<Personnecaution> getPersonnesCautionByDemande(Long demandeindividuelId) {
        return repository.getPersonnesCautionByDemande(demandeindividuelId);
    }

    // ==================== UTILITY ====================

    @Override
    public byte[] exportPdf(Long analyseId) {
        // PDF export not implemented - placeholder
        log.warn("PDF export not yet implemented for analyse: {}", analyseId);
        throw new ApiException("Export PDF non encore implemente");
    }

    @Override
    public List<ParametresCycleDto> getParametresCycles() {
        return List.of(
                new ParametresCycleDto("Mensuelle", 1),
                new ParametresCycleDto("Bimestrielle", 2),
                new ParametresCycleDto("Trimestrielle", 3),
                new ParametresCycleDto("Quadrimestrielle", 4),
                new ParametresCycleDto("Semestrielle", 6),
                new ParametresCycleDto("Annuelle", 12),
                new ParametresCycleDto("Unique", 1)
        );
    }

    @Override
    public List<NormesRatiosDto> getNormesRatios() {
        return List.of(
                new NormesRatiosDto("R1", "Capacite de remboursement", ">=", 2.0, "200%"),
                new NormesRatiosDto("R2", "Solvabilite", ">=", 0.35, "35%"),
                new NormesRatiosDto("R3", "Liquidite a echeance", ">=", 1.0, "100%"),
                new NormesRatiosDto("R4", "Endettement", "<", 0.5, "50%"),
                new NormesRatiosDto("R5", "Dependance", "<", 0.5, "50%"),
                new NormesRatiosDto("R6", "Couverture garantie", ">", 1.5, "150%")
        );
    }

    // ==================== SOUMISSION ====================

    @Override
    @Transactional
    public SoumissionResultDto soumettreAnalyse(SoumissionRequest request, String codUsuario, String nomAnalyste) {
        if (request.getAnalyseId() == null) {
            throw new ApiException("L'ID de l'analyse est obligatoire");
        }

        if (!repository.analyseExists(request.getAnalyseId())) {
            throw new ApiException("Analyse non trouvee avec ID: " + request.getAnalyseId());
        }

        // Appeler la nouvelle méthode avec les personnes caution
        SoumissionResultDto result = repository.soumettreAnalyse(
                request.getAnalyseId(),
                codUsuario,
                nomAnalyste,
                request.getForcerSoumission(),
                request.getPersonnesCaution()
        );

        if (result.getSucces()) {
            int nbCautions = request.getPersonnesCaution() != null ? request.getPersonnesCaution().size() : 0;
            log.info("Analyse {} soumise avec succes par {} avec {} personne(s) caution",
                    request.getAnalyseId(), nomAnalyste, nbCautions);
        } else {
            log.warn("Echec de la soumission de l'analyse {}: {} erreurs",
                    request.getAnalyseId(), result.getNombreErreurs());
        }

        return result;
    }

    // ==================== AUTO-REMPLIR DEPUIS COLLECTE ====================

    @Override
    public AutoRemplirResultDto autoRemplirDepuisCollecte(Long analyseId, Long collecteId) {
        // 1. Read analyse header for facteurCycle
        AnalyseFinanciereDto analyse = repository.getAnalyseById(analyseId);
        if (analyse == null) {
            throw new ApiException("Analyse non trouvee avec ID: " + analyseId);
        }
        int facteur = analyse.getFacteurCycle() != null ? analyse.getFacteurCycle() : 1;
        BigDecimal f = BigDecimal.valueOf(facteur);

        // 2. Read all collecte data in one query
        Map<String, Object> data = collecteRepository.getCollecteForAutoRemplir(collecteId);

        // 3. Compute BILAN N values
        BigDecimal terrain = bd(data.get("terrainValeur"));
        BigDecimal batimentMagasin = bd(data.get("vncBatiments"));
        BigDecimal installationAgencement = bd(data.get("vncInstallations"));
        BigDecimal materielIndustriel = bd(data.get("vncMaterielsIndustriels"));
        BigDecimal mobilierBureau = bd(data.get("vncMobilier"));
        BigDecimal materielInformatique = bd(data.get("vncInformatique"));
        BigDecimal materielTransport = bd(data.get("vncTransport"));
        BigDecimal autreImmobilisation = bd(data.get("cautionFinanciereValeur")).add(bd(data.get("pretEmployeValeur")));

        // Stocks: use detailed evaluation if enabled, otherwise estimated value
        boolean stockEvaluerDetail = boolVal(data.get("stockEvaluerDetail"));
        BigDecimal stocks = stockEvaluerDetail
                ? bd(data.get("totalStockArticles"))
                : bd(data.get("stockValeurEstimee"));

        BigDecimal creancesClients = bd(data.get("creanceMoins3Mois")).add(bd(data.get("creancePlus3Mois")));
        BigDecimal tresorerieCaisseBanque = bd(data.get("cashValeur"))
                .add(bd(data.get("compteCrgValeur")))
                .add(bd(data.get("tontinierValeur")))
                .add(bd(data.get("compteBanqueValeur")));

        BigDecimal empruntLongTerme = bd(data.get("empruntBancaireLtValeur"));
        BigDecimal empruntCourtTerme = bd(data.get("empruntBancaireCtValeur"));
        BigDecimal autresDettes = bd(data.get("avanceClientValeur"))
                .add(bd(data.get("detteFournisseurValeur")))
                .add(bd(data.get("impotNonPayeValeur")))
                .add(bd(data.get("loyerNonPayeValeur")))
                .add(bd(data.get("factureNonPayeeValeur")))
                .add(bd(data.get("tontineDetteValeur")))
                .add(bd(data.get("autreDetteValeur")));

        // Total immobilisations
        BigDecimal totalImmobilisations = terrain.add(batimentMagasin).add(installationAgencement)
                .add(materielIndustriel).add(mobilierBureau).add(materielInformatique)
                .add(materielTransport).add(autreImmobilisation);

        // Total Bilan = Immobilisations + Stocks + Creances + Tresorerie
        BigDecimal totalBilan = totalImmobilisations.add(stocks).add(creancesClients).add(tresorerieCaisseBanque);

        // Capitaux propres = Total Bilan - Total Dettes
        BigDecimal totalDettes = empruntLongTerme.add(empruntCourtTerme).add(autresDettes);
        BigDecimal capitauxPropre = totalBilan.subtract(totalDettes);

        // 4. Compute RENTABILITE N values
        BigDecimal caMensuel = bd(data.get("caMensuelCalcule"));
        if (caMensuel.compareTo(BigDecimal.ZERO) == 0) {
            caMensuel = bd(data.get("caMensuelDeclare"));
        }
        BigDecimal chiffreAffaires = caMensuel.multiply(f);

        // Taux marge: use declared if known, otherwise calculated
        boolean connaitTauxMarge = boolVal(data.get("connaitTauxMarge"));
        BigDecimal tauxMarge;
        if (connaitTauxMarge) {
            tauxMarge = bd(data.get("tauxMargeDeclare"));
        } else {
            tauxMarge = bd(data.get("tauxMargeCalcule"));
        }
        // Override with analyse header if set
        if (analyse.getTauxMargeRetenu() != null && analyse.getTauxMargeRetenu().compareTo(BigDecimal.ZERO) > 0) {
            tauxMarge = analyse.getTauxMargeRetenu();
        }

        BigDecimal margeBrute = chiffreAffaires.multiply(tauxMarge).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal coutAchatMarchandises = chiffreAffaires.subtract(margeBrute);

        // Charges (all monthly * facteur)
        BigDecimal salaires = bd(data.get("salaireMontant")).multiply(f);
        BigDecimal loyers = bd(data.get("loyerMontant")).multiply(f);
        BigDecimal transportCharge = bd(data.get("transportAchatMontant"))
                .add(bd(data.get("transportVenteMontant")))
                .add(bd(data.get("transportDiversMontant")))
                .multiply(f);
        BigDecimal electriciteEauTelephone = bd(data.get("telephoneMontant"))
                .add(bd(data.get("electriciteMontant")))
                .add(bd(data.get("eauMontant")))
                .multiply(f);
        BigDecimal fournituresAutresBesoins = bd(data.get("fournitureMontant")).multiply(f);
        BigDecimal entretienReparation = bd(data.get("entretienMontant")).multiply(f);
        BigDecimal carburantLubrifiants = bd(data.get("carburantMontant")).multiply(f);
        BigDecimal publicitePromotion = bd(data.get("publiciteMontant")).multiply(f);
        BigDecimal impotsTaxes = bd(data.get("impotsTaxesMontant")).multiply(f);
        BigDecimal fraisBancairesInterets = bd(data.get("fraisBancairesMontant"))
                .add(bd(data.get("interetsEmpruntsMontant")))
                .multiply(f);
        BigDecimal echeanceAutreCredit = bd(data.get("echeanceAutreCreditMontant")).multiply(f);
        BigDecimal diversesCharges = bd(data.get("assuranceMontant"))
                .add(bd(data.get("honorairesMontant")))
                .add(bd(data.get("autresChargesMontant")))
                .multiply(f);

        // Prelevement entrepreneur (conditional logic)
        BigDecimal prelevementEntrepreneur;
        boolean depensesPrelevees = boolVal(data.get("depensesPreleveesActivite"));
        boolean salaireFixe = boolVal(data.get("salaireFixe"));
        if (depensesPrelevees) {
            prelevementEntrepreneur = bd(data.get("alimentationMontant"))
                    .add(bd(data.get("loyerResidenceMontant")))
                    .add(bd(data.get("transportPriveMontant")))
                    .add(bd(data.get("electriciteEauCommMontant")))
                    .add(bd(data.get("habillementMontant")))
                    .add(bd(data.get("fraisMedicauxMontant")))
                    .add(bd(data.get("echeanceCreditPersoMontant")))
                    .add(bd(data.get("scolariteMontant")))
                    .add(bd(data.get("travauxConstructionMontant")))
                    .add(bd(data.get("autresChargesPersoMontant")))
                    .multiply(f);
        } else if (salaireFixe) {
            prelevementEntrepreneur = bd(data.get("salairePersoMontant")).multiply(f);
        } else {
            prelevementEntrepreneur = BigDecimal.ZERO;
        }

        // Amortissements + Provisions
        BigDecimal amortissementsProvisions = bd(data.get("provisionsMontant"))
                .add(bd(data.get("totalAmortMensuelEnCours")))
                .multiply(f);

        // Autres revenus (NOT multiplied by facteur per Excel mapping)
        BigDecimal autresRevenusHorsActivite = bd(data.get("salaireExterneMontant"))
                .add(bd(data.get("loyersPercusMontant")))
                .add(bd(data.get("activiteSecondaireMontant")))
                .add(bd(data.get("autresRevenusMontant")));

        // 5. Compute BESOIN CREDIT values
        BigDecimal comptesRecevoir = bd(data.get("creanceMoins3Mois")); // only < 3 months
        BigDecimal creditFournisseur = bd(data.get("creditFournisseurValeur"));

        // 6. Build result
        return AutoRemplirResultDto.builder()
                // Bilan
                .terrain(terrain)
                .batimentMagasin(batimentMagasin)
                .installationAgencement(installationAgencement)
                .materielIndustriel(materielIndustriel)
                .mobilierBureau(mobilierBureau)
                .materielInformatique(materielInformatique)
                .materielTransport(materielTransport)
                .autreImmobilisation(autreImmobilisation)
                .stocks(stocks)
                .creancesClients(creancesClients)
                .tresorerieCaisseBanque(tresorerieCaisseBanque)
                .empruntLongTerme(empruntLongTerme)
                .empruntCourtTerme(empruntCourtTerme)
                .autresDettes(autresDettes)
                .capitauxPropre(capitauxPropre)
                // Rentabilite
                .chiffreAffaires(chiffreAffaires)
                .coutAchatMarchandises(coutAchatMarchandises)
                .margeBrute(margeBrute)
                .tauxMarge(tauxMarge)
                .salaires(salaires)
                .prelevementEntrepreneur(prelevementEntrepreneur)
                .loyers(loyers)
                .transport(transportCharge)
                .electriciteEauTelephone(electriciteEauTelephone)
                .fournituresAutresBesoins(fournituresAutresBesoins)
                .entretienReparation(entretienReparation)
                .carburantLubrifiants(carburantLubrifiants)
                .publicitePromotion(publicitePromotion)
                .impotsTaxes(impotsTaxes)
                .fraisBancairesInterets(fraisBancairesInterets)
                .echeanceAutreCredit(echeanceAutreCredit)
                .diversesCharges(diversesCharges)
                .amortissementsProvisions(amortissementsProvisions)
                .autresRevenusHorsActivite(autresRevenusHorsActivite)
                // Besoin credit
                .coutAchatCycle(coutAchatMarchandises)
                .tresorerieDisponible(tresorerieCaisseBanque)
                .stockActuel(stocks)
                .comptesRecevoir(comptesRecevoir)
                .dettesFournisseurs(autresDettes)
                .creditFournisseur(creditFournisseur)
                .build();
    }

    private BigDecimal bd(Object value) {
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof BigDecimal) return (BigDecimal) value;
        if (value instanceof Number) return BigDecimal.valueOf(((Number) value).doubleValue());
        return BigDecimal.ZERO;
    }

    private boolean boolVal(Object value) {
        if (value == null) return false;
        if (value instanceof Boolean) return (Boolean) value;
        return false;
    }
}
