package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Credit agricole (PR.PR_CREDITOS) enrichi des libelles type / plan / groupe.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgriCreditDto {

    private String codEmpresa;
    private String codAgencia;
    private Long numCredito;

    private String codCliente;
    private String nomCliente;
    private String indPersona;
    private String personType;

    private Integer tipCredito;
    private String desTipCredito;

    private String codActividad;

    private BigDecimal monCredito;
    private BigDecimal monSaldo;

    private LocalDate fecApertura;
    private LocalDate fecVencimiento;

    private String indEstado;
    private String creditStatus;

    private BigDecimal cantHectareas;

    private Integer codPlanInversion;
    private String nomPlan;

    private String codGrupoSol;
    private String desGrupoSol;
    private String codAsociacion;
    private String desAsociacion;
}
