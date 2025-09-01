// tresorerie-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export interface PrevisionState {
    numeroMois: number;
    data: any;
    saved: boolean;
    dirty: boolean;
    lastUpdated: Date;
    hasData: boolean;
}

@Injectable({ providedIn: 'root' })
export class TresorerieStateService {
    private previsions = new Map<number, PrevisionState>();
    private currentMonthSubject = new BehaviorSubject<number>(0);
    private previsionsChangedSubject = new BehaviorSubject<void>(undefined);
    private savedMonthsSubject = new BehaviorSubject<Set<number>>(new Set());

    // Observables publics
    currentMonth$ = this.currentMonthSubject.asObservable().pipe(distinctUntilChanged());
    previsions$ = this.previsionsChangedSubject.asObservable().pipe(map(() => this.previsions));
    savedMonths$ = this.savedMonthsSubject.asObservable();

    // Getters
    get currentMonth(): number {
        return this.currentMonthSubject.value;
    }

    get savedMonths(): Set<number> {
        return this.savedMonthsSubject.value;
    }

    // Navigation
    setCurrentMonth(month: number): void {
        if (month >= 0 && month <= 12) {
            this.currentMonthSubject.next(month);
        }
    }

    // Gestion des prévisions
    getPrevision(month: number): PrevisionState | undefined {
        return this.previsions.get(month);
    }

    updatePrevision(month: number, data: any, saved: boolean = false, hasData: boolean = true): void {
        const existingPrevision = this.previsions.get(month);

        this.previsions.set(month, {
            numeroMois: month,
            data: { ...data }, // Clone pour éviter les mutations
            saved,
            dirty: !saved,
            hasData,
            lastUpdated: new Date()
        });

        // Mettre à jour les mois sauvegardés
        const savedMonths = new Set(this.savedMonthsSubject.value);
        if (saved) {
            savedMonths.add(month);
        } else if (!hasData) {
            savedMonths.delete(month);
        }
        this.savedMonthsSubject.next(savedMonths);

        this.previsionsChangedSubject.next(undefined);
    }

    markAsSaved(month: number): void {
        const prevision = this.previsions.get(month);
        if (prevision) {
            this.previsions.set(month, {
                ...prevision,
                saved: true,
                dirty: false
            });

            const savedMonths = new Set(this.savedMonthsSubject.value);
            savedMonths.add(month);
            this.savedMonthsSubject.next(savedMonths);

            this.previsionsChangedSubject.next(undefined);
        }
    }

    markAsDirty(month: number): void {
        const prevision = this.previsions.get(month);
        if (prevision) {
            this.previsions.set(month, {
                ...prevision,
                dirty: true
            });
            this.previsionsChangedSubject.next(undefined);
        }
    }

    // Utilitaires
    hasUnsavedChanges(): boolean {
        return Array.from(this.previsions.values()).some((p) => p.dirty);
    }

    getMonthsWithData(): number[] {
        return Array.from(this.previsions.entries())
            .filter(([_, prevision]) => prevision.hasData)
            .map(([month, _]) => month);
    }

    getSavedMonths(): number[] {
        return Array.from(this.previsions.entries())
            .filter(([_, prevision]) => prevision.saved)
            .map(([month, _]) => month);
    }

    getUnsavedMonths(): number[] {
        return Array.from(this.previsions.entries())
            .filter(([_, prevision]) => prevision.hasData && !prevision.saved)
            .map(([month, _]) => month);
    }

    clearMonth(month: number): void {
        this.previsions.delete(month);

        const savedMonths = new Set(this.savedMonthsSubject.value);
        savedMonths.delete(month);
        this.savedMonthsSubject.next(savedMonths);

        this.previsionsChangedSubject.next(undefined);
    }

    clearAll(): void {
        this.previsions.clear();
        this.savedMonthsSubject.next(new Set());
        this.previsionsChangedSubject.next(undefined);
    }

    // Méthode pour charger toutes les prévisions d'un coup (après chargement depuis le backend)
    loadAllPrevisions(previsions: Array<{ numeroMois: number; data: any }>): void {
        this.previsions.clear();
        const savedMonths = new Set<number>();

        previsions.forEach((prevision) => {
            this.previsions.set(prevision.numeroMois, {
                numeroMois: prevision.numeroMois,
                data: prevision.data,
                saved: true,
                dirty: false,
                hasData: true,
                lastUpdated: new Date()
            });
            savedMonths.add(prevision.numeroMois);
        });

        this.savedMonthsSubject.next(savedMonths);
        this.previsionsChangedSubject.next(undefined);
    }

    // Méthode pour obtenir toutes les prévisions pour sauvegarde
    getAllPrevisionsForSave(): Array<{ numeroMois: number; data: any }> {
        return Array.from(this.previsions.entries())
            .filter(([_, prevision]) => prevision.hasData)
            .map(([month, prevision]) => ({
                numeroMois: month,
                data: prevision.data
            }));
    }

    // Méthode pour vérifier si un mois a des données
    monthHasData(month: number): boolean {
        const prevision = this.previsions.get(month);
        return prevision?.hasData || false;
    }

    // Méthode pour obtenir le statut d'un mois
    getMonthStatus(month: number): 'empty' | 'filled' | 'saved' {
        const prevision = this.previsions.get(month);

        if (!prevision || !prevision.hasData) {
            return 'empty';
        }

        if (prevision.saved) {
            return 'saved';
        }

        return 'filled';
    }
}
