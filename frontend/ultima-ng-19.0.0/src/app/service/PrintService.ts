import { Injectable } from '@angular/core';
import { Personnecaution } from '@/interface/personnecaution';

export interface AnalyseSynthesePrint {
    analyseId: number;
    demandeindividuelId: number;
    dateEvaluation: string;
    cycleAffaires: string;
    facteurCycle: number;
    typeCdr: string;
    valeurGarantie: number;

    // Demande data
    montantDemande: number;
    dureeDemande: number;
    nombreEcheance: number;
    echeance: number;
    objectCredit: string;
    periodiciteRemboursement: string;

    // Proposition data
    montantPropose: number;
    dureeProposee: number;
    nombreEcheancePropose: number;
    echeanceProposee: number;

    // BILAN N
    terrainN: number;
    batimentMagasinN: number;
    installationAgencementN: number;
    materielIndustrielN: number;
    mobilierBureauN: number;
    materielInformatiqueN: number;
    materielTransportN: number;
    autreImmobilisationN: number;
    stocksN: number;
    creancesClientsN: number;
    tresorerieCaisseBanqueN: number;
    empruntLongTermeN: number;
    empruntCourtTermeN: number;
    autresDettesN: number;
    totalImmobilisationsN: number;
    totalActifN: number;
    totalDettesN: number;
    capitauxPropresN: number;
    fondsRoulementN: number;
    besoinFondsRoulementN: number;

    // BILAN N-1
    terrainN1: number;
    batimentMagasinN1: number;
    installationAgencementN1: number;
    materielIndustrielN1: number;
    mobilierBureauN1: number;
    materielInformatiqueN1: number;
    materielTransportN1: number;
    autreImmobilisationN1: number;
    stocksN1: number;
    creancesClientsN1: number;
    tresorerieCaisseBanqueN1: number;
    empruntLongTermeN1: number;
    empruntCourtTermeN1: number;
    autresDettesN1: number;
    totalImmobilisationsN1: number;
    totalActifN1: number;
    totalDettesN1: number;
    capitauxPropresN1: number;
    fondsRoulementN1: number;
    besoinFondsRoulementN1: number;

    // RENTABILITÉ N
    chiffreAffairesN: number;
    coutAchatMarchandisesN: number;
    margeBruteN: number;
    salairesN: number;
    prelevementEntrepreneurN: number;
    loyersN: number;
    transportN: number;
    electriciteEauTelephoneN: number;
    fournituresAutresBesoinsN: number;
    entretienReparationN: number;
    carburantLubrifiantsN: number;
    publicitePromotionN: number;
    impotsTaxesN: number;
    fraisBancairesInteretsN: number;
    echeanceAutreCreditN: number;
    diversesChargesN: number;
    amortissementsProvisionsN: number;
    autresRevenusHorsActiviteN: number;
    totalChargesExploitationN: number;
    resultatExploitationN: number;
    cashFlowN: number;
    capaciteRemboursementN: number;

    // RENTABILITÉ N-1
    chiffreAffairesN1: number;
    coutAchatMarchandisesN1: number;
    margeBruteN1: number;
    salairesN1: number;
    prelevementEntrepreneurN1: number;
    loyersN1: number;
    transportN1: number;
    electriciteEauTelephoneN1: number;
    fournituresAutresBesoinsN1: number;
    entretienReparationN1: number;
    carburantLubrifiantsN1: number;
    publicitePromotionN1: number;
    impotsTaxesN1: number;
    fraisBancairesInteretsN1: number;
    echeanceAutreCreditN1: number;
    diversesChargesN1: number;
    amortissementsProvisionsN1: number;
    autresRevenusHorsActiviteN1: number;
    totalChargesExploitationN1: number;
    resultatExploitationN1: number;
    cashFlowN1: number;
    capaciteRemboursementN1: number;

    // RENTABILITÉ N+1
    chiffreAffairesNplus1: number;
    coutAchatMarchandisesNplus1: number;
    margeBruteNplus1: number;
    salairesNplus1: number;
    prelevementEntrepreneurNplus1: number;
    loyersNplus1: number;
    transportNplus1: number;
    electriciteEauTelephoneNplus1: number;
    fournituresAutresBesoinsNplus1: number;
    entretienReparationNplus1: number;
    carburantLubrifiantsNplus1: number;
    publicitePromotionNplus1: number;
    impotsTaxesNplus1: number;
    fraisBancairesInteretsNplus1: number;
    echeanceAutreCreditNplus1: number;
    diversesChargesNplus1: number;
    amortissementsProvisionsNplus1: number;
    autresRevenusHorsActiviteNplus1: number;
    totalChargesExploitationNplus1: number;
    resultatExploitationNplus1: number;
    cashFlowNplus1: number;
    capaciteRemboursementNplus1: number;

    // BESOIN CREDIT - Investissement
    coutEquipement: number;
    ajustCoutEquipement: number;
    depensesRattachees: number;
    ajustDepensesRattachees: number;
    apportPersonnel: number;
    ajustApportPersonnel: number;
    besoinReelInvestissement: number;

    // BESOIN CREDIT - Exploitation
    coutAchatCycle: number;
    ajustCoutAchatCycle: number;
    nbreCycleFinancer: number;
    tresorerieDisponible: number;
    ajustTresorerieDispo: number;
    stockActuel: number;
    ajustStockActuel: number;
    comptesRecevoir: number;
    ajustComptesRecevoir: number;
    dettesFournisseurs: number;
    ajustDettesFournisseurs: number;
    creditFournisseur: number;
    ajustCreditFournisseur: number;
    besoinReelExploitation: number;

    // RATIOS
    calcR1Sollicite: number;
    calcR1Propose: number;
    calcR2: number;
    calcR3: number;
    calcR4Sollicite: number;
    calcR4Propose: number;
    calcR5: number;
    calcR6Sollicite: number;
    calcR6Propose: number;
}

export interface PrintAnalyseData {
    synthese: AnalyseSynthesePrint;
    personnesCaution?: Personnecaution[];
    showRatios?: boolean;
}

export interface PrintOptions {
    includeRatios?: boolean;
    includeIndicateurs?: boolean;
    includeSignature?: boolean;
    title?: string;
    watermark?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PrintService {
    /**
     * Imprime le bilan de crédit (méthode legacy pour compatibilité)
     */
    imprimerBilan(data: any, options: PrintOptions = {}): void {
        const printWindow = window.open('', '_blank', 'width=1200,height=800');
        if (!printWindow) {
            console.error("Impossible d'ouvrir la fenêtre d'impression");
            return;
        }

        const htmlContent = this.genererHTMLLegacy(data, options);

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        };
    }

    /**
     * Imprime le résumé d'analyse financière
     */
    imprimerAnalyseFinanciere(data: PrintAnalyseData, options: PrintOptions = {}): void {
        const printWindow = window.open('', '_blank', 'width=1200,height=800');
        if (!printWindow) {
            console.error("Impossible d'ouvrir la fenêtre d'impression");
            return;
        }

        const htmlContent = this.genererHTML(data, options);

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        };
    }

    private genererHTML(data: PrintAnalyseData, options: PrintOptions): string {
        const styles = this.getStyles();
        const content = this.genererContenu(data, options);

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${options.title || "Résumé d'Analyse Financière"}</title>
    <style>${styles}</style>
</head>
<body>
    ${content}
</body>
</html>
        `;
    }

    private genererContenu(data: PrintAnalyseData, options: PrintOptions): string {
        const s = data.synthese;
        const dateImpression = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
<div class="print-container">
    <!-- En-tête -->
    <div class="header">
        <h1>RÉSUMÉ D'ANALYSE FINANCIÈRE</h1>
        <div class="header-info">
            <p><strong>Date d'impression:</strong> ${dateImpression}</p>
            <p><strong>N° Demande:</strong> ${s.demandeindividuelId || '-'}</p>
            <p><strong>N° Analyse:</strong> ${s.analyseId || '-'}</p>
        </div>
    </div>

    <!-- Section 1: Demande de Crédit -->
    ${this.genererSectionDemandeCredit(s)}

    <!-- Section 2: Paramètres d'Analyse -->
    ${this.genererSectionParametres(s)}

    <!-- Section 3: Ratios (si autorisé) -->
    ${data.showRatios !== false && options.includeRatios !== false ? this.genererSectionRatios(s) : ''}

    <!-- Section 4: Bilan -->
    ${this.genererSectionBilan(s)}

    <!-- Section 5: Rentabilité -->
    ${this.genererSectionRentabilite(s)}

    <!-- Section 6: Besoin en Crédit -->
    ${this.genererSectionBesoinCredit(s)}

    <!-- Section 7: Personnes Caution -->
    ${this.genererSectionPersonnesCaution(data.personnesCaution)}

    <!-- Pied de page -->
    <div class="footer">
        <p>Document généré automatiquement le ${dateImpression}</p>
        ${options.includeSignature ? '<div class="signature-section"><p>Signature de l\'analyste: ___________________</p><p>Date: ___________________</p></div>' : ''}
    </div>
</div>
        `;
    }

    private genererSectionDemandeCredit(s: AnalyseSynthesePrint): string {
        return `
<div class="section">
    <h2><span class="section-icon">📋</span> DEMANDE DE CRÉDIT</h2>
    <div class="info-row">
        <div class="info-item">
            <span class="info-label">Montant sollicité:</span>
            <span class="info-value highlight">${this.formatCurrency(s.montantDemande)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Durée:</span>
            <span class="info-value">${s.dureeDemande || 0} mois</span>
        </div>
        <div class="info-item">
            <span class="info-label">Nbre échéances:</span>
            <span class="info-value">${s.nombreEcheance || 0}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Échéance:</span>
            <span class="info-value">${this.formatCurrency(s.echeance)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Périodicité:</span>
            <span class="info-value">${s.periodiciteRemboursement || '-'}</span>
        </div>
    </div>
    <div class="info-row">
        <div class="info-item full-width">
            <span class="info-label">Objet du crédit:</span>
            <span class="info-value">${s.objectCredit || '-'}</span>
        </div>
    </div>
    ${
        s.montantPropose
            ? `
    <div class="proposition-box">
        <h3>Proposition</h3>
        <div class="info-row">
            <div class="info-item">
                <span class="info-label">Montant proposé:</span>
                <span class="info-value highlight-green">${this.formatCurrency(s.montantPropose)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Durée proposée:</span>
                <span class="info-value">${s.dureeProposee || 0} mois</span>
            </div>
            <div class="info-item">
                <span class="info-label">Nbre échéances:</span>
                <span class="info-value">${s.nombreEcheancePropose || 0}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Échéance proposée:</span>
                <span class="info-value">${this.formatCurrency(s.echeanceProposee)}</span>
            </div>
        </div>
    </div>
    `
            : ''
    }
</div>
        `;
    }

    private genererSectionParametres(s: AnalyseSynthesePrint): string {
        return `
<div class="section">
    <h2><span class="section-icon">⚙️</span> PARAMÈTRES D'ANALYSE</h2>
    <div class="info-row">
        <div class="info-item">
            <span class="info-label">Date évaluation:</span>
            <span class="info-value">${s.dateEvaluation || '-'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Cycle d'affaires:</span>
            <span class="info-value">${s.cycleAffaires || '-'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Facteur cycle:</span>
            <span class="info-value">${s.facteurCycle || 0}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Type CDR:</span>
            <span class="info-value">${s.typeCdr || '-'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Valeur Garantie:</span>
            <span class="info-value highlight-green">${this.formatCurrency(s.valeurGarantie)}</span>
        </div>
    </div>
</div>
        `;
    }

    private genererSectionRatios(s: AnalyseSynthesePrint): string {
        const ratios = [
            {
                nom: 'R1 - Capacité de remboursement',
                norme: '≥ 200%',
                sollicite: s.calcR1Sollicite,
                propose: s.calcR1Propose,
                isGreaterBetter: true,
                threshold: 2
            },
            { nom: 'R2 - Solvabilité', norme: '≥ 35%', sollicite: s.calcR2, propose: s.calcR2, isGreaterBetter: true, threshold: 0.35 },
            { nom: 'R3 - Liquidité', norme: '≥ 100%', sollicite: s.calcR3, propose: s.calcR3, isGreaterBetter: true, threshold: 1 },
            {
                nom: 'R4 - Endettement',
                norme: '< 50%',
                sollicite: s.calcR4Sollicite,
                propose: s.calcR4Propose,
                isGreaterBetter: false,
                threshold: 0.5
            },
            { nom: 'R5 - Dépendance', norme: '< 50%', sollicite: s.calcR5, propose: s.calcR5, isGreaterBetter: false, threshold: 0.5 },
            {
                nom: 'R6 - Couverture Garantie',
                norme: '> 150%',
                sollicite: s.calcR6Sollicite,
                propose: s.calcR6Propose,
                isGreaterBetter: true,
                threshold: 1.5
            }
        ];

        const nbConformesSollicite = ratios.filter((r) => this.isRatioConforme(r.sollicite, r.threshold, r.isGreaterBetter)).length;
        const nbConformesPropose = ratios.filter((r) => this.isRatioConforme(r.propose, r.threshold, r.isGreaterBetter)).length;

        return `
<div class="section">
    <h2><span class="section-icon">📊</span> RATIOS DE DÉCISION</h2>
    <table class="ratios-table">
        <thead>
            <tr>
                <th>Ratio</th>
                <th>Norme</th>
                <th>Sollicité</th>
                <th>Proposé</th>
            </tr>
        </thead>
        <tbody>
            ${ratios
                .map(
                    (r) => `
                <tr>
                    <td class="ratio-name">${r.nom}</td>
                    <td class="ratio-norme">${r.norme}</td>
                    <td class="ratio-value ${this.getRatioClass(r.sollicite, r.threshold, r.isGreaterBetter)}">
                        ${this.formatPercent(r.sollicite)}
                        <span class="ratio-status">${this.getRatioStatus(r.sollicite, r.threshold, r.isGreaterBetter)}</span>
                    </td>
                    <td class="ratio-value ${this.getRatioClass(r.propose, r.threshold, r.isGreaterBetter)}">
                        ${s.montantPropose ? this.formatPercent(r.propose) : '-'}
                        ${s.montantPropose ? `<span class="ratio-status">${this.getRatioStatus(r.propose, r.threshold, r.isGreaterBetter)}</span>` : ''}
                    </td>
                </tr>
            `
                )
                .join('')}
        </tbody>
    </table>
    <div class="ratios-summary">
        <div class="summary-item ${nbConformesSollicite === 6 ? 'success' : 'danger'}">
            <strong>Sollicité:</strong> ${nbConformesSollicite}/6 conformes
        </div>
        <div class="summary-item ${nbConformesPropose === 6 ? 'success' : 'danger'}">
            <strong>Proposé:</strong> ${nbConformesPropose}/6 conformes
        </div>
    </div>
</div>
        `;
    }

    private genererSectionBilan(s: AnalyseSynthesePrint): string {
        return `
<div class="section page-break-before">
    <h2><span class="section-icon">📈</span> 1. BILAN</h2>

    <!-- Actif Immobilisé -->
    <h3 class="subsection-title">Actif Immobilisé</h3>
    <table class="data-table">
        <thead>
            <tr>
                <th>Éléments</th>
                <th class="text-right">Période N</th>
                <th class="text-right">Période N-1</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Terrain</td><td class="text-right">${this.formatCurrency(s.terrainN)}</td><td class="text-right">${this.formatCurrency(s.terrainN1)}</td></tr>
            <tr><td>Bâtiment / Magasin</td><td class="text-right">${this.formatCurrency(s.batimentMagasinN)}</td><td class="text-right">${this.formatCurrency(s.batimentMagasinN1)}</td></tr>
            <tr><td>Installation / Agencement</td><td class="text-right">${this.formatCurrency(s.installationAgencementN)}</td><td class="text-right">${this.formatCurrency(s.installationAgencementN1)}</td></tr>
            <tr><td>Matériel Industriel</td><td class="text-right">${this.formatCurrency(s.materielIndustrielN)}</td><td class="text-right">${this.formatCurrency(s.materielIndustrielN1)}</td></tr>
            <tr><td>Mobilier de Bureau</td><td class="text-right">${this.formatCurrency(s.mobilierBureauN)}</td><td class="text-right">${this.formatCurrency(s.mobilierBureauN1)}</td></tr>
            <tr><td>Matériel Informatique</td><td class="text-right">${this.formatCurrency(s.materielInformatiqueN)}</td><td class="text-right">${this.formatCurrency(s.materielInformatiqueN1)}</td></tr>
            <tr><td>Matériel de Transport</td><td class="text-right">${this.formatCurrency(s.materielTransportN)}</td><td class="text-right">${this.formatCurrency(s.materielTransportN1)}</td></tr>
            <tr><td>Autres Immobilisations</td><td class="text-right">${this.formatCurrency(s.autreImmobilisationN)}</td><td class="text-right">${this.formatCurrency(s.autreImmobilisationN1)}</td></tr>
            <tr class="total-row"><td><strong>TOTAL IMMOBILISATIONS</strong></td><td class="text-right"><strong>${this.formatCurrency(s.totalImmobilisationsN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.totalImmobilisationsN1)}</strong></td></tr>
        </tbody>
    </table>

    <!-- Actif Circulant -->
    <h3 class="subsection-title">Actif Circulant</h3>
    <table class="data-table">
        <thead>
            <tr>
                <th>Éléments</th>
                <th class="text-right">Période N</th>
                <th class="text-right">Période N-1</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Stocks</td><td class="text-right">${this.formatCurrency(s.stocksN)}</td><td class="text-right">${this.formatCurrency(s.stocksN1)}</td></tr>
            <tr><td>Créances Clients</td><td class="text-right">${this.formatCurrency(s.creancesClientsN)}</td><td class="text-right">${this.formatCurrency(s.creancesClientsN1)}</td></tr>
            <tr><td>Trésorerie (Caisse/Banque)</td><td class="text-right">${this.formatCurrency(s.tresorerieCaisseBanqueN)}</td><td class="text-right">${this.formatCurrency(s.tresorerieCaisseBanqueN1)}</td></tr>
            <tr class="total-row"><td><strong>TOTAL ACTIF</strong></td><td class="text-right"><strong>${this.formatCurrency(s.totalActifN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.totalActifN1)}</strong></td></tr>
        </tbody>
    </table>

    <!-- Passif -->
    <h3 class="subsection-title">Passif</h3>
    <table class="data-table">
        <thead>
            <tr>
                <th>Éléments</th>
                <th class="text-right">Période N</th>
                <th class="text-right">Période N-1</th>
            </tr>
        </thead>
        <tbody>
            <tr class="highlight-row"><td><strong>CAPITAUX PROPRES</strong></td><td class="text-right"><strong>${this.formatCurrency(s.capitauxPropresN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.capitauxPropresN1)}</strong></td></tr>
            <tr><td>Emprunts Long Terme</td><td class="text-right">${this.formatCurrency(s.empruntLongTermeN)}</td><td class="text-right">${this.formatCurrency(s.empruntLongTermeN1)}</td></tr>
            <tr><td>Emprunts Court Terme</td><td class="text-right">${this.formatCurrency(s.empruntCourtTermeN)}</td><td class="text-right">${this.formatCurrency(s.empruntCourtTermeN1)}</td></tr>
            <tr><td>Autres Dettes</td><td class="text-right">${this.formatCurrency(s.autresDettesN)}</td><td class="text-right">${this.formatCurrency(s.autresDettesN1)}</td></tr>
            <tr class="total-row"><td><strong>TOTAL DETTES</strong></td><td class="text-right"><strong>${this.formatCurrency(s.totalDettesN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.totalDettesN1)}</strong></td></tr>
        </tbody>
    </table>

    <!-- Indicateurs -->
    <h3 class="subsection-title">Indicateurs Financiers</h3>
    <table class="data-table">
        <tbody>
            <tr><td>Fonds de Roulement</td><td class="text-right">${this.formatCurrency(s.fondsRoulementN)}</td><td class="text-right">${this.formatCurrency(s.fondsRoulementN1)}</td></tr>
            <tr><td>Besoin en Fonds de Roulement</td><td class="text-right">${this.formatCurrency(s.besoinFondsRoulementN)}</td><td class="text-right">${this.formatCurrency(s.besoinFondsRoulementN1)}</td></tr>
        </tbody>
    </table>
</div>
        `;
    }

    private genererSectionRentabilite(s: AnalyseSynthesePrint): string {
        return `
<div class="section page-break-before">
    <h2><span class="section-icon">📉</span> 2. RENTABILITÉ DE L'ACTIVITÉ</h2>

    <!-- Produits -->
    <h3 class="subsection-title">Produits</h3>
    <table class="data-table">
        <thead>
            <tr>
                <th>Éléments</th>
                <th class="text-right">N</th>
                <th class="text-right">N-1</th>
                <th class="text-right">N+1</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Chiffre d'Affaires</td><td class="text-right">${this.formatCurrency(s.chiffreAffairesN)}</td><td class="text-right">${this.formatCurrency(s.chiffreAffairesN1)}</td><td class="text-right">${this.formatCurrency(s.chiffreAffairesNplus1)}</td></tr>
            <tr><td>Coût d'Achat des Marchandises</td><td class="text-right">${this.formatCurrency(s.coutAchatMarchandisesN)}</td><td class="text-right">${this.formatCurrency(s.coutAchatMarchandisesN1)}</td><td class="text-right">${this.formatCurrency(s.coutAchatMarchandisesNplus1)}</td></tr>
            <tr class="total-row highlight-teal"><td><strong>MARGE BRUTE</strong></td><td class="text-right"><strong>${this.formatCurrency(s.margeBruteN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.margeBruteN1)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.margeBruteNplus1)}</strong></td></tr>
        </tbody>
    </table>

    <!-- Charges -->
    <h3 class="subsection-title">Charges d'Exploitation</h3>
    <table class="data-table">
        <thead>
            <tr>
                <th>Éléments</th>
                <th class="text-right">N</th>
                <th class="text-right">N-1</th>
                <th class="text-right">N+1</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Salaires</td><td class="text-right">${this.formatCurrency(s.salairesN)}</td><td class="text-right">${this.formatCurrency(s.salairesN1)}</td><td class="text-right">${this.formatCurrency(s.salairesNplus1)}</td></tr>
            <tr><td>Prélèvement Entrepreneur</td><td class="text-right">${this.formatCurrency(s.prelevementEntrepreneurN)}</td><td class="text-right">${this.formatCurrency(s.prelevementEntrepreneurN1)}</td><td class="text-right">${this.formatCurrency(s.prelevementEntrepreneurNplus1)}</td></tr>
            <tr><td>Loyers</td><td class="text-right">${this.formatCurrency(s.loyersN)}</td><td class="text-right">${this.formatCurrency(s.loyersN1)}</td><td class="text-right">${this.formatCurrency(s.loyersNplus1)}</td></tr>
            <tr><td>Transport</td><td class="text-right">${this.formatCurrency(s.transportN)}</td><td class="text-right">${this.formatCurrency(s.transportN1)}</td><td class="text-right">${this.formatCurrency(s.transportNplus1)}</td></tr>
            <tr><td>Électricité/Eau/Téléphone</td><td class="text-right">${this.formatCurrency(s.electriciteEauTelephoneN)}</td><td class="text-right">${this.formatCurrency(s.electriciteEauTelephoneN1)}</td><td class="text-right">${this.formatCurrency(s.electriciteEauTelephoneNplus1)}</td></tr>
            <tr><td>Fournitures et Autres Besoins</td><td class="text-right">${this.formatCurrency(s.fournituresAutresBesoinsN)}</td><td class="text-right">${this.formatCurrency(s.fournituresAutresBesoinsN1)}</td><td class="text-right">${this.formatCurrency(s.fournituresAutresBesoinsNplus1)}</td></tr>
            <tr><td>Entretien/Réparation</td><td class="text-right">${this.formatCurrency(s.entretienReparationN)}</td><td class="text-right">${this.formatCurrency(s.entretienReparationN1)}</td><td class="text-right">${this.formatCurrency(s.entretienReparationNplus1)}</td></tr>
            <tr><td>Carburant/Lubrifiants</td><td class="text-right">${this.formatCurrency(s.carburantLubrifiantsN)}</td><td class="text-right">${this.formatCurrency(s.carburantLubrifiantsN1)}</td><td class="text-right">${this.formatCurrency(s.carburantLubrifiantsNplus1)}</td></tr>
            <tr><td>Publicité/Promotion</td><td class="text-right">${this.formatCurrency(s.publicitePromotionN)}</td><td class="text-right">${this.formatCurrency(s.publicitePromotionN1)}</td><td class="text-right">${this.formatCurrency(s.publicitePromotionNplus1)}</td></tr>
            <tr><td>Impôts et Taxes</td><td class="text-right">${this.formatCurrency(s.impotsTaxesN)}</td><td class="text-right">${this.formatCurrency(s.impotsTaxesN1)}</td><td class="text-right">${this.formatCurrency(s.impotsTaxesNplus1)}</td></tr>
            <tr><td>Frais Bancaires/Intérêts</td><td class="text-right">${this.formatCurrency(s.fraisBancairesInteretsN)}</td><td class="text-right">${this.formatCurrency(s.fraisBancairesInteretsN1)}</td><td class="text-right">${this.formatCurrency(s.fraisBancairesInteretsNplus1)}</td></tr>
            <tr><td>Échéance Autre Crédit</td><td class="text-right">${this.formatCurrency(s.echeanceAutreCreditN)}</td><td class="text-right">${this.formatCurrency(s.echeanceAutreCreditN1)}</td><td class="text-right">${this.formatCurrency(s.echeanceAutreCreditNplus1)}</td></tr>
            <tr><td>Diverses Charges</td><td class="text-right">${this.formatCurrency(s.diversesChargesN)}</td><td class="text-right">${this.formatCurrency(s.diversesChargesN1)}</td><td class="text-right">${this.formatCurrency(s.diversesChargesNplus1)}</td></tr>
            <tr class="total-row highlight-orange"><td><strong>TOTAL CHARGES</strong></td><td class="text-right"><strong>${this.formatCurrency(s.totalChargesExploitationN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.totalChargesExploitationN1)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.totalChargesExploitationNplus1)}</strong></td></tr>
        </tbody>
    </table>

    <!-- Résultats -->
    <h3 class="subsection-title">Résultats</h3>
    <table class="data-table">
        <tbody>
            <tr><td>Amortissements/Provisions</td><td class="text-right">${this.formatCurrency(s.amortissementsProvisionsN)}</td><td class="text-right">${this.formatCurrency(s.amortissementsProvisionsN1)}</td><td class="text-right">${this.formatCurrency(s.amortissementsProvisionsNplus1)}</td></tr>
            <tr class="highlight-row"><td><strong>Résultat d'Exploitation</strong></td><td class="text-right"><strong>${this.formatCurrency(s.resultatExploitationN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.resultatExploitationN1)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.resultatExploitationNplus1)}</strong></td></tr>
            <tr><td>Autres Revenus Hors Activité</td><td class="text-right">${this.formatCurrency(s.autresRevenusHorsActiviteN)}</td><td class="text-right">${this.formatCurrency(s.autresRevenusHorsActiviteN1)}</td><td class="text-right">${this.formatCurrency(s.autresRevenusHorsActiviteNplus1)}</td></tr>
            <tr class="total-row highlight-indigo"><td><strong>CASH FLOW</strong></td><td class="text-right"><strong>${this.formatCurrency(s.cashFlowN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.cashFlowN1)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.cashFlowNplus1)}</strong></td></tr>
            <tr class="total-row highlight-indigo"><td><strong>CAPACITÉ DE REMBOURSEMENT</strong></td><td class="text-right"><strong>${this.formatCurrency(s.capaciteRemboursementN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.capaciteRemboursementN1)}</strong></td><td class="text-right"><strong>${this.formatCurrency(s.capaciteRemboursementNplus1)}</strong></td></tr>
        </tbody>
    </table>
</div>
        `;
    }

    private genererSectionBesoinCredit(s: AnalyseSynthesePrint): string {
        return `
<div class="section">
    <h2><span class="section-icon">💰</span> 3. ÉVALUATION DU BESOIN RÉEL EN CRÉDIT</h2>

    <div class="two-columns">
        <!-- Besoin Investissement -->
        <div class="column">
            <h3 class="subsection-title">Besoin en Investissement</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Éléments</th>
                        <th class="text-right">Montant</th>
                        <th class="text-right">Ajustement</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Coût Équipement</td><td class="text-right">${this.formatCurrency(s.coutEquipement)}</td><td class="text-right">${this.formatCurrency(s.ajustCoutEquipement)}</td></tr>
                    <tr><td>Dépenses Rattachées</td><td class="text-right">${this.formatCurrency(s.depensesRattachees)}</td><td class="text-right">${this.formatCurrency(s.ajustDepensesRattachees)}</td></tr>
                    <tr><td>Apport Personnel</td><td class="text-right">${this.formatCurrency(s.apportPersonnel)}</td><td class="text-right">${this.formatCurrency(s.ajustApportPersonnel)}</td></tr>
                    <tr class="total-row highlight-cyan"><td><strong>BESOIN RÉEL INVESTISSEMENT</strong></td><td class="text-right"><strong>${this.formatCurrency(s.besoinReelInvestissement)}</strong></td><td class="text-right">-</td></tr>
                </tbody>
            </table>
        </div>

        <!-- Besoin Exploitation -->
        <div class="column">
            <h3 class="subsection-title">Besoin en Exploitation</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Éléments</th>
                        <th class="text-right">Montant</th>
                        <th class="text-right">Ajustement</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Coût Achat Cycle</td><td class="text-right">${this.formatCurrency(s.coutAchatCycle)}</td><td class="text-right">${this.formatCurrency(s.ajustCoutAchatCycle)}</td></tr>
                    <tr><td>Nbre Cycles à Financer</td><td class="text-right">${s.nbreCycleFinancer || 0}</td><td class="text-right">-</td></tr>
                    <tr><td>Trésorerie Disponible</td><td class="text-right">${this.formatCurrency(s.tresorerieDisponible)}</td><td class="text-right">${this.formatCurrency(s.ajustTresorerieDispo)}</td></tr>
                    <tr><td>Stock Actuel</td><td class="text-right">${this.formatCurrency(s.stockActuel)}</td><td class="text-right">${this.formatCurrency(s.ajustStockActuel)}</td></tr>
                    <tr><td>Comptes à Recevoir</td><td class="text-right">${this.formatCurrency(s.comptesRecevoir)}</td><td class="text-right">${this.formatCurrency(s.ajustComptesRecevoir)}</td></tr>
                    <tr><td>Dettes Fournisseurs</td><td class="text-right">${this.formatCurrency(s.dettesFournisseurs)}</td><td class="text-right">${this.formatCurrency(s.ajustDettesFournisseurs)}</td></tr>
                    <tr><td>Crédit Fournisseur</td><td class="text-right">${this.formatCurrency(s.creditFournisseur)}</td><td class="text-right">${this.formatCurrency(s.ajustCreditFournisseur)}</td></tr>
                    <tr class="total-row highlight-cyan"><td><strong>BESOIN RÉEL EXPLOITATION</strong></td><td class="text-right"><strong>${this.formatCurrency(s.besoinReelExploitation)}</strong></td><td class="text-right">-</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
        `;
    }

    private genererSectionPersonnesCaution(personnesCaution?: Personnecaution[]): string {
        if (!personnesCaution || personnesCaution.length === 0) {
            return `
<div class="section">
    <h2><span class="section-icon">👥</span> 4. PERSONNES CAUTION</h2>
    <div class="no-data-box">
        <p>Aucune personne caution enregistrée pour cette demande</p>
    </div>
</div>
            `;
        }

        return `
<div class="section">
    <h2><span class="section-icon">👥</span> 4. PERSONNES CAUTION (${personnesCaution.length})</h2>
    <table class="data-table">
        <thead>
            <tr>
                <th>Nom complet</th>
                <th>Téléphone</th>
                <th>Activité</th>
                <th>Profession</th>
                <th class="text-center">Âge</th>
            </tr>
        </thead>
        <tbody>
            ${personnesCaution
                .map(
                    (pc) => `
                <tr>
                    <td class="highlight-purple"><strong>${this.getFullName(pc)}</strong></td>
                    <td>${pc.telephone || '-'}</td>
                    <td>${pc.activite || '-'}</td>
                    <td>${pc.profession || '-'}</td>
                    <td class="text-center">${pc.age || '-'}</td>
                </tr>
            `
                )
                .join('')}
        </tbody>
    </table>
</div>
        `;
    }

    // ==================== Utilitaires ====================

    private formatCurrency(amount: number | null | undefined): string {
        if (amount === null || amount === undefined) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    private formatPercent(value: number | null | undefined): string {
        if (value === null || value === undefined) return '-';
        return `${(value * 100).toFixed(1)}%`;
    }

    private getFullName(pc: Personnecaution): string {
        const parts = [];
        if (pc.nom) parts.push(pc.nom);
        if (pc.prenom) parts.push(pc.prenom);
        return parts.join(' ') || '-';
    }

    private isRatioConforme(value: number | null | undefined, threshold: number, isGreaterBetter: boolean): boolean {
        if (value === null || value === undefined) return false;
        return isGreaterBetter ? value >= threshold : value < threshold;
    }

    private getRatioClass(value: number | null | undefined, threshold: number, isGreaterBetter: boolean): string {
        if (value === null || value === undefined) return 'neutral';
        return this.isRatioConforme(value, threshold, isGreaterBetter) ? 'conforme' : 'non-conforme';
    }

    private getRatioStatus(value: number | null | undefined, threshold: number, isGreaterBetter: boolean): string {
        if (value === null || value === undefined) return '';
        return this.isRatioConforme(value, threshold, isGreaterBetter) ? '✓' : '✗';
    }

    // ==================== Legacy Print (for resume-credit component) ====================

    private genererHTMLLegacy(data: any, options: PrintOptions): string {
        const styles = this.getStylesLegacy();
        const content = this.genererContenuLegacy(data, options);

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Résumé d'Analyse de Crédit</title>
    <style>${styles}</style>
</head>
<body>
    ${content}
</body>
</html>
        `;
    }

    private genererContenuLegacy(data: any, options: PrintOptions): string {
        const dateImpression = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
<div class="print-container">
    <div class="header">
        <div class="header-content">
            <h1>RÉSUMÉ D'ANALYSE DE CRÉDIT</h1>
            <div class="header-info">
                <p><strong>Date d'impression:</strong> ${dateImpression}</p>
                <p><strong>Montant demandé:</strong> ${data.montantDemande || '-'}</p>
                <p><strong>Évaluation:</strong> <span class="evaluation ${(data.evaluationGlobale || '').toLowerCase()}">${data.evaluationGlobale || '-'}</span></p>
            </div>
        </div>
    </div>

    ${this.genererEvaluationGlobaleLegacy(data)}
    ${options.includeIndicateurs !== false ? this.genererIndicateursClesLegacy(data) : ''}
    ${this.genererInformationsGeneralesLegacy(data)}
    ${this.genererBilanFinancierLegacy(data)}
    ${this.genererExploitationLegacy(data)}
    ${this.genererDemandeCreditLegacy(data)}
    ${this.genererPersonnesCautionLegacy(data)}
    ${this.genererRecommandationsLegacy(data)}

    <div class="footer">
        <p>Document généré automatiquement le ${dateImpression}</p>
        ${options.includeSignature ? '<div class="signature-section"><p>Signature de l\'analyste: ___________________</p></div>' : ''}
    </div>
</div>
        `;
    }

    private genererEvaluationGlobaleLegacy(data: any): string {
        return `
<div class="section evaluation-section">
    <h2>ÉVALUATION GLOBALE</h2>
    <div class="evaluation-grid">
        <div class="evaluation-item">
            <h3>Statut Global</h3>
            <div class="evaluation-badge ${(data.evaluationGlobale || '').toLowerCase()}">${data.evaluationGlobale || '-'}</div>
        </div>
        <div class="evaluation-item">
            <h3>Score de Risque</h3>
            <div class="score">${data.scoreRisque || 0}/100</div>
        </div>
        <div class="evaluation-item">
            <h3>Seuils Respectés</h3>
            <div class="seuils">${data.seuilsRespetes || 0}/6</div>
        </div>
    </div>
</div>
        `;
    }

    private genererIndicateursClesLegacy(data: any): string {
        if (!data.ratios || data.ratios.length === 0) return '';
        return `
<div class="section">
    <h2>INDICATEURS CLÉS</h2>
    <div class="indicateurs-grid">
        ${data.ratios.map((ratio: any) => `
            <div class="indicateur-item">
                <h4>${ratio.nom}</h4>
                <div class="ratio-value ${(ratio.statut || '').toLowerCase()}">${ratio.valeur}%</div>
                <div class="ratio-status">${ratio.statut}</div>
                <div class="ratio-formula">${ratio.formule || ''}</div>
            </div>
        `).join('')}
    </div>
</div>
        `;
    }

    private genererInformationsGeneralesLegacy(data: any): string {
        return `
<div class="section">
    <h2>INFORMATIONS GÉNÉRALES</h2>
    <div class="info-grid">
        <div class="info-block">
            <h3>Promoteur</h3>
            ${this.genererTableauLegacy(data.promoteur)}
        </div>
        <div class="info-block">
            <h3>Entreprise</h3>
            ${this.genererTableauLegacy(data.entreprise)}
        </div>
    </div>
</div>
        `;
    }

    private genererBilanFinancierLegacy(data: any): string {
        return `
<div class="section">
    <h2>BILAN FINANCIER</h2>
    <div class="bilan-grid">
        <div class="bilan-block">
            <h3>Bilan Entreprise</h3>
            ${this.genererTableauLegacy(data.bilanEntreprise)}
        </div>
        <div class="bilan-block">
            <h3>Patrimoine Personnel</h3>
            ${this.genererTableauLegacy(data.bilanPersonnel)}
        </div>
    </div>
</div>
        `;
    }

    private genererExploitationLegacy(data: any): string {
        return `
<div class="section">
    <h2>EXPLOITATION</h2>
    <div class="exploitation-grid">
        <div class="exploitation-block">
            <h3>Exploitation Actuelle</h3>
            ${this.genererTableauLegacy(data.exploitationActuelle)}
            <h4>Détail des Charges</h4>
            ${this.genererTableauLegacy(data.chargesActuelles)}
        </div>
        <div class="exploitation-block">
            <h3>Exploitation Prévisionnelle</h3>
            ${this.genererTableauLegacy(data.exploitationPrevisionnelle)}
            <h4>Détail des Charges</h4>
            ${this.genererTableauLegacy(data.chargesPrevisionnelles)}
        </div>
    </div>
</div>
        `;
    }

    private genererDemandeCreditLegacy(data: any): string {
        return `
<div class="section">
    <h2>DEMANDE DE CRÉDIT</h2>
    <div class="demande-grid">
        <div class="demande-block">
            <h3>Informations Principales</h3>
            ${this.genererTableauLegacy(data.demandeCredit)}
        </div>
        <div class="demande-block">
            <h3>Informations Administratives</h3>
            ${this.genererTableauLegacy(data.infoAdministratives)}
        </div>
    </div>
</div>
        `;
    }

    private genererPersonnesCautionLegacy(data: any): string {
        if (!data.personnesCaution || data.personnesCaution.length === 0) {
            return `
<div class="section">
    <h2>PERSONNES CAUTION</h2>
    <div class="no-caution">
        <p>Aucune personne caution renseignée</p>
    </div>
</div>
            `;
        }

        return `
<div class="section">
    <h2>PERSONNES CAUTION (${data.personnesCaution.length})</h2>
    <div class="caution-content">
        ${this.genererTableauLegacy(data.personnesCautionData)}
        ${data.analyseGarantie ? `
        <div class="caution-analysis">
            <h3>Analyse de Garantie</h3>
            <p><strong>Niveau:</strong> ${data.analyseGarantie.niveau}</p>
            <p><strong>Score:</strong> ${data.analyseGarantie.score}/100</p>
            <p><strong>Description:</strong> ${data.analyseGarantie.description}</p>
        </div>
        ` : ''}
    </div>
</div>
        `;
    }

    private genererRecommandationsLegacy(data: any): string {
        if (!data.recommandations && !data.decisionRecommandee) return '';
        return `
<div class="section">
    <h2>RECOMMANDATIONS ET ANALYSE</h2>
    <div class="recommandations-grid">
        ${data.recommandations ? `
        <div class="recommandations-block">
            <h3>Recommandations</h3>
            <ul>
                ${data.recommandations.map((rec: string) => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        ${data.conseilsAmelioration ? `
        <div class="recommandations-block">
            <h3>Conseils d'Amélioration</h3>
            <ul>
                ${data.conseilsAmelioration.map((conseil: string) => `<li>${conseil}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    </div>
    ${data.decisionRecommandee ? `
    <div class="decision-block">
        <h3>Recommandation de Décision</h3>
        <div class="decision-content">
            <p><strong>Décision:</strong> <span class="decision ${(data.decisionRecommandee.decision || '').toLowerCase()}">${(data.decisionRecommandee.decision || '').replace('_', ' ')}</span></p>
            <p><strong>Justification:</strong> ${data.decisionRecommandee.justification || ''}</p>
            ${data.decisionRecommandee.conditions ? `
            <p><strong>Conditions:</strong></p>
            <ul>
                ${data.decisionRecommandee.conditions.map((condition: string) => `<li>${condition}</li>`).join('')}
            </ul>
            ` : ''}
        </div>
    </div>
    ` : ''}
</div>
        `;
    }

    private genererTableauLegacy(data: any[]): string {
        if (!data || data.length === 0) return '<p>Aucune donnée disponible</p>';

        return `
<table>
    <tbody>
        ${data.map((item) => `
            <tr ${item.isTotal ? 'class="total-row"' : ''}>
                <td class="label">${item.label}</td>
                <td class="value ${item.severity || ''}">${item.value}</td>
            </tr>
        `).join('')}
    </tbody>
</table>
        `;
    }

    private getStylesLegacy(): string {
        return `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; color: #333; background: white; }
.print-container { max-width: 210mm; margin: 0 auto; padding: 15mm; }
.header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
.header h1 { font-size: 24px; font-weight: bold; color: #2c3e50; margin-bottom: 15px; }
.header-info { display: flex; justify-content: space-around; flex-wrap: wrap; }
.header-info p { margin: 5px 0; font-size: 11px; }
.evaluation { padding: 3px 8px; border-radius: 4px; font-weight: bold; }
.evaluation.excellent { background: #d4edda; color: #155724; }
.evaluation.bon { background: #cce5ff; color: #004085; }
.evaluation.acceptable { background: #fff3cd; color: #856404; }
.evaluation.risque { background: #f8d7da; color: #721c24; }
.section { margin-bottom: 25px; page-break-inside: avoid; }
.section h2 { background: #34495e; color: white; padding: 8px 12px; font-size: 14px; margin-bottom: 15px; font-weight: bold; text-transform: uppercase; }
.section h3 { color: #2c3e50; font-size: 12px; margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #bdc3c7; padding-bottom: 3px; }
.section h4 { color: #34495e; font-size: 11px; margin: 10px 0 5px 0; font-weight: bold; }
.evaluation-section { background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #dee2e6; }
.evaluation-grid, .indicateurs-grid, .info-grid, .bilan-grid, .exploitation-grid, .demande-grid, .recommandations-grid { display: flex; flex-wrap: wrap; gap: 15px; }
.evaluation-item, .indicateur-item { flex: 1; min-width: 150px; text-align: center; padding: 10px; border: 1px solid #dee2e6; border-radius: 6px; }
.evaluation-badge, .ratio-value { font-size: 16px; font-weight: bold; padding: 5px 10px; border-radius: 4px; margin: 5px 0; display: inline-block; }
.score, .seuils { font-size: 18px; font-weight: bold; color: #2c3e50; }
.ratio-status { font-size: 10px; padding: 2px 6px; border-radius: 3px; margin-top: 5px; }
.ratio-formula { font-size: 9px; color: #6c757d; font-style: italic; margin-top: 5px; }
.info-block, .bilan-block, .exploitation-block, .demande-block, .recommandations-block { flex: 1; min-width: 250px; }
table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10px; }
table td { padding: 4px 8px; border: 1px solid #dee2e6; vertical-align: top; }
table td.label { background: #f8f9fa; font-weight: bold; width: 40%; }
table td.value { width: 60%; }
.total-row { background: #e3f2fd !important; font-weight: bold; }
.success { color: #28a745; font-weight: bold; }
.info { color: #007bff; font-weight: bold; }
.warn { color: #ffc107; font-weight: bold; }
.danger { color: #dc3545; font-weight: bold; }
.no-caution { text-align: center; padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; }
.caution-content { display: grid; grid-template-columns: 2fr 1fr; gap: 15px; }
.caution-analysis { background: #f0f8ff; padding: 10px; border-radius: 6px; border: 1px solid #b3d9ff; }
.decision-block { margin-top: 15px; padding: 15px; background: #f5f5f5; border-radius: 6px; border: 1px solid #ddd; }
.decision-content .decision { padding: 3px 8px; border-radius: 4px; font-weight: bold; }
.decision.accorder { background: #d4edda; color: #155724; }
.decision.accorder_avec_conditions { background: #cce5ff; color: #004085; }
.decision.etude_approfondie { background: #fff3cd; color: #856404; }
.decision.refuser { background: #f8d7da; color: #721c24; }
ul { margin: 8px 0; padding-left: 15px; }
ul li { margin-bottom: 3px; font-size: 10px; }
.footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #dee2e6; text-align: center; font-size: 10px; color: #6c757d; }
.signature-section { margin-top: 20px; text-align: right; }
@media print { body { margin: 0; } .print-container { padding: 10mm; } .section { page-break-inside: avoid; } .footer { page-break-inside: avoid; } }
@page { margin: 15mm; size: A4; }
        `;
    }

    // ==================== Styles CSS ====================

    private getStyles(): string {
        return `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 11px;
    line-height: 1.4;
    color: #333;
    background: white;
}

.print-container {
    max-width: 210mm;
    margin: 0 auto;
    padding: 12mm;
}

.header {
    text-align: center;
    margin-bottom: 25px;
    border-bottom: 3px solid #2c3e50;
    padding-bottom: 15px;
}

.header h1 {
    font-size: 22px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 10px;
    letter-spacing: 1px;
}

.header-info {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
}

.header-info p {
    margin: 3px 0;
    font-size: 10px;
    color: #555;
}

.section {
    margin-bottom: 20px;
    page-break-inside: avoid;
}

.section h2 {
    background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
    color: white;
    padding: 10px 15px;
    font-size: 13px;
    margin-bottom: 12px;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.section-icon {
    font-size: 14px;
}

.subsection-title {
    color: #2c3e50;
    font-size: 11px;
    margin: 12px 0 8px 0;
    font-weight: bold;
    border-bottom: 2px solid #3498db;
    padding-bottom: 4px;
}

.info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 10px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.info-item.full-width {
    width: 100%;
}

.info-label {
    color: #666;
    font-size: 10px;
}

.info-value {
    font-weight: 600;
    color: #2c3e50;
}

.info-value.highlight {
    color: #2980b9;
    font-size: 12px;
}

.info-value.highlight-green {
    color: #27ae60;
    font-size: 12px;
}

.proposition-box {
    background: #e8f5e9;
    border: 1px solid #81c784;
    border-radius: 6px;
    padding: 12px;
    margin-top: 12px;
}

.proposition-box h3 {
    color: #2e7d32;
    font-size: 11px;
    margin-bottom: 8px;
}

/* Tables */
.data-table, .ratios-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
    font-size: 10px;
}

.data-table th, .ratios-table th {
    background: #f5f6fa;
    padding: 8px;
    text-align: left;
    font-weight: bold;
    border: 1px solid #ddd;
    color: #2c3e50;
}

.data-table td, .ratios-table td {
    padding: 6px 8px;
    border: 1px solid #ddd;
    vertical-align: middle;
}

.text-right {
    text-align: right !important;
}

.text-center {
    text-align: center !important;
}

.total-row {
    background: #e3f2fd !important;
    font-weight: bold;
}

.highlight-row {
    background: #f5f5f5;
}

.highlight-teal {
    background: #e0f2f1 !important;
}

.highlight-orange {
    background: #fff3e0 !important;
}

.highlight-indigo {
    background: #e8eaf6 !important;
}

.highlight-cyan {
    background: #e0f7fa !important;
}

.highlight-purple {
    color: #7b1fa2;
}

/* Ratios Table */
.ratios-table .ratio-name {
    font-weight: 600;
}

.ratios-table .ratio-norme {
    text-align: center;
    font-weight: bold;
    color: #555;
}

.ratios-table .ratio-value {
    text-align: center;
    padding: 8px;
}

.ratios-table .ratio-value.conforme {
    background: #d4edda;
    color: #155724;
}

.ratios-table .ratio-value.non-conforme {
    background: #f8d7da;
    color: #721c24;
}

.ratios-table .ratio-status {
    display: block;
    font-size: 12px;
    margin-top: 2px;
}

.ratios-summary {
    display: flex;
    gap: 20px;
    margin-top: 12px;
}

.summary-item {
    flex: 1;
    padding: 10px 15px;
    border-radius: 6px;
    text-align: center;
    font-size: 11px;
}

.summary-item.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.summary-item.danger {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

/* Two columns layout */
.two-columns {
    display: flex;
    gap: 20px;
}

.two-columns .column {
    flex: 1;
}

/* No data box */
.no-data-box {
    background: #fff3cd;
    border: 1px solid #ffeeba;
    border-radius: 6px;
    padding: 20px;
    text-align: center;
    color: #856404;
}

/* Footer */
.footer {
    margin-top: 30px;
    padding-top: 15px;
    border-top: 2px solid #dee2e6;
    text-align: center;
    font-size: 9px;
    color: #6c757d;
}

.signature-section {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
    gap: 50px;
}

.signature-section p {
    font-size: 10px;
    color: #333;
}

/* Print specific */
@media print {
    body { margin: 0; }
    .print-container { padding: 8mm; }
    .section { page-break-inside: avoid; }
    .page-break-before { page-break-before: always; }
    .footer { page-break-inside: avoid; }
}

@page {
    margin: 10mm;
    size: A4;
}
        `;
    }
}
