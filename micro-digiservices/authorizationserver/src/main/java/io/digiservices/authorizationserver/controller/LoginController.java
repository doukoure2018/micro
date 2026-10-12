package io.digiservices.authorizationserver.controller;

import io.digiservices.authorizationserver.exception.ApiException;
import io.digiservices.authorizationserver.model.User;
import io.digiservices.authorizationserver.security.MobileOAuthSessionFilter;
import io.digiservices.authorizationserver.security.MfaAuthentication;
import io.digiservices.authorizationserver.service.UserService;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import static io.digiservices.authorizationserver.utils.RequestUtils.getMessage;
import static io.digiservices.authorizationserver.utils.UserUtils.getUser;

@Controller
@AllArgsConstructor
public class LoginController {
    /** Flux pour lequel la page de login a ete affichee (session), relu au re-affichage apres erreur. */
    public static final String LOGIN_FLOW_CLIENT_KEY = "LOGIN_FLOW_CLIENT";
    private static final long FRAICHEUR_AUTORISATION_MS = 90_000;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
    private final AuthenticationFailureHandler authenticationFailureHandler = new SimpleUrlAuthenticationFailureHandler("/mfa?error");
    private final AuthenticationSuccessHandler authenticationSuccessHandler;
    private final UserService userService;

    @GetMapping("/login")
    public String login(@RequestParam(value = "error", required = false) String error,
                        HttpServletRequest request,
                        Model model) {
        if (error != null) {
            String errorMessage = getErrorMessage(request);
            model.addAttribute("errorMessage", errorMessage);
        }
        model.addAttribute("flowClient", flowClientPourCettePage(request, error != null));
        return "login";
    }

    /**
     * Client OAuth2 pour lequel la page de login est affichee. La page suit une autorisation de
     * moins de 90 s (redirection immediate de /oauth2/authorize) : c'est ce client. Sinon (acces
     * direct a /login, autorisation ancienne laissee en attente par un autre onglet, AgriScore par
     * exemple) : la SPA digi. Memorise en session pour que le re-affichage apres un mot de passe
     * errone garde le meme flux, meme au-dela des 90 s.
     */
    private String flowClientPourCettePage(HttpServletRequest request, boolean reaffichageApresErreur) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return MobileOAuthSessionFilter.DIGI_SPA_CLIENT_ID;
        }
        Object memorise = session.getAttribute(LOGIN_FLOW_CLIENT_KEY);
        if (reaffichageApresErreur && memorise != null) {
            return memorise.toString();
        }
        String flux = MobileOAuthSessionFilter.DIGI_SPA_CLIENT_ID;
        Object client = session.getAttribute(MobileOAuthSessionFilter.WEB_AUTH_CLIENT_KEY);
        Object at = session.getAttribute(MobileOAuthSessionFilter.WEB_AUTH_AT_KEY);
        if (client != null && !client.toString().isBlank() && at instanceof Long instant
                && System.currentTimeMillis() - instant < FRAICHEUR_AUTORISATION_MS) {
            flux = client.toString();
        }
        session.setAttribute(LOGIN_FLOW_CLIENT_KEY, flux);
        return flux;
    }

    private String getErrorMessage(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            AuthenticationException exception = (AuthenticationException) session.getAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
            if (exception != null) {
                // Clear the exception from session after reading
                session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
                
                // Return French error messages based on exception type
                if (exception instanceof BadCredentialsException) {
                    return "Email ou mot de passe incorrect";
                } else if (exception instanceof UsernameNotFoundException) {
                    return "Compte utilisateur introuvable";
                } else if (exception instanceof DisabledException) {
                    return "Votre compte a été désactivé";
                } else if (exception instanceof LockedException) {
                    return "Votre compte a été verrouillé";
                } else {
                    // Return the original message or a default one
                    String message = exception.getMessage();
                    return (message != null && !message.isEmpty()) ? message : "Échec de l'authentification";
                }
            }
        }
        return "Email ou mot de passe incorrect";
    }

    @GetMapping("/mfa")
    public String mfa(Model model, @CurrentSecurityContext SecurityContext context) {
        model.addAttribute("email", getAuthenticatedUser(context.getAuthentication()));
        return "mfa";
    }

    @PostMapping("/mfa")
    public void validateCode(@RequestParam("code") String code, HttpServletRequest request, HttpServletResponse response, @CurrentSecurityContext SecurityContext context) throws ServletException, IOException {
        var user = getUser(context.getAuthentication());
        if(userService.verifyQrCode(user.getUserUuid(), code)) {
            this.authenticationSuccessHandler.onAuthenticationSuccess(request, response, getAuthentication(request, response));
            return;
        }
        this.authenticationFailureHandler.onAuthenticationFailure(request, response, new BadCredentialsException("Invalid QR code. Please try again."));
    }

    @GetMapping("/logout")
    public String logout() {
        return "logout";
    }

    @GetMapping("/error")
    public String error(HttpServletRequest request, HttpServletResponse response, Model model, Exception exception) {
        var errorException = (Exception) request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);
        if(errorException instanceof ApiException || errorException instanceof BadCredentialsException) {
            request.getSession().setAttribute(WebAttributes.AUTHENTICATION_EXCEPTION, errorException);
            return "login";
        }
        model.addAttribute("message", getMessage(request));
        return "error";
    }

    private Authentication getAuthentication(HttpServletRequest request, HttpServletResponse response) {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        MfaAuthentication mfaAuthentication = (MfaAuthentication) securityContext.getAuthentication();
        securityContext.setAuthentication(mfaAuthentication);
        SecurityContextHolder.setContext(securityContext);
        securityContextRepository.saveContext(securityContext, request, response);
        return mfaAuthentication.getPrimaryAuthentication();
    }

    private Object getAuthenticatedUser(Authentication authentication) {
        return ((User) authentication.getPrincipal()).getEmail();
    }
}
