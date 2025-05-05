package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
@Embeddable
public class SeriePKId implements Serializable {

    @Column(name = "COD_EMPRESA")
    private String codEmpresa;
    @Column(name = "COD_SISTEMA")
    private String codSistema;
    @Column(name = "COD_SERIE")
    private String codSerie;
}
