package io.digiservices.ebanking.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class RequisitoRequest {

    private String codRequisito;
    private String indObligatorio;
}
