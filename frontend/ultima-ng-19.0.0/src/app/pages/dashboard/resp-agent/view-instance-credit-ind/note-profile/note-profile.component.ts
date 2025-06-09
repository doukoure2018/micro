import { NoteProfile } from '@/interface/note-profile.model';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-note-profile',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, CardModule, ButtonModule, RatingModule, TextareaModule],
    templateUrl: './note-profile.component.html'
})
export class NoteProfileComponent {
    @Input() noteProfile?: NoteProfile;
    @Input() referenceCredit?: string;
    @Input() userId?: number;
    @Input() submitting: boolean = false;
    @Output() submitNote = new EventEmitter<NoteProfile>();

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

        const note: NoteProfile = {
            ...this.noteForm.value,
            referenceCredit: this.referenceCredit,
            createdAt: new Date(),
            statusNote: 'ACTIVE',
            userId: this.userId
        };

        this.submitNote.emit(note);
    }

    editNote(): void {
        if (this.noteProfile) {
            this.noteForm.patchValue({
                note: this.noteProfile.note,
                motif: this.noteProfile.motif
            });
            this.submitNote.emit(undefined);
        }
    }
}
