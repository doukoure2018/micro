package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Echeance a venir (alerte J-N du portefeuille credits SAF). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EcheanceAvenirDto {
    private String codAgencia;
    private String desAgencia;
    private Long numCredito;
    private String codCliente;
    private String nomCliente;
    private LocalDate fecCuota;
    private BigDecimal monCuota;
}
