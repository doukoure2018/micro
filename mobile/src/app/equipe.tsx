import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { api, ErreurReseau } from '@/api/client';
import { jetonValide } from '@/auth/session';
import type { AgentVu, EquipeVue } from '@/api/types';
import { couleurs, dateCourte, espaces, heureCourte, texte } from '@/ui/theme';

/**
 * Ce que le directeur d'agence voit de son equipe.
 *
 * <p>Cet ecran LIT en ligne, et c'est assume : le hors-ligne a ete concu pour les SAISIES du
 * terrain, qui n'existent nulle part ailleurs tant qu'elles ne sont pas transmises. Un
 * directeur consulte depuis son agence, et une copie locale de l'activite de ses agents
 * vieillirait sans qu'il le sache — mieux vaut dire « pas de reseau » que montrer hier.</p>
 */
export default function Equipe() {
  const [vue, setVue] = useState<EquipeVue | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [charge, setCharge] = useState(false);

  const charger = useCallback(async () => {
    setCharge(true);
    try {
      const jeton = await jetonValide();
      if (!jeton) {
        setErreur('Session expiree : reconnectez-vous.');
        return;
      }
      const data = await api.get<{ equipe: EquipeVue }>('/ecredit/mobile/equipe', jeton);
      setVue(data?.equipe ?? null);
      setErreur(null);
    } catch (e) {
      setErreur(e instanceof ErreurReseau
        ? 'Pas de reseau : cet ecran se lit en ligne.'
        : e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setCharge(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void charger(); }, [charger]));

  return (
    <ScrollView
      style={{ backgroundColor: couleurs.fond }}
      contentContainerStyle={s.page}
      refreshControl={<RefreshControl refreshing={charge} onRefresh={charger} />}
    >
      {erreur ? <Text style={s.erreur}>{erreur}</Text> : null}

      {vue ? (
        <>
          {vue.silencieux.length > 0 ? (
            <View style={s.bandeau}>
              <Text style={s.bandeauTitre}>
                {vue.silencieux.length === 1
                  ? '1 agent sans visite transmise'
                  : `${vue.silencieux.length} agents sans visite transmise`}
                {` depuis ${vue.joursSilence} jours`}
              </Text>
              {vue.silencieux.map((a) => (
                <Text key={a.userId} style={s.bandeauLigne}>
                  {a.nom} · {a.derniereVisiteAt
                    ? `derniere visite le ${dateCourte(a.derniereVisiteAt)}`
                    : 'aucune visite'}
                </Text>
              ))}
            </View>
          ) : null}

          <Text style={s.titre}>Mes agents · {vue.joursObserves} derniers jours</Text>
          {vue.agents.map((a) => <Agent key={a.userId} agent={a} />)}

          <Text style={s.titre}>Dernieres visites</Text>
          {vue.visites.length === 0 ? (
            <Text style={s.vide}>Aucune visite transmise pour le moment.</Text>
          ) : vue.visites.map((v) => (
            <View key={v.id} style={s.carte}>
              <View style={s.ligneHaut}>
                <Text style={s.agentNom}>{v.agent ?? '—'}</Text>
                <Text style={s.date}>
                  {dateCourte(v.saisieAt)} a {heureCourte(v.saisieAt)}
                </Text>
              </View>
              <Text style={s.detail}>
                Credit {v.codAgencia}/{v.numCredito} · {v.typeContact} · {v.resultat}
                {v.appreciation ? ` · ${v.appreciation}` : ''}
                {v.nbPhotos > 0 ? ` · ${v.nbPhotos} photo${v.nbPhotos > 1 ? 's' : ''}` : ''}
              </Text>
              {v.remarque ? <Text style={s.remarque}>{v.remarque}</Text> : null}
              {v.horsPortefeuille ? (
                <Text style={s.hors}>Hors du portefeuille de l'agent au moment de l'envoi</Text>
              ) : null}
            </View>
          ))}
        </>
      ) : null}

      <Text style={s.pied}>
        Lecture seule. Les decisions — affectation, validation — restent sur le poste de travail.
      </Text>
    </ScrollView>
  );
}

function Agent({ agent: a }: { agent: AgentVu }) {
  const total = a.nbA + a.nbB + a.nbC + a.nbD;
  return (
    <View style={s.carte}>
      <View style={s.ligneHaut}>
        <Text style={s.agentNom}>{a.nom}</Text>
        <Text style={s.date}>{a.nbCredits} credits</Text>
      </View>
      <Text style={s.detail}>
        {a.nbVisites === 0
          ? 'Aucune visite transmise'
          : `${a.nbVisites} visite${a.nbVisites > 1 ? 's' : ''} · derniere le ${dateCourte(a.derniereVisiteAt)}`}
      </Text>
      {total > 0 ? (
        <View style={s.bareme}>
          <Note lettre="A" valeur={a.nbA} couleur={couleurs.vert} />
          <Note lettre="B" valeur={a.nbB} couleur={couleurs.bleu} />
          <Note lettre="C" valeur={a.nbC} couleur={couleurs.ambre} />
          <Note lettre="D" valeur={a.nbD} couleur={couleurs.rouge} />
        </View>
      ) : null}
    </View>
  );
}

function Note({ lettre, valeur, couleur }: { lettre: string; valeur: number; couleur: string }) {
  return (
    <View style={s.note}>
      <Text style={[s.noteValeur, { color: couleur }]}>{valeur}</Text>
      <Text style={s.noteLettre}>{lettre}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  page: { padding: espaces.l, gap: espaces.s, paddingBottom: espaces.xxl },
  titre: { fontSize: texte.sousTitre, fontWeight: '600', color: couleurs.texte, marginTop: espaces.m },
  erreur: {
    fontSize: texte.petit, color: couleurs.ambre, backgroundColor: couleurs.ambreClair,
    borderRadius: 10, padding: espaces.m,
  },
  bandeau: {
    backgroundColor: couleurs.ambreClair, borderRadius: 12, padding: espaces.m, gap: 2,
  },
  bandeauTitre: { fontSize: texte.petit, fontWeight: '700', color: couleurs.ambre },
  bandeauLigne: { fontSize: texte.minuscule, color: '#6B4A00' },
  carte: {
    backgroundColor: couleurs.surface, borderRadius: 12, padding: espaces.m,
    borderWidth: 1, borderColor: couleurs.bord, gap: 2,
  },
  ligneHaut: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: espaces.s },
  agentNom: { fontSize: texte.corps, fontWeight: '600', color: couleurs.texte, flex: 1 },
  date: { fontSize: texte.minuscule, color: couleurs.texteSecondaire },
  detail: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  remarque: { fontSize: texte.petit, color: couleurs.texte, marginTop: 2 },
  hors: { fontSize: texte.minuscule, color: couleurs.ambre, marginTop: 2 },
  bareme: { flexDirection: 'row', gap: espaces.l, marginTop: espaces.xs },
  note: { alignItems: 'center' },
  noteValeur: { fontSize: texte.sousTitre, fontWeight: '700' },
  noteLettre: { fontSize: texte.minuscule, color: couleurs.texteSecondaire },
  vide: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  pied: { fontSize: texte.minuscule, color: couleurs.texteSecondaire, marginTop: espaces.m },
});
