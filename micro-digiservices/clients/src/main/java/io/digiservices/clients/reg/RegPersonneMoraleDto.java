package io.digiservices.clients.reg;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Personne morale cliente (source SAF : CL.CL_CLIENTES + CL.CL_PERSONAS_JURIDICAS).
 * Contrat brut ebanking &lt;-&gt; bcrgservice (codes SAF non traduits).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegPersonneMoraleDto {
    private String codEmpresa;
    private String codCliente;
    private String nomCliente;
    private String indPersona;
    private String indRelacion;

    private String telPrincipal;
    private LocalDate fecIngreso;
    private String codAgencia;
    private String desAgencia;

    private String razonSocial;
    private String nomComercial;
    private String claseSociedad;
    private String codActividad;
    private String desActividad;
    private String codSector;

    // Sous-listes (renseignees uniquement sur le detail par id)
    private List<RegCompteDto> comptes;
    private List<RegPieceDto> pieces;
    private List<RegAdresseDto> adresses;
}
