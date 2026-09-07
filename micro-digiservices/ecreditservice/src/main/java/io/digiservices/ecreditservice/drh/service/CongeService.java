package io.digiservices.ecreditservice.drh.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.drh.dto.CongeDtos.*;

import java.util.List;

public interface CongeService {

    // Agent
    SoldeCongeDto monSolde(User user, int exercice);
    List<DemandeCongeDto> mesDemandes(User user, int exercice);
    DemandeCongeDto creerDemande(User user, DemandeCongeRequest request);

    // Responsable de département
    List<DemandeCongeDto> demandesDeMonDepartement(User responsable, int exercice);
    DemandeCongeDto accepter(User responsable, Long demandeId);
    DemandeCongeDto rejeter(User responsable, Long demandeId, String motif);
    DemandeCongeDto interrompre(User acteur, Long demandeId, InterruptionRequest request);
    DemandeCongeDto annuler(User acteur, Long demandeId, String motif);

    // DRH
    List<DemandeCongeDto> demandesAValider(User drh, int exercice);
    DemandeCongeDto validerDrh(User drh, Long demandeId);
    DemandeCongeDto renvoyerDrh(User drh, Long demandeId, String motif);
}
