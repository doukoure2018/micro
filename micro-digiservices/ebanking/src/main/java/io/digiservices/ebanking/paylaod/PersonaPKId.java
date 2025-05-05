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
public class PersonaPKId implements Serializable {

    private String COD_EMPRESA;
    @Column(name = "COD_CLIENTE")
    private String codClientes;
}
