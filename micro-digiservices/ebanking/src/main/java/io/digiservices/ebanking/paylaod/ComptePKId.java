package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Embeddable
@EqualsAndHashCode
public class ComptePKId implements Serializable {

    @Column(name = "COD_EMPRESA")
    private String codEmpresa;
    @Column(name = "NUM_CUENTA")
    private String numCuenta;
}
