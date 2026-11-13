import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import type { CreditPortefeuille } from '@/api/types';
import { portefeuilleLocal } from '@/db/visites';
import { estOuverte } from '@/db/base';
import { cleDeRecherche, couleurRetard, couleurs, espaces, montant, texte } from '@/ui/theme';

type Filtre = 'RETARD' | 'ECHEANCE' | 'TOUS' | 'CLOS';

/** Le portefeuille de l'agent, lu dans la copie locale : il s'ouvre sans reseau. */
export default function Portefeuille() {
  const [credits, setCredits] = useState<CreditPortefeuille[]>([]);
  const [filtre, setFiltre] = useState<Filtre>('RETARD');
  const [recherche, setRecherche] = useState('');

  useFocusEffect(useCallback(() => {
    if (!estOuverte()) return;
    void (async () => setCredits(await portefeuilleLocal()))();
  }, []));

  // Le portefeuille, c'est ce que SAF porte ; les affectations dont SAF n'a plus le credit
  // vivent dans leur propre onglet, visibles mais hors des comptes.
  const portefeuille = useMemo(() => credits.filter((c) => !c.horsCreditsVivants), [credits]);
  const clos = useMemo(() => credits.filter((c) => c.horsCreditsVivants), [credits]);
  const enRetard = useMemo(() => portefeuille.filter((c) => (c.joursRetard ?? 0) > 0), [portefeuille]);
  const aEcheance = useMemo(
    () => portefeuille.filter((c) => (c.joursRetard ?? 0) <= 0 && c.prochaineEcheance), [portefeuille]);

  const cherche = recherche.trim().length > 0;

  /**
   * Une recherche porte sur TOUT le portefeuille, quel que soit l'onglet ouvert. L'agent qui
   * tape le nom d'un societaire le cherche, pas « dans les retards » : ne rien lui rendre
   * parce que ce membre est a jour serait lui dire qu'il n'existe pas.
   */
  const visibles = useMemo(() => {
    if (cherche) {
      const q = cleDeRecherche(recherche);
      return credits.filter((c) => cleDeRecherche(aChercher(c)).includes(q));
    }
    if (filtre === 'RETARD') return enRetard;
    if (filtre === 'ECHEANCE') return aEcheance;
    if (filtre === 'CLOS') return clos;
    return portefeuille;
  }, [cherche, filtre, recherche, credits, portefeuille, clos, enRetard, aEcheance]);

  return (
    <View style={s.page}>
      {/* Quatre onglets au plus : les libelles restent courts pour tenir sur 390 points. */}
      <View style={s.filtres}>
        <Onglet actif={!cherche && filtre === 'RETARD'} libelle={`Retard · ${enRetard.length}`}
                surAppui={() => setFiltre('RETARD')} />
        <Onglet actif={!cherche && filtre === 'ECHEANCE'} libelle={`A venir · ${aEcheance.length}`}
                surAppui={() => setFiltre('ECHEANCE')} />
        <Onglet actif={!cherche && filtre === 'TOUS'} libelle={`Tous · ${portefeuille.length}`}
                surAppui={() => setFiltre('TOUS')} />
        {clos.length > 0 ? (
          <Onglet actif={!cherche && filtre === 'CLOS'} libelle={`Clos · ${clos.length}`}
                  surAppui={() => setFiltre('CLOS')} />
        ) : null}
      </View>

      <View style={s.barre}>
        <TextInput
          style={s.recherche}
          placeholder="Nom du societaire, numero de membre ou de credit"
          placeholderTextColor={couleurs.texteSecondaire}
          value={recherche}
          onChangeText={setRecherche}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          returnKeyType="search"
          accessibilityLabel="Rechercher un societaire dans mon portefeuille"
        />
        {cherche ? (
          <Text style={s.compte}>
            {visibles.length} resultat{visibles.length > 1 ? 's' : ''} sur tout le portefeuille
          </Text>
        ) : null}
      </View>

      <FlatList
        data={visibles}
        keyExtractor={(c) => `${c.codAgencia}/${c.numCredito}`}
        contentContainerStyle={s.liste}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={s.vide}>
            {cherche
              ? `Aucun societaire ne correspond a « ${recherche.trim()} » dans votre portefeuille.`
              : filtre === 'CLOS'
                ? 'Aucune affectation a fermer.'
                : 'Aucun credit dans cette vue.'}
          </Text>
        }
        renderItem={({ item: c }) => (
          <Link href={{ pathname: '/credit/[cle]', params: { cle: `${c.codAgencia}-${c.numCredito}` } }} asChild>
            <Pressable style={s.ligne}>
              <View style={{ flex: 1 }}>
                <Text style={s.nom} numberOfLines={1}>
                  {c.nomClient ?? (c.codCliente ? `Membre ${c.codCliente}` : 'Membre inconnu')}
                </Text>
                <Text style={s.detail} numberOfLines={1}>
                  {c.nomClient && c.codCliente ? `Membre ${c.codCliente} · ` : ''}
                  credit {c.codAgencia}/{c.numCredito}
                </Text>
                <Text style={s.detail} numberOfLines={1}>
                  {[c.produit, c.encours === null ? null : montant(c.encours)]
                    .filter((x) => x).join(' · ') || etatSansMontant(c)}
                </Text>
              </View>
              <View style={s.droite}>
                <Text style={[s.retard, { color: couleurRetard(c.joursRetard) }]}>
                  {c.joursRetard && c.joursRetard > 0 ? `${c.joursRetard} j` : '—'}
                </Text>
                {c.derniereAppreciation
                  ? <Text style={s.appreciation}>{c.derniereAppreciation}</Text>
                  : null}
              </View>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

/**
 * Ce qu'on ecrit a la place des montants quand il n'y en a pas. Deux silences a ne pas
 * confondre : SAF a repondu sans porter ce credit parmi les vivants — il est rembourse (capital
 * restant du nul) ou clos, et l'affectation est a fermer ; ou SAF n'a rien dit du tout, et les
 * chiffres reviendront a la prochaine synchronisation.
 */
function etatSansMontant(c: CreditPortefeuille): string {
  return c.horsCreditsVivants ? 'Rembourse ou clos dans SAF' : 'Montants indisponibles';
}

/** Ce dans quoi la recherche cherche : le nom d'abord, mais aussi les deux numeros. */
function aChercher(c: CreditPortefeuille): string {
  return [c.nomClient, c.codCliente, String(c.numCredito), c.produit]
    .filter((x) => x).join(' ');
}

function Onglet({ actif, libelle, surAppui }:
  { actif: boolean; libelle: string; surAppui: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: actif }}
               onPress={surAppui} style={[s.onglet, actif && s.ongletActif]}>
      <Text numberOfLines={1} style={[s.ongletTexte, actif && s.ongletTexteActif]}>{libelle}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: couleurs.fond, padding: espaces.l, gap: espaces.m },
  filtres: { flexDirection: 'row', backgroundColor: '#E4E8E1', borderRadius: 10, padding: 3, gap: 3 },
  onglet: { flex: 1, minHeight: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  ongletActif: { backgroundColor: couleurs.surface },
  ongletTexte: { fontSize: texte.petit, color: '#3D4B44' },
  ongletTexteActif: { fontWeight: '600', color: couleurs.texte },
  barre: { gap: espaces.xs },
  recherche: {
    minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: couleurs.bord,
    backgroundColor: couleurs.surface, paddingHorizontal: espaces.m,
    fontSize: texte.corps, color: couleurs.texte,
  },
  compte: { fontSize: texte.minuscule, color: couleurs.texteSecondaire, paddingHorizontal: espaces.xs },
  liste: { gap: espaces.s, paddingBottom: espaces.xxl },
  ligne: {
    flexDirection: 'row', alignItems: 'center', gap: espaces.m, minHeight: 56,
    backgroundColor: couleurs.surface, borderRadius: 12, padding: espaces.m,
    borderWidth: 1, borderColor: couleurs.bord,
  },
  nom: { fontSize: texte.corps, fontWeight: '600', color: couleurs.texte },
  detail: { fontSize: texte.petit, color: couleurs.texteSecondaire, marginTop: 1 },
  droite: { alignItems: 'flex-end', gap: 2 },
  retard: { fontSize: texte.minuscule, fontWeight: '700' },
  appreciation: { fontSize: texte.minuscule, color: couleurs.texteSecondaire, fontWeight: '600' },
  vide: { fontSize: texte.corps, color: couleurs.texteSecondaire, padding: espaces.l },
});
