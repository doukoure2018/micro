import { Habilitations } from '@/interface/habilitation';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { UserService } from './user.service';

const VIDE: Habilitations = {
    role: null,
    service: null,
    departementId: null,
    departementCode: null,
    departement: null,
    responsableDuService: false,
    accueil: null,
    parDepartementActif: false,
    rubriques: [],
    aPlacer: false,
    peutReglerLaMatrice: false
};

/**
 * Le porte-cles d'habilitations du compte connecte (V178).
 *
 * <p>Le menu et les gardes de route posent la meme question a cet endroit unique, au lieu de
 * recopier chacun une condition sur le role et le service. Le serveur reverifie de son cote :
 * masquer une entree de menu ne protege rien, l'adresse de l'ecran reste tapable.</p>
 */
@Injectable({ providedIn: 'root' })
export class HabilitationService {
    private userService = inject(UserService);

    /** Lu une fois par session. Un rechargement de page le redemande. */
    private porteCles: Habilitations | null = null;

    /** Pour les gabarits qui veulent reagir a l'arrivee du porte-cles. */
    readonly etat = signal<Habilitations | null>(null);

    charger$(): Observable<Habilitations> {
        if (this.porteCles) {
            return of(this.porteCles);
        }
        return this.userService.getHabilitations$().pipe(
            map((response) => ((response?.data as any)?.habilitations ?? VIDE) as Habilitations),
            map((h) => ({ ...VIDE, ...h, rubriques: h?.rubriques ?? [] })),
            tap((h) => {
                this.porteCles = h;
                this.etat.set(h);
            })
        );
    }

    /** Vrai seulement si le porte-cles est arrive et contient la rubrique. */
    peut(rubrique: string): boolean {
        return !!this.porteCles?.rubriques?.includes(rubrique);
    }

    get charge(): boolean {
        return this.porteCles !== null;
    }

    get porteClesCourant(): Habilitations | null {
        return this.porteCles;
    }

    /** A appeler a la deconnexion : le porte-cles du suivant n'est pas celui du precedent. */
    oublier() {
        this.porteCles = null;
        this.etat.set(null);
    }
}
