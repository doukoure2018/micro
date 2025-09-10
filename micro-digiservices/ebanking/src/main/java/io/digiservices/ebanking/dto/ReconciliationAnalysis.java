package io.digiservices.ebanking.dto;

import io.digiservices.ebanking.entity.Mouvement;
import io.digiservices.ebanking.entity.TransactionSaf;
import lombok.Data;

import java.util.List;

@Data
public class ReconciliationAnalysis {
    private List<TransactionSaf> missingInProduction;
    private List<Mouvement> extraInProduction;
    private int matchedCount;
}