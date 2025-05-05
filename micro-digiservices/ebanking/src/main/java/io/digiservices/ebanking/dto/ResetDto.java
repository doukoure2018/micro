package io.digiservices.ebanking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResetDto {

    private String codUser;
    private String password;
    private String confirmedPassword;

}
