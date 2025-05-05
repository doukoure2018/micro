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
@Table(name = "PR_ORIGEN_FONDOS",schema = "PR")
public class OrigineFond {

    @Id
    @Column(name = "COD_ORIGEN")
    private String id;
    private String DES_ORIGEN;
}
