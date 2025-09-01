package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AnalyseService {

    // Clients
    ClientDto createClient(ClientDto clientDto);
    Page<ClientDto> getAllClients(String search, Pageable pageable);
    ClientDto getClientById(Long id);
    ClientDto updateClient(Long id, ClientDto clientDto);
    void deleteClient(Long id);

    // Dossiers Crédit
    DossierCreditDto createDossier(DossierCreditDto dto);
    Page<DossierCreditDto> getAllDossiers(String statut, Pageable pageable);
    DossierCreditDto getDossierById(Long id);
    List<DossierCreditDto> getDossiersByClient(Long clientId);
    DossierCreditDto updateStatutDossier(Long id, String statut);

    // Prévisions Trésorerie
    List<PrevisionTresorerieDto> initializePrevisions(Long dossierId, Integer nbMois);
    List<PrevisionTresorerieDto> getPrevisionsByDossier(Long dossierId);
    PrevisionTresorerieDto getPrevisionById(Long id);
    PrevisionTresorerieDto updateSoldeDebut(Long id, Double soldeDebut);

    // Lignes Encaissement
    void saveLignesEncaissement(Long previsionId, List<LigneEncaissementDto> lignes);
    List<LigneEncaissementDto> getLignesEncaissement(Long previsionId);
    LigneEncaissementDto updateLigneEncaissement(Long id, LigneEncaissementDto dto);
    void deleteLigneEncaissement(Long id);

    // Lignes Décaissement
    void saveLignesDecaissement(Long previsionId, List<LigneDecaissementDto> lignes);
    List<LigneDecaissementDto> getLignesDecaissement(Long previsionId);

    // Calculs et Analyse
    PrevisionTresorerieDto calculerPrevision(Long previsionId);
    List<PrevisionTresorerieDto> calculerToutesPrevisions(Long dossierId);
    AnalyseCreditDto analyserDossier(Long dossierId);
    RatiosFinanciersDto calculerRatios(Long dossierId);
    CapaciteRemboursementDto calculerCapaciteRemboursement(Long dossierId);

    // Remboursements
    List<RemboursementDto> genererEcheancier(Long dossierId);
    List<RemboursementDto> getRemboursements(Long dossierId);
    RemboursementDto marquerCommePaye(Long id, String datePaiement);

    // Catégories
    List<CategorieDto> getCategoriesEncaissement();
    List<CategorieDto> getCategoriesDecaissement();

    // Import/Export
    ImportResultDto importExcel(Long dossierId, MultipartFile file);
    byte[] exportExcel(Long dossierId);
    byte[] exportPdf(Long dossierId);

    // Dashboard
    DashboardStatsDto getDashboardStats();
    List<StatsMensuelsDto> getStatsMensuels(Integer annee);
    List<TopClientDto> getTopClients(Integer limit);

    List<PrevisionTresorerieDto> savePrevisions(Long dossierId, List<PrevisionTresorerieDto> previsions);

    DossierCreditDto getDossierByDemandeIndividuelId(Long demandeId);

    AvisDto saveAvis(AvisDto avisDto);
    List<AvisDto> getAvisByDemandeId(Long demandeId);
    AvisDto updateAvis(Long avisId, AvisDto avisDto);
    void deleteAvis(Long avisId);

    AvisDto getAvisById(Long avisId);
    List<AvisDto> getAvisByUserId(Long userId);
}