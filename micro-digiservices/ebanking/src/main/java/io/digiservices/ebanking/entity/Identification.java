package io.digiservices.ebanking.entity;


import io.digiservices.ebanking.paylaod.IdentificationPKId;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "CL_DATOS_ASOCIADO",schema = "CL")
public class Identification {

    @EmbeddedId
    private IdentificationPKId identificationPKId;
    private String IND_ESTADO;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FECH_INGRESO;
    private String TIP_ASOCIADO;
    private String NOM_BENEFICIARIO;
    private String RELAC_BENEFICIARIO;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FECH_NACIMIENTO;
}
