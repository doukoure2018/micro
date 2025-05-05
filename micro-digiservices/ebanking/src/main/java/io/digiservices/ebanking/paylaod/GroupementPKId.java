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
public class GroupementPKId implements Serializable {

    private String COD_EMPRESA;
    @Column(name = "COD_CLIENTE",nullable = false)
    private String codCliente;
    private String COD_VINCULACION;
    private String COD_CLT_VINCULA;
}
