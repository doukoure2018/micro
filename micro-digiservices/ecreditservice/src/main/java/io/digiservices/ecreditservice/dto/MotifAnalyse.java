package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class MotifAnalyse {

    private Long motifAnalyseId;
    private Long userId;
    private Long demandeCreditId;
    private OffsetDateTime motifDate;
    private String motif;

}
