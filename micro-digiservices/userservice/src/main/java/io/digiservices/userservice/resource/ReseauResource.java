package io.digiservices.userservice.resource;

import io.digiservices.userservice.domain.Response;
import io.digiservices.userservice.service.ReseauService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

import static io.digiservices.userservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.ok;

/**
 * Reseau geolocalise des points de vente : import/export Excel (SUPER_ADMIN)
 * et liste pour la carte. Route gateway : /user/reseau/**.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/user/reseau")
@Slf4j
public class ReseauResource {

    private final ReseauService reseauService;

    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    @PostMapping("/import")
    public ResponseEntity<Response> importExcel(@RequestParam("file") MultipartFile file,
                                                HttpServletRequest request) {
        var rapport = reseauService.importExcel(file);
        return ok(getResponse(request, Map.of("rapport", rapport), "Import du reseau termine", OK));
    }

    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] data = reseauService.exportExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"reseau_points_vente.xlsx\"")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }

    @GetMapping("/points")
    public ResponseEntity<Response> points(@RequestParam(name = "delegation", required = false) String delegation,
                                           @RequestParam(name = "type", required = false) String type,
                                           HttpServletRequest request) {
        var points = reseauService.getPoints(delegation, type);
        return ok(getResponse(request, Map.of("points", points), "Points du reseau", OK));
    }
}
