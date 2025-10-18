import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-agent-caisse',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, CardModule, ToastModule, DialogModule, ProgressSpinnerModule, DividerModule],
    templateUrl: './agent-caisse.component.html',
    styleUrl: './agent-caisse.component.scss',
    providers: [MessageService]
})
export class AgentCaisseComponent {}
