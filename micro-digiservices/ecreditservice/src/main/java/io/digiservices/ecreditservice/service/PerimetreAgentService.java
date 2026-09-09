package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

/**
 * Périmètre d'action d'un agent de crédit sur les membres : le numéro membre commence
 * par le code du point de service (ex. 951 Kaloum -> 95140026599). La consultation de
 * la fiche reste libre ; la correction et le changement de téléphone sont limités aux
 * membres du point de service de l'agent. Seul l'AGENT_CREDIT est restreint — le
 * correcteur central (AGENT_CORRECTEUR) et le back-office ne le sont pas.
 */
@Service
@RequiredArgsConstructor
public class PerimetreAgentService {

    private final JdbcClient jdbcClient;

    public record PerimetreAgent(boolean restreint, String pointventeCode, String libelle) {
    }

    public PerimetreAgent perimetre(User user) {
        if (user == null || !"AGENT_CREDIT".equals(user.getRole())) {
            return new PerimetreAgent(false, null, null);
        }
        if (user.getPointventeId() == null) {
            return new PerimetreAgent(true, null, null);
        }
        Optional<Map<String, Object>> pv = jdbcClient
                .sql("SELECT code, libele FROM pointvente WHERE id = :id")
                .param("id", user.getPointventeId())
                .query().listOfRows().stream().findFirst();
        return new PerimetreAgent(true,
                pv.map(r -> (String) r.get("code")).orElse(null),
                pv.map(r -> (String) r.get("libele")).orElse(null));
    }

    /** Bloque l'action (403) si le membre n'appartient pas au point de service de l'agent. */
    public void exigerMembreDansPerimetre(User user, String codCliente) {
        PerimetreAgent p = perimetre(user);
        if (!p.restreint()) {
            return;
        }
        if (p.pointventeCode() == null || p.pointventeCode().isBlank()) {
            throw new ValidationException(
                    "Aucun point de service rattaché à votre compte — contactez l'administrateur");
        }
        if (codCliente == null || !codCliente.strip().startsWith(p.pointventeCode())) {
            throw new ValidationException("Ce membre n'appartient pas à votre point de service ("
                    + p.pointventeCode() + (p.libelle() != null ? " " + p.libelle() : "")
                    + ") — vous ne pouvez agir que sur les membres " + p.pointventeCode() + "xxxxxxxx");
        }
    }
}
