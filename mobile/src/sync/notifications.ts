import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from '@/api/client';
import { jetonValide } from '@/auth/session';

/**
 * Les notifications poussees : declarer le telephone, puis l'oublier a la deconnexion.
 *
 * <p>Le jeton vient d'Expo, qui relaie vers Firebase (Android) et Apple (iOS). Il est propre a
 * l'INSTALLATION : il change si l'application est reinstallee, d'ou la redeclaration a chaque
 * ouverture — le serveur la traite comme une mise a jour, jamais comme un doublon.</p>
 *
 * <p><b>Rien de tout cela ne marche dans Expo Go</b>, qui ne recoit plus de notification
 * depuis le SDK 53, ni tant que le projet n'est pas rattache a un compte Expo (il manque
 * alors l'identifiant de projet). Les deux cas sont traites comme une absence, pas comme une
 * panne : l'application continue, et la transmission des saisies n'en depend pas.</p>
 */

/** Une notification recue application ouverte doit se voir : sinon l'agent croit a un oubli. */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function identifiantDeProjet(): string | null {
  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  return extra?.eas?.projectId ?? null;
}

/**
 * Declare ce telephone aupres du serveur. Rend le jeton obtenu, ou null si l'appareil ne
 * peut pas en avoir — ce qui n'est jamais une erreur bloquante.
 */
export async function declarerLAppareil(): Promise<string | null> {
  try {
    const projet = identifiantDeProjet();
    if (!projet) {
      console.warn('[push] projet Expo non rattache : notifications indisponibles');
      return null;
    }
    if (Platform.OS === 'android') {
      // Sans canal, Android range la notification en silence et ne l'affiche pas.
      await Notifications.setNotificationChannelAsync('default', {
        name: 'DIGI-CRG',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const existante = await Notifications.getPermissionsAsync();
    const accord = existante.granted
      ? existante
      : await Notifications.requestPermissionsAsync();
    if (!accord.granted) {
      console.warn('[push] notifications refusees par l utilisateur');
      return null;
    }
    const { data: jetonPush } = await Notifications.getExpoPushTokenAsync({ projectId: projet });
    const jeton = await jetonValide();
    if (!jeton) {
      return jetonPush;
    }
    const parametres = new URLSearchParams({
      jeton: jetonPush,
      plateforme: Platform.OS,
      modele: Constants.deviceName ?? '',
      version: Constants.expoConfig?.version ?? '',
    });
    await api.post(`/ecredit/mobile/appareils?${parametres.toString()}`, jeton);
    return jetonPush;
  } catch (e) {
    // Expo Go, emulateur sans services Google, refus systeme : rien de tout cela n'empeche
    // l'agent de travailler. La transmission des saisies ne depend pas des notifications.
    console.warn('[push] appareil non declare :', e instanceof Error ? e.message : e);
    return null;
  }
}

/** A la deconnexion : ce telephone ne doit plus rien recevoir. */
export async function retirerLAppareil(jetonPush: string | null): Promise<void> {
  if (!jetonPush) return;
  try {
    const jeton = await jetonValide();
    if (!jeton) return;
    await api.delete(`/ecredit/mobile/appareils?jeton=${encodeURIComponent(jetonPush)}`, jeton);
  } catch (e) {
    console.warn('[push] appareil non retire :', e instanceof Error ? e.message : e);
  }
}
