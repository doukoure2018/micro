import { useCallback, useState } from 'react';
import {
  Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { api, ErreurReseau } from '@/api/client';
import { jetonValide } from '@/auth/session';
import type { CategorieReclamation, ReclamationVue } from '@/api/types';
import {
  enregistrerReclamation, liste, majReferentiels, reclamationsLocales,
} from '@/db/visites';
import type { ReclamationLocale } from '@/db/visites';
import { estOuverte } from '@/db/base';
import { synchroniser } from '@/sync/moteur';
import { couleurs, dateCourte, espaces, texte } from '@/ui/theme';

/** La liste fermee des categories est servie par le serveur et gardee hors ligne. */
const LISTE_CATEGORIES = 'RECLAMATION_CATEGORIE';

/**
 * Signaler depuis le terrain, et relire ce qui a ete repondu.
 *
 * <p>La saisie marche sans reseau, comme une visite : la reclamation entre dans la file et
 * part a la prochaine connexion. Les reponses, elles, se lisent en ligne — elles viennent
 * d'etre ecrites par une direction, et une copie locale montrerait l'etat d'hier.</p>
 */
export default function Reclamations() {
  const { credit, membre } = useLocalSearchParams<{ credit?: string; membre?: string }>();
  const router = useRouter();
  const morceaux = (credit ?? '').split('-');
  const codAgencia = morceaux[0] || null;
  const numero = morceaux[1] ? Number(morceaux[1]) : null;

  const [categories, setCategories] = useState<CategorieReclamation[]>([]);
  const [categorie, setCategorie] = useState<string | null>(null);
  const [objet, setObjet] = useState('');
  const [message, setMessage] = useState('');
  const [envoyees, setEnvoyees] = useState<ReclamationVue[]>([]);
  const [enFile, setEnFile] = useState<ReclamationLocale[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(async () => {
    if (!estOuverte()) return;
    setCategories((await liste(LISTE_CATEGORIES)).map(
      (e) => ({ code: e.code, libelle: e.libelle, ordre: e.ordre })));
    setEnFile(await reclamationsLocales());
    try {
      const jeton = await jetonValide();
      if (!jeton) return;
      const cats = await api.get<{ categories: CategorieReclamation[] }>(
        '/ecredit/mobile/reclamations/categories', jeton);
      if (cats?.categories?.length) {
        // Rangees comme une liste fermee : l'ecran s'ouvrira sans reseau la prochaine fois.
        await majReferentiels(cats.categories.map((c) => ({
          liste: LISTE_CATEGORIES, code: c.code, libelle: c.libelle, ordre: c.ordre, actif: true,
        })));
        setCategories(cats.categories);
      }
      const mes = await api.get<{ reclamations: ReclamationVue[] }>(
        '/ecredit/mobile/reclamations', jeton);
      setEnvoyees(mes?.reclamations ?? []);
      setErreur(null);
    } catch (e) {
      setErreur(e instanceof ErreurReseau
        ? 'Hors connexion : vos reclamations transmises ne sont pas affichees.'
        : e instanceof Error ? e.message : null);
    }
  }, []);

  useFocusEffect(useCallback(() => { void charger(); }, [charger]));

  async function signaler() {
    if (!categorie) {
      Alert.alert('Categorie', 'Choisissez la categorie du signalement.');
      return;
    }
    if (objet.trim().length < 3) {
      Alert.alert('Objet', "L'objet est trop court.");
      return;
    }
    if (message.trim().length < 10) {
      Alert.alert('Message', 'Le message doit faire au moins dix caracteres.');
      return;
    }
    await enregistrerReclamation({
      categorie,
      objet: objet.trim(),
      message: message.trim(),
      codAgencia,
      numCredito: numero,
      codCliente: membre ?? null,
    });
    setObjet('');
    setMessage('');
    setCategorie(null);
    void synchroniser({ force: true });
    await charger();
    Alert.alert('Signalement enregistre',
      'Il part a la prochaine connexion. Vous verrez ici la reponse qui vous sera faite.',
      [{ text: 'Continuer' }, { text: 'Revenir', onPress: () => router.back() }]);
  }

  return (
    <ScrollView style={{ backgroundColor: couleurs.fond }} contentContainerStyle={s.page}>
      {numero ? (
        <Text style={s.contexte}>A propos du credit {codAgencia}/{numero}</Text>
      ) : null}

      <Text style={s.titre}>Signaler</Text>

      <View style={s.choix}>
        {categories.map((c) => (
          <Pressable key={c.code} accessibilityRole="button"
                     accessibilityState={{ selected: categorie === c.code }}
                     onPress={() => setCategorie(c.code === categorie ? null : c.code)}
                     style={[s.puce, categorie === c.code && s.puceActive]}>
            <Text style={[s.puceTexte, categorie === c.code && s.puceTexteActif]}>{c.libelle}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput style={s.champ} placeholder="Objet" placeholderTextColor={couleurs.texteSecondaire}
                 value={objet} onChangeText={setObjet} accessibilityLabel="Objet du signalement" />
      <TextInput style={[s.champ, s.zone]} multiline numberOfLines={5}
                 placeholder="Ce que vous constatez, et ce que vous attendez"
                 placeholderTextColor={couleurs.texteSecondaire}
                 value={message} onChangeText={setMessage} accessibilityLabel="Message" />

      <Pressable accessibilityRole="button" onPress={signaler} style={s.bouton}>
        <Text style={s.boutonTexte}>Envoyer le signalement</Text>
      </Pressable>
      <Text style={s.aide}>
        Il part a la prochaine connexion et arrive aux directions concernees. La reponse revient ici.
      </Text>

      {erreur ? <Text style={s.erreur}>{erreur}</Text> : null}

      {enFile.length > 0 ? (
        <>
          <Text style={s.titre}>En attente d'envoi</Text>
          {enFile.map((r) => (
            <View key={r.identifiantClient} style={s.carte}>
              <Text style={s.objet}>{r.objet}</Text>
              <Text style={s.detail}>
                {dateCourte(r.saisieAt)} · {r.etat === 'REFUSEE' ? 'refusee' : 'en attente'}
              </Text>
              {r.motifRefus ? <Text style={s.refus}>{r.motifRefus}</Text> : null}
            </View>
          ))}
        </>
      ) : null}

      {envoyees.length > 0 ? (
        <>
          <Text style={s.titre}>Mes signalements</Text>
          {envoyees.map((r) => (
            <View key={r.id} style={s.carte}>
              <View style={s.ligneHaut}>
                <Text style={s.objet}>{r.objet}</Text>
                <Text style={[s.statut, r.statut === 'TRAITEE' ? s.statutTraite : null]}>
                  {r.statut === 'OUVERTE' ? 'ouverte'
                    : r.statut === 'EN_COURS' ? 'en cours' : 'traitee'}
                </Text>
              </View>
              <Text style={s.detail}>
                {r.categorieLibelle} · {dateCourte(r.saisieAt)}
                {r.priseEnChargePar ? ` · pris par ${r.priseEnChargePar}` : ''}
              </Text>
              <Text style={s.message}>{r.message}</Text>
              {r.reponse ? (
                <View style={s.reponse}>
                  <Text style={s.reponseTitre}>
                    Reponse{r.reponduPar ? ` de ${r.reponduPar}` : ''}
                    {r.reponduAt ? ` le ${dateCourte(r.reponduAt)}` : ''}
                  </Text>
                  <Text style={s.message}>{r.reponse}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: espaces.l, gap: espaces.s, paddingBottom: espaces.xxl },
  contexte: { fontSize: texte.petit, color: couleurs.vert, fontWeight: '600' },
  titre: { fontSize: texte.sousTitre, fontWeight: '600', color: couleurs.texte, marginTop: espaces.m },
  choix: { flexDirection: 'row', flexWrap: 'wrap', gap: espaces.s },
  puce: {
    minHeight: 40, paddingHorizontal: espaces.m, justifyContent: 'center',
    borderRadius: 20, borderWidth: 1, borderColor: couleurs.bord, backgroundColor: couleurs.surface,
  },
  puceActive: { backgroundColor: couleurs.vert, borderColor: couleurs.vert },
  puceTexte: { fontSize: texte.petit, color: couleurs.texte },
  puceTexteActif: { color: '#FFFFFF', fontWeight: '600' },
  champ: {
    minHeight: 48, borderRadius: 10, borderWidth: 1, borderColor: couleurs.bord,
    backgroundColor: couleurs.surface, paddingHorizontal: espaces.m, paddingVertical: espaces.s,
    fontSize: texte.corps, color: couleurs.texte,
  },
  zone: { minHeight: 120, textAlignVertical: 'top' },
  bouton: {
    minHeight: 52, borderRadius: 12, backgroundColor: couleurs.vert,
    alignItems: 'center', justifyContent: 'center', marginTop: espaces.s,
  },
  boutonTexte: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  aide: { fontSize: texte.minuscule, color: couleurs.texteSecondaire },
  erreur: { fontSize: texte.petit, color: couleurs.ambre, marginTop: espaces.s },
  carte: {
    backgroundColor: couleurs.surface, borderRadius: 12, padding: espaces.m,
    borderWidth: 1, borderColor: couleurs.bord, gap: 2,
  },
  ligneHaut: { flexDirection: 'row', justifyContent: 'space-between', gap: espaces.s },
  objet: { fontSize: texte.corps, fontWeight: '600', color: couleurs.texte, flex: 1 },
  statut: { fontSize: texte.minuscule, color: couleurs.ambre, fontWeight: '700' },
  statutTraite: { color: couleurs.vert },
  detail: { fontSize: texte.minuscule, color: couleurs.texteSecondaire },
  message: { fontSize: texte.petit, color: couleurs.texte, marginTop: 2 },
  refus: { fontSize: texte.minuscule, color: couleurs.rouge, marginTop: 2 },
  reponse: {
    marginTop: espaces.s, paddingTop: espaces.s,
    borderTopWidth: 1, borderTopColor: couleurs.bord,
  },
  reponseTitre: { fontSize: texte.minuscule, color: couleurs.vert, fontWeight: '700' },
});
