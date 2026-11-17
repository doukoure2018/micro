import { useCallback, useState } from 'react';
import {
  Pressable, RefreshControl, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api, ErreurReseau } from '@/api/client';
import { jetonValide } from '@/auth/session';
import type { JournalNotifications, NotificationVue } from '@/api/types';
import { estOuverte } from '@/db/base';
import {
  lecturesARemonter, lecturesRemontees, marquerLuesLocalement, notificationsLocales,
  remplacerNotifications,
} from '@/db/notifications';
import { cheminDeLEcran } from '@/ui/ecrans';
import { couleurs, dateCourte, espaces, heureCourte, texte } from '@/ui/theme';

/**
 * Le centre de notifications : ce que l'agent a recu, et qu'il a peut-etre balaye.
 *
 * <p>Cet ecran existe pour une raison simple : une notification poussee est un signal
 * volatil. Elle s'efface d'un balayage, n'arrive pas si le telephone etait eteint, disparait
 * a la reinstallation. Le push annonce, le journal conserve — c'est ici qu'on relit l'alerte
 * de 8 h 20 lue en marchant.</p>
 *
 * <p>Il s'ouvre hors connexion sur la copie locale, et tente ensuite le serveur. La lecture
 * part du telephone : elle s'affiche tout de suite et remonte a la synchronisation suivante,
 * meme si l'agent etait sans reseau en la marquant.</p>
 */

/** La couleur de la bande : elle dit la categorie d'un coup d'oeil, maquette du 12/11. */
const TEINTES: Record<string, string> = {
  PORTEFEUILLE: couleurs.ambre,
  RECOUVREMENT: couleurs.bleu,
  SYNCHRONISATION: couleurs.vert,
  RECLAMATION: couleurs.rouge,
  DOSSIER: couleurs.vertFonce,
};

const LIBELLES: Record<string, string> = {
  PORTEFEUILLE: 'portefeuille',
  RECOUVREMENT: 'recouvrement',
  SYNCHRONISATION: 'synchronisation',
  RECLAMATION: 'reclamations',
  DOSSIER: 'dossiers',
};

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationVue[]>([]);
  const [rafraichit, setRafraichit] = useState(false);
  const [horsConnexion, setHorsConnexion] = useState(false);

  const charger = useCallback(async (depuisLeServeur: boolean) => {
    if (!estOuverte()) return;
    // La copie d'abord : l'ecran s'affiche meme si le serveur ne repond pas.
    setNotifications(await notificationsLocales());
    if (!depuisLeServeur) return;
    try {
      const jeton = await jetonValide();
      if (!jeton) return;
      const journal = await api.get<{ journal: JournalNotifications }>(
        '/ecredit/mobile/notifications', jeton);
      await remplacerNotifications(journal?.journal?.notifications ?? []);
      setNotifications(await notificationsLocales());
      setHorsConnexion(false);
    } catch (e) {
      setHorsConnexion(e instanceof ErreurReseau);
    }
  }, []);

  useFocusEffect(useCallback(() => { void charger(true); }, [charger]));

  const surRafraichir = useCallback(async () => {
    setRafraichit(true);
    await charger(true);
    setRafraichit(false);
  }, [charger]);

  /**
   * Marque lu, et annonce au serveur si le reseau est la. Sinon la marque attend dans la
   * copie locale : l'agent a lu, et l'ecran ne doit pas pretendre le contraire.
   */
  const marquerLues = useCallback(async (ids: number[] | null) => {
    await marquerLuesLocalement(ids);
    // Ce que le serveur ne sait pas encore — y compris les lectures faites hors connexion
    // lors d'un passage precedent : c'est l'occasion de les lui dire toutes.
    const aRemonter = await lecturesARemonter();
    setNotifications(await notificationsLocales());
    if (aRemonter.length === 0) return;
    try {
      const jeton = await jetonValide();
      if (!jeton) return;
      await api.post('/ecredit/mobile/notifications/lues', jeton, { ids: aRemonter });
      await lecturesRemontees(aRemonter);
    } catch {
      // Rien a faire : la remontee repartira avec la prochaine synchronisation.
    }
  }, []);

  async function ouvrir(n: NotificationVue) {
    if (!n.lue) void marquerLues([n.id]);
    const chemin = cheminDeLEcran(n.ecran);
    if (chemin) router.push(chemin as never);
  }

  const nonLues = notifications.filter((n) => !n.lue).length;
  const groupes = grouper(notifications);

  return (
    <ScrollView
      style={{ backgroundColor: couleurs.fond }}
      contentContainerStyle={s.page}
      refreshControl={<RefreshControl refreshing={rafraichit} onRefresh={surRafraichir} />}
    >
      <View style={s.entete}>
        <Text style={s.sous}>
          {nonLues === 0 ? 'Tout est lu' : nonLues === 1 ? '1 non lue' : `${nonLues} non lues`}
        </Text>
        {nonLues > 0 ? (
          <Pressable accessibilityRole="button" onPress={() => void marquerLues(null)}
                     style={s.cible}>
            <Text style={s.lien}>Tout marquer lu</Text>
          </Pressable>
        ) : null}
      </View>

      {horsConnexion ? (
        <Text style={s.avis}>
          Hors connexion : voici les notifications de la derniere synchronisation.
        </Text>
      ) : null}

      {notifications.length === 0 ? (
        <Text style={s.vide}>
          Aucune notification. Les alertes du matin, les reponses a vos signalements et les
          decisions sur vos dossiers arriveront ici.
        </Text>
      ) : null}

      {groupes.map(([jour, lignes]) => (
        <View key={jour} style={s.groupe}>
          <Text style={s.jour}>{jour}</Text>
          {lignes.map((n) => (
            <Pressable key={n.id} accessibilityRole="button" onPress={() => void ouvrir(n)}
                       style={[s.carte, !n.lue && {
                         borderLeftWidth: 4,
                         borderLeftColor: TEINTES[n.categorie] ?? couleurs.vert,
                       }]}>
              <View style={{ flex: 1 }}>
                <Text style={[s.titre, n.lue && s.titreLu]}>{n.titre}</Text>
                <Text style={s.corps}>{n.corps}</Text>
                <Text style={s.detail}>
                  {heureCourte(n.creeeAt)} · {LIBELLES[n.categorie] ?? n.categorie.toLowerCase()}
                  {n.envoyee ? '' : ' · non poussee'}
                </Text>
              </View>
              {!n.lue ? <View style={s.point} accessibilityLabel="Non lue" /> : null}
            </Pressable>
          ))}
        </View>
      ))}

      {notifications.length > 0 ? (
        <Text style={s.pied}>
          Les alertes du matin vous arrivent aussi par courriel. Les montants et les noms ne
          s'affichent jamais sur l'ecran verrouille : ils s'ouvrent ici.
        </Text>
      ) : null}
    </ScrollView>
  );
}

/**
 * Regroupe par jour : « Aujourd'hui », « Hier », puis la date. L'agent cherche « ce que j'ai
 * recu ce matin », pas la quarante-deuxieme notification d'une liste plate.
 */
function grouper(notifications: NotificationVue[]): [string, NotificationVue[]][] {
  const aujourdhui = jour(new Date().toISOString());
  const veille = new Date();
  veille.setDate(veille.getDate() - 1);
  const hier = jour(veille.toISOString());
  const groupes = new Map<string, NotificationVue[]>();
  for (const n of notifications) {
    const cle = jour(n.creeeAt);
    const titre = cle === aujourdhui ? "Aujourd'hui" : cle === hier ? 'Hier' : dateCourte(n.creeeAt);
    const deja = groupes.get(titre);
    if (deja) deja.push(n);
    else groupes.set(titre, [n]);
  }
  return [...groupes.entries()];
}

function jour(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toISOString().slice(0, 10);
}

const s = StyleSheet.create({
  page: { padding: espaces.l, gap: espaces.m, paddingBottom: espaces.xxl },
  entete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sous: { fontSize: texte.petit, color: couleurs.texteSecondaire },
  cible: { minHeight: 44, justifyContent: 'center' },
  lien: { fontSize: texte.petit, fontWeight: '600', color: couleurs.vert },
  avis: { fontSize: texte.minuscule, color: couleurs.ambre },
  vide: { fontSize: texte.corps, color: couleurs.texteSecondaire },
  groupe: { gap: espaces.s },
  jour: {
    fontSize: texte.minuscule, fontWeight: '600', color: couleurs.texteSecondaire,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  carte: {
    flexDirection: 'row', gap: espaces.m, minHeight: 56,
    backgroundColor: couleurs.surface, borderRadius: 12, padding: espaces.m,
    borderWidth: 1, borderColor: couleurs.bord,
  },
  titre: { fontSize: texte.corps, fontWeight: '600', color: couleurs.texte },
  titreLu: { fontWeight: '500' },
  corps: { fontSize: texte.petit, color: '#3D4B44', marginTop: 2 },
  detail: { fontSize: texte.minuscule, color: couleurs.texteSecondaire, marginTop: 2 },
  point: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: couleurs.vert, marginTop: 6,
  },
  pied: { fontSize: texte.minuscule, color: couleurs.texteSecondaire, marginTop: espaces.s },
});
