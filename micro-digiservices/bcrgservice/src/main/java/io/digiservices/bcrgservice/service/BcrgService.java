package io.digiservices.bcrgservice.service;

import io.digiservices.bcrgservice.dto.EncoursDto;
import io.digiservices.bcrgservice.dto.EngagementDto;
import io.digiservices.bcrgservice.dto.PageDto;
import io.digiservices.bcrgservice.dto.PersonneMoraleDto;
import io.digiservices.bcrgservice.dto.PersonnePhysiqueDto;

public interface BcrgService {

    PageDto<PersonnePhysiqueDto> getPersonnesPhysiques(int page, int size, boolean toutes);

    PersonnePhysiqueDto getPersonnePhysique(String idClient);

    /** PP V2 : personnes physiques à partir d'une liste d'identifiants internes. */
    java.util.List<PersonnePhysiqueDto> getPersonnesPhysiquesParIds(java.util.List<String> ids);

    /** PP V2 : personnes modifiées depuis leur déclaration à la BCRG (comparaison d'empreintes). */
    PageDto<PersonnePhysiqueDto> getPersonnesPhysiquesModifiees(int page, int size);

    /** Empreintes SHA-256 du contenu déclaré (stockées à la notification ; vide si SAF indisponible). */
    java.util.Map<String, String> calculerEmpreintesPersonnesPhysiques(java.util.List<String> references);

    PageDto<PersonneMoraleDto> getPersonnesMorales(int page, int size, boolean toutes);

    PersonneMoraleDto getPersonneMorale(String idClient);

    PageDto<EngagementDto> getEngagements(int page, int size, boolean toutes);

    /** v1.6 : référence composite {@code <codAgence>-<numCredito>} (cf. BcrgTranslator.refIntEng). */
    EngagementDto getEngagement(String refEng);

    /**
     * v1.6 : filtreDeclares (défaut) limite la photo aux engagements déjà notifiés
     * traités (module ENGAGEMENT) — un encours sur un engagement inconnu du SIC
     * est rejeté LOG008 par la plateforme.
     */
    PageDto<EncoursDto> getEncours(String periode, int page, int size, boolean filtreDeclares);
}
