package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.ResumenPkId;
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
@Table(name = "CG_ASTO_RESUMEN",schema = "CG")
public class Resumen {

    @EmbeddedId
    private ResumenPkId resumenPkId;
    private String TIP_TRANSACCION;
    private String SUBTIP_TRANSAC;
    private String COD_SISTEMA;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_MOVIMIENTO;
    private String DES_ASIENTO;
    private String EST_ASIENTO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_ASIENTO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_REGISTRO;
    private String COD_USUARIO;
    private String IND_LIQUIDACION;
    private String IND_POST_CIERRE;
}
