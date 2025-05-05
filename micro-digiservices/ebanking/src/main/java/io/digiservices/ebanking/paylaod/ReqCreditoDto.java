package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReqCreditoDto {

    private ReqCreditoPKId reqCreditoPKId;
    private String IND_ESTADO;
    private String IND_OBLIGATORIO;
    private LocalDateTime FEC_ULT_PRESENTACION;
}
