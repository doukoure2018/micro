package io.digiservices.userservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

/**
 * Requête de changement de mot de passe par un administrateur.
 * Contrairement à {@link PasswordRequest}, l'ancien mot de passe n'est pas requis :
 * l'administrateur définit directement un nouveau mot de passe pour l'utilisateur ciblé.
 */
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class AdminPasswordRequest {

    @NotEmpty(message = "Le mot de passe ne peut pas être vide")
    private String password;

    @NotEmpty(message = "La confirmation du mot de passe ne peut pas être vide")
    private String confirmPassword;
}
