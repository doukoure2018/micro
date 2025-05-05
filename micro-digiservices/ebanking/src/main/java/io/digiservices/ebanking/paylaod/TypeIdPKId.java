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
public class TypeIdPKId implements Serializable {

    private String COD_EMPRESA;
    private String COD_TIPO_ID;
}
