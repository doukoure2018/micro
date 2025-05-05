package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.SectorEconomicoPKId;
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
@Table(name = "CL_SECTOR_ECONOMICO",schema = "CL")
public class SecteurEco {

    @EmbeddedId
    private SectorEconomicoPKId sectorEconomicoPKId;
    private String DES_SECTOR;
}
