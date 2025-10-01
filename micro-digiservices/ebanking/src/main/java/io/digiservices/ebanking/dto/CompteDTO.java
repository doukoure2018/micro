package io.digiservices.ebanking.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompteDTO {
    private String codAgencia;
    private String numCuenta;
    private String codCategoria;
    private String categorieLibelle;
    private String codSistema;
    private String codProducto;
    private String codUsuario;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fecUltMovimiento;

    private BigDecimal salDisponible;
    private BigDecimal salPromedio;
    private BigDecimal salCongelado;
    private BigDecimal salTransito;
    private BigDecimal salReserva;

    private String indEstado;
    private String statutCompte;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime fecApertura;

    private Integer joursSansMouvement;
}