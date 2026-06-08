package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Enveloppe de pagination du contrat public AgriPilot.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageDto<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;
}
