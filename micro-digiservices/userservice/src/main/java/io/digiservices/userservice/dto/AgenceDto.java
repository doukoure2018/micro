package io.digiservices.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AgenceDto {
    private Long id;
    private String libele;
    private Long delegation_id;
}