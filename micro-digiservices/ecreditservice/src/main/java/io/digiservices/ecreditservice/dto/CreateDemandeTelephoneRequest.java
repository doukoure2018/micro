package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateDemandeTelephoneRequest {

    @NotBlank(message = "Le code client est obligatoire")
    @Size(max = 50)
    private String codCliente;

    @Size(max = 100)
    private String nomClient;

    @Size(max = 100)
    private String prenomClient;

    @NotBlank(message = "L'ancien telephone est obligatoire")
    @Size(max = 20)
    private String ancienTelephone;

    @NotBlank(message = "Le nouveau telephone est obligatoire")
    @Size(max = 20)
    private String nouveauTelephone;

    @NotBlank(message = "La raison de modification est obligatoire")
    private String raisonModification;

    @NotNull(message = "La date de modification est obligatoire")
    private LocalDate dateModificationSouhaitee;
}
