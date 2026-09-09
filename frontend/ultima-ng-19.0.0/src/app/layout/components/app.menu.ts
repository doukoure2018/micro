import { Component, DestroyRef, ElementRef, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { DrhService } from '@/service/drh.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-menu, [app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: ` <ul class="layout-menu" #menuContainer>
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul>`
})
export class AppMenu {
    @Input() user?: IUser;
    el: ElementRef = inject(ElementRef);
    private userService = inject(UserService);
    private drhService = inject(DrhService);
    private destroyRef = inject(DestroyRef);

    @ViewChild('menuContainer') menuContainer!: ElementRef;

    model: MenuItem[] = [];

    /** Fonction ACCUEIL activee par le DA pour un AGENT_CREDIT (menu accueil en plus). */
    private fonctionAccueil = false;
    private fonctionsChargees = false;

    /** Contexte DRH (congés) : responsable de département / habilitation DRH -> menus supplémentaires. */
    private estResponsableDrh = false;
    private estHabiliteDrh = false;
    private contexteDrhCharge = false;

    ngOnInit() {
        this.initializeMenu();
        this.chargerFonctions();
        this.chargerContexteDrh();
    }

    /** Tout agent peut être responsable de département (congés) : on interroge le backend une fois. */
    private chargerContexteDrh() {
        if (this.contexteDrhCharge) {
            return;
        }
        this.contexteDrhCharge = true;
        this.drhService
            .contexte$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const contexte = (response.data as any)?.contexte;
                    if (contexte?.estResponsable || contexte?.estDrh) {
                        this.estResponsableDrh = !!contexte?.estResponsable;
                        this.estHabiliteDrh = !!contexte?.estDrh;
                        this.initializeMenu();
                    }
                },
                error: () => {}
            });
    }

    /** Un AGENT_CREDIT peut cumuler la fonction ACCUEIL : on interroge le backend une fois. */
    private chargerFonctions() {
        if (this.user?.role !== 'AGENT_CREDIT' || this.fonctionsChargees) {
            return;
        }
        this.fonctionsChargees = true;
        this.userService
            .getMesFonctions$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const fonctions: string[] = response.data?.fonctions || [];
                    if (fonctions.includes('ACCUEIL')) {
                        this.fonctionAccueil = true;
                        this.initializeMenu();
                    }
                },
                error: () => {}
            });
    }

    /**
     * Menu organisé en groupes de premier niveau par métier, communs à tous les profils.
     * Chaque groupe ne contient que les entrées autorisées pour le profil connecté ;
     * un groupe vide n'apparaît pas. Une entrée = une seule définition (plus de doublons).
     */
    private initializeMenu() {
        this.model = [
            {
                label: 'Tableau de bord',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Tableau de bord',
                        icon: 'pi pi-fw pi-chart-pie',
                        routerLink: ['/dashboards/']
                    }
                ]
            },
            this.groupe('Crédit', 'pi pi-credit-card', this.menuCredit()),
            this.groupe('Caisse & contrôle', 'pi pi-calculator', this.menuCaisse()),
            this.groupe('Clients & sociétariat', 'pi pi-users', this.menuClients()),
            this.groupe('Ressources humaines', 'pi pi-briefcase', this.menuRh()),
            this.groupe('Avances sur salaire', 'pi pi-wallet', this.menuAvances()),
            this.groupe('Administration & outils', 'pi pi-cog', this.menuAdmin()),
            {
                label: 'Aide',
                icon: 'pi pi-question-circle',
                items: [
                    {
                        label: "Guide d'utilisation — Circuit de crédit",
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/dashboards/guide-circuit-credit']
                    }
                ]
            }
        ].filter((g): g is MenuItem => g !== null);
    }

    private groupe(label: string, icon: string, items: MenuItem[]): MenuItem | null {
        return items.length > 0 ? { label, icon, items } : null;
    }

    private get role(): string | undefined {
        return this.user?.role;
    }

    private get service(): string | undefined {
        return this.user?.service;
    }

    private estManager(service: string): boolean {
        return this.role === 'MANAGER' && this.service === service;
    }

    // ==================== Crédit ====================

    private menuCredit(): MenuItem[] {
        const items: MenuItem[] = [];
        if (this.role === 'AGENT_ACCUEIL' || (this.role === 'AGENT_CREDIT' && this.fonctionAccueil)) {
            items.push(
                {
                    label: 'Réception demande de crédit',
                    icon: 'pi pi-fw pi-inbox',
                    items: [
                        {
                            label: 'Particulier',
                            icon: 'pi pi-fw pi-user',
                            routerLink: ['/dashboards/accueil/reception-demande']
                        },
                        {
                            label: 'Groupe',
                            icon: 'pi pi-fw pi-users',
                            routerLink: ['/dashboards/agent-credit/demande-groupe']
                        }
                    ]
                },
                {
                    label: 'Mes demandes réceptionnées',
                    icon: 'pi pi-fw pi-list-check',
                    routerLink: ['/dashboards/accueil/mes-receptions']
                }
            );
        }
        if (this.role === 'AGENT_CREDIT') {
            items.push({
                label: 'Demandes affectées par mon DA',
                icon: 'pi pi-fw pi-inbox',
                routerLink: ['/dashboards/agent-credit/demandes-affectees']
            });
        }
        if (this.role === 'DA') {
            items.push(
                {
                    label: 'Affectations & réorientation',
                    icon: 'pi pi-fw pi-directions',
                    routerLink: ['/dashboards/da/receptions-a-affecter']
                },
                {
                    label: 'Gestion des agents',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/dashboards/da/gestion-agents']
                },
                {
                    label: 'Suivi crédits de mon agence',
                    icon: 'pi pi-fw pi-chart-line',
                    routerLink: ['/dashboards/suivi-credits-reseau']
                }
            );
        }
        if (this.role === 'DR') {
            items.push({
                label: 'Suivi crédits de ma délégation',
                icon: 'pi pi-fw pi-chart-line',
                routerLink: ['/dashboards/suivi-credits-reseau']
            });
        }
        if (this.estManager('DE')) {
            items.push(
                {
                    label: 'Demandes crédits validées par DE',
                    icon: 'pi pi-fw pi-check-circle',
                    routerLink: ['/dashboards/credits-valides-de']
                },
                {
                    label: 'Rejets DG à confirmer',
                    icon: 'pi pi-fw pi-exclamation-triangle',
                    routerLink: ['/dashboards/rejets-dg-a-confirmer']
                }
            );
        }
        if (this.role === 'DG') {
            items.push(
                {
                    label: 'Crédits à valider (≥ 100 M)',
                    icon: 'pi pi-fw pi-crown',
                    routerLink: ['/dashboards/credits-a-valider-dg']
                },
                {
                    label: 'Suivi Direction Exploitation',
                    icon: 'pi pi-fw pi-chart-line',
                    routerLink: ['/dashboards/dg-vue-de']
                }
            );
        }
        if (this.estManager('DI')) {
            items.push({
                label: 'Inspection crédits (validés DR)',
                icon: 'pi pi-fw pi-search-plus',
                routerLink: ['/dashboards/inspection-credits']
            });
        }
        if (['AGENT_CREDIT', 'DA', 'DR', 'DG'].includes(this.role || '') || this.estManager('DE')) {
            items.push({
                label: 'Portefeuille crédits SAF',
                icon: 'pi pi-fw pi-wallet',
                routerLink: ['/dashboards/portefeuille-saf']
            });
        }
        return items;
    }

    // ==================== Caisse & contrôle ====================

    private menuCaisse(): MenuItem[] {
        const items: MenuItem[] = [];
        if (this.role === 'AGENT_CREDIT' || this.role === 'CAISSE') {
            items.push({
                label: 'Rapprochement caisse',
                icon: 'pi pi-fw pi-calculator',
                routerLink: ['/dashboards/rapprochement-caisse']
            });
        }
        if (this.role === 'RA') {
            items.push({
                label: 'Outil rapprochement caisse',
                icon: 'pi pi-fw pi-calculator',
                routerLink: ['/dashboards/rapprochement-caisse-ra']
            });
        }
        if (this.estManager('Audit')) {
            items.push({
                label: 'Audit rapprochement',
                icon: 'pi pi-fw pi-shield',
                routerLink: ['/dashboards/audit-rapprochement']
            });
        }
        if (['DA', 'DR', 'DG', 'RA'].includes(this.role || '') || this.estManager('DE') || this.estManager('DI')) {
            items.push({
                label: 'Suivi des arrêtés de caisse',
                icon: 'pi pi-fw pi-money-bill',
                routerLink: ['/dashboards/suivi-arrete-caisse']
            });
        }
        if (this.estManager('DE')) {
            items.push({
                label: 'Situation stock',
                icon: 'pi pi-fw pi-box',
                routerLink: ['/dashboards/situation-stock']
            });
        }
        if (this.role === 'AGENT_CREDIT') {
            items.push({
                label: 'Gestion stock',
                icon: 'pi pi-fw pi-box',
                routerLink: ['/dashboards/stock']
            });
            if (this.user?.authorized) {
                items.push({
                    label: 'Correction P. Physique',
                    icon: 'pi pi-fw pi-user-edit',
                    routerLink: ['/dashboards/correction-physique']
                });
            }
            items.push({
                label: 'Correction en attente',
                icon: 'pi pi-fw pi-hourglass',
                routerLink: ['/dashboards/correction-en-attente']
            });
        }
        if (this.role === 'AGENT_CORRECTEUR') {
            items.push({
                label: 'Correction P. Physique',
                icon: 'pi pi-fw pi-user-edit',
                routerLink: ['/dashboards/correction-physique']
            });
        }
        return items;
    }

    // ==================== Clients & sociétariat ====================

    private menuClients(): MenuItem[] {
        const items: MenuItem[] = [];
        if (['DA', 'DR', 'RA'].includes(this.role || '')) {
            items.push({
                label: 'Suivi sociétariat',
                icon: 'pi pi-fw pi-id-card',
                routerLink: ['/dashboards/suivi-societariat']
            });
        }
        if (this.role === 'AGENT_CREDIT') {
            items.push({
                label: 'Changement téléphone',
                icon: 'pi pi-fw pi-phone',
                routerLink: ['/dashboards/changement-telephone/agent']
            });
        }
        if (this.role === 'DA') {
            items.push({
                label: 'Validation changement téléphone',
                icon: 'pi pi-fw pi-phone',
                routerLink: ['/dashboards/changement-telephone/da']
            });
        }
        if (this.estManager('DI')) {
            items.push({
                label: 'Inspection changement téléphone',
                icon: 'pi pi-fw pi-phone',
                routerLink: ['/dashboards/changement-telephone/inspection']
            });
        }
        if (this.estManager('DSIG')) {
            items.push({
                label: 'Vérification des documents',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/dashboards/document-verification']
            });
        }
        return items;
    }

    // ==================== Ressources humaines ====================

    private menuRh(): MenuItem[] {
        const items: MenuItem[] = [
            // Congés & permission sociale : tout le personnel, y compris la caisse
            {
                label: 'Mes congés',
                icon: 'pi pi-fw pi-calendar',
                items: [
                    {
                        label: 'Ma prévision',
                        icon: 'pi pi-fw pi-calendar-plus',
                        routerLink: ['/dashboards/drh/ma-prevision']
                    },
                    {
                        label: 'Mes demandes de congé',
                        icon: 'pi pi-fw pi-send',
                        routerLink: ['/dashboards/drh/mes-conges']
                    },
                    {
                        label: 'Permission sociale',
                        icon: 'pi pi-fw pi-heart',
                        routerLink: ['/dashboards/drh/mes-permissions']
                    }
                ]
            }
        ];
        if (this.estResponsableDrh) {
            items.push({
                label: 'Congés de mon département',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Prévisions',
                        icon: 'pi pi-fw pi-calendar-plus',
                        routerLink: ['/dashboards/drh/departement-previsions']
                    },
                    {
                        label: 'Demandes de congé',
                        icon: 'pi pi-fw pi-send',
                        routerLink: ['/dashboards/drh/conges-departement']
                    }
                ]
            });
        }
        const managerDrh = this.estManager('DRH');
        if (this.estHabiliteDrh || managerDrh) {
            const admin: MenuItem[] = [];
            // Les validations restent au responsable DRH (pas au SUPER_ADMIN)
            if (this.estHabiliteDrh && this.role !== 'SUPER_ADMIN') {
                admin.push(
                    {
                        label: 'Validation des prévisions',
                        icon: 'pi pi-fw pi-check-square',
                        routerLink: ['/dashboards/drh/validation-previsions']
                    },
                    {
                        label: 'Validation des congés',
                        icon: 'pi pi-fw pi-verified',
                        routerLink: ['/dashboards/drh/validation-conges']
                    }
                );
            }
            if (this.estHabiliteDrh) {
                admin.push(
                    {
                        label: 'Organisation (départements)',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/dashboards/drh/organisation']
                    },
                    {
                        label: 'Gestion des présences',
                        icon: 'pi pi-fw pi-clock',
                        routerLink: ['/dashboards/drh/presences']
                    },
                    {
                        label: 'Gestion des mouvements',
                        icon: 'pi pi-fw pi-arrow-right-arrow-left',
                        routerLink: ['/dashboards/drh/mouvements']
                    }
                );
            }
            // Habilitation DRH OU rôle MANAGER du service DRH
            admin.push({
                label: 'Gestion du personnel',
                icon: 'pi pi-fw pi-address-book',
                routerLink: ['/dashboards/gestion-personnel']
            });
            items.push({
                label: 'Administration DRH',
                icon: 'pi pi-fw pi-briefcase',
                items: admin
            });
        }
        return items;
    }

    // ==================== Avances sur salaire ====================

    private menuAvances(): MenuItem[] {
        const items: MenuItem[] = [];
        // Ouvert à tout le personnel, sauf la caisse (rapprochement + congés uniquement)
        if (this.role !== 'CAISSE') {
            items.push(
                {
                    label: 'Demander une avance',
                    icon: 'pi pi-fw pi-money-bill',
                    routerLink: ['/dashboards/demande-avance-salaire']
                },
                {
                    label: "Mes demandes d'avance",
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/dashboards/mes-demandes-salaire']
                }
            );
        }
        if (this.role === 'DF' || this.service === 'DF') {
            // La vue de confirmation DF est intégrée au tableau de bord d'accueil (DfComponent)
            items.push({
                label: 'Confirmation des avances (DF)',
                icon: 'pi pi-fw pi-building',
                routerLink: ['/dashboards/']
            });
        }
        return items;
    }

    // ==================== Administration & outils ====================

    private menuAdmin(): MenuItem[] {
        const items: MenuItem[] = [];
        if (this.role === 'SUPER_ADMIN') {
            items.push(
                {
                    label: 'Configuration réseau',
                    icon: 'pi pi-fw pi-cog',
                    routerLink: ['/dashboards/config']
                },
                {
                    label: 'Réseau — Géolocalisation',
                    icon: 'pi pi-fw pi-map-marker',
                    routerLink: ['/dashboards/reseau-geo']
                },
                {
                    label: 'Réseau — Carte',
                    icon: 'pi pi-fw pi-map',
                    routerLink: ['/dashboards/reseau-carte']
                }
            );
        }
        if (this.estManager('DSIG')) {
            items.push(
                {
                    label: 'Campagnes SMS',
                    icon: 'pi pi-fw pi-send',
                    routerLink: ['/dashboards/campagnes-sms']
                },
                {
                    label: 'Répertoires SMS',
                    icon: 'pi pi-fw pi-database',
                    routerLink: ['/dashboards/repertoires-sms']
                },
                {
                    label: 'Actualiser décodeur',
                    icon: 'pi pi-fw pi-sync',
                    routerLink: ['/dashboards/actualiser-decodeur']
                }
            );
        }
        return items;
    }

    ngOnChanges(changes: SimpleChanges) {
        // Re-initialize menu whenever user input changes
        if (changes['user']) {
            this.initializeMenu();
            this.chargerFonctions();
            this.chargerContexteDrh();
        }
    }
}
