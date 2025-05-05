package io.digiservices.ebanking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "pointvente",schema = "digi")
public class PointVente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String libele;
    @ManyToOne
    @JoinColumn(name = "delegation_id",nullable = false)
    private Delegation delegation;
    @ManyToOne
    @JoinColumn(name = "agence_id",nullable = false)
    private Agence agence;
    private String code;
}
