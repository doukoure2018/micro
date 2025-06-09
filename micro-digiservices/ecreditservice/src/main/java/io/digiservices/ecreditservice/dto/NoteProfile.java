package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class NoteProfile {
    private Long noteProfileId;
    private String referenceCredit;
    private Long note;
    private String motif;
    private LocalDateTime createdAt;
    private String statusNote;
    private Long userId;
}
