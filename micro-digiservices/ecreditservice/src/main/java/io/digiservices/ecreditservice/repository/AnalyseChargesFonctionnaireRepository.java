package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.AnalyseChargesFonctionnaireDto;

import java.math.BigDecimal;
import java.util.Optional;

public interface AnalyseChargesFonctionnaireRepository {

    Optional<AnalyseChargesFonctionnaireDto> findByDemandeId(Long demandeId);

    AnalyseChargesFonctionnaireDto upsert(Long demandeId, AnalyseChargesFonctionnaireDto dto, String analysePar);

    /** Contexte financier de la demande (échéance, salaire, domiciliation...) — null si demande inconnue. */
    ContexteFonctionnaire getContexte(Long demandeId);

    record ContexteFonctionnaire(
            Long demandeindividuelId,
            String natureClient,
            BigDecimal echeance,
            String periodiciteRemboursement,
            BigDecimal salaireNetMensuel,
            BigDecimal autresRevenus,
            Boolean domiciliationSalaire) {
    }
}
