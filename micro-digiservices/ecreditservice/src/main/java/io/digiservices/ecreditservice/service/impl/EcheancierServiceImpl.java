package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.DemandeIndividuel;
import io.digiservices.ecreditservice.dto.EcheancierDto;
import io.digiservices.ecreditservice.service.DemandeIndService;
import io.digiservices.ecreditservice.service.EcheancierService;
import io.digiservices.ecreditservice.utils.EcheancierCalculateur;
import io.digiservices.ecreditservice.validation.CreditGroupeValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EcheancierServiceImpl implements EcheancierService {

    private final DemandeIndService demandeIndService;

    @Override
    public EcheancierDto simuler(BigDecimal montant, BigDecimal tauxMensuel, Integer dureeMois,
                                 Integer moratoireMois, Integer nombreEcheances, LocalDate dateOctroi) {
        return EcheancierCalculateur.calculer(montant, tauxMensuel, dureeMois, moratoireMois, nombreEcheances, dateOctroi);
    }

    @Override
    public EcheancierDto pourDemande(Long demandeId) {
        return pourDemande(demandeIndService.getDemandeWithGaranties(demandeId));
    }

    @Override
    public EcheancierDto pourDemande(DemandeIndividuel demande) {
        return EcheancierCalculateur.calculer(
                demande.getMontantDemande(),
                demande.getTauxInteret(),
                demande.getDureeDemande(),
                moratoireEffectif(demande.getDureeDemande(), demande.getPeriodeDiffere(), demande.getNombreEcheance()),
                demande.getNombreEcheance(),
                demande.getDateOctroiPrevue());
    }

    @Override
    public boolean estGroupeAgricole(DemandeIndividuel demande) {
        return CreditGroupeValidator.isGroupeAgricole(demande);
    }

    /**
     * Moratoire à retenir pour une demande : la valeur saisie si elle l'a été, sinon durée - N
     * (c'est la structure standard de SAF : les cuotas mensuelles sont placées en fin de durée).
     * Couvre les dossiers saisis avant la V147, où periode_differe valait toujours 0.
     */
    public static Integer moratoireEffectif(Integer dureeMois, Integer periodeDiffere, Integer nombreEcheances) {
        if (periodeDiffere != null && periodeDiffere > 0) {
            return periodeDiffere;
        }
        if (dureeMois != null && nombreEcheances != null && dureeMois > nombreEcheances) {
            return dureeMois - nombreEcheances;
        }
        return 0;
    }
}
