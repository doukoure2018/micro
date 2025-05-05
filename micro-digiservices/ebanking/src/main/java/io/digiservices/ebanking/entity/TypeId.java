package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.TypeIdPKId;
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
@Table(name = "CL_TIPOS_ID",schema = "CL")
public class TypeId {

    @EmbeddedId
    private TypeIdPKId typeIdPKId;
    private String DES_TIPO_ID;
    private String MASCARA;
    private String IND_LARGO_FIJO;
}
