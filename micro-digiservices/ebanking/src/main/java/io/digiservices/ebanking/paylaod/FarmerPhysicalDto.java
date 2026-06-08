package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Details specifiques a une personne physique (CL.CL_PERSONAS_FISICAS).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmerPhysicalDto {

    private String primerNombre;
    private String primerApellido;
    private String indSexo;
    private String nacionalidad;
    private String lugarNacimiento;
    private String desProfesion;
}
