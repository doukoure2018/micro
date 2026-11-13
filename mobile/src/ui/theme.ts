/**
 * La charte, en un seul endroit. Les valeurs viennent des maquettes du 12 novembre : lues
 * dehors, en plein soleil, sur un telephone d'entree de gamme.
 */
export const couleurs = {
  fond: '#F2F4F0',
  surface: '#FFFFFF',
  bord: '#D9DED6',
  texte: '#15201B',
  texteSecondaire: '#5B6B63',
  vert: '#1F6B45',
  vertFonce: '#15402C',
  vertClair: '#E3F0E8',
  ambre: '#8A5A00',
  ambreClair: '#F7ECD2',
  rouge: '#A52A1D',
  rougeClair: '#F8E4E1',
  bleu: '#2A4F9E',
  bleuClair: '#E2E8F6',
} as const;

/** Plancher de 14 points pour tout texte utile : la charte mobile du 12 novembre. */
export const texte = {
  titre: 22,
  sousTitre: 17,
  corps: 15,
  petit: 14,
  minuscule: 13,
} as const;

export const espaces = { xs: 4, s: 8, m: 12, l: 16, xl: 20, xxl: 28 } as const;

/** Toute cible tactile fait au moins 44 points de haut. */
export const CIBLE_MIN = 44;

export function couleurRetard(jours: number | null): string {
  if (jours === null || jours <= 0) return couleurs.texteSecondaire;
  if (jours <= 30) return couleurs.ambre;
  return couleurs.rouge;
}

export function montant(valeur: number | null | undefined): string {
  if (valeur === null || valeur === undefined) return '—';
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(valeur) + ' GNF';
}

export function dateCourte(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—'
    : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function heureCourte(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? ''
    : d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * La forme d'un texte pour la recherche : sans accent, sans majuscule. « conde » doit trouver
 * « CONDÉ », et « n'diaye » se saisit rarement comme il est ecrit.
 */
export function cleDeRecherche(valeur: string | null | undefined): string {
  if (!valeur) return '';
  const minuscules = valeur.toLowerCase();
  try {
    return minuscules.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } catch {
    return minuscules;
  }
}
