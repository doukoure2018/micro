import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';
import { cleDeLaBase, jetonValide, profilGarde } from '@/auth/session';
import { ouvrir } from '@/db/base';
import { enregistrerTacheDeFond } from '@/sync/tacheDeFond';
import { declarerLAppareil } from '@/sync/notifications';
import { memoriserLeJetonDeLAppareil } from '@/sync/appareil';
import { synchroniser } from '@/sync/moteur';
import { couleurs } from '@/ui/theme';

/**
 * L'ossature de l'application : ouvre la base locale, place l'agent sur le bon ecran, et
 * declenche une synchronisation au retour du reseau comme au retour au premier plan.
 *
 * <p>Trois chemins mènent a la meme transmission — le reveil du systeme, le retour du
 * reseau, l'ouverture de l'application — parce qu'aucun des trois ne se promet lui-meme.</p>
 */
export default function Ossature() {
  const [pret, setPret] = useState(false);
  const [connecte, setConnecte] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const profil = await profilGarde();
      const jeton = await jetonValide();
      if (profil) {
        // La base s'ouvre meme sans jeton valable : hors connexion, l'agent doit retrouver
        // son portefeuille et pouvoir saisir.
        await ouvrir(profil.userId, await cleDeLaBase());
        setConnecte(true);
        if (jeton) {
          void enregistrerTacheDeFond();
          // Le telephone se declare AVANT la premiere synchronisation : le serveur saura a
          // quel appareil annoncer ce qui est parti tout seul.
          memoriserLeJetonDeLAppareil(await declarerLAppareil());
          void synchroniser();
        }
      }
      setPret(true);
    })();
  }, []);

  useEffect(() => {
    if (!pret) return;
    const surEcranDeConnexion = segments[0] === 'connexion';
    if (!connecte && !surEcranDeConnexion) {
      router.replace('/connexion');
    } else if (connecte && surEcranDeConnexion) {
      router.replace('/');
    }
  }, [pret, connecte, segments, router]);

  useEffect(() => {
    if (!connecte) return;
    const surReseau = NetInfo.addEventListener((etat) => {
      if (etat.isConnected) void synchroniser();
    });
    const surPremierPlan = AppState.addEventListener('change', (etat) => {
      if (etat === 'active') void synchroniser();
    });
    return () => {
      surReseau();
      surPremierPlan.remove();
    };
  }, [connecte]);

  // Tant que la base n'est pas ouverte, aucun ecran ne monte : un ecran qui lit avant
  // l'ouverture echoue sans rien afficher, et l'agent ne voit qu'une page vide.
  if (!pret) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',
                       backgroundColor: couleurs.fond }}>
          <ActivityIndicator color={couleurs.vert} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: couleurs.vert },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: couleurs.fond },
      }}>
        <Stack.Screen name="index" options={{ title: "Aujourd'hui" }} />
        <Stack.Screen name="connexion" options={{ headerShown: false }} />
        <Stack.Screen name="portefeuille" options={{ title: 'Mon portefeuille' }} />
        <Stack.Screen name="credit/[cle]" options={{ title: 'Credit' }} />
        <Stack.Screen name="visite/[cle]" options={{ title: 'Visite de recouvrement' }} />
        <Stack.Screen name="synchronisation" options={{ title: 'Synchronisation' }} />
        <Stack.Screen name="equipe" options={{ title: 'Mon equipe' }} />
        <Stack.Screen name="dossiers" options={{ title: 'Mes dossiers' }} />
        <Stack.Screen name="reclamations" options={{ title: 'Reclamations' }} />
        <Stack.Screen name="agri/index" options={{ title: 'Collecte agricole' }} />
        <Stack.Screen name="agri/[cle]" options={{ title: 'Parcelle' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
