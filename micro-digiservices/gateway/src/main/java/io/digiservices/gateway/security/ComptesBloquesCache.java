package io.digiservices.gateway.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.List;
import java.util.Set;

/**
 * La liste des comptes bloques (V182), relue aupres du service utilisateurs toutes les trente
 * secondes et gardee en memoire. Le filtre de la passerelle la consulte a chaque requete sans
 * aucun appel reseau : bloquer un compte prend effet partout en moins d'une minute, jeton en
 * cours ou pas. En cas d'echec de lecture, la derniere liste connue reste en vigueur.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ComptesBloquesCache {

    private final DiscoveryClient discoveryClient;

    @Value("${comptes.bloques.url:}")
    private String urlFixe;

    private volatile Set<String> bloques = Set.of();
    private final RestClient rest = RestClient.builder()
            .requestFactory(new org.springframework.http.client.SimpleClientHttpRequestFactory() {{
                setConnectTimeout(Duration.ofSeconds(3));
                setReadTimeout(Duration.ofSeconds(5));
            }})
            .build();

    public boolean estBloque(String userUuid) {
        return userUuid != null && bloques.contains(userUuid);
    }

    public int taille() {
        return bloques.size();
    }

    @Scheduled(fixedDelayString = "${comptes.bloques.rafraichissement-ms:30000}", initialDelay = 5000)
    public void rafraichir() {
        String base = urlFixe != null && !urlFixe.isBlank() ? urlFixe : urlDecouverte();
        if (base == null) {
            log.warn("[COMPTES BLOQUES] Service utilisateurs introuvable : liste inchangee ({} compte(s))", bloques.size());
            return;
        }
        try {
            List<String> liste = rest.get().uri(base + "/user/comptes/bloques").retrieve()
                    .body(new ParameterizedTypeReference<List<String>>() {});
            Set<String> nouvelle = liste == null ? Set.of() : Set.copyOf(liste);
            if (!nouvelle.equals(bloques)) {
                log.info("[COMPTES BLOQUES] Liste mise a jour : {} compte(s) bloque(s)", nouvelle.size());
            }
            bloques = nouvelle;
        } catch (Exception e) {
            log.warn("[COMPTES BLOQUES] Lecture impossible ({}) : liste inchangee ({} compte(s))", e.getMessage(), bloques.size());
        }
    }

    private String urlDecouverte() {
        List<ServiceInstance> instances = discoveryClient.getInstances("USERSERVICE");
        if (instances == null || instances.isEmpty()) {
            return null;
        }
        return instances.get(0).getUri().toString();
    }
}
