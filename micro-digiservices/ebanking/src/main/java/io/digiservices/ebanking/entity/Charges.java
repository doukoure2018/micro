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
@Table(name = "PR_CARGOS",schema = "PR")
public class Charges {

    @Id
    @Column(name = "COD_CARGO")
    private String id;
    private String DES_CARGO;
    private String IND_SEGURO;
    private String IND_AFECTA_TAS_EFECTIVA;
    private String IND_DIFERIBLE;
}
