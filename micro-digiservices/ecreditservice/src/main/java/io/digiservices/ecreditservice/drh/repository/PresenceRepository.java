package io.digiservices.ecreditservice.drh.repository;

import io.digiservices.ecreditservice.drh.dto.PresenceDtos.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

public interface PresenceRepository {

    void upsertPointage(LocalDate jour, String matricule, String nomBrut,
                        LocalTime premiereEntree, LocalTime derniereSortie);

    void insererPointageNonRapproche(LocalDate jour, String nomBrut,
                                     LocalTime premiereEntree, LocalTime derniereSortie);

    /** matricule -> [premiere_entree, derniere_sortie] pour un jour. */
    Map<String, LocalTime[]> pointagesDuJour(LocalDate jour);

    /** Personnel ACTIVE du fichier des salaires + user rattaché éventuel. */
    List<Map<String, Object>> personnelActif();

    void supprimerPresencesJour(java.time.LocalDate jour);

    void upsertPresenceJour(LocalDate jour, String matricule, String nom, Long userId,
                            String statut, int minutesRetard, int minutesDepart,
                            String justification, String observation,
                            LocalTime premiereEntree, LocalTime derniereSortie);

    // V150 : déclarations manuelles DRH
    /** matricule -> {motif, commentaire} des déclarations actives couvrant le jour. */
    Map<String, String[]> declarationsCouvrantJour(LocalDate jour);
    long insererDeclaration(DeclarationRequest req, Long declarePar, String declareParNom);
    List<DeclarationDto> declarationsPeriode(LocalDate du, LocalDate au, String matricule);
    DeclarationDto declarationParId(long id);
    int desactiverDeclaration(long id);
    List<BadgeSansPointageDto> badgesSansPointage(LocalDate depuis);

    List<PresenceJourDto> presencesPeriode(LocalDate du, LocalDate au, String statut);
    List<SyntheseJourDto> synthesePeriode(LocalDate du, LocalDate au);
    List<PointageNonRapprocheDto> pointagesNonRapproches(LocalDate du, LocalDate au);

    boolean congeCouvreJour(Long userId, LocalDate jour);
    boolean permissionCouvreJour(Long userId, LocalDate jour);

    String parametreTexte(String cle, String defaut);
    boolean matriculeConnu(String matricule);
}
