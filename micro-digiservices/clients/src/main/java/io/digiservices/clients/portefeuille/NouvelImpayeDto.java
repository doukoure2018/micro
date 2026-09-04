package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Credit venant de basculer en impaye (alerte quotidienne du portefeuille SAF). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NouvelImpayeDto {
    private String codAgencia;
    private String desAgencia;
    private Long numCredito;
    private String codCliente;
    private String nomCliente;
    private LocalDate datPremiereImpayee;
    private BigDecimal monSaldo;
    private BigDecimal mntImpaye;
}
