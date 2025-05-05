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
public class ProductoPkId implements Serializable {

    private String COD_EMPRESA;
    @Column(name = "COD_SISTEMA")
    private String codSystema;
    private String COD_PRODUCTO;
}
