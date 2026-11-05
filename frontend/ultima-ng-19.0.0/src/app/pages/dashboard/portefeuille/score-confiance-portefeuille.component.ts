import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
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
    imports: [CommonModule, FormsModule, TableModule, CardModule, ButtonModule, TagModule, MessageModule, ProgressSpinnerModule, TooltipModule],
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

    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);

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
}
