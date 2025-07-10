package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class NoteGarantie {
    private Long noteGarantieId;
    private String referenceCredit;
    private Long note;
    private String motif;
    private OffsetDateTime createdAt;
    private String statusNote;
    private Long userId;
}
