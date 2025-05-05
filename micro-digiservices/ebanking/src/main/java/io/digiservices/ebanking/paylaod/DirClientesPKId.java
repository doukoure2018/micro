package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Column;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class DirClientesPKId implements Serializable {

    private String COD_EMPRESA;
    @Column(name = "COD_CLIENTE")
    private String codClientes;
    private String COD_DIRECCION;
}
