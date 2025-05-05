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
public class IdClientesPKId implements Serializable {

    private String COD_EMPRESA;
    @Column(name = "COD_CLIENTE")
    private String codClientes;
    private String COD_TIPO_ID;
    private String NUM_ID;
}
