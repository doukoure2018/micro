package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.MouvementPkId;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "CC_MOVIMTO_DIARIO",schema = "CC")
public class Mouvement {

    @EmbeddedId
    private MouvementPkId mouvementPkId;
    private String NUM_CUENTA;
    private String COD_PRODUCTO;
    private String TIP_TRANSACCION;
    private String SUBTIP_TRANSAC;
    private String COD_SISTEMA;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_MOVIMIENTO;

    private Long NUM_DOCUMENTO;
    private String EST_MOVIMIENTO;
    private String IND_APL_CARGO;
    private BigDecimal MON_MOVIMIENTO;
    private String DES_MOVIMIENTO;
    private String SISTEMA_FUENTE;
    private Long NUM_MOV_FUENTE;
    private String COD_AGENCIA;
    private String COD_USUARIO;
    private String DES_REFERENCIA;
}

