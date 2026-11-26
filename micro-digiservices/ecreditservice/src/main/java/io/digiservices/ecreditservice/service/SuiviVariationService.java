package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.SuiviChangement;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.SuiviCreation;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.SuiviDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.SuiviVariationRepository;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static io.digiservices.ecreditservice.dto.PhotoEcartDtos.MODULES;

/**
 * Le suivi de correction d'une variation d'ecart (V220) : qui regarde, ce qu'il a trouve, si la
 * regularisation est passee, et si la photo suivante le confirme.
 *
 * <p>Deux regles tiennent tout. <b>Une fiche vivante par couple</b> : une nouvelle variation sur
 * un couple deja suivi rafraichit la fiche au lieu d'en ouvrir une autre. <b>La photo ferme, pas
 * la main</b> : l'etat CONFIRMEE n'est jamais accepte d'un ecran ; il est pose par
 * {@link #verifierApresPhoto} quand l'ecart du couple est revenu au niveau d'avant la variation,
 * ou a zero. Une correction que deux photos ne voient pas renvoie la fiche a « a instruire »
 * avec la mention « correction sans effet ».</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SuiviVariationService {

    public static final String A_INSTRUIRE = "A_INSTRUIRE";
    public static final String EXPLIQUEE = "EXPLIQUEE";
    public static final String CORRIGEE_SAF = "CORRIGEE_SAF";
    public static final String CONFIRMEE = "CONFIRMEE";
    public static final String STRUCTUREL = "STRUCTUREL";
    /** Les etats qu'un ecran peut poser. CONFIRMEE n'y est pas : c'est la photo qui le pose. */
    public static final Set<String> ETATS_SAISISSABLES = Set.of(A_INSTRUIRE, EXPLIQUEE, CORRIGEE_SAF, STRUCTUREL);
    /** Au bout de tant de photos sans retour de l'ecart, la correction est reputee sans effet. */
    public static final int PHOTOS_SANS_EFFET_MAX = 2;

    private final SuiviVariationRepository repository;
    private final PerimetreSafService perimetreService;
    private final HabilitationService habilitations;

    // ======================= Lecture =======================

    /** Lire : les memes droits que l'ecran, borne au perimetre. */
    public List<SuiviDto> lister(String uuid, String module, String etat) {
        habilitations.exigerUneDe(uuid, HabilitationService.EVOLUTION_ECARTS, HabilitationService.AUDIT_CAISSE);
        Perimetre perimetre = perimetreService.perimetreDe(uuid);
        List<String> codes = perimetre.toutReseau() ? null : List.copyOf(perimetre.codes());
        return repository.lister(verifierModule(module), etat == null || etat.isBlank() ? null : etat, codes);
    }

    public SuiviDto fiche(String uuid, Long id) {
        habilitations.exigerUneDe(uuid, HabilitationService.EVOLUTION_ECARTS, HabilitationService.AUDIT_CAISSE);
        Perimetre perimetre = perimetreService.perimetreDe(uuid);
        SuiviDto s = repository.parId(id).orElseThrow(() -> new ApiException("Fiche de suivi introuvable"));
        if (!perimetre.couvre(s.codAgencia())) {
            throw new ApiException("Ce point de service n'est pas dans votre perimetre");
        }
        return avecJournal(s);
    }

    /** Les fiches d'un couple avec leur journal, pour la fiche du couple dans le temps ; perimetre verifie par l'appelant. */
    public List<SuiviDto> fichesDuCouple(String module, String codAgencia, String compte) {
        return repository.parCouple(module, codAgencia, compte).stream().map(this::avecJournal).toList();
    }

    /** Les fiches vivantes d'un module, pour marquer les variations de l'onglet. */
    public Map<String, SuiviDto> vivantesParCouple(String module) {
        return repository.vivantesParCouple(module);
    }

    // ======================= Ecriture, par l'ecran =======================

    /**
     * Ouvre une fiche sur un couple, ou rafraichit la fiche vivante s'il y en a deja une.
     * Rend la fiche a jour.
     */
    @Transactional
    public SuiviDto ouvrir(String uuid, SuiviCreation c) {
        User user = exigerPeutEcrire(uuid, c == null ? null : c.codAgencia());
        if (c.compteComptable() == null || c.compteComptable().isBlank()) {
            throw new ApiException("Compte comptable non precise");
        }
        if (c.jourConstat() == null || c.jourReference() == null || c.variation() == null) {
            throw new ApiException("La variation constatee doit porter ses deux jours et son montant");
        }
        String module = verifierModule(c.module());
        String etat = etatSaisi(c.etat(), user);
        Optional<SuiviDto> vivante = repository.vivante(module, c.codAgencia(), c.compteComptable());
        long id;
        if (vivante.isPresent()) {
            id = vivante.get().id();
            repository.rafraichirConstat(id, c, user.getUserId());
            repository.changer(id, etat, c.explication(), c.typeOperation(), c.referenceEcriture(), user.getUserId());
            repository.journaliser(id, etat, commentaireOu(c.commentaire(),
                    "nouvelle variation constatee le " + c.jourConstat() + " : " + c.variation()), user.getUserId(), nom(user));
        } else {
            id = repository.creer(c, etat, user.getUserId());
            repository.journaliser(id, etat, commentaireOu(c.commentaire(), "fiche ouverte"), user.getUserId(), nom(user));
        }
        log.info("[SUIVI ECARTS] {} {}/{} : fiche {} -> {} par {}", module, c.codAgencia(), c.compteComptable(), id, etat, nom(user));
        return avecJournal(repository.parId(id).orElseThrow());
    }

    /** Fait avancer une fiche vivante. */
    @Transactional
    public SuiviDto changer(String uuid, Long id, SuiviChangement ch) {
        SuiviDto s = repository.parId(id).orElseThrow(() -> new ApiException("Fiche de suivi introuvable"));
        User user = exigerPeutEcrire(uuid, s.codAgencia());
        if (CONFIRMEE.equals(s.etat())) {
            throw new ApiException("Cette fiche est confirmee par la photo : ouvrez-en une nouvelle si l'ecart revient");
        }
        String etat = etatSaisi(ch == null ? null : ch.etat(), user);
        if (CORRIGEE_SAF.equals(etat) && blanc(ch.referenceEcriture()) && blanc(s.referenceEcriture())) {
            throw new ApiException("« Corrigee dans SAF » demande la reference de l'ecriture de regularisation");
        }
        repository.changer(id, etat, ch.explication(), ch.typeOperation(), ch.referenceEcriture(), user.getUserId());
        repository.journaliser(id, etat, ch.commentaire(), user.getUserId(), nom(user));
        log.info("[SUIVI ECARTS] fiche {} -> {} par {}", id, etat, nom(user));
        return avecJournal(repository.parId(id).orElseThrow());
    }

    // ======================= Verification par la photo =======================

    /**
     * A chaque photo recue : les fiches « corrigee dans SAF » du module sont confrontees a
     * l'ecart du couple dans cette photo.
     *
     * <p>Confirmee si l'ecart est revenu au niveau d'avant la variation (en valeur absolue), ou
     * a zero. Sinon la photo compte pour « sans effet » ; a la deuxieme, la fiche revient a
     * « a instruire ». Seules comptent les photos posterieures au jour de la correction : la
     * copie SAF lue le matin est celle de la veille. Un point de service non lu dans la photo
     * ne decide rien.</p>
     *
     * <p>Ne leve jamais : une erreur ici ne doit pas refuser la photo.</p>
     */
    public int verifierApresPhoto(String module, LocalDate jour) {
        int decisions = 0;
        try {
            for (SuiviDto s : repository.aVerifier(module)) {
                if (s.corrigeeLe() != null && !jour.isAfter(s.corrigeeLe().toLocalDate())) {
                    continue;
                }
                if (s.jourDernier() != null && !jour.isAfter(s.jourDernier())) {
                    continue;
                }
                Optional<BigDecimal> ecart = repository.ecartDansPhoto(module, jour, s.codAgencia(), s.compteComptable());
                if (ecart.isEmpty()) {
                    continue;
                }
                boolean confirmee = revenue(ecart.get(), s.ecartReference());
                int sansEffet = (s.photosSansEffet() == null ? 0 : s.photosSansEffet()) + 1;
                boolean retour = !confirmee && sansEffet >= PHOTOS_SANS_EFFET_MAX;
                repository.noterVerification(s.id(), jour, ecart.get(), confirmee, retour);
                if (confirmee) {
                    repository.journaliser(s.id(), CONFIRMEE, "ecart revenu a " + ecart.get()
                            + " (niveau d'avant la variation : " + s.ecartReference() + ")", null, "photo du " + jour);
                } else if (retour) {
                    repository.journaliser(s.id(), A_INSTRUIRE, "correction sans effet : ecart toujours a "
                            + ecart.get() + " apres " + sansEffet + " photos", null, "photo du " + jour);
                }
                decisions++;
            }
        } catch (RuntimeException e) {
            log.warn("[SUIVI ECARTS] verification apres la photo {} {} impossible : {}", module, jour, e.getMessage());
        }
        return decisions;
    }

    /** Revenue : a zero, ou au niveau d'avant la variation (ou mieux), en valeur absolue. */
    static boolean revenue(BigDecimal ecartDuJour, BigDecimal ecartReference) {
        if (ecartDuJour == null || ecartDuJour.signum() == 0) {
            return true;
        }
        BigDecimal cible = ecartReference == null ? BigDecimal.ZERO : ecartReference.abs();
        return ecartDuJour.abs().compareTo(cible) <= 0;
    }

    // ======================= Gardes =======================

    /**
     * Ecrire : la rubrique SUIVI_ECARTS (DSIG operationnel, comptabilite), jamais l'Audit, et le
     * point de service dans le perimetre.
     */
    private User exigerPeutEcrire(String uuid, String codAgencia) {
        Perimetre perimetre = perimetreService.perimetreDe(uuid);
        if (perimetre.lectureSeule() || !habilitations.peut(uuid, HabilitationService.SUIVI_ECARTS)) {
            throw new ApiException("Le suivi de correction s'ecrit par la DSIG et la comptabilite ; "
                    + "cet ecran se consulte sans etre modifie");
        }
        if (codAgencia == null || codAgencia.isBlank()) {
            throw new ApiException("Point de service non precise");
        }
        if (!perimetre.couvre(codAgencia)) {
            throw new ApiException("Ce point de service n'est pas dans votre perimetre");
        }
        return perimetre.user();
    }

    /** L'etat demande par l'ecran : saisissable, et STRUCTUREL reserve a la Direction financiere. */
    static String etatSaisi(String etat, User user) {
        String e = etat == null || etat.isBlank() ? A_INSTRUIRE : etat.trim().toUpperCase();
        if (!ETATS_SAISISSABLES.contains(e)) {
            throw new ApiException(CONFIRMEE.equals(e)
                    ? "La confirmation est posee par la photo suivante, pas a la main"
                    : "Etat inconnu : attendu " + ETATS_SAISISSABLES);
        }
        if (STRUCTUREL.equals(e) && !peutAccepterStructurel(user)) {
            throw new ApiException("L'acceptation d'un ecart structurel revient a la Direction financiere");
        }
        return e;
    }

    static boolean peutAccepterStructurel(User user) {
        return user != null && ("SUPER_ADMIN".equals(user.getRole())
                || PerimetreSafService.SERVICE_DF.equals(user.getService()));
    }

    private SuiviDto avecJournal(SuiviDto s) {
        return new SuiviDto(s.id(), s.module(), s.codAgencia(), s.libellePoint(), s.compteComptable(),
                s.jourConstat(), s.jourReference(), s.ecartReference(), s.ecartConstat(), s.variation(),
                s.etat(), s.explication(), s.typeOperation(), s.referenceEcriture(),
                s.creePar(), s.creeLe(), s.modifiePar(), s.modifieLe(), s.corrigeeLe(),
                s.jourDernier(), s.ecartDernier(), s.photosSansEffet(), s.confirmeeLe(), s.jourConfirmation(),
                repository.evenements(s.id()));
    }

    private static String verifierModule(String module) {
        String m = module == null ? "" : module.trim().toUpperCase();
        if (!MODULES.contains(m)) {
            throw new ApiException("Module inconnu : attendu " + MODULES);
        }
        return m;
    }

    private static String nom(User user) {
        String n = ((user.getFirstName() == null ? "" : user.getFirstName()) + " "
                + (user.getLastName() == null ? "" : user.getLastName())).trim();
        return n.isEmpty() ? (user.getUsername() == null ? "compte " + user.getUserId() : user.getUsername()) : n;
    }

    private static String commentaireOu(String commentaire, String defaut) {
        return blanc(commentaire) ? defaut : commentaire;
    }

    private static boolean blanc(String s) {
        return s == null || s.isBlank();
    }
}
