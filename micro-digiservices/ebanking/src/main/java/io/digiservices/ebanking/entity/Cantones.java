package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.CantonesPKId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "PA_CANTONES",schema = "PA")
public class Cantones {

    @EmbeddedId
    private CantonesPKId cantonesPKId;
    private String DES_CANTON;
}
