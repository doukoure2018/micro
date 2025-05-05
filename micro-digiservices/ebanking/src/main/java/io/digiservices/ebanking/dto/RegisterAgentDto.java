package io.digiservices.ebanking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterAgentDto {

    private Long id;
    private String codCliente;
    private String contact;
    private String codUser;
    private String password;
    private String confirmedPassword;
    private String state;
    private Long idManagerAgent;
}
