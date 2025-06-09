package io.digiservices.clients.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CreditResponse {

    private Integer numCredito;
    private String message;
    private boolean success;
}
