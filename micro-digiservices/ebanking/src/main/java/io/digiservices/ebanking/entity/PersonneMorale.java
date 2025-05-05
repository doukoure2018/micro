package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.PersonneMoralePKId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "CL_PERSONAS_JURIDICAS",schema = "CL")
public class PersonneMorale {

    @EmbeddedId
    private PersonneMoralePKId personneMoralePKId;
    private String COD_SECTOR;
    private String CLASE_SOCIEDAD;
    private String COD_ACTIVIDAD;
    private String NOM_COMERCIAL;
    private String RAZON_SOCIAL;
}
