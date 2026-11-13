import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { etatDeLaFile, synchroniser } from '@/sync/moteur';
import { visitesRefusees, type VisiteLocale } from '@/db/visites';
import { couleurs, dateCourte, espaces, heureCourte, texte } from '@/ui/theme';

/** L'etat de la file : ce qui attend, ce qui est parti, ce qui revient a l'agent. */
export default function Synchronisation() {
  const [compte, setCompte] = useState({ EN_ATTENTE: 0, ENVOI: 0, TRANSMISE: 0, REFUSEE: 0 });
  const [derniere, setDerniere] = useState<string | null>(null);
  const [refusees, setRefusees] = useState<VisiteLocale[]>([]);
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const charger = useCallback(async () => {
    const etat = await etatDeLaFile();
    setCompte(etat.compte);
    setDerniere(etat.derniere);
    setRefusees(await visitesRefusees());
  }, []);

  useFocusEffect(useCallback(() => { void charger(); }, [charger]));

  async function lancer() {
    setEnCours(true);
    setMessage(null);
    const r = await synchroniser({ force: true });
    setMessage(
      r.horsConnexion ? 'Hors connexion : les saisies attendent.'
        : r.erreur ? r.erreur
        : `${r.transmises} saisie(s) transmise(s), ${r.refusees} refusee(s).`);
    await charger();
    setEnCours(false);
  }

  const enAttente = compte.EN_ATTENTE + compte.ENVOI;

  return (
    <ScrollView style={{ backgroundColor: couleurs.fond }} contentContainerStyle={s.page}>
      <View style={s.carte}>
        <Text style={s.titre}>
          {enAttente > 0 ? `${enAttente} saisie(s) en attente` : 'Tout est transmis'}
        </Text>
        <Text style={s.texte}>
          {derniere
            ? `Derniere synchronisation reussie le ${dateCourte(derniere)} a ${heureCourte(derniere)}.`
            : 'Aucune synchronisation reussie pour le moment.'}
        </Text>
        <Text style={s.texte}>
          Les saisies partent d'elles-memes au retour du reseau, meme application fermee.
        </Text>
        <Pressable accessibilityRole="button" onPress={lancer} disabled={enCours} style={s.bouton}>
          {enCours ? <ActivityIndicator color={couleurs.vert} />
                   : <Text style={s.boutonTexte}>Synchroniser maintenant</Text>}
        </Pressable>
        {message ? <Text style={s.message}>{message}</Text> : null}
      </View>

      <View style={s.compteurs}>
        <Compteur valeur={compte.EN_ATTENTE} libelle="en attente" />
        <Compteur valeur={compte.TRANSMISE} libelle="transmises" />
        <Compteur valeur={compte.REFUSEE} libelle="refusees" />
      </View>

      {refusees.length > 0 ? (
        <View style={{ gap: espaces.s }}>
          <Text style={s.sousTitre}>Saisies a corriger</Text>
          {refusees.map((v) => (
            <View key={v.identifiantClient} style={s.refus}>
              <Text style={s.refusCredit}>
                {v.codAgencia}/{v.numCredito} · {dateCourte(v.saisieAt)}
              </Text>
              <Text style={s.refusMotif}>{v.motifRefus ?? 'Refusee par le serveur'}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

function Compteur({ valeur, libelle }: { valeur: number; libelle: string }) {
  return (
    <View style={s.compteur}>
      <Text style={s.compteurValeur}>{valeur}</Text>
      <Text style={s.compteurLibelle}>{libelle}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  page: { padding: espaces.l, gap: espaces.m, paddingBottom: espaces.xxl },
  carte: {
    backgroundColor: couleurs.surface, borderRadius: 14, padding: espaces.l,
    borderWidth: 1, borderColor: couleurs.bord, gap: espaces.s,
  },
  titre: { fontSize: texte.sousTitre, fontWeight: '600', color: couleurs.texte },
  texte: { fontSize: texte.petit, color: couleurs.texteSecondaire, lineHeight: 20 },
  bouton: {
    minHeight: 46, borderRadius: 10, borderWidth: 1, borderColor: couleurs.vert,
    alignItems: 'center', justifyContent: 'center', marginTop: espaces.s,
  },
  boutonTexte: { fontSize: texte.corps, color: couleurs.vert, fontWeight: '600' },
  message: { fontSize: texte.petit, color: couleurs.vert },
  compteurs: { flexDirection: 'row', gap: espaces.s },
  compteur: {
    flex: 1, backgroundColor: couleurs.surface, borderRadius: 12, padding: espaces.m,
    borderWidth: 1, borderColor: couleurs.bord, alignItems: 'center', gap: 2,
  },
  compteurValeur: { fontSize: 22, fontWeight: '700', color: couleurs.texte },
  compteurLibelle: { fontSize: texte.minuscule, color: couleurs.texteSecondaire },
  sousTitre: { fontSize: texte.sousTitre, fontWeight: '600', color: couleurs.texte },
  refus: {
    backgroundColor: couleurs.rougeClair, borderRadius: 10, padding: espaces.m, gap: 2,
  },
  refusCredit: { fontSize: texte.petit, fontWeight: '600', color: couleurs.texte },
  refusMotif: { fontSize: texte.petit, color: couleurs.rouge },
});
