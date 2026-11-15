package io.digiservices.ecreditservice.agri.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.FicheParcelle;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.ParcelleRecue;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.ParcelleVue;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.RecolteRecue;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.VisiteCampagneRecue;
import io.digiservices.ecreditservice.agri.repository.AgriRepository;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.SortSaisie;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * La collecte agricole du terrain : la parcelle, son suivi, sa récolte (V212).
 *
 * <p>Ce que digi sait d'un crédit agricole aujourd'hui, c'est le PRÉVISIONNEL saisi au bureau
 * ({@code analyse_credit_agricole}, V125). Ce lot apporte le réalisé, et surtout le lien entre
 * les deux : une prévision tenue deux campagnes de suite dit, sur un membre, ce qu'aucun solde
 * bancaire ne dit.</p>
 *
 * <p><b>Les unités sont converties ici, et une seule fois.</b> L'agent saisit ce qu'il mesure —
 * des sacs, le plus souvent. Comparer des sacs de 50 et des sacs de 100 entre deux agences n'a
 * aucun sens : la base garde la saisie telle quelle ET ses kilogrammes.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AgriCollecteService {

    /** Les rôles qui collectent sur le terrain ; le directeur lit. */
    private static final Set<String> ROLES_COLLECTE = Set.of("AGENT_CREDIT");

    private static final Set<String> ROLES_LECTURE = Set.of("AGENT_CREDIT", "DA");

    /**
     * Le poids d'une unité, en kilogrammes. Le sac de riz guinéen se compte en 50 et en 100 ;
     * tout le reste est ramené à ces deux-là ou au kilogramme.
     */
    private static final Map<String, BigDecimal> KILOS = Map.of(
            "KG", BigDecimal.ONE,
            "SAC_50", BigDecimal.valueOf(50),
            "SAC_100", BigDecimal.valueOf(100),
            "TONNE", BigDecimal.valueOf(1000));

    /**
     * Le mois où bascule la campagne agricole. Avant avril, une saisie appartient encore à la
     * campagne ouverte l'année précédente : une récolte de février 2027 est celle de la
     * campagne 2026-2027, pas de 2027-2028.
     */
    private static final int MOIS_DEBUT_CAMPAGNE = 4;

    /** Même garde que les visites de recouvrement : une horloge de téléphone peut dériver. */
    private static final int AVANCE_MAX_HEURES = 12;

    private final AgriRepository repository;
    private final MobileRepository mobile;
    private final UserClient userClient;

    // ------------------------------------------------------------------- la parcelle

    @Transactional
    public SortSaisie declarerParcelle(String uuid, ParcelleRecue p, Long appareilId, Long lotId) {
        User agent = exigerCollecteur(uuid);
        if (p == null || estVide(p.identifiantClient())) {
            return SortSaisie.refusee(null, "Identifiant absent");
        }
        Optional<Long> deja = repository.idParcelle(p.identifiantClient());
        if (deja.isPresent()) {
            return SortSaisie.doublon(p.identifiantClient(), deja.get());
        }
        String refus = refusParcelle(p);
        if (refus != null) {
            return SortSaisie.refusee(p.identifiantClient(), refus);
        }
        String campagne = campagneDe(p.dateSemis() == null
                ? p.saisieAt().toLocalDate() : p.dateSemis());
        Long id = repository.enregistrerParcelle(p, campagne, agent.getUserId(), appareilId, lotId);
        log.info("[AGRI] parcelle {} ({} {} ha) du membre {} par l'agent {}",
                id, p.culture(), p.surfaceHa(), p.codCliente(), agent.getUserId());
        return SortSaisie.acceptee(p.identifiantClient(), id);
    }

    private String refusParcelle(ParcelleRecue p) {
        if (estVide(p.codCliente())) {
            return "Numero de membre absent";
        }
        if (estVide(p.culture()) || !mobile.codesActifs("CULTURE").contains(p.culture())) {
            return "Culture inconnue";
        }
        if (p.surfaceHa() != null
                && (p.surfaceHa().signum() <= 0 || p.surfaceHa().compareTo(BigDecimal.valueOf(500)) > 0)) {
            return "Surface hors des bornes (0 a 500 ha)";
        }
        return refusDate(p.saisieAt());
    }

    // ------------------------------------------------------------- la visite de campagne

    @Transactional
    public SortSaisie enregistrerVisite(String uuid, VisiteCampagneRecue v, Long appareilId, Long lotId) {
        User agent = exigerCollecteur(uuid);
        if (v == null || estVide(v.identifiantClient())) {
            return SortSaisie.refusee(null, "Identifiant absent");
        }
        Optional<Long> deja = repository.idVisiteCampagne(v.identifiantClient());
        if (deja.isPresent()) {
            return SortSaisie.doublon(v.identifiantClient(), deja.get());
        }
        Optional<Long> parcelle = repository.idParcelle(v.parcelleIdentifiant());
        if (parcelle.isEmpty()) {
            // Refus TEMPORAIRE : la parcelle n'est pas encore arrivée, le téléphone réessaiera.
            return SortSaisie.refusee(v.identifiantClient(), "Parcelle pas encore transmise");
        }
        String refus = refusVisite(v);
        if (refus != null) {
            return SortSaisie.refusee(v.identifiantClient(), refus);
        }
        Long id = repository.enregistrerVisite(v, parcelle.get(), agent.getUserId(), appareilId, lotId);
        return SortSaisie.acceptee(v.identifiantClient(), id);
    }

    private String refusVisite(VisiteCampagneRecue v) {
        if (estVide(v.stade()) || !mobile.codesActifs("STADE_CAMPAGNE").contains(v.stade())) {
            return "Stade inconnu";
        }
        if (estVide(v.etatCulture()) || !mobile.codesActifs("ETAT_CULTURE").contains(v.etatCulture())) {
            return "Etat de culture inconnu";
        }
        boolean degrade = "PERDU".equals(v.etatCulture()) || "FAIBLE".equals(v.etatCulture());
        if (degrade && estVide(v.sinistre())) {
            // C'est la cause qui sert au crédit suivant, pas le constat.
            return "Une culture faible ou perdue demande sa cause";
        }
        if (!estVide(v.sinistre()) && !mobile.codesActifs("SINISTRE").contains(v.sinistre())) {
            return "Sinistre inconnu";
        }
        return refusDate(v.saisieAt());
    }

    // --------------------------------------------------------------------- la récolte

    @Transactional
    public SortSaisie enregistrerRecolte(String uuid, RecolteRecue r, Long appareilId, Long lotId) {
        User agent = exigerCollecteur(uuid);
        if (r == null || estVide(r.identifiantClient())) {
            return SortSaisie.refusee(null, "Identifiant absent");
        }
        Optional<Long> deja = repository.idRecolte(r.identifiantClient());
        if (deja.isPresent()) {
            return SortSaisie.doublon(r.identifiantClient(), deja.get());
        }
        Optional<Long> parcelle = repository.idParcelle(r.parcelleIdentifiant());
        if (parcelle.isEmpty()) {
            return SortSaisie.refusee(r.identifiantClient(), "Parcelle pas encore transmise");
        }
        Optional<Long> dejaRecoltee = repository.recolteDeLaParcelle(parcelle.get());
        if (dejaRecoltee.isPresent()) {
            // Ce n'est pas un doublon de transmission : c'est une seconde récolte saisie sur la
            // même parcelle. Le dire clairement plutôt que de l'avaler.
            return SortSaisie.refusee(r.identifiantClient(),
                    "Cette parcelle porte deja une recolte");
        }
        String refus = refusRecolte(r);
        if (refus != null) {
            return SortSaisie.refusee(r.identifiantClient(), refus);
        }
        BigDecimal kg = enKilos(r.quantite(), r.unite());
        Long id = repository.enregistrerRecolte(r, parcelle.get(), kg, agent.getUserId(),
                appareilId, lotId);
        log.info("[AGRI] recolte {} : {} {} = {} kg", id, r.quantite(), r.unite(), kg);
        return SortSaisie.acceptee(r.identifiantClient(), id);
    }

    private String refusRecolte(RecolteRecue r) {
        if (r.quantite() == null || r.quantite().signum() <= 0) {
            return "Quantite absente";
        }
        if (estVide(r.unite()) || !KILOS.containsKey(r.unite())) {
            return "Unite inconnue";
        }
        if (r.dateRecolte() == null) {
            return "Date de recolte absente";
        }
        if (r.dateRecolte().isAfter(LocalDate.now().plusDays(1))) {
            return "Date de recolte dans le futur";
        }
        if (r.partVenduePct() != null && (r.partVenduePct() < 0 || r.partVenduePct() > 100)) {
            return "Part vendue hors de 0 a 100";
        }
        return refusDate(r.saisieAt());
    }

    /** La conversion, en un seul endroit. */
    public static BigDecimal enKilos(BigDecimal quantite, String unite) {
        BigDecimal poids = KILOS.get(unite);
        if (quantite == null || poids == null) {
            return null;
        }
        return quantite.multiply(poids);
    }

    /**
     * La campagne d'une date. Avant avril, on est encore dans la campagne ouverte l'année
     * précédente : une récolte de février 2027 appartient à la campagne 2026-2027.
     */
    public static String campagneDe(LocalDate date) {
        int debut = date.getMonthValue() >= MOIS_DEBUT_CAMPAGNE ? date.getYear() : date.getYear() - 1;
        return debut + "-" + (debut + 1);
    }

    // --------------------------------------------------------------------- la lecture

    public List<ParcelleVue> mesParcelles(String uuid, int limite) {
        User user = exigerLecteur(uuid);
        return repository.parcellesDeLAgent(user.getUserId(), limite);
    }

    public List<ParcelleVue> parcellesDuMembre(String uuid, String codCliente) {
        exigerLecteur(uuid);
        if (estVide(codCliente)) {
            throw new ApiException("Numero de membre absent");
        }
        return repository.parcellesDuMembre(codCliente.trim());
    }

    public FicheParcelle fiche(String uuid, Long id) {
        exigerLecteur(uuid);
        ParcelleVue parcelle = repository.parcelle(id)
                .orElseThrow(() -> new ApiException("Parcelle introuvable"));
        return new FicheParcelle(parcelle, repository.visitesDeLaParcelle(id));
    }

    // ---------------------------------------------------------------------- le commun

    private User exigerCollecteur(String uuid) {
        User user = exiger(uuid);
        if (user.getRole() == null || !ROLES_COLLECTE.contains(user.getRole())) {
            throw new ApiException("La collecte agricole est reservee aux agents de credit");
        }
        return user;
    }

    private User exigerLecteur(String uuid) {
        User user = exiger(uuid);
        if (user.getRole() == null || !ROLES_LECTURE.contains(user.getRole())) {
            throw new ApiException("Acces reserve aux agents de credit et aux directeurs d'agence");
        }
        return user;
    }

    private User exiger(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        return user;
    }

    private String refusDate(OffsetDateTime saisieAt) {
        if (saisieAt == null) {
            return "Date de saisie absente";
        }
        if (saisieAt.isAfter(OffsetDateTime.now().plusHours(AVANCE_MAX_HEURES))) {
            return "Date de saisie dans le futur";
        }
        return null;
    }

    private static boolean estVide(String s) {
        return s == null || s.isBlank();
    }
}
