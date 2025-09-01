package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.repository.AnalyseRepository;
import io.digiservices.ecreditservice.repository.DemandeIndRepository;
import io.digiservices.ecreditservice.service.AnalyseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AnalyseServiceImpl implements AnalyseService {

    private final AnalyseRepository analyseRepository;

    private final DemandeIndRepository demandeIndRepository;


    @Override
    public ClientDto createClient(ClientDto clientDto) {
        log.info("Creating new client: {}", clientDto.getNom());
        return analyseRepository.saveClient(clientDto);
    }

    @Override
    public Page<ClientDto> getAllClients(String search, Pageable pageable) {
        log.info("Getting all clients with search: {}", search);
        return analyseRepository.findAllClients(search, pageable);
    }

    @Override
    public ClientDto getClientById(Long id) {
        log.info("Getting client with id: {}", id);
        return analyseRepository.findClientById(id);
    }

    @Override
    public ClientDto updateClient(Long id, ClientDto clientDto) {
        log.info("Updating client: {}", id);
        clientDto.setId(id);
        return analyseRepository.updateClient(clientDto);
    }

    @Override
    public void deleteClient(Long id) {
        log.info("Deleting client: {}", id);
        analyseRepository.deleteClient(id);
    }


    @Override
    @Transactional
    public DossierCreditDto createDossier(DossierCreditDto dto) {
        log.info("Creating dossier for client: {} with demande: {}",
                dto.getClientId(), dto.getDemandeindividuelId());

        try {
            // ✅ OPTIONNEL : Vérifier que la demande existe si fournie
            if (dto.getDemandeindividuelId() != null) {
                 //Vous pouvez ajouter une vérification si nécessaire
                 boolean demandeExists = demandeIndRepository.checkDemandeExists(dto.getDemandeindividuelId());
                 if (!demandeExists) {
                     throw new IllegalArgumentException("Demande avec ID " + dto.getDemandeindividuelId() + " n'existe pas");
                 }
            }

            // Définir les valeurs par défaut
            if (dto.getStatut() == null || dto.getStatut().isEmpty()) {
                dto.setStatut("EN_COURS");
            }

            if (dto.getDateDemande() == null) {
                dto.setDateDemande(LocalDate.now());
            }

            // Sauvegarder le dossier
            DossierCreditDto savedDossier = analyseRepository.saveDossier(dto);

            if (savedDossier == null) {
                throw new RuntimeException("Erreur lors de la sauvegarde du dossier");
            }
            // Initialiser automatiquement les prévisions
            initializePrevisions(savedDossier.getId(), 12);

            log.info("Dossier created with ID: {} and previsions initialized", savedDossier.getId());

            return savedDossier;

        } catch (Exception e) {
            log.error("Erreur lors de la création du dossier: ", e);
            throw new RuntimeException("Impossible de créer le dossier: " + e.getMessage(), e);
        }
    }



    @Override
    public Page<DossierCreditDto> getAllDossiers(String statut, Pageable pageable) {
        return null;
    }

    @Override
    public DossierCreditDto getDossierById(Long id) {
        return null;
    }

    @Override
    public List<DossierCreditDto> getDossiersByClient(Long clientId) {
        log.info("Getting dossiers for client: {}", clientId);

        try {
            // Vérifier que le client existe
            ClientDto client = analyseRepository.findClientById(clientId);
            if (client == null) {
                log.warn("Client {} not found", clientId);
                throw new IllegalArgumentException("Client avec ID " + clientId + " n'existe pas");
            }

            // Récupérer les dossiers du client
            List<DossierCreditDto> dossiers = analyseRepository.findDossiersByClientId(clientId);

            // Enrichir avec le nom du client
            String clientNomComplet = client.getPrenom() + " " + client.getNom();
            dossiers.forEach(dossier -> {
                dossier.setClientNomComplet(clientNomComplet);
                dossier.setClient(client);
            });

            log.info("Found {} dossiers for client {}", dossiers.size(), clientId);
            return dossiers;

        } catch (Exception e) {
            log.error("Error getting dossiers for client {}: ", clientId, e);
            throw new RuntimeException("Erreur lors de la récupération des dossiers: " + e.getMessage(), e);
        }
    }

    @Override
    public DossierCreditDto updateStatutDossier(Long id, String statut) {
        return null;
    }

    @Override
    @Transactional
    public List<PrevisionTresorerieDto> initializePrevisions(Long dossierId, Integer nbMois) {
        log.info("Initializing {} previsions for dossier {}", nbMois, dossierId);

        // Vérifier qu'il n'y a pas déjà des prévisions
        List<PrevisionTresorerieDto> existingPrevisions = analyseRepository.findPrevisionsByDossier(dossierId);
        if (!existingPrevisions.isEmpty()) {
            log.info("Previsions already exist for dossier {}", dossierId);
            return existingPrevisions;
        }

        // Créer les prévisions pour chaque mois
        List<PrevisionTresorerieDto> previsions = new ArrayList<>();
        BigDecimal soldePrecedent = BigDecimal.ZERO;

        for (int mois = 1; mois <= nbMois; mois++) {
            PrevisionTresorerieDto prevision = new PrevisionTresorerieDto();
            prevision.setDossierId(dossierId);
            prevision.setNumeroMois(mois);
            prevision.setSoldeDebut(soldePrecedent);
            prevision.setTotalEncaissements(BigDecimal.ZERO);
            prevision.setTotalDecaissements(BigDecimal.ZERO);
            prevision.setExcedentDeficit(BigDecimal.ZERO);
            prevision.setSoldeFin(soldePrecedent);

            // Sauvegarder la prévision
            PrevisionTresorerieDto savedPrevision = analyseRepository.savePrevision(prevision);
            previsions.add(savedPrevision);

            // Le solde de fin devient le solde de début du mois suivant
            soldePrecedent = savedPrevision.getSoldeFin();
        }

        log.info("Initialized {} previsions for dossier {}", previsions.size(), dossierId);
        return previsions;
    }

    @Override
    public List<PrevisionTresorerieDto> getPrevisionsByDossier(Long dossierId) {
        log.info("Getting previsions for dossier: {}", dossierId);

        // Vérifier que le dossier existe
        DossierCreditDto dossier = analyseRepository.findDossierById(dossierId);
        if (dossier == null) {
            throw new IllegalArgumentException("Dossier avec ID " + dossierId + " n'existe pas");
        }

        // Récupérer les prévisions
        List<PrevisionTresorerieDto> previsions = analyseRepository.findPrevisionsByDossier(dossierId);

        // Pour chaque prévision, charger les lignes
        for (PrevisionTresorerieDto prevision : previsions) {
            List<LigneEncaissementDto> encaissements =
                    analyseRepository.findLignesEncaissementByPrevision(prevision.getId());
            List<LigneDecaissementDto> decaissements =
                    analyseRepository.findLignesDecaissementByPrevision(prevision.getId());

            prevision.setLignesEncaissement(encaissements);
            prevision.setLignesDecaissement(decaissements);
        }

        log.info("Found {} previsions for dossier {}", previsions.size(), dossierId);
        return previsions;
    }

    @Override
    public PrevisionTresorerieDto getPrevisionById(Long id) {
        log.info("Getting prevision by ID: {}", id);

        PrevisionTresorerieDto prevision = analyseRepository.findPrevisionById(id);

        if (prevision == null) {
            throw new IllegalArgumentException("Prévision avec ID " + id + " n'existe pas");
        }

        // Charger les lignes d'encaissement et décaissement
        List<LigneEncaissementDto> encaissements = analyseRepository.findLignesEncaissementByPrevision(id);
        List<LigneDecaissementDto> decaissements = analyseRepository.findLignesDecaissementByPrevision(id);

        prevision.setLignesEncaissement(encaissements);
        prevision.setLignesDecaissement(decaissements);

        return prevision;
    }

    @Override
    public PrevisionTresorerieDto updateSoldeDebut(Long id, Double soldeDebut) {
        return null;
    }

    @Override
    public void saveLignesEncaissement(Long previsionId, List<LigneEncaissementDto> lignes) {

    }

    @Override
    public List<LigneEncaissementDto> getLignesEncaissement(Long previsionId) {
        log.info("Getting lignes encaissement for prevision: {}", previsionId);
        return analyseRepository.findLignesEncaissementByPrevision(previsionId);
    }

    @Override
    public LigneEncaissementDto updateLigneEncaissement(Long id, LigneEncaissementDto dto) {
        return null;
    }

    @Override
    public void deleteLigneEncaissement(Long id) {

    }

    @Override
    public void saveLignesDecaissement(Long previsionId, List<LigneDecaissementDto> lignes) {

    }

    @Override
    public List<LigneDecaissementDto> getLignesDecaissement(Long previsionId) {
        log.info("Getting lignes decaissement for prevision: {}", previsionId);
        return analyseRepository.findLignesDecaissementByPrevision(previsionId);
    }

    @Override
    @Transactional
    public PrevisionTresorerieDto calculerPrevision(Long previsionId) {
        log.info("Calculating prevision: {}", previsionId);

        // 1. Récupérer la prévision
        PrevisionTresorerieDto prevision = analyseRepository.findPrevisionById(previsionId);

        // 2. Calculer total encaissements
        BigDecimal totalEnc = analyseRepository.sumEncaissements(previsionId);
        prevision.setTotalEncaissements(totalEnc);

        // 3. Calculer total décaissements
        BigDecimal totalDec = analyseRepository.sumDecaissements(previsionId);
        prevision.setTotalDecaissements(totalDec);

        // 4. Calculer disponible et excédent
        BigDecimal disponible = prevision.getSoldeDebut().add(totalEnc);
        BigDecimal excedent = disponible.subtract(totalDec);
        prevision.setExcedentDeficit(excedent);

        // 5. Calculer solde fin (excédent - remboursements)
        BigDecimal remboursement = calculateRemboursementMensuel(prevision.getDossierId());
        prevision.setSoldeFin(excedent.subtract(remboursement));

        // 6. Sauvegarder
        analyseRepository.updatePrevision(prevision);

        // 7. Mettre à jour le mois suivant
        updateNextMonthSoldeDebut(prevision);

        return prevision;
    }

    private void updateNextMonthSoldeDebut(PrevisionTresorerieDto currentPrevision) {
        Integer nextMonth = currentPrevision.getNumeroMois() + 1;
        if (nextMonth <= 12) {
            analyseRepository.updateSoldeDebutByDossierAndMois(
                    currentPrevision.getDossierId(),
                    nextMonth,
                    currentPrevision.getSoldeFin()
            );
        }
    }

    @Override
    public List<PrevisionTresorerieDto> calculerToutesPrevisions(Long dossierId) {
        return null;
    }

    @Override
    public AnalyseCreditDto analyserDossier(Long dossierId) {
        log.info("Analyzing dossier: {}", dossierId);

        AnalyseCreditDto analyse = new AnalyseCreditDto();
        analyse.setDossierId(dossierId);

        // Récupérer toutes les prévisions
        List<PrevisionTresorerieDto> previsions = analyseRepository.findPrevisionsByDossier(dossierId);

        // Calculer capacité de remboursement moyenne
        BigDecimal totalExcedent = previsions.stream()
                .map(PrevisionTresorerieDto::getExcedentDeficit)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal capaciteMoyenne = totalExcedent.divide(
                BigDecimal.valueOf(previsions.size()), 2, RoundingMode.HALF_UP);

        analyse.setCapaciteRemboursement(capaciteMoyenne);

        // Calculer ratio d'endettement
        DossierCreditDto dossier = analyseRepository.findDossierById(dossierId);
        BigDecimal mensualite = calculateRemboursementMensuel(dossierId);
        BigDecimal ratio = mensualite.divide(capaciteMoyenne, 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        analyse.setRatioEndettement(ratio);

        // Score de crédit (simplifié)
        int score = calculateCreditScore(capaciteMoyenne, ratio);
        analyse.setScoreCredit(score);

        // Recommandation
        if (score >= 70 && ratio.compareTo(BigDecimal.valueOf(35)) < 0) {
            analyse.setRecommandation("APPROUVE");
            analyse.setCommentaires("Dossier solide avec bonne capacité de remboursement");
        } else if (score >= 50) {
            analyse.setRecommandation("APPROUVE_AVEC_CONDITIONS");
            analyse.setCommentaires("Nécessite des garanties supplémentaires");
        } else {
            analyse.setRecommandation("REJETE");
            analyse.setCommentaires("Capacité de remboursement insuffisante");
        }

        analyse.setDateAnalyse(LocalDateTime.now());

        // Sauvegarder l'analyse
        return analyseRepository.saveAnalyse(analyse);
    }

    private BigDecimal calculateRemboursementMensuel(Long dossierId) {
        DossierCreditDto dossier = analyseRepository.findDossierById(dossierId);

        BigDecimal montant = dossier.getMontantDemande();
        BigDecimal taux = dossier.getTauxInteret().divide(BigDecimal.valueOf(100));
        int duree = dossier.getDureeMois();

        // Capital mensuel
        BigDecimal capitalMensuel = montant.divide(BigDecimal.valueOf(duree), 2, RoundingMode.HALF_UP);

        // Intérêt mensuel
        BigDecimal interetMensuel = montant.multiply(taux)
                .divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);

        return capitalMensuel.add(interetMensuel);
    }

    private int calculateCreditScore(BigDecimal capacite, BigDecimal ratio) {
        int score = 50; // Base

        // Bonus pour bonne capacité
        if (capacite.compareTo(BigDecimal.valueOf(1000000)) > 0) {
            score += 30;
        } else if (capacite.compareTo(BigDecimal.valueOf(500000)) > 0) {
            score += 20;
        }

        // Bonus pour faible ratio
        if (ratio.compareTo(BigDecimal.valueOf(30)) < 0) {
            score += 20;
        } else if (ratio.compareTo(BigDecimal.valueOf(40)) < 0) {
            score += 10;
        }

        return Math.min(100, score);
    }

    @Override
    public RatiosFinanciersDto calculerRatios(Long dossierId) {
        return null;
    }

    @Override
    public CapaciteRemboursementDto calculerCapaciteRemboursement(Long dossierId) {
        return null;
    }

    @Override
    public List<RemboursementDto> genererEcheancier(Long dossierId) {
        return null;
    }

    @Override
    public List<RemboursementDto> getRemboursements(Long dossierId) {
        return null;
    }

    @Override
    public RemboursementDto marquerCommePaye(Long id, String datePaiement) {
        return null;
    }

    @Override
    public List<CategorieDto> getCategoriesEncaissement() {
        return null;
    }

    @Override
    public List<CategorieDto> getCategoriesDecaissement() {
        return null;
    }

    @Override
    public ImportResultDto importExcel(Long dossierId, MultipartFile file) {
        return null;
    }

    @Override
    public byte[] exportExcel(Long dossierId) {
        return new byte[0];
    }

    @Override
    public byte[] exportPdf(Long dossierId) {
        return new byte[0];
    }

    @Override
    public DashboardStatsDto getDashboardStats() {
        return null;
    }

    @Override
    public List<StatsMensuelsDto> getStatsMensuels(Integer annee) {
        return null;
    }

    @Override
    public List<TopClientDto> getTopClients(Integer limit) {
        return null;
    }

    @Override
    @Transactional
    public List<PrevisionTresorerieDto> savePrevisions(Long dossierId, List<PrevisionTresorerieDto> previsions) {
        log.info("Saving {} previsions for dossier {}", previsions.size(), dossierId);

        // Vérifier que le dossier existe
        getDossierById(dossierId);

        // Supprimer les anciennes prévisions si elles existent
        analyseRepository.deletePrevisionsbyDossierId(dossierId);

        // Sauvegarder les nouvelles prévisions
        List<PrevisionTresorerieDto> savedPrevisions = new ArrayList<>();
        for (PrevisionTresorerieDto prevision : previsions) {
            prevision.setDossierId(dossierId);
            PrevisionTresorerieDto saved = analyseRepository.savePrevision(prevision);

            // Sauvegarder les lignes d'encaissement et décaissement
            if (prevision.getLignesEncaissement() != null) {
                for (LigneEncaissementDto ligne : prevision.getLignesEncaissement()) {
                    ligne.setPrevisionId(saved.getId());
                    analyseRepository.saveLigneEncaissement(ligne);
                }
            }

            if (prevision.getLignesDecaissement() != null) {
                for (LigneDecaissementDto ligne : prevision.getLignesDecaissement()) {
                    ligne.setPrevisionId(saved.getId());
                    analyseRepository.saveLigneDecaissement(ligne);
                }
            }

            savedPrevisions.add(saved);
        }

        return savedPrevisions;
    }

    @Override
    public DossierCreditDto getDossierByDemandeIndividuelId(Long demandeId) {
        return analyseRepository.getDossierByDemandeIndividuelId(demandeId);
    }

    @Override
    @Transactional
    public AvisDto saveAvis(AvisDto avisDto) {
        log.info("Sauvegarde d'un nouvel avis pour la demande: {}", avisDto.getDemandeIndividuelId());

        // Validation supplémentaire si nécessaire
        validateAvisData(avisDto);

        // Sauvegarder l'avis
        AvisDto savedAvis = analyseRepository.saveAvis(avisDto);

        log.info("Avis sauvegardé avec succès, ID: {}", savedAvis.getAvisId());
        return savedAvis;
    }

    @Override
    public List<AvisDto> getAvisByDemandeId(Long demandeId) {
        log.info("Récupération des avis pour la demande: {}", demandeId);
        return analyseRepository.getAvisByDemandeId(demandeId);
    }

    @Override
    @Transactional
    public AvisDto updateAvis(Long avisId, AvisDto avisDto) {
        log.info("Mise à jour de l'avis: {}", avisId);
        avisDto.setAvisId(avisId);
        return analyseRepository.updateAvis(avisDto);
    }

    @Override
    @Transactional
    public void deleteAvis(Long avisId) {
        log.info("Suppression de l'avis: {}", avisId);
        analyseRepository.deleteAvis(avisId);
    }

    private void validateAvisData(AvisDto avisDto) {
        if (avisDto.getDemandeIndividuelId() == null) {
            throw new IllegalArgumentException("L'ID de la demande est obligatoire");
        }
        if (avisDto.getIdUser() == null) {
            throw new IllegalArgumentException("L'ID de l'utilisateur est obligatoire");
        }
        if (avisDto.getLibele() == null || avisDto.getLibele().trim().isEmpty()) {
            throw new IllegalArgumentException("Le contenu de l'avis est obligatoire");
        }
    }

    @Override
    public AvisDto getAvisById(Long avisId) {
        log.info("Récupération de l'avis: {}", avisId);
        return analyseRepository.getAvisById(avisId);
    }

    @Override
    public List<AvisDto> getAvisByUserId(Long userId) {
        log.info("Récupération des avis de l'utilisateur: {}", userId);
        return analyseRepository.getAvisByUserId(userId);
    }



}