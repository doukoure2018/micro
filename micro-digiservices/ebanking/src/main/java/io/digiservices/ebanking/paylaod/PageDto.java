package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Enveloppe de pagination generique reutilisable (contrat interne ebanking).
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

    /**
     * Construit une page en derivant totalPages / hasNext / hasPrevious.
     *
     * @param content       elements de la page courante
     * @param page          index de page (0-based)
     * @param size          taille de page demandee
     * @param totalElements total (issu du COUNT separe)
     */
    public static <T> PageDto<T> of(List<T> content, int page, int size, long totalElements) {
        int totalPages = size > 0 ? (int) Math.ceil((double) totalElements / size) : 0;
        boolean hasNext = (long) (page + 1) * size < totalElements;
        boolean hasPrevious = page > 0;
        return new PageDto<>(content, page, size, totalElements, totalPages, hasNext, hasPrevious);
    }
}
