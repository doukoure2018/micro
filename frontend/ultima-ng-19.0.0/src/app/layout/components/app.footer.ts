import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    standalone: true,
    selector: '[app-footer]',
    imports: [ButtonModule],
    template: `
        <div class="footer-bottom">
            <div class="footer-copyright">
                <span class="text-muted-color"> © {{ currentYear }} DIGI-CREDIT. Tous droits réservés. </span>
            </div>
            <div class="footer-version">
                <span class="text-muted-color text-sm"> Version 1.0.0 </span>
            </div>
        </div>
    `,
    host: {
        class: 'layout-footer'
    },
    styles: `
        :host {
            display: block;
            margin-top: auto;
        }

        .footer-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
            background: white;
            border-top: 1px solid var(--surface-border);
            max-width: 100%;
        }

        .footer-copyright {
            font-size: 0.875rem;
        }

        .footer-version {
            font-size: 0.75rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .footer-bottom {
                flex-direction: column;
                gap: 0.5rem;
                text-align: center;
                padding: 1rem;
            }
        }

        /* Dark theme - override to keep white background */
        :host-context(.dark) .footer-bottom {
            background: white;
            color: #6b7280; /* Ensure text is readable on white background in dark mode */
        }

        :host-context(.dark) .footer-bottom .text-muted-color {
            color: #6b7280 !important;
        }
    `
})
export class AppFooter {
    layoutService = inject(LayoutService);
    currentYear = new Date().getFullYear();
}
