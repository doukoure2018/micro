package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.SmsOptoutDtos.SmsOptoutDto;
import io.digiservices.ecreditservice.dto.SmsOptoutDtos.SmsOptoutRechercheDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.SmsOptoutRepository;
import io.digiservices.ecreditservice.utils.SmsFichierUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.dto.SmsOptoutDtos.ORIGINE_ECHEC_PERMANENT;
import static io.digiservices.ecreditservice.dto.SmsOptoutDtos.ORIGINE_GUICHET;
import static io.digiservices.ecreditservice.dto.SmsOptoutDtos.ORIGINE_IMPORT;
import static io.digiservices.ecreditservice.dto.SmsOptoutDtos.ORIGINE_STOP_HUB;

/**
 * Desinscription SMS : ce qui permet a un client de demander qu'on arrete de lui ecrire, et a
 * l'institution de prouver qu'elle l'a respecte.
 *
 * <p><b>Alimentation automatique : pas encore.</b> L'origine {@code ECHEC_PERMANENT} existe dans
 * le bareme des origines, mais rien ne la pose : distinguer un numero qui n'existe pas d'une
 * panne de reseau demande les codes d'erreur du hub, que nous n'avons pas. Exclure sur un echec
 * technique reviendrait a condamner des clients joignables — on attend donc les codes plutot que
 * de deviner. De meme pour la reponse STOP : la valeur est prevue, le branchement reste a faire.</p>
 *
 * <p>Le numero est normalise avant toute operation : une exclusion posee sur « +224 622 00 00 00 »
 * doit bloquer « 622000000 ». Sans cette normalisation, la liste serait pleine de doublons
 * inoperants — et c'est le genre de defaut qu'on ne decouvre qu'apres avoir ecrit a quelqu'un
 * qui avait demande le silence.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SmsOptoutService {

    private static final List<String> ORIGINES = List.of(
            ORIGINE_STOP_HUB, ORIGINE_GUICHET, ORIGINE_ECHEC_PERMANENT, ORIGINE_IMPORT);

    private final SmsOptoutRepository repository;

    /** Pose une exclusion. Le motif est obligatoire : une exclusion sans raison ne s'explique pas. */
    public SmsOptoutDto exclure(String telephoneBrut, String origine, String motif, String parUser) {
        String telephone = normaliser(telephoneBrut);
        String source = origine == null || origine.isBlank() ? ORIGINE_GUICHET : origine;
        if (!ORIGINES.contains(source)) {
            throw new ApiException("Origine inconnue : " + source);
        }
        if (motif == null || motif.isBlank()) {
            throw new ApiException("Le motif est obligatoire : il faut pouvoir expliquer l'exclusion plus tard");
        }
        repository.exclure(telephone, source, motif.trim(), parUser);
        log.info("[SMS-OPTOUT] {} exclu par {} ({} — {})", telephone, parUser, source, motif);
        return repository.parTelephone(telephone).orElseThrow(
                () -> new ApiException("Exclusion enregistrée mais illisible : " + telephone));
    }

    /**
     * Leve une exclusion. Volontairement plus exigeant que la pose : un motif est requis, et la
     * levee se journalise. Une exclusion doit etre plus facile a poser qu'a lever.
     */
    public void lever(String telephoneBrut, String motif, String parUser) {
        String telephone = normaliser(telephoneBrut);
        if (motif == null || motif.isBlank()) {
            throw new ApiException("Le motif de levée est obligatoire : indiquez la demande du client");
        }
        if (!repository.lever(telephone, motif.trim(), parUser)) {
            throw new ApiException("Ce numéro n'est pas sur la liste de désinscription : " + telephone);
        }
        log.info("[SMS-OPTOUT] {} reinscrit par {} ({})", telephone, parUser, motif);
    }

    /** Etat et histoire d'un numero : « est-il exclu, depuis quand, pourquoi ». */
    public SmsOptoutRechercheDto rechercher(String telephoneBrut) {
        String telephone = normaliser(telephoneBrut);
        SmsOptoutDto etat = repository.parTelephone(telephone).orElse(null);
        return new SmsOptoutRechercheDto(
                telephone,
                etat != null && etat.actif(),
                etat,
                repository.journal(telephone),
                List.of());
    }

    public List<SmsOptoutDto> lister(String recherche, int page, int size) {
        String motif = recherche == null || recherche.isBlank()
                ? "%"
                : "%" + recherche.replaceAll("[^0-9]", "") + "%";
        return repository.exclusions(motif, Math.max(page, 0), Math.min(Math.max(size, 1), 200));
    }

    public Map<String, Object> synthese() {
        return Map.of(
                "total", repository.compterActifs(),
                "parOrigine", repository.parOrigine());
    }

    /** Vrai quand il ne faut pas ecrire a ce numero. Appele juste avant chaque envoi. */
    public boolean estExclu(String telephone) {
        return telephone != null && repository.estExclu(telephone);
    }


    private String normaliser(String brut) {
        String telephone = SmsFichierUtils.normaliserNumero(brut);
        if (telephone == null) {
            throw new ApiException("Numéro invalide : " + brut
                    + ". Attendu 9 chiffres commençant par 6 ou 7, avec ou sans indicatif +224.");
        }
        return telephone;
    }
}
