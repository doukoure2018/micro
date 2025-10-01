package io.digiservices.ebanking.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FicheSignaletiqueResponseSoldeDTO {

    // Keep all existing fields from FicheSignaletiqueResponseDTO...
    // Informations de base (CL_CLIENTES)
    private String codEmpresa;
    private String codCliente;
    private String catCliente;
    private String nomCliente;
    private String indPersona;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecIngreso;

    private String telPrincipal;
    private String telSecundario;
    private String telOtro;
    private String indRelacion;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecReactivacion;

    private String codAgencia;
    private String codcteAsoCom;
    private String codcteGrpSol;
    private String provServDestino;

    // Informations personne physique (CL_PERSONAS_FISICAS)
    private String codProfesion;
    private String codActividad;
    private String codSector;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String estCivil;
    private String indSexo;
    private String nomConyugue;
    private String nacionalidad;
    private String lugarNacimiento;
    private Integer numHijos;
    private String tenenciaVivienda;
    private BigDecimal antiguedadResidencia;
    private String codCteConyugue;
    private String tenenciaPuesto;
    private BigDecimal antiguedadPuesto;

    // Informations d'identification (CL_ID_CLIENTES)
    private String codTipoId;
    private String numId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecVencim;

    // Informations associé (CL_DATOS_ASOCIADO)
    private String indEstado;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechIngresoAsociado;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechInactivacion;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechRenuncia;

    private String codMotRenuncia;
    private String codPlanilla;
    private String tipAsociado;
    private String lugarTrabajo;
    private String tipTrabajo;
    private BigDecimal salario;
    private Integer cantDependientes;
    private String dirTrabajo;
    private String nomBeneficiario;
    private String relacBeneficiario;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechNacimiento;

    private Long numSesion;
    private Long numArticulo;
    private String tipoUnion;
    private String tipoPlanilla;
    private String puesto;

    // Informations adresse (CL_DIR_CLIENTES)
    private String codDireccion;
    private String codPais;
    private String codProvincia;
    private String codCanton;
    private String codDistrito;
    private String tipDireccion;
    private String apdoPostal;
    private String codPostal;
    private String detDireccion;

    // Meta information
    private Boolean clientExists;

    // ============= NEW FIELDS FOR SOLDES =============
    // Liste des comptes du client
    private List<CompteDTO> comptes;

    // Résumé des soldes
    private Integer totalComptes;
    private Integer comptesActifs;
    private Integer comptesInactifs;
    private BigDecimal totalSoldeDisponible;
    private BigDecimal totalSoldeMoyen;
    private BigDecimal totalSoldeCongelado;
    private BigDecimal totalSoldeTransit;
    private BigDecimal totalSoldeReserve;

    // Méthodes utilitaires pour obtenir des valeurs formatées
    public String getNombreComplet() {
        StringBuilder sb = new StringBuilder();
        if (primerNombre != null) sb.append(primerNombre).append(" ");
        if (segundoNombre != null) sb.append(segundoNombre).append(" ");
        if (primerApellido != null) sb.append(primerApellido).append(" ");
        if (segundoApellido != null) sb.append(segundoApellido);
        return sb.toString().trim();
    }

    public String getEstatCivilLibelle() {
        if (estCivil == null) return null;
        switch (estCivil) {
            case "S": return "Célibataire";
            case "C": return "Marié(e)";
            case "D": return "Divorcé(e)";
            case "U": return "Union libre";
            case "V": return "Veuf/Veuve";
            case "O": return "Autre";
            default: return estCivil;
        }
    }

    public String getSexeLibelle() {
        if (indSexo == null) return null;
        switch (indSexo) {
            case "M": return "Masculin";
            case "F": return "Féminin";
            default: return indSexo;
        }
    }

    public String getStatutClientLibelle() {
        if (indRelacion == null) return null;
        switch (indRelacion) {
            case "C": return "Client actif";
            case "F": return "Ex-client";
            case "R": return "Client réactivé";
            case "E": return "En attente";
            case "V": return "VIP";
            case "P": return "Prospect";
            default: return indRelacion;
        }
    }

    public String getTypeHabitationLibelle() {
        if (tenenciaVivienda == null) return null;
        switch (tenenciaVivienda) {
            case "PR": return "Propriétaire";
            case "PC": return "Propriétaire avec crédit";
            case "CU": return "Copropriétaire";
            case "AL": return "Locataire";
            case "AN": return "Autre arrangement";
            case "PO": return "Propriétaire occupant";
            default: return tenenciaVivienda;
        }
    }

    public String getTypeTravailLibelle() {
        if (tenenciaPuesto == null) return null;
        switch (tenenciaPuesto) {
            case "PR": return "Permanent";
            case "AL": return "Temporaire";
            default: return tenenciaPuesto;
        }
    }
}