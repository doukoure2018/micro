import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PdfExportService {
    /**
     * Exporte le contenu du rapport détaillé en PDF avec mise en forme améliorée
     */
    exportReportToPdf(content: string, filename: string = 'rapport_rapprochement.pdf'): void {
        this.printToPdfUsingBrowser(content, filename);
    }

    /**
     * Utilise l'API d'impression du navigateur avec styles améliorés
     */
    private printToPdfUsingBrowser(content: string, filename: string): void {
        const printWindow = window.open('', '_blank', 'width=900,height=700');

        if (!printWindow) {
            console.error("Impossible d'ouvrir la fenêtre d'impression");
            return;
        }

        // HTML avec styles améliorés pour le texte en gras
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Rapport de Rapprochement de Caisse</title>
                <style>
                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                    
                    body {
                        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                        font-size: 11px;
                        font-weight: 600; /* Texte en semi-bold */
                        line-height: 1.6;
                        color: #000000; /* Noir pur pour meilleure impression */
                        margin: 0;
                        padding: 20px;
                        background-color: white;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 15px;
                        border-bottom: 3px solid #000;
                    }
                    
                    .header h1 {
                        margin: 0;
                        font-size: 20px;
                        font-weight: bold;
                        color: #000;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    .header .date {
                        margin-top: 10px;
                        font-size: 12px;
                        font-weight: normal;
                        color: #333;
                    }
                    
                    .header .subtitle {
                        margin-top: 5px;
                        font-size: 14px;
                        font-weight: bold;
                        color: #222;
                    }
                    
                    .content {
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        background-color: #fafafa;
                        padding: 20px;
                        border: 2px solid #333;
                        border-radius: 5px;
                        font-weight: bold; /* Contenu en gras */
                        font-size: 12px; /* Taille augmentée pour meilleure lisibilité */
                        letter-spacing: 0.2px;
                        line-height: 1.8;
                    }
                    
                    /* Styles pour améliorer la lisibilité des montants */
                    .content strong {
                        font-weight: 900;
                        text-decoration: underline;
                    }
                    
                    .footer {
                        margin-top: 30px;
                        padding-top: 15px;
                        border-top: 2px solid #333;
                        text-align: center;
                        font-size: 10px;
                        font-weight: normal;
                        color: #555;
                    }
                    
                    .page-break {
                        page-break-after: always;
                    }
                    
                    @media print {
                        body {
                            padding: 0;
                            font-weight: 700; /* Plus gras pour l'impression */
                        }
                        
                        .content {
                            background-color: white;
                            border: 2px solid #000;
                            font-weight: 700;
                        }
                        
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>RAPPORT DE RAPPROCHEMENT DE CAISSE</h1>
                    <div class="date">Généré le : ${new Date().toLocaleString('fr-FR')}</div>
                </div>
                
                <div class="content">${this.formatContentForPdf(content)}</div>
                
                <div class="footer">
                    <div>© ${new Date().getFullYear()} - Système de Rapprochement</div>
                    <div>Document généré automatiquement</div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                setTimeout(() => {
                    printWindow.close();
                }, 100);
            }, 250);
        };
    }

    /**
     * Méthode améliorée avec jsPDF pour texte en gras
     */
    async exportToPdfWithJsPDF(content: string, filename: string = 'rapport_rapprochement.pdf'): Promise<void> {
        try {
            const jsPDFModule = await import('jspdf');
            const jsPDF = jsPDFModule.default;

            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Configuration
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;
            const margins = {
                top: 20,
                bottom: 20,
                left: 15,
                right: 15
            };
            const lineHeight = 5.5;
            const fontSize = 11;

            // En-tête avec style amélioré
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('RAPPORT DE RAPPROCHEMENT DE CAISSE', pageWidth / 2, margins.top, { align: 'center' });

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`Généré le : ${new Date().toLocaleString('fr-FR')}`, pageWidth / 2, margins.top + 10, { align: 'center' });

            // Ligne de séparation épaisse
            doc.setLineWidth(0.5);
            doc.line(margins.left, margins.top + 15, pageWidth - margins.right, margins.top + 15);

            // Contenu en gras
            doc.setFontSize(fontSize);
            doc.setFont('courier', 'bold'); // Police Courier en gras

            const lines = content.split('\n');
            let y = margins.top + 25;
            let pageNumber = 1;

            for (const line of lines) {
                if (y + lineHeight > pageHeight - margins.bottom) {
                    // Numéro de page
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

                    doc.addPage();
                    pageNumber++;
                    y = margins.top;

                    // Retour au style gras pour le contenu
                    doc.setFontSize(fontSize);
                    doc.setFont('courier', 'bold');
                }

                const wrappedText = doc.splitTextToSize(line || ' ', pageWidth - margins.left - margins.right);

                for (const wrappedLine of wrappedText) {
                    if (y + lineHeight > pageHeight - margins.bottom) {
                        doc.setFontSize(9);
                        doc.setFont('helvetica', 'normal');
                        doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

                        doc.addPage();
                        pageNumber++;
                        y = margins.top;

                        doc.setFontSize(fontSize);
                        doc.setFont('courier', 'bold');
                    }

                    doc.text(wrappedLine, margins.left, y);
                    y += lineHeight;
                }
            }

            // Dernière page
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

            doc.save(filename);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF avec jsPDF:', error);
            this.printToPdfUsingBrowser(content, filename);
        }
    }

    /**
     * Export avec iframe et styles améliorés
     */
    exportToPdfUsingBlob(content: string, filename: string = 'rapport_rapprochement.pdf'): void {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow?.document;
        if (!iframeDoc) {
            console.error("Impossible de créer l'iframe pour l'impression");
            document.body.removeChild(iframe);
            return;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Rapport de Rapprochement</title>
                <style>
                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                    
                    body {
                        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                        font-size: 12px;
                        font-weight: bold;
                        line-height: 1.7;
                        margin: 0;
                        padding: 0;
                        color: #000;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 25px;
                        padding-bottom: 15px;
                        border-bottom: 3px solid #000;
                    }
                    
                    .header h1 {
                        margin: 0 0 10px 0;
                        font-size: 18px;
                        font-weight: bold;
                        text-transform: uppercase;
                    }
                    
                    .header .subtitle {
                        font-size: 12px;
                        font-weight: normal;
                        color: #333;
                    }
                    
                    .content {
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        font-size: 11px;
                        font-weight: 700;
                        letter-spacing: 0.3px;
                        line-height: 1.8;
                        padding: 15px;
                        border: 1px solid #000;
                        background-color: #fafafa;
                    }
                    
                    @media print {
                        body {
                            font-weight: 700;
                        }
                        .content {
                            background-color: white;
                            font-weight: 700;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>RAPPORT DE RAPPROCHEMENT DE CAISSE</h1>
                    <div class="subtitle">Généré le ${new Date().toLocaleString('fr-FR')}</div>
                </div>
                <div class="content">${this.escapeHtml(content)}</div>
            </body>
            </html>
        `;

        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow?.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 100);
            }, 100);
        };
    }

    /**
     * Formate le contenu pour améliorer la lisibilité dans le PDF
     */
    private formatContentForPdf(content: string): string {
        // Échappe le HTML et préserve les espaces
        let formatted = this.escapeHtml(content);

        // Remplace les lignes de séparation par des versions plus visibles
        formatted = formatted.replace(/[-=]{3,}/g, (match) => {
            return match.replace(/-/g, '━').replace(/=/g, '═');
        });

        return formatted;
    }

    /**
     * Échappe les caractères HTML
     */
    private escapeHtml(text: string): string {
        const map: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    /**
     * Génère un nom de fichier avec horodatage
     */
    generateFilename(prefix: string = 'rapport'): string {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
        return `${prefix}_${dateStr}_${timeStr}.pdf`;
    }
}
