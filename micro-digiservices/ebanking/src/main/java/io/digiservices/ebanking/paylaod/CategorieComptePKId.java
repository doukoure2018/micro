package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Embeddable
@EqualsAndHashCode
public class CategorieComptePKId implements Serializable {

    @Column(name = "COD_EMPRESA",nullable = false)
    private String codEmpresa;
    @Column(name = "COD_CATEGORIA",nullable = false)
    private String codCategoria;
}
