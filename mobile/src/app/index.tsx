import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { profilGarde } from '@/auth/session';
import type { Profil } from '@/api/types';
import { portefeuilleLocal } from '@/db/visites';
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

  const charger = useCallback(async () => {
    setProfil(await profilGarde());
    if (!estOuverte()) return;
    setCredits(await portefeuilleLocal());
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

  const enRetard = credits.filter((c) => (c.joursRetard ?? 0) > 0);
  const aEcheance = credits.filter((c) => (c.joursRetard ?? 0) <= 0 && c.prochaineEcheance);
  const promesses = credits.filter((c) => c.promesseDate);
  // Un encours inconnu n'est pas un encours nul : sans un seul montant lu, l'ecran le dit.
  const avecMontant = credits.filter((c) => c.encours !== null && c.encours !== undefined);
  const encours = avecMontant.reduce((t, c) => t + (c.encours ?? 0), 0);

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
            {derniere
              ? `Donnees du ${dateCourte(derniere)} a ${heureCourte(derniere)}`
              : 'Jamais synchronise'}
          </Text>
          {enAttente > 0 ? (
            <Text style={s.badge}>{enAttente} en attente</Text>
          ) : (
            <Text style={s.badgeCalme}>a jour</Text>
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
            {credits.length} credits
            {credits.length > 0 && avecMontant.length === 0
              ? ' · montants indisponibles'
              : ` · ${montant(encours)}`}
          </Text>
          {profil?.note !== null && profil?.note !== undefined ? (
            <Text style={s.score}>Mon score du jour : {profil.note} / 100 · classe {profil.classe}</Text>
          ) : null}
        </Pressable>
      </Link>

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
