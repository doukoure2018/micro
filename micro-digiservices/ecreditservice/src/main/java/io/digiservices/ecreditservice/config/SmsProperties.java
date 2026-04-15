package io.digiservices.ecreditservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "sms")
public class SmsProperties {

    private String url = "https://hub.sayele.co/api/sendsms";
    private String clientTk;
    private String clientId;
    private boolean enabled = true;
}
