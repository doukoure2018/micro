package io.digiservices.clients.domain;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class CreditoPKId {

    private Long numCredito;
    private String COD_EMPRESA;
    private String codAgencia;

}
