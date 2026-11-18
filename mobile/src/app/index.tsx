import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, Redirect, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { profilGarde } from '@/auth/session';
import type { Profil } from '@/api/types';
import { compterReclamationsEnAttente, dossiersLocaux, portefeuilleLocal } from '@/db/visites';
import { compterAgriEnAttente } from '@/db/agri';
import { compterNonLues } from '@/db/notifications';
import { estOuverte } from '@/db/base';
import type { CreditPortefeuille } from '@/api/types';
import { etatDeLaFile, synchroniser } from '@/sync/moteur';
import { couleurRetard, couleurs, dateCourte, espaces, heureCourte, montant, texte } from '@/ui/theme';

/**
 * L'ecran d'ouverture : ce que l'agent doit faire aujourd'hui, et l'etat de sa file.
 *
 * <p>Tout vient de la copie locale : l'ecran s'affiche entierement hors connexion, et la date
 * de cette copie est ecrite en haut pour qu'aucun chiffre ne soit pris pour celui de l'instant.</p>
 */
export default function Aujourdhui() {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [credits, setCredits] = useState<CreditPortefeuille[]>([]);
  const [enAttente, setEnAttente] = useState(0);
  const [derniere, setDerniere] = useState<string | null>(null);
  const [rafraichit, setRafraichit] = useState(false);
  const [dossiersAFaire, setDossiersAFaire] = useState(0);
  const [agriEnAttente, setAgriEnAttente] = useState(0);
  const [reclamationsEnAttente, setReclamationsEnAttente] = useState(0);
  const [notificationsNonLues, setNotificationsNonLues] = useState(0);

  const charger = useCallback(async () => {
    setProfil(await profilGarde());
    if (!estOuverte()) return;
    setCredits(await portefeuilleLocal());
    // Les tuiles portent un chiffre quand il y a quelque chose a faire : c'est ce chiffre,
    // pas l'intitule, qui fait ouvrir l'ecran.
    setDossiersAFaire((await dossiersLocaux(false)).filter((d) => d.attendLAgent).length);
    setAgriEnAttente(await compterAgriEnAttente());
    setReclamationsEnAttente(await compterReclamationsEnAttente());
    setNotificationsNonLues(await compterNonLues());
    const { compte, derniere: d } = await etatDeLaFile();
    setEnAttente(compte.EN_ATTENTE + compte.ENVOI);
    setDerniere(d);
  }, []);

  useFocusEffect(useCallback(() => { void charger(); }, [charger]));

  const surRafraichir = useCallback(async () => {
    setRafraichit(true);
    await synchroniser({ force: true });
    await charger();
    setRafraichit(false);
  }, [charger]);

  /*
    « A jour » ne voulait pas dire ce qu'on y lisait. Le mot repondait a la FILE D'ENVOI —
    rien ne reste a transmettre — et l'agent le lisait comme « vos donnees sont fraiches ».
    Le 18/11, apres un changement de format qui refait la copie locale, l'ecran annoncait
    « a jour » au-dessus d'un portefeuille a zero credit. Un ecran rassurant sur une copie
    vide est pire que pas d'ecran du tout : il n'y a plus de raison d'aller voir.
  */
  const copieVide = credits.length === 0;
  const heuresDepuis = derniere
    ? (Date.now() - new Date(derniere).getTime()) / 3_600_000
    : null;
  const copieVieille = heuresDepuis !== null && heuresDepuis > 24;

  // Le portefeuille, c'est ce que SAF porte. Une affectation dont SAF n'a plus le credit est
  // comptee a part : sinon le telephone annonce 90 credits la ou le web en compte 89.
  const portefeuille = credits.filter((c) => !c.horsCreditsVivants);
  const clos = credits.filter((c) => c.horsCreditsVivants);
  const enRetard = portefeuille.filter((c) => (c.joursRetard ?? 0) > 0);
  const aEcheance = portefeuille.filter((c) => (c.joursRetard ?? 0) <= 0 && c.prochaineEcheance);
  const promesses = portefeuille.filter((c) => c.promesseDate);
  // Un encours inconnu n'est pas un encours nul : sans un seul montant lu, l'ecran le dit.
  const avecMontant = portefeuille.filter((c) => c.encours !== null && c.encours !== undefined);
  const encours = avecMontant.reduce((t, c) => t + (c.encours ?? 0), 0);

  // Un directeur d'agence ne porte pas de portefeuille : les credits sont affectes a SES
  // agents, pas a lui. Son ecran d'ouverture est son equipe.
  if (profil?.role === 'DA') {
    return <Redirect href="/equipe" />;
  }

  return (
    <ScrollView
      style={{ backgroundColor: couleurs.fond }}
      contentContainerStyle={s.page}
      refreshControl={<RefreshControl refreshing={rafraichit} onRefresh={surRafraichir} />}
    >
      <View style={s.entete}>
        <Text style={s.bonjour}>Bonjour</Text>
        <Text style={s.nom}>{profil?.nom ?? '—'}</Text>
        <Text style={s.lieu}>
          {profil?.pointVente ?? '—'}
          {profil?.codAgencia ? ` (${profil.codAgencia})` : ''}
        </Text>
      </View>

      <Link href="/synchronisation" asChild>
        <Pressable style={s.bandeau}>
          <Text style={s.bandeauTexte}>
            {copieVide
              ? 'Portefeuille a recevoir : lancez une synchronisation'
              : derniere
                ? `Donnees du ${dateCourte(derniere)} a ${heureCourte(derniere)}`
                : 'Jamais synchronise'}
          </Text>
          {enAttente > 0 ? (
            <Text style={s.badge}>{enAttente} en attente</Text>
          ) : copieVide || copieVieille ? (
            <Text style={s.badge}>a synchroniser</Text>
          ) : (
            <Text style={s.badgeCalme}>rien en attente</Text>
          )}
        </Pressable>
      </Link>

      <View style={s.compteurs}>
        <Compteur valeur={enRetard.length} libelle="credits en retard" couleur={couleurs.rouge} />
        <Compteur valeur={aEcheance.length} libelle="echeances a venir" couleur={couleurs.ambre} />
        <Compteur valeur={promesses.length} libelle="promesses a verifier" couleur={couleurs.bleu} />
      </View>

      <Link href="/portefeuille" asChild>
        <Pressable style={s.carte}>
          <Text style={s.carteLibelle}>Mon portefeuille</Text>
          <Text style={s.carteValeur}>
            {portefeuille.length} credits
            {portefeuille.length > 0 && avecMontant.length === 0
              ? ' · montants indisponibles'
              : ` · ${montant(encours)}`}
          </Text>
          {clos.length > 0 ? (
            <Text style={s.aFermer}>
              {clos.length === 1
                ? '1 credit rembourse ou clos vous est encore affecte'
                : `${clos.length} credits rembourses ou clos vous sont encore affectes`}
            </Text>
          ) : null}
          {profil?.note !== null && profil?.note !== undefined ? (
            <Text style={s.score}>Mon score du jour : {profil.note} / 100 · classe {profil.classe}</Text>
          ) : null}
        </Pressable>
      </Link>

      {/*
        Les actions tiennent sur une grille : trois tuiles par rangee, une icone, un mot, et un
        chiffre quand quelque chose attend. Trois cartes empilees prenaient la moitie de
        l'ecran et se lisaient comme du texte ; une grille se reconnait d'un coup d'oeil.
      */}
      <View style={s.grille}>
        <Tuile href="/portefeuille" icone="wallet-outline" libelle="Portefeuille"
               compte={enRetard.length} teinte={couleurs.vert} />
        <Tuile href="/dossiers" icone="folder-open-outline" libelle="Mes dossiers"
               compte={dossiersAFaire} teinte={couleurs.bleu} />
        <Tuile href="/agri" icone="leaf-outline" libelle="Collecte agricole"
               compte={agriEnAttente} teinte="#4F7F2A" />
        <Tuile href="/reclamations" icone="megaphone-outline" libelle="Signaler"
               compte={reclamationsEnAttente} teinte={couleurs.ambre} />
        <Tuile href="/synchronisation" icone="cloud-upload-outline" libelle="Synchronisation"
               compte={enAttente} teinte="#2A4F9E" />
        <Tuile href="/notifications" icone="notifications-outline" libelle="Notifications"
               compte={notificationsNonLues} teinte={couleurs.vertFonce} />
      </View>

      <Text style={s.titreSection}>A faire aujourd'hui</Text>
      {enRetard.length === 0 && promesses.length === 0 ? (
        <Text style={s.vide}>Aucun retard ni promesse a verifier dans votre portefeuille.</Text>
      ) : (
        [...enRetard, ...promesses.filter((p) => (p.joursRetard ?? 0) <= 0)]
          .slice(0, 12)
          .map((c) => (
            <Link key={`${c.codAgencia}/${c.numCredito}`}
                  href={{ pathname: '/credit/[cle]', params: { cle: `${c.codAgencia}-${c.numCredito}` } }}
                  asChild>
              <Pressable style={s.ligne}>
                <View style={{ flex: 1 }}>
                  <Text style={s.ligneNom} numberOfLines={1}>
                    {c.nomClient ?? (c.codCliente ? `Membre ${c.codCliente}` : 'Membre inconnu')}
                  </Text>
                  <Text style={s.ligneDetail}>
                    {c.joursRetard && c.joursRetard > 0
                      ? `Impaye depuis ${c.joursRetard} j · ${montant(c.montantImpaye)}`
                      : `Promesse du ${dateCourte(c.promesseDate)} · ${montant(c.promesseMontant)}`}
                  </Text>
                </View>
                <Text style={[s.pastille, { color: couleurRetard(c.joursRetard) }]}>
                  {c.joursRetard && c.joursRetard > 0 ? `${c.joursRetard} j` : 'promesse'}
                </Text>
              </Pressable>
            </Link>
          ))
      )}
    </ScrollView>
  );
}

/**
 * Une tuile d'action. Le chiffre n'apparait que s'il est strictement positif : zero n'est pas
 * une information, c'est du bruit a cote de l'icone.
 */
function Tuile({ href, icone, libelle, compte, teinte }: {
  href: '/portefeuille' | '/dossiers' | '/agri' | '/reclamations' | '/synchronisation'
    | '/notifications';
  icone: React.ComponentProps<typeof Ionicons>['name'];
  libelle: string;
  compte: number;
  teinte: string;
}) {
  return (
    <Link href={href} asChild>
      <Pressable style={s.tuile} accessibilityRole="button"
                 accessibilityLabel={compte > 0 ? `${libelle}, ${compte} en attente` : libelle}>
        <View style={[s.tuileIcone, { backgroundColor: `${teinte}1A` }]}>
          <Ionicons name={icone} size={24} color={teinte} />
          {compte > 0 ? (
            <View style={[s.tuileBadge, { backgroundColor: teinte }]}>
              <Text style={s.tuileBadgeTexte}>{compte > 99 ? '99+' : compte}</Text>
            </View>
          ) : null}
        </View>
        <Text style={s.tuileLibelle} numberOfLines={2}>{libelle}</Text>
      </Pressable>
    </Link>
  );
}

function Compteur({ valeur, libelle, couleur }: { valeur: number; libelle: string; couleur: string }) {
  return (
    <View style={s.compteur}>
      <Text style={[s.compteurValeur, { color: couleur }]}>{valeur}</Text>
      <Text style={s.compteurLibelle}>{libelle}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  page: { padding: espaces.l, gap: espaces.m, paddingBottom: espaces.xxl },
  entete: { gap: 2 },
  bonjour: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  nom: { fontSize: texte.titre, fontWeight: '600', color: couleurs.texte },
  lieu: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  bandeau: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: couleurs.vertClair, borderRadius: 12, padding: espaces.m, minHeight: 48,
  },
  bandeauTexte: { fontSize: texte.petit, color: couleurs.vert, flex: 1 },
  badge: {
    fontSize: texte.minuscule, fontWeight: '700', color: couleurs.ambre,
    backgroundColor: couleurs.ambreClair, paddingHorizontal: espaces.s,
    paddingVertical: 2, borderRadius: 8, overflow: 'hidden',
  },
  badgeCalme: { fontSize: texte.minuscule, color: couleurs.vert, fontWeight: '600' },
  compteurs: { flexDirection: 'row', gap: espaces.s },
  compteur: {
    flex: 1, backgroundColor: couleurs.surface, borderRadius: 14, padding: espaces.m,
    borderWidth: 1, borderColor: couleurs.bord, minHeight: 92, gap: espaces.xs,
  },
  compteurValeur: { fontSize: 28, fontWeight: '700' },
  compteurLibelle: { fontSize: texte.petit, color: '#3D4B44' },
  carte: {
    backgroundColor: couleurs.surface, borderRadius: 14, padding: espaces.l,
    borderWidth: 1, borderColor: couleurs.bord, gap: 2, minHeight: 48,
  },
  carteLibelle: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  carteValeur: { fontSize: texte.sousTitre + 1, fontWeight: '600', color: couleurs.texte },
  score: { fontSize: texte.petit, color: couleurs.vert, fontWeight: '600', marginTop: espaces.xs },
  aFermer: { fontSize: texte.minuscule, color: couleurs.ambre, fontWeight: '600', marginTop: espaces.xs },
  grille: { flexDirection: 'row', flexWrap: 'wrap', gap: espaces.s },
  tuile: {
    // Trois par rangee a 390 points, avec les deux interstices de 8 : (358 - 16) / 3.
    width: '31.5%', flexGrow: 1, minHeight: 104,
    backgroundColor: couleurs.surface, borderRadius: 14, padding: espaces.m,
    borderWidth: 1, borderColor: couleurs.bord, alignItems: 'center', gap: espaces.s,
  },
  tuileIcone: {
    width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
  },
  tuileBadge: {
    position: 'absolute', top: -4, right: -6, minWidth: 20, height: 20, borderRadius: 10,
    paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: couleurs.surface,
  },
  tuileBadgeTexte: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  tuileLibelle: { fontSize: texte.petit, fontWeight: '600', color: couleurs.texte, textAlign: 'center' },
  titreSection: { fontSize: texte.sousTitre, fontWeight: '600', color: couleurs.texte, marginTop: espaces.s },
  vide: { fontSize: texte.corps, color: couleurs.texteSecondaire },
  ligne: {
    flexDirection: 'row', alignItems: 'center', gap: espaces.m,
    backgroundColor: couleurs.surface, borderRadius: 12, padding: espaces.m,
    borderWidth: 1, borderColor: couleurs.bord, minHeight: 56,
  },
  ligneNom: { fontSize: texte.corps, fontWeight: '600', color: couleurs.texte },
  ligneDetail: { fontSize: texte.petit, color: couleurs.texteSecondaire, marginTop: 1 },
  pastille: { fontSize: texte.minuscule, fontWeight: '700' },
});
