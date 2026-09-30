package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.MotifCorrection;
import io.digiservices.ecreditservice.dto.PersonnePhysique;
import io.digiservices.ecreditservice.dto.CorrectionDelegationStat;
import io.digiservices.ecreditservice.dto.CorrectionAgenceStat;
import io.digiservices.ecreditservice.dto.CorrectionPointVenteStat;
import io.digiservices.ecreditservice.dto.CorrectionEvolutionStat;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CorrectionService {
     PersonnePhysique addPersonnePhysique(PersonnePhysique personnePhysique);
     Optional<PersonnePhysique> findPersonnePhysiqueByCodClientes(String codClientes);
     PersonnePhysique updatePersonnePhysique(PersonnePhysique personnePhysique);
     boolean deletePersonnePhysique(String codClientes);

    List<PersonnePhysique> getListePPAttente(String codAgencia);

    // New MotifCorrection methods
    MotifCorrection addMotifCorrection(MotifCorrection motifCorrection);
    List<MotifCorrection> getMotifsCorrectionByClient(String codCliente);
    List<MotifCorrection> getMotifsCorrectionByPersonne(Long personnePhysiqueId);
    List<MotifCorrection> getMotifsCorrectionByAgence(String codAgence);
    MotifCorrection updateMotifStatut(Long id, String statut);
    Optional<MotifCorrection> findMotifCorrectionById(Long id);

    void updateStatutPersonnePhysique(Long idPersonnePhysique, String statut);

    List<PersonnePhysique> listRejet(String codAgencia);

    Optional<MotifCorrection> getMotifCorrectionByPersonneLast(Long personnePhysiqueId);

    List<CorrectionDelegationStat> getCorrectionStatsByDelegation(Long perimetreDelegationId, Long perimetreAgenceId);

    List<CorrectionDelegationStat> getCorrectionStatsByDelegationWithPeriod(LocalDate dateDebut, LocalDate dateFin, Long perimetreDelegationId, Long perimetreAgenceId);

    List<CorrectionAgenceStat> getCorrectionStatsByAgence(Long delegationId, java.time.LocalDate dateDebut, java.time.LocalDate dateFin, Long perimetreDelegationId, Long perimetreAgenceId);

    List<CorrectionPointVenteStat> getCorrectionStatsByPointVente(Long agenceId, java.time.LocalDate dateDebut, java.time.LocalDate dateFin, Long perimetreDelegationId, Long perimetreAgenceId);

    List<PersonnePhysique> getCorrectionsByPointVente(String codeAgence, String statut, java.time.LocalDate dateDebut, java.time.LocalDate dateFin, Long perimetreDelegationId, Long perimetreAgenceId);

    List<CorrectionEvolutionStat> getCorrectionEvolutionByDay();

    List<CorrectionEvolutionStat> getCorrectionEvolutionByWeek();
}
