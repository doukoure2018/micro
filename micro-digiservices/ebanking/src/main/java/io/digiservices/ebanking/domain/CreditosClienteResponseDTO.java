package io.digiservices.ebanking.domain;

import io.digiservices.ebanking.dto.EvaluationRisqueDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditosClienteResponseDTO {
    private String codCliente;
    private List<CreditoDTO> creditos;
    private List<PlanPagoDTO> planPagos;
    private List<ResumenPlanPagoDTO> resumenes;
    private EvaluationRisqueDTO evaluationRisque; // Nouvelle propriété
    private String mensaje;
}