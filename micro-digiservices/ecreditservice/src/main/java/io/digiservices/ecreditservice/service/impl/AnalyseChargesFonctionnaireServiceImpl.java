package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.AnalyseChargesFonctionnaireDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.exception.ValidationException;
import io.digiservices.ecreditservice.repository.AnalyseChargesFonctionnaireRepository;
import io.digiservices.ecreditservice.repository.AnalyseChargesFonctionnaireRepository.ContexteFonctionnaire;
import io.digiservices.ecreditservice.service.AnalyseChargesFonctionnaireService;
import io.digiservices.ecreditservice.validation.CreditFonctionnaireValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyseChargesFonctionnaireServiceImpl implements AnalyseChargesFonctionnaireService {

    public static final String VERDICT_FINANCABLE = "FINANCABLE";
    public static final String VERDICT_NON_FINANCABLE = "NON_FINANCABLE";

    /**
     * États où l'AC instruit le dossier : seuls moments où l'analyse peut être (ré)écrite.
     * NOUVEAU = demande créée directement par l'AC (hors circuit accueil) ;
     * SELECTION = prise en charge après affectation ; CORRECTION = retour DA ;
     * RETOUR_AGENT = renvoi pour erreur de destination (dossier chez l'agent).
     * Après l'approbation AC (APPROVED et au-delà), l'analyse est figée au dossier.
     */
    private static final Set<String> ETATS_MODIFIABLES = Set.of("NOUVEAU", "SELECTION", "CORRECTION", "RETOUR_AGENT");

    private final AnalyseChargesFonctionnaireRepository repository;

    @Override
    public Optional<AnalyseChargesFonctionnaireDto> getByDemandeId(Long demandeId) {
        return repository.findByDemandeId(demandeId);
    }

    @Override
    @Transactional
    public AnalyseChargesFonctionnaireDto enregistrer(Long demandeId, AnalyseChargesFonctionnaireDto dto, String analysePar) {
        ContexteFonctionnaire ctx = repository.getContexte(demandeId);
        if (ctx == null) {
            throw new ApiException("Demande non trouvée");
        }
        if (!CreditFonctionnaireValidator.NATURE_FONCTIONNAIRE.equals(ctx.natureClient())) {
            throw new ValidationException("L'analyse des charges est réservée aux demandes de nature Fonctionnaire");
        }
        if (!ETATS_MODIFIABLES.contains(ctx.validationState())) {
            throw new ValidationException(
                    "L'analyse des charges ne peut plus être modifiée : le dossier n'est plus en instruction par l'agent de crédit");
        }
        if (ctx.salaireNetMensuel() == null || ctx.salaireNetMensuel().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Le salaire net de la demande fonctionnaire est manquant : corrigez la demande avant l'analyse");
        }

        // Salaire retenu = celui de la demande ; autres revenus retenus = saisie AC, sinon ceux déclarés
        BigDecimal salaire = ctx.salaireNetMensuel();
        BigDecimal autresRevenus = dto.getAutresRevenusRetenus() != null
                ? dto.getAutresRevenusRetenus()
                : (ctx.autresRevenus() != null ? ctx.autresRevenus() : BigDecimal.ZERO);
        if (autresRevenus.compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException("Les autres revenus ne peuvent pas être négatifs");
        }

        BigDecimal totalCharges = totalCharges(dto);
        BigDecimal quotite = CreditFonctionnaireValidator.quotiteCessible(salaire);
        BigDecimal capacite = CreditFonctionnaireValidator.capaciteResiduelle(salaire, autresRevenus, totalCharges);

        boolean financable = capacite.compareTo(BigDecimal.ZERO) >= 0
                && ctx.echeance() != null
                && ctx.echeance().compareTo(BigDecimal.ZERO) > 0
                && ctx.echeance().compareTo(quotite) <= 0;

        dto.setSalaireNetRetenu(salaire);
        dto.setAutresRevenusRetenus(autresRevenus);
        dto.setQuotiteCessible(quotite);
        dto.setCapaciteResiduelle(capacite);
        dto.setVerdict(financable ? VERDICT_FINANCABLE : VERDICT_NON_FINANCABLE);

        return repository.upsert(demandeId, dto, analysePar);
    }

    @Override
    public void verifierFinancableSiFonctionnaire(Long demandeId) {
        ContexteFonctionnaire ctx = repository.getContexte(demandeId);
        if (ctx == null || !CreditFonctionnaireValidator.NATURE_FONCTIONNAIRE.equals(ctx.natureClient())) {
            return;
        }

        if (!Boolean.TRUE.equals(ctx.domiciliationSalaire())) {
            throw new ValidationException(
                    "La domiciliation du salaire au CRG est obligatoire pour un crédit fonctionnaire");
        }
        if (!CreditFonctionnaireValidator.PERIODICITE_MENSUELLE.equalsIgnoreCase(ctx.periodiciteRemboursement())) {
            throw new ValidationException(
                    "La périodicité de remboursement d'un crédit fonctionnaire est obligatoirement mensuelle");
        }

        AnalyseChargesFonctionnaireDto analyse = repository.findByDemandeId(demandeId)
                .orElseThrow(() -> new ValidationException(
                        "L'analyse des charges & quotité doit être complétée avant de soumettre un crédit fonctionnaire"));

        // Recalcul complet (aucune confiance aux valeurs stockées ou au front)
        BigDecimal salaire = ctx.salaireNetMensuel();
        if (salaire == null || salaire.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Le salaire net de la demande fonctionnaire est manquant");
        }
        BigDecimal autresRevenus = analyse.getAutresRevenusRetenus() != null
                ? analyse.getAutresRevenusRetenus() : BigDecimal.ZERO;
        BigDecimal totalCharges = totalCharges(analyse);
        BigDecimal quotite = CreditFonctionnaireValidator.quotiteCessible(salaire);
        BigDecimal capacite = CreditFonctionnaireValidator.capaciteResiduelle(salaire, autresRevenus, totalCharges);

        if (ctx.echeance() == null || ctx.echeance().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("L'échéance mensuelle est obligatoire pour un crédit fonctionnaire");
        }
        if (ctx.echeance().compareTo(quotite) > 0) {
            throw new ValidationException(String.format(
                    "L'échéance (%s GNF) dépasse la quotité cessible : 35 %% du salaire net = %s GNF",
                    ctx.echeance().toPlainString(), quotite.toPlainString()));
        }
        if (capacite.compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException(String.format(
                    "Capacité résiduelle négative (%s GNF) : les charges dépassent 65 %% du salaire + autres revenus, le dossier n'est pas finançable",
                    capacite.toPlainString()));
        }
    }

    private static BigDecimal totalCharges(AnalyseChargesFonctionnaireDto dto) {
        return nvl(dto.getChargeLoyer())
                .add(nvl(dto.getChargeTransport()))
                .add(nvl(dto.getChargeNourriture()))
                .add(nvl(dto.getChargeVignette()))
                .add(nvl(dto.getChargeAssurance()))
                .add(nvl(dto.getChargeElectricite()))
                .add(nvl(dto.getChargeEau()))
                .add(nvl(dto.getChargeAssuranceMaladie()))
                .add(nvl(dto.getChargeScolarite()))
                .add(nvl(dto.getChargeCasSociaux()))
                .add(nvl(dto.getChargeAbonnementImage()))
                .add(nvl(dto.getChargeServiceSalubrite()));
    }

    private static BigDecimal nvl(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
