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
    /** Code de la sous-sous-activite SAF, qui est la filiere agricole (313 = cereale riz). */
    private String codFiliere;
    /** Libelle de la filiere. Le code se repete sous plusieurs sous-activites, le libelle non. */
    private String nomFiliere;

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

    // ---- Tableau de bord DE (KUMY, lot 1 du 26/10/2026) : retards, echeances, agent ----
    /** Jours depuis la plus ancienne echeance impayee ; 0 si a jour. */
    private Integer joursRetard;
    /** Capital + interets des echeances echues non reglees, GNF. */
    private BigDecimal montantImpaye;
    private LocalDate prochaineEcheanceDate;
    private BigDecimal prochaineEcheanceMontant;
    /** Echeances du mois en cours : attendu, et regle (attendu - reste du). */
    private BigDecimal montantAttenduMois;
    private BigDecimal montantPayeMois;
    /** Gestionnaire SAF du credit (COD_EJECUTIVO) et son nom. */
    private String codEjecutivo;
    private String nomEjecutivo;
}
