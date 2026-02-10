package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.CollecteDonneesRepository;
import io.digiservices.ecreditservice.service.CollecteDonneesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CollecteDonneesServiceImpl implements CollecteDonneesService {

    private final CollecteDonneesRepository repository;

    // ==================== COLLECTE (Header + Section 1) ====================

    @Override
    @Transactional
    public CollecteDonneesDto createCollecte(CreateCollecteRequest request, String codUsuario, String nomAgent) {
        if (repository.demandeHasCollecte(request.getDemandeindividuelId())) {
            throw new ApiException("Une collecte existe deja pour cette demande");
        }
        Long collecteId = repository.createCollecte(request, codUsuario, nomAgent);
        log.info("Collecte creee avec ID: {} pour demande: {}", collecteId, request.getDemandeindividuelId());
        repository.updatePourcentageCompletion(collecteId);
        return getCollecteComplete(collecteId);
    }

    @Override
    public CollecteDonneesDto getCollecteComplete(Long collecteId) {
        CollecteDonneesDto collecte = repository.getCollecteById(collecteId);
        enrichCollecte(collecte);
        return collecte;
    }

    @Override
    public CollecteDonneesDto getCollecteByDemande(Long demandeindividuelId) {
        CollecteDonneesDto collecte = repository.getCollecteByDemande(demandeindividuelId);
        enrichCollecte(collecte);
        return collecte;
    }

    @Override
    @Transactional
    public CollecteDonneesDto updateSection1(Long collecteId, CreateCollecteRequest dto) {
        if (!repository.collecteExists(collecteId)) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
        repository.updateSection1(collecteId, dto);
        repository.updatePourcentageCompletion(collecteId);
        log.info("Section 1 mise a jour pour collecte: {}", collecteId);
        return getCollecteComplete(collecteId);
    }

    @Override
    @Transactional
    public void deleteCollecte(Long collecteId) {
        if (!repository.collecteExists(collecteId)) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
        repository.deleteCollecte(collecteId);
        log.info("Collecte supprimee: {}", collecteId);
    }

    // ==================== SECTIONS ====================

    @Override
    @Transactional
    public CollecteDonneesDto updateSection2(Long collecteId, ConditionCreditDto dto) {
        if (!repository.collecteExists(collecteId)) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
        repository.upsertConditionCredit(collecteId, dto);
        log.info("Section 2 (Condition credit) mise a jour pour collecte: {}", collecteId);
        return getCollecteComplete(collecteId);
    }

    @Override
    @Transactional
    public CollecteDonneesDto updateSection3(Long collecteId, ChiffreAffairesDto dto) {
        if (!repository.collecteExists(collecteId)) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
        repository.upsertChiffreAffaires(collecteId, dto);
        repository.updatePourcentageCompletion(collecteId);
        log.info("Section 3 (CA) mise a jour pour collecte: {}", collecteId);
        return getCollecteComplete(collecteId);
    }

    @Override
    @Transactional
    public CollecteDonneesDto updateSection4(Long collecteId, MargeBruteDto dto) {
        if (!repository.collecteExists(collecteId)) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
        repository.upsertMargeBrute(collecteId, dto);

        // Replace produits: delete all then re-insert
        repository.deleteProduits(collecteId);
        if (dto.getProduits() != null) {
            for (int i = 0; i < dto.getProduits().size(); i++) {
                ProduitDto produit = dto.getProduits().get(i);
                produit.setOrdre(i + 1);
                repository.insertProduit(collecteId, produit);
            }
        }

        repository.updatePourcentageCompletion(collecteId);
        log.info("Section 4 (Marge) mise a jour pour collecte: {}", collecteId);
        return getCollecteComplete(collecteId);
    }

    @Override
    @Transactional
    public CollecteDonneesDto updateSection5(Long collecteId, ActifPassifDto dto) {
        if (!repository.collecteExists(collecteId)) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
        repository.upsertActifPassif(collecteId, dto);

        // Replace stock articles: delete all then re-insert
        repository.deleteStockArticles(collecteId);
        if (dto.getStockArticles() != null) {
            for (int i = 0; i < dto.getStockArticles().size(); i++) {
                StockArticleDto stock = dto.getStockArticles().get(i);
                stock.setOrdre(i + 1);
                repository.insertStockArticle(collecteId, stock);
            }
        }

        repository.updatePourcentageCompletion(collecteId);
        log.info("Section 5 (Actifs/Passifs) mise a jour pour collecte: {}", collecteId);
        return getCollecteComplete(collecteId);
    }

    @Override
    @Transactional
    public CollecteDonneesDto updateSection6(Long collecteId, ChargeEntrepriseDto dto) {
        if (!repository.collecteExists(collecteId)) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
        repository.upsertChargeEntreprise(collecteId, dto);
        repository.updatePourcentageCompletion(collecteId);
        log.info("Section 6 (Charges entreprise) mise a jour pour collecte: {}", collecteId);
        return getCollecteComplete(collecteId);
    }

    @Override
    @Transactional
    public CollecteDonneesDto updateSection7(Long collecteId, ChargePersonnelleDto dto) {
        if (!repository.collecteExists(collecteId)) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
        repository.upsertChargePersonnelle(collecteId, dto);
        repository.updatePourcentageCompletion(collecteId);
        log.info("Section 7 (Charges personnelles) mise a jour pour collecte: {}", collecteId);
        return getCollecteComplete(collecteId);
    }

    @Override
    @Transactional
    public CollecteDonneesDto updateSection8(Long collecteId, AutreRevenuDto dto) {
        if (!repository.collecteExists(collecteId)) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
        repository.upsertAutreRevenu(collecteId, dto);
        repository.updatePourcentageCompletion(collecteId);
        log.info("Section 8 (Autres revenus) mise a jour pour collecte: {}", collecteId);
        return getCollecteComplete(collecteId);
    }

    @Override
    @Transactional
    public CollecteDonneesDto updateSection9(Long collecteId, BienPersonnelDto dto) {
        if (!repository.collecteExists(collecteId)) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
        repository.upsertBienPersonnel(collecteId, dto);
        repository.updatePourcentageCompletion(collecteId);
        log.info("Section 9 (Biens personnels) mise a jour pour collecte: {}", collecteId);
        return getCollecteComplete(collecteId);
    }

    // ==================== AMORTISSEMENTS ====================

    @Override
    public List<AmortissementDto> getAmortissements(Long collecteId) {
        return repository.getAmortissements(collecteId);
    }

    @Override
    @Transactional
    public AmortissementDto addAmortissement(Long collecteId, AmortissementDto dto) {
        if (!repository.collecteExists(collecteId)) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
        Long amortId = repository.insertAmortissement(collecteId, dto);
        repository.recalculerAmortissements(collecteId);
        log.info("Amortissement ajoute ID: {} pour collecte: {}", amortId, collecteId);

        // Return the updated list and find the new one
        List<AmortissementDto> amortissements = repository.getAmortissements(collecteId);
        return amortissements.stream()
                .filter(a -> a.getAmortissementId().equals(amortId))
                .findFirst()
                .orElse(null);
    }

    @Override
    @Transactional
    public AmortissementDto updateAmortissement(Long amortissementId, AmortissementDto dto) {
        repository.updateAmortissement(amortissementId, dto);
        if (dto.getCollecteId() != null) {
            repository.recalculerAmortissements(dto.getCollecteId());
        }
        log.info("Amortissement mis a jour: {}", amortissementId);

        // Return updated amortissement
        if (dto.getCollecteId() != null) {
            List<AmortissementDto> amortissements = repository.getAmortissements(dto.getCollecteId());
            return amortissements.stream()
                    .filter(a -> a.getAmortissementId().equals(amortissementId))
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

    @Override
    @Transactional
    public void deleteAmortissement(Long amortissementId) {
        repository.deleteAmortissement(amortissementId);
        log.info("Amortissement supprime: {}", amortissementId);
    }

    @Override
    @Transactional
    public List<AmortissementDto> recalculerAmortissements(Long collecteId) {
        if (!repository.collecteExists(collecteId)) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
        repository.recalculerAmortissements(collecteId);
        log.info("Amortissements recalcules pour collecte: {}", collecteId);
        return repository.getAmortissements(collecteId);
    }

    // ==================== HELPER ====================

    private void enrichCollecte(CollecteDonneesDto collecte) {
        if (collecte == null) return;
        Long collecteId = collecte.getCollecteId();

        collecte.setConditionCredit(repository.getConditionCredit(collecteId));
        collecte.setChiffreAffaires(repository.getChiffreAffaires(collecteId));

        MargeBruteDto marge = repository.getMargeBrute(collecteId);
        if (marge != null) {
            marge.setProduits(repository.getProduits(collecteId));
        }
        collecte.setMargeBrute(marge);

        ActifPassifDto actifPassif = repository.getActifPassif(collecteId);
        if (actifPassif != null) {
            actifPassif.setStockArticles(repository.getStockArticles(collecteId));
        }
        collecte.setActifPassif(actifPassif);

        collecte.setChargeEntreprise(repository.getChargeEntreprise(collecteId));
        collecte.setChargePersonnelle(repository.getChargePersonnelle(collecteId));
        collecte.setAutreRevenu(repository.getAutreRevenu(collecteId));
        collecte.setBienPersonnel(repository.getBienPersonnel(collecteId));
        collecte.setAmortissements(repository.getAmortissements(collecteId));
    }
}
