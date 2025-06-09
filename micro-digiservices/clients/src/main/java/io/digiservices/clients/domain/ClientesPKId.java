package io.digiservices.clients.domain;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ClientesPKId implements Serializable {
    private String codCliente;
    private String COD_EMPRESA;
}
