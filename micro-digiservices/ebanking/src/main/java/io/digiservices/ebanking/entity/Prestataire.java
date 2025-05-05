package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.PrestatairePKId;
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
@Table(name = "CF_CATAL_PROV_TEL_CELULAR",schema = "CF")
public class Prestataire {

    @EmbeddedId
    private PrestatairePKId prestatairePKId;
    private String DES_PROVEEDOR;
}
