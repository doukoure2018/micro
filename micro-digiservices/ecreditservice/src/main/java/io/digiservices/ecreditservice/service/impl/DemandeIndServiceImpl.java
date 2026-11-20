package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.DemandeIndRepository;
import io.digiservices.ecreditservice.exception.ValidationException;
import io.digiservices.ecreditservice.service.AnalyseChargesFonctionnaireService;
import io.digiservices.ecreditservice.service.DemandeIndService;
import io.digiservices.ecreditservice.validation.CreditFonctionnaireValidator;
import io.digiservices.ecreditservice.utils.EcheancierCalculateur;
import io.digiservices.ecreditservice.validation.CreditGroupeValidator;
import java.time.LocalDateTime;
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
    private final io.digiservices.ecreditservice.service.AnalyseCreditAgricoleService analyseCreditAgricoleService;
    @Override
    public void addDemandeInd(DemandeIndividuel demandeIndividuel) {
        refuserSiDemandeEnCours(demandeIndividuel.getNumeroMembre());
        demandeIndRepository.addNewDemandeInd(demandeIndividuel);
    }

    /**
     * Fenêtre du refus strict : une demande vivante plus récente que ce délai bloque toute
     * nouvelle saisie du même membre. Au-delà, l'ancienne demande est présumée oubliée dans
     * digi (crédit mis en place dans SAF puis dossier jamais finalisé : 777 demandes de plus de
     * 90 jours le 20/11/2026, dont 550 en SELECTION) et la saisie passe, avec avertissement et
     * trace, pour ne pas bloquer un renouvellement après remboursement. Arbitrage DSIG du
     * 20/11/2026 : 62 des 67 membres en doublon avaient resaisi en moins de 30 jours.
     */
    public static final int JOURS_REFUS_DOUBLON = 30;

    /** La demande vivante est-elle assez récente pour bloquer une nouvelle saisie ? */
    public static boolean doublonBloquant(DemandeIndividuel existante) {
        if (existante == null) return false;
        if (existante.getCreatedAt() == null) return true;   // date inconnue : prudence
        return !existante.getCreatedAt().isBefore(LocalDateTime.now().minusDays(JOURS_REFUS_DOUBLON));
    }

    /**
     * Anti-doublon : un membre ne peut pas avoir deux demandes en cours (ni rejetée, ni annulée,
     * ni définitivement validée = en cours). La garde vivait dans {@link #addDemandeInd}, que
     * plus personne n'appelle : le formulaire passe par {@link #addDemandeIndWithGaranties}, qui
     * ne contrôlait rien. Résultat mesuré le 20/11/2026 en production : 69 membres avec 180
     * demandes vivantes, dont un groupe saisi 24 fois en 1 h 40 (dossiers 11416 à 11449) parce
     * que l'agent d'accueil ne voyait pas sa demande partir et recommençait. Depuis la V216,
     * un doublon se règle par « Annuler le dossier » (le DA à l'accueil), jamais par une
     * nouvelle saisie. Règle à deux vitesses : refus si la demande vivante a moins de
     * {@link #JOURS_REFUS_DOUBLON} jours, passage tracé au-delà.
     */
    public void refuserSiDemandeEnCours(String numeroMembre) {
        if (numeroMembre == null || numeroMembre.isBlank()) return;
        String numero = numeroMembre.trim();
        demandeIndRepository.findDemandeEnCours(numero).ifPresent(existante -> {
            if (!doublonBloquant(existante)) {
                log.warn("[ANTI-DOUBLON] membre {} : nouvelle saisie acceptée malgré la demande n° {} ({}, créée le {}) "
                                + "de plus de {} jours encore ouverte — à régulariser (mise en place SAF ou annulation DA)",
                        numero, existante.getDemandeIndividuelId(), existante.getValidationState(),
                        existante.getCreatedAt() == null ? "?" : existante.getCreatedAt().toLocalDate(), JOURS_REFUS_DOUBLON);
                return;
            }
            throw new ValidationException(String.format(
                    "Doublon refusé : le membre %s a déjà une demande de crédit en cours, la n° %d (%s %s, %s GNF, étape %s, saisie le %s). "
                            + "Cette demande suit déjà son circuit : ne la ressaisissez pas. "
                            + "Si c'est un doublon ou une erreur, demandez au Directeur d'Agence de l'annuler (bouton « Annuler le dossier »), "
                            + "puis recommencez.",
                    numero, existante.getDemandeIndividuelId(),
                    existante.getPrenom() == null ? "" : existante.getPrenom(),
                    existante.getNom() == null ? "" : existante.getNom(),
                    existante.getMontantDemande(),
                    existante.getValidationState() == null ? "NOUVEAU" : existante.getValidationState(),
                    existante.getCreatedAt() != null ? existante.getCreatedAt().toLocalDate() : "date inconnue"));
        });
    }

    @Override
    public List<DemandeIndividuel> getListDemandeAttente(Long pointventeId,Long agenceId,Long userId) {
        return demandeIndRepository.getListDemandeAttente(pointventeId,agenceId,userId);
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
            analyseCreditAgricoleService.verifierFinancableSiGroupeAgricole(demandeindividuel_id);
        }
        int rows = demandeIndRepository.updateStatutDemandeInd(demandeindividuel_id,statut,codUsuarios);
        if (rows == 0) {
            String etat = null;
            try {
                etat = demandeIndRepository.getDemandeWithGaranties(demandeindividuel_id).getValidationState();
            } catch (Exception e) {
                log.warn("État du dossier {} illisible après refus d'approbation : {}", demandeindividuel_id, e.getMessage());
            }
            log.warn("Approbation refusée pour le dossier {} : état actuel {}", demandeindividuel_id, etat);
            throw new ValidationException(messageRefusApprobation(etat));
        }
    }

    /** Message métier selon l'état qui empêche l'approbation par l'agent. */
    private static String messageRefusApprobation(String etat) {
        if (etat == null) {
            return "Approbation impossible : dossier introuvable";
        }
        return switch (etat) {
            case "AFFECTEE" -> "Approbation impossible : ce dossier vous est affecté mais n'est pas encore pris en charge. "
                    + "Cliquez d'abord sur « Prendre en charge » (détail du dossier ou page « Demandes affectées par mon DA »), puis approuvez.";
            case "EN_ATTENTE_DA" -> "Approbation impossible : ce dossier attend son affectation par le Directeur d'Agence.";
            case "CORRECTION_ACCUEIL" -> "Approbation impossible : ce dossier a été renvoyé à l'accueil pour correction ; il doit être corrigé puis rediligenté.";
            case "APPROVED" -> "Ce dossier est déjà approuvé : il est chez le Directeur d'Agence.";
            case "VALIDATED_DA", "VALIDATED_DR", "PENDING_DG" -> "Approbation impossible : ce dossier est déjà en validation hiérarchique (" + etat + ").";
            case "VALIDATED_FINAL" -> "Ce dossier est déjà validé au niveau final.";
            default -> "Approbation impossible : le dossier est à l'état " + etat + ", qui ne permet pas l'approbation par l'agent.";
        };
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
    public DemandeIndividuel getDetailDemandeIndividuel(Long demandeIndividuelId) {
        return demandeIndRepository.getDetailDemandeIndividuel(demandeIndividuelId);
    }

    @Override
    public List<DemandeIndividuel> getListDemandeCreditByDate(Long pointventeId,Long userId) {
        return demandeIndRepository.getListDemandeCreditByDate(pointventeId,userId);
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
    public Integer countNombreCreditAttente(Long pointventeId,Long userId) {
        return demandeIndRepository.countNombreCreditAttente(pointventeId,userId);
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

        // Anti-doublon d'abord : le même membre ne repart pas dans le circuit tant qu'une
        // demande est vivante (voir refuserSiDemandeEnCours).
        refuserSiDemandeEnCours(demandeIndividuel.getNumeroMembre());
        // Validation des données
        validateDemandeData(demandeIndividuel);
        // Calcul automatique de l'échéance si nécessaire
        fixerEcheanceAgricole(demandeIndividuel);
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
    public List<DemandeIndividuel> getAllDemandesWithGaranties(Long agenceId, Long pointVenteId, Long userId) {
        return getAllDemandesWithGaranties(agenceId, pointVenteId, userId, "TOUS");
    }

    @Override
    public List<DemandeIndividuel> getAllDemandesWithGaranties(Long agenceId, Long pointVenteId, Long userId, String scope) {
        log.info("Récupération des demandes pour agence: {}, point de vente: {}, scope: {}", agenceId, pointVenteId, scope);
        return demandeIndRepository.getAllDemandesWithGaranties(agenceId, pointVenteId, userId, scope);
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

    /**
     * CAS / CAS-R (V147) : l'échéance retenue est la plus élevée de l'échéancier avec moratoire
     * (la 1re, qui porte les intérêts du différé), calculée ici et jamais reprise du front.
     */
    private void fixerEcheanceAgricole(DemandeIndividuel demande) {
        if (!CreditGroupeValidator.isGroupeAgricole(demande)) {
            return;
        }
        demande.setEcheance(EcheancierCalculateur.calculer(
                demande.getMontantDemande(), demande.getTauxInteret(), demande.getDureeDemande(),
                EcheancierServiceImpl.moratoireEffectif(demande.getDureeDemande(), demande.getPeriodeDiffere(), demande.getNombreEcheance()),
                demande.getNombreEcheance(), demande.getDateOctroiPrevue()).getEcheanceMax());
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
        fixerEcheanceAgricole(demande);
        if (demande.getEcheance() == null) {
            calculateEcheance(demande);
        }
        demandeIndRepository.updateDemandeComplete(demande);
    }

}
