package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
@Embeddable
public class IdentificationPKId implements Serializable {

    private String COD_EMPRESA;
    @NotEmpty(message = "Code membre should not be empty")
    private String COD_CLIENTE;
}
