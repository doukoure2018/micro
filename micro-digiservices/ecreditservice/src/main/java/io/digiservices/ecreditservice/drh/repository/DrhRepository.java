package io.digiservices.ecreditservice.drh.repository;

import io.digiservices.ecreditservice.drh.dto.DrhDtos.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface DrhRepository {

    // Départements
    List<DepartementDto> listeDepartements();
    Long creerDepartement(DepartementRequest request);
    void modifierDepartement(Long departementId, DepartementRequest request);
    String libelleDepartement(Long departementId);

    // Membres
    List<MembreDto> listeMembres(Long departementId);
    Long affecterMembre(AffectationRequest request);
    void retirerMembre(Long membreId);
    Optional<MembreDto> membreActifDeUser(Long userId);
    List<Map<String, Object>> usersNonAffectes();
    Optional<Map<String, Object>> personnelParMatricule(String matricule);
    boolean estMembreDepartementDrh(Long userId);

    // ===== V154 : délégations =====
    List<String> fonctionsDelegueesDe(Long userId);
    List<DelegationDto> listeDelegations(boolean activesSeulement);
    Optional<DelegationDto> delegationById(Long delegationId);
    Long creerDelegation(Long delegueUserId, String fonction, Long attribueePar, LocalDate dateFin, String commentaire);
    int revoquerDelegation(Long delegationId, Long revoqueePar);
    Optional<Long> dgaActif();
    boolean estResponsableActif(Long userId);
    List<CandidatDelegationDto> candidatsDelegation();
    List<PrevisionDto> previsionsDesResponsables(int exercice);

    // Prévisions
    Optional<PrevisionDto> previsionDeUser(Long userId, int exercice);
    Optional<PrevisionDto> previsionById(Long previsionId);
    List<PrevisionDto> previsionsDuDepartement(Long departementId, int exercice);
    List<PrevisionDto> previsionsAValiderDrh(int exercice);
    List<PrevisionDto> previsionsToutes(int exercice, Long departementId);
    Long creerPrevision(Long userId, Long departementId, int exercice, String commentaire);
    void majCommentaire(Long previsionId, String commentaire);
    void majStatut(Long previsionId, String statut, String motifRejet,
                   boolean marquerSoumise, Long traiteeRespPar, Long valideeDrhPar);
    void remplacerPeriodes(Long previsionId, List<PeriodeDto> periodes);
    List<PeriodeDto> periodesDePrevision(Long previsionId);

    // Référentiels & notifications
    List<LocalDate> joursFeries(LocalDate debut, LocalDate fin);
    List<Map<String, Object>> joursFeriesExercice(int exercice);
    int parametreInt(String cle, int defaut);
    /** V155 : paramètre texte (ex. CONGE_REPORT_DATE_LIMITE = 06-30). */
    String parametreTexte(String cle, String defaut);
    List<String> telephonesResponsables(Long departementId);
    List<String> telephonesDrh();
    Optional<String> telephoneUser(Long userId);
}
