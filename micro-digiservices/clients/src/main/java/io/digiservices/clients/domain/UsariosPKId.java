package io.digiservices.clients.domain;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class UsariosPKId implements Serializable {

    private String COD_EMPRESA;
    private String codAgencia;
    private String codUsuarios;
}