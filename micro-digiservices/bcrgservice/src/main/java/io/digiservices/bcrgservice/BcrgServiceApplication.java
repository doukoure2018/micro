package io.digiservices.bcrgservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Service d'agregation des declarations reglementaires vers la BCRG
 * (Banque Centrale de la Republique de Guinee).
 *
 * <p>Service sans base propre : il agrege les donnees SAF2000 exposees par
 * {@code ebanking} ({@code /ebanking/reg/**}) via Feign et expose une API stable
 * (Personnes Physiques, Personnes Morales, Engagements) au format BCRG, protegee
 * par cle API. Meme patron que {@code agriculteurservice} (KUMY).</p>
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "io.digiservices.clients")
public class BcrgServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BcrgServiceApplication.class, args);
    }
}
