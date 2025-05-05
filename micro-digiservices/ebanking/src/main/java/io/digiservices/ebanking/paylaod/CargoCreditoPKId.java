package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class CargoCreditoPKId implements Serializable {

    private String COD_CARGO;
    private String COD_EMPRESA;
    private String COD_AGENCIA;
    private Long NUM_CREDITO;
}
