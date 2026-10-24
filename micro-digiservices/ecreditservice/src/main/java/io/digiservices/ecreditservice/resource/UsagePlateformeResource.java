package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.UsagePlateformeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Barometre d'usage de digi (V175, lot 1). Reserve a la DG, la DE, la DSIG et aux DR ; le
 * perimetre et les montants sont decides par le service.
 */
@RestController
@RequestMapping("/ecredit/usage")
@RequiredArgsConstructor
@Slf4j
public class UsagePlateformeResource {

    private final UsagePlateformeService service;

    /** La semaine qui contient {@code jour} ; par defaut, la semaine en cours. */
    @GetMapping
    public ResponseEntity<Response> semaine(@NotNull Authentication authentication,
                                            @RequestParam(value = "jour", required = false)
                                            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate jour,
                                            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("usage", service.semaine(authentication.getName(), jour)),
                "Barometre d'usage de la plateforme", OK));
    }

    /** Le meme barometre en classeur Excel. */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exporter(@NotNull Authentication authentication,
                                           @RequestParam(value = "jour", required = false)
                                           @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate jour)
            throws IOException {
        byte[] classeur = service.exporter(authentication.getName(), jour);
        LocalDate reference = jour == null ? LocalDate.now() : jour;
        String nom = "Usage_digi_semaine_" + reference.with(java.time.DayOfWeek.MONDAY) + ".xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nom + "\"")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(classeur);
    }
}
