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
public class ProfessionPKId implements Serializable {

    private String COD_EMPRESA;
    private String COD_PROFESION;
}
