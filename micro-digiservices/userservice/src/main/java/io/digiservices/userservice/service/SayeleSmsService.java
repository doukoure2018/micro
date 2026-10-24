package io.digiservices.userservice.service;

import io.digiservices.userservice.config.SayeleProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

/**
 * Envoi d'un SMS par la passerelle Sayele. Copie de celui d'ecreditservice (les deux
 * services ne partagent pas de module commun) ; ici il ne sert qu'aux codes de
 * verification de numero.
 */
@Slf4j
@Service
public class SayeleSmsService {

    private final SayeleProperties sayeleProperties;
    private final RestClient restClient;

    public SayeleSmsService(SayeleProperties sayeleProperties) {
        this.sayeleProperties = sayeleProperties;
        this.restClient = RestClient.builder().baseUrl(sayeleProperties.getUrl()).build();
    }

    public SendResult send(String phone, String message) {
        if (!sayeleProperties.isEnabled()) {
            log.info("[SMS] desactive — message non envoye [phone={}]", phone);
            return new SendResult(true, "SMS_DISABLED", "envoi de SMS desactive");
        }
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("client_tk", sayeleProperties.getClientTk());
        formData.add("client_id", sayeleProperties.getClientId());
        formData.add("apicall", "smssend");
        formData.add("Message", message);
        formData.add("Phone", phone);
        try {
            String response = restClient.post()
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(formData)
                    .retrieve()
                    .body(String.class);
            log.info("[SMS] envoye a {} via Sayele", phone);
            return new SendResult(true, "SAYELE_" + System.currentTimeMillis(), response);
        } catch (Exception e) {
            log.error("[SMS] echec d'envoi a {} : {}", phone, e.getMessage());
            return new SendResult(false, null, e.getMessage());
        }
    }

    public record SendResult(boolean success, String messageId, String message) {}
}
