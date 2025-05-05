package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SG_USUARIOSDto {

    private UsariosPKId usariosPKId;
    private String codPuesto;
    private String NOM_USUARIO;
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
