package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.AgenciasPkId;
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
@Table(name = "CF_AGENCIAS",schema = "CF")
public class Agencias {

    @EmbeddedId
    private AgenciasPkId agenciasPkId;
    private String DES_AGENCIA;
    private String IND_ESTADO;
    private String APDO_POSTAL;
    private String DIR_FISICA;
    private String IND_TRA_SABADO;
    private String IND_TRA_DOMINGO;
    private String ABR_AGENCIA;
    private String IND_CENTRAL;
    private String TIPO_AGENCIA;
}
