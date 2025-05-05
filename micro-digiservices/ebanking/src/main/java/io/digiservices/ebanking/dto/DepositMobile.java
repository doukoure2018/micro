package io.digiservices.ebanking.dto;


import io.digiservices.ebanking.entity.AstoDetail;
import io.digiservices.ebanking.entity.Mouvement;
import io.digiservices.ebanking.entity.Resumen;
import io.digiservices.ebanking.entity.Serie;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DepositMobile {

    private Mouvement mouvement1;
    private Mouvement mouvement2;
    private Resumen resumen;
    private AstoDetail astoDetail1;
    private AstoDetail astoDetail2;

    private Resumen resumen1;
    private AstoDetail astoDetail3;
    private AstoDetail astoDetail4;

    private MontantDto montantDto;

    private Serie serie;
}
