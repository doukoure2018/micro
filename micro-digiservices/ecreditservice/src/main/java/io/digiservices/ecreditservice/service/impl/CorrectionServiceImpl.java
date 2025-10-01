package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.MotifCorrection;
import io.digiservices.ecreditservice.dto.PersonnePhysique;
import io.digiservices.ecreditservice.repository.CorrectionRepository;
import io.digiservices.ecreditservice.service.CorrectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CorrectionServiceImpl implements CorrectionService {

    private final CorrectionRepository correctionRepository;

    @Override
    @Transactional
    public PersonnePhysique addPersonnePhysique(PersonnePhysique personnePhysique) {
        log.info("Service - Ajout personne physique: {}", personnePhysique.getCodCliente());

        // Validation des données obligatoires
        validatePersonnePhysique(personnePhysique);

        // Vérifier si le client existe déjà
        Optional<PersonnePhysique> existing = correctionRepository
                .findByCodClientes(personnePhysique.getCodCliente());

        if (existing.isPresent()) {
            log.warn("Client déjà existant - Code: {}", personnePhysique.getCodCliente());
            throw new IllegalArgumentException("Le client avec le code " +
                    personnePhysique.getCodCliente() + " existe déjà");
        }

        // Définir les valeurs par défaut si nécessaire
        if (personnePhysique.getStatutClt() == null) {
            personnePhysique.setStatutClt("A"); // Actif par défaut
        }

        if (personnePhysique.getNature() == null) {
            personnePhysique.setNature("PP"); // Personne Physique
        }

        return correctionRepository.addPersonnePhysique(personnePhysique);
    }

    @Override
    public Optional<PersonnePhysique> findPersonnePhysiqueByCodClientes(String codClientes) {
        log.info("Service - Recherche personne physique: {}", codClientes);
        return correctionRepository.findByCodClientes(codClientes);
    }

    @Override
    @Transactional
    public PersonnePhysique updatePersonnePhysique(PersonnePhysique personnePhysique) {
        log.info("Service - Mise à jour personne physique: {}", personnePhysique.getCodCliente());

        // Validation
        validatePersonnePhysique(personnePhysique);

        // Vérifier que le client existe
        Optional<PersonnePhysique> existing = correctionRepository
                .findByCodClientes(personnePhysique.getCodCliente());

        if (existing.isEmpty()) {
            throw new ResourceNotFoundException("Client non trouvé: " +
                    personnePhysique.getCodCliente());
        }

        // Conserver l'ID existant
        personnePhysique.setId(existing.get().getId());

        return correctionRepository.updatePersonnePhysique(personnePhysique);
    }

    @Override
    @Transactional
    public boolean deletePersonnePhysique(String codClientes) {
        log.info("Service - Suppression personne physique: {}", codClientes);

        // Vérifier que le client existe
        Optional<PersonnePhysique> existing = correctionRepository
                .findByCodClientes(codClientes);

        if (existing.isEmpty()) {
            throw new ResourceNotFoundException("Client non trouvé: " + codClientes);
        }

        return correctionRepository.deletePersonnePhysique(codClientes);
    }

    @Override
    public List<PersonnePhysique> getListePPAttente(String codAgencia) {
        return correctionRepository.getListePPAttente(codAgencia);
    }

    @Override
    @Transactional
    public MotifCorrection addMotifCorrection(MotifCorrection motifCorrection)
    {
        log.info("Service - Ajout motif de correction pour client: {}", motifCorrection.getCodCliente());

        // Validation
        validateMotifCorrection(motifCorrection);

        // Vérifier si la personne physique existe et récupérer son ID
        if (motifCorrection.getCodCliente() != null) {
            Optional<PersonnePhysique> pp = correctionRepository.findByCodClientes(motifCorrection.getCodCliente());
            if (pp.isPresent())
            {
                if (motifCorrection.getPersonnePhysiqueId() == null)
                {
                    motifCorrection.setPersonnePhysiqueId(pp.get().getId());
                }
                // Si le statut du motif est REJETE, mettre à jour le statut de la personne physique
                if ("REJETE".equals(motifCorrection.getStatut()))
                {
                    updateStatutPersonnePhysique(pp.get().getId(), "REJETE");
                }
            }
        }

        // Définir le statut par défaut si non fourni
        if (motifCorrection.getStatut() == null || motifCorrection.getStatut().isEmpty()) {
            motifCorrection.setStatut("EN_COURS");
        }

        // Créer le motif de correction
        MotifCorrection result = correctionRepository.addMotifCorrection(motifCorrection);

        log.info("Motif de correction créé avec succès - ID: {}", result.getId());
        return result;
    }

    @Override
    public List<MotifCorrection> getMotifsCorrectionByClient(String codCliente) {
        log.info("Service - Recherche motifs de correction pour client: {}", codCliente);
        return correctionRepository.findMotifsCorrectionByClient(codCliente);
    }
    @Override
    public List<MotifCorrection> getMotifsCorrectionByPersonne(Long personnePhysiqueId) {
        log.info("Service - Recherche motifs de correction pour personne physique ID: {}", personnePhysiqueId);
        return correctionRepository.findMotifsCorrectionByPersonne(personnePhysiqueId);
    }

    @Override
    public List<MotifCorrection> getMotifsCorrectionByAgence(String codAgence) {
        log.info("Service - Recherche motifs de correction pour agence: {}", codAgence);
        return correctionRepository.findMotifsCorrectionByAgence(codAgence);
    }

    @Override
    @Transactional
    public MotifCorrection updateMotifStatut(Long id, String statut) {
        log.info("Service - Mise à jour statut motif {} vers {}", id, statut);

        // Vérifier que le motif existe
        Optional<MotifCorrection> existing = correctionRepository.findMotifCorrectionById(id);

        if (existing.isEmpty()) {
            throw new ResourceNotFoundException("Motif de correction non trouvé: " + id);
        }

        MotifCorrection motif = existing.get();

        // Si le statut est ANNULE, définir la date d'annulation
        if ("ANNULE".equals(statut) && motif.getDateAnnulation() == null) {
            motif.setDateAnnulation(LocalDateTime.now());
        }

        motif.setStatut(statut);

        return correctionRepository.updateMotifCorrection(motif);
    }

    @Override
    public Optional<MotifCorrection> findMotifCorrectionById(Long id) {
        log.info("Service - Recherche motif de correction par ID: {}", id);
        return correctionRepository.findMotifCorrectionById(id);
    }

    @Override
    @Transactional
    public void updateStatutPersonnePhysique(Long idPersonnePhysique, String statut) {
        log.info("Service - Mise à jour du statut de correction pour personne physique ID: {} vers {}",
                idPersonnePhysique, statut);

        // Vérifier que la personne physique existe
        Optional<PersonnePhysique> pp = correctionRepository.findById(idPersonnePhysique);
        if (pp.isEmpty()) {
            throw new ResourceNotFoundException("Personne physique non trouvée avec l'ID: " + idPersonnePhysique);
        }

        // Mettre à jour le statut de correction
        correctionRepository.updateCorrectionStatut(idPersonnePhysique, statut);

        log.info("Statut de correction mis à jour avec succès pour ID: {}", idPersonnePhysique);
    }

    private void validatePersonnePhysique(PersonnePhysique pp) {
        if (pp.getCodCliente() == null || pp.getCodCliente().trim().isEmpty()) {
            throw new IllegalArgumentException("Le code client est obligatoire");
        }

        if (pp.getNomClient() == null || pp.getNomClient().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom du client est obligatoire");
        }

        if (pp.getTelPrincipal() == null || pp.getTelPrincipal().trim().isEmpty()) {
            throw new IllegalArgumentException("Le téléphone principal est obligatoire");
        }

        // Validation du sexe
        if (pp.getIndSexo() != null && !pp.getIndSexo().matches("[MF]")) {
            throw new IllegalArgumentException("Le sexe doit être M ou F");
        }
    }

    private void validateMotifCorrection(MotifCorrection motif) {
        if (motif.getLibele() == null || motif.getLibele().trim().isEmpty()) {
            throw new IllegalArgumentException("Le libellé du motif est obligatoire");
        }

        if (motif.getCodCliente() == null || motif.getCodCliente().trim().isEmpty()) {
            throw new IllegalArgumentException("Le code client est obligatoire");
        }

        if (motif.getUserId() == null) {
            throw new IllegalArgumentException("L'ID utilisateur est obligatoire");
        }

        // Validation du statut si fourni
        if (motif.getStatut() != null && !motif.getStatut().isEmpty()) {
            if (!List.of("EN_COURS", "VALIDE", "ANNULE", "REJETE").contains(motif.getStatut())) {
                throw new IllegalArgumentException("Statut invalide. Valeurs acceptées: EN_COURS, VALIDE, ANNULE, REJETE");
            }
        }
    }



}
