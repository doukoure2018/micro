import { useCallback, useState } from 'react';
import {
  ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import type { CreditPortefeuille, FicheCredit } from '@/api/types';
import { api, ErreurReseau } from '@/api/client';
import { jetonValide } from '@/auth/session';
import { appeler, ouvrirSurLaCarte, premierNumero } from '@/ui/carte';
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
  const [fiche, setFiche] = useState<FicheCredit | null>(null);
  const [chargeFiche, setChargeFiche] = useState(false);
  const [horsConnexion, setHorsConnexion] = useState(false);
  const [echeancierOuvert, setEcheancierOuvert] = useState(false);

  useFocusEffect(useCallback(() => {
    if (!estOuverte()) return;
    void (async () => {
      const tous = await portefeuilleLocal();
      setCredit(tous.find((c) => c.codAgencia === codAgencia && c.numCredito === numero) ?? null);
    })();
    // L'echeancier, les cautions et la derniere position se lisent EN LIGNE : ils changent
    // sans l'agent, et une copie locale montrerait l'etat d'hier. L'essentiel du credit,
    // lui, vient de la copie locale et s'affiche sans reseau.
    void (async () => {
      setChargeFiche(true);
      try {
        const jeton = await jetonValide();
        if (!jeton) return;
        const data = await api.get<{ fiche: FicheCredit }>(
          `/ecredit/mobile/credits/${codAgencia}/${numero}/fiche`, jeton);
        setFiche(data?.fiche ?? null);
        setHorsConnexion(false);
      } catch (e) {
        setHorsConnexion(e instanceof ErreurReseau);
      } finally {
        setChargeFiche(false);
      }
    })();
  }, [codAgencia, numero]));

  if (!credit) {
    return <View style={s.page}><Text style={s.vide}>Credit introuvable dans la copie locale.</Text></View>;
  }

  // Une fiche porte parfois deux numeros (« 628833094/624380638 ») : on compose le premier.
  const aAppeler = premierNumero(credit.telephone);
  const autreNumero = premierNumero(credit.telephoneAutre);
  // Le second numero ne s'affiche que s'il DIFFERE du premier : les deux champs portent
  // souvent la meme ligne, et proposer deux fois le meme bouton ferait perdre un appel.
  const secondUtile = autreNumero && autreNumero !== aAppeler ? autreNumero : null;
  // Les deux adresses sont souvent la meme chaine dans les dossiers : « FILY » / « FILY ».
  // Repeter la ligne ne dit rien de plus, et fait douter de ce qu'on lit.
  const activite = credit.lieuActivite !== credit.adresseDomicile ? credit.lieuActivite : null;
  const aDesCoordonnees = Boolean(secondUtile || credit.adresseDomicile || activite);

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
                     onPress={() => void appeler(aAppeler)}>
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
            : credit.horsCreditsVivants
              ? 'Credit rembourse ou clos dans SAF : il ne fait plus partie de votre portefeuille, mais il vous reste affecte. Signalez-le a votre directeur d\'agence.'
              : 'Montants indisponibles : la banque n\'a pas pu etre lue'}
        </Text>
      </View>

      {/*
        Ce que SAF ne porte pas. L'agent qui part en tournee a besoin de savoir ou aller et
        quel autre numero essayer ; tout cela vient du dossier de credit dans digi, et tout
        cela est dans la copie locale — donc lisible devant la maison du membre, sans reseau.
      */}
      {aDesCoordonnees ? (
        <View style={s.carte}>
          <Text style={s.produit}>Le membre</Text>
          {secondUtile ? (
            <Pressable accessibilityRole="button"
                       accessibilityLabel={`Appeler l autre numero, ${secondUtile}`}
                       onPress={() => void appeler(secondUtile)}>
              <Text style={s.telephone}>Autre numero · appeler {secondUtile}</Text>
            </Pressable>
          ) : null}
          {/*
            Une adresse s'ecrit sur sa propre ligne, alignee a gauche : « Quartier Hermakono,
            derriere la mosquee » tient rarement au bout d'une ligne, et le meme texte aligne
            a droite sur trois lignes se lit mal.
          */}
          {credit.adresseDomicile ? (
            <View style={s.adresse}>
              <Text style={s.donneeLibelle}>Domicile</Text>
              <Text style={s.adresseTexte}>{credit.adresseDomicile}</Text>
            </View>
          ) : null}
          {activite ? (
            <View style={s.adresse}>
              <Text style={s.donneeLibelle}>Activite</Text>
              <Text style={s.adresseTexte}>{activite}</Text>
            </View>
          ) : null}
          <Text style={s.source}>
            Renseigne dans son dossier de credit, et non par la banque : a verifier sur place.
          </Text>
        </View>
      ) : null}

      {chargeFiche && !fiche ? (
        <View style={s.attente}><ActivityIndicator color={couleurs.vert} /></View>
      ) : null}

      {horsConnexion ? (
        <Text style={s.horsConnexion}>
          Hors connexion : l'echeancier et les cautions ne sont pas affiches.
        </Text>
      ) : null}

      {fiche && fiche.echeancier.length > 0 ? (
        <View style={s.carte}>
          <Pressable accessibilityRole="button"
                     accessibilityState={{ expanded: echeancierOuvert }}
                     onPress={() => setEcheancierOuvert(!echeancierOuvert)}
                     style={s.ligneHaut}>
            <Text style={s.produit}>
              Echeancier · {fiche.echeancier.length} ligne{fiche.echeancier.length > 1 ? 's' : ''}
            </Text>
            <Text style={s.deplier}>{echeancierOuvert ? 'Replier' : 'Voir'}</Text>
          </Pressable>

          {fiche.echeancierIncomplet ? (
            <Text style={s.avertissement}>
              Toutes les lignes sont soldees alors que le credit court encore : aucune echeance
              a venir dans SAF. Ce credit n'apparaitra dans aucune relance.
            </Text>
          ) : null}

          {echeancierOuvert ? fiche.echeancier.map((e, i) => (
            <View key={`${e.numero ?? i}`} style={s.echeance}>
              <Text style={[s.echeanceTexte, { flex: 0.6 }]}>{e.numero ?? i + 1}</Text>
              <Text style={[s.echeanceTexte, { flex: 2 }]}>{dateCourte(e.date)}</Text>
              <Text style={[s.echeanceTexte, { flex: 3, textAlign: 'right' }]}>
                {montant(e.montant)}
              </Text>
              <Text style={[s.echeanceEtat, { flex: 2 },
                            e.payeeLe ? s.echeancePayee : s.echeanceDue]}>
                {e.payeeLe ? `payee ${dateCourte(e.payeeLe)}` : 'due'}
              </Text>
            </View>
          )) : null}
        </View>
      ) : null}

      {fiche && fiche.cautions.length > 0 ? (
        <View style={s.carte}>
          <Text style={s.produit}>Cautions connues de digi</Text>
          <Text style={s.note}>
            Les cautions sont attachees a un DOSSIER, pas a un credit SAF :
            {fiche.cautions.length > 1
              ? ` ce membre en porte ${fiche.cautions.length}, reconnaissez le votre.`
              : ' voici celui de ce membre.'}
          </Text>
          {fiche.cautions.map((d) => (
            <View key={d.demandeindividuelId} style={s.dossier}>
              <Text style={s.dossierTitre}>
                Dossier {d.demandeindividuelId}
                {d.deposeLe ? ` · depose le ${dateCourte(d.deposeLe)}` : ''}
                {d.montantDemande ? ` · ${montant(d.montantDemande)}` : ''}
              </Text>
              <Text style={s.note}>{d.etat}</Text>
              {d.personnes.map((c, i) => (
                <View key={`${d.demandeindividuelId}-${i}`} style={s.caution}>
                  <Text style={s.cautionNom}>
                    {[c.nom, c.prenom].filter((x) => x).join(' ') || 'Caution'}
                    {c.profession ? ` · ${c.profession}` : ''}
                  </Text>
                  {c.telephone ? (
                    <Pressable accessibilityRole="button"
                               accessibilityLabel={`Appeler ${c.nom} au ${c.telephone}`}
                               onPress={() => void appeler(c.telephone)}>
                      <Text style={s.telephone}>Appeler {c.telephone}</Text>
                    </Pressable>
                  ) : null}
                  {c.adresse ? <Text style={s.note}>{c.adresse}</Text> : null}
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : null}

      <View style={s.actions}>
        {/*
          « Itineraire » n'a de sens qu'avec des coordonnees. On n'en a que si une visite a
          releve la position : sinon le bouton n'existe pas, plutot que d'ouvrir une carte sur
          le nom du membre — ce qui ne menait nulle part et faisait echouer l'ouverture.
        */}
        {fiche?.dernierePosition ? (
          <Pressable accessibilityRole="button" style={s.actionSecondaire}
                     onPress={() => void ouvrirSurLaCarte(
                       fiche.dernierePosition!.latitude, fiche.dernierePosition!.longitude,
                       credit.nomClient ?? `Credit ${credit.codAgencia}/${credit.numCredito}`)}>
            <Text style={s.actionSecondaireTexte}>
              Itineraire — position relevee le {dateCourte(fiche.dernierePosition.saisieAt)}
            </Text>
          </Pressable>
        ) : null}
        <Link href={{
          pathname: '/agri',
          params: {
            credit: `${credit.codAgencia}-${credit.numCredito}`,
            membre: credit.codCliente ?? '',
          },
        }} asChild>
          <Pressable accessibilityRole="button" style={s.actionSecondaire}>
            <Text style={s.actionSecondaireTexte}>Collecte agricole de ce membre</Text>
          </Pressable>
        </Link>
        <Link href={{
          pathname: '/reclamations',
          params: {
            credit: `${credit.codAgencia}-${credit.numCredito}`,
            membre: credit.codCliente ?? '',
          },
        }} asChild>
          <Pressable accessibilityRole="button" style={s.actionSecondaire}>
            <Text style={s.actionSecondaireTexte}>Signaler un probleme sur ce credit</Text>
          </Pressable>
        </Link>
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
  attente: { paddingVertical: espaces.m, alignItems: 'center' },
  horsConnexion: { fontSize: texte.petit, color: couleurs.ambre },
  deplier: { fontSize: texte.petit, color: couleurs.vert, fontWeight: '600' },
  avertissement: {
    fontSize: texte.minuscule, color: couleurs.ambre, fontWeight: '600', marginTop: espaces.xs,
  },
  echeance: {
    flexDirection: 'row', alignItems: 'center', gap: espaces.s,
    paddingVertical: 4, borderTopWidth: 1, borderTopColor: couleurs.bord,
  },
  echeanceTexte: { fontSize: texte.minuscule, color: couleurs.texte },
  echeanceEtat: { fontSize: texte.minuscule, textAlign: 'right' },
  echeancePayee: { color: couleurs.vert },
  echeanceDue: { color: couleurs.ambre, fontWeight: '600' },
  note: { fontSize: texte.minuscule, color: couleurs.texteSecondaire },
  dossier: { marginTop: espaces.s, paddingTop: espaces.s, borderTopWidth: 1, borderTopColor: couleurs.bord },
  dossierTitre: { fontSize: texte.petit, fontWeight: '600', color: couleurs.texte },
  caution: { marginTop: espaces.xs },
  cautionNom: { fontSize: texte.petit, color: couleurs.texte },
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
  adresse: { marginTop: espaces.xs },
  adresseTexte: { fontSize: texte.petit, fontWeight: '600', color: couleurs.texte },
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
