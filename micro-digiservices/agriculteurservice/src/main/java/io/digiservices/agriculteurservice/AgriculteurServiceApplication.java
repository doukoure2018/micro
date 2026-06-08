package io.digiservices.agriculteurservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Service d'agregation des donnees agriculteurs (AgriPilot / KUMY Consulting).
 *
 * <p>Service sans base de donnees propre : il agrege les donnees SAF2000 exposees
 * par {@code ebanking} via Feign et expose une API stable et documentee a AgriPilot.</p>
 *
 * <p>Les clients Feign partages sont declares dans le module {@code clients}.</p>
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "io.digiservices.clients")
public class AgriculteurServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgriculteurServiceApplication.class, args);
    }
}
