import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import type { CreditPortefeuille } from '@/api/types';
import { portefeuilleLocal } from '@/db/visites';
import { estOuverte } from '@/db/base';
import { cleDeRecherche, couleurRetard, couleurs, espaces, montant, texte } from '@/ui/theme';

type Filtre = 'RETARD' | 'ECHEANCE' | 'SANS_ECHEANCE' | 'TOUS' | 'CLOS';

/** Le portefeuille de l'agent, lu dans la copie locale : il s'ouvre sans reseau. */
export default function Portefeuille() {
  const [credits, setCredits] = useState<CreditPortefeuille[]>([]);
  const [filtre, setFiltre] = useState<Filtre>('RETARD');
  const [recherche, setRecherche] = useState('');
  const [typeCredit, setTypeCredit] = useState<string | null>(null);

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
  /**
   * Ni en retard, ni d'echeance connue. Ces credits existent : leur echeancier est solde
   * ligne a ligne alors qu'un solde subsiste, ou SAF n'en porte qu'une partie. Ils echappent
   * donc a TOUTE relance fondee sur l'echeancier — raison de plus pour qu'ils se voient.
   */
  const sansEcheance = useMemo(
    () => portefeuille.filter((c) => (c.joursRetard ?? 0) <= 0 && !c.prochaineEcheance),
    [portefeuille]);

  const cherche = recherche.trim().length > 0;

  /**
   * Les types de credit presents dans le portefeuille, du plus porte au moins porte. La
   * liste vient des donnees, pas d'un referentiel : un type que l'agent ne porte pas n'a
   * rien a faire dans ses filtres.
   */
  const typesCredit = useMemo(() => {
    const compte = new Map<string, number>();
    for (const c of portefeuille) {
      if (c.produit) compte.set(c.produit, (compte.get(c.produit) ?? 0) + 1);
    }
    return [...compte.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [portefeuille]);

  /**
   * Une recherche porte sur TOUT le portefeuille, quel que soit l'onglet ouvert. L'agent qui
   * tape le nom d'un societaire le cherche, pas « dans les retards » : ne rien lui rendre
   * parce que ce membre est a jour serait lui dire qu'il n'existe pas.
   */
  const visibles = useMemo(() => {
    // Le type de credit s'applique PAR-DESSUS l'onglet et la recherche : « mes credits
    // agricoles en retard » est une question que l'agent se pose vraiment.
    const parType = (liste: CreditPortefeuille[]) =>
      typeCredit ? liste.filter((c) => c.produit === typeCredit) : liste;
    if (cherche) {
      const q = cleDeRecherche(recherche);
      return parType(credits.filter((c) => cleDeRecherche(aChercher(c)).includes(q)));
    }
    if (filtre === 'RETARD') return parType(enRetard);
    if (filtre === 'ECHEANCE') return parType(aEcheance);
    if (filtre === 'SANS_ECHEANCE') return parType(sansEcheance);
    if (filtre === 'CLOS') return parType(clos);
    return parType(portefeuille);
  }, [cherche, filtre, recherche, typeCredit, credits, portefeuille, clos, enRetard, aEcheance, sansEcheance]);

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

      {typesCredit.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={s.types} keyboardShouldPersistTaps="handled">
          <Puce actif={typeCredit === null} libelle={`Tous les types · ${portefeuille.length}`}
                surAppui={() => setTypeCredit(null)} />
          {typesCredit.map(([type, n]) => (
            <Puce key={type} actif={typeCredit === type} libelle={`${libelleType(type)} · ${n}`}
                  surAppui={() => setTypeCredit(typeCredit === type ? null : type)} />
          ))}
        </ScrollView>
      ) : null}

      {/*
        Le total doit se retrouver dans ses parties. « Retard » et « A venir » ne couvrent pas
        tout : cette ligne montre le reste plutot que de laisser un ecart inexplique.
      */}
      {!cherche && sansEcheance.length > 0 ? (
        <Pressable accessibilityRole="button"
                   accessibilityState={{ selected: filtre === 'SANS_ECHEANCE' }}
                   onPress={() => setFiltre(filtre === 'SANS_ECHEANCE' ? 'TOUS' : 'SANS_ECHEANCE')}
                   style={[s.reste, filtre === 'SANS_ECHEANCE' && s.resteActif]}>
          <Text style={s.resteTexte}>
            {sansEcheance.length === 1
              ? '1 credit sans echeance connue dans SAF'
              : `${sansEcheance.length} credits sans echeance connue dans SAF`}
          </Text>
        </Pressable>
      ) : null}

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
            {typeCredit && !cherche
              ? `Aucun credit de type « ${libelleType(typeCredit)} » dans cette vue.`
              : cherche
              ? `Aucun societaire ne correspond a « ${recherche.trim()} » dans votre portefeuille.`
              : filtre === 'CLOS'
                ? 'Aucune affectation a fermer.'
                : filtre === 'SANS_ECHEANCE'
                  ? 'Tous vos credits portent une echeance.'
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
                  {[c.produit ? libelleType(c.produit) : null,
                    c.encours === null ? null : montant(c.encours)]
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

/**
 * Le libelle SAF d'un type de credit, rendu lisible : « CREDIT COMMERCIALE SOLIDAIRE » devient
 * « Commerciale solidaire ». Le mot « credit » est retire, il est partout.
 */
function libelleType(type: string): string {
  const mots = type.replace(/^CREDIT\s+/i, '').toLowerCase().trim();
  return mots.charAt(0).toUpperCase() + mots.slice(1);
}

function Puce({ actif, libelle, surAppui }:
  { actif: boolean; libelle: string; surAppui: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: actif }}
               onPress={surAppui} style={[s.puce, actif && s.puceActive]}>
      <Text style={[s.puceTexte, actif && s.puceTexteActif]} numberOfLines={1}>{libelle}</Text>
    </Pressable>
  );
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
  types: { gap: espaces.s, paddingVertical: 2 },
  puce: {
    minHeight: 36, paddingHorizontal: espaces.m, justifyContent: 'center', borderRadius: 18,
    borderWidth: 1, borderColor: couleurs.bord, backgroundColor: couleurs.surface,
  },
  puceActive: { backgroundColor: couleurs.vert, borderColor: couleurs.vert },
  puceTexte: { fontSize: texte.minuscule, color: couleurs.texte },
  puceTexteActif: { color: '#FFFFFF', fontWeight: '600' },
  reste: {
    backgroundColor: couleurs.ambreClair, borderRadius: 10, paddingHorizontal: espaces.m,
    minHeight: 40, justifyContent: 'center', borderWidth: 1, borderColor: couleurs.ambreClair,
  },
  resteActif: { borderColor: couleurs.ambre },
  resteTexte: { fontSize: texte.minuscule, color: couleurs.ambre, fontWeight: '600' },
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
