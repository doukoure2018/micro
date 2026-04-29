package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResoumissionTelephoneRequest {

    @NotBlank(message = "Le nouveau telephone est obligatoire")
    @Size(max = 20)
    private String nouveauTelephone;

    @NotBlank(message = "La raison de modification est obligatoire")
    private String raisonModification;
}
