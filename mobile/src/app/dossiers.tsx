import { useCallback, useMemo, useState } from 'react';
import {
  Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import type { DossierVue } from '@/api/types';
import { dossiersLocaux } from '@/db/visites';
import { estOuverte } from '@/db/base';
import { synchroniser } from '@/sync/moteur';
import { cleDeRecherche, couleurs, dateCourte, espaces, montant, texte } from '@/ui/theme';

/** La couleur d'une etape : ce que l'agent doit faire se voit avant ce qu'il attend. */
const COULEURS: Record<DossierVue['etape'], string> = {
  RECEPTION: couleurs.texteSecondaire,
  ANALYSE: couleurs.bleu,
  CORRECTION: couleurs.rouge,
  APPROBATION: couleurs.ambre,
  ANNULATION: couleurs.ambre,
  APPROUVE: couleurs.vert,
  REJETE: couleurs.rouge,
};

/**
 * Les dossiers de credit de l'agent, et ou chacun en est.
 *
 * <p>Lu dans la copie locale : l'ecran s'ouvre sans reseau, comme le portefeuille. Les
 * libelles d'etat viennent du SERVEUR et sont ceux du web — le telephone et le poste du
 * directeur doivent dire la meme chose d'un meme dossier.</p>
 */
export default function Dossiers() {
  const [clotures, setClotures] = useState(false);
  const [dossiers, setDossiers] = useState<DossierVue[]>([]);
  const [recherche, setRecherche] = useState('');
  const [rafraichit, setRafraichit] = useState(false);

  const charger = useCallback(async () => {
    if (!estOuverte()) return;
    setDossiers(await dossiersLocaux(clotures));
  }, [clotures]);

  useFocusEffect(useCallback(() => { void charger(); }, [charger]));

  const surRafraichir = useCallback(async () => {
    setRafraichit(true);
    await synchroniser({ force: true });
    await charger();
    setRafraichit(false);
  }, [charger]);

  const aFaire = useMemo(() => dossiers.filter((d) => d.attendLAgent), [dossiers]);

  const visibles = useMemo(() => {
    const q = cleDeRecherche(recherche);
    if (!q) return dossiers;
    return dossiers.filter((d) => cleDeRecherche(
      [d.nom, d.prenom, d.numeroMembre, String(d.id)].filter((x) => x).join(' ')).includes(q));
  }, [dossiers, recherche]);

  return (
    <ScrollView
      style={{ backgroundColor: couleurs.fond }}
      contentContainerStyle={s.page}
      refreshControl={<RefreshControl refreshing={rafraichit} onRefresh={surRafraichir} />}
    >
      <View style={s.filtres}>
        <Onglet actif={!clotures} libelle="En cours" surAppui={() => setClotures(false)} />
        <Onglet actif={clotures} libelle="Clotures" surAppui={() => setClotures(true)} />
      </View>

      {!clotures && aFaire.length > 0 ? (
        <View style={s.bandeau}>
          <Text style={s.bandeauTexte}>
            {aFaire.length === 1
              ? '1 dossier vous attend'
              : `${aFaire.length} dossiers vous attendent`}
            {' — a analyser ou a corriger.'}
          </Text>
        </View>
      ) : null}

      <TextInput
        style={s.recherche}
        placeholder="Nom du demandeur, membre ou numero de dossier"
        placeholderTextColor={couleurs.texteSecondaire}
        value={recherche}
        onChangeText={setRecherche}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        accessibilityLabel="Rechercher un dossier"
      />

      {visibles.length === 0 ? (
        <Text style={s.vide}>
          {recherche.trim()
            ? `Aucun dossier ne correspond a « ${recherche.trim()} ».`
            : clotures
              ? 'Aucun dossier cloture.'
              : 'Aucun dossier en cours. Tirez vers le bas pour rafraichir.'}
        </Text>
      ) : visibles.map((d) => (
        <View key={d.id} style={[s.carte, d.attendLAgent && s.carteAFaire]}>
          <View style={s.ligneHaut}>
            <Text style={s.nom} numberOfLines={1}>
              {[d.nom, d.prenom].filter((x) => x).join(' ') || `Dossier ${d.id}`}
            </Text>
            <Text style={[s.etape, { color: COULEURS[d.etape] ?? couleurs.texteSecondaire }]}>
              {d.libelleEtat}
            </Text>
          </View>
          <Text style={s.detail}>
            Dossier {d.id}
            {d.numeroMembre ? ` · membre ${d.numeroMembre}` : ''}
            {d.objetCredit ? ` · ${d.objetCredit}` : ''}
          </Text>
          <Text style={s.detail}>
            {montant(d.montantPropose ?? d.montantDemande)}
            {d.montantPropose && d.montantDemande && d.montantPropose !== d.montantDemande
              ? ` (demande ${montant(d.montantDemande)})`
              : ''}
            {d.createdAt ? ` · depose le ${dateCourte(d.createdAt)}` : ''}
          </Text>
          {d.joursDansLEtape > 0 ? (
            <Text style={[s.attente, d.joursDansLEtape >= 15 && s.attenteLongue]}>
              Sans mouvement depuis {d.joursDansLEtape} jour{d.joursDansLEtape > 1 ? 's' : ''}
            </Text>
          ) : null}
          {d.aCorriger ? <Text style={s.corriger}>A corriger : {d.aCorriger}</Text> : null}
          {d.motifRenvoi ? <Text style={s.corriger}>Motif du renvoi : {d.motifRenvoi}</Text> : null}
          {d.telephone ? (
            <Pressable accessibilityRole="button"
                       accessibilityLabel={`Appeler le ${d.telephone}`}
                       onPress={() => void Linking.openURL(`tel:${premierNumero(d.telephone)}`)}>
              <Text style={s.telephone}>Appeler {d.telephone}</Text>
            </Pressable>
          ) : null}
        </View>
      ))}

      <Text style={s.pied}>
        Les decisions se prennent sur le poste de travail. Ici, vous suivez.
      </Text>
    </ScrollView>
  );
}

function premierNumero(telephone: string | null): string {
  const numeros = (telephone ?? '').split(/[^0-9+]+/).filter((n) => n.length >= 6);
  return numeros[0] ?? '';
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
  page: { padding: espaces.l, gap: espaces.s, paddingBottom: espaces.xxl },
  filtres: { flexDirection: 'row', backgroundColor: '#E4E8E1', borderRadius: 10, padding: 3, gap: 3 },
  onglet: { flex: 1, minHeight: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  ongletActif: { backgroundColor: couleurs.surface },
  ongletTexte: { fontSize: texte.petit, color: '#3D4B44' },
  ongletTexteActif: { fontWeight: '600', color: couleurs.texte },
  bandeau: { backgroundColor: couleurs.bleuClair, borderRadius: 10, padding: espaces.m },
  bandeauTexte: { fontSize: texte.petit, color: couleurs.bleu, fontWeight: '600' },
  recherche: {
    minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: couleurs.bord,
    backgroundColor: couleurs.surface, paddingHorizontal: espaces.m,
    fontSize: texte.corps, color: couleurs.texte,
  },
  carte: {
    backgroundColor: couleurs.surface, borderRadius: 12, padding: espaces.m,
    borderWidth: 1, borderColor: couleurs.bord, gap: 2,
  },
  carteAFaire: { borderColor: couleurs.bleu },
  ligneHaut: { flexDirection: 'row', justifyContent: 'space-between', gap: espaces.s },
  nom: { fontSize: texte.corps, fontWeight: '600', color: couleurs.texte, flex: 1 },
  etape: { fontSize: texte.minuscule, fontWeight: '700', flexShrink: 1, textAlign: 'right' },
  detail: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  attente: { fontSize: texte.minuscule, color: couleurs.texteSecondaire, marginTop: 2 },
  attenteLongue: { color: couleurs.ambre, fontWeight: '600' },
  corriger: { fontSize: texte.petit, color: couleurs.rouge, marginTop: 2 },
  telephone: { fontSize: texte.petit, color: couleurs.vert, fontWeight: '600', marginTop: espaces.xs },
  vide: { fontSize: texte.petit, color: couleurs.texteSecondaire, padding: espaces.m },
  pied: { fontSize: texte.minuscule, color: couleurs.texteSecondaire, marginTop: espaces.m },
});
