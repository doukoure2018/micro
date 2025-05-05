package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PointVenteDto {

    private Long id;
    private String libele;
    private Long delegation_id;
    private Long agence_id;
    private String code;
}
