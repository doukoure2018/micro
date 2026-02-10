import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CollecteService {
    private apiUrl = `${environment.apiBaseUrl}/ecredit/collecte`;

    constructor(private http: HttpClient) {}

    createCollecte(demandeId: number, body: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/${demandeId}`, body);
    }

    getCollecteByDemande(demandeId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/demande/${demandeId}`);
    }

    getCollecteComplete(collecteId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${collecteId}`);
    }

    updateSection1(collecteId: number, body: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${collecteId}/section1`, body);
    }

    updateSection2(collecteId: number, body: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${collecteId}/section2`, body);
    }

    updateSection3(collecteId: number, body: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${collecteId}/section3`, body);
    }

    updateSection4(collecteId: number, body: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${collecteId}/section4`, body);
    }

    updateSection5(collecteId: number, body: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${collecteId}/section5`, body);
    }

    updateSection6(collecteId: number, body: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${collecteId}/section6`, body);
    }

    updateSection7(collecteId: number, body: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${collecteId}/section7`, body);
    }

    updateSection8(collecteId: number, body: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${collecteId}/section8`, body);
    }

    updateSection9(collecteId: number, body: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${collecteId}/section9`, body);
    }

    deleteCollecte(collecteId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${collecteId}`);
    }

    getAmortissements(collecteId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${collecteId}/amortissements`);
    }

    addAmortissement(collecteId: number, body: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/${collecteId}/amortissements`, body);
    }

    updateAmortissement(amortId: number, body: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/amortissements/${amortId}`, body);
    }

    deleteAmortissement(amortId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/amortissements/${amortId}`);
    }

    recalculerAmortissements(collecteId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${collecteId}/amortissements/recalculer`, {});
    }
}
