import { useCallback, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import type { CreditPortefeuille } from '@/api/types';
import { portefeuilleLocal } from '@/db/visites';
import { estOuverte } from '@/db/base';
import { couleurRetard, couleurs, dateCourte, espaces, heureCourte, montant, texte } from '@/ui/theme';

/** La fiche d'un credit, lue dans la copie locale, avec l'acces a la saisie d'une visite. */
export default function FicheCredit() {
  const { cle } = useLocalSearchParams<{ cle: string }>();
  const morceaux = (cle ?? '').split('-');
  const codAgencia = morceaux[0] ?? '';
  const numero = Number(morceaux[1] ?? '0');
  const [credit, setCredit] = useState<CreditPortefeuille | null>(null);

  useFocusEffect(useCallback(() => {
    if (!estOuverte()) return;
    void (async () => {
      const tous = await portefeuilleLocal();
      setCredit(tous.find((c) => c.codAgencia === codAgencia && c.numCredito === numero) ?? null);
    })();
  }, [codAgencia, numero]));

  if (!credit) {
    return <View style={s.page}><Text style={s.vide}>Credit introuvable dans la copie locale.</Text></View>;
  }

  // Une fiche porte parfois deux numeros (« 628833094/624380638 ») : on compose le premier.
  const aAppeler = premierNumero(credit.telephone);

  return (
    <ScrollView style={{ backgroundColor: couleurs.fond }} contentContainerStyle={s.page}>
      <View style={s.entete}>
        <Text style={s.nom}>
          {credit.nomClient ?? (credit.codCliente ? `Membre ${credit.codCliente}` : 'Membre inconnu')}
        </Text>
        <Text style={s.reference}>
          {credit.nomClient && credit.codCliente ? `Membre ${credit.codCliente} · ` : ''}
          credit {credit.codAgencia}/{credit.numCredito}
        </Text>
        {aAppeler ? (
          <Pressable accessibilityRole="button"
                     accessibilityLabel={`Appeler le ${aAppeler}`}
                     onPress={() => void Linking.openURL(`tel:${aAppeler}`)}>
            <Text style={s.telephone}>Appeler {credit.telephone}</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={s.carte}>
        <View style={s.ligneHaut}>
          <Text style={s.produit}>{credit.produit ?? 'Produit inconnu'}</Text>
          {credit.joursRetard && credit.joursRetard > 0 ? (
            <Text style={[s.retard, { color: couleurRetard(credit.joursRetard) }]}>
              Impaye {credit.joursRetard} j
            </Text>
          ) : null}
        </View>
        <Donnee libelle="Encours" valeur={montant(credit.encours)} />
        <Donnee libelle="Impaye" valeur={montant(credit.montantImpaye)}
                couleur={credit.montantImpaye ? couleurs.rouge : undefined} />
        <Donnee libelle="Prochaine echeance"
                valeur={`${dateCourte(credit.prochaineEcheance)} · ${montant(credit.prochaineEcheanceMontant)}`} />
        {credit.promesseDate ? (
          <Donnee libelle="Promesse"
                  valeur={`${montant(credit.promesseMontant)} le ${dateCourte(credit.promesseDate)}`}
                  couleur={couleurs.bleu} />
        ) : null}
        {credit.derniereAppreciation ? (
          <Donnee libelle="Derniere appreciation"
                  valeur={`${credit.derniereAppreciation} · visite du ${dateCourte(credit.derniereVisiteAt)}`} />
        ) : null}
        {/* Dater les chiffres, toujours : un montant sans date se prend pour celui de l'instant. */}
        <Text style={s.source}>
          {credit.montantsAt
            ? `Montants SAF du ${dateCourte(credit.montantsAt)} a ${heureCourte(credit.montantsAt)}`
            : 'Montants indisponibles : la banque n\'a pas pu etre lue'}
        </Text>
      </View>

      <View style={s.actions}>
        <Pressable accessibilityRole="button" style={s.actionSecondaire}
                   onPress={() => void Linking.openURL(`geo:0,0?q=${encodeURIComponent(credit.nomClient ?? '')}`)}>
          <Text style={s.actionSecondaireTexte}>Itineraire</Text>
        </Pressable>
        <Link href={{ pathname: '/visite/[cle]', params: { cle: `${credit.codAgencia}-${credit.numCredito}` } }}
              asChild>
          <Pressable accessibilityRole="button" style={s.action}>
            <Text style={s.actionTexte}>Enregistrer une visite</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

function premierNumero(telephone: string | null): string {
  const numeros = (telephone ?? '').split(/[^0-9+]+/).filter((n) => n.length >= 6);
  return numeros[0] ?? '';
}

function Donnee({ libelle, valeur, couleur }:
  { libelle: string; valeur: string; couleur?: string }) {
  return (
    <View style={s.donnee}>
      <Text style={s.donneeLibelle}>{libelle}</Text>
      <Text style={[s.donneeValeur, couleur ? { color: couleur } : null]}>{valeur}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  page: { padding: espaces.l, gap: espaces.m, paddingBottom: espaces.xxl },
  entete: { gap: 2 },
  nom: { fontSize: texte.titre - 2, fontWeight: '600', color: couleurs.texte },
  reference: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  telephone: { fontSize: texte.petit, color: couleurs.vert, fontWeight: '600', marginTop: espaces.xs },
  source: {
    fontSize: texte.minuscule, color: couleurs.texteSecondaire,
    marginTop: espaces.xs, fontStyle: 'italic',
  },
  carte: {
    backgroundColor: couleurs.surface, borderRadius: 14, padding: espaces.l,
    borderWidth: 1, borderColor: couleurs.bord, gap: espaces.s,
  },
  ligneHaut: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  produit: { fontSize: texte.corps, fontWeight: '600', color: couleurs.texte },
  retard: { fontSize: texte.minuscule, fontWeight: '700' },
  donnee: { flexDirection: 'row', justifyContent: 'space-between', gap: espaces.m },
  donneeLibelle: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  donneeValeur: { fontSize: texte.petit, fontWeight: '600', color: couleurs.texte, flexShrink: 1, textAlign: 'right' },
  actions: { gap: espaces.s },
  action: {
    minHeight: 52, borderRadius: 12, backgroundColor: couleurs.vert,
    alignItems: 'center', justifyContent: 'center',
  },
  actionTexte: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  actionSecondaire: {
    minHeight: 48, borderRadius: 10, borderWidth: 1, borderColor: couleurs.bord,
    backgroundColor: couleurs.surface, alignItems: 'center', justifyContent: 'center',
  },
  actionSecondaireTexte: { fontSize: texte.petit, color: couleurs.vert, fontWeight: '600' },
  vide: { fontSize: texte.corps, color: couleurs.texteSecondaire },
});
