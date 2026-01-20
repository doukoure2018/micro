import { Component, DestroyRef, ElementRef, HostListener, inject, Input, OnInit, signal, SimpleChanges, ViewChild } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@/layout/service/layout.service';
import { Ripple } from 'primeng/ripple';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MegaMenuModule } from 'primeng/megamenu';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadge } from 'primeng/overlaybadge';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Agence } from '@/interface/agence';
import { PointVente } from '@/interface/point.vente';

@Component({
    selector: '[app-topbar]',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, FormsModule, Ripple, InputText, ButtonModule, MegaMenuModule, BadgeModule, OverlayBadge],
    template: `
        <div class="layout-topbar-start">
            <a class="layout-topbar-logo" routerLink="/">
                <!-- Desktop Logo: Icon + Text -->
                <div class="layout-topbar-logo-full">
                    <img src="/layout/images/logo/icon.png" alt="DIGI-CREDIT Icon" class="logo-icon" />
                    <svg width="140" height="32" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-text">
                        <!-- D -->
                        <path d="M5 8 L5 24 L12 24 C15 24 17 22 17 16 C17 10 15 8 12 8 L5 8 Z M7 10 L11 10 C13 10 15 11 15 16 C15 21 13 22 11 22 L7 22 L7 10 Z" fill="var(--topbar-item-text-color)" />

                        <!-- I -->
                        <path d="M22 8 L22 24 L24 24 L24 8 L22 8 Z" fill="var(--topbar-item-text-color)" />

                        <!-- G -->
                        <path
                            d="M30 8 C27 8 25 10 25 16 C25 22 27 24 30 24 C32 24 34 23 34 21 L34 18 L31 18 L31 20 L32 20 C32 21 31 22 30 22 C28 22 27 21 27 16 C27 11 28 10 30 10 C31 10 32 11 32 12 L34 12 C34 9 32 8 30 8 Z"
                            fill="var(--topbar-item-text-color)"
                        />

                        <!-- I -->
                        <path d="M39 8 L39 24 L41 24 L41 8 L39 8 Z" fill="var(--topbar-item-text-color)" />

                        <!-- - (dash) -->
                        <path d="M46 15 L52 15 L52 17 L46 17 L46 15 Z" fill="var(--topbar-item-text-color)" />

                        <!-- C -->
                        <path d="M58 8 C55 8 53 10 53 16 C53 22 55 24 58 24 C60 24 62 23 62 21 L60 21 C60 22 59 22 58 22 C56 22 55 21 55 16 C55 11 56 10 58 10 C59 10 60 10 60 11 L62 11 C62 9 60 8 58 8 Z" fill="var(--topbar-item-text-color)" />

                        <!-- R -->
                        <path d="M67 8 L67 24 L69 24 L69 17 L72 17 L75 24 L77 24 L74 16 C75.5 15.5 76 14 76 12 C76 9 74 8 72 8 L67 8 Z M69 10 L71 10 C73 10 74 10.5 74 12 C74 13.5 73 14 71 14 L69 14 L69 10 Z" fill="var(--topbar-item-text-color)" />

                        <!-- G -->
                        <path
                            d="M83 8 C80 8 78 10 78 16 C78 22 80 24 83 24 C85 24 87 23 87 21 L87 18 L84 18 L84 20 L85 20 C85 21 84 22 83 22 C81 22 80 21 80 16 C80 11 81 10 83 10 C84 10 85 11 85 12 L87 12 C87 9 85 8 83 8 Z"
                            fill="var(--topbar-item-text-color)"
                        />
                    </svg>
                </div>

                <!-- Mobile Logo: Icon only -->
                <div class="layout-topbar-logo-slim">
                    <img src="/layout/images/logo/icon.png" alt="DIGI-CREDIT" class="logo-icon-mobile" />
                </div>
            </a>

            <a #menuButton class="layout-menu-button" (click)="onMenuButtonClick()">
                <i class="pi pi-chevron-right"></i>
            </a>

            <button class="app-config-button app-config-mobile-button" (click)="toggleConfigSidebar()">
                <i class="pi pi-cog"></i>
            </button>

            <a #mobileMenuButton class="layout-topbar-mobile-button" (click)="onTopbarMenuToggle()">
                <i class="pi pi-ellipsis-v"></i>
            </a>
        </div>

        <div class="layout-topbar-end">
            <div class="layout-topbar-actions-start">
                <!-- <p-megamenu [model]="model" styleClass="layout-megamenu" breakpoint="0px"></p-megamenu> -->
            </div>
            <div class="layout-topbar-actions-end">
                <ul class="layout-topbar-items">
                    <li class="layout-topbar-search">
                        <a pStyleClass="@next" enterFromClass="!hidden" enterActiveClass="animate-scalein" leaveToClass="!hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true" (click)="focusSearchInput()">
                            <i class="pi pi-search"></i>
                        </a>

                        <div class="layout-search-panel !hidden p-input-filled">
                            <i class="pi pi-search"></i>
                            <input #searchInput type="text" pInputText placeholder="Search" />
                            <button pButton pRipple type="button" icon="pi pi-times" rounded text pStyleClass=".layout-search-panel" leaveToClass="!hidden" leaveActiveClass="animate-fadeout"></button>
                        </div>
                    </li>
                    <li>
                        <button class="app-config-button" (click)="toggleConfigSidebar()">
                            <i class="pi pi-cog"></i>
                        </button>
                    </li>
                    @if (user?.role === 'DA') {
                        @if (state().demandeAttentes && state().demandeAttentes!.length > 0) {
                            <li>
                                <a (click)="toggleNotificationMenu()">
                                    <p-overlay-badge severity="warn" [value]="state().demandeAttentes!.length.toString()">
                                        <i class="pi pi-bell !align-middle"></i>
                                    </p-overlay-badge>
                                </a>
                                @if (notificationMenuVisible()) {
                                    <div class="notification-dropdown" (clickOutside)="closeNotificationMenu()">
                                        <!-- Header fixe -->
                                        <div class="notification-header px-4 py-3 border-b border-surface">
                                            <span class="font-semibold">
                                                Vous avez <b class="text-primary">{{ state().demandeAttentes!.length }}</b> nouvelle(s) demande(s)
                                            </span>
                                        </div>

                                        <!-- Liste scrollable -->
                                        <ul class="list-none p-0 m-0 notification-list">
                                            @for (demande of state().demandeAttentes!.slice(0, 10); track demande.demandeIndividuelId) {
                                                <li class="notification-item p-3 hover:bg-emphasis cursor-pointer transition-colors duration-150 border-b border-surface" (click)="viewDetailDemandeAttente(demande.demandeIndividuelId!)">
                                                    <div class="flex items-center gap-3">
                                                        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <i class="pi pi-user text-primary"></i>
                                                        </div>
                                                        <div class="flex flex-col flex-1 min-w-0">
                                                            <span class="font-semibold text-sm truncate"> {{ demande.nom }} {{ demande.prenom }} </span>
                                                            <small class="text-muted-color text-xs">
                                                                {{ demande.createdAt | date: 'dd/MM/yyyy à HH:mm' }}
                                                            </small>
                                                        </div>
                                                        <i class="pi pi-chevron-right text-muted-color text-xs"></i>
                                                    </div>
                                                </li>
                                            }

                                            @if (state().demandeAttentes!.length > 10) {
                                                <li class="p-3 text-center text-muted-color text-sm">
                                                    <i class="pi pi-info-circle mr-1"></i>
                                                    {{ state().demandeAttentes!.length - 10 }} autre(s) demande(s) non affichée(s)
                                                </li>
                                            }
                                        </ul>

                                        <!-- Footer fixe avec bouton -->
                                        <div class="notification-footer p-3 border-t border-surface bg-surface-ground">
                                            <p-button label="Voir toutes les demandes" icon="pi pi-external-link" styleClass="w-full" severity="secondary" [outlined]="true" (onClick)="viewAllDemandes()" />
                                        </div>
                                    </div>
                                }
                            </li>
                        } @else {
                            <li>
                                <a>
                                    <i class="pi pi-bell !align-middle"></i>
                                </a>
                            </li>
                        }
                    }

                    <li>
                        <a pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                            <i class="pi pi-table"></i>
                        </a>
                    </li>
                    <li>
                        <a pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                            <img [src]="user?.imageUrl" [alt]="user?.firstName" class="w-8 h-8" />
                        </a>
                        <div class="hidden">
                            <ul class="list-none p-0 m-0">
                                @if (user?.role === 'SUPER_ADMIN') {
                                    <li>
                                        <a class="cursor-pointer flex items-center hover:bg-emphasis duration-150 transition-all px-4 py-2" pRipple>
                                            <i class="pi pi-cog mr-2"></i>
                                            <span>Setting</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="cursor-pointer flex items-center hover:bg-emphasis duration-150 transition-all px-4 py-2" pRipple>
                                            <i class="pi pi-file-o mr-2"></i>
                                            <span>Terms of Usage</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="cursor-pointer flex items-center hover:bg-emphasis duration-150 transition-all px-4 py-2" pRipple>
                                            <i class="pi pi-compass mr-2"></i>
                                            <span>Support</span>
                                        </a>
                                    </li>
                                }
                                <li>
                                    <a (click)="logout()" class="cursor-pointer flex items-center hover:bg-emphasis duration-150 transition-all px-4 py-2" pRipple>
                                        <i class="pi pi-power-off mr-2"></i>
                                        <span>Logout</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <a (click)="onRightMenuButtonClick()">
                            <i class="pi pi-arrow-left"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    `,
    host: {
        class: 'layout-topbar'
    },
    styles: `
        :host ::ng-deep .p-overlaybadge .p-badge {
            outline-width: 0px;
        }

        .layout-topbar-logo {
            display: inline-block;
            text-decoration: none;
            transition: all 0.3s ease;
            padding: 8px;
            border-radius: 8px;
        }

        .layout-topbar-logo:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        /* Desktop logo: Icon + Text side by side */
        .layout-topbar-logo-full {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .logo-icon {
            height: 32px;
            width: auto;
            object-fit: contain;
            transition: all 0.3s ease;
        }

        .logo-text {
            height: 32px;
            transition: all 0.3s ease;
        }

        /* Mobile logo: Icon only */
        .layout-topbar-logo-slim {
            display: none;
        }

        .logo-icon-mobile {
            height: 28px;
            width: auto;
            object-fit: contain;
            transition: all 0.3s ease;
        }

        /* Hover effects */
        .layout-topbar-logo:hover .logo-icon,
        .layout-topbar-logo:hover .logo-icon-mobile {
            transform: scale(1.05);
            opacity: 0.9;
        }

        .layout-topbar-logo:hover .logo-text path {
            opacity: 0.9;
        }

        /* Responsive behavior */
        @media (max-width: 768px) {
            .layout-topbar-logo-full {
                display: none;
            }
            .layout-topbar-logo-slim {
                display: block;
            }
        }

        /* Ensure proper alignment */
        .layout-topbar-logo img,
        .layout-topbar-logo svg {
            vertical-align: middle;
        }

        /* Notification Dropdown */
        .notification-dropdown {
            width: 360px;
            max-width: 90vw;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .notification-header {
            background: var(--surface-ground);
            flex-shrink: 0;
        }

        .notification-list {
            max-height: 320px;
            overflow-y: auto;
            flex: 1;
        }

        /* Custom scrollbar */
        .notification-list::-webkit-scrollbar {
            width: 6px;
        }

        .notification-list::-webkit-scrollbar-track {
            background: var(--surface-ground);
        }

        .notification-list::-webkit-scrollbar-thumb {
            background: var(--surface-400);
            border-radius: 3px;
        }

        .notification-list::-webkit-scrollbar-thumb:hover {
            background: var(--surface-500);
        }

        .notification-footer {
            flex-shrink: 0;
        }

        .notification-item:last-of-type {
            border-bottom: none;
        }

        /* Mobile responsive */
        @media (max-width: 480px) {
            .notification-dropdown {
                width: 300px;
            }

            .notification-list {
                max-height: 250px;
            }
        }

        .notification-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            width: 360px;
            max-width: 90vw;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            background: var(--surface-overlay);
            z-index: 1000;
            animation: scaleIn 0.12s ease-out;
        }

        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .notification-header {
            background: var(--surface-ground);
            flex-shrink: 0;
        }

        .notification-list {
            max-height: 320px;
            overflow-y: auto;
            flex: 1;
        }

        .notification-list::-webkit-scrollbar {
            width: 6px;
        }

        .notification-list::-webkit-scrollbar-track {
            background: var(--surface-ground);
        }

        .notification-list::-webkit-scrollbar-thumb {
            background: var(--surface-400);
            border-radius: 3px;
        }

        .notification-list::-webkit-scrollbar-thumb:hover {
            background: var(--surface-500);
        }

        .notification-footer {
            flex-shrink: 0;
        }

        .notification-item:last-of-type {
            border-bottom: none;
        }

        @media (max-width: 480px) {
            .notification-dropdown {
                width: 300px;
            }

            .notification-list {
                max-height: 250px;
            }
        }
    `
})
export class AppTopbar {
    @Input() user?: IUser;
    notificationMenuVisible = signal(false);
    state = signal<{ pointVente?: PointVente; agence?: Agence; demandeAttentes?: DemandeIndividuel[]; loading: boolean; message: string | undefined; error: string | any }>({
        loading: false,
        message: undefined,
        error: undefined
    });
    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    layoutService = inject(LayoutService);
    elementRef: any;

    // Fermer le menu au clic extérieur
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const notificationDropdown = this.elementRef.nativeElement.querySelector('.notification-dropdown');
        const bellIcon = this.elementRef.nativeElement.querySelector('.pi-bell')?.closest('a');

        if (notificationDropdown && bellIcon) {
            const clickedInsideDropdown = notificationDropdown.contains(target);
            const clickedOnBell = bellIcon.contains(target);

            if (!clickedInsideDropdown && !clickedOnBell) {
                this.closeNotificationMenu();
            }
        }
    }

    toggleNotificationMenu(): void {
        this.notificationMenuVisible.update((v) => !v);
    }

    closeNotificationMenu(): void {
        this.notificationMenuVisible.set(false);
    }

    viewDetailDemandeAttente(demandeIndividuelId: number): void {
        this.closeNotificationMenu();
        this.router.navigate(['/dashboards/credit/individuel/attente/detail/', demandeIndividuelId]);
    }

    viewAllDemandes(): void {
        this.closeNotificationMenu();
        this.router.navigate(['/dashboards/credit/individuel/attente']);
    }

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild('menuButton') menuButton!: ElementRef<HTMLButtonElement>;
    @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef<HTMLButtonElement>;

    private loadDemandeAttente(): void {
        this.state.update((state) => ({ ...state, loading: true }));
        this.userService
            .getAllDemandeAttente$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('API Response:', response);

                    this.state.update((state) => ({
                        ...state,
                        demandeAttentes: response.data.demandeAttentes,
                        agence: response.data.agence,
                        pointVente: response.data.pointVente || null,
                        loading: false
                    }));
                },
                error: (error) => {
                    console.error('API Error:', error);
                    this.state.update((state) => ({ ...state, error, loading: false }));
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Only load if user role is DA
        if (this.user?.role === 'DA') {
            this.loadDemandeAttente();
        }
    }
    model: MegaMenuItem[] = [
        {
            label: 'UI KIT',
            items: [
                [
                    {
                        label: 'UI KIT 1',
                        items: [
                            { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
                            { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
                            { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
                            { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button' },
                            { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' }
                        ]
                    }
                ],
                [
                    {
                        label: 'UI KIT 2',
                        items: [
                            { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
                            { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
                            { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
                            { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
                            { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' }
                        ]
                    }
                ],
                [
                    {
                        label: 'UI KIT 3',
                        items: [
                            { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
                            { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
                            { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu' },
                            { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
                            { label: 'Misc', icon: 'pi pi-fw pi-circle-off', to: '/uikit/misc' }
                        ]
                    }
                ]
            ]
        },
        {
            label: 'UTILITIES',
            items: [
                [
                    {
                        label: 'UTILITIES 1',
                        items: [
                            {
                                label: 'Buy Now',
                                icon: 'pi pi-fw pi-shopping-cart',
                                url: 'https://www.primefaces.org/store',
                                target: '_blank'
                            },
                            {
                                label: 'Documentation',
                                icon: 'pi pi-fw pi-info-circle',
                                to: '/documentation'
                            }
                        ]
                    }
                ]
            ]
        }
    ];

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onRightMenuButtonClick() {
        this.layoutService.openRightMenu();
    }

    toggleConfigSidebar() {
        let layoutState = this.layoutService.layoutState();

        if (this.layoutService.isSidebarActive()) {
            layoutState.overlayMenuActive = false;
            layoutState.overlaySubmenuActive = false;
            layoutState.staticMenuMobileActive = false;
            layoutState.menuHoverActive = false;
            layoutState.configSidebarVisible = false;
        }
        layoutState.configSidebarVisible = !layoutState.configSidebarVisible;
        this.layoutService.layoutState.set({ ...layoutState });
    }

    focusSearchInput() {
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 150);
    }

    onTopbarMenuToggle() {
        this.layoutService.layoutState.update((val) => ({ ...val, topbarMenuActive: !val.topbarMenuActive }));
    }

    public logout(): void {
        this.userService.logOut();
        this.router.navigate([``]);
    }
}
