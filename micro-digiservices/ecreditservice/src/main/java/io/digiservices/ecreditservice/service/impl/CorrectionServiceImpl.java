package io.digiservices.ecreditservice.service.impl;

import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.ecreditservice.dto.PersonnePhysique;
import io.digiservices.ecreditservice.repository.CorrectionRepository;
import io.digiservices.ecreditservice.service.CorrectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
