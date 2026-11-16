import { useCallback, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  // Plusieurs types a la fois : « agricole ET maraichage » est une tournee, pas deux.
  const [typesChoisis, setTypesChoisis] = useState<string[]>([]);
  const [choixOuvert, setChoixOuvert] = useState(false);

  useFocusEffect(useCallback(() => {
    if (!estOuverte()) return;
    void (async () => setCredits(await portefeuilleLocal()))();
  }, []));

  // Le portefeuille, c'est ce que SAF porte ; les affectations dont SAF n'a plus le credit
  // vivent dans leur propre onglet, visibles mais hors des comptes.
  const tousVivants = useMemo(() => credits.filter((c) => !c.horsCreditsVivants), [credits]);
  const duType = (c: CreditPortefeuille) =>
    typesChoisis.length === 0 || (c.produit !== null && typesChoisis.includes(c.produit));
  // Le type s'applique AVANT les onglets : « Retard · 12 » doit compter les retards DU TYPE
  // choisi, sinon le chiffre de l'onglet et la liste en dessous ne parlent pas du meme chose.
  const portefeuille = useMemo(() => tousVivants.filter(duType), [tousVivants, typesChoisis]);
  const clos = useMemo(() => credits.filter((c) => c.horsCreditsVivants && duType(c)), [credits, typesChoisis]);
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
    const parType = new Map<string, { n: number; retard: number; encours: number }>();
    for (const c of tousVivants) {
      if (!c.produit) continue;
      const t = parType.get(c.produit) ?? { n: 0, retard: 0, encours: 0 };
      t.n += 1;
      if ((c.joursRetard ?? 0) > 0) t.retard += 1;
      t.encours += c.encours ?? 0;
      parType.set(c.produit, t);
    }
    return [...parType.entries()]
      .map(([type, t]) => ({ type, ...t }))
      .sort((a, b) => b.n - a.n || a.type.localeCompare(b.type));
  }, [tousVivants]);

  /**
   * Une recherche porte sur TOUT le portefeuille, quel que soit l'onglet ouvert. L'agent qui
   * tape le nom d'un societaire le cherche, pas « dans les retards » : ne rien lui rendre
   * parce que ce membre est a jour serait lui dire qu'il n'existe pas.
   */
  const visibles = useMemo(() => {
    // La recherche ignore l'onglet mais respecte le type : chercher « Camara » dans ses
    // credits agricoles est une question precise, l'ecran y repond precisement.
    if (cherche) {
      const q = cleDeRecherche(recherche);
      return credits.filter((c) => duType(c) && cleDeRecherche(aChercher(c)).includes(q));
    }
    if (filtre === 'RETARD') return enRetard;
    if (filtre === 'ECHEANCE') return aEcheance;
    if (filtre === 'SANS_ECHEANCE') return sansEcheance;
    if (filtre === 'CLOS') return clos;
    return portefeuille;
  }, [cherche, filtre, recherche, typesChoisis, credits, portefeuille, clos, enRetard, aEcheance, sansEcheance]);

  function basculerType(type: string) {
    setTypesChoisis((avant) =>
      avant.includes(type) ? avant.filter((t) => t !== type) : [...avant, type]);
  }

  const resumeTypes = typesChoisis.length === 0
    ? 'Tous les types'
    : typesChoisis.length === 1
      ? libelleType(typesChoisis[0] ?? '')
      : `${typesChoisis.length} types`;

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
        <View style={s.typeLigne}>
          <Pressable accessibilityRole="button" onPress={() => setChoixOuvert(true)}
                     style={[s.typeBouton, typesChoisis.length > 0 && s.typeBoutonActif]}>
            <Ionicons name="filter-outline" size={16}
                      color={typesChoisis.length > 0 ? '#FFFFFF' : couleurs.vert} />
            <Text style={[s.typeBoutonTexte, typesChoisis.length > 0 && s.typeBoutonTexteActif]}
                  numberOfLines={1}>
              {resumeTypes}
            </Text>
            <Ionicons name="chevron-down" size={16}
                      color={typesChoisis.length > 0 ? '#FFFFFF' : couleurs.vert} />
          </Pressable>
          {typesChoisis.length > 0 ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Retirer le filtre de type"
                       onPress={() => setTypesChoisis([])} style={s.typeEffacer}>
              <Ionicons name="close" size={18} color={couleurs.texteSecondaire} />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <Modal visible={choixOuvert} transparent animationType="slide"
             onRequestClose={() => setChoixOuvert(false)}>
        <Pressable style={s.voile} onPress={() => setChoixOuvert(false)} />
        <View style={s.feuille}>
          <View style={s.feuilleEntete}>
            <Text style={s.feuilleTitre}>Types de credit</Text>
            <Text style={s.feuilleAide}>Plusieurs choix possibles</Text>
          </View>
          {typesCredit.map((t) => {
            const choisi = typesChoisis.includes(t.type);
            return (
              <Pressable key={t.type} accessibilityRole="checkbox"
                         accessibilityState={{ checked: choisi }}
                         onPress={() => basculerType(t.type)} style={s.typeOption}>
                <Ionicons name={choisi ? 'checkbox' : 'square-outline'} size={24}
                          color={choisi ? couleurs.vert : couleurs.texteSecondaire} />
                <View style={{ flex: 1 }}>
                  <Text style={s.typeOptionNom}>{libelleType(t.type)}</Text>
                  <Text style={s.typeOptionDetail}>
                    {t.n} credit{t.n > 1 ? 's' : ''}
                    {t.retard > 0 ? ` · ${t.retard} en retard` : ''}
                    {t.encours > 0 ? ` · ${montant(t.encours)}` : ''}
                  </Text>
                </View>
                {t.retard > 0 ? (
                  <Text style={[s.typeOptionRetard, { color: couleurRetard(30) }]}>
                    {Math.round((t.retard / t.n) * 100)} %
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
          <View style={s.feuillePied}>
            <Pressable accessibilityRole="button" onPress={() => setTypesChoisis([])}
                       style={s.feuilleSecondaire}>
              <Text style={s.feuilleSecondaireTexte}>Tout effacer</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => setChoixOuvert(false)}
                       style={s.feuillePrincipal}>
              <Text style={s.feuillePrincipalTexte}>
                Voir {portefeuille.length} credit{portefeuille.length > 1 ? 's' : ''}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
            {typesChoisis.length > 0 && !cherche
              ? `Aucun credit de ce type dans cette vue (${resumeTypes}).`
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
  typeLigne: { flexDirection: 'row', alignItems: 'center', gap: espaces.s },
  typeBouton: {
    flexDirection: 'row', alignItems: 'center', gap: espaces.s, minHeight: 40,
    paddingHorizontal: espaces.m, borderRadius: 20, borderWidth: 1, borderColor: couleurs.bord,
    backgroundColor: couleurs.surface, flexShrink: 1,
  },
  typeBoutonActif: { backgroundColor: couleurs.vert, borderColor: couleurs.vert },
  typeBoutonTexte: { fontSize: texte.petit, color: couleurs.vert, fontWeight: '600', flexShrink: 1 },
  typeBoutonTexteActif: { color: '#FFFFFF' },
  typeEffacer: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  voile: { flex: 1, backgroundColor: 'rgba(21, 32, 27, 0.45)' },
  feuille: {
    backgroundColor: couleurs.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: espaces.l, paddingBottom: espaces.xxl, gap: espaces.xs,
  },
  feuilleEntete: { marginBottom: espaces.s },
  feuilleTitre: { fontSize: texte.sousTitre, fontWeight: '600', color: couleurs.texte },
  feuilleAide: { fontSize: texte.minuscule, color: couleurs.texteSecondaire },
  typeOption: {
    flexDirection: 'row', alignItems: 'center', gap: espaces.m, minHeight: 56,
    paddingVertical: espaces.xs, borderBottomWidth: 1, borderBottomColor: couleurs.bord,
  },
  typeOptionNom: { fontSize: texte.corps, fontWeight: '600', color: couleurs.texte },
  typeOptionDetail: { fontSize: texte.minuscule, color: couleurs.texteSecondaire, marginTop: 1 },
  typeOptionRetard: { fontSize: texte.petit, fontWeight: '700' },
  feuillePied: { flexDirection: 'row', gap: espaces.s, marginTop: espaces.m },
  feuilleSecondaire: {
    flex: 1, minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: couleurs.bord,
    alignItems: 'center', justifyContent: 'center',
  },
  feuilleSecondaireTexte: { fontSize: texte.petit, color: couleurs.texte, fontWeight: '600' },
  feuillePrincipal: {
    flex: 1.4, minHeight: 48, borderRadius: 12, backgroundColor: couleurs.vert,
    alignItems: 'center', justifyContent: 'center',
  },
  feuillePrincipalTexte: { fontSize: texte.petit, color: '#FFFFFF', fontWeight: '600' },
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
