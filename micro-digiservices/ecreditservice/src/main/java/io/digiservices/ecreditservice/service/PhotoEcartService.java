package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.PhotoEcartDtos.LignePhotoDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PhotoRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PointJour;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PointSerieDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.SituationJourDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationCompteDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationCoupleDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationsDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PhotoEcartRepository;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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
    private final HabilitationService habilitations;

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

    /**
     * Qui a le droit d'ouvrir l'ecran, et jusqu'ou il voit.
     *
     * <p>Deux verrous, qui ne repondent pas a la meme question. La RUBRIQUE dit si ce compte a
     * droit a cet ecran : {@code EVOLUTION_ECARTS} pour la DG, la DE, l'inspection, la DSIG et
     * son departement operationnel (V218), ou {@code AUDIT_CAISSE} pour l'Audit, qui ouvre deja
     * les ecrans de caisse. Le PERIMETRE dit quelles lignes il voit : tout le reseau pour ces
     * directions, sa delegation pour un DR, son agence pour un DA.</p>
     */
    private Perimetre habiliter(String uuid) {
        habilitations.exigerUneDe(uuid, HabilitationService.EVOLUTION_ECARTS,
                HabilitationService.AUDIT_CAISSE);
        return perimetreService.perimetreDe(uuid);
    }

    /** La courbe du reseau : un module, les N derniers jours. */
    public List<PointJour> courbe(String uuid, String module, Integer jours) {
        habiliter(uuid);
        return repository.courbe(verifierModule(module), borner(jours));
    }

    /**
     * La situation d'un jour : la photo du reseau, et un point de service par ligne.
     *
     * <p>Le total du reseau reste celui de la photo, meme pour un DA : il dit ou se situe son
     * agence. Les lignes, elles, sont bornees a son perimetre.</p>
     */
    public SituationJourDto situation(String uuid, String module, LocalDate jour) {
        Perimetre perimetre = habiliter(uuid);
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

    /**
     * Les variations entre deux photos : les couples (point de service, compte comptable) dont
     * l'ecart a change, classes et agreges par compte. L'entree « par la variation » demandee
     * le 23/11/2026.
     *
     * @param jour      la photo lue ; nul = la plus recente
     * @param reference la photo de reference ; nulle = la photo precedente du meme module (un lundi
     *                  se compare au vendredi)
     * @param seuil     variation absolue en dessous de laquelle un couple ne s'affiche pas ; nul = le
     *                  seuil d'ecart mineur de l'outil
     */
    public VariationsDto variations(String uuid, String module, LocalDate jour, LocalDate reference,
                                    BigDecimal seuil) {
        Perimetre perimetre = habiliter(uuid);
        String m = verifierModule(module);
        BigDecimal s = seuil == null || seuil.signum() < 0 ? VariationEcarts.SEUIL_DEFAUT : seuil;
        PointJour photo = repository.photo(m, jour);
        if (photo == null) {
            return new VariationsDto(null, null, s, 0, List.of(), 0, null, null, null, List.of(), List.of());
        }
        PointJour ref = reference == null ? repository.photoPrecedente(m, photo.jour()) : repository.photo(m, reference);
        if (ref == null) {
            return new VariationsDto(photo, null, s, 0, List.of(), 0, null, null, null, List.of(), List.of());
        }
        if (!ref.jour().isBefore(photo.jour())) {
            throw new ApiException("La photo de reference (" + ref.jour() + ") doit etre anterieure a la photo lue ("
                    + photo.jour() + ")");
        }
        List<String> codes = perimetre.toutReseau() ? null : List.copyOf(perimetre.codes());
        List<VariationCoupleDto> couples = VariationEcarts.classerTous(
                repository.couplesDeuxPhotos(m, photo.jour(), ref.jour(), codes), s);
        List<VariationCompteDto> comptes = VariationEcarts.parCompte(couples);
        return new VariationsDto(photo, ref, s,
                repository.pointsCompares(m, photo.jour(), ref.jour(), codes),
                repository.pointsExclus(m, photo.jour(), ref.jour(), codes),
                couples.size(),
                VariationEcarts.sommeAggravations(couples),
                VariationEcarts.sommeResolutions(couples),
                VariationEcarts.partCinqPremiers(comptes),
                comptes, couples);
    }

    /** Les jours photographies, pour le selecteur de date de l'ecran. */
    public List<LocalDate> joursConnus(String uuid, String module) {
        habiliter(uuid);
        return repository.joursConnus(verifierModule(module), JOURS_MAX);
    }

    // ======================= Gardes =======================

    private void exigerDansLePerimetre(String uuid, String codAgencia) {
        Perimetre perimetre = habiliter(uuid);
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
