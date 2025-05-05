package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.ProfessionPKId;
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
@Table(name = "CL_CAT_PROFESIONES",schema = "CL")
public class Profession {

    @EmbeddedId
    private ProfessionPKId professionPKId;
    private String DES_PROFESION;
}
