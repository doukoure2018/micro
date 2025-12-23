package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorrectionEvolutionStat {
    private LocalDate date;
    private String periode; // Format: "2025-01-15" for day, "2025-W03" for week
    private long enAttente;
    private long rejete;
    private long valide;
    private long total;
}
