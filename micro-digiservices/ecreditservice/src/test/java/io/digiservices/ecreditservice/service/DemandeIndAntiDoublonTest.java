package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.DemandeIndividuel;
import io.digiservices.ecreditservice.exception.ValidationException;
import io.digiservices.ecreditservice.repository.DemandeIndRepository;
import io.digiservices.ecreditservice.service.impl.DemandeIndServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * L'anti-doublon doit porter sur le chemin de création que les formulaires utilisent
 * ({@code addDemandeIndWithGaranties}), pas seulement sur {@code addDemandeInd} que plus
 * personne n'appelle. Le 14/11/2026, un groupe a été enregistré 24 fois en 1 h 40 ; le
 * 20/11, 69 membres avaient 180 demandes vivantes.
 */
class DemandeIndAntiDoublonTest {

    private final DemandeIndRepository repository = Mockito.mock(DemandeIndRepository.class);
    private final DemandeIndServiceImpl service = new DemandeIndServiceImpl(repository, null, null);

    private static DemandeIndividuel existante() {
        DemandeIndividuel d = new DemandeIndividuel();
        d.setDemandeIndividuelId(11416L);
        d.setNom("CAS SIGUIDOYE");
        d.setPrenom("");
        d.setMontantDemande(new BigDecimal("16000000"));
        d.setValidationState("APPROVED");
        d.setCreatedAt(LocalDateTime.now().minusDays(2));
        return d;
    }

    private static DemandeIndividuel nouvelle(String membre) {
        DemandeIndividuel d = new DemandeIndividuel();
        d.setNumeroMembre(membre);
        d.setNatureClient("Demande de credit Pour Groupe Solidaire");
        d.setMontantDemande(new BigDecimal("16000000"));
        return d;
    }

    @Test
    @DisplayName("une demande vivante du même membre fait refuser la création avec garanties, en nommant la demande existante")
    void refusSurLeCheminDesFormulaires() {
        when(repository.findDemandeEnCours("15200112221")).thenReturn(Optional.of(existante()));

        ValidationException e = assertThrows(ValidationException.class,
                () -> service.addDemandeIndWithGaranties(nouvelle(" 15200112221 ")));

        assertTrue(e.getMessage().contains("11416"), e.getMessage());
        assertTrue(e.getMessage().contains("APPROVED"), e.getMessage());
        assertTrue(e.getMessage().contains("Annuler le dossier"), e.getMessage());
        verify(repository, never()).addNewDemandeIndWithGaranties(any());
    }

    @Test
    @DisplayName("sans demande vivante, le contrôle laisse passer et consulte le dépôt avec le numéro nettoyé")
    void passeSansDoublon() {
        when(repository.findDemandeEnCours("15200007056")).thenReturn(Optional.empty());
        assertDoesNotThrow(() -> service.refuserSiDemandeEnCours(" 15200007056 "));
        verify(repository).findDemandeEnCours("15200007056");
    }

    @Test
    @DisplayName("au-delà de 30 jours, l'ancienne demande n'empêche plus la saisie (renouvellement après remboursement)")
    void ancienneDemandeNeBloquePlus() {
        DemandeIndividuel vieille = existante();
        vieille.setCreatedAt(LocalDateTime.now().minusDays(DemandeIndServiceImpl.JOURS_REFUS_DOUBLON + 1));
        when(repository.findDemandeEnCours("15200112221")).thenReturn(Optional.of(vieille));

        assertDoesNotThrow(() -> service.refuserSiDemandeEnCours("15200112221"));
        assertFalse(DemandeIndServiceImpl.doublonBloquant(vieille));

        DemandeIndividuel limite = existante();
        limite.setCreatedAt(LocalDateTime.now().minusDays(DemandeIndServiceImpl.JOURS_REFUS_DOUBLON - 1));
        assertTrue(DemandeIndServiceImpl.doublonBloquant(limite), "29 jours : encore dans la fenêtre de refus");

        DemandeIndividuel sansDate = existante();
        sansDate.setCreatedAt(null);
        assertTrue(DemandeIndServiceImpl.doublonBloquant(sansDate), "date inconnue : on refuse par prudence");
    }

    @Test
    @DisplayName("sans numéro de membre, aucun contrôle (la validation des données prendra le relais)")
    void sansNumero() {
        service.refuserSiDemandeEnCours(null);
        service.refuserSiDemandeEnCours("   ");
        verifyNoInteractions(repository);
    }
}
