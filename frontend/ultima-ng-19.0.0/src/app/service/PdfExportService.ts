import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PdfExportService {
    /**
     * Exporte le contenu du rapport détaillé en PDF
     * @param content Le contenu texte à exporter
     * @param filename Le nom du fichier PDF (optionnel)
     */
    exportReportToPdf(content: string, filename: string = 'rapport_rapprochement.pdf'): void {
        // Méthode 1: Utilisation de l'API d'impression du navigateur (simple et efficace)
        this.printToPdfUsingBrowser(content, filename);
    }

    /**
     * Utilise l'API d'impression du navigateur pour générer un PDF
     */
    private printToPdfUsingBrowser(content: string, filename: string): void {
        // Créer une nouvelle fenêtre pour l'impression
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        if (!printWindow) {
            console.error("Impossible d'ouvrir la fenêtre d'impression");
            return;
        }

        // Créer le contenu HTML avec styles pour l'impression
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Rapport de Rapprochement de Caisse</title>
                <style>
                    @page {
                        size: A4;
                        margin: 20mm;
                    }
                    
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        line-height: 1.5;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #333;
                    }
                    
                    .header h1 {
                        margin: 0;
                        font-size: 18px;
                        font-weight: bold;
                    }
                    
                    .header .date {
                        margin-top: 5px;
                        font-size: 12px;
                        color: #666;
                    }
                    
                    .content {
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        background-color: #f9f9f9;
                        padding: 15px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    
                    .footer {
                        margin-top: 30px;
                        padding-top: 10px;
                        border-top: 1px solid #ccc;
                        text-align: center;
                        font-size: 10px;
                        color: #666;
                    }
                    
                    @media print {
                        body {
                            padding: 0;
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
                
                <div class="content">${this.escapeHtml(content)}</div>
                
                <div class="footer">
                    Page <span class="page-number"></span>
                    <br>
                    © ${new Date().getFullYear()} - Système de Rapprochement
                </div>
            </body>
            </html>
        `;

        // Écrire le contenu dans la nouvelle fenêtre
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Attendre que le contenu soit chargé puis lancer l'impression
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                // Fermer la fenêtre après un délai
                setTimeout(() => {
                    printWindow.close();
                }, 100);
            }, 250);
        };
    }

    /**
     * Méthode alternative utilisant jsPDF (nécessite l'installation de jspdf)
     * npm install jspdf @types/jspdf
     */
    async exportToPdfWithJsPDF(content: string, filename: string = 'rapport_rapprochement.pdf'): Promise<void> {
        try {
            // Dynamically import jsPDF
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
                top: 25,
                bottom: 25,
                left: 20,
                right: 20
            };
            const lineHeight = 5;
            const fontSize = 10;

            // Ajouter l'en-tête
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('RAPPORT DE RAPPROCHEMENT DE CAISSE', pageWidth / 2, margins.top, { align: 'center' });

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Généré le : ${new Date().toLocaleString('fr-FR')}`, pageWidth / 2, margins.top + 8, { align: 'center' });

            // Ligne de séparation
            doc.line(margins.left, margins.top + 12, pageWidth - margins.right, margins.top + 12);

            // Configurer la police pour le contenu
            doc.setFontSize(fontSize);
            doc.setFont('courier', 'normal');

            // Diviser le contenu en lignes
            const lines = content.split('\n');
            let y = margins.top + 20;
            let pageNumber = 1;

            for (const line of lines) {
                // Vérifier si nous devons passer à la page suivante
                if (y + lineHeight > pageHeight - margins.bottom) {
                    // Ajouter le numéro de page
                    doc.setFontSize(8);
                    doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

                    // Nouvelle page
                    doc.addPage();
                    pageNumber++;
                    y = margins.top;
                    doc.setFontSize(fontSize);
                }

                // Gérer les lignes trop longues
                const wrappedText = doc.splitTextToSize(line || ' ', pageWidth - margins.left - margins.right);

                for (const wrappedLine of wrappedText) {
                    if (y + lineHeight > pageHeight - margins.bottom) {
                        doc.setFontSize(8);
                        doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                        doc.addPage();
                        pageNumber++;
                        y = margins.top;
                        doc.setFontSize(fontSize);
                    }

                    doc.text(wrappedLine, margins.left, y);
                    y += lineHeight;
                }
            }

            // Ajouter le numéro de la dernière page
            doc.setFontSize(8);
            doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

            // Sauvegarder le PDF
            doc.save(filename);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF avec jsPDF:', error);
            // Fallback vers la méthode d'impression du navigateur
            this.printToPdfUsingBrowser(content, filename);
        }
    }

    /**
     * Méthode utilisant Blob et iframe (sans dépendances externes)
     */
    exportToPdfUsingBlob(content: string, filename: string = 'rapport_rapprochement.pdf'): void {
        // Créer un iframe caché pour l'impression
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

        // Créer le contenu HTML
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
                        font-family: 'Courier New', monospace;
                        font-size: 11px;
                        line-height: 1.4;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #000;
                    }
                    
                    .header h1 {
                        margin: 0 0 5px 0;
                        font-size: 16px;
                    }
                    
                    .header .subtitle {
                        font-size: 11px;
                        color: #555;
                    }
                    
                    .content {
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        font-size: 10px;
                    }
                    
                    .page-break {
                        page-break-after: always;
                    }
                    
                    @media print {
                        .no-print {
                            display: none !important;
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

        // Attendre le chargement puis imprimer
        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow?.print();
                // Retirer l'iframe après impression
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 100);
            }, 100);
        };
    }

    /**
     * Échappe les caractères HTML pour éviter l'injection
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
