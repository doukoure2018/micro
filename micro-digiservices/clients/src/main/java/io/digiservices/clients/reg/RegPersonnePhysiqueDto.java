package io.digiservices.clients.reg;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Personne physique cliente (source SAF : CL.CL_CLIENTES + CL.CL_PERSONAS_FISICAS).
 * Contrat brut ebanking &lt;-&gt; bcrgservice (codes SAF non traduits).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegPersonnePhysiqueDto {
    private String codEmpresa;
    private String codCliente;
    private String nomCliente;
    private String indPersona;
    private String indRelacion;

    private String telPrincipal;
    private LocalDate fecIngreso;
    private String codAgencia;
    private String desAgencia;

    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String indSexo;
    private String estCivil;
    private String nacionalidad;
    private String lugarNacimiento;

    private String codProfesion;
    private String desProfesion;
    private String codActividad;
    private String desActividad;
    private String codSector;

    // Sous-listes (renseignees uniquement sur le detail par id)
    private List<RegCompteDto> comptes;
    private List<RegPieceDto> pieces;
    private List<RegAdresseDto> adresses;
}
