package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.CreditosClienteResponseDTO;
import io.digiservices.clients.domain.EvaluationRetrospectiveDTO;
import io.digiservices.clients.domain.EvaluationRisqueDTO;
import io.digiservices.clients.score.BaremeScoreConfiance;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.ScoreConfianceDtos.CohorteDto;
import io.digiservices.ecreditservice.dto.ScoreConfianceDtos.DegradationDto;
import io.digiservices.ecreditservice.dto.ScoreConfianceDtos.PhotoResultatDto;
import io.digiservices.ecreditservice.dto.ScoreConfianceDtos.RepartitionDto;
import io.digiservices.ecreditservice.dto.ScoreConfianceDtos.RetrospectifDto;
import io.digiservices.ecreditservice.dto.ScoreConfianceDtos.SignauxDigiDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.ScoreConfianceRepository;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

import static io.digiservices.ecreditservice.dto.ScoreConfianceDtos.ORIGINE_CONSULTATION;
import static io.digiservices.ecreditservice.dto.ScoreConfianceDtos.ORIGINE_PHOTO;
import static io.digiservices.ecreditservice.dto.ScoreConfianceDtos.ORIGINE_RETROSPECTIF;
import static io.digiservices.ecreditservice.dto.ScoreConfianceDtos.RUBRIQUE;

/**
 * Score de confiance des membres, moitie digi (lots 1 a 3).
 *
 * <p>Le e-banking tient les trois composantes que SAF sait dire. Ce service ajoute la
 * quatrieme — ce que digi sait et que SAF ignore : un dossier annule, une demande rejetee,
 * un numero de membre qui ne se verifie pas, un contentieux declare — puis arrete la classe
 * et garde la trace. Les bornes restent dans {@link BaremeScoreConfiance} : ce fichier
 * n'invente aucun seuil.</p>
 *
 * <p>Trois usages de la memoire du score : la tracabilite d'une consultation, la photo
 * mensuelle qui permet de lire le portefeuille par classe, et le test retrospectif qui dit
 * si les classes separent reellement les payeurs des defaillants. Ce dernier est le seul
 * qui autorise a faire confiance aux seuils — avant lui, ils sont une hypothese.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ScoreConfianceService {

    private final EbankingClient ebankingClient;
    private final UserClient userClient;
    private final ScoreConfianceRepository repository;
    private final HabilitationService habilitationService;
    private final PerimetreSafService perimetreSafService;
    private final AlerteDestinatairesRepository destinataires;
    private final ApplicationEventPublisher publisher;
    private final SafJobRetry safJobs;

    @Value("${score.confiance.photo.actif:true}")
    private boolean photoActive;

    @Value("${score.confiance.photo.pause-ms:40}")
    private long pauseEntreMembres;

    @Value("${score.confiance.alerte.active:false}")
    private boolean alerteActive;

    private final AtomicBoolean photoEnCours = new AtomicBoolean(false);

    // ================================================================ lot 1 : consultation

    /**
     * Historique SAF d'un membre, avec le score complete des signaux digi et trace.
     *
     * <p>Aucune barriere d'habilitation ajoutee : l'ecran existe deja et sert aux agents comme
     * aux directions. Ajouter une rubrique ici fermerait la page a ceux qui l'utilisent.</p>
     *
     * @param dossierId dossier en cours d'instruction, s'il y en a un : c'est ce qui rend la
     *                  trace utile le jour ou l'on demande quel score le DA avait sous les yeux
     */
    public CreditosClienteResponseDTO consulter(String uuid, String numeroMembre, Long dossierId) {
        CreditosClienteResponseDTO reponse = ebankingClient.obtenerCreditosYPlanPagosPorCliente(numeroMembre);
        if (reponse == null) {
            throw new ApiException("Historique crédit indisponible pour le membre " + numeroMembre);
        }

        SignauxDigiDto signaux = lireSignaux(numeroMembre);
        EvaluationRisqueDTO evaluation = finaliser(reponse.getEvaluationRisque(), signaux);
        reponse.setEvaluationRisque(evaluation);

        tracer(numeroMembre, evaluation, dossierId, uuid);
        return reponse;
    }

    /** Historique du score d'un membre, tel qu'il a ete vu et photographie. */
    public List<Map<String, Object>> historique(String numeroMembre, int limite) {
        return repository.historique(numeroMembre, Math.min(Math.max(limite, 1), 60));
    }

    /**
     * Ajoute la quatrieme composante et arrete la classe. Les signaux digi partent de dix
     * points : on ne recompense pas une absence de signal, on retire quand il y en a.
     */
    private EvaluationRisqueDTO finaliser(EvaluationRisqueDTO saf, SignauxDigiDto signaux) {
        if (saf == null) {
            return null;
        }
        if (Boolean.TRUE.equals(saf.getNouveauMembre())) {
            // Pas d'historique a noter. Un contentieux reste un contentieux, meme sans historique.
            if (signaux.contentieux()) {
                saf.setContentieux(true);
                saf.setClasse("E");
                saf.setClasseLibelle(BaremeScoreConfiance.classeLibelle("E"));
                saf.setClasseConduite(BaremeScoreConfiance.classeConduite("E"));
                saf.setNiveauRisque(BaremeScoreConfiance.classeLibelle("E"));
                saf.setAnalyseRenforcee(true);
                saf.setExplications(List.of("Contentieux déclaré sur un crédit de ce membre : classe E quel que soit le reste."));
            }
            saf.setSignauxDigiDisponibles(true);
            saf.setSignauxDigi(BaremeScoreConfiance.signauxDigi(
                    signaux.dossiersAnnules(), signaux.demandesRefusees(), signaux.membreNonVerifie()));
            return saf;
        }

        BigDecimal note = BaremeScoreConfiance.signauxDigi(
                signaux.dossiersAnnules(), signaux.demandesRefusees(), signaux.membreNonVerifie());
        BigDecimal total = BaremeScoreConfiance.total(
                saf.getPonctualite(), saf.getProfondeur(), saf.getSituation(), note,
                Boolean.TRUE.equals(saf.getRestructurationDetectee()));
        String classe = BaremeScoreConfiance.classe(total, false, signaux.contentieux());

        saf.setSignauxDigi(note);
        saf.setSignauxDigiDisponibles(true);
        saf.setContentieux(signaux.contentieux());
        saf.setScoreConfiance(total);
        saf.setPourcentageRisque(BaremeScoreConfiance.MAX_TOTAL.subtract(total).setScale(2, RoundingMode.HALF_UP));
        saf.setClasse(classe);
        saf.setClasseLibelle(BaremeScoreConfiance.classeLibelle(classe));
        saf.setClasseConduite(BaremeScoreConfiance.classeConduite(classe));
        saf.setNiveauRisque(BaremeScoreConfiance.classeLibelle(classe));
        saf.setAnalyseRenforcee(BaremeScoreConfiance.analyseRenforcee(classe));
        saf.setHistoriqueRemboursement(BaremeScoreConfiance.classeConduite(classe));

        // Les lignes que le decideur doit pouvoir relire : celles de SAF, puis la notre.
        List<String> explications = new ArrayList<>(
                saf.getExplications() == null ? List.of() : saf.getExplications());
        explications.add(signaux.vide()
                ? String.format("Signaux digi %s/10 : aucun.", note.stripTrailingZeros().toPlainString())
                : String.format("Signaux digi %s/10 : %s.", note.stripTrailingZeros().toPlainString(),
                        String.join(" ; ", signaux.faits())));
        if (signaux.contentieux()) {
            explications.add("Contentieux déclaré : classe E quel que soit le total.");
        }
        saf.setExplications(explications);
        return saf;
    }

    private SignauxDigiDto lireSignaux(String numeroMembre) {
        try {
            return repository.signauxDigi(numeroMembre, BaremeScoreConfiance.MOIS_SIGNAUX_DIGI);
        } catch (Exception e) {
            // Un score sans les signaux digi vaut mieux qu'un ecran en erreur : on le dit.
            log.warn("[SCORE] Signaux digi illisibles pour le membre {} : {}", numeroMembre, e.getMessage());
            return SignauxDigiDto.aucun();
        }
    }

    private void tracer(String numeroMembre, EvaluationRisqueDTO evaluation, Long dossierId, String uuid) {
        try {
            Long userId = null;
            if (uuid != null) {
                User user = userClient.getUserByUuid(uuid);
                userId = user == null ? null : user.getUserId();
            }
            repository.enregistrer(numeroMembre, LocalDate.now(), ORIGINE_CONSULTATION, evaluation,
                    dossierId, userId, null, null, null);
        } catch (Exception e) {
            // La trace ne doit jamais empecher la consultation.
            log.warn("[SCORE] Trace de consultation non ecrite pour {} : {}", numeroMembre, e.getMessage());
        }
    }

    // ================================================================ lot 2 : photo mensuelle

    /**
     * Photo du 1er de chaque mois, 02h10 GMT : avant la journee de travail, apres la cloture
     * de la veille. Elle lit la SAUVEGARDE SAF (une requete par membre, sans les echeanciers)
     * et non la production : une photo de masse en production se paierait en lenteur a
     * l'ouverture des agences.
     */
    @Scheduled(cron = "${score.confiance.photo.cron:0 10 2 1 * *}", zone = "GMT")
    public void photoMensuelleProgrammee() {
        if (!photoActive) {
            log.info("[SCORE] Photo mensuelle desactivee (score.confiance.photo.actif=false)");
            return;
        }
        safJobs.executer("photo mensuelle du score de confiance",
                () -> photographier(LocalDate.now().withDayOfMonth(1)));
    }

    /**
     * Relance de la photo a la main. Une photo lit SAF pour chaque membre du reseau : elle ne
     * se declenche pas sur un clic de passage, d'ou l'habilitation exigee ici — le travail
     * programme, lui, n'a pas d'appelant a verifier.
     */
    public PhotoResultatDto photographierSurDemande(String uuid, LocalDate mois) {
        habilitationService.exigerUneDe(uuid, RUBRIQUE, HabilitationService.ADMIN_OUTILS);
        return photographier(mois);
    }

    /**
     * Photographie tous les membres portant un credit affecte dans digi. Le mois est la cle :
     * relancer la photo remplace celle du mois, elle ne la double pas.
     */
    public PhotoResultatDto photographier(LocalDate mois) {
        LocalDate premierDuMois = mois.withDayOfMonth(1);
        if (!photoEnCours.compareAndSet(false, true)) {
            return new PhotoResultatDto(premierDuMois, 0, 0, 0, "Une photo est déjà en cours");
        }
        try {
            List<Map<String, Object>> membres = repository.membresAvecCreditAffecte();
            log.info("[SCORE] Photo mensuelle {} : {} membre(s) a photographier", premierDuMois, membres.size());
            repository.supprimer(ORIGINE_PHOTO, premierDuMois);

            int enregistres = 0;
            int erreurs = 0;
            for (Map<String, Object> ligne : membres) {
                String membre = texte(ligne.get("membre"));
                if (membre == null || membre.isBlank()) continue;
                try {
                    CreditosClienteResponseDTO reponse = ebankingClient.getCreditosSaf(membre);
                    EvaluationRisqueDTO evaluation = finaliser(
                            reponse == null ? null : reponse.getEvaluationRisque(), lireSignaux(membre));
                    if (evaluation == null) {
                        erreurs++;
                        continue;
                    }
                    repository.enregistrer(membre, premierDuMois, ORIGINE_PHOTO, evaluation,
                            null, null, texte(ligne.get("agence")), entier(ligne.get("agent")), null);
                    enregistres++;
                } catch (Exception e) {
                    erreurs++;
                    log.warn("[SCORE] Photo : membre {} ignore ({})", membre, e.getMessage());
                }
                pause();
            }

            String message = String.format("Photo %s : %d enregistré(s), %d erreur(s) sur %d membre(s)",
                    premierDuMois, enregistres, erreurs, membres.size());
            log.info("[SCORE] {}", message);
            alerterLesDegradations(premierDuMois);
            return new PhotoResultatDto(premierDuMois, membres.size(), enregistres, erreurs, message);
        } finally {
            photoEnCours.set(false);
        }
    }

    // ================================================================ lot 2 : calibrage

    /**
     * Test retrospectif : le score tel qu'il aurait ete a une date passee, confronte a ce qui
     * s'est produit dans les douze mois suivants.
     *
     * <p>C'est le seul test qui dit si le score vaut quelque chose, et il peut se faire sans
     * attendre : SAF porte deja les echeanciers passes et leur sort. Tant qu'il n'a pas tourne,
     * les seuils 85/70/55/40 sont une hypothese raisonnable, rien de plus.</p>
     *
     * @param limite nombre maximal de membres analyses : une lecture par membre en production,
     *               on ne lance pas le reseau entier par curiosite
     */
    public RetrospectifDto calibrer(String uuid, LocalDate dateReference, int limite) {
        habilitationService.exigerUneDe(uuid, RUBRIQUE, HabilitationService.ADMIN_OUTILS);
        if (dateReference == null || !dateReference.isBefore(LocalDate.now().minusMonths(12))) {
            throw new ApiException("La date de référence doit précéder d'au moins douze mois aujourd'hui : "
                    + "sans douze mois d'observation, il n'y a rien à mesurer");
        }

        List<Map<String, Object>> membres = repository.membresAvecCreditAffecte();
        int plafond = Math.min(Math.max(limite, 10), 2000);
        repository.supprimer(ORIGINE_RETROSPECTIF, dateReference);

        int analyses = 0;
        int sansHistorique = 0;
        int enDefaut = 0;
        for (Map<String, Object> ligne : membres) {
            if (analyses >= plafond) break;
            String membre = texte(ligne.get("membre"));
            if (membre == null || membre.isBlank()) continue;
            try {
                EvaluationRetrospectiveDTO retro = ebankingClient.evaluerScoreALaDate(membre, dateReference.toString());
                if (retro == null || retro.getEvaluation() == null) continue;
                if (retro.getDefaut12Mois() == null) {
                    // Aucune echeance dans la fenetre : rien a observer, la ligne serait du bruit.
                    continue;
                }
                EvaluationRisqueDTO evaluation = finaliser(retro.getEvaluation(), lireSignaux(membre));
                if (Boolean.TRUE.equals(evaluation.getNouveauMembre())) sansHistorique++;
                if (Boolean.TRUE.equals(retro.getDefaut12Mois())) enDefaut++;

                repository.enregistrer(membre, dateReference, ORIGINE_RETROSPECTIF, evaluation,
                        null, null, texte(ligne.get("agence")), entier(ligne.get("agent")),
                        retro.getDefaut12Mois());
                analyses++;
            } catch (Exception e) {
                log.warn("[SCORE] Calibrage : membre {} ignore ({})", membre, e.getMessage());
            }
            pause();
        }

        List<CohorteDto> cohortes = new ArrayList<>();
        for (Map<String, Object> ligne : repository.cohortes(dateReference)) {
            int nb = entierSimple(ligne.get("membres"));
            int defauts = entierSimple(ligne.get("defauts"));
            cohortes.add(new CohorteDto(texte(ligne.get("classe")), nb, defauts, taux(defauts, nb)));
        }
        cohortes.sort(Comparator.comparing(CohorteDto::classe));

        return new RetrospectifDto(dateReference, analyses, sansHistorique, enDefaut, cohortes,
                lecture(cohortes));
    }

    /**
     * La phrase qui decide : les mal notes font-ils plus defaut que les bien notes, et de
     * combien. Si l'ecart n'y est pas, ce ne sont pas les membres qu'il faut revoir, c'est
     * le bareme.
     */
    private String lecture(List<CohorteDto> cohortes) {
        int bonsMembres = 0, bonsDefauts = 0, fragilesMembres = 0, fragilesDefauts = 0;
        for (CohorteDto c : cohortes) {
            if ("A".equals(c.classe()) || "B".equals(c.classe())) {
                bonsMembres += c.membres();
                bonsDefauts += c.defauts();
            } else if ("D".equals(c.classe()) || "E".equals(c.classe())) {
                fragilesMembres += c.membres();
                fragilesDefauts += c.defauts();
            }
        }
        if (bonsMembres == 0 || fragilesMembres == 0) {
            return "Échantillon insuffisant pour conclure : il manque des membres dans les classes extrêmes.";
        }
        BigDecimal tauxBons = taux(bonsDefauts, bonsMembres);
        BigDecimal tauxFragiles = taux(fragilesDefauts, fragilesMembres);
        BigDecimal ecart = tauxFragiles.subtract(tauxBons);
        if (ecart.compareTo(BigDecimal.valueOf(10)) >= 0) {
            return String.format("Les classes séparent : %s %% de défaut en D-E contre %s %% en A-B, soit %s points d'écart. Les seuils tiennent.",
                    tauxFragiles.toPlainString(), tauxBons.toPlainString(), ecart.toPlainString());
        }
        return String.format("Les classes ne séparent pas assez : %s %% de défaut en D-E contre %s %% en A-B, soit %s points d'écart seulement. Les seuils ou les poids doivent être revus avant de s'appuyer sur la classe.",
                tauxFragiles.toPlainString(), tauxBons.toPlainString(), ecart.toPlainString());
    }

    // ================================================================ lot 3 : portefeuille

    /** Repartition des classes de la derniere photo, bornee au perimetre du compte. */
    public Map<String, Object> repartition(String uuid, LocalDate mois) {
        habilitationService.exigerUneDe(uuid, RUBRIQUE, HabilitationService.AUDIT_PORTEFEUILLE);
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        LocalDate cible = mois != null ? mois.withDayOfMonth(1)
                : repository.dernierePhoto().orElse(null);
        if (cible == null) {
            return Map.of("mois", null, "lignes", List.of(), "message",
                    "Aucune photo mensuelle disponible : la première est prise le 1er du mois.");
        }
        List<String> agences = perimetre.toutReseau() ? List.of() : List.copyOf(perimetre.codes());
        List<RepartitionDto> lignes = repository.repartition(cible, agences);
        return Map.of("mois", cible, "lignes", lignes, "niveau", perimetre.niveau());
    }

    /** Membres passes dans une classe moins bonne d'un mois sur l'autre. */
    public Map<String, Object> degradations(String uuid, LocalDate mois) {
        habilitationService.exigerUneDe(uuid, RUBRIQUE, HabilitationService.AUDIT_PORTEFEUILLE);
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        LocalDate cible = mois != null ? mois.withDayOfMonth(1)
                : repository.dernierePhoto().orElse(null);
        if (cible == null) {
            return Map.of("mois", null, "degradations", List.of());
        }
        List<String> agences = perimetre.toutReseau() ? List.of() : List.copyOf(perimetre.codes());
        List<DegradationDto> lignes = repository.degradations(cible, cible.minusMonths(1), agences);
        return Map.of("mois", cible, "degradations", lignes);
    }

    /**
     * Courriel aux directeurs d'agence concernes apres la photo : seuls les membres qui ont
     * recule, et seulement ceux de leur point de service. Desactive par defaut — une alerte
     * s'allume quand on a decide qu'elle servait.
     */
    private void alerterLesDegradations(LocalDate mois) {
        if (!alerteActive) {
            return;
        }
        try {
            List<DegradationDto> toutes = repository.degradations(mois, mois.minusMonths(1), List.of());
            if (toutes.isEmpty()) {
                log.info("[SCORE] Aucune dégradation de classe en {} : pas d'alerte", mois);
                return;
            }
            for (AlerteDestinatairesRepository.Destinataire da : destinataires.das()) {
                List<DegradationDto> siennes = toutes.stream()
                        .filter(d -> d.codAgencia() != null && da.codesSaf().contains(d.codAgencia()))
                        .toList();
                if (siennes.isEmpty()) continue;

                StringBuilder corps = new StringBuilder("<p>Membres dont la classe de confiance a reculé ce mois-ci :</p><ul>");
                for (DegradationDto d : siennes) {
                    corps.append("<li>Membre ").append(d.numeroMembre())
                            .append(" : ").append(d.classeAvant()).append(" → ").append(d.classeApres())
                            .append("</li>");
                }
                corps.append("</ul><p>Le score prépare, vous décidez : cette liste n'ouvre ni ne ferme aucun dossier.</p>");

                publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                        "email", da.email(),
                        "sujet", "Score de confiance : " + siennes.size() + " membre(s) en recul",
                        "corpsHtml", corps.toString())));
            }
        } catch (Exception e) {
            log.warn("[SCORE] Alerte de dégradation non envoyée : {}", e.getMessage());
        }
    }

    // ================================================================ outils

    private void pause() {
        if (pauseEntreMembres <= 0) return;
        try {
            Thread.sleep(pauseEntreMembres);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private static BigDecimal taux(int partie, int total) {
        if (total <= 0) return BigDecimal.ZERO;
        return BigDecimal.valueOf(partie * 100.0 / total).setScale(1, RoundingMode.HALF_UP);
    }

    private static String texte(Object valeur) {
        return valeur == null ? null : valeur.toString();
    }

    private static Long entier(Object valeur) {
        if (valeur == null) return null;
        if (valeur instanceof Number nombre) return nombre.longValue();
        return Optional.of(valeur.toString()).filter(s -> !s.isBlank()).map(Long::valueOf).orElse(null);
    }

    private static int entierSimple(Object valeur) {
        if (valeur == null) return 0;
        if (valeur instanceof Number nombre) return nombre.intValue();
        return Integer.parseInt(valeur.toString());
    }
}
