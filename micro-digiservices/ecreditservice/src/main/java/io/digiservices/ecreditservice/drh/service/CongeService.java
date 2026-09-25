package io.digiservices.ecreditservice.drh.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.drh.dto.DrhDtos;
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

    /** V154 : validation / acceptation groupées (un résultat par demande). */
    List<DrhDtos.ResultatLotDto> validerLot(User drh, List<Long> ids);

    // ===== V155 : interruption déclarée =====
    InterruptionDto declarerInterruption(User responsable, Long demandeId, DeclarationInterruptionRequest request);
    List<InterruptionDto> interruptionsDeMonDepartement(User responsable, int exercice);
    List<InterruptionDto> interruptionsATraiter(User drh, int exercice);
    InterruptionDto validerInterruption(User drh, Long interruptionId, TraitementInterruptionRequest request);
    InterruptionDto refuserInterruption(User drh, Long interruptionId, String motif);

    // ===== V155 : report d'exercice =====
    List<ReportCongeDto> reportsExercice(User drh, int exerciceCible);
    ClotureExerciceDto cloturerExercice(User drh, int exercice);
    /** Clôture automatique (tâche du 1er janvier) — sans acteur. */
    ClotureExerciceDto cloturerExerciceSysteme(int exercice);

    // ===== V155 : synthèse =====
    SyntheseCongesDto syntheseConges(User drh, int exercice, String periode, int valeur, Long departementId);
    List<DrhDtos.ResultatLotDto> accepterLot(User responsable, List<Long> ids);

    /** V153 : tous les congés accordés (validés / interrompus) — DRH. */
    List<DemandeCongeDto> demandesValidees(User drh, int exercice, Long departementId, Integer mois);
    DemandeCongeDto validerDrh(User drh, Long demandeId);
    DemandeCongeDto renvoyerDrh(User drh, Long demandeId, String motif);
}
