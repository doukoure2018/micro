import { Alert, Linking, Platform } from 'react-native';

/**
 * Ouvrir une position dans l'application de cartes du telephone.
 *
 * <p>Le 16/11, le bouton « Itineraire » lançait `geo:0,0?q=<nom du membre>`. Deux fautes dans
 * une seule ligne : iOS ne connait pas le schema `geo:` — d'ou dix promesses rejetees et
 * autant d'erreurs rouges — et chercher le NOM d'une personne dans une carte ne menait de
 * toute facon nulle part. On n'ouvre donc une carte que si l'on a des COORDONNEES, et avec
 * le schema que la plateforme comprend.</p>
 */
export async function ouvrirSurLaCarte(
  latitude: number, longitude: number, etiquette?: string,
): Promise<void> {
  const point = `${latitude},${longitude}`;
  const nom = encodeURIComponent(etiquette ?? 'Visite');
  const adresse = Platform.select({
    ios: `maps://?q=${nom}&ll=${point}`,
    android: `geo:${point}?q=${point}(${nom})`,
    default: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${point}`,
  });
  const secours = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${point}`;
  try {
    if (await Linking.canOpenURL(adresse)) {
      await Linking.openURL(adresse);
      return;
    }
    await Linking.openURL(secours);
  } catch {
    // Aucune carte installee, ou pas de navigateur : on le DIT, on ne laisse pas une
    // promesse se rejeter dans le vide.
    Alert.alert('Carte', `Aucune application de cartes n'a pu s'ouvrir.\n\nPosition : ${point}`);
  }
}

/**
 * Composer un numero. Meme precaution que pour la carte : un appareil sans application de
 * telephone — une tablette, un emulateur — rejette l'ouverture, et une promesse rejetee sans
 * garde remonte en erreur rouge a l'ecran.
 */
export async function appeler(telephone: string | null): Promise<void> {
  const numero = premierNumero(telephone);
  if (!numero) {
    return;
  }
  try {
    if (await Linking.canOpenURL(`tel:${numero}`)) {
      await Linking.openURL(`tel:${numero}`);
      return;
    }
    Alert.alert('Appel', `Cet appareil ne peut pas appeler.\n\nNumero : ${numero}`);
  } catch {
    Alert.alert('Appel', `L'appel n'a pas pu etre lance.\n\nNumero : ${numero}`);
  }
}

/**
 * Le premier numero d'une fiche. Une fiche en porte parfois deux, separes par une barre
 * (« 628833094/624380638 ») : on compose le premier plutot que la chaine entiere.
 */
export function premierNumero(telephone: string | null | undefined): string {
  const numeros = (telephone ?? '').split(/[^0-9+]+/).filter((n) => n.length >= 6);
  return numeros[0] ?? '';
}
