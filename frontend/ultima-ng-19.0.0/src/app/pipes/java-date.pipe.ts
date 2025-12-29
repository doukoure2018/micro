import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'javaDate',
    standalone: true
})
export class JavaDatePipe implements PipeTransform {
    transform(value: any, format: string = 'dd/MM/yyyy HH:mm'): string {
        if (!value) return '-';

        let date: Date;

        try {
            // Si c'est un tableau [year, month, day, hour, minute, second, nano]
            if (Array.isArray(value)) {
                const [year, month, day, hour = 0, minute = 0, second = 0] = value;
                date = new Date(year, month - 1, day, hour, minute, second);
            }
            // Si c'est une chaîne avec des virgules "2025,12,27,10,0,10,857913000"
            else if (typeof value === 'string' && value.includes(',')) {
                const parts = value.split(',').map(Number);
                const [year, month, day, hour = 0, minute = 0, second = 0] = parts;
                date = new Date(year, month - 1, day, hour, minute, second);
            }
            // Si c'est déjà une date ISO string ou Date
            else {
                date = new Date(value);
            }

            // Vérifier si la date est valide
            if (isNaN(date.getTime())) {
                return '-';
            }

            return this.formatDate(date, format);
        } catch (error) {
            console.error('JavaDatePipe error:', error);
            return '-';
        }
    }

    private formatDate(date: Date, format: string): string {
        const pad = (n: number) => (n < 10 ? '0' + n : n.toString());

        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return format.replace('dd', day).replace('MM', month).replace('yyyy', year.toString()).replace('HH', hours).replace('mm', minutes).replace('ss', seconds);
    }
}
