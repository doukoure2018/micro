package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RejetTelephoneRequest {

    @NotBlank(message = "Le motif de rejet est obligatoire")
    private String motif;

    /**
     * true => REJETE_DEFINITIF (l'agent ne peut plus resoumettre)
     * false => REJETE (resoumission possible)
     */
    private boolean definitif;
}
