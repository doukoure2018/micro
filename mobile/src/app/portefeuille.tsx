import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import type { CreditPortefeuille } from '@/api/types';
import { portefeuilleLocal } from '@/db/visites';
import { couleurRetard, couleurs, espaces, montant, texte } from '@/ui/theme';

type Filtre = 'RETARD' | 'ECHEANCE' | 'TOUS';

/** Le portefeuille de l'agent, lu dans la copie locale : il s'ouvre sans reseau. */
export default function Portefeuille() {
  const [credits, setCredits] = useState<CreditPortefeuille[]>([]);
  const [filtre, setFiltre] = useState<Filtre>('RETARD');
  const [recherche, setRecherche] = useState('');

  useFocusEffect(useCallback(() => {
    void (async () => setCredits(await portefeuilleLocal()))();
  }, []));

  const enRetard = useMemo(() => credits.filter((c) => (c.joursRetard ?? 0) > 0), [credits]);
  const aEcheance = useMemo(
    () => credits.filter((c) => (c.joursRetard ?? 0) <= 0 && c.prochaineEcheance), [credits]);

  const visibles = useMemo(() => {
    const base = filtre === 'RETARD' ? enRetard : filtre === 'ECHEANCE' ? aEcheance : credits;
    const q = recherche.trim().toLowerCase();
    if (!q) return base;
    return base.filter((c) =>
      (c.nomClient ?? '').toLowerCase().includes(q)
      || (c.codCliente ?? '').includes(q)
      || String(c.numCredito).includes(q));
  }, [filtre, recherche, credits, enRetard, aEcheance]);

  return (
    <View style={s.page}>
      <View style={s.filtres}>
        <Onglet actif={filtre === 'RETARD'} libelle={`En retard · ${enRetard.length}`}
                surAppui={() => setFiltre('RETARD')} />
        <Onglet actif={filtre === 'ECHEANCE'} libelle={`A venir · ${aEcheance.length}`}
                surAppui={() => setFiltre('ECHEANCE')} />
        <Onglet actif={filtre === 'TOUS'} libelle={`Tous · ${credits.length}`}
                surAppui={() => setFiltre('TOUS')} />
      </View>

      <TextInput
        style={s.recherche}
        placeholder="Nom, numero de membre ou de credit"
        placeholderTextColor={couleurs.texteSecondaire}
        value={recherche}
        onChangeText={setRecherche}
        accessibilityLabel="Rechercher dans mon portefeuille"
      />

      <FlatList
        data={visibles}
        keyExtractor={(c) => `${c.codAgencia}/${c.numCredito}`}
        contentContainerStyle={s.liste}
        ListEmptyComponent={<Text style={s.vide}>Aucun credit dans cette vue.</Text>}
        renderItem={({ item: c }) => (
          <Link href={{ pathname: '/credit/[cle]', params: { cle: `${c.codAgencia}-${c.numCredito}` } }} asChild>
            <Pressable style={s.ligne}>
              <View style={{ flex: 1 }}>
                <Text style={s.nom}>{c.nomClient ?? c.codCliente ?? 'Membre inconnu'}</Text>
                <Text style={s.detail}>
                  {c.codAgencia}/{c.numCredito}
                  {c.produit ? ` · ${c.produit}` : ''}
                  {c.encours !== null ? ` · ${montant(c.encours)}` : ''}
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

function Onglet({ actif, libelle, surAppui }:
  { actif: boolean; libelle: string; surAppui: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: actif }}
               onPress={surAppui} style={[s.onglet, actif && s.ongletActif]}>
      <Text style={[s.ongletTexte, actif && s.ongletTexteActif]}>{libelle}</Text>
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
  recherche: {
    minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: couleurs.bord,
    backgroundColor: couleurs.surface, paddingHorizontal: espaces.m,
    fontSize: texte.corps, color: couleurs.texte,
  },
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
