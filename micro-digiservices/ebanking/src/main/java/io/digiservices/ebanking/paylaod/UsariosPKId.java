package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Column;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class UsariosPKId implements Serializable {

    private String COD_EMPRESA;
    @Column(name = "COD_AGENCIA",nullable = false)
    private String codAgencia;
    @Column(name = "COD_USUARIO")
    private String codUsuarios;
}
