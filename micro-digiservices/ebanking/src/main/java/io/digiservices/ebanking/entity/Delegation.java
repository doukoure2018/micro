package io.digiservices.ebanking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "delegation",schema = "digi")
public class Delegation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String libele;
    @OneToMany(mappedBy = "delegation",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Agence> agences = new HashSet<>();
    @OneToMany(mappedBy = "delegation",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<PointVente> pointServices =new HashSet<>();

}
