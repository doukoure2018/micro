package io.digiservices.ecreditservice.drh.service;

import io.digiservices.ecreditservice.drh.dto.DrhDtos.*;
import io.digiservices.clients.domain.User;

import java.util.List;
import java.util.Map;

public interface DrhService {

    // Organisation
    ContexteDrhDto contexteDe(User user);
    boolean estHabiliteDrh(User user);

    // ===== V154 : habilitations par fonction (profil DRH, délégués, DGA) =====
    /** Fonctions : VALIDATION_CONGES, VALIDATION_PREVISIONS, PRESENCES, MOUVEMENTS, ORGANISATION, PERSONNEL, AVANCES, VALIDATION_FINALE. */
    boolean aHabilitation(User user, String fonction);
    /** Lecture seule : comme aHabilitation, plus le DGA sur PRESENCES et MOUVEMENTS. */
    boolean aHabilitationLecture(User user, String fonction);
    boolean estDga(User user);
    List<DelegationDto> listeDelegations(User admin, boolean activesSeulement);
    DelegationDto creerDelegation(User admin, DelegationRequest request);
    void revoquerDelegation(User admin, Long delegationId);
    List<CandidatDelegationDto> candidatsDelegation(User admin, String fonction);
    List<ResultatLotDto> validerPrevisionsLot(User drh, List<Long> ids);
    List<ResultatLotDto> accepterPrevisionsLot(User responsable, List<Long> ids);
    List<DepartementDto> listeDepartements();
    Long creerDepartement(DepartementRequest request);
    void modifierDepartement(Long departementId, DepartementRequest request);
    List<MembreDto> listeMembres(Long departementId);
    Long affecterMembre(AffectationRequest request);
    void retirerMembre(Long membreId);
    List<Map<String, Object>> usersNonAffectes();
    Map<String, Object> verifierMatricule(String matricule);
    List<Map<String, Object>> joursFeries(int exercice);

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
    List<PrevisionDto> previsionsToutes(User drh, int exercice, Long departementId);
    PrevisionDto validerDrh(User drh, Long previsionId);
    PrevisionDto renvoyerDrh(User drh, Long previsionId, String motif);
}
