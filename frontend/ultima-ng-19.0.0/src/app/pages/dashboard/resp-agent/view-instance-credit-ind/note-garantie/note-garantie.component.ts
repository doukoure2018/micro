import { NoteGarantie } from '@/interface/note-garantie.model';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-note-garantie',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, CardModule, ButtonModule, RatingModule, TextareaModule],
    templateUrl: './note-garantie.component.html'
})
export class NoteGarantieComponent {
    @Input() noteGarantie?: NoteGarantie;
    @Input() referenceCredit?: string;
    @Input() userId?: number;
    @Input() submitting: boolean = false;
    @Output() submitNote = new EventEmitter<NoteGarantie>();

    noteForm!: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.noteForm = this.fb.group({
            note: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
            motif: ['', Validators.required]
        });
    }

    submit(): void {
        if (this.noteForm.invalid) {
            return;
        }

        const note: NoteGarantie = {
            ...this.noteForm.value,
            referenceCredit: this.referenceCredit,
            createdAt: new Date(),
            statusNote: 'ACTIVE',
            userId: this.userId
        };

        this.submitNote.emit(note);
    }

    editNote(): void {
        if (this.noteGarantie) {
            this.noteForm.patchValue({
                note: this.noteGarantie.note,
                motif: this.noteGarantie.motif
            });
            this.submitNote.emit(undefined);
        }
    }
}
