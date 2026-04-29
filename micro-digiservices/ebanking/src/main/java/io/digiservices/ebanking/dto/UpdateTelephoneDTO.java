package io.digiservices.ebanking.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateTelephoneDTO {

    @Size(max = 5, message = "Le code entreprise ne doit pas depasser 5 caracteres")
    private String codEmpresa;

    @NotBlank(message = "Le code client est obligatoire")
    @Size(max = 15, message = "Le code client ne doit pas depasser 15 caracteres")
    private String codCliente;

    @NotBlank(message = "Le numero de telephone est obligatoire")
    @Size(max = 15, message = "Le telephone ne doit pas depasser 15 caracteres")
    private String telPrincipal;
}
