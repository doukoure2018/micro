package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.ClientesPKId;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "CL_CLIENTES",schema = "CL")
public class Clientes {

    @EmbeddedId
    private ClientesPKId clientesPKId;
    private String CAT_CLIENTE;
    private String NOM_CLIENTE;
    private String IND_PERSONA;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_INGRESO;
    private String TEL_PRINCIPAL;
    private String TEL_SECUNDARIO;
    private String TEL_OTRO;
    private String IND_RELACION;
    @Column(name = "COD_AGENCIA")
    private String codAgencia;
    private String PROV_SERV_DESTINO;
    @Column(name = "COD_CLIENTE_MIG",nullable = false)
    private String codClienteMig;
}
