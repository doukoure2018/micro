package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.*;

import java.util.List;

public interface AnalyseFinanciereRepository {

    // Analyse (Header)
    Long createAnalyse(CreateAnalyseRequest request, String codUsuario, String nomAnalyste);
    AnalyseFinanciereDto getAnalyseById(Long analyseId);
    AnalyseFinanciereDto getAnalyseByDemandeId(Long demandeindividuelId);
    void updateAnalyse(Long analyseId, AnalyseFinanciereDto dto);
    void deleteAnalyse(Long analyseId);
    boolean analyseExists(Long analyseId);
    boolean demandeHasAnalyse(Long demandeindividuelId);

    // Bilan
    Long createBilan(CreateBilanRequest request);
    List<AnalyseBilanDto> getBilansByAnalyse(Long analyseId);
    AnalyseBilanDto getBilanByPeriode(Long analyseId, String typePeriode);
    void updateBilan(Long bilanId, AnalyseBilanDto dto);
    boolean bilanExists(Long bilanId);

    // Rentabilite
    Long createRentabilite(CreateRentabiliteRequest request);
    List<AnalyseRentabiliteDto> getRentabilitesByAnalyse(Long analyseId);
    AnalyseRentabiliteDto getRentabiliteByPeriode(Long analyseId, String typePeriode);
    void updateRentabilite(Long rentabiliteId, AnalyseRentabiliteDto dto);
    boolean rentabiliteExists(Long rentabiliteId);

    // Besoin Credit
    Long createBesoinCredit(CreateBesoinCreditRequest request);
    AnalyseBesoinCreditDto getBesoinCreditByAnalyse(Long analyseId);
    void updateBesoinCredit(Long analyseId, AnalyseBesoinCreditDto dto);

    // Proposition
    void updateProposition(Long demandeindividuelId, PropositionDto dto);
    PropositionDto getProposition(Long demandeindividuelId);
    void deleteProposition(Long demandeindividuelId);

    // Ratios
    AnalyseRatiosDto calculateRatios(Long analyseId);
    AnalyseRatiosDto getRatiosByAnalyse(Long analyseId);

    // Synthese
    AnalyseSyntheseDto getSyntheseByAnalyse(Long analyseId);
    AnalyseSyntheseDto getSyntheseByDemande(Long demandeindividuelId);

    // Personnes Caution
    List<Personnecaution> getPersonnesCautionByDemande(Long demandeindividuelId);

    // Soumission
    SoumissionResultDto soumettreAnalyse(Long analyseId, String codUsuario, String nomAnalyste, Boolean forcerSoumission);

    // Soumission avec personnes caution
    SoumissionResultDto soumettreAnalyse(Long analyseId, String codUsuario, String nomAnalyste, Boolean forcerSoumission,
                                          List<SoumissionRequest.PersonneCautionInput> personnesCaution);
}
