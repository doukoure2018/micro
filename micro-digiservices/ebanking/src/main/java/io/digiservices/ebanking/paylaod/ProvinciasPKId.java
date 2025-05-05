package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
@Embeddable
public class ProvinciasPKId implements Serializable {

    private String COD_PAIS;
    private String COD_PROVINCIA;
}
