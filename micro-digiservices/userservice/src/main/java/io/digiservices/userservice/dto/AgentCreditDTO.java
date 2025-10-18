package io.digiservices.userservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgentCreditDTO {

    @JsonProperty("delegationLibele")
    private String delegationLibele;

    @JsonProperty("agenceId")
    private Long agenceId;

    @JsonProperty("agenceLibele")
    private String agenceLibele;

    @JsonProperty("pointventeLibele")
    private String pointventeLibele;

    @JsonProperty("pointventeCode")
    private String pointventeCode;

    @JsonProperty("pointventeId")
    private Long pointventeId;

    @JsonProperty("userId")
    private Long userId;

    @JsonProperty("username")
    private String username;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("email")
    private String email;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("roleName")
    private String roleName;

    @JsonProperty("fullName")
    private String fullName;

    @JsonProperty("pointVenteDisplay")
    private String pointVenteDisplay;
}
