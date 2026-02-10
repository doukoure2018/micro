package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.*;

import java.util.List;

public interface CollecteDonneesService {

    // Collecte (Header + Section 1)
    CollecteDonneesDto createCollecte(CreateCollecteRequest request, String codUsuario, String nomAgent);
    CollecteDonneesDto getCollecteComplete(Long collecteId);
    CollecteDonneesDto getCollecteByDemande(Long demandeindividuelId);
    CollecteDonneesDto updateSection1(Long collecteId, CreateCollecteRequest dto);
    void deleteCollecte(Long collecteId);

    // Sections
    CollecteDonneesDto updateSection2(Long collecteId, ConditionCreditDto dto);
    CollecteDonneesDto updateSection3(Long collecteId, ChiffreAffairesDto dto);
    CollecteDonneesDto updateSection4(Long collecteId, MargeBruteDto dto);
    CollecteDonneesDto updateSection5(Long collecteId, ActifPassifDto dto);
    CollecteDonneesDto updateSection6(Long collecteId, ChargeEntrepriseDto dto);
    CollecteDonneesDto updateSection7(Long collecteId, ChargePersonnelleDto dto);
    CollecteDonneesDto updateSection8(Long collecteId, AutreRevenuDto dto);
    CollecteDonneesDto updateSection9(Long collecteId, BienPersonnelDto dto);

    // Amortissements
    List<AmortissementDto> getAmortissements(Long collecteId);
    AmortissementDto addAmortissement(Long collecteId, AmortissementDto dto);
    AmortissementDto updateAmortissement(Long amortissementId, AmortissementDto dto);
    void deleteAmortissement(Long amortissementId);
    List<AmortissementDto> recalculerAmortissements(Long collecteId);
}
