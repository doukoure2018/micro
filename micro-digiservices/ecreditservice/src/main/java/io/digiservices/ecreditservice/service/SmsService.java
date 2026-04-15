package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.config.SmsProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Slf4j
@Service
public class SmsService {

    private final SmsProperties smsProperties;
    private final RestClient restClient;

    public SmsService(SmsProperties smsProperties) {
        this.smsProperties = smsProperties;
        this.restClient = RestClient.builder()
                .baseUrl(smsProperties.getUrl())
                .build();
    }

    public SendResult send(String phone, String message) {
        if (!smsProperties.isEnabled()) {
            log.info("[SMS] Disabled — message not sent [phone={}]", phone);
            return new SendResult(true, "SMS_DISABLED", "SMS sending is disabled");
        }

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("client_tk", smsProperties.getClientTk());
        formData.add("client_id", smsProperties.getClientId());
        formData.add("apicall", "smssend");
        formData.add("Message", message);
        formData.add("Phone", phone);

        try {
            String response = restClient.post()
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(formData)
                    .retrieve()
                    .body(String.class);

            log.info("[SMS] Sent to {} via Sayele [response={}]", phone, response);
            return new SendResult(true, "SAYELE_" + System.currentTimeMillis(), response);
        } catch (Exception e) {
            log.error("[SMS] Failed to send to {}: {}", phone, e.getMessage());
            return new SendResult(false, null, e.getMessage());
        }
    }

    public record SendResult(boolean success, String messageId, String message) {}
}
