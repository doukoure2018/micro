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
     * États où l'analyse est FIGÉE au dossier : dès l'approbation AC (APPROVED) et sur
     * toute la chaîne de validation hiérarchique. Logique inversée volontairement :
     * tout autre état (NOUVEAU, SELECTION, CORRECTION, RETOUR_AGENT, états accueil,
     * états hérités d'avant l'intégration...) correspond à un dossier en instruction
     * et l'analyse y reste modifiable.
     */
    private static final Set<String> ETATS_FIGES = Set.of(
            "APPROVED", "VALIDATED_DA", "VALIDATED_DR", "VALIDATED_FINAL",
            "PENDING_DG", "REJETE_DG", "CORRECTION_DR", "CORRECTION_DE");

    private final AnalyseChargesFonctionnaireRepository repository;

    /** Groupe CFE : même analyse charges & quotité, sur le CUMUL des salaires nets des membres (V126). */
    private static boolean estCfeGroupe(ContexteFonctionnaire ctx) {
        return io.digiservices.ecreditservice.validation.CreditGroupeValidator.NATURE_GROUPE.equals(ctx.natureClient())
                && "CFE".equals(ctx.typeGroupe());
    }

    /** Base de revenu : salaire de la demande (fonctionnaire) ou cumul des salaires des membres (CFE groupe). */
    private static BigDecimal salaireBase(ContexteFonctionnaire ctx) {
        return estCfeGroupe(ctx) ? ctx.salairesGroupe() : ctx.salaireNetMensuel();
    }

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
        if (!CreditFonctionnaireValidator.NATURE_FONCTIONNAIRE.equals(ctx.natureClient()) && !estCfeGroupe(ctx)) {
            throw new ValidationException("L'analyse des charges est réservée aux demandes de nature Fonctionnaire ou aux groupes CFE");
        }
        if (ctx.validationState() != null && ETATS_FIGES.contains(ctx.validationState())) {
            throw new ValidationException(String.format(
                    "L'analyse des charges ne peut plus être modifiée : le dossier est en état %s (déjà approuvé ou en validation hiérarchique)",
                    ctx.validationState()));
        }
        BigDecimal salaireBase = salaireBase(ctx);
        if (salaireBase == null || salaireBase.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException(estCfeGroupe(ctx)
                    ? "Les salaires nets des membres du groupe CFE sont manquants : corrigez la demande avant l'analyse"
                    : "Le salaire net de la demande fonctionnaire est manquant : corrigez la demande avant l'analyse");
        }

        // Salaire retenu = demande (fonctionnaire) ou cumul des membres (CFE groupe) ;
        // autres revenus retenus = saisie AC, sinon ceux déclarés
        BigDecimal salaire = salaireBase;
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
        if (ctx == null
                || (!CreditFonctionnaireValidator.NATURE_FONCTIONNAIRE.equals(ctx.natureClient()) && !estCfeGroupe(ctx))) {
            return;
        }

        // Domiciliation : engagement individuel de la demande fonctionnaire ; pour un groupe
        // CFE la garantie est le Plan Épargne des membres (pas de case dédiée au formulaire)
        if (!estCfeGroupe(ctx) && !Boolean.TRUE.equals(ctx.domiciliationSalaire())) {
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
        BigDecimal salaire = salaireBase(ctx);
        if (salaire == null || salaire.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException(estCfeGroupe(ctx)
                    ? "Les salaires nets des membres du groupe CFE sont manquants"
                    : "Le salaire net de la demande fonctionnaire est manquant");
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
