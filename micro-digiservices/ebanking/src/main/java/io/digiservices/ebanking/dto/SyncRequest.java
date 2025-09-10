package io.digiservices.ebanking.dto;

import lombok.Data;

import java.util.List;

@Data
public class SyncRequest {
    private List<Long> transactionNums;
}
