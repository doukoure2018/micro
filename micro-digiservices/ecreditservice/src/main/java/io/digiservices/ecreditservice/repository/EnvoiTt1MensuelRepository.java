package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

/** Tracabilite et idempotence de l'envoi mensuel de l'etat TT1 (V157). */
@Repository
@RequiredArgsConstructor
public class EnvoiTt1MensuelRepository {

    private final JdbcClient jdbcClient;

    /** Adresses ayant deja recu l'etat de cette periode : evite tout doublon apres redemarrage. */
    public Set<String> destinatairesDejaServis(LocalDate periode) {
        return new java.util.HashSet<>(jdbcClient.sql("""
                        SELECT destinataire_email FROM envoi_tt1_mensuel
                        WHERE periode = :periode AND statut = 'ENVOYE'
                        """)
                .param("periode", periode)
                .query(String.class).list());
    }

    public void enregistrerEnvoi(LocalDate periode, String email, String nom, String role, int nbPs,
                                 Long nbEcheances, BigDecimal attendu, BigDecimal reste,
                                 int nbLignesJointes, int tailleOctets, boolean detailJoint) {
        jdbcClient.sql("""
                        INSERT INTO envoi_tt1_mensuel (periode, destinataire_email, destinataire_nom, role,
                            nb_points_service, nb_echeances, montant_attendu, reste_a_encaisser,
                            nb_lignes_jointes, taille_octets, detail_joint, statut)
                        VALUES (:periode, :email, :nom, :role, :nbPs, :nbEcheances, :attendu, :reste,
                            :nbLignes, :taille, :detailJoint, 'ENVOYE')
                        """)
                .param("periode", periode).param("email", email).param("nom", nom).param("role", role)
                .param("nbPs", nbPs).param("nbEcheances", nbEcheances).param("attendu", attendu)
                .param("reste", reste).param("nbLignes", nbLignesJointes).param("taille", tailleOctets)
                .param("detailJoint", detailJoint)
                .update();
    }

    public void enregistrerEchec(LocalDate periode, String email, String nom, String role, String erreur) {
        jdbcClient.sql("""
                        INSERT INTO envoi_tt1_mensuel (periode, destinataire_email, destinataire_nom, role,
                            statut, erreur)
                        VALUES (:periode, :email, :nom, :role, 'ECHEC', :erreur)
                        """)
                .param("periode", periode).param("email", email).param("nom", nom).param("role", role)
                .param("erreur", erreur == null ? null : erreur.substring(0, Math.min(1000, erreur.length())))
                .update();
    }
}
