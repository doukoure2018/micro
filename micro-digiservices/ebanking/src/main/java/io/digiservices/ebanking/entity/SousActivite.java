package io.digiservices.ebanking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "CL_SUBACT_ECONOMICA", schema = "CL")
@IdClass(SousActiviteId.class) // ✅ Ajoutez cette ligne !
public class SousActivite {

    @Id // ✅ Les deux champs deviennent @Id
    @Column(name = "COD_ACTIVIDAD", nullable = false)
    private String codActividad;

    @Id // ✅ Les deux champs deviennent @Id
    @Column(name = "COD_SUBACTIV")
    private String id;

    @Column(name = "DES_SUBACTIV")
    private String des_SUBACTIV;
}
