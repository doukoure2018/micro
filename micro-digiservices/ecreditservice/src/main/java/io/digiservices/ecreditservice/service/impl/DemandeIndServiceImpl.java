package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.DemandeIndRepository;
import io.digiservices.ecreditservice.exception.ValidationException;
import io.digiservices.ecreditservice.service.AnalyseChargesFonctionnaireService;
import io.digiservices.ecreditservice.service.DemandeIndService;
import io.digiservices.ecreditservice.validation.CreditFonctionnaireValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DemandeIndServiceImpl implements DemandeIndService {
    private final DemandeIndRepository demandeIndRepository;
    private final AnalyseChargesFonctionnaireService analyseChargesFonctionnaireService;
    @Override
    public void addDemandeInd(DemandeIndividuel demandeIndividuel) {
        // Anti-doublon : un membre ne peut pas avoir deux demandes en cours simultanément
        // (ni rejetée, ni définitivement validée = en cours). Le DA peut rejeter la
        // demande existante pour permettre une nouvelle saisie.
        String numeroMembre = demandeIndividuel.getNumeroMembre();
        if (numeroMembre != null && !numeroMembre.isBlank()) {
            demandeIndRepository.findDemandeEnCours(numeroMembre.trim()).ifPresent(existante -> {
                throw new ValidationException(String.format(
                        "Doublon refusé : le membre %s a déjà une demande de crédit en cours (n° %d, %s %s, montant %s, état %s, créée le %s). "
                                + "Faites aboutir ou rejeter cette demande avant d'en créer une nouvelle.",
                        numeroMembre, existante.getDemandeIndividuelId(),
                        existante.getPrenom(), existante.getNom(),
                        existante.getMontantDemande(), existante.getValidationState(),
                        existante.getCreatedAt() != null ? existante.getCreatedAt().toLocalDate() : "N/A"));
            });
        }
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
        // Crédit fonctionnaire : l'approbation AC est bloquée si l'analyse charges
        // & quotité n'est pas finançable (même règle que le workflow approuver-ac)
        if ("APPROVED".equals(statut)) {
            analyseChargesFonctionnaireService.verifierFinancableSiFonctionnaire(demandeindividuel_id);
        }
        demandeIndRepository.updateStatutDemandeInd(demandeindividuel_id,statut,codUsuarios);
    }

    @Override
    public Optional<DemandeIndividuel> getDemandeEnCours(String numeroMembre) {
        return demandeIndRepository.findDemandeEnCours(numeroMembre);
    }

    /**
     * Transformation d'un crédit existant en crédit fonctionnaire : requalification de
     * la nature + type 7 et pose de l'extension (emploi, salaire, domiciliation).
     * Les verrous de circuit (périodicité, quotité vs échéance, analyse charges) ne sont
     * PAS réappliqués : le crédit est déjà mis en place, il s'agit d'une requalification.
     */
    @Override
    @Transactional
    public void transformerEnFonctionnaire(Long demandeindividuelId, DemandeFonctionnaire extension) {
        String nature = demandeIndRepository.getNatureClient(demandeindividuelId);
        if (nature == null) {
            throw new ApiException("Demande non trouvée");
        }
        if (CreditFonctionnaireValidator.NATURE_FONCTIONNAIRE.equals(nature)) {
            throw new ValidationException("Cette demande est déjà un crédit fonctionnaire");
        }
        CreditFonctionnaireValidator.validateExtension(extension);
        demandeIndRepository.transformerEnFonctionnaire(demandeindividuelId, extension);
        log.info("Demande {} transformée en crédit fonctionnaire (ancienne nature : {})", demandeindividuelId, nature);
    }

    @Override
    public void rejetDemandeInd(Long demandeindividuel_id) {
        demandeIndRepository.rejetDemandeInd(demandeindividuel_id);
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

    @Override
    @Transactional
    public DemandeResponse addDemandeIndWithGaranties(DemandeIndividuel demandeIndividuel)
    {
        log.info("Création d'une nouvelle demande avec {} garanties",
                demandeIndividuel.getGaranties() != null ? demandeIndividuel.getGaranties().size() : 0);

        // Validation des données
        validateDemandeData(demandeIndividuel);
        // Calcul automatique de l'échéance si nécessaire
        if (demandeIndividuel.getEcheance() == null) {
            calculateEcheance(demandeIndividuel);
        }
        // Appel au repository
        return demandeIndRepository.addNewDemandeIndWithGaranties(demandeIndividuel);
    }
    @Override
    public DemandeIndividuel getDemandeWithGaranties(Long demandeId) {
        DemandeIndividuel demande = demandeIndRepository.getDemandeWithGaranties(demandeId);
        // Verrou d'affectation : le front a besoin de l'agent propriétaire (id + nom)
        demandeIndRepository.completerAgentAffecte(demande);
        // Nature Groupe Solidaire : extension + membres
        demandeIndRepository.completerGroupe(demande);
        return demande;
    }

    @Override
    public List<DemandeIndividuel> getAllDemandesWithGaranties(Long agenceId, Long pointVenteId) {
        log.info("Récupération des demandes pour agence: {}, point de vente: {}", agenceId, pointVenteId);

        return demandeIndRepository.getAllDemandesWithGaranties(agenceId, pointVenteId);
    }

    @Override
    public List<DelegationCreditDto> listCreditParDelegation() {
        log.info("Service: Getting credits grouped by delegation");
        return demandeIndRepository.listCreditParDelegation();
    }


    private void validateDemandeData(DemandeIndividuel demande) {
        // Validation métier
        if (demande.getMontantDemande() == null || demande.getMontantDemande().doubleValue() <= 0) {
            throw new IllegalArgumentException("Le montant demandé doit être supérieur à 0");
        }

        if (demande.getDureeDemande() == null || demande.getDureeDemande() <= 0) {
            throw new IllegalArgumentException("La durée du prêt doit être supérieure à 0");
        }

        // Autres validations...
    }

    private void calculateEcheance(DemandeIndividuel demande) {
        // Calcul de l'échéance mensuelle
        // Formule simplifiée - à adapter selon vos besoins
        double montant = demande.getMontantDemande().doubleValue();
        double tauxMensuel = demande.getTauxInteret().doubleValue() / 100 / 12;
        int nbEcheances = demande.getNombreEcheance() != null ? demande.getNombreEcheance() : demande.getDureeDemande();

        double echeance = (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -nbEcheances));
        demande.setEcheance(BigDecimal.valueOf(echeance));
    }

    @Override
    @Transactional
    public void updateDemandeComplete(DemandeIndividuel demande) {
        log.info("Mise a jour complete de la demande {}", demande.getDemandeIndividuelId());
        validateDemandeData(demande);
        if (demande.getEcheance() == null) {
            calculateEcheance(demande);
        }
        demandeIndRepository.updateDemandeComplete(demande);
    }

}
