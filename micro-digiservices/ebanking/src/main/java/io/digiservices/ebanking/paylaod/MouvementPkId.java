package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
@Embeddable
public class MouvementPkId implements Serializable {

    @Column(name = "COD_EMPRESA")
    private String codEmpresa;
    @Column(name = "NUM_MOVIMIENTO")
    private Long numMovimiento;
}
