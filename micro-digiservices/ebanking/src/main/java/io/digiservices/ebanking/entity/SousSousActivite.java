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
@Table(name = "CL_SUBSUBACT_ECONOMICA", schema = "CL")
@IdClass(SousSousActiviteId.class) // ✅ Ajouté
public class SousSousActivite {

    @Id // ✅ Maintenant @Id
    @Column(name = "COD_ACTIVIDAD", nullable = false)
    private String codActividad;

    @Id // ✅ Maintenant @Id
    @Column(name = "COD_SUBACTIV", nullable = false)
    private String codSousActivite;

    @Id // ✅ Maintenant @Id
    @Column(name = "COD_SUBSUBACTIV")
    private String id;

    @Column(name = "DES_SUBSUBACTIV") // ✅ Annotation ajoutée
    private String des_SUBSUBACTIV; // ✅ Changé en camelCase
}
