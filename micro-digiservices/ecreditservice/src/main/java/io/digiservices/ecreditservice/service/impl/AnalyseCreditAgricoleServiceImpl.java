package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.AnalyseCreditAgricoleDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.exception.ValidationException;
import io.digiservices.ecreditservice.repository.AnalyseCreditAgricoleRepository;
import io.digiservices.ecreditservice.repository.AnalyseCreditAgricoleRepository.ContexteAgricole;
import io.digiservices.ecreditservice.service.AnalyseCreditAgricoleService;
import io.digiservices.ecreditservice.validation.CreditGroupeValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;
import java.util.Set;

/**
 * Analyse du crédit agricole solidaire (groupes CAS / CAS_R).
 * Total des échéances = montant x (1 + taux/100) — dérivé de l'échéancier à capital
 * constant avec intérêt identique par échéance I = (montant/N) x taux (formule
 * confirmée pour 2 échéances le 2026-08-27 ; cas 1 et 3 échéances à affiner).
 * Verdict FINANCABLE <=> marge nette (produits - charges) > total des échéances.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyseCreditAgricoleServiceImpl implements AnalyseCreditAgricoleService {

    public static final String VERDICT_FINANCABLE = "FINANCABLE";
    public static final String VERDICT_NON_FINANCABLE = "NON_FINANCABLE";
    public static final Set<String> TYPES_AGRICOLES = Set.of("CAS", "CAS_R");

    /** Liste noire des états figés (même leçon que l'analyse fonctionnaire : jamais de liste blanche). */
    private static final Set<String> ETATS_FIGES = Set.of(
            "APPROVED", "VALIDATED_DA", "VALIDATED_DR", "VALIDATED_FINAL",
            "PENDING_DG", "REJETE_DG", "CORRECTION_DR", "CORRECTION_DE");

    private final AnalyseCreditAgricoleRepository repository;

    @Override
    public Optional<AnalyseCreditAgricoleDto> getByDemandeId(Long demandeId) {
        return repository.findByDemandeId(demandeId);
    }

    @Override
    @Transactional
    public AnalyseCreditAgricoleDto enregistrer(Long demandeId, AnalyseCreditAgricoleDto dto, String analysePar) {
        ContexteAgricole ctx = repository.getContexte(demandeId);
        if (ctx == null) {
            throw new ApiException("Demande non trouvée");
        }
        if (!CreditGroupeValidator.NATURE_GROUPE.equals(ctx.natureClient())
                || ctx.typeGroupe() == null || !TYPES_AGRICOLES.contains(ctx.typeGroupe())) {
            throw new ValidationException("L'analyse agricole est réservée aux groupes CAS / CAS-R");
        }
        if (ctx.validationState() != null && ETATS_FIGES.contains(ctx.validationState())) {
            throw new ValidationException(String.format(
                    "L'analyse agricole ne peut plus être modifiée : le dossier est en état %s (déjà approuvé ou en validation hiérarchique)",
                    ctx.validationState()));
        }

        calculer(dto, ctx);
        return repository.upsert(demandeId, dto, analysePar);
    }

    @Override
    public void verifierFinancableSiGroupeAgricole(Long demandeId) {
        ContexteAgricole ctx = repository.getContexte(demandeId);
        if (ctx == null || !CreditGroupeValidator.NATURE_GROUPE.equals(ctx.natureClient())
                || ctx.typeGroupe() == null || !TYPES_AGRICOLES.contains(ctx.typeGroupe())) {
            return;
        }
        AnalyseCreditAgricoleDto analyse = repository.findByDemandeId(demandeId)
                .orElseThrow(() -> new ValidationException(
                        "L'analyse agricole (charges, produits, marge nette) doit être complétée avant de soumettre un crédit agricole solidaire"));

        // Recalcul complet (aucune confiance aux valeurs stockées ou au front)
        calculer(analyse, ctx);
        if (!VERDICT_FINANCABLE.equals(analyse.getVerdict())) {
            throw new ValidationException(String.format(
                    "Dossier NON finançable : la marge nette (%s GNF) doit être strictement supérieure au total des échéances (%s GNF)",
                    analyse.getMargeNette().toPlainString(), analyse.getTotalEcheances().toPlainString()));
        }
    }

    /** Recalcule totaux, marge et verdict à partir de la grille et des modalités du prêt. */
    private void calculer(AnalyseCreditAgricoleDto dto, ContexteAgricole ctx) {
        BigDecimal totalCharges = somme(
                dto.getFraisLabour(), dto.getFraisCloture(), dto.getAchatIntrant(),
                dto.getAchatPhytosanitaire(), dto.getAchatOutillage(), dto.getFraisEntretien(),
                dto.getFraisSemis(), dto.getFraisRecolte(), dto.getTransport(),
                dto.getStockage(), dto.getFraisConservation(), dto.getChargesFamiliales());

        BigDecimal totalProduits = nvl(dto.getQuantiteRecolte())
                .multiply(nvl(dto.getPrixVenteUnitaire()))
                .add(nvl(dto.getAutresProduits()))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal montant = ctx.montantDemande() != null ? ctx.montantDemande() : BigDecimal.ZERO;
        BigDecimal taux = ctx.tauxInteret() != null ? ctx.tauxInteret() : BigDecimal.ZERO;
        // Total échéances = montant + N x I, avec I = (montant/N) x taux => montant x (1 + taux/100)
        BigDecimal totalEcheances = montant
                .add(montant.multiply(taux).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal margeNette = totalProduits.subtract(totalCharges).setScale(2, RoundingMode.HALF_UP);

        dto.setTotalCharges(totalCharges);
        dto.setTotalProduits(totalProduits);
        dto.setTotalEcheances(totalEcheances);
        dto.setMargeNette(margeNette);
        dto.setVerdict(margeNette.compareTo(totalEcheances) > 0 ? VERDICT_FINANCABLE : VERDICT_NON_FINANCABLE);
    }

    private static BigDecimal somme(BigDecimal... valeurs) {
        BigDecimal total = BigDecimal.ZERO;
        for (BigDecimal valeur : valeurs) {
            total = total.add(nvl(valeur));
        }
        return total.setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal nvl(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
