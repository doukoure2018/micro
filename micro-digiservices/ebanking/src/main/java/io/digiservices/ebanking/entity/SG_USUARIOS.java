package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.UsariosPKId;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "SG_USUARIOS",schema = "SG")
public class SG_USUARIOS {

    @EmbeddedId
    private UsariosPKId usariosPKId;
    @Column(name = "COD_PUESTO",nullable = false)
    private String codPuesto;
    private String NOM_USUARIO;
    @Column(name = "IND_ACTIVO")
    private String indActivo;
    private Date FEC_INGRESO;
    private String IND_PRINCIPIANTE;
    private String PALABRA_PASO;
    private String TIP_USUARIO;
    private String TIP_FUNCION;
    private String NIVEL_FUNCION;
    private String TIPO_ACCESO;
    private Date FEC_VENC_USUARIO;
    private Date FEC_VENC_PALABRA_PASO;
    private String COD_USUARIO_BD;
    private String PALABRA_PASO_BD;
    private String COD_IDIOMA;
}
