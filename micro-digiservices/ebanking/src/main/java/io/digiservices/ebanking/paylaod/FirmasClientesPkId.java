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
public class FirmasClientesPkId implements Serializable {

    @Column(name = "COD_EMPRESA")
    private String codEmpresa;
    @Column(name = "COD_CLIENTE")
    private String codClientes;
    @Column(name = "NUM_CUENTA")
    private String numCuenta;
}
