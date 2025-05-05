package io.digiservices.ebanking.entity;


import io.digiservices.ebanking.paylaod.PersonaPKId;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "CL_PERSONAS_FISICAS",schema = "CL")
public class Personas {

    @EmbeddedId
    private PersonaPKId personaPKId;
    private String COD_PROFESION;
    private String COD_ACTIVIDAD;
    private String COD_SECTOR;
    @Size(max = 20)
    @Column(length = 20)
    private String PRIMER_NOMBRE;
    @Size(max = 20)
    @Column(length = 20)
    private String PRIMER_APELLIDO;
    @Column(length = 1)
    private String EST_CIVIL;
    @Size(max = 1)
    @Column(length = 1)
    private String IND_SEXO;
    @Size(max = 30)
    private String LUGAR_NACIMIENTO;
    @Size(max = 30)
    private String NACIONALIDAD;
    private Integer NUM_HIJOS;
    @Size(max = 2)
    private String TENENCIA_VIVIENDA;
    @Min(0)
    @Max(999)
    private Integer ANTIGUEDAD_RESIDENCIA;
    @Size(max = 2)
    private String TENENCIA_PUESTO;
    private Integer ANTIGUEDAD_PUESTO;
    @Size(max = 15)
    @Column(name = "COD_CTE_CONYUGE",length = 15)
    private String conjoint;

}
