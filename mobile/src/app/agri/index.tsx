import { useCallback, useState } from 'react';
import {
  Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import type { EntreeReferentiel } from '@/api/types';
import { liste } from '@/db/visites';
import { enregistrerParcelle, parcellesLocales } from '@/db/agri';
import type { ParcelleLocale } from '@/db/agri';
import { estOuverte } from '@/db/base';
import { synchroniser } from '@/sync/moteur';
import { couleurs, dateCourte, espaces, texte } from '@/ui/theme';

/**
 * La collecte agricole : les parcelles suivies, et la declaration d'une nouvelle.
 *
 * <p>Tout se saisit hors ligne. Une parcelle se declare une fois ; ses passages de campagne et
 * sa recolte se rattachent ensuite a elle, depuis sa fiche.</p>
 */
export default function Parcelles() {
  const { credit, membre } = useLocalSearchParams<{ credit?: string; membre?: string }>();
  const morceaux = (credit ?? '').split('-');

  const [parcelles, setParcelles] = useState<ParcelleLocale[]>([]);
  const [cultures, setCultures] = useState<EntreeReferentiel[]>([]);
  const [ouvert, setOuvert] = useState(false);

  const [codCliente, setCodCliente] = useState(membre ?? '');
  const [culture, setCulture] = useState<string | null>(null);
  const [surface, setSurface] = useState('');
  const [localite, setLocalite] = useState('');
  const [dateSemis, setDateSemis] = useState('');
  const [position, setPosition] = useState<Location.LocationObject | null>(null);

  const charger = useCallback(async () => {
    if (!estOuverte()) return;
    setCultures(await liste('CULTURE'));
    setParcelles(await parcellesLocales());
  }, []);

  useFocusEffect(useCallback(() => { void charger(); }, [charger]));

  async function prendrePosition() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Position', 'La parcelle sera enregistree sans position.');
      return;
    }
    setPosition(await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
  }

  async function declarer() {
    if (codCliente.trim().length < 5) {
      Alert.alert('Membre', 'Saisissez le numero de membre.');
      return;
    }
    if (!culture) {
      Alert.alert('Culture', 'Choisissez la culture.');
      return;
    }
    const ha = surface.trim() ? Number(surface.replace(',', '.')) : null;
    if (ha !== null && (Number.isNaN(ha) || ha <= 0 || ha > 500)) {
      Alert.alert('Surface', 'La surface doit etre comprise entre 0 et 500 hectares.');
      return;
    }
    await enregistrerParcelle({
      codCliente: codCliente.trim(),
      codAgencia: morceaux[0] || null,
      numCredito: morceaux[1] ? Number(morceaux[1]) : null,
      culture,
      surfaceHa: ha,
      localite: localite.trim() || null,
      latitude: position?.coords.latitude ?? null,
      longitude: position?.coords.longitude ?? null,
      precisionM: position?.coords.accuracy ? Math.round(position.coords.accuracy) : null,
      dateSemis: dateSemis.trim() || null,
    });
    setOuvert(false);
    setCulture(null);
    setSurface('');
    setLocalite('');
    setDateSemis('');
    setPosition(null);
    void synchroniser({ force: true });
    await charger();
  }

  return (
    <ScrollView style={{ backgroundColor: couleurs.fond }} contentContainerStyle={s.page}>
      <Pressable accessibilityRole="button" onPress={() => setOuvert(!ouvert)} style={s.bouton}>
        <Text style={s.boutonTexte}>
          {ouvert ? 'Annuler' : 'Declarer une parcelle'}
        </Text>
      </Pressable>

      {ouvert ? (
        <View style={s.formulaire}>
          <TextInput style={s.champ} placeholder="Numero de membre" keyboardType="number-pad"
                     placeholderTextColor={couleurs.texteSecondaire}
                     value={codCliente} onChangeText={setCodCliente}
                     accessibilityLabel="Numero de membre" />
          <View style={s.choix}>
            {cultures.map((c) => (
              <Pressable key={c.code} accessibilityRole="button"
                         accessibilityState={{ selected: culture === c.code }}
                         onPress={() => setCulture(c.code === culture ? null : c.code)}
                         style={[s.puce, culture === c.code && s.puceActive]}>
                <Text style={[s.puceTexte, culture === c.code && s.puceTexteActif]}>
                  {c.libelle}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={s.ligneDeux}>
            <TextInput style={[s.champ, { flex: 1 }]} placeholder="Surface (ha)"
                       keyboardType="decimal-pad" placeholderTextColor={couleurs.texteSecondaire}
                       value={surface} onChangeText={setSurface} accessibilityLabel="Surface en hectares" />
            <TextInput style={[s.champ, { flex: 1.2 }]} placeholder="Semis (AAAA-MM-JJ)"
                       placeholderTextColor={couleurs.texteSecondaire}
                       value={dateSemis} onChangeText={setDateSemis} accessibilityLabel="Date de semis" />
          </View>
          <TextInput style={s.champ} placeholder="Localite" placeholderTextColor={couleurs.texteSecondaire}
                     value={localite} onChangeText={setLocalite} accessibilityLabel="Localite" />
          <Pressable accessibilityRole="button" onPress={prendrePosition} style={s.boutonSecondaire}>
            <Text style={s.boutonSecondaireTexte}>
              {position
                ? `Position prise · ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
                : 'Prendre la position de la parcelle'}
            </Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={declarer} style={s.bouton}>
            <Text style={s.boutonTexte}>Enregistrer la parcelle</Text>
          </Pressable>
        </View>
      ) : null}

      <Text style={s.titre}>Mes parcelles</Text>
      {parcelles.length === 0 ? (
        <Text style={s.vide}>Aucune parcelle declaree pour le moment.</Text>
      ) : parcelles.map((p) => (
        <Link key={p.identifiantClient}
              href={{ pathname: '/agri/[cle]', params: { cle: p.identifiantClient } }} asChild>
          <Pressable style={s.carte}>
            <View style={s.ligneHaut}>
              <Text style={s.nom}>
                {cultures.find((c) => c.code === p.culture)?.libelle ?? p.culture}
                {p.surfaceHa ? ` · ${p.surfaceHa} ha` : ''}
              </Text>
              {p.etat !== 'TRANSMISE' ? (
                <Text style={[s.etat, p.etat === 'REFUSEE' && s.etatRefuse]}>
                  {p.etat === 'REFUSEE' ? 'refusee' : 'en attente'}
                </Text>
              ) : null}
            </View>
            <Text style={s.detail}>
              Membre {p.codCliente}
              {p.localite ? ` · ${p.localite}` : ''}
              {p.dateSemis ? ` · semis ${dateCourte(p.dateSemis)}` : ''}
            </Text>
            {p.motifRefus ? <Text style={s.refus}>{p.motifRefus}</Text> : null}
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: espaces.l, gap: espaces.s, paddingBottom: espaces.xxl },
  titre: { fontSize: texte.sousTitre, fontWeight: '600', color: couleurs.texte, marginTop: espaces.m },
  formulaire: { gap: espaces.s },
  choix: { flexDirection: 'row', flexWrap: 'wrap', gap: espaces.s },
  puce: {
    minHeight: 40, paddingHorizontal: espaces.m, justifyContent: 'center', borderRadius: 20,
    borderWidth: 1, borderColor: couleurs.bord, backgroundColor: couleurs.surface,
  },
  puceActive: { backgroundColor: couleurs.vert, borderColor: couleurs.vert },
  puceTexte: { fontSize: texte.petit, color: couleurs.texte },
  puceTexteActif: { color: '#FFFFFF', fontWeight: '600' },
  champ: {
    minHeight: 48, borderRadius: 10, borderWidth: 1, borderColor: couleurs.bord,
    backgroundColor: couleurs.surface, paddingHorizontal: espaces.m,
    fontSize: texte.corps, color: couleurs.texte,
  },
  ligneDeux: { flexDirection: 'row', gap: espaces.s },
  bouton: {
    minHeight: 52, borderRadius: 12, backgroundColor: couleurs.vert,
    alignItems: 'center', justifyContent: 'center',
  },
  boutonTexte: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  boutonSecondaire: {
    minHeight: 48, borderRadius: 10, borderWidth: 1, borderColor: couleurs.bord,
    backgroundColor: couleurs.surface, alignItems: 'center', justifyContent: 'center',
  },
  boutonSecondaireTexte: { fontSize: texte.petit, color: couleurs.vert, fontWeight: '600' },
  carte: {
    backgroundColor: couleurs.surface, borderRadius: 12, padding: espaces.m,
    borderWidth: 1, borderColor: couleurs.bord, gap: 2,
  },
  ligneHaut: { flexDirection: 'row', justifyContent: 'space-between', gap: espaces.s },
  nom: { fontSize: texte.corps, fontWeight: '600', color: couleurs.texte, flex: 1 },
  detail: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  etat: { fontSize: texte.minuscule, color: couleurs.ambre, fontWeight: '700' },
  etatRefuse: { color: couleurs.rouge },
  refus: { fontSize: texte.minuscule, color: couleurs.rouge, marginTop: 2 },
  vide: { fontSize: texte.petit, color: couleurs.texteSecondaire },
});
