import { Component, ElementRef, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { IUser } from '@/interface/user';

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

    @ViewChild('menuContainer') menuContainer!: ElementRef;

    model: MenuItem[] = [];

    ngOnInit() {
        this.initializeMenu();
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
                    ...(this.user?.role === 'AGENT_CREDIT'
                        ? [
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
                              }
                          ]
                        : this.user?.role === 'SUPER_ADMIN'
                          ? [
                                {
                                    label: 'Configuration Reseau',
                                    icon: 'pi pi-fw pi-cog',
                                    routerLink: ['/dashboards/config']
                                }
                            ]
                          : this.user?.role === 'CAISSE'
                            ? [
                                  //   {
                                  //       label: 'Configuration Reseau',
                                  //       icon: 'pi pi-fw pi-cog',
                                  //       routerLink: ['/dashboards/config']
                                  //   }
                              ]
                            : this.user?.role === 'MANAGER'
                              ? this.user?.service === 'DSIG'
                                  ? [
                                        {
                                            label: 'document-verification',
                                            icon: 'pi pi-fw pi-folder',
                                            routerLink: ['/dashboards/document-verification']
                                        }
                                    ]
                                  : this.user?.service === 'DE'
                                    ? [
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
                                              label: 'Suivi Societariat',
                                              icon: 'pi pi-fw pi-hourglass',
                                              routerLink: ['/dashboards/suivi-societariat']
                                          },
                                          {
                                              label: 'Mes avances de salaire',
                                              icon: 'pi pi-fw pi-list',
                                              routerLink: ['/dashboards/mes-demandes-salaire']
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
                                              }
                                          ]
                                        : this.user?.role === 'DA'
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
                                                }
                                            ]
                                          : [])
                ]
            }
        ];
    }
    ngOnChanges(changes: SimpleChanges) {
        // Re-initialize menu whenever user input changes
        if (changes['user']) {
            this.initializeMenu();
        }
    }
}
