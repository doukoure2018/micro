package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class CreditoPKId implements Serializable {

    @Column(name = "NUM_CREDITO")
    private Long numCredito;
    private String COD_EMPRESA;
    @Column(name = "COD_AGENCIA")
    private String codAgencia;

}
