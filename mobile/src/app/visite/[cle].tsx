import { useCallback, useState } from 'react';
import {
  Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import type { EntreeReferentiel } from '@/api/types';
import { enregistrerVisite, liste } from '@/db/visites';
import { synchroniser } from '@/sync/moteur';
import { couleurs, espaces, texte } from '@/ui/theme';

/**
 * La saisie d'une visite, sur le terrain.
 *
 * <p>Elle s'enregistre TOUJOURS dans la file locale, meme si le reseau est la : l'agent ferme
 * l'ecran en sachant que c'est garde, et la transmission est l'affaire du moteur. Rien, ici,
 * ne depend du reseau — pas meme les listes de choix, lues dans la copie locale.</p>
 */
export default function SaisieVisite() {
  const { cle } = useLocalSearchParams<{ cle: string }>();
  const morceaux = (cle ?? '').split('-');
  const codAgencia = morceaux[0] ?? '';
  const numero = morceaux[1] ?? '';
  const router = useRouter();

  const [typesContact, setTypesContact] = useState<EntreeReferentiel[]>([]);
  const [resultats, setResultats] = useState<EntreeReferentiel[]>([]);
  const [motifs, setMotifs] = useState<EntreeReferentiel[]>([]);
  const [appreciations, setAppreciations] = useState<EntreeReferentiel[]>([]);

  const [typeContact, setTypeContact] = useState('VISITE');
  const [resultat, setResultat] = useState('VU');
  const [motif, setMotif] = useState<string | null>(null);
  const [appreciation, setAppreciation] = useState<string | null>(null);
  const [promesseMontant, setPromesseMontant] = useState('');
  const [promesseDate, setPromesseDate] = useState('');
  const [remarque, setRemarque] = useState('');
  const [position, setPosition] = useState<Location.LocationObject | null>(null);
  const [enregistre, setEnregistre] = useState(false);

  useFocusEffect(useCallback(() => {
    void (async () => {
      setTypesContact(await liste('TYPE_CONTACT'));
      setResultats(await liste('RESULTAT'));
      setMotifs(await liste('MOTIF_RETARD'));
      setAppreciations(await liste('APPRECIATION'));
    })();
  }, []));

  async function prendrePosition() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Position', 'La visite sera enregistree sans position.');
      return;
    }
    setPosition(await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
  }

  const remarqueExigee = appreciation === 'C' || appreciation === 'D';
  const remarqueTropCourte = remarqueExigee && remarque.trim().length < 10;
  const promesseIncomplete = (promesseMontant.trim() !== '') !== (promesseDate.trim() !== '');

  async function enregistrer() {
    if (remarqueTropCourte) {
      Alert.alert('Remarque',
        `Une appreciation ${appreciation} demande une remarque d'au moins dix caracteres.`);
      return;
    }
    if (promesseIncomplete) {
      Alert.alert('Promesse', 'Une promesse demande un montant ET une date.');
      return;
    }
    await enregistrerVisite({
      codAgencia,
      numCredito: Number(numero),
      codCliente: null,
      typeContact,
      resultat,
      motifRetard: motif,
      promesseMontant: promesseMontant.trim() ? Number(promesseMontant.replace(/\s/g, '')) : null,
      promesseDate: promesseDate.trim() || null,
      appreciation,
      remarque: remarque.trim() || null,
      latitude: position?.coords.latitude ?? null,
      longitude: position?.coords.longitude ?? null,
      precisionM: position?.coords.accuracy ? Math.round(position.coords.accuracy) : null,
      corrigeIdentifiantClient: null,
    });
    setEnregistre(true);
    // On tente la transmission tout de suite, sans l'attendre : si le reseau est la, la
    // visite part en quelques secondes ; sinon elle attend, et l'agent n'en sait rien.
    void synchroniser();
    setTimeout(() => router.back(), 900);
  }

  if (enregistre) {
    return (
      <View style={s.confirmation}>
        <Text style={s.confirmationTitre}>Visite enregistree</Text>
        <Text style={s.confirmationTexte}>
          Elle sera transmise a la prochaine connexion. Vous pouvez continuer votre tournee.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: couleurs.fond }} contentContainerStyle={s.page}>
      <Text style={s.credit}>Credit {codAgencia}/{numero}</Text>

      <Groupe titre="Type de contact">
        <Choix entrees={typesContact} valeur={typeContact} surChoix={setTypeContact} />
      </Groupe>

      <Groupe titre="Resultat">
        <Choix entrees={resultats} valeur={resultat} surChoix={setResultat} />
      </Groupe>

      <Groupe titre="Motif du retard">
        <Choix entrees={motifs} valeur={motif} surChoix={(c) => setMotif(c === motif ? null : c)} />
      </Groupe>

      <Groupe titre="Promesse">
        <View style={s.ligneDeux}>
          <TextInput style={[s.champ, { flex: 1.4 }]} placeholder="Montant (GNF)"
                     placeholderTextColor={couleurs.texteSecondaire} keyboardType="numeric"
                     value={promesseMontant} onChangeText={setPromesseMontant}
                     accessibilityLabel="Montant promis" />
          <TextInput style={[s.champ, { flex: 1 }]} placeholder="AAAA-MM-JJ"
                     placeholderTextColor={couleurs.texteSecondaire}
                     value={promesseDate} onChangeText={setPromesseDate}
                     accessibilityLabel="Date promise" />
        </View>
        {promesseIncomplete ? (
          <Text style={s.alerte}>Une promesse demande un montant ET une date.</Text>
        ) : null}
      </Groupe>

      <Groupe titre="Appreciation de l'associe">
        <Choix entrees={appreciations} valeur={appreciation}
               surChoix={(c) => setAppreciation(c === appreciation ? null : c)} />
      </Groupe>

      <Groupe titre={remarqueExigee ? 'Remarque (obligatoire)' : 'Remarque'}>
        <TextInput style={[s.champ, s.zoneTexte]} multiline numberOfLines={4}
                   placeholder="Ce que vous avez constate"
                   placeholderTextColor={couleurs.texteSecondaire}
                   value={remarque} onChangeText={setRemarque}
                   accessibilityLabel="Remarque" />
        {remarqueTropCourte ? (
          <Text style={s.alerte}>
            Une appreciation {appreciation} demande une remarque d'au moins dix caracteres.
          </Text>
        ) : null}
      </Groupe>

      <Pressable accessibilityRole="button" onPress={prendrePosition} style={s.boutonSecondaire}>
        <Text style={s.boutonSecondaireTexte}>
          {position
            ? `Position prise · ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
            : 'Prendre la position'}
        </Text>
      </Pressable>

      <View style={s.pied}>
        <Text style={s.piedTexte}>
          La visite est enregistree sur le telephone et transmise a la prochaine connexion.
        </Text>
        <Pressable accessibilityRole="button" onPress={enregistrer} style={s.bouton}>
          <Text style={s.boutonTexte}>Enregistrer la visite</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Groupe({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <View style={s.groupe}>
      <Text style={s.groupeTitre}>{titre}</Text>
      {children}
    </View>
  );
}

function Choix({ entrees, valeur, surChoix }:
  { entrees: EntreeReferentiel[]; valeur: string | null; surChoix: (code: string) => void }) {
  return (
    <View style={s.choix}>
      {entrees.map((e) => {
        const actif = e.code === valeur;
        return (
          <Pressable key={e.code} accessibilityRole="button"
                     accessibilityState={{ selected: actif }}
                     onPress={() => surChoix(e.code)}
                     style={[s.puce, actif && s.puceActive]}>
            <Text style={[s.puceTexte, actif && s.puceTexteActif]}>{e.libelle}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  page: { padding: espaces.l, gap: espaces.l, paddingBottom: espaces.xxl },
  credit: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  groupe: { gap: espaces.s },
  groupeTitre: { fontSize: texte.petit, fontWeight: '600', color: '#3D4B44' },
  choix: { flexDirection: 'row', flexWrap: 'wrap', gap: espaces.s },
  puce: {
    minHeight: 40, paddingHorizontal: espaces.l, justifyContent: 'center',
    borderRadius: 20, borderWidth: 1, borderColor: '#C9D0C6', backgroundColor: couleurs.surface,
  },
  puceActive: { borderWidth: 2, borderColor: couleurs.vert, backgroundColor: couleurs.vertClair },
  puceTexte: { fontSize: texte.petit, color: '#3D4B44' },
  puceTexteActif: { color: couleurs.vert, fontWeight: '600' },
  ligneDeux: { flexDirection: 'row', gap: espaces.s },
  champ: {
    minHeight: 46, borderRadius: 10, borderWidth: 1, borderColor: '#C9D0C6',
    backgroundColor: couleurs.surface, paddingHorizontal: espaces.m,
    fontSize: 16, color: couleurs.texte,
  },
  zoneTexte: { minHeight: 96, textAlignVertical: 'top', paddingTop: espaces.m },
  alerte: { fontSize: texte.minuscule, color: couleurs.rouge },
  boutonSecondaire: {
    minHeight: 48, borderRadius: 10, borderWidth: 1, borderColor: couleurs.bord,
    backgroundColor: couleurs.surface, alignItems: 'center', justifyContent: 'center',
  },
  boutonSecondaireTexte: { fontSize: texte.petit, color: couleurs.vert, fontWeight: '600' },
  pied: { gap: espaces.s, marginTop: espaces.s },
  piedTexte: { fontSize: texte.petit, color: couleurs.ambre },
  bouton: {
    minHeight: 52, borderRadius: 12, backgroundColor: couleurs.vert,
    alignItems: 'center', justifyContent: 'center',
  },
  boutonTexte: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  confirmation: {
    flex: 1, backgroundColor: couleurs.fond, alignItems: 'center',
    justifyContent: 'center', padding: espaces.xl, gap: espaces.m,
  },
  confirmationTitre: { fontSize: texte.titre, fontWeight: '600', color: couleurs.vert },
  confirmationTexte: { fontSize: texte.corps, color: couleurs.texte, textAlign: 'center' },
});
