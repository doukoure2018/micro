#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reprise des « Rapports d'activite du point de service » 2026 (module B, V168) a partir des
classeurs des cinq delegations regionales deposes dans docs/rapport/rapport annuel.

    pip install xlrd openpyxl
    python3 generer_import_rapport_activite.py --sql > ../import_rapport_activite_2026.sql
    python3 generer_import_rapport_activite.py --audit        # inventaire, sans SQL

Un classeur par agence, une feuille par point de service, le gabarit « IND MENSUELS ET
TRIMESTRIELS » (identique au RAPPORT FORECARIAH qui a servi a ecrire le referentiel V168).
Ou se trouve chaque rubrique : gabarit_activite.py.

Regles de reprise
-----------------
  - seules les rubriques de nature SAISIE sont reprises ; les 51 rubriques CALCUL (totaux,
    moyennes, taux, pourcentages d'impayes) sont recalculees par digi, et beaucoup sont
    fausses dans les classeurs (formule etiree sur les mois a venir, #DIV/0!, #REF!) ;
  - les lignes d'agregat (TOTAL, ENCOURS MOYEN, RETARD MOYEN, MOYENNE) sont ignorees ;
  - une cellule vide reste vide (NULL = pas encore saisi) ; un zero tape est repris ;
  - periodicite du referentiel : mensuel sur les douze mois, trimestriel sur mars, juin,
    septembre et decembre, ouverture (soldes au 31/12/2025) sur le rapport de janvier ;
  - les feuilles de consolidation (Total, SYNTHESE SIEGE, classeurs ZT* des delegations) ne
    sont pas reprises : digi recalcule les agregats d'agence et de delegation ;
  - les mois d'octobre a decembre ne sont pas reprises : les classeurs s'arretent au
    30 septembre et ces mois doivent rester ouverts a la saisie des agences ;
  - etat CONSOLIDE : des mois clos, valides par la DR et consolides par la DE hors digi.
"""
import argparse
import datetime
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import gabarit_activite as G
from lecteur_classeur import feuilles, libelle, nombre, norm

ANNEE = 2026
DERNIER_MOIS = 9
MOIS = ['JANVIER', 'FEVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN', 'JUILLET', 'AOUT',
        'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DECEMBRE']

RACINE = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                       '..', 'rapport', 'rapport annuel'))
POINTVENTE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pointvente.txt')

# Feuilles de consolidation, jamais reprises.
FEUILLES_IGNOREES = {norm(x) for x in ('SYNTHESE SIEGE', 'Total', 'Parametres')}

# Dossier d'agence -> libelle de l'agence dans le referentiel digi, quand les deux diffe-rent.
AGENCES = {'TELIMILE': 'TELIMELE', 'KOBAYAH': 'COBAYA'}

# Dossiers du depot qui ne sont pas une agence : la copie du rapport au 30/06, deja perime.
DOSSIERS_IGNORES = {'RAPPORTS ANNUELS AU 30 06 2026'}

# Les deux colonnes « TAUX REMBOURSEMENT ECHEANCE » (A-1 et l'annee) sont tapees tantot en
# fraction (0,97), tantot en pourcentage entier (97) selon l'agence, alors que digi stocke les
# taux en fraction (V167 : « 0,97 pour 97 % »). Au-dela de 1,5 la valeur est donc lue comme un
# pourcentage et ramenee a une fraction ; les valeurs qui restent aberrantes sont signalees.
POURCENTAGES = {'SOC_TAUX_REMB_A1', 'SOC_TAUX_REMB'}
SEUIL_POURCENTAGE = 1.5

# Feuille -> code du point de service, quand le nom tape par l'agence ne se recoupe pas avec
# le libelle du referentiel. Clef : (agence digi, nom de la feuille), tous deux normalises.
# Ce sont des variantes d'orthographe d'un meme lieu, verifiees une a une sur le referentiel
# de l'agence concernee (aucun des couples ci-dessous ne laisse d'autre candidat possible).
EXCEPTIONS = {
    ('BOFFA', 'KOLIALANBAMYI'): '613',          # Kolia
    ('FORECARIAH', 'FORECARIAH'): '103',        # Foracariah
    ('FORECARIAH', 'FARMORIAH'): '127',         # Farmoriaya
    ('KINDIA', 'FRIGUIAGBE'): '124',            # Friguiabe
    ('SANGAREDI', 'WEDOUMBOURE'): '609',        # Wendoubour
    ('LOLA', 'GAMA'): '413',                    # Gamaberema
    ('MACENTA', 'BOFFOSSOU'): '813',            # Boffosou
    ('MACENTA', 'BINIKALA'): '815',             # Gbeunikala
    ('NZEREKORE', 'NZEREKOREI'): '419',         # N'Zerekore 1
    ('NZEREKORE', 'NZEREKOREII'): '420',        # N'Zerekore 2
    ('SINKO', 'FOUALAH'): '709',                # Fouala
    ('DABOLA', 'ARFAMOUSSAYA'): '559',          # Arfamoussayah
    ('DABOLA', 'BISSIKIRIMA'): '554',           # Bissikrima
    ('FARANAH', 'PASSAYA'): '524',              # Passayah
    ('FARANAH', 'HERMAKONON'): '536',           # Hermakono
    ('FARANAH', 'SONGOYA'): '537',              # Songoyah
    ('KANKAN', 'NAFADJI'): '336',               # Nafagui
    ('KANKAN', 'MORIBAYA'): '331',              # Moribayah
    ('KINIERAN', 'DIALAKORO'): '330',           # Dalakoro (Dialakoro de DINGUIRAYE = 555)
    ('KINIERAN', 'KOUNDJAN'): '342',            # Koundian
    ('KISSIDOUGOU', 'YENDEMILLIMOU'): '526',    # Yende Milimou
    ('KISSIDOUGOU', 'ALBADARA'): '531',         # Albadaria
    ('KISSIDOUGOU', 'FEMESSADOU'): '534',       # Fremessadou
    ('MALEAH', 'KINTINIAN'): '357',             # Kintinia
    ('MANDIANA', 'BARANAMA'): '335',            # Sabadoubranama
    ('SIGUIRI', 'NORASSOBA'): '352',            # Norasoba
    ('SIGUIRI', 'NOUNKOUNKAN'): '359',          # Noukounkan
    ('SIGUIRI', 'NIANDAN'): '360',              # Niandankoro
    ('COBAYA', 'LAMBANYICOBAYAH'): '962',       # kobayah (le registre geographique place le
                                                # marche de Kobaya a Lambanyi ; meme deduction
                                                # que la reprise des indicateurs mensuels)
    ('LABE', 'THIAGUELBORI'): '908',            # Thianguel Bory
    ('LABE', 'SANNOU'): '921',                  # Sanou
    ('MAMOU', 'SARAMOUSSAYA'): '163',           # Saramoussayah
    ('PITA', 'TIMBITOUNNI'): '917',             # Timbi Touni
    ('PITA', 'DOGHOLTOUMA'): '918',             # Donghol Touma
}


def referentiel():
    """pointvente.txt : « delegation|agence|code|libelle » exporte de la production."""
    par_agence = {}
    libelles = {}
    for ligne in open(POINTVENTE, encoding='utf-8'):
        ligne = ligne.rstrip('\n')
        if not ligne.strip():
            continue
        deleg, agence, code, lib = ligne.split('|')
        par_agence.setdefault(norm(agence), []).append((code, lib))
        libelles[code] = (deleg, agence, lib)
    return par_agence, libelles


def conforme(matrice):
    """-> liste des ancres du gabarit qui ne sont pas au rendez-vous.

    Les en-tetes sont tolerants (plusieurs agences en ont retape un : « TRANSFERT A L'AGENCE »
    au lieu de « A LA DR », libelle de mois ecrase par une frappe). Ce qui doit tenir, c'est le
    quadrillage : chaque bloc mensuel commence a JANVIER et garde au moins dix mois sur douze
    a leur place, sinon le bloc est decale et la feuille n'est pas reprise.
    """
    ecarts = []
    for r, c, attendus in G.ANCRES:
        if not any(libelle(matrice, r, c).startswith(a) for a in attendus):
            ecarts.append(f"L{r + 1}C{c + 1}")
    for base, colonne in ((5, 1), (53, 0), (71, 1), (87, 1), (105, 0), (123, 1),
                          (169, 1), (186, 1), (204, 1), (220, 0)):
        places = [libelle(matrice, base + i, colonne).startswith(m[:4]) for i, m in enumerate(MOIS)]
        if not places[0] or sum(places) < 10:
            ecarts.append(f"bloc mensuel L{base + 1} decale ({sum(places)}/12 mois en place)")
    return ecarts


def valeurs_feuille(matrice, dernier_mois=DERNIER_MOIS):
    """-> dict mois -> {code: valeur}, pour les seules rubriques SAISIE du module ACTIVITE."""
    out = {m: {} for m in range(1, 13)}

    def pose(mois, code, valeur):
        if valeur is not None:
            out[mois][code] = valeur

    for base, colonnes in G.MOIS_LIGNES:
        for mois in range(1, 13):
            for colonne, code in colonnes.items():
                pose(mois, code, nombre(matrice, base + mois - 1, colonne))

    for ligne, code in G.MOIS_COLONNES:
        for mois in range(1, 13):
            pose(mois, code, nombre(matrice, ligne, G.MOIS_COLONNES_COL_JANVIER + mois - 1))

    for ligne, colonnes in G.OUVERTURE:
        for colonne, code in colonnes.items():
            pose(1, code, nombre(matrice, ligne, colonne))

    for mois, (ligne0, colonne0) in G.IMPAYES_BLOCS.items():
        for i, tranche in enumerate(G.IMPAYES_TRANCHES):
            for decalage, suffixe in G.IMPAYES_COLONNES.items():
                pose(mois, tranche + suffixe, nombre(matrice, ligne0 + i, colonne0 + decalage))

    for base, colonnes in G.TRIMESTRE_LIGNES:
        for trimestre in range(1, 5):
            for colonne, code in colonnes.items():
                pose(trimestre * 3, code, nombre(matrice, base + trimestre - 1, colonne))

    return {m: v for m, v in out.items() if v and m <= dernier_mois}, \
           {m: v for m, v in out.items() if v and m > dernier_mois}


def inventaire():
    """Parcourt le depot. -> lot (valeurs, journal, points de service repris, …)."""
    par_agence, libelles = referentiel()
    valeurs = []          # (code_ps, mois, code_rubrique, valeur)
    journal = []
    attribues = {}        # code_ps -> (delegation, agence, feuille)
    hors_periode = []
    sans_feuille = []
    orphelines = []       # feuilles portant des donnees sans nom de point de service
    ramenes = 0           # taux lus en pourcentage et ramenes en fraction
    aberrants = []        # taux encore hors de [0 ; 1,5] apres conversion

    for deleg in sorted(os.listdir(RACINE)):
        dossier_deleg = os.path.join(RACINE, deleg)
        if not os.path.isdir(dossier_deleg):
            continue
        if deleg in DOSSIERS_IGNORES:
            journal.append(f"dossier ignore (copie perimee du rapport au 30/06/2026) : {deleg}")
            continue
        for agence in sorted(os.listdir(dossier_deleg)):
            dossier = os.path.join(dossier_deleg, agence)
            if not os.path.isdir(dossier):
                continue
            if agence in DOSSIERS_IGNORES:
                journal.append(f"dossier ignore (copie perimee du rapport au 30/06/2026) : "
                               f"{deleg}/{agence}")
                continue
            if agence.upper().startswith(('ZT', 'ZD')):
                journal.append(f"consolidation de delegation ignoree : {deleg}/{agence}")
                continue
            cle = norm(AGENCES.get(agence.upper(), agence))
            if cle not in par_agence:
                journal.append(f"!! agence absente du referentiel digi : {deleg}/{agence}")
                continue
            restants = {code: lib for code, lib in par_agence[cle]}
            par_libelle = {norm(lib): code for code, lib in par_agence[cle]}
            gabarits = 0
            for fichier in sorted(os.listdir(dossier)):
                if not fichier.lower().endswith(('.xls', '.xlsx')) or fichier.startswith('~$'):
                    continue
                chemin = os.path.join(dossier, fichier)
                try:
                    classeur = feuilles(chemin)
                except Exception as erreur:                       # noqa: BLE001
                    journal.append(f"!! classeur illisible : {deleg}/{agence}/{fichier} ({erreur})")
                    continue
                for nom, matrice in classeur.items():
                    if norm(nom) in FEUILLES_IGNOREES:
                        continue
                    retenues, tardives = valeurs_feuille(matrice)
                    if not any(v for lignes in retenues.values() for v in lignes.values()) \
                            and not any(v for lignes in tardives.values() for v in lignes.values()):
                        gabarits += 1        # feuille du gabarit restee vide (ou tout a zero)
                        continue
                    ecarts = conforme(matrice)
                    if ecarts:
                        journal.append(f"!! feuille hors gabarit, non reprise : "
                                       f"{deleg}/{agence}/{nom} ({', '.join(ecarts[:6])})")
                        continue
                    code = EXCEPTIONS.get((cle, norm(nom))) or par_libelle.get(norm(nom))
                    if code is None:
                        orphelines.append((f"{deleg}/{agence}", nom,
                                           sum(len(v) for v in retenues.values())))
                        continue
                    if code in attribues:
                        d0, a0, f0 = attribues[code]
                        journal.append(f"!! code {code} deja pris par {d0}/{a0}/{f0} : "
                                       f"{deleg}/{agence}/{nom} non reprise")
                        continue
                    restants.pop(code, None)
                    attribues[code] = (deleg, agence, nom)
                    for mois, lignes in sorted(retenues.items()):
                        for rubrique, valeur in sorted(lignes.items()):
                            if rubrique in POURCENTAGES and valeur > SEUIL_POURCENTAGE:
                                valeur /= 100
                                ramenes += 1
                                if valeur > SEUIL_POURCENTAGE:
                                    aberrants.append((code, nom, mois, rubrique, valeur))
                            valeurs.append((code, mois, rubrique, valeur))
                    reelles = {m: {c: v for c, v in lignes.items() if v}
                               for m, lignes in tardives.items()}
                    reelles = {m: lignes for m, lignes in reelles.items() if lignes}
                    if reelles:
                        hors_periode.append((code, nom, sorted(reelles),
                                             sum(len(v) for v in reelles.values())))
            if gabarits:
                journal.append(f"{gabarits} feuille(s) du gabarit restee(s) vide(s) : "
                               f"{deleg}/{agence}")
            for code, lib in sorted(restants.items()):
                partage = code in attribues
                sans_feuille.append((code, lib, f"{deleg}/{agence}",
                                     attribues[code][2] if partage else None))

    journal.append(f"taux de remboursement lus en pourcentage et ramenes en fraction : {ramenes}")
    for code, nom, mois, rubrique, valeur in aberrants:
        journal.append(f"!! taux aberrant conserve tel quel : {code} {nom}, {MOIS[mois - 1]}, "
                       f"{rubrique} = {valeur:.2f} ({valeur * 100:.0f} %)")
    return valeurs, journal, attribues, hors_periode, sans_feuille, orphelines, libelles


def nb(valeur):
    """Nombre SQL sans notation scientifique, borne a 4 decimales comme la colonne NUMERIC."""
    texte = f"{valeur:.4f}".rstrip('0').rstrip('.')
    return texte if texte not in ('', '-0') else '0'


def manques(sans_feuille):
    """Separe les points de service sans donnees de ceux dont le code est deja pris par un autre."""
    absents = [(c, lib, ou) for c, lib, ou, partage in sans_feuille if partage is None]
    partages = [(c, lib, ou, partage) for c, lib, ou, partage in sans_feuille if partage]
    return absents, partages


def ecrire_audit(sortie, lot):
    valeurs, journal, attribues, hors_periode, sans_feuille, orphelines, libelles = lot
    p = lambda *a: print(*a, file=sortie)
    absents, partages = manques(sans_feuille)
    mois_couverts = sorted({m for _, m, _, _ in valeurs})
    p(f"Points de service reprises : {len(attribues)} / {len(libelles)} codes du referentiel")
    p(f"Valeurs saisies            : {len(valeurs)}")
    p(f"Rapports (PS x mois)       : {len({(c, m) for c, m, _, _ in valeurs})}")
    p(f"Mois couverts              : {mois_couverts}")
    p(f"Rubriques distinctes       : {len({r for _, _, r, _ in valeurs})}")
    p("")
    p("-- Valeurs par mois")
    for mois in mois_couverts:
        lignes = [v for v in valeurs if v[1] == mois]
        p(f"   {MOIS[mois - 1]:<10} {len({v[0] for v in lignes}):>4} PS  {len(lignes):>7} valeurs")
    p("")
    p(f"-- Feuilles remplies qu'aucun nom ne rattache a un point de service : {len(orphelines)}")
    p("   (a faire nommer par la delegation : leurs valeurs ne sont pas reprises)")
    for ou, nom, combien in orphelines:
        p(f"   {ou} feuille {nom!r} : {combien} valeurs")
    p("")
    p(f"-- Points de service sans rapport dans les classeurs : {len(absents)}")
    for code, lib, ou in absents:
        p(f"   {code} {lib} ({ou})")
    p("")
    p(f"-- Points de service qui partagent leur code SAF avec un autre : {len(partages)}")
    for code, lib, ou, pris in partages:
        p(f"   {code} {lib} ({ou}) — code deja porte par la feuille {pris!r}")
    p("")
    total_tardif = sum(c for *_, c in hors_periode)
    p(f"-- Restes de formules apres septembre, non repris : {total_tardif} valeurs sur "
      f"{len(hors_periode)} feuille(s)")
    p("   (cellules de formule du 4e trimestre : cout moyen du credit, ratios de trimestre)")
    p("")
    p("-- Decisions et anomalies")
    for ligne in journal:
        p(f"   {ligne}")


def ecrire_sql(sortie, lot):
    valeurs, journal, attribues, hors_periode, sans_feuille, orphelines, libelles = lot
    absents, partages = manques(sans_feuille)
    jour = datetime.date.today()
    suffixe = jour.strftime('%Y%m%d')
    COMMENTAIRE = ("Reprise des classeurs des delegations (rapport d''activite au 30/09/2026), "
                   f"import DSIG du {jour.strftime('%d/%m/%Y')}")
    p = lambda *a: print(*a, file=sortie)
    rapports = sorted({(c, m) for c, m, _, _ in valeurs})

    p('-- =====================================================================================')
    p(f"-- Reprise des « Rapports d'activite du point de service » 2026 (module B) — DSIG, {jour}")
    p('-- Genere par docs/rapportActiviteInsert/generer_import_rapport_activite.py ;')
    p('-- ne pas editer a la main.')
    p('--')
    p("-- Source  : docs/rapport/rapport annuel (classeurs « IND MENSUELS ET TRIMESTRIELS » des")
    p(f"--           cinq delegations regionales au 30 septembre 2026, {len(attribues)} points de service)")
    p(f'-- Contenu : {len(rapports)} rapports, {len(valeurs)} valeurs saisies, janvier a septembre 2026')
    p('-- Etat    : CONSOLIDE (mois clos, valides par la DR et consolides par la DE hors digi)')
    p('--')
    p('-- Les rubriques calculees (totaux, moyennes, taux, parts) ne sont pas reprises : digi les')
    p('-- recalcule a l\'affichage, et beaucoup sont fausses dans les classeurs (formules etirees')
    p('-- sur les mois a venir, #DIV/0!, #REF!).')
    p('--')
    p('-- Rien n\'est ecrase : une rubrique qu\'une agence a deja renseignee dans digi est retiree')
    p('-- de la reprise (etape 3), rubrique par rubrique, et le reste du mois est quand meme repris.')
    p('-- Les rapports deja ouverts a l\'ecran mais vides sont remplis et consolides ; ceux qui')
    p('-- portent une saisie restent des brouillons, a finir par l\'agence et a consolider par la DE.')
    p('-- Les sauvegardes zz_sauv_*_%s permettent le retour arriere.' % suffixe)
    p('--')
    p('-- A executer sur la base de production, dans une seule transaction :')
    p("--   docker exec -i postgrecontainer sh -c 'psql -U $POSTGRES_USER -d $POSTGRES_DB "
      "-v ON_ERROR_STOP=1' < import_rapport_activite_2026.sql")
    p('-- =====================================================================================')
    p('')
    p('BEGIN;')
    p('')
    p('-- 1. Sauvegarde du module ACTIVITE avant reprise (a supprimer apres recette).')
    for table in ('rapport_mensuel', 'rapport_mensuel_valeur', 'rapport_mensuel_historique'):
        p(f'DROP TABLE IF EXISTS zz_sauv_activite_{table[8:]}_{suffixe};')
    p(f'CREATE TABLE zz_sauv_activite_mensuel_{suffixe} AS')
    p("  SELECT * FROM rapport_mensuel WHERE module = 'ACTIVITE';")
    p(f'CREATE TABLE zz_sauv_activite_mensuel_valeur_{suffixe} AS')
    p('  SELECT v.* FROM rapport_mensuel_valeur v JOIN rapport_mensuel r ON r.id = v.rapport_id')
    p("   WHERE r.module = 'ACTIVITE';")
    p(f'CREATE TABLE zz_sauv_activite_mensuel_historique_{suffixe} AS')
    p('  SELECT h.* FROM rapport_mensuel_historique h JOIN rapport_mensuel r ON r.id = h.rapport_id')
    p("   WHERE r.module = 'ACTIVITE';")
    p('')
    p('-- 2. Chargement des classeurs dans une table de travail.')
    p('CREATE TEMP TABLE import_activite (')
    p('    cod_agencia VARCHAR(5)    NOT NULL,')
    p('    annee       INTEGER       NOT NULL,')
    p('    mois        INTEGER       NOT NULL,')
    p('    code        VARCHAR(40)   NOT NULL,')
    p('    valeur      NUMERIC(20,4) NOT NULL')
    p(') ON COMMIT DROP;')
    p('')
    p('COPY import_activite (cod_agencia, annee, mois, code, valeur) FROM STDIN;')
    for code_ps, mois, rubrique, valeur in sorted(valeurs):
        p(f'{code_ps}\t{ANNEE}\t{mois}\t{rubrique}\t{nb(valeur)}')
    p('\\.')
    p('')
    p('-- Garde-fous : une rubrique inconnue, calculee, hors periodicite, ou un point de service')
    p('-- absent de digi arrete le script avant toute ecriture.')
    p('DO $$')
    p('DECLARE n INTEGER;')
    p('BEGIN')
    p('    SELECT count(*) INTO n FROM import_activite i')
    p('     WHERE NOT EXISTS (SELECT 1 FROM rapport_rubrique r')
    p("                        WHERE r.module = 'ACTIVITE' AND r.code = i.code")
    p("                          AND r.nature = 'SAISIE' AND r.actif);")
    p("    IF n > 0 THEN RAISE EXCEPTION 'Rubriques inconnues ou calculees : %', n; END IF;")
    p('')
    p('    SELECT count(*) INTO n FROM import_activite i')
    p("     JOIN rapport_rubrique r ON r.module = 'ACTIVITE' AND r.code = i.code")
    p("     WHERE (r.periodicite = 'TRIMESTRIEL' AND i.mois % 3 <> 0)")
    p("        OR (r.periodicite = 'OUVERTURE'   AND i.mois <> 1);")
    p("    IF n > 0 THEN RAISE EXCEPTION 'Valeurs hors periodicite de la rubrique : %', n; END IF;")
    p('')
    p('    SELECT count(DISTINCT i.cod_agencia) INTO n FROM import_activite i')
    p('     WHERE NOT EXISTS (SELECT 1 FROM pointvente p WHERE p.code = i.cod_agencia);')
    p("    IF n > 0 THEN RAISE EXCEPTION 'Points de service absents de digi : %', n; END IF;")
    p('END $$;')
    p('')
    p('-- 3. Ce que les agences ont deja tape dans digi est intouchable.')
    p('--')
    p("--    Attention : ouvrir un mois a l'ecran cree un rapport BROUILLON et une ligne par")
    p('--    rubrique avec valeur NULL. Le nombre de lignes ne mesure donc PAS la saisie ; seules')
    p('--    les lignes dont la valeur est renseignee comptent. Au 24/11/2026 la production porte')
    p('--    175 rapports ACTIVITE (septembre et octobre) pour 484 valeurs reellement renseignees,')
    p('--    dont 5 seulement sur janvier-septembre (Kaloum, septembre).')
    p('--')
    p('--    Regle : on ne remplit que ce qui est vide. Une rubrique deja renseignee par une')
    p('--    agence est retiree de la reprise, rubrique par rubrique et non rapport par rapport,')
    p("--    pour que le reste du mois soit quand meme repris. L'etat du rapport ne change pas")
    p('--    pour ces rapports-la : ils restent des brouillons que leur agence finit et que la DE')
    p("--    consolide depuis l'ecran.")
    p('SELECT r.cod_agencia, r.mois, v.code, v.valeur AS valeur_dans_digi,')
    p('       i.valeur AS valeur_du_classeur')
    p('  FROM rapport_mensuel r')
    p('  JOIN rapport_mensuel_valeur v ON v.rapport_id = r.id AND v.valeur IS NOT NULL')
    p('  JOIN import_activite i ON i.cod_agencia = r.cod_agencia AND i.annee = r.annee')
    p('                        AND i.mois = r.mois AND i.code = v.code')
    p(" WHERE r.module = 'ACTIVITE'")
    p(' ORDER BY 1, 2, 3;')
    p('')
    p('DELETE FROM import_activite i')
    p(' WHERE EXISTS (SELECT 1 FROM rapport_mensuel r')
    p('                 JOIN rapport_mensuel_valeur v ON v.rapport_id = r.id')
    p("                WHERE r.module = 'ACTIVITE' AND r.cod_agencia = i.cod_agencia")
    p('                  AND r.annee = i.annee AND r.mois = i.mois')
    p('                  AND v.code = i.code AND v.valeur IS NOT NULL);')
    p('')
    p('-- 4. Un rapport par point de service et par mois, pour ceux qui n\'existent pas encore.')
    p('INSERT INTO rapport_mensuel (module, cod_agencia, annee, mois, etat,')
    p('                             date_creation, date_saisie, date_soumission, date_validation,')
    p('                             date_consolidation, commentaire)')
    p("SELECT DISTINCT 'ACTIVITE', i.cod_agencia, i.annee, i.mois, 'CONSOLIDE',")
    p('       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,')
    p('       CURRENT_TIMESTAMP,')
    p(f"       '{COMMENTAIRE}'")
    p('  FROM import_activite i')
    p('  WHERE NOT EXISTS (SELECT 1 FROM rapport_mensuel r')
    p("                     WHERE r.module = 'ACTIVITE' AND r.cod_agencia = i.cod_agencia")
    p('                       AND r.annee = i.annee AND r.mois = i.mois);')
    p('')
    p('-- 4 bis. Les rapports deja ouverts a l\'ecran mais ou rien n\'a ete tape sont repris et')
    p('--        consolides comme les autres ; ceux qui portent une saisie restent des brouillons.')
    p('UPDATE rapport_mensuel r')
    p("   SET etat = 'CONSOLIDE',")
    p('       date_saisie = CURRENT_TIMESTAMP, date_soumission = CURRENT_TIMESTAMP,')
    p('       date_validation = CURRENT_TIMESTAMP, date_consolidation = CURRENT_TIMESTAMP,')
    p(f"       commentaire = '{COMMENTAIRE}'")
    p(" WHERE r.module = 'ACTIVITE' AND r.etat = 'BROUILLON'")
    p('   AND EXISTS (SELECT 1 FROM import_activite i')
    p('                WHERE i.cod_agencia = r.cod_agencia AND i.annee = r.annee')
    p('                  AND i.mois = r.mois)')
    p('   AND NOT EXISTS (SELECT 1 FROM rapport_mensuel_valeur v')
    p('                    WHERE v.rapport_id = r.id AND v.valeur IS NOT NULL);')
    p('')
    p('-- 5. Les valeurs saisies ; totaux, moyennes et taux restent calcules par digi.')
    p("--    ON CONFLICT : les lignes creees vides par l'ecran sont remplies, et la clause")
    p('--    « WHERE valeur IS NULL » garantit qu\'aucune valeur tapee par une agence ne peut')
    p('--    etre ecrasee, meme si le DELETE de l\'etape 3 en avait laisse passer une.')
    p('INSERT INTO rapport_mensuel_valeur (rapport_id, code, valeur)')
    p('SELECT r.id, i.code, i.valeur')
    p('  FROM import_activite i')
    p("  JOIN rapport_mensuel r ON r.module = 'ACTIVITE' AND r.cod_agencia = i.cod_agencia")
    p('                        AND r.annee = i.annee AND r.mois = i.mois')
    p('    ON CONFLICT (rapport_id, code) DO UPDATE SET valeur = excluded.valeur')
    p('       WHERE rapport_mensuel_valeur.valeur IS NULL;')
    p('')
    p("-- 6. Journal : d'ou vient chaque rapport.")
    p('INSERT INTO rapport_mensuel_historique (rapport_id, ancien_etat, nouvel_etat, motif)')
    p("SELECT DISTINCT r.id, NULL, r.etat,")
    p("       'Reprise du classeur de la delegation (rapport d''activite 2026) par la DSIG'")
    p('  FROM rapport_mensuel r')
    p('  JOIN import_activite i ON i.cod_agencia = r.cod_agencia AND i.annee = r.annee')
    p('                        AND i.mois = r.mois')
    p(" WHERE r.module = 'ACTIVITE';")
    p('')
    p('-- 7. Controle avant validation de la transaction : les valeurs comptees sont celles qui')
    p('--    sont renseignees, pas les lignes vides que l\'ecran cree a l\'ouverture d\'un mois.')
    p('SELECT r.mois, r.etat, count(*) AS rapports,')
    p('       coalesce(sum(x.nb), 0) AS valeurs_renseignees')
    p('  FROM rapport_mensuel r')
    p('  LEFT JOIN (SELECT rapport_id, count(*) AS nb FROM rapport_mensuel_valeur')
    p('              WHERE valeur IS NOT NULL GROUP BY rapport_id) x')
    p('    ON x.rapport_id = r.id')
    p(" WHERE r.module = 'ACTIVITE' AND r.annee = %d" % ANNEE)
    p(' GROUP BY r.mois, r.etat ORDER BY r.mois, r.etat;')
    p('')
    p('COMMIT;')
    p('')
    p('-- Retour arriere eventuel (rend aussi leur etat et leurs lignes vides aux 175 rapports')
    p('-- que les agences avaient deja ouverts) :')
    p('--   BEGIN;')
    p("--   DELETE FROM rapport_mensuel WHERE module = 'ACTIVITE';")
    p(f'--   INSERT INTO rapport_mensuel SELECT * FROM zz_sauv_activite_mensuel_{suffixe};')
    p(f'--   INSERT INTO rapport_mensuel_valeur SELECT * FROM zz_sauv_activite_mensuel_valeur_{suffixe};')
    p('--   INSERT INTO rapport_mensuel_historique')
    p(f'--     SELECT * FROM zz_sauv_activite_mensuel_historique_{suffixe};')
    p('--   COMMIT;')
    p('')
    p('-- -------------------------------------------------------------------------------------')
    p('-- Journal de la generation')
    p(f"--   feuilles remplies qu'aucun nom ne rattache a un point de service, a faire nommer")
    p(f'--   par la delegation (valeurs non reprises) : {len(orphelines)}')
    for ou, nom, combien in orphelines:
        p(f'--     {ou} feuille {nom!r} : {combien} valeurs')
    p(f'--   points de service sans rapport dans les classeurs : {len(absents)}')
    for code, lib, ou in absents:
        p(f'--     {code} {lib} ({ou})')
    p(f'--   points de service partageant leur code SAF avec un autre : {len(partages)}')
    for code, lib, ou, pris in partages:
        p(f'--     {code} {lib} ({ou}) — code deja porte par la feuille {pris!r}')
    p(f'--   restes de formules apres septembre, non repris : '
      f'{sum(c for *_, c in hors_periode)} valeurs sur {len(hors_periode)} feuille(s)')
    for ligne in journal:
        p(f'--   {ligne}')


def main():
    analyseur = argparse.ArgumentParser(description=__doc__)
    analyseur.add_argument('--audit', action='store_true', help="inventaire lisible, sans SQL")
    analyseur.add_argument('--sql', action='store_true', help="script SQL de reprise")
    args = analyseur.parse_args()
    if not args.audit and not args.sql:
        analyseur.error('choisir --audit ou --sql')
    lot = inventaire()
    (ecrire_audit if args.audit else ecrire_sql)(sys.stdout, lot)


if __name__ == '__main__':
    main()
