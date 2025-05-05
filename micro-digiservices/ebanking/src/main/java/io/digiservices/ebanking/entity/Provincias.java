package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.ProvinciasPKId;
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
@Table(name = "PA_PROVINCIAS",schema = "PA")
public class Provincias {

    @EmbeddedId
    private ProvinciasPKId provinciasPKId;
    private String DES_PROVINCIA;
}
