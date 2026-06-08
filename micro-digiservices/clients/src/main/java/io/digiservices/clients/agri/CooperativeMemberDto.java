package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Membre d'une cooperative (CL.CL_GRUPOS_X_CLIENTE jointe a CL.CL_CLIENTES).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CooperativeMemberDto {

    private String codCliente;
    private String nomCliente;

    private String indPersona;
    private String personType;

    private String indGrado;
    private String groupRole;

    private LocalDate fecRegistro;
}
