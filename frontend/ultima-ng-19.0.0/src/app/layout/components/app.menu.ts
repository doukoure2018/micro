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

                              {
                                  label: 'Correction En attente',
                                  icon: 'pi pi-fw pi-hourglass',
                                  routerLink: ['/dashboards/correction-en-attente']
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
                              ? [
                                    {
                                        label: 'Document Verification',
                                        icon: 'pi pi-fw pi-hourglass',
                                        routerLink: ['/dashboards/document-verification']
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
