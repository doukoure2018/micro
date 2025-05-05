package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CalendariosDto {

    private CalendariosPKId calendariosPKId;
    private LocalDateTime FEC_HOY;
    private String NOM_DIA;
    private String FEC_ANTERIOR;
    private String PRIMER_DIA_MES;
    private String PRIMER_HABIL_MES;
    private String ULT_DIA_MES;
    private String ULT_HABIL_MES;
}
