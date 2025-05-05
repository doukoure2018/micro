package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.SeriePKId;
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
@Table(name = "CF_SERIES_X_EMPRESA",schema = "CF")
public class Serie {

    @EmbeddedId
    private SeriePKId seriePKId;
    private String DES_SERIE;
    private Long VAL_SIGUIENTE;
}
