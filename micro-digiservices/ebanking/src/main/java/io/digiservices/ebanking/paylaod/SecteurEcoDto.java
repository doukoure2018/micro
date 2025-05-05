package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SecteurEcoDto {

    private SectorEconomicoPKId sectorEconomicoPKId;
    private String DES_SECTOR;
}
