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
@EqualsAndHashCode
@Embeddable
public class CantonesPKId implements Serializable {

    @Column(name = "COD_CANTON")
    private String codCanton;
    @Column(name = "COD_PAIS")
    private String codPais;
    @Column(name = "COD_PROVINCIA")
    private String codProvincia;
}

