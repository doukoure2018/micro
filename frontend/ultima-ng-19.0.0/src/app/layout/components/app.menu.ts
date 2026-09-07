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

    private initializeMenu() {
        this.model = [
            {
                label: 'Tableau de Bord',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Tableau de Bord',
                        icon: 'pi pi-fw pi-chart-pie',
                        routerLink: ['/dashboards/']
                    },
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
                    },
                    ...(this.estResponsableDrh
                        ? [
                              {
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
                              }
                          ]
                        : []),
                    ...(this.estHabiliteDrh
                        ? [
                              {
                                  label: 'DRH',
                                  icon: 'pi pi-fw pi-briefcase',
                                  items: [
                                      {
                                          label: 'Validation des prévisions',
                                          icon: 'pi pi-fw pi-check-square',
                                          routerLink: ['/dashboards/drh/validation-previsions']
                                      },
                                      {
                                          label: 'Validation des congés',
                                          icon: 'pi pi-fw pi-verified',
                                          routerLink: ['/dashboards/drh/validation-conges']
                                      },
                                      {
                                          label: 'Organisation (départements)',
                                          icon: 'pi pi-fw pi-sitemap',
                                          routerLink: ['/dashboards/drh/organisation']
                                      }
                                  ]
                              }
                          ]
                        : []),
                    ...(this.user?.role === 'AGENT_ACCUEIL'
                        ? [
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
                          ]
                        : []),
                    ...(this.user?.role === 'AGENT_CREDIT'
                        ? [
                              {
                                  label: 'Demandes affectées par mon DA',
                                  icon: 'pi pi-fw pi-inbox',
                                  routerLink: ['/dashboards/agent-credit/demandes-affectees']
                              },
                              {
                                  label: 'Portefeuille crédits SAF',
                                  icon: 'pi pi-fw pi-wallet',
                                  routerLink: ['/dashboards/portefeuille-saf']
                              },
                              ...(this.fonctionAccueil
                                  ? [
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
                                        }
                                    ]
                                  : []),
                              ...(this.fonctionAccueil
                                  ? [
                                        {
                                            label: 'Mes demandes réceptionnées',
                                            icon: 'pi pi-fw pi-list-check',
                                            routerLink: ['/dashboards/accueil/mes-receptions']
                                        }
                                    ]
                                  : []),
                              //   {
                              //       label: 'Analyse de Credit',
                              //       icon: 'pi pi-fw pi-hourglass',
                              //       routerLink: ['/dashboards/credit', this.user?.userId]
                              //   },
                              //   {
                              //       label: 'Membre',
                              //       icon: 'pi pi-th-large',
                              //       items: [
                              //           {
                              //               label: 'adhesion',
                              //               icon: 'pi pi-fw pi-user',
                              //               items: [
                              //                   {
                              //                       label: 'Personne Physique',
                              //                       icon: 'pi pi-fw pi-user',
                              //                       routerLink: ['/membre/adhesion/pphysique']
                              //                   },
                              //                   {
                              //                       label: 'Personne Morale',
                              //                       icon: 'pi pi-fw pi-user',
                              //                       routerLink: ['/membre/adhesion/pmorale']
                              //                   }
                              //               ]
                              //           },

                              //           {
                              //               label: 'Compte',
                              //               icon: 'pi pi-fw pi-user',
                              //               items: [
                              //                   {
                              //                       label: 'Personne Physique',
                              //                       icon: 'pi pi-fw pi-inbox',
                              //                       routerLink: ['/membre/compte/cphysique']
                              //                   },
                              //                   {
                              //                       label: 'Personne Morale',
                              //                       icon: 'pi pi-fw pi-user',
                              //                       routerLink: ['/membre/compte/cmorale']
                              //                   }
                              //               ]
                              //           },
                              //           {
                              //               label: 'Liaison Compte',
                              //               icon: 'pi pi-fw pi-check-square',
                              //               routerLink: ['/membre/liaison']
                              //           }
                              //       ]
                              //   },
                              {
                                  label: 'Gestion stock',
                                  icon: 'pi pi-fw pi-hourglass',
                                  routerLink: ['/dashboards/stock']
                              },

                              // Correction P. Physique - Uniquement si l'utilisateur est autorisé
                              ...(this.user?.authorized
                                  ? [
                                        {
                                            label: 'Correction P. Physique ',
                                            icon: 'pi pi-fw pi-user-edit',
                                            routerLink: ['/dashboards/correction-physique']
                                        }
                                    ]
                                  : []),
                              {
                                  label: 'Correction En attente',
                                  icon: 'pi pi-fw pi-hourglass',
                                  routerLink: ['/dashboards/correction-en-attente']
                              },
                              {
                                  label: 'Mes avances de salaire',
                                  icon: 'pi pi-fw pi-list',
                                  routerLink: ['/dashboards/mes-demandes-salaire']
                              },
                              {
                                  label: 'Rapprochement Caisse',
                                  icon: 'pi pi-fw pi-calculator',
                                  routerLink: ['/dashboards/rapprochement-caisse']
                              },
                              {
                                  label: 'Changement Téléphone',
                                  icon: 'pi pi-fw pi-phone',
                                  routerLink: ['/dashboards/changement-telephone/agent']
                              }
                          ]
                        : this.user?.role === 'SUPER_ADMIN'
                          ? [
                                {
                                    label: 'Configuration Reseau',
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
                            ]
                          : this.user?.role === 'CAISSE'
                            ? [
                                  //
                                  //   {
                                  //       label: 'Configuration Reseau',
                                  //       icon: 'pi pi-fw pi-cog',
                                  //       routerLink: ['/dashboards/config']
                                  //   }
                              ]
                            : this.user?.role === 'MANAGER'
                              ? this.user?.service === 'Audit'
                                  ? [
                                        {
                                            label: 'Audit Rapprochement',
                                            icon: 'pi pi-fw pi-shield',
                                            routerLink: ['/dashboards/audit-rapprochement']
                                        },
                                        {
                                            label: 'Mes avances de salaire',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/dashboards/mes-demandes-salaire']
                                        }
                                    ]
                                  : this.user?.service === 'DSIG'
                                    ? [
                                          {
                                              label: 'document-verification',
                                              icon: 'pi pi-fw pi-folder',
                                              routerLink: ['/dashboards/document-verification']
                                          },
                                          {
                                              label: 'Actualiser décodeur',
                                              icon: 'pi pi-fw pi-sync',
                                              routerLink: ['/dashboards/actualiser-decodeur']
                                          },
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
                                              label: 'Mes avances de salaire',
                                              icon: 'pi pi-fw pi-list',
                                              routerLink: ['/dashboards/mes-demandes-salaire']
                                          }
                                      ]
                                    : this.user?.service === 'DE'
                                      ? [
                                            {
                                                label: 'Portefeuille crédits SAF',
                                                icon: 'pi pi-fw pi-wallet',
                                                routerLink: ['/dashboards/portefeuille-saf']
                                            },
                                            {
                                                label: 'Situation Stock',
                                                icon: 'pi pi-fw pi-box',
                                                routerLink: ['/dashboards/situation-stock']
                                            },
                                            {
                                                label: 'Mes avances de salaire',
                                                icon: 'pi pi-fw pi-list',
                                                routerLink: ['/dashboards/mes-demandes-salaire']
                                            },
                                            {
                                                label: 'suivi des Arrete de caisse',
                                                icon: 'pi pi-fw pi-mo',
                                                routerLink: ['/dashboards/suivi-arrete-caisse']
                                            },
                                            {
                                                label: 'Demandes Crédits validées par DE',
                                                icon: 'pi pi-fw pi-check-circle',
                                                routerLink: ['/dashboards/credits-valides-de']
                                            },
                                            {
                                                label: 'Rejets DG à confirmer',
                                                icon: 'pi pi-fw pi-exclamation-triangle',
                                                routerLink: ['/dashboards/rejets-dg-a-confirmer']
                                            }
                                        ]
                                      : this.user?.service === 'Logistique'
                                        ? []
                                        : this.user?.service === 'Societariat'
                                          ? []
                                          : this.user?.service === 'DRH'
                                            ? [
                                                  {
                                                      label: 'Gestion Personnel',
                                                      icon: 'pi pi-fw pi-hourglass',
                                                      routerLink: ['/dashboards/gestion-personnel']
                                                  },
                                                  {
                                                      label: 'Mes avances de salaire',
                                                      icon: 'pi pi-fw pi-list',
                                                      routerLink: ['/dashboards/mes-demandes-salaire']
                                                  }
                                              ]
                                            : this.user?.service === 'DF'
                                              ? [
                                                    {
                                                        label: 'Confirmation Avances (DF)',
                                                        icon: 'pi pi-fw pi-building',
                                                        routerLink: ['/dashboards']
                                                    },
                                                    {
                                                        label: 'Mes avances de salaire',
                                                        icon: 'pi pi-fw pi-list',
                                                        routerLink: ['/dashboards/mes-demandes-salaire']
                                                    }
                                                ]
                                              : this.user?.service === 'DI'
                                                ? [
                                                      {
                                                          label: 'Suivi Arrêtés de Caisse',
                                                          icon: 'pi pi-fw pi-money-bill',
                                                          routerLink: ['/dashboards/suivi-arrete-caisse']
                                                      },
                                                      {
                                                          label: 'Inspection Crédits (validés DR)',
                                                          icon: 'pi pi-fw pi-search-plus',
                                                          routerLink: ['/dashboards/inspection-credits']
                                                      },
                                                      {
                                                          label: 'Inspection Changement Téléphone',
                                                          icon: 'pi pi-fw pi-phone',
                                                          routerLink: ['/dashboards/changement-telephone/inspection']
                                                      },
                                                      {
                                                          label: 'Mes avances de salaire',
                                                          icon: 'pi pi-fw pi-list',
                                                          routerLink: ['/dashboards/mes-demandes-salaire']
                                                      }
                                                  ]
                                                : !this.user?.service
                                                  ? [
                                                        {
                                                            label: 'Demande Avance Salaire',
                                                            icon: 'pi pi-fw pi-wallet',
                                                            routerLink: ['/dashboards/demande-avance-salaire']
                                                        },
                                                        {
                                                            label: 'Mes avances de salaire',
                                                            icon: 'pi pi-fw pi-list',
                                                            routerLink: ['/dashboards/mes-demandes-salaire']
                                                        }
                                                    ]
                                                  : []
                              : this.user?.role === 'DF' || this.user?.service === 'DF'
                                ? [
                                      {
                                          label: 'Confirmation Avances (DF)',
                                          icon: 'pi pi-fw pi-building',
                                          routerLink: ['/dashboards/admin/df']
                                      },
                                      {
                                          label: 'Mes avances de salaire',
                                          icon: 'pi pi-fw pi-list',
                                          routerLink: ['/dashboards/mes-demandes-salaire']
                                      }
                                  ]
                                : this.user?.role === 'AGENT_CORRECTEUR'
                                  ? [
                                        {
                                            label: 'Correction P. Physique',
                                            icon: 'pi pi-fw pi-hourglass',
                                            routerLink: ['/dashboards/correction-physique']
                                        }
                                    ]
                                  : this.user?.role === 'DR'
                                    ? [
                                          {
                                              label: 'Portefeuille crédits SAF',
                                              icon: 'pi pi-fw pi-wallet',
                                              routerLink: ['/dashboards/portefeuille-saf']
                                          },
                                          {
                                              label: 'Suivi Societariat',
                                              icon: 'pi pi-fw pi-hourglass',
                                              routerLink: ['/dashboards/suivi-societariat']
                                          },
                                          {
                                              label: 'Mes avances de salaire',
                                              icon: 'pi pi-fw pi-list',
                                              routerLink: ['/dashboards/mes-demandes-salaire']
                                          },
                                          {
                                              label: 'suivi des Arrete de caisse',
                                              icon: 'pi pi-fw pi-money-bill',
                                              routerLink: ['/dashboards/suivi-arrete-caisse']
                                          },
                                          {
                                              label: 'Suivi Crédits de ma délégation',
                                              icon: 'pi pi-fw pi-chart-line',
                                              routerLink: ['/dashboards/suivi-credits-reseau']
                                          }
                                      ]
                                    : this.user?.role === 'USER' && this.user?.service === 'Personnel'
                                      ? [
                                            {
                                                label: 'Demande Avance Salaire',
                                                icon: 'pi pi-fw pi-wallet',
                                                routerLink: ['/dashboards/demande-avance-salaire']
                                            },
                                            {
                                                label: 'Mes Demandes',
                                                icon: 'pi pi-fw pi-list',
                                                routerLink: ['/dashboards/mes-demandes-salaire']
                                            }
                                        ]
                                      : this.user?.role === 'RA'
                                        ? [
                                              {
                                                  label: 'Mes avances de salaire',
                                                  icon: 'pi pi-fw pi-list',
                                                  routerLink: ['/dashboards/mes-demandes-salaire']
                                              },
                                              {
                                                  label: 'Suivi Societariat',
                                                  icon: 'pi pi-fw pi-hourglass',
                                                  routerLink: ['/dashboards/suivi-societariat']
                                              },
                                              {
                                                  label: 'suivi des Arrete de caisse',
                                                  icon: 'pi pi-fw pi-money-bill',
                                                  routerLink: ['/dashboards/suivi-arrete-caisse']
                                              },
                                              {
                                                  label: 'Outil Rapprochement Caisse',
                                                  icon: 'pi pi-fw pi-calculator',
                                                  routerLink: ['/dashboards/rapprochement-caisse-ra']
                                              }
                                          ]
                                        : this.user?.role === 'DA'
                                          ? [
                                                {
                                                    label: 'Portefeuille crédits SAF',
                                                    icon: 'pi pi-fw pi-wallet',
                                                    routerLink: ['/dashboards/portefeuille-saf']
                                                },
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
                                                    label: 'Mes avances de salaire',
                                                    icon: 'pi pi-fw pi-list',
                                                    routerLink: ['/dashboards/mes-demandes-salaire']
                                                },
                                                {
                                                    label: 'Suivi Societariat',
                                                    icon: 'pi pi-fw pi-hourglass',
                                                    routerLink: ['/dashboards/suivi-societariat']
                                                },
                                                {
                                                    label: 'suivi des Arrete de caisse',
                                                    icon: 'pi pi-fw pi-money-bill',
                                                    routerLink: ['/dashboards/suivi-arrete-caisse']
                                                },
                                                {
                                                    label: 'Validation Changement Téléphone',
                                                    icon: 'pi pi-fw pi-phone',
                                                    routerLink: ['/dashboards/changement-telephone/da']
                                                },
                                                {
                                                    label: 'Suivi Crédits de mon agence',
                                                    icon: 'pi pi-fw pi-chart-line',
                                                    routerLink: ['/dashboards/suivi-credits-reseau']
                                                }
                                            ]
                                          : this.user?.role === 'DG'
                                            ? [
                                                  {
                                                      label: 'Portefeuille crédits SAF',
                                                      icon: 'pi pi-fw pi-wallet',
                                                      routerLink: ['/dashboards/portefeuille-saf']
                                                  },
                                                  {
                                                      label: 'Crédits à valider (≥100M)',
                                                      icon: 'pi pi-fw pi-crown',
                                                      routerLink: ['/dashboards/credits-a-valider-dg']
                                                  },
                                                  {
                                                      label: 'Suivi Direction Exploitation',
                                                      icon: 'pi pi-fw pi-chart-line',
                                                      routerLink: ['/dashboards/dg-vue-de']
                                                  },
                                                  {
                                                      label: 'Suivi des Arrêtés de Caisse',
                                                      icon: 'pi pi-fw pi-money-bill',
                                                      routerLink: ['/dashboards/suivi-arrete-caisse']
                                                  }
                                              ]
                                            : [])
                ]
            },
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
        ];
    }
    ngOnChanges(changes: SimpleChanges) {
        // Re-initialize menu whenever user input changes
        if (changes['user']) {
            this.initializeMenu();
            this.chargerFonctions();
        }
    }
}
