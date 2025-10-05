import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatReport',
    standalone: true
})
export class FormatReportPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '';

        // Remplace les tirets de séparation par des lignes plus visibles
        let formatted = value.replace(/[-]{3,}/g, '━'.repeat(50));
        formatted = formatted.replace(/[=]{3,}/g, '═'.repeat(50));

        return formatted;
    }
}
