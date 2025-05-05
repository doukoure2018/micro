package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class IdClientesDto {

    private IdClientesPKId idClientesPKId;
    private LocalDateTime FEC_VENCIM;
}
