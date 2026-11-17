/**
 * De quel ecran parle une notification.
 *
 * <p>Le serveur ne connait pas les chemins de l'application : il nomme un ecran
 * (« portefeuille », « synchronisation »), et la correspondance est tenue ici. Un nom inconnu
 * ne mene nulle part, sans erreur : une notification plus recente que la version installee
 * doit rester lisible, pas faire planter l'ouverture.</p>
 */
const ECRANS: Record<string, string> = {
  accueil: '/',
  portefeuille: '/portefeuille',
  // Les promesses a verifier se lisent dans le portefeuille : il n'y a pas d'ecran dedie.
  recouvrement: '/portefeuille',
  synchronisation: '/synchronisation',
  reclamations: '/reclamations',
  dossiers: '/dossiers',
  equipe: '/equipe',
  agri: '/agri',
  notifications: '/notifications',
};

export function cheminDeLEcran(ecran: string | null | undefined): string | null {
  if (!ecran) return null;
  return ECRANS[ecran] ?? null;
}
