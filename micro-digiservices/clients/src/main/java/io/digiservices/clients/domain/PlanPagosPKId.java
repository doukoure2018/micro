package io.digiservices.clients.domain;

import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PlanPagosPKId {

    private String COD_EMPRESA;
    private String codAgencia;
    private Long numCredito;
    private Long numCuota;
}
