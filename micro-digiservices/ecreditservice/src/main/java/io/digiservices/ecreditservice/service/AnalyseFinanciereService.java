package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.*;

import java.util.List;

public interface AnalyseFinanciereService {

    // Analyse (Header) - 5 endpoints
    AnalyseFinanciereDto createAnalyse(CreateAnalyseRequest request, String codUsuario, String nomAnalyste);
    AnalyseFinanciereDto getAnalyseById(Long analyseId);
    AnalyseFinanciereDto getAnalyseByDemandeId(Long demandeindividuelId);
    AnalyseFinanciereDto updateAnalyse(Long analyseId, AnalyseFinanciereDto dto);
    void deleteAnalyse(Long analyseId);

    // Bilan - 4 endpoints
    AnalyseBilanDto createBilan(CreateBilanRequest request);
    List<AnalyseBilanDto> getBilansByAnalyse(Long analyseId);
    AnalyseBilanDto getBilanByPeriode(Long analyseId, String typePeriode);
    AnalyseBilanDto updateBilan(Long bilanId, AnalyseBilanDto dto);

    // Rentabilite - 4 endpoints
    AnalyseRentabiliteDto createRentabilite(CreateRentabiliteRequest request);
    List<AnalyseRentabiliteDto> getRentabilitesByAnalyse(Long analyseId);
    AnalyseRentabiliteDto getRentabiliteByPeriode(Long analyseId, String typePeriode);
    AnalyseRentabiliteDto updateRentabilite(Long rentabiliteId, AnalyseRentabiliteDto dto);

    // Besoin Credit - 3 endpoints
    AnalyseBesoinCreditDto createBesoinCredit(CreateBesoinCreditRequest request);
    AnalyseBesoinCreditDto getBesoinCreditByAnalyse(Long analyseId);
    AnalyseBesoinCreditDto updateBesoinCredit(Long analyseId, AnalyseBesoinCreditDto dto);

    // Proposition - 3 endpoints
    PropositionDto updateProposition(Long demandeindividuelId, PropositionDto dto);
    PropositionDto getProposition(Long demandeindividuelId);
    void deleteProposition(Long demandeindividuelId);

    // Ratios - 2 endpoints
    AnalyseRatiosDto calculateRatios(Long analyseId);
    AnalyseRatiosDto getRatiosByAnalyse(Long analyseId);

    // Synthese - 2 endpoints
    AnalyseSyntheseDto getSyntheseByAnalyse(Long analyseId);
    AnalyseSyntheseDto getSyntheseByDemande(Long demandeindividuelId);

    // Utility - 3 endpoints
    byte[] exportPdf(Long analyseId);
    List<ParametresCycleDto> getParametresCycles();
    List<NormesRatiosDto> getNormesRatios();

    // Soumission - 1 endpoint
    SoumissionResultDto soumettreAnalyse(SoumissionRequest request, String codUsuario, String nomAnalyste);
}
