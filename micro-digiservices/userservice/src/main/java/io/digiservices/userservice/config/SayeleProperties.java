package io.digiservices.userservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Passerelle SMS Sayele, deja utilisee par les campagnes du reseau. Memes cles que dans
 * ecreditservice : les deux services parlent a la meme passerelle avec le meme compte.
 */
@Component
@ConfigurationProperties(prefix = "sayele")
@Getter
@Setter
public class SayeleProperties {
    private String url = "https://hub.sayele.co/api/sendsms";
    private String clientTk;
    private String clientId;
    private boolean enabled = true;
}
