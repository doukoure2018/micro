package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.DirClientesPKId;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "CL_DIR_CLIENTES",schema = "CL")
public class DirClientes {

    @EmbeddedId
    private DirClientesPKId dirClientesPKId;
    private String COD_PAIS;
    private String COD_PROVINCIA;
    @Column(name = "COD_CANTON")
    private String codCanton;
    private String COD_DISTRITO;
    private String TIP_DIRECCION;
    private String DET_DIRECCION;
}
