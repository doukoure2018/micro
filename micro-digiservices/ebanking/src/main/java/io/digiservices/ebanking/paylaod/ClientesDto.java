package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ClientesDto {

    private ClientesPKId clientesPKId;
    private String CAT_CLIENTE;
    private String NOM_CLIENTE;
    private String IND_PERSONA;
    private Date FEC_INGRESO;
    private String TEL_PRINCIPAL;
    private String TEL_SECUNDARIO;
    private String TEL_OTRO;
    private String IND_RELACION;
    private String codAgencia;
    private String PROV_SERV_DESTINO;
    private String codClienteMig;
}
