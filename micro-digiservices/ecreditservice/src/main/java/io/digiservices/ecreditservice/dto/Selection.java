package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Selection {

    private Long selectionId;
    private String doc;
    private LocalDateTime createdAt;
    private String statutSelection;
    private Long userId;
    private Long demandeindividuel_id;
}
