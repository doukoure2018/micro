package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PersonasDto {

    private PersonaPKId personaPKId;
    private String COD_PROFESION;
    private String COD_ACTIVIDAD;
    private String COD_SECTOR;
    private String PRIMER_NOMBRE;
    private String PRIMER_APELLIDO;
    private String EST_CIVIL;
    private String IND_SEXO;
    private String LUGAR_NACIMIENTO;
    private String NACIONALIDAD;
    private Integer NUM_HIJOS;
    private String TENENCIA_VIVIENDA;
    private Integer ANTIGUEDAD_RESIDENCIA;
    private String TENENCIA_PUESTO;
    private Integer ANTIGUEDAD_PUESTO;
    private String conjoint;
}
