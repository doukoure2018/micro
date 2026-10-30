package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.AuditDtos.ActionSensibleDto;
import io.digiservices.ecreditservice.dto.AuditDtos.AnnulationsDto;
import io.digiservices.ecreditservice.dto.AuditDtos.CompteAuditDto;
import io.digiservices.ecreditservice.dto.AuditDtos.ComptesAuditDto;
import io.digiservices.ecreditservice.dto.AuditDtos.CorrectionNumeroDto;
import io.digiservices.ecreditservice.dto.AuditDtos.DecisionDto;
import io.digiservices.ecreditservice.dto.AuditDtos.DelaiAgenceDto;
import io.digiservices.ecreditservice.dto.AuditDtos.DelaiEtapeDto;
import io.digiservices.ecreditservice.dto.AuditDtos.DelaisDerogationsDto;
import io.digiservices.ecreditservice.dto.AuditDtos.DerogationDto;
import io.digiservices.ecreditservice.dto.AuditDtos.DossierDormantDto;
import io.digiservices.ecreditservice.dto.AuditDtos.ResoumissionDto;
import io.digiservices.ecreditservice.dto.AuditDtos.MatriceLectureDto;
import io.digiservices.ecreditservice.dto.AuditDtos.SortieDossierDto;
import io.digiservices.ecreditservice.dto.AuditDtos.TraceCompteDto;
import io.digiservices.ecreditservice.dto.AuditDtos.TraceHabilitationDto;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/** Exports des journaux d'audit : une feuille par liste, toutes les colonnes de l'ecran. */
public final class AuditExcelUtils {

    private AuditExcelUtils() {
    }

    private static final DateTimeFormatter FMT_JOUR = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HEURE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    // ==================== Journal des decisions ====================

    public static byte[] decisions(List<DecisionDto> lignes, long total, boolean tronque) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);
            Sheet f = wb.createSheet("Decisions");
            int r = titre(f, st, "Journal des décisions — " + total + " évènement(s)",
                    tronque ? "Export limité aux lignes affichées : la sélection dépasse le plafond d'export."
                            : "Le délai est le temps écoulé depuis l'évènement précédent du même dossier.");
            String[] entetes = {"Date", "Dossier", "Client", "N° membre", "Montant", "Évènement",
                    "État de départ", "État d'arrivée", "Statut de départ", "Statut d'arrivée",
                    "Acteur", "Motif", "Délai (heures)", "Point de service", "Agence", "Délégation"};
            r = entetes(f, st, r, entetes);
            for (DecisionDto d : lignes) {
                Row row = f.createRow(r++);
                int c = 0;
                cel(row, c++, heure(d.getDateEvenement()), null);
                nombre(row, c++, d.getDemandeId());
                cel(row, c++, d.getClient(), null);
                cel(row, c++, d.getNumeroMembre(), null);
                montant(row, c++, d.getMontant(), st.montant);
                cel(row, c++, d.getEvenement(), null);
                cel(row, c++, d.getAncienEtat(), null);
                cel(row, c++, d.getNouvelEtat(), null);
                cel(row, c++, d.getAncienStatut(), null);
                cel(row, c++, d.getNouveauStatut(), null);
                cel(row, c++, d.getActeur(), null);
                cel(row, c++, d.getMotif(), null);
                nombre(row, c++, d.getDelaiHeures());
                cel(row, c++, d.getPointVente(), null);
                cel(row, c++, d.getAgence(), null);
                cel(row, c, d.getDelegation(), null);
            }
            ajuster(f, entetes.length);
            wb.write(out);
            return out.toByteArray();
        }
    }

    // ==================== Sorties de dossiers ====================

    public static byte[] annulations(AnnulationsDto d) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);
            feuilleSorties(wb, st, "Sorties sans motif", d.getSansMotif(),
                    d.getNbSansMotif() + " dossier(s) sortis définitivement sans motif ni auteur, pour "
                            + montantTexte(d.getMontantSansMotif()) + " GNF demandés.");
            feuilleSorties(wb, st, "Annulations", d.getAnnulees(),
                    d.getNbAnnulees() + " annulation(s) en règle : motif et décideur enregistrés.");
            feuilleSorties(wb, st, "Annulations en attente", d.getEnAttente(),
                    d.getNbEnAttente() + " demande(s) d'annulation que le directeur d'agence n'a pas tranchées.");
            wb.write(out);
            return out.toByteArray();
        }
    }

    private static void feuilleSorties(Workbook wb, Styles st, String nom, List<SortieDossierDto> lignes, String sous) {
        Sheet f = wb.createSheet(nom);
        int r = titre(f, st, nom, sous);
        String[] entetes = {"Dossier", "Client", "N° membre", "Montant", "Statut", "Étape",
                "État avant annulation", "Code motif", "Motif", "Demandée par", "Le",
                "Décidée par", "Le", "Motif du refus", "Créé le", "Tracée",
                "Point de service", "Agence", "Délégation"};
        r = entetes(f, st, r, entetes);
        for (SortieDossierDto s : lignes) {
            Row row = f.createRow(r++);
            int c = 0;
            nombre(row, c++, s.getDemandeId());
            cel(row, c++, s.getClient(), null);
            cel(row, c++, s.getNumeroMembre(), null);
            montant(row, c++, s.getMontant(), st.montant);
            cel(row, c++, s.getStatutDemande(), null);
            cel(row, c++, s.getValidationState(), null);
            cel(row, c++, s.getEtatAvantAnnulation(), null);
            cel(row, c++, s.getMotifCode(), null);
            cel(row, c++, s.getMotif(), null);
            cel(row, c++, s.getDemandeePar(), null);
            cel(row, c++, heure(s.getDateDemande()), null);
            cel(row, c++, s.getDecideePar(), null);
            cel(row, c++, heure(s.getDateDecision()), null);
            cel(row, c++, s.getMotifRefus(), null);
            cel(row, c++, jour(s.getDateCreation()), null);
            cel(row, c++, s.isTracee() ? "oui" : "NON", null);
            cel(row, c++, s.getPointVente(), null);
            cel(row, c++, s.getAgence(), null);
            cel(row, c, s.getDelegation(), null);
        }
        ajuster(f, entetes.length);
    }

    // ==================== Corrections de numero de membre ====================

    public static byte[] correctionsNumero(List<CorrectionNumeroDto> lignes) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);
            Sheet f = wb.createSheet("Corrections de numero");
            int r = titre(f, st, "Corrections de numéro de membre — " + lignes.size() + " ligne(s)",
                    "Le numéro identifie le client d'un crédit : chaque changement est confronté à SAF et tracé.");
            String[] entetes = {"Date", "Dossier", "Client", "Ancien numéro", "Nouveau numéro",
                    "Nom rendu par SAF", "Agence SAF", "Motif", "Par", "Rôle", "Point de service", "Agence"};
            r = entetes(f, st, r, entetes);
            for (CorrectionNumeroDto c0 : lignes) {
                Row row = f.createRow(r++);
                int c = 0;
                cel(row, c++, heure(c0.getDateCorrection()), null);
                nombre(row, c++, c0.getDemandeId());
                cel(row, c++, c0.getClient(), null);
                cel(row, c++, c0.getAncienNumero(), null);
                cel(row, c++, c0.getNouveauNumero(), null);
                cel(row, c++, c0.getNomSaf(), null);
                cel(row, c++, c0.getAgenceSaf(), null);
                cel(row, c++, c0.getMotif(), null);
                cel(row, c++, c0.getParNom(), null);
                cel(row, c++, c0.getParRole(), null);
                cel(row, c++, c0.getPointVente(), null);
                cel(row, c, c0.getAgence(), null);
            }
            ajuster(f, entetes.length);
            wb.write(out);
            return out.toByteArray();
        }
    }

    // ==================== Comptes, blocages, habilitations ====================

    public static byte[] comptes(ComptesAuditDto d) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);

            Sheet f = wb.createSheet("Comptes");
            int r = titre(f, st, "Comptes — " + d.getNbComptes() + " dont " + d.getNbActifs() + " actifs",
                    d.getNbBloques() + " bloqué(s) ou désactivé(s), " + d.getNbJamaisConnectes()
                            + " jamais connecté(s), " + d.getNbSansConnexionDepuis90Jours() + " sans connexion depuis 90 jours.");
            String[] e1 = {"Id", "Nom", "Courriel", "Téléphone", "Rôle", "Service", "Département",
                    "Point de service", "Agence", "Délégation", "État", "Dernière connexion",
                    "Jours sans connexion", "Créé le", "Courriel vérifié", "Téléphone vérifié", "Correction imposée"};
            r = entetes(f, st, r, e1);
            for (CompteAuditDto c0 : d.getComptes()) {
                Row row = f.createRow(r++);
                int c = 0;
                nombre(row, c++, c0.getUserId());
                cel(row, c++, c0.getNom(), null);
                cel(row, c++, c0.getEmail(), null);
                cel(row, c++, c0.getTelephone(), null);
                cel(row, c++, c0.getRole(), null);
                cel(row, c++, c0.getService(), null);
                cel(row, c++, c0.getDepartement(), null);
                cel(row, c++, c0.getPointVente(), null);
                cel(row, c++, c0.getAgence(), null);
                cel(row, c++, c0.getDelegation(), null);
                cel(row, c++, c0.isActif() ? "actif" : "BLOQUÉ", null);
                cel(row, c++, jour(c0.getDerniereConnexion()), null);
                nombre(row, c++, c0.getJoursSansConnexion());
                cel(row, c++, jour(c0.getCreeLe()), null);
                cel(row, c++, c0.isEmailVerifie() ? "oui" : "non", null);
                cel(row, c++, c0.isTelephoneVerifie() ? "oui" : "non", null);
                cel(row, c, c0.isContactsACorriger() ? "oui" : "", null);
            }
            ajuster(f, e1.length);

            Sheet f2 = wb.createSheet("Journal des comptes");
            int r2 = titre(f2, st, "Blocages et réactivations de comptes", null);
            String[] e2 = {"Date", "Compte", "Id", "Action", "Motif", "Par"};
            r2 = entetes(f2, st, r2, e2);
            for (TraceCompteDto t : d.getJournalComptes()) {
                Row row = f2.createRow(r2++);
                int c = 0;
                cel(row, c++, heure(t.getDateAction()), null);
                cel(row, c++, t.getCompte(), null);
                nombre(row, c++, t.getUserId());
                cel(row, c++, t.getAction(), null);
                cel(row, c++, t.getMotif(), null);
                cel(row, c, t.getParNom(), null);
            }
            ajuster(f2, e2.length);

            Sheet f3 = wb.createSheet("Journal des habilitations");
            int r3 = titre(f3, st, "Réglages de la matrice d'habilitations", null);
            String[] e3 = {"Date", "Action", "Service", "Département", "Rubrique", "Libellé",
                    "Valeur avant", "Valeur après", "Par"};
            r3 = entetes(f3, st, r3, e3);
            for (TraceHabilitationDto t : d.getJournalHabilitations()) {
                Row row = f3.createRow(r3++);
                int c = 0;
                cel(row, c++, heure(t.getDateAction()), null);
                cel(row, c++, t.getAction(), null);
                cel(row, c++, t.getService(), null);
                cel(row, c++, t.getDepartement(), null);
                cel(row, c++, t.getRubriqueCode(), null);
                cel(row, c++, t.getRubriqueLibelle(), null);
                cel(row, c++, t.getValeurAvant(), null);
                cel(row, c++, t.getValeurApres(), null);
                cel(row, c, t.getParNom(), null);
            }
            ajuster(f3, e3.length);

            Sheet f4 = wb.createSheet("Matrice");
            int r4 = titre(f4, st, "Matrice d'habilitations, en lecture",
                    "Réglage par département " + (d.isParDepartementActif() ? "ACTIF" : "encore fermé")
                            + " : tant qu'il est fermé, un responsable de service garde toutes les rubriques de son service.");
            String[] e4 = {"Service", "Code", "Département", "Voit tout", "Comptes", "Rubriques"};
            r4 = entetes(f4, st, r4, e4);
            for (MatriceLectureDto m : d.getMatrice()) {
                Row row = f4.createRow(r4++);
                int c = 0;
                cel(row, c++, m.getService(), null);
                cel(row, c++, m.getCode(), null);
                cel(row, c++, m.getLibelle(), null);
                cel(row, c++, m.isToutVoir() ? "oui" : "", null);
                nombre(row, c++, m.getNbComptes());
                cel(row, c, String.join(", ", m.getRubriques()), null);
            }
            ajuster(f4, e4.length);

            wb.write(out);
            return out.toByteArray();
        }
    }

    // ------------------------------------------------------------------ interne


    // ==================== Journal unifie des actions sensibles (lot 3) ====================

    public static byte[] actions(List<ActionSensibleDto> lignes, long total, boolean tronque) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);
            Sheet f = wb.createSheet("Actions sensibles");
            int r = titre(f, st, "Journal des actions sensibles — " + total + " action(s)",
                    tronque ? "Export limité aux lignes affichées : la sélection dépasse le plafond d'export."
                            : "Huit journaux réunis. La colonne Origine nomme la table d'où vient la ligne.");
            String[] entetes = {"Date et heure", "Type", "Auteur", "Objet", "Ce qui a changé", "Origine"};
            r = entetes(f, st, r, entetes);
            for (ActionSensibleDto a : lignes) {
                Row row = f.createRow(r++);
                cel(row, 0, heure(a.getQuand()), null);
                cel(row, 1, a.getType(), null);
                cel(row, 2, a.getCompte(), null);
                cel(row, 3, a.getObjet(), null);
                cel(row, 4, a.getDetail(), null);
                cel(row, 5, a.getOrigine(), null);
            }
            ajuster(f, entetes.length);
            wb.write(out);
            return out.toByteArray();
        }
    }

    // ==================== Delais et derogations (lot 3) ====================

    public static byte[] delais(DelaisDerogationsDto d) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);

            Sheet f = wb.createSheet("Derogations");
            int r = titre(f, st, "Dossiers validés au-dessus du plafond — " + d.getNbDerogations() + " dossier(s)",
                    "Échelle de délégation : DA jusqu'à 25 M, DR 50 M, DE 100 M, DG au-delà. "
                            + montantTexte(d.getMontantDerogations()) + " GNF au total.");
            String[] e1 = {"Dossier", "Client", "Montant", "Validé par", "Niveau", "Plafond du niveau",
                    "Dépassement", "Date de validation", "Point de service", "Agence", "Délégation"};
            r = entetes(f, st, r, e1);
            for (DerogationDto x : d.getDerogations()) {
                Row row = f.createRow(r++);
                int c = 0;
                nombre(row, c++, x.getDemandeId());
                cel(row, c++, x.getClient(), null);
                montant(row, c++, x.getMontant(), st.montant);
                cel(row, c++, x.getValideur(), null);
                cel(row, c++, x.getNiveau(), null);
                montant(row, c++, x.getPlafond(), st.montant);
                montant(row, c++, x.getDepassement(), st.montant);
                cel(row, c++, heure(x.getDateValidation()), null);
                cel(row, c++, x.getPointVente(), null);
                cel(row, c++, x.getAgence(), null);
                cel(row, c, x.getDelegation(), null);
            }
            ajuster(f, e1.length);

            Sheet f2 = wb.createSheet("Delais par etape");
            int r2 = titre(f2, st, "Attente moyenne avant chaque étape",
                    "Temps écoulé depuis l'évènement précédent du même dossier, en heures.");
            String[] e2 = {"Étape", "Passages", "Attente moyenne (h)", "Pire attente (h)"};
            r2 = entetes(f2, st, r2, e2);
            for (DelaiEtapeDto x : d.getParEtape()) {
                Row row = f2.createRow(r2++);
                cel(row, 0, x.getEtape(), null);
                nombre(row, 1, x.getPassages());
                nombre(row, 2, x.getMoyenneHeures());
                nombre(row, 3, x.getMaxHeures());
            }
            ajuster(f2, e2.length);

            Sheet f3 = wb.createSheet("Delais par agence");
            int r3 = titre(f3, st, "Attente moyenne par agence", "Agences totalisant au moins 20 évènements.");
            String[] e3 = {"Agence", "Délégation", "Évènements", "Attente moyenne (h)"};
            r3 = entetes(f3, st, r3, e3);
            for (DelaiAgenceDto x : d.getParAgence()) {
                Row row = f3.createRow(r3++);
                cel(row, 0, x.getAgence(), null);
                cel(row, 1, x.getDelegation(), null);
                nombre(row, 2, x.getEvenements());
                nombre(row, 3, x.getMoyenneHeures());
            }
            ajuster(f3, e3.length);

            Sheet f4 = wb.createSheet("Dossiers dormants");
            int r4 = titre(f4, st, "Dossiers sans mouvement — " + d.getNbDormants() + " dossier(s)",
                    "Dossiers encore dans le circuit dont plus rien n'a bougé depuis "
                            + d.getSeuilDormantJours() + " jours ou plus.");
            String[] e4 = {"Dossier", "Client", "Montant", "Étape", "Dernier évènement",
                    "Jours sans mouvement", "Point de service", "Agence", "Délégation"};
            r4 = entetes(f4, st, r4, e4);
            for (DossierDormantDto x : d.getDormants()) {
                Row row = f4.createRow(r4++);
                int c = 0;
                nombre(row, c++, x.getDemandeId());
                cel(row, c++, x.getClient(), null);
                montant(row, c++, x.getMontant(), st.montant);
                cel(row, c++, x.getEtat(), null);
                cel(row, c++, heure(x.getDernierEvenement()), null);
                nombre(row, c++, x.getJoursSansMouvement());
                cel(row, c++, x.getPointVente(), null);
                cel(row, c++, x.getAgence(), null);
                cel(row, c, x.getDelegation(), null);
            }
            ajuster(f4, e4.length);

            Sheet f5 = wb.createSheet("Allers-retours");
            int r5 = titre(f5, st, "Dossiers renvoyés plus d'une fois — " + d.getNbResoumis() + " dossier(s)",
                    "Le circuit a tourné en rond : autant de renvois en correction que de lignes ci-dessous.");
            String[] e5 = {"Dossier", "Client", "Montant", "Renvois", "Étapes de renvoi",
                    "Étape actuelle", "Dernier renvoi", "Point de service", "Agence"};
            r5 = entetes(f5, st, r5, e5);
            for (ResoumissionDto x : d.getResoumissions()) {
                Row row = f5.createRow(r5++);
                int c = 0;
                nombre(row, c++, x.getDemandeId());
                cel(row, c++, x.getClient(), null);
                montant(row, c++, x.getMontant(), st.montant);
                nombre(row, c++, x.getNbCorrections());
                cel(row, c++, x.getEtats(), null);
                cel(row, c++, x.getEtatActuel(), null);
                cel(row, c++, heure(x.getDerniereCorrection()), null);
                cel(row, c++, x.getPointVente(), null);
                cel(row, c, x.getAgence(), null);
            }
            ajuster(f5, e5.length);

            wb.write(out);
            return out.toByteArray();
        }
    }

    private static int titre(Sheet f, Styles st, String titre, String sous) {
        int r = 0;
        Cell c = f.createRow(r++).createCell(0);
        c.setCellValue(titre);
        c.setCellStyle(st.titre);
        f.createRow(r++).createCell(0).setCellValue("Lu le " + LocalDateTime.now().format(FMT_HEURE)
                + (sous == null ? "" : " — " + sous));
        return r + 1;
    }

    private static int entetes(Sheet f, Styles st, int r, String[] noms) {
        Row row = f.createRow(r);
        for (int i = 0; i < noms.length; i++) {
            cel(row, i, noms[i], st.entete);
        }
        f.createFreezePane(0, r + 1);
        return r + 1;
    }

    private static void ajuster(Sheet f, int colonnes) {
        for (int i = 0; i < colonnes; i++) {
            f.autoSizeColumn(i);
            if (f.getColumnWidth(i) > 60 * 256) {
                f.setColumnWidth(i, 60 * 256);
            }
        }
    }

    private static void cel(Row row, int col, String v, CellStyle style) {
        Cell c = row.createCell(col);
        c.setCellValue(v == null ? "" : v);
        if (style != null) c.setCellStyle(style);
    }

    private static void nombre(Row row, int col, Number v) {
        Cell c = row.createCell(col);
        if (v == null) {
            c.setCellValue("");
        } else {
            c.setCellValue(v.doubleValue());
        }
    }

    private static void montant(Row row, int col, BigDecimal v, CellStyle style) {
        Cell c = row.createCell(col);
        c.setCellValue(v == null ? 0 : v.doubleValue());
        c.setCellStyle(style);
    }

    private static String heure(LocalDateTime d) {
        return d == null ? "" : d.format(FMT_HEURE);
    }

    private static String heure(OffsetDateTime d) {
        return d == null ? "" : d.format(FMT_HEURE);
    }

    private static String jour(LocalDate d) {
        return d == null ? "" : d.format(FMT_JOUR);
    }

    private static String montantTexte(BigDecimal v) {
        return v == null ? "0" : String.format("%,d", v.longValue()).replace(',', ' ');
    }

    private static final class Styles {
        final CellStyle titre, entete, montant;

        Styles(Workbook wb) {
            titre = wb.createCellStyle();
            Font ft = wb.createFont();
            ft.setBold(true);
            ft.setFontHeightInPoints((short) 13);
            titre.setFont(ft);

            entete = wb.createCellStyle();
            Font fe = wb.createFont();
            fe.setBold(true);
            fe.setColor(IndexedColors.WHITE.getIndex());
            entete.setFont(fe);
            entete.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
            entete.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            entete.setBorderBottom(BorderStyle.THIN);

            montant = wb.createCellStyle();
            montant.setDataFormat(wb.createDataFormat().getFormat("#,##0"));
        }
    }
}
