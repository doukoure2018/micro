package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.*;

import java.util.List;
import java.util.Map;

public interface CollecteDonneesRepository {

    // Collecte (Header + Section 1)
    Long createCollecte(CreateCollecteRequest request, String codUsuario, String nomAgent);
    CollecteDonneesDto getCollecteById(Long collecteId);
    CollecteDonneesDto getCollecteByDemande(Long demandeindividuelId);
    void updateSection1(Long collecteId, CreateCollecteRequest dto);
    void deleteCollecte(Long collecteId);
    boolean collecteExists(Long collecteId);
    boolean demandeHasCollecte(Long demandeindividuelId);

    // Condition Credit (Section 2)
    Long upsertConditionCredit(Long collecteId, ConditionCreditDto dto);
    ConditionCreditDto getConditionCredit(Long collecteId);

    // Chiffre d'Affaires (Section 3)
    Long upsertChiffreAffaires(Long collecteId, ChiffreAffairesDto dto);
    ChiffreAffairesDto getChiffreAffaires(Long collecteId);

    // Marge Brute (Section 4)
    Long upsertMargeBrute(Long collecteId, MargeBruteDto dto);
    MargeBruteDto getMargeBrute(Long collecteId);

    // Produits (Section 4 detail)
    Long insertProduit(Long collecteId, ProduitDto dto);
    List<ProduitDto> getProduits(Long collecteId);
    void deleteProduits(Long collecteId);

    // Actif Passif (Section 5)
    Long upsertActifPassif(Long collecteId, ActifPassifDto dto);
    ActifPassifDto getActifPassif(Long collecteId);

    // Stock Articles (Section 5i detail)
    Long insertStockArticle(Long collecteId, StockArticleDto dto);
    List<StockArticleDto> getStockArticles(Long collecteId);
    void deleteStockArticles(Long collecteId);

    // Charge Entreprise (Section 6)
    Long upsertChargeEntreprise(Long collecteId, ChargeEntrepriseDto dto);
    ChargeEntrepriseDto getChargeEntreprise(Long collecteId);

    // Charge Personnelle (Section 7)
    Long upsertChargePersonnelle(Long collecteId, ChargePersonnelleDto dto);
    ChargePersonnelleDto getChargePersonnelle(Long collecteId);

    // Autre Revenu (Section 8)
    Long upsertAutreRevenu(Long collecteId, AutreRevenuDto dto);
    AutreRevenuDto getAutreRevenu(Long collecteId);

    // Bien Personnel (Section 9)
    Long upsertBienPersonnel(Long collecteId, BienPersonnelDto dto);
    BienPersonnelDto getBienPersonnel(Long collecteId);

    // Amortissements
    Long insertAmortissement(Long collecteId, AmortissementDto dto);
    void updateAmortissement(Long amortissementId, AmortissementDto dto);
    void deleteAmortissement(Long amortissementId);
    List<AmortissementDto> getAmortissements(Long collecteId);
    void recalculerAmortissements(Long collecteId);

    // Completion
    void updatePourcentageCompletion(Long collecteId);

    // Auto-remplir (grouped read for analysis calculation)
    Map<String, Object> getCollecteForAutoRemplir(Long collecteId);
}
