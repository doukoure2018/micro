package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface AnalyseRepository {

    // Clients
    ClientDto saveClient(ClientDto client);
    ClientDto findClientById(Long id);
    Page<ClientDto> findAllClients(String search, Pageable pageable);
    ClientDto updateClient(ClientDto client);
    void deleteClient(Long id);

    // Dossiers
    DossierCreditDto saveDossier(DossierCreditDto dossier);

    Page<DossierCreditDto> findAllDossiers(String statut, Pageable pageable);
    List<DossierCreditDto> findDossiersByClientId(Long clientId);
    DossierCreditDto findDossierById(Long dossierId);
    void updateStatutDossier(Long id, String statut);

    // Prévisions
    PrevisionTresorerieDto savePrevision(PrevisionTresorerieDto prevision);
    PrevisionTresorerieDto findPrevisionById(Long id);
    List<PrevisionTresorerieDto> findPrevisionsByDossier(Long dossierId);
    void updatePrevision(PrevisionTresorerieDto prevision);
    void updateSoldeDebutByDossierAndMois(Long dossierId, Integer mois, BigDecimal solde);

    // Lignes encaissement/décaissement
    void saveLignesEncaissement(Long previsionId, List<LigneEncaissementDto> lignes);
    void saveLignesDecaissement(Long previsionId, List<LigneDecaissementDto> lignes);
    List<LigneEncaissementDto> findLignesEncaissementByPrevision(Long previsionId);
    List<LigneDecaissementDto> findLignesDecaissementByPrevision(Long previsionId);
    BigDecimal sumEncaissements(Long previsionId);
    BigDecimal sumDecaissements(Long previsionId);

    // Analyse
    AnalyseCreditDto saveAnalyse(AnalyseCreditDto analyse);
    Optional<AnalyseCreditDto> findAnalyseByDossier(Long dossierId);

    // Remboursements
    void saveRemboursements(List<RemboursementDto> remboursements);
    List<RemboursementDto> findRemboursementsByDossier(Long dossierId);
    void updateStatutRemboursement(Long id, String statut, String datePaiement);

    // Catégories
    List<CategorieDto> findAllCategoriesEncaissement();
    List<CategorieDto> findAllCategoriesDecaissement();

    // Dashboard
    DashboardStatsDto getDashboardStats();
    List<StatsMensuelsDto> getStatsMensuels(Integer annee);
    List<TopClientDto> getTopClients(Integer limit);

    void saveLigneDecaissement(LigneDecaissementDto ligne);

    void saveLigneEncaissement(LigneEncaissementDto ligne);

    void saveLignesEncaissementBatch(Long previsionId, List<LigneEncaissementDto> lignes);
    void saveLignesDecaissementBatch(Long previsionId, List<LigneDecaissementDto> lignes);


    void deletePrevisionsbyDossierId(Long dossierId);
    void deletePrevisionsbyDossierIdOptimized(Long dossierId);

    void updatePrevisionTotals(Long previsionId);


    DossierCreditDto getDossierByDemandeIndividuelId(Long demandeId);

    AvisDto saveAvis(AvisDto avisDto);
    List<AvisDto> getAvisByDemandeId(Long demandeId);
    AvisDto updateAvis(AvisDto avisDto);
    void deleteAvis(Long avisId);
    AvisDto getAvisById(Long avisId);

    List<AvisDto> getAvisByUserId(Long userId);
}