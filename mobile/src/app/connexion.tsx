import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import { config, OAUTH } from '@/config';
import { cleDeLaBase, documentDecouverte, ecrireJetons, garderProfil } from '@/auth/session';
import { ouvrir } from '@/db/base';
import { api } from '@/api/client';
import type { Profil } from '@/api/types';
import { enregistrerTacheDeFond } from '@/sync/tacheDeFond';
import { synchroniser } from '@/sync/moteur';
import { CIBLE_MIN, couleurs, espaces, texte } from '@/ui/theme';

/**
 * L'entree dans l'application : code d'autorisation avec PKCE, sur la page du serveur
 * d'autorisation. L'agent tape son mot de passe la-bas, jamais ici.
 */
export default function Connexion() {
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const router = useRouter();

  const [demande, , declencher] = AuthSession.useAuthRequest(
    {
      clientId: OAUTH.clientId,
      scopes: [...OAUTH.scopes],
      redirectUri: OAUTH.redirectUri,
      usePKCE: true,
    },
    documentDecouverte(),
  );

  async function seConnecter() {
    setErreur(null);
    setEnCours(true);
    try {
      const reponse = await declencher();
      if (reponse?.type !== 'success' || !reponse.params.code) {
        setErreur(reponse?.type === 'error' ? 'Connexion refusee' : null);
        return;
      }
      const jetons = await AuthSession.exchangeCodeAsync(
        {
          clientId: OAUTH.clientId,
          code: reponse.params.code,
          redirectUri: OAUTH.redirectUri,
          extraParams: { code_verifier: demande?.codeVerifier ?? '' },
        },
        documentDecouverte(),
      );
      await ecrireJetons({
        acces: jetons.accessToken,
        rafraichissement: jetons.refreshToken ?? null,
        expireA: Date.now() + (jetons.expiresIn ?? 3600) * 1000,
      });
      const data = await api.get<{ profil: Profil }>('/ecredit/mobile/moi', jetons.accessToken);
      if (!data?.profil) {
        setErreur("Ce compte n'a pas acces a l'application mobile");
        return;
      }
      await garderProfil(data.profil);
      await ouvrir(data.profil.userId, await cleDeLaBase());
      void enregistrerTacheDeFond();
      void synchroniser();
      router.replace('/');
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Connexion impossible');
    } finally {
      setEnCours(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={s.page}>
      <View style={s.entete}>
        <View style={s.logo}><Text style={s.logoTexte}>CRG</Text></View>
        <Text style={s.titre}>DIGI-CRG</Text>
        <Text style={s.sousTitre}>Credit Rural de Guinee{'\n'}agents de credit et directeurs d'agence</Text>
      </View>

      <View style={s.carte}>
        <Text style={s.carteTitre}>Connectez-vous avec votre compte digi</Text>
        <Text style={s.carteTexte}>
          Le meme identifiant et le meme mot de passe que sur l'ordinateur. La page de
          connexion securisee s'ouvre dans le navigateur du telephone.
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={!demande || enCours}
          onPress={seConnecter}
          style={({ pressed }) => [s.bouton, (pressed || enCours) && s.boutonAppuye]}
        >
          {enCours
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={s.boutonTexte}>Se connecter</Text>}
        </Pressable>
        <Text style={s.note}>
          Aucun mot de passe n'est enregistre sur le telephone. La session reste ouverte 30 jours.
        </Text>
      </View>

      {erreur ? <Text style={s.erreur}>{erreur}</Text> : null}

      <View style={s.encart}>
        <Text style={s.encartTexte}>
          Apres la premiere connexion, l'application fonctionne sans reseau : vos saisies sont
          gardees sur le telephone et transmises des qu'une connexion revient.
        </Text>
      </View>

      {!config.estProduction ? (
        <Text style={s.environnement}>environnement de test</Text>
      ) : null}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: espaces.xl, paddingTop: 72, backgroundColor: couleurs.fond, flexGrow: 1 },
  entete: { marginBottom: espaces.xxl },
  logo: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: couleurs.vert,
    alignItems: 'center', justifyContent: 'center',
  },
  logoTexte: { color: '#FFFFFF', fontWeight: '800', fontSize: 18 },
  titre: { fontSize: 30, fontWeight: '700', color: couleurs.texte, marginTop: espaces.m },
  sousTitre: { fontSize: 16, color: couleurs.texteSecondaire, marginTop: espaces.s, lineHeight: 22 },
  carte: {
    backgroundColor: couleurs.surface, borderRadius: 16, padding: espaces.xl,
    borderWidth: 1, borderColor: couleurs.bord, gap: espaces.m,
  },
  carteTitre: { fontSize: texte.sousTitre + 3, fontWeight: '600', color: couleurs.texte },
  carteTexte: { fontSize: texte.corps, color: '#3D4B44', lineHeight: 21 },
  bouton: {
    minHeight: 52, borderRadius: 12, backgroundColor: couleurs.vert,
    alignItems: 'center', justifyContent: 'center',
  },
  boutonAppuye: { opacity: 0.85 },
  boutonTexte: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  note: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  erreur: {
    marginTop: espaces.l, color: couleurs.rouge, fontSize: texte.corps,
    backgroundColor: couleurs.rougeClair, padding: espaces.m, borderRadius: 10,
  },
  encart: {
    marginTop: espaces.l, backgroundColor: couleurs.vertClair, borderRadius: 14, padding: espaces.l,
  },
  encartTexte: { fontSize: texte.petit, color: couleurs.texte, lineHeight: 20 },
  environnement: {
    marginTop: espaces.xl, alignSelf: 'flex-start', fontSize: texte.minuscule,
    color: couleurs.ambre, backgroundColor: couleurs.ambreClair,
    paddingHorizontal: espaces.m, paddingVertical: espaces.xs, borderRadius: 8, overflow: 'hidden',
  },
  cibleMin: { minHeight: CIBLE_MIN },
});
