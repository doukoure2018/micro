import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-edit-user',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, InputTextarea, ButtonModule, ToastModule, ProgressSpinnerModule],
    templateUrl: './edit-user.component.html'
})
export class EditUserComponent implements OnInit {
    form!: FormGroup;
    loading = signal(false);
    saving = signal(false);
    user = signal<IUser | null>(null);

    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.form = this.fb.group({
            firstName: ['', [Validators.required, Validators.maxLength(50)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            address: [''],
            bio: ['']
        });

        const userId = Number(this.route.snapshot.paramMap.get('userId'));
        if (!Number.isFinite(userId) || userId <= 0) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Identifiant utilisateur invalide', life: 4000 });
            this.router.navigate(['/dashboards']);
            return;
        }

        this.loadUser(userId);
    }

    private loadUser(userId: number): void {
        this.loading.set(true);
        this.userService
            .getUserById$(userId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (user) => {
                    this.user.set(user);
                    this.form.patchValue({
                        firstName: user.firstName ?? '',
                        lastName: user.lastName ?? '',
                        email: user.email ?? '',
                        phone: user.phone ?? '',
                        address: user.address ?? '',
                        bio: user.bio ?? ''
                    });
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.message || 'Impossible de charger l’utilisateur', life: 5000 });
                }
            });
    }

    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const currentUser = this.user();
        if (!currentUser) {
            return;
        }

        this.saving.set(true);
        const payload = this.form.value;
        this.userService
            .updateUserById$(currentUser.userId, payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.saving.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur modifié avec succès', life: 3000 });
                    setTimeout(() => this.router.navigate(['/dashboards/admin']), 800);
                },
                error: (err) => {
                    this.saving.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.message || 'Échec de la mise à jour', life: 5000 });
                }
            });
    }

    cancel(): void {
        this.router.navigate(['/dashboards/admin']);
    }
}
