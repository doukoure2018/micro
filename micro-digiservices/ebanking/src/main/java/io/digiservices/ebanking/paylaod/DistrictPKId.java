package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class DistrictPKId implements Serializable {

    private String COD_PAIS;
    private String COD_PROVINCIA;
    private String COD_CANTON;
    private String COD_DISTRITO;
}
