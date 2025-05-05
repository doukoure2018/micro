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
public class CalendariosPKId implements Serializable {

    @Column(name = "COD_SISTEMA")
    private String codSystema;
    @Column(name = "COD_EMPRESA")
    private String codEmpresa;
    @Column(name = "COD_AGENCIA")
    private String codAgencia;
}
