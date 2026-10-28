package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Credit sorti du portefeuille, date par SAF (point 10). Seules les cloturees ('C') portent une
 * date de cloture, et seulement une partie d'entre elles ; les apures et les transferts n'en ont
 * jamais. Voir AgriculteurRepository#FILTRES_SORTIES pour le perimetre et ses limites.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgriSortieDto {
    private String codAgencia;
    private Long numCredito;
    private String codCliente;
    private String nomCliente;
    private Integer tipCredito;
    private String desTipCredito;
    private String codActividad;
    private String codFiliere;
    private String nomFiliere;
    private BigDecimal monCredito;
    /** Solde au moment de la lecture : zero pour un credit solde. */
    private BigDecimal monSaldo;
    private LocalDate fecApertura;
    private LocalDate fecVencimiento;
    private LocalDate fecCancelacion;
    private String indEstado;
    private String codEjecutivo;
    private String nomEjecutivo;
}
