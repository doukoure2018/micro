package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Column;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class PlanPagosPKId implements Serializable {

    private String COD_EMPRESA;
    @Column(name = "COD_AGENCIA")
    private String codAgencia;
    @Column(name = "NUM_CREDITO")
    private Long numCredito;
    @Column(name = "NUM_CUOTA")
    private Long numCuota;
}
