import { NoteAnalyse } from '@/interface/note-analyse.model';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-note-analyse',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, CardModule, ButtonModule, RatingModule, TextareaModule],
    templateUrl: './note-analyse.component.html'
})
export class NoteAnalyseComponent {
    @Input() noteAnalyse?: NoteAnalyse;
    @Input() referenceCredit?: string;
    @Input() userId?: number;
    @Input() submitting: boolean = false;
    @Output() submitNote = new EventEmitter<NoteAnalyse>();

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

        const note: NoteAnalyse = {
            ...this.noteForm.value,
            referenceCredit: this.referenceCredit,
            createdAt: new Date(),
            statusNote: 'ACTIVE',
            userId: this.userId
        };

        this.submitNote.emit(note);
    }

    editNote(): void {
        if (this.noteAnalyse) {
            this.noteForm.patchValue({
                note: this.noteAnalyse.note,
                motif: this.noteAnalyse.motif
            });
            this.submitNote.emit(undefined);
        }
    }
}
