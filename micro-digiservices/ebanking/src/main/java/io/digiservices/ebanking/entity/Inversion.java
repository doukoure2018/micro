package io.digiservices.ebanking.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
@Table(name = "PR_PLAN_INVERSION",schema = "PR")
public class Inversion {

    @Id
    @Column(name = "COD_PLAN_INVERSION")
    private String id;
    private String NOM_PLAN;

}
