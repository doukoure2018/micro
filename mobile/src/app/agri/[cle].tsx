import { useCallback, useState } from 'react';
import {
  Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import type { EntreeReferentiel } from '@/api/types';
import { liste } from '@/db/visites';
import {
  enregistrerRecolte, enregistrerVisiteAgri, parcellesLocales, recolteDeLaParcelle,
  visitesAgriDeLaParcelle,
} from '@/db/agri';
import type { ParcelleLocale, RecolteLocale, VisiteAgriLocale } from '@/db/agri';
import { estOuverte } from '@/db/base';
import { synchroniser } from '@/sync/moteur';
import { couleurs, dateCourte, espaces, montant, texte } from '@/ui/theme';

/** Les etats qui exigent de nommer la cause : c'est la cause qui sert au credit suivant. */
const ETATS_DEGRADES = ['FAIBLE', 'PERDU'];

/**
 * La fiche d'une parcelle : son suivi de campagne et sa recolte.
 *
 * <p>Deux saisies vivent ici. Le PASSAGE se repete a chaque visite — stade, etat, cause quand
 * la culture souffre. La RECOLTE conclut, une seule fois : c'est elle qui, comparee au
 * previsionnel du dossier, dit si ce qui avait ete annonce a ete tenu.</p>
 */
export default function FicheParcelle() {
  const { cle } = useLocalSearchParams<{ cle: string }>();
  const identifiant = cle ?? '';

  const [parcelle, setParcelle] = useState<ParcelleLocale | null>(null);
  const [visites, setVisites] = useState<VisiteAgriLocale[]>([]);
  const [recolte, setRecolte] = useState<RecolteLocale | null>(null);
  const [stades, setStades] = useState<EntreeReferentiel[]>([]);
  const [etats, setEtats] = useState<EntreeReferentiel[]>([]);
  const [sinistres, setSinistres] = useState<EntreeReferentiel[]>([]);
  const [unites, setUnites] = useState<EntreeReferentiel[]>([]);

  const [formulaire, setFormulaire] = useState<'AUCUN' | 'PASSAGE' | 'RECOLTE'>('AUCUN');
  const [stade, setStade] = useState<string | null>(null);
  const [etatCulture, setEtatCulture] = useState<string | null>(null);
  const [sinistre, setSinistre] = useState<string | null>(null);
  const [intrants, setIntrants] = useState('');
  const [remarque, setRemarque] = useState('');
  const [quantite, setQuantite] = useState('');
  const [unite, setUnite] = useState<string | null>(null);
  const [prix, setPrix] = useState('');
  const [acheteur, setAcheteur] = useState('');
  const [dateRecolte, setDateRecolte] = useState('');

  const charger = useCallback(async () => {
    if (!estOuverte()) return;
    const toutes = await parcellesLocales();
    setParcelle(toutes.find((p) => p.identifiantClient === identifiant) ?? null);
    setVisites(await visitesAgriDeLaParcelle(identifiant));
    setRecolte(await recolteDeLaParcelle(identifiant));
    setStades(await liste('STADE_CAMPAGNE'));
    setEtats(await liste('ETAT_CULTURE'));
    setSinistres(await liste('SINISTRE'));
    setUnites(await liste('UNITE_RECOLTE'));
  }, [identifiant]);

  useFocusEffect(useCallback(() => { void charger(); }, [charger]));

  if (!parcelle) {
    return <View style={s.page}><Text style={s.vide}>Parcelle introuvable sur ce telephone.</Text></View>;
  }

  async function enregistrerPassage() {
    if (!stade || !etatCulture) {
      Alert.alert('Passage', 'Le stade et l etat de la culture sont demandes.');
      return;
    }
    if (ETATS_DEGRADES.includes(etatCulture) && !sinistre) {
      Alert.alert('Cause',
        'Une culture faible ou perdue demande sa cause : c est elle qui servira au credit suivant.');
      return;
    }
    let position: Location.LocationObject | null = null;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    }
    await enregistrerVisiteAgri({
      parcelleIdentifiant: identifiant,
      stade,
      etatCulture,
      sinistre,
      surfaceToucheeHa: null,
      intrants: intrants.trim() || null,
      remarque: remarque.trim() || null,
      latitude: position?.coords.latitude ?? null,
      longitude: position?.coords.longitude ?? null,
      precisionM: position?.coords.accuracy ? Math.round(position.coords.accuracy) : null,
    });
    setFormulaire('AUCUN');
    setStade(null);
    setEtatCulture(null);
    setSinistre(null);
    setIntrants('');
    setRemarque('');
    void synchroniser({ force: true });
    await charger();
  }

  async function enregistrerLaRecolte() {
    const q = Number(quantite.replace(',', '.'));
    if (!quantite.trim() || Number.isNaN(q) || q <= 0) {
      Alert.alert('Quantite', 'Saisissez la quantite recoltee.');
      return;
    }
    if (!unite) {
      Alert.alert('Unite', 'Choisissez l unite de mesure.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateRecolte.trim())) {
      Alert.alert('Date', 'La date de recolte se saisit en AAAA-MM-JJ.');
      return;
    }
    await enregistrerRecolte({
      parcelleIdentifiant: identifiant,
      quantite: q,
      unite,
      prixUnitaire: prix.trim() ? Number(prix.replace(/\s/g, '')) : null,
      partVenduePct: null,
      dateRecolte: dateRecolte.trim(),
      acheteur: acheteur.trim() || null,
      remarque: null,
    });
    setFormulaire('AUCUN');
    void synchroniser({ force: true });
    await charger();
  }

  return (
    <ScrollView style={{ backgroundColor: couleurs.fond }} contentContainerStyle={s.page}>
      <Text style={s.titre}>
        {parcelle.culture}{parcelle.surfaceHa ? ` · ${parcelle.surfaceHa} ha` : ''}
      </Text>
      <Text style={s.detail}>
        Membre {parcelle.codCliente}
        {parcelle.localite ? ` · ${parcelle.localite}` : ''}
        {parcelle.dateSemis ? ` · semis ${dateCourte(parcelle.dateSemis)}` : ''}
      </Text>

      {recolte ? (
        <View style={s.carteForte}>
          <Text style={s.carteTitre}>Recolte</Text>
          <Text style={s.detail}>
            {recolte.quantite} {unites.find((u) => u.code === recolte.unite)?.libelle ?? recolte.unite}
            {recolte.prixUnitaire ? ` · ${montant(recolte.prixUnitaire)} l unite` : ''}
          </Text>
          <Text style={s.detail}>
            {dateCourte(recolte.dateRecolte)}
            {recolte.acheteur ? ` · ${recolte.acheteur}` : ''}
            {recolte.etat !== 'TRANSMISE' ? ' · en attente d envoi' : ''}
          </Text>
        </View>
      ) : null}

      <View style={s.actions}>
        <Pressable accessibilityRole="button" style={s.boutonSecondaire}
                   onPress={() => setFormulaire(formulaire === 'PASSAGE' ? 'AUCUN' : 'PASSAGE')}>
          <Text style={s.boutonSecondaireTexte}>Enregistrer un passage</Text>
        </Pressable>
        {recolte ? null : (
          <Pressable accessibilityRole="button" style={s.bouton}
                     onPress={() => setFormulaire(formulaire === 'RECOLTE' ? 'AUCUN' : 'RECOLTE')}>
            <Text style={s.boutonTexte}>Declarer la recolte</Text>
          </Pressable>
        )}
      </View>

      {formulaire === 'PASSAGE' ? (
        <View style={s.formulaire}>
          <Groupe titre="Stade">
            <Choix entrees={stades} valeur={stade} surChoix={setStade} />
          </Groupe>
          <Groupe titre="Etat de la culture">
            <Choix entrees={etats} valeur={etatCulture} surChoix={setEtatCulture} />
          </Groupe>
          {etatCulture && ETATS_DEGRADES.includes(etatCulture) ? (
            <Groupe titre="Cause (obligatoire)">
              <Choix entrees={sinistres} valeur={sinistre} surChoix={setSinistre} />
            </Groupe>
          ) : null}
          <TextInput style={s.champ} placeholder="Intrants apportes depuis le dernier passage"
                     placeholderTextColor={couleurs.texteSecondaire}
                     value={intrants} onChangeText={setIntrants} accessibilityLabel="Intrants" />
          <TextInput style={[s.champ, s.zone]} multiline placeholder="Remarque"
                     placeholderTextColor={couleurs.texteSecondaire}
                     value={remarque} onChangeText={setRemarque} accessibilityLabel="Remarque" />
          <Pressable accessibilityRole="button" onPress={enregistrerPassage} style={s.bouton}>
            <Text style={s.boutonTexte}>Enregistrer le passage</Text>
          </Pressable>
        </View>
      ) : null}

      {formulaire === 'RECOLTE' ? (
        <View style={s.formulaire}>
          <View style={s.ligneDeux}>
            <TextInput style={[s.champ, { flex: 1 }]} placeholder="Quantite"
                       keyboardType="decimal-pad" placeholderTextColor={couleurs.texteSecondaire}
                       value={quantite} onChangeText={setQuantite} accessibilityLabel="Quantite recoltee" />
            <TextInput style={[s.champ, { flex: 1.2 }]} placeholder="AAAA-MM-JJ"
                       placeholderTextColor={couleurs.texteSecondaire}
                       value={dateRecolte} onChangeText={setDateRecolte} accessibilityLabel="Date de recolte" />
          </View>
          <Groupe titre="Unite">
            <Choix entrees={unites} valeur={unite} surChoix={setUnite} />
          </Groupe>
          <TextInput style={s.champ} placeholder="Prix de vente de l unite (GNF)"
                     keyboardType="numeric" placeholderTextColor={couleurs.texteSecondaire}
                     value={prix} onChangeText={setPrix} accessibilityLabel="Prix unitaire" />
          <TextInput style={s.champ} placeholder="Acheteur" placeholderTextColor={couleurs.texteSecondaire}
                     value={acheteur} onChangeText={setAcheteur} accessibilityLabel="Acheteur" />
          <Pressable accessibilityRole="button" onPress={enregistrerLaRecolte} style={s.bouton}>
            <Text style={s.boutonTexte}>Enregistrer la recolte</Text>
          </Pressable>
        </View>
      ) : null}

      <Text style={s.sousTitre}>Passages ({visites.length})</Text>
      {visites.length === 0 ? (
        <Text style={s.vide}>Aucun passage enregistre.</Text>
      ) : visites.map((v) => (
        <View key={v.identifiantClient} style={s.carte}>
          <View style={s.ligneHaut}>
            <Text style={s.nom}>
              {stades.find((x) => x.code === v.stade)?.libelle ?? v.stade}
              {' · '}
              {etats.find((x) => x.code === v.etatCulture)?.libelle ?? v.etatCulture}
            </Text>
            <Text style={s.detail}>{dateCourte(v.saisieAt)}</Text>
          </View>
          {v.sinistre ? (
            <Text style={s.cause}>
              Cause : {sinistres.find((x) => x.code === v.sinistre)?.libelle ?? v.sinistre}
            </Text>
          ) : null}
          {v.intrants ? <Text style={s.detail}>Intrants : {v.intrants}</Text> : null}
          {v.remarque ? <Text style={s.detail}>{v.remarque}</Text> : null}
          {v.etat !== 'TRANSMISE' ? (
            <Text style={s.etat}>{v.etat === 'REFUSEE' ? v.motifRefus : 'en attente d envoi'}</Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

function Groupe({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: espaces.xs }}>
      <Text style={s.groupeTitre}>{titre}</Text>
      {children}
    </View>
  );
}

function Choix({ entrees, valeur, surChoix }: {
  entrees: EntreeReferentiel[];
  valeur: string | null;
  surChoix: (code: string | null) => void;
}) {
  return (
    <View style={s.choix}>
      {entrees.map((e) => (
        <Pressable key={e.code} accessibilityRole="button"
                   accessibilityState={{ selected: valeur === e.code }}
                   onPress={() => surChoix(e.code === valeur ? null : e.code)}
                   style={[s.puce, valeur === e.code && s.puceActive]}>
          <Text style={[s.puceTexte, valeur === e.code && s.puceTexteActif]}>{e.libelle}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  page: { padding: espaces.l, gap: espaces.s, paddingBottom: espaces.xxl },
  titre: { fontSize: texte.titre - 4, fontWeight: '600', color: couleurs.texte },
  sousTitre: { fontSize: texte.sousTitre, fontWeight: '600', color: couleurs.texte, marginTop: espaces.m },
  groupeTitre: { fontSize: texte.petit, color: couleurs.texteSecondaire, fontWeight: '600' },
  formulaire: { gap: espaces.s, marginTop: espaces.s },
  actions: { gap: espaces.s, marginTop: espaces.s },
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
    backgroundColor: couleurs.surface, paddingHorizontal: espaces.m, paddingVertical: espaces.s,
    fontSize: texte.corps, color: couleurs.texte,
  },
  zone: { minHeight: 90, textAlignVertical: 'top' },
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
  carteForte: {
    backgroundColor: couleurs.vertClair, borderRadius: 12, padding: espaces.m, gap: 2,
  },
  carteTitre: { fontSize: texte.petit, fontWeight: '700', color: couleurs.vert },
  ligneHaut: { flexDirection: 'row', justifyContent: 'space-between', gap: espaces.s },
  nom: { fontSize: texte.corps, fontWeight: '600', color: couleurs.texte, flex: 1 },
  detail: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  cause: { fontSize: texte.petit, color: couleurs.ambre, fontWeight: '600' },
  etat: { fontSize: texte.minuscule, color: couleurs.ambre, marginTop: 2 },
  vide: { fontSize: texte.petit, color: couleurs.texteSecondaire },
});
