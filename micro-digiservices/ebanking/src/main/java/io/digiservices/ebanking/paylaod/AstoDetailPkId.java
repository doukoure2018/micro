package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Embeddable;
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
public class AstoDetailPkId implements Serializable {

    private String COD_EMPRESA;
    private String COD_AGENCIA;
    private Long NUM_ASIENTO;
    private Long NUM_LINEA;
}
