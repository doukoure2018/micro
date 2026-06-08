package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Enveloppe de pagination generique partagee (contrat ebanking &lt;-&gt; agriculteurservice).
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

    public static <T> PageDto<T> of(List<T> content, int page, int size, long totalElements) {
        int totalPages = size > 0 ? (int) Math.ceil((double) totalElements / size) : 0;
        boolean hasNext = (long) (page + 1) * size < totalElements;
        boolean hasPrevious = page > 0;
        return new PageDto<>(content, page, size, totalElements, totalPages, hasNext, hasPrevious);
    }
}
