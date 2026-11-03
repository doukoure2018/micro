package io.digiservices.ecreditservice.service;

import io.digiservices.clients.portefeuille.CompteMalAdosseDto;
import io.digiservices.clients.portefeuille.DossierCompteSafDto;

import java.util.Set;

/**
 * Ce que SAF repond quand on lui redemande, a l'instant, si une anomalie de compte de
 * remboursement tient encore.
 *
 * <p>La detection tourne en SQL sur tout le portefeuille
 * ({@code PortefeuilleRepository.SQL_COMPTES_MAL_ADOSSES}). Pour UN credit, la meme regle est
 * reecrite ici en Java, a partir du dossier SAF que l'ecran lit deja : le compte saisi tel qu'il
 * est reellement, et l'etat du credit. Les deux doivent dire la meme chose, sans quoi un compte
 * paraitrait corrige a l'unite et fautif au passage horaire — ou l'inverse. C'est la raison
 * d'etre des tests de cette classe.</p>
 *
 * <p>Classe pure : aucune base, aucun Spring, aucune date. Elle lit un dossier et rend un
 * verdict.</p>
 */
public final class CompteMalAdosseVerdict {

    /** Le compte est devenu conforme : la ligne se referme. */
    public static final String CORRIGE = "CORRIGE";
    /** Le credit n'est plus dans le perimetre surveille, ou a disparu de SAF : la ligne se referme. */
    public static final String HORS_PERIMETRE = "HORS_PERIMETRE";
    /** L'anomalie tient. Sa famille a pu changer — un compte ferme depuis, par exemple. */
    public static final String TOUJOURS_MAL_ADOSSE = "TOUJOURS_MAL_ADOSSE";

    /**
     * @param conclusion   l'une des trois constantes ci-dessus
     * @param famille      la famille d'anomalie constatee maintenant, ou {@code null} si aucune
     * @param compteActuel le compte de remboursement tel que SAF le porte a l'instant
     * @param explication  une phrase pour l'ecran et le journal
     */
    public record Verdict(String conclusion, String famille, String compteActuel, String explication) {

        /** La ligne doit-elle se refermer ? */
        public boolean ferme() {
            return !TOUJOURS_MAL_ADOSSE.equals(conclusion);
        }
    }

    private CompteMalAdosseVerdict() {
    }

    private static String net(String valeur) {
        return valeur == null ? "" : valeur.trim();
    }

    /** Les positions 4 a 6 du numero de compte, qui en donnent la nature ; vide si illisible. */
    static String typeCompte(String numCompte) {
        String n = net(numCompte);
        return n.length() >= 6 ? n.substring(3, 6) : "";
    }

    /**
     * Le verdict pour un credit, d'apres ce que SAF montre a l'instant.
     *
     * @param dossier         le dossier SAF, ou {@code null} si le credit n'existe plus
     * @param etatsSurveilles les etats de credit que la detection retient (I, J, D)
     * @param typesAutorises  les types de compte admis comme compte de remboursement (014, 011)
     */
    public static Verdict verdict(DossierCompteSafDto dossier, Set<String> etatsSurveilles,
                                  Set<String> typesAutorises) {
        if (dossier == null) {
            return new Verdict(HORS_PERIMETRE, null, null, "Ce credit n'existe plus dans SAF.");
        }
        String etat = net(dossier.getIndEstado()).toUpperCase();
        if (!etatsSurveilles.contains(etat)) {
            return new Verdict(HORS_PERIMETRE, null, net(dossier.getIdCuenta()),
                    "Le credit est a l'etat " + (etat.isEmpty() ? "(vide)" : etat)
                            + " : il sort du perimetre surveille.");
        }

        String idCuenta = net(dossier.getIdCuenta());
        if (idCuenta.isEmpty()) {
            return new Verdict(TOUJOURS_MAL_ADOSSE, CompteMalAdosseDto.PAS_DE_COMPTE, "",
                    "Le credit n'a toujours aucun compte de remboursement.");
        }

        DossierCompteSafDto.CompteSafDto compte = dossier.getCompteSaisi();
        if (compte == null) {
            return new Verdict(TOUJOURS_MAL_ADOSSE, CompteMalAdosseDto.COMPTE_INEXISTANT, idCuenta,
                    "Le compte " + idCuenta + " n'existe toujours pas dans SAF.");
        }
        if (!net(compte.getCodCliente()).equals(net(dossier.getCodCliente()))) {
            String proprietaire = net(compte.getNomCliente()).isEmpty()
                    ? net(compte.getCodCliente()) : net(compte.getNomCliente());
            return new Verdict(TOUJOURS_MAL_ADOSSE, CompteMalAdosseDto.COMPTE_AUTRE_CLIENT, idCuenta,
                    "Le compte " + idCuenta + " appartient toujours a " + proprietaire + ".");
        }
        if (!"A".equalsIgnoreCase(net(compte.getIndEstado()))) {
            return new Verdict(TOUJOURS_MAL_ADOSSE, CompteMalAdosseDto.COMPTE_NON_ACTIF, idCuenta,
                    "Le compte " + idCuenta + " est toujours a l'etat "
                            + net(compte.getIndEstado()) + ".");
        }
        String type = typeCompte(idCuenta);
        if (!typesAutorises.contains(type)) {
            return new Verdict(TOUJOURS_MAL_ADOSSE, CompteMalAdosseDto.TYPE_NON_AUTORISE, idCuenta,
                    "Le compte " + idCuenta + " est toujours de type " + type + ".");
        }
        return new Verdict(CORRIGE, null, idCuenta,
                "Le credit est adosse au compte " + idCuenta + ", actif et au nom du client.");
    }
}
