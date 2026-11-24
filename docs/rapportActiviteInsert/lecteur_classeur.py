# -*- coding: utf-8 -*-
"""Lecture uniforme d'un classeur .xls (xlrd) ou .xlsx (openpyxl) sous forme de matrice.

Les cellules en erreur (#DIV/0!, #REF!, #VALUE!) valent None : les classeurs en sont pleins
(formules etirees sur les mois a venir) et xlrd rendrait sinon le code d'erreur comme un nombre
(7 pour #DIV/0!, 15 pour #VALUE!, 23 pour #REF!), ce qui injecterait de faux « 7 » en base.
"""
import re
import unicodedata

import openpyxl
import xlrd


def norm(valeur):
    s = unicodedata.normalize('NFKD', str(valeur or '')).encode('ascii', 'ignore').decode()
    return re.sub(r'[^A-Z0-9]', '', s.upper())


def feuilles(chemin):
    """-> dict nom de feuille -> matrice ; nombres en float, libelles en str, reste a None."""
    out = {}
    if chemin.lower().endswith('.xlsx'):
        wb = openpyxl.load_workbook(chemin, data_only=True, read_only=True)
        try:
            for ws in wb.worksheets:
                out[ws.title] = [list(r) for r in ws.iter_rows(values_only=True)]
        finally:
            wb.close()
        return out
    wb = xlrd.open_workbook(chemin)
    for sh in wb.sheets():
        matrice = []
        for r in range(sh.nrows):
            ligne = []
            for c in range(sh.ncols):
                t, v = sh.cell_type(r, c), sh.cell_value(r, c)
                if t == xlrd.XL_CELL_NUMBER:
                    ligne.append(float(v))
                elif t == xlrd.XL_CELL_TEXT:
                    ligne.append(str(v))
                else:
                    ligne.append(None)       # vide, blanc, booleen, erreur
            matrice.append(ligne)
        out[sh.name] = matrice
    return out


def cellule(m, r, c):
    if r < 0 or r >= len(m):
        return None
    ligne = m[r]
    return ligne[c] if 0 <= c < len(ligne) else None


def libelle(m, r, c):
    v = cellule(m, r, c)
    return norm(v) if isinstance(v, str) else ''


def nombre(m, r, c):
    v = cellule(m, r, c)
    if isinstance(v, bool) or v is None:
        return None
    if isinstance(v, (int, float)):
        return float(v)
    return None
