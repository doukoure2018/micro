import { IResponse } from '@/interface/response';
import { HabilitationService } from '@/service/habilitation.service';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

interface LigneRepartition {
    codAgencia: string;
    agentUserId: number | null;
    agent: string | null;
    classeA: number;
    classeB: number;
    classeC: number;
    classeD: number;
    classeE: number;
    classeN: number;
    total: number;
}

interface Cohorte {
    classe: string;
    membres: number;
    defauts: number;
    tauxDefautPercent: number;
}

interface Calibrage {
    dateReference: string;
    membresAnalyses: number;
    membresSansHistorique: number;
    membresEnDefaut: number;
    cohortes: Cohorte[];
    lecture: string;
}

interface Degradation {
    numeroMembre: string;
    classeAvant: string;
    classeApres: string;
    scoreAvant: number | null;
    scoreApres: number | null;
    codAgencia: string;
    agentUserId: number | null;
}

/**
 * Répartition des classes de confiance du portefeuille, et membres qui ont reculé.
 *
 * La page lit la photo mensuelle du score (prise le 1er de chaque mois) : elle ne recalcule
 * rien à l'écran. Un score du jour pour tout un réseau coûterait une lecture SAF par membre.
 */
@Component({
    selector: 'app-score-confiance-portefeuille',
    imports: [CommonModule, FormsModule, TableModule, CardModule, ButtonModule, TagModule, MessageModule, ProgressSpinnerModule, TooltipModule, DatePickerModule, InputNumberModule, DividerModule],
    templateUrl: './score-confiance-portefeuille.component.html'
})
export class ScoreConfiancePortefeuilleComponent implements OnInit {
    state = signal<{
        mois: string | null;
        niveau: string | null;
        lignes: LigneRepartition[];
        degradations: Degradation[];
        chargement: boolean;
        message: string | undefined;
        erreur: string | undefined;
    }>({
        mois: null,
        niveau: null,
        lignes: [],
        degradations: [],
        chargement: false,
        message: undefined,
        erreur: undefined
    });

    /** Calibrage : réservé aux porteurs de la rubrique ADMIN_OUTILS, comme côté serveur. */
    calibrage = signal<{
        date: Date;
        limite: number;
        enCours: boolean;
        etat: string;
        resultat: Calibrage | null;
        erreur: string | undefined;
    }>({
        date: new Date(2025, 5, 1),
        limite: 300,
        enCours: false,
        etat: '',
        resultat: null,
        erreur: undefined
    });

    photo = signal<{ enCours: boolean; message: string | undefined }>({ enCours: false, message: undefined });

    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private habilitations = inject(HabilitationService);

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.state.update((s) => ({ ...s, chargement: true, erreur: undefined }));

        this.userService
            .repartitionConfiance$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: IResponse) => {
                    const data = reponse.data?.repartition ?? { mois: null, lignes: [] };
                    this.state.update((s) => ({
                        ...s,
                        mois: data.mois ?? null,
                        niveau: data.niveau ?? null,
                        lignes: data.lignes ?? [],
                        message: data.message,
                        chargement: false
                    }));
                    if (data.mois) {
                        this.chargerDegradations();
                    }
                },
                error: (erreur) => this.state.update((s) => ({ ...s, chargement: false, erreur: erreur.message ?? 'Lecture impossible' }))
            });
    }

    private chargerDegradations(): void {
        this.userService
            .degradationsConfiance$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: IResponse) => {
                    const data = reponse.data?.derive ?? { mois: null, degradations: [] };
                    this.state.update((s) => ({ ...s, degradations: data.degradations ?? [] }));
                },
                error: () => this.state.update((s) => ({ ...s, degradations: [] }))
            });
    }

    // ---------------------------------------------------------------- totaux

    total(classe: 'classeA' | 'classeB' | 'classeC' | 'classeD' | 'classeE' | 'classeN' | 'total'): number {
        return this.state().lignes.reduce((somme, l) => somme + (l[classe] ?? 0), 0);
    }

    part(valeur: number): string {
        const total = this.total('total');
        if (!total) return '0 %';
        return Math.round((valeur / total) * 100) + ' %';
    }

    // ---------------------------------------------------------------- affichage

    severiteClasse(classe: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (classe) {
            case 'A':
                return 'success';
            case 'B':
                return 'info';
            case 'C':
                return 'warn';
            case 'D':
            case 'E':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    libelleAgent(ligne: LigneRepartition): string {
        if (!ligne.agentUserId) return 'Non affecté';
        return ligne.agent ?? 'Agent ' + ligne.agentUserId;
    }

    /** Les classes qui appellent une analyse renforcée, par point de service. */
    aSurveiller(ligne: LigneRepartition): number {
        return ligne.classeC + ligne.classeD + ligne.classeE;
    }

    // ---------------------------------------------------------------- calibrage et photo

    /**
     * Il faut douze mois d'observation pour mesurer un défaut : le serveur refuse toute date
     * plus récente, autant ne pas la laisser choisir.
     */
    readonly maxDateCalibrage = new Date(new Date().setMonth(new Date().getMonth() - 12));

    majDate(date: Date): void {
        if (date) this.calibrage.update((c) => ({ ...c, date }));
    }

    majLimite(limite: number): void {
        this.calibrage.update((c) => ({ ...c, limite: limite ?? 300 }));
    }

    /** Le serveur exige ADMIN_OUTILS : on ne montre pas un bouton qui répondrait 403. */
    peutCalibrer(): boolean {
        return this.habilitations.peut('ADMIN_OUTILS');
    }

    /**
     * Lance le test rétrospectif : le score tel qu'il aurait été à la date choisie, confronté
     * au défaut constaté dans les douze mois qui ont suivi. C'est long — une lecture SAF par
     * membre — d'où la limite, et d'où le fait que personne ne le lance par curiosité.
     */
    calibrer(): void {
        const courant = this.calibrage();
        if (courant.enCours) return;
        this.calibrage.update((c) => ({ ...c, enCours: true, etat: 'démarrage', erreur: undefined, resultat: null }));

        const date = this.isoDate(courant.date);
        this.userService
            .calibrerConfiance$(date, courant.limite)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.suivreLeCalibrage(date),
                error: (erreur) =>
                    this.calibrage.update((c) => ({
                        ...c,
                        enCours: false,
                        erreur: erreur?.message ?? 'Le test n’a pas pu être lancé'
                    }))
            });
    }

    /**
     * Le test tourne côté serveur : on relit son avancée toutes les huit secondes. Quitter la
     * page n'arrête rien, et le résultat se relit à tout moment — il est en base.
     */
    private suivreLeCalibrage(date: string): void {
        this.userService
            .resultatCalibrage$(date)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: IResponse) => {
                    const enCours = reponse.data?.enCours === true;
                    const resultat = (reponse.data?.calibrage ?? null) as Calibrage | null;
                    this.calibrage.update((c) => ({
                        ...c,
                        enCours,
                        etat: reponse.data?.etatCalibrage ?? c.etat,
                        resultat: resultat && resultat.membresAnalyses > 0 ? resultat : c.resultat
                    }));
                    if (enCours) {
                        setTimeout(() => this.suivreLeCalibrage(date), 8000);
                    }
                },
                error: (erreur) =>
                    this.calibrage.update((c) => ({
                        ...c,
                        enCours: false,
                        erreur: erreur?.message ?? 'Suivi du test impossible'
                    }))
            });
    }

    /** Relit un résultat déjà calculé, sans relancer le test. */
    relireLeResultat(): void {
        this.suivreLeCalibrage(this.isoDate(this.calibrage().date));
    }

    /** Prend la photo du mois à la main, sans attendre le 1er. */
    prendreLaPhoto(): void {
        if (this.photo().enCours) return;
        this.photo.set({ enCours: true, message: undefined });

        this.userService
            .photoConfiance$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: IResponse) => {
                    this.photo.set({ enCours: false, message: reponse.data?.photo?.message ?? 'Photo prise' });
                    this.charger();
                },
                error: (erreur) => this.photo.set({ enCours: false, message: erreur?.message ?? 'Photo impossible' })
            });
    }

    /** Le taux de défaut d'un groupe de classes, pour lire l'écart en un coup d'œil. */
    tauxGroupe(classes: string[]): string {
        const cohortes = (this.calibrage().resultat?.cohortes ?? []).filter((c) => classes.includes(c.classe));
        const membres = cohortes.reduce((s, c) => s + c.membres, 0);
        if (!membres) return '—';
        const defauts = cohortes.reduce((s, c) => s + c.defauts, 0);
        return (Math.round((defauts / membres) * 1000) / 10).toFixed(1) + ' %';
    }

    /** Vrai quand les classes séparent assez pour qu'on s'appuie dessus. */
    separationSuffisante(): boolean {
        return (this.calibrage().resultat?.lecture ?? '').startsWith('Les classes séparent');
    }

    private isoDate(date: Date): string {
        const mois = String(date.getMonth() + 1).padStart(2, '0');
        const jour = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}-${mois}-${jour}`;
    }
}
