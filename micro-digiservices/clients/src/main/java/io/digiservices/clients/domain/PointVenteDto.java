package io.digiservices.clients.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PointVenteDto {

    private Long id;
    private String libele;
    private String code;
    private Long delegation_id;
    private Long agence_id;
}