package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface DemandeIndRepository {

    void addNewDemandeInd(DemandeIndividuel demandeIndividuel);

    List<DemandeIndividuel> getListDemandeAttente(Long pointventeId,Long agenceId);

    List<DemandeIndividuel> getListDemandeAttenteNotification(Long pointventeId,Long agenceId);

    void updateStatutDemandeInd(Long demandeindividuel_id, String statut, String codUsuarios);

    DemandeIndividuel getDetailDemandeIndividuel(Long demandeIndividuelId);

    List<DemandeIndividuel> getListDemandeCreditByDate(Long pointventeId);

    Boolean existMembre(String numeroMembre);

    DemandeIndividuel getLastDemandeInd(String numeroMembre);

    void addNewCredit(String numeroMembre,Long userId);

    List<CreditDto> getListCreditAttente(Long agenceId);


      InstanceCreditInd getInstanceCredit(String referenceCredit);


    List<ProductInd> getListProductByRef(String referenceCredit);

    List<ChargeInd> getListChargeByRef(String referenceCredit);

    List<Garantiepersonnecaution> getListGarantiePersonneCautionByRef(String referenceCredit);

    void addNoteProfile(String referenceCredit,NoteProfile noteProfile);

    void addNoteAnalyse(String referenceCredit,NoteAnalyse noteAnalyse);

    void addNoteGarantie(String referenceCredit,NoteGarantie noteGarantie);

    NoteProfile getLastNoteProfile(String referenceCredit);

    NoteAnalyse getLastNoteAnalyse(String referenceCredit);

    NoteGarantie getLasteGarantie(String referenceCredit);

    ResultNote calculate_notes_and_update_credit(BigDecimal threshold, Appreciation appreciation);

    List<CreditDto> getListCreditByPos(Long pointventeId);

    Integer countNombreCreditAttente(Long pointventeId);

    Appreciation getAppreciation(String referenceCredit);

    void updateStateCredit(String referenceCredit);

    CreditDto getNewCreditByReference(String referenceCredit);
    CreditDto getCreditByReference(String referenceCredit);

    List<DemandeCredit> listDemandeAnalyseCreditByUserId();
}
