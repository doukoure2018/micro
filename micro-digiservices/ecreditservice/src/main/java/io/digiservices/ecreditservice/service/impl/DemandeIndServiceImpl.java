package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.repository.DemandeIndRepository;
import io.digiservices.ecreditservice.service.DemandeIndService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DemandeIndServiceImpl implements DemandeIndService {
    private final DemandeIndRepository demandeIndRepository;
    @Override
    public void addDemandeInd(DemandeIndividuel demandeIndividuel) {
        demandeIndRepository.addNewDemandeInd(demandeIndividuel);
    }

    @Override
    public List<DemandeIndividuel> getListDemandeAttente(Long pointventeId,Long agenceId) {
        return demandeIndRepository.getListDemandeAttente(pointventeId,agenceId);
    }

    @Override
    public List<DemandeIndividuel> getListDemandeAttenteNotification(Long pointventeId,Long agenceId) {
        return demandeIndRepository.getListDemandeAttenteNotification(pointventeId,agenceId);
    }

    @Override
    public void updateStatutDemandeInd(Long demandeindividuel_id, String statut, String codUsuarios) {
        demandeIndRepository.updateStatutDemandeInd(demandeindividuel_id,statut,codUsuarios);
    }

    @Override
    public DemandeIndividuel getDetailDemandeIndividuel(Long demandeIndividuelId) {
        return demandeIndRepository.getDetailDemandeIndividuel(demandeIndividuelId);
    }

    @Override
    public List<DemandeIndividuel> getListDemandeCreditByDate(Long pointventeId) {
        return demandeIndRepository.getListDemandeCreditByDate(pointventeId);
    }

    @Override
    public Boolean existMembre(String numeroMembre) {
        return demandeIndRepository.existMembre(numeroMembre);
    }

    @Override
    public DemandeIndividuel getLastDemandeInd(String numeroMembre) {
        return demandeIndRepository.getLastDemandeInd(numeroMembre);
    }

    @Override
    public void addNewCredit(String numeroMembre, Long userId) {
        demandeIndRepository.addNewCredit(numeroMembre,userId);
    }

    @Override
    public List<CreditDto> getListCreditAttente(Long agenceId) {
        return demandeIndRepository.getListCreditAttente(agenceId);
    }

    @Override
    public InstanceCreditInd getInstanceCredit(String referenceCredit) {
        return demandeIndRepository.getInstanceCredit(referenceCredit);
    }

    @Override
    public List<ProductInd> getListProductByRef(String referenceCredit)
    {
        return demandeIndRepository.getListProductByRef(referenceCredit);
    }

    @Override
    public List<ChargeInd> getListChargeByRef(String referenceCredit)
    {
        return demandeIndRepository.getListChargeByRef(referenceCredit);
    }

    @Override
    public List<Garantiepersonnecaution> getListGarantiePersonneCautionByRef(String referenceCredit)
    {
        return demandeIndRepository.getListGarantiePersonneCautionByRef(referenceCredit);
    }

    @Override
    public void addNoteProfile(String referenceCredit,NoteProfile noteProfile)
    {
        demandeIndRepository.addNoteProfile(referenceCredit,noteProfile);
    }

    @Override
    public void addNoteAnalyse(String referenceCredit,NoteAnalyse noteAnalyse) {
         demandeIndRepository.addNoteAnalyse(referenceCredit,noteAnalyse);
    }

    @Override
    public void addNoteGarantie(String referenceCredit,NoteGarantie noteGarantie) {
         demandeIndRepository.addNoteGarantie(referenceCredit,noteGarantie);
    }

    @Override
    public NoteProfile getLastNoteProfile(String referenceCredit) {
        return demandeIndRepository.getLastNoteProfile(referenceCredit);
    }

    @Override
    public NoteAnalyse getLastNoteAnalyse(String referenceCredit) {
        return demandeIndRepository.getLastNoteAnalyse(referenceCredit);
    }

    @Override
    public NoteGarantie getLasteGarantie(String referenceCredit) {
        return demandeIndRepository.getLasteGarantie(referenceCredit);
    }

    @Override
    public ResultNote calculate_notes_and_update_credit(BigDecimal threshold, Appreciation appreciation) {
        return demandeIndRepository.calculate_notes_and_update_credit(threshold, appreciation);
    }

    @Override
    public List<CreditDto> getListCreditByPos(Long pointventeId) {
        return demandeIndRepository.getListCreditByPos(pointventeId);
    }

    @Override
    public Integer countNombreCreditAttente(Long pointventeId) {
        return demandeIndRepository.countNombreCreditAttente(pointventeId);
    }

    @Override
    public Appreciation getAppreciation(String referenceCredit) {
        return demandeIndRepository.getAppreciation(referenceCredit);
    }

    @Override
    public void updateStateCredit(String referenceCredit) {
        demandeIndRepository.updateStateCredit(referenceCredit);
    }

    @Override
    public CreditDto getNewCreditByReference(String referenceCredit) {
        return demandeIndRepository.getNewCreditByReference(referenceCredit);
    }

    @Override
    public CreditDto getCreditByReference(String referenceCredit) {
        return demandeIndRepository.getCreditByReference(referenceCredit);
    }

    @Override
    public List<DemandeCredit> listDemandeAnalyseCreditByUserId() {
        return demandeIndRepository.listDemandeAnalyseCreditByUserId();
    }


}
