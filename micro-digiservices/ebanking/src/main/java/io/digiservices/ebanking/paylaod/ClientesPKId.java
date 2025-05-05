package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Embeddable
@EqualsAndHashCode
public class ClientesPKId implements Serializable {

    @Column(name ="COD_CLIENTE",unique = true,nullable = false)
    private String codCliente;
    @Column(name = "COD_EMPRESA",nullable = false)
    private String COD_EMPRESA;
}
