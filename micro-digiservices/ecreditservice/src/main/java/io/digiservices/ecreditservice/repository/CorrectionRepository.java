package io.digiservices.ecreditservice.repository;


import io.digiservices.ecreditservice.dto.MotifCorrection;
import io.digiservices.ecreditservice.dto.PersonnePhysique;
import io.digiservices.ecreditservice.dto.CorrectionDelegationStat;
import io.digiservices.ecreditservice.dto.CorrectionAgenceStat;
import io.digiservices.ecreditservice.dto.CorrectionPointVenteStat;
import io.digiservices.ecreditservice.dto.CorrectionEvolutionStat;

import java.util.List;
import java.util.Optional;

public interface CorrectionRepository {
    PersonnePhysique addPersonnePhysique(PersonnePhysique personnePhysique);
    Optional<PersonnePhysique> findByCodClientes(String codCliente);
    PersonnePhysique updatePersonnePhysique(PersonnePhysique personnePhysique);
    boolean deletePersonnePhysique(String codClientes);

    List<PersonnePhysique> getListePPAttente(String codAgencia);

    // New MotifCorrection methods
    MotifCorrection addMotifCorrection(MotifCorrection motifCorrection);
    Optional<MotifCorrection> findMotifCorrectionById(Long id);
    List<MotifCorrection> findMotifsCorrectionByClient(String codCliente);
    List<MotifCorrection> findMotifsCorrectionByPersonne(Long personnePhysiqueId);
    List<MotifCorrection> findMotifsCorrectionByAgence(String codAgence);
    MotifCorrection updateMotifCorrection(MotifCorrection motifCorrection);
    boolean deleteMotifCorrection(Long id);

    Optional<PersonnePhysique> findById(Long id);
    void updateCorrectionStatut(Long idPersonnePhysique, String statut);

    List<PersonnePhysique> listRejet(String codAgencia);

    Optional<MotifCorrection> findMotifsCorrectionByPersonneLast(Long personnePhysiqueId);

    List<CorrectionDelegationStat> getCorrectionStatsByDelegation();

    List<CorrectionAgenceStat> getCorrectionStatsByAgence(Long delegationId);

    List<CorrectionPointVenteStat> getCorrectionStatsByPointVente(Long agenceId);

    List<PersonnePhysique> getCorrectionsByPointVente(String codeAgence, String statut);

    List<CorrectionEvolutionStat> getCorrectionEvolutionByDay();

    List<CorrectionEvolutionStat> getCorrectionEvolutionByWeek();
}
