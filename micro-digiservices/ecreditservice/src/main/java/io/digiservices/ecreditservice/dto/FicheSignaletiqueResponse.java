package io.digiservices.ecreditservice.dto;

import lombok.Data;

import java.util.Map;

@Data
public class FicheSignaletiqueResponse {
    private String status;
    private Integer code;
    private Map<String, Object> data;
    private Map<String, Object> metadata;
    private String errorCode;
    private String message;
    private String codCliente;
    private Long timestamp;
}