package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.PhotoEcartDtos.LignePhotoDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PhotoRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PointJour;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PointSerieDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.SituationJourDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PhotoEcartRepository;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static io.digiservices.ecreditservice.dto.PhotoEcartDtos.MODULES;

/**
 * La photo quotidienne des ecarts de rapprochement (V217).
 *
 * <p>Deux usages, deux portes. L'outil de bureau <b>pousse</b> une photo par la chaine a cle API
 * ({@code /ecredit/rapprochement/photo}) ; les ecrans la <b>lisent</b> par la chaine JWT
 * habituelle, bornes au perimetre du compte connecte.</p>
 *
 * <p>Rien ici ne calcule un ecart : le calcul vit dans l'outil, qui lit SAF depuis le reseau
 * interne. digi recoit, range et affiche. C'est voulu : la lecture de SAF ne tient pas sur la
 * plateforme, le dossier d'un credit negatif l'a montre le 21/11/2026.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PhotoEcartService {

    /** Fenetre par defaut de la courbe. Trente jours tiennent a l'ecran et couvrent un mois. */
    public static final int JOURS_COURBE = 30;
    /** Plafond : au-dela, la courbe devient illisible et la requete inutilement lourde. */
    public static final int JOURS_MAX = 365;

    private final PhotoEcartRepository repository;
    private final PerimetreSafService perimetreService;

    // ======================= Ecriture, par l'outil de bureau =======================

    /**
     * Range une photo poussee par l'outil. Rend l'identifiant cree ou mis a jour.
     *
     * <p>Les controles portent sur ce qui rendrait la serie fausse, et sur rien d'autre : un
     * jour, un module connu, un ecart. Le reste est accepte tel quel — une photo incomplete est
     * une information, pas une erreur.</p>
     */
    @Transactional
    public long recevoir(PhotoRecue photo) {
        if (photo == null || photo.jour() == null) {
            throw new ApiException("Photo sans jour : le jour est l'axe de la courbe");
        }
        if (photo.module() == null || !MODULES.contains(photo.module())) {
            throw new ApiException("Module inconnu : attendu " + MODULES + ", recu " + photo.module());
        }
        if (photo.ecartTotal() == null) {
            throw new ApiException("Photo sans ecart total");
        }
        if (photo.jour().isAfter(LocalDate.now().plusDays(1))) {
            // Une photo datee de demain fausse la courbe et ne peut venir que d'une horloge
            // deréglée sur le poste. Un jour de marge couvre les fuseaux.
            throw new ApiException("Photo datee du futur (" + photo.jour() + ") : verifiez l'horloge du poste");
        }
        return repository.enregistrer(photo);
    }

    // ======================= Lecture, par les ecrans =======================

    /** La courbe du reseau : un module, les N derniers jours. */
    public List<PointJour> courbe(String uuid, String module, Integer jours) {
        perimetreService.perimetreDe(uuid);        // refuse un compte sans habilitation
        return repository.courbe(verifierModule(module), borner(jours));
    }

    /**
     * La situation d'un jour : la photo du reseau, et un point de service par ligne.
     *
     * <p>Le total du reseau reste celui de la photo, meme pour un DA : il dit ou se situe son
     * agence. Les lignes, elles, sont bornees a son perimetre.</p>
     */
    public SituationJourDto situation(String uuid, String module, LocalDate jour) {
        Perimetre perimetre = perimetreService.perimetreDe(uuid);
        String m = verifierModule(module);
        PointJour photo = repository.photo(m, jour);
        if (photo == null) {
            return new SituationJourDto(null, List.of());
        }
        List<String> codes = perimetre.toutReseau() ? null : List.copyOf(perimetre.codes());
        return new SituationJourDto(photo, repository.pointsDuJour(m, photo.jour(), codes));
    }

    /** Les comptes comptables d'un point de service, pour un jour. */
    public List<LignePhotoDto> comptesDuPoint(String uuid, String module, LocalDate jour,
                                              String codAgencia) {
        exigerDansLePerimetre(uuid, codAgencia);
        return repository.comptesDuPoint(verifierModule(module), jour, codAgencia);
    }

    /** La courbe d'un point de service. */
    public List<PointSerieDto> seriePoint(String uuid, String module, String codAgencia,
                                           Integer jours) {
        exigerDansLePerimetre(uuid, codAgencia);
        return repository.seriePoint(verifierModule(module), codAgencia, borner(jours));
    }

    /** Les jours photographies, pour le selecteur de date de l'ecran. */
    public List<LocalDate> joursConnus(String uuid, String module) {
        perimetreService.perimetreDe(uuid);
        return repository.joursConnus(verifierModule(module), JOURS_MAX);
    }

    // ======================= Gardes =======================

    private void exigerDansLePerimetre(String uuid, String codAgencia) {
        Perimetre perimetre = perimetreService.perimetreDe(uuid);
        if (codAgencia == null || codAgencia.isBlank()) {
            throw new ApiException("Point de service non precise");
        }
        if (!perimetre.couvre(codAgencia)) {
            throw new ApiException("Ce point de service n'est pas dans votre perimetre");
        }
    }

    private static String verifierModule(String module) {
        String m = module == null ? "" : module.trim().toUpperCase();
        if (!MODULES.contains(m)) {
            throw new ApiException("Module inconnu : attendu " + MODULES);
        }
        return m;
    }

    private static int borner(Integer jours) {
        if (jours == null || jours <= 0) {
            return JOURS_COURBE;
        }
        return Math.min(jours, JOURS_MAX);
    }
}
