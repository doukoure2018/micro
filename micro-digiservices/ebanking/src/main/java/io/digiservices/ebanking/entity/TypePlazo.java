package io.digiservices.ebanking.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "PR_TIPOS_PLAZOS",schema = "PR")
public class TypePlazo {

    @Id
    @Column(name = "COD_PLAZO")
    private Long id;
    private String DES_PLAZO;
    private Long PLAZO_MIN;
    private String PLAZO_MAX;
    private String IND_PLAZO;
}
