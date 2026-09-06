package io.digiservices.ecreditservice.drh.service;

import io.digiservices.ecreditservice.drh.dto.DrhDtos.*;
import io.digiservices.clients.domain.User;

import java.util.List;
import java.util.Map;

public interface DrhService {

    // Organisation
    ContexteDrhDto contexteDe(User user);
    List<DepartementDto> listeDepartements();
    Long creerDepartement(DepartementRequest request);
    void modifierDepartement(Long departementId, DepartementRequest request);
    List<MembreDto> listeMembres(Long departementId);
    Long affecterMembre(AffectationRequest request);
    void retirerMembre(Long membreId);
    List<Map<String, Object>> usersNonAffectes();
    Map<String, Object> verifierMatricule(String matricule);

    // Prévision — agent
    PrevisionDto maPrevision(User user, int exercice);
    PrevisionDto enregistrerPrevision(User user, PrevisionRequest request);
    PrevisionDto soumettre(User user, int exercice);

    // Prévision — responsable de département
    List<PrevisionDto> previsionsDeMonDepartement(User responsable, int exercice);
    PrevisionDto accepter(User responsable, Long previsionId);
    PrevisionDto rejeter(User responsable, Long previsionId, String motif);
    PrevisionDto reajuster(User responsable, Long previsionId, PrevisionRequest request);

    // Prévision — DRH
    List<PrevisionDto> previsionsAValider(User drh, int exercice);
    PrevisionDto validerDrh(User drh, Long previsionId);
    PrevisionDto renvoyerDrh(User drh, Long previsionId, String motif);
}
