import{U as a}from"./chunk-MKA3N2SS.js";var o=class s{imprimerBilan(t,e={}){let r=window.open("","_blank","width=1200,height=800");if(!r){console.error("Impossible d'ouvrir la fen\xEAtre d'impression");return}let n=this.genererHTMLLegacy(t,e);r.document.write(n),r.document.close(),r.onload=()=>{setTimeout(()=>{r.print(),r.close()},500)}}imprimerAnalyseFinanciere(t,e={}){let r=window.open("","_blank","width=1200,height=800");if(!r){console.error("Impossible d'ouvrir la fen\xEAtre d'impression");return}let n=this.genererHTML(t,e);r.document.write(n),r.document.close(),r.onload=()=>{setTimeout(()=>{r.print(),r.close()},500)}}genererHTML(t,e){let r=this.getStyles(),n=this.genererContenu(t,e);return`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${e.title||"R\xE9sum\xE9 d'Analyse Financi\xE8re"}</title>
    <style>${r}</style>
</head>
<body>
    ${n}
</body>
</html>
        `}genererContenu(t,e){let r=t.synthese,n=new Date().toLocaleDateString("fr-FR",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"});return`
<div class="print-container">
    <!-- En-t\xEAte -->
    <div class="header">
        <h1>R\xC9SUM\xC9 D'ANALYSE FINANCI\xC8RE</h1>
        <div class="header-info">
            <p><strong>Date d'impression:</strong> ${n}</p>
            <p><strong>N\xB0 Demande:</strong> ${r.demandeindividuelId||"-"}</p>
            <p><strong>N\xB0 Analyse:</strong> ${r.analyseId||"-"}</p>
        </div>
    </div>

    <!-- Section 1: Demande de Cr\xE9dit -->
    ${this.genererSectionDemandeCredit(r)}

    <!-- Section 2: Param\xE8tres d'Analyse -->
    ${this.genererSectionParametres(r)}

    <!-- Section 3: Ratios (si autoris\xE9) -->
    ${t.showRatios!==!1&&e.includeRatios!==!1?this.genererSectionRatios(r):""}

    <!-- Section 4: Bilan -->
    ${this.genererSectionBilan(r)}

    <!-- Section 5: Rentabilit\xE9 -->
    ${this.genererSectionRentabilite(r)}

    <!-- Section 6: Besoin en Cr\xE9dit -->
    ${this.genererSectionBesoinCredit(r)}

    <!-- Section 7: Personnes Caution -->
    ${this.genererSectionPersonnesCaution(t.personnesCaution)}

    <!-- Pied de page -->
    <div class="footer">
        <p>Document g\xE9n\xE9r\xE9 automatiquement le ${n}</p>
        ${e.includeSignature?`<div class="signature-section"><p>Signature de l'analyste: ___________________</p><p>Date: ___________________</p></div>`:""}
    </div>
</div>
        `}genererSectionDemandeCredit(t){return`
<div class="section">
    <h2><span class="section-icon">\u{1F4CB}</span> DEMANDE DE CR\xC9DIT</h2>
    <div class="info-row">
        <div class="info-item">
            <span class="info-label">Montant sollicit\xE9:</span>
            <span class="info-value highlight">${this.formatCurrency(t.montantDemande)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Dur\xE9e:</span>
            <span class="info-value">${t.dureeDemande||0} mois</span>
        </div>
        <div class="info-item">
            <span class="info-label">Nbre \xE9ch\xE9ances:</span>
            <span class="info-value">${t.nombreEcheance||0}</span>
        </div>
        <div class="info-item">
            <span class="info-label">\xC9ch\xE9ance:</span>
            <span class="info-value">${this.formatCurrency(t.echeance)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">P\xE9riodicit\xE9:</span>
            <span class="info-value">${t.periodiciteRemboursement||"-"}</span>
        </div>
    </div>
    <div class="info-row">
        <div class="info-item full-width">
            <span class="info-label">Objet du cr\xE9dit:</span>
            <span class="info-value">${t.objectCredit||"-"}</span>
        </div>
    </div>
    ${t.montantPropose?`
    <div class="proposition-box">
        <h3>Proposition</h3>
        <div class="info-row">
            <div class="info-item">
                <span class="info-label">Montant propos\xE9:</span>
                <span class="info-value highlight-green">${this.formatCurrency(t.montantPropose)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Dur\xE9e propos\xE9e:</span>
                <span class="info-value">${t.dureeProposee||0} mois</span>
            </div>
            <div class="info-item">
                <span class="info-label">Nbre \xE9ch\xE9ances:</span>
                <span class="info-value">${t.nombreEcheancePropose||0}</span>
            </div>
            <div class="info-item">
                <span class="info-label">\xC9ch\xE9ance propos\xE9e:</span>
                <span class="info-value">${this.formatCurrency(t.echeanceProposee)}</span>
            </div>
        </div>
    </div>
    `:""}
</div>
        `}genererSectionParametres(t){return`
<div class="section">
    <h2><span class="section-icon">\u2699\uFE0F</span> PARAM\xC8TRES D'ANALYSE</h2>
    <div class="info-row">
        <div class="info-item">
            <span class="info-label">Date \xE9valuation:</span>
            <span class="info-value">${t.dateEvaluation||"-"}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Cycle d'affaires:</span>
            <span class="info-value">${t.cycleAffaires||"-"}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Facteur cycle:</span>
            <span class="info-value">${t.facteurCycle||0}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Type CDR:</span>
            <span class="info-value">${t.typeCdr||"-"}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Valeur Garantie:</span>
            <span class="info-value highlight-green">${this.formatCurrency(t.valeurGarantie)}</span>
        </div>
    </div>
</div>
        `}genererSectionRatios(t){let e=[{nom:"R1 - Capacit\xE9 de remboursement",norme:"\u2265 200%",sollicite:t.calcR1Sollicite,propose:t.calcR1Propose,isGreaterBetter:!0,threshold:2},{nom:"R2 - Solvabilit\xE9",norme:"\u2265 35%",sollicite:t.calcR2,propose:t.calcR2,isGreaterBetter:!0,threshold:.35},{nom:"R3 - Liquidit\xE9",norme:"\u2265 100%",sollicite:t.calcR3,propose:t.calcR3,isGreaterBetter:!0,threshold:1},{nom:"R4 - Endettement",norme:"< 50%",sollicite:t.calcR4Sollicite,propose:t.calcR4Propose,isGreaterBetter:!1,threshold:.5},{nom:"R5 - D\xE9pendance",norme:"< 50%",sollicite:t.calcR5,propose:t.calcR5,isGreaterBetter:!1,threshold:.5},{nom:"R6 - Couverture Garantie",norme:"> 150%",sollicite:t.calcR6Sollicite,propose:t.calcR6Propose,isGreaterBetter:!0,threshold:1.5}],r=e.filter(i=>this.isRatioConforme(i.sollicite,i.threshold,i.isGreaterBetter)).length,n=e.filter(i=>this.isRatioConforme(i.propose,i.threshold,i.isGreaterBetter)).length;return`
<div class="section">
    <h2><span class="section-icon">\u{1F4CA}</span> RATIOS DE D\xC9CISION</h2>
    <table class="ratios-table">
        <thead>
            <tr>
                <th>Ratio</th>
                <th>Norme</th>
                <th>Sollicit\xE9</th>
                <th>Propos\xE9</th>
            </tr>
        </thead>
        <tbody>
            ${e.map(i=>`
                <tr>
                    <td class="ratio-name">${i.nom}</td>
                    <td class="ratio-norme">${i.norme}</td>
                    <td class="ratio-value ${this.getRatioClass(i.sollicite,i.threshold,i.isGreaterBetter)}">
                        ${this.formatPercent(i.sollicite)}
                        <span class="ratio-status">${this.getRatioStatus(i.sollicite,i.threshold,i.isGreaterBetter)}</span>
                    </td>
                    <td class="ratio-value ${this.getRatioClass(i.propose,i.threshold,i.isGreaterBetter)}">
                        ${t.montantPropose?this.formatPercent(i.propose):"-"}
                        ${t.montantPropose?`<span class="ratio-status">${this.getRatioStatus(i.propose,i.threshold,i.isGreaterBetter)}</span>`:""}
                    </td>
                </tr>
            `).join("")}
        </tbody>
    </table>
    <div class="ratios-summary">
        <div class="summary-item ${r===6?"success":"danger"}">
            <strong>Sollicit\xE9:</strong> ${r}/6 conformes
        </div>
        <div class="summary-item ${n===6?"success":"danger"}">
            <strong>Propos\xE9:</strong> ${n}/6 conformes
        </div>
    </div>
</div>
        `}genererSectionBilan(t){return`
<div class="section page-break-before">
    <h2><span class="section-icon">\u{1F4C8}</span> 1. BILAN</h2>

    <!-- Actif Immobilis\xE9 -->
    <h3 class="subsection-title">Actif Immobilis\xE9</h3>
    <table class="data-table">
        <thead>
            <tr>
                <th>\xC9l\xE9ments</th>
                <th class="text-right">P\xE9riode N</th>
                <th class="text-right">P\xE9riode N-1</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Terrain</td><td class="text-right">${this.formatCurrency(t.terrainN)}</td><td class="text-right">${this.formatCurrency(t.terrainN1)}</td></tr>
            <tr><td>B\xE2timent / Magasin</td><td class="text-right">${this.formatCurrency(t.batimentMagasinN)}</td><td class="text-right">${this.formatCurrency(t.batimentMagasinN1)}</td></tr>
            <tr><td>Installation / Agencement</td><td class="text-right">${this.formatCurrency(t.installationAgencementN)}</td><td class="text-right">${this.formatCurrency(t.installationAgencementN1)}</td></tr>
            <tr><td>Mat\xE9riel Industriel</td><td class="text-right">${this.formatCurrency(t.materielIndustrielN)}</td><td class="text-right">${this.formatCurrency(t.materielIndustrielN1)}</td></tr>
            <tr><td>Mobilier de Bureau</td><td class="text-right">${this.formatCurrency(t.mobilierBureauN)}</td><td class="text-right">${this.formatCurrency(t.mobilierBureauN1)}</td></tr>
            <tr><td>Mat\xE9riel Informatique</td><td class="text-right">${this.formatCurrency(t.materielInformatiqueN)}</td><td class="text-right">${this.formatCurrency(t.materielInformatiqueN1)}</td></tr>
            <tr><td>Mat\xE9riel de Transport</td><td class="text-right">${this.formatCurrency(t.materielTransportN)}</td><td class="text-right">${this.formatCurrency(t.materielTransportN1)}</td></tr>
            <tr><td>Autres Immobilisations</td><td class="text-right">${this.formatCurrency(t.autreImmobilisationN)}</td><td class="text-right">${this.formatCurrency(t.autreImmobilisationN1)}</td></tr>
            <tr class="total-row"><td><strong>TOTAL IMMOBILISATIONS</strong></td><td class="text-right"><strong>${this.formatCurrency(t.totalImmobilisationsN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.totalImmobilisationsN1)}</strong></td></tr>
        </tbody>
    </table>

    <!-- Actif Circulant -->
    <h3 class="subsection-title">Actif Circulant</h3>
    <table class="data-table">
        <thead>
            <tr>
                <th>\xC9l\xE9ments</th>
                <th class="text-right">P\xE9riode N</th>
                <th class="text-right">P\xE9riode N-1</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Stocks</td><td class="text-right">${this.formatCurrency(t.stocksN)}</td><td class="text-right">${this.formatCurrency(t.stocksN1)}</td></tr>
            <tr><td>Cr\xE9ances Clients</td><td class="text-right">${this.formatCurrency(t.creancesClientsN)}</td><td class="text-right">${this.formatCurrency(t.creancesClientsN1)}</td></tr>
            <tr><td>Tr\xE9sorerie (Caisse/Banque)</td><td class="text-right">${this.formatCurrency(t.tresorerieCaisseBanqueN)}</td><td class="text-right">${this.formatCurrency(t.tresorerieCaisseBanqueN1)}</td></tr>
            <tr class="total-row"><td><strong>TOTAL ACTIF</strong></td><td class="text-right"><strong>${this.formatCurrency(t.totalActifN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.totalActifN1)}</strong></td></tr>
        </tbody>
    </table>

    <!-- Passif -->
    <h3 class="subsection-title">Passif</h3>
    <table class="data-table">
        <thead>
            <tr>
                <th>\xC9l\xE9ments</th>
                <th class="text-right">P\xE9riode N</th>
                <th class="text-right">P\xE9riode N-1</th>
            </tr>
        </thead>
        <tbody>
            <tr class="highlight-row"><td><strong>CAPITAUX PROPRES</strong></td><td class="text-right"><strong>${this.formatCurrency(t.capitauxPropresN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.capitauxPropresN1)}</strong></td></tr>
            <tr><td>Emprunts Long Terme</td><td class="text-right">${this.formatCurrency(t.empruntLongTermeN)}</td><td class="text-right">${this.formatCurrency(t.empruntLongTermeN1)}</td></tr>
            <tr><td>Emprunts Court Terme</td><td class="text-right">${this.formatCurrency(t.empruntCourtTermeN)}</td><td class="text-right">${this.formatCurrency(t.empruntCourtTermeN1)}</td></tr>
            <tr><td>Autres Dettes</td><td class="text-right">${this.formatCurrency(t.autresDettesN)}</td><td class="text-right">${this.formatCurrency(t.autresDettesN1)}</td></tr>
            <tr class="total-row"><td><strong>TOTAL DETTES</strong></td><td class="text-right"><strong>${this.formatCurrency(t.totalDettesN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.totalDettesN1)}</strong></td></tr>
        </tbody>
    </table>

    <!-- Indicateurs -->
    <h3 class="subsection-title">Indicateurs Financiers</h3>
    <table class="data-table">
        <tbody>
            <tr><td>Fonds de Roulement</td><td class="text-right">${this.formatCurrency(t.fondsRoulementN)}</td><td class="text-right">${this.formatCurrency(t.fondsRoulementN1)}</td></tr>
            <tr><td>Besoin en Fonds de Roulement</td><td class="text-right">${this.formatCurrency(t.besoinFondsRoulementN)}</td><td class="text-right">${this.formatCurrency(t.besoinFondsRoulementN1)}</td></tr>
        </tbody>
    </table>
</div>
        `}genererSectionRentabilite(t){return`
<div class="section page-break-before">
    <h2><span class="section-icon">\u{1F4C9}</span> 2. RENTABILIT\xC9 DE L'ACTIVIT\xC9</h2>

    <!-- Produits -->
    <h3 class="subsection-title">Produits</h3>
    <table class="data-table">
        <thead>
            <tr>
                <th>\xC9l\xE9ments</th>
                <th class="text-right">N</th>
                <th class="text-right">N-1</th>
                <th class="text-right">N+1</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Chiffre d'Affaires</td><td class="text-right">${this.formatCurrency(t.chiffreAffairesN)}</td><td class="text-right">${this.formatCurrency(t.chiffreAffairesN1)}</td><td class="text-right">${this.formatCurrency(t.chiffreAffairesNplus1)}</td></tr>
            <tr><td>Co\xFBt d'Achat des Marchandises</td><td class="text-right">${this.formatCurrency(t.coutAchatMarchandisesN)}</td><td class="text-right">${this.formatCurrency(t.coutAchatMarchandisesN1)}</td><td class="text-right">${this.formatCurrency(t.coutAchatMarchandisesNplus1)}</td></tr>
            <tr class="total-row highlight-teal"><td><strong>MARGE BRUTE</strong></td><td class="text-right"><strong>${this.formatCurrency(t.margeBruteN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.margeBruteN1)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.margeBruteNplus1)}</strong></td></tr>
        </tbody>
    </table>

    <!-- Charges -->
    <h3 class="subsection-title">Charges d'Exploitation</h3>
    <table class="data-table">
        <thead>
            <tr>
                <th>\xC9l\xE9ments</th>
                <th class="text-right">N</th>
                <th class="text-right">N-1</th>
                <th class="text-right">N+1</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Salaires</td><td class="text-right">${this.formatCurrency(t.salairesN)}</td><td class="text-right">${this.formatCurrency(t.salairesN1)}</td><td class="text-right">${this.formatCurrency(t.salairesNplus1)}</td></tr>
            <tr><td>Pr\xE9l\xE8vement Entrepreneur</td><td class="text-right">${this.formatCurrency(t.prelevementEntrepreneurN)}</td><td class="text-right">${this.formatCurrency(t.prelevementEntrepreneurN1)}</td><td class="text-right">${this.formatCurrency(t.prelevementEntrepreneurNplus1)}</td></tr>
            <tr><td>Loyers</td><td class="text-right">${this.formatCurrency(t.loyersN)}</td><td class="text-right">${this.formatCurrency(t.loyersN1)}</td><td class="text-right">${this.formatCurrency(t.loyersNplus1)}</td></tr>
            <tr><td>Transport</td><td class="text-right">${this.formatCurrency(t.transportN)}</td><td class="text-right">${this.formatCurrency(t.transportN1)}</td><td class="text-right">${this.formatCurrency(t.transportNplus1)}</td></tr>
            <tr><td>\xC9lectricit\xE9/Eau/T\xE9l\xE9phone</td><td class="text-right">${this.formatCurrency(t.electriciteEauTelephoneN)}</td><td class="text-right">${this.formatCurrency(t.electriciteEauTelephoneN1)}</td><td class="text-right">${this.formatCurrency(t.electriciteEauTelephoneNplus1)}</td></tr>
            <tr><td>Fournitures et Autres Besoins</td><td class="text-right">${this.formatCurrency(t.fournituresAutresBesoinsN)}</td><td class="text-right">${this.formatCurrency(t.fournituresAutresBesoinsN1)}</td><td class="text-right">${this.formatCurrency(t.fournituresAutresBesoinsNplus1)}</td></tr>
            <tr><td>Entretien/R\xE9paration</td><td class="text-right">${this.formatCurrency(t.entretienReparationN)}</td><td class="text-right">${this.formatCurrency(t.entretienReparationN1)}</td><td class="text-right">${this.formatCurrency(t.entretienReparationNplus1)}</td></tr>
            <tr><td>Carburant/Lubrifiants</td><td class="text-right">${this.formatCurrency(t.carburantLubrifiantsN)}</td><td class="text-right">${this.formatCurrency(t.carburantLubrifiantsN1)}</td><td class="text-right">${this.formatCurrency(t.carburantLubrifiantsNplus1)}</td></tr>
            <tr><td>Publicit\xE9/Promotion</td><td class="text-right">${this.formatCurrency(t.publicitePromotionN)}</td><td class="text-right">${this.formatCurrency(t.publicitePromotionN1)}</td><td class="text-right">${this.formatCurrency(t.publicitePromotionNplus1)}</td></tr>
            <tr><td>Imp\xF4ts et Taxes</td><td class="text-right">${this.formatCurrency(t.impotsTaxesN)}</td><td class="text-right">${this.formatCurrency(t.impotsTaxesN1)}</td><td class="text-right">${this.formatCurrency(t.impotsTaxesNplus1)}</td></tr>
            <tr><td>Frais Bancaires/Int\xE9r\xEAts</td><td class="text-right">${this.formatCurrency(t.fraisBancairesInteretsN)}</td><td class="text-right">${this.formatCurrency(t.fraisBancairesInteretsN1)}</td><td class="text-right">${this.formatCurrency(t.fraisBancairesInteretsNplus1)}</td></tr>
            <tr><td>\xC9ch\xE9ance Autre Cr\xE9dit</td><td class="text-right">${this.formatCurrency(t.echeanceAutreCreditN)}</td><td class="text-right">${this.formatCurrency(t.echeanceAutreCreditN1)}</td><td class="text-right">${this.formatCurrency(t.echeanceAutreCreditNplus1)}</td></tr>
            <tr><td>Diverses Charges</td><td class="text-right">${this.formatCurrency(t.diversesChargesN)}</td><td class="text-right">${this.formatCurrency(t.diversesChargesN1)}</td><td class="text-right">${this.formatCurrency(t.diversesChargesNplus1)}</td></tr>
            <tr class="total-row highlight-orange"><td><strong>TOTAL CHARGES</strong></td><td class="text-right"><strong>${this.formatCurrency(t.totalChargesExploitationN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.totalChargesExploitationN1)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.totalChargesExploitationNplus1)}</strong></td></tr>
        </tbody>
    </table>

    <!-- R\xE9sultats -->
    <h3 class="subsection-title">R\xE9sultats</h3>
    <table class="data-table">
        <tbody>
            <tr><td>Amortissements/Provisions</td><td class="text-right">${this.formatCurrency(t.amortissementsProvisionsN)}</td><td class="text-right">${this.formatCurrency(t.amortissementsProvisionsN1)}</td><td class="text-right">${this.formatCurrency(t.amortissementsProvisionsNplus1)}</td></tr>
            <tr class="highlight-row"><td><strong>R\xE9sultat d'Exploitation</strong></td><td class="text-right"><strong>${this.formatCurrency(t.resultatExploitationN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.resultatExploitationN1)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.resultatExploitationNplus1)}</strong></td></tr>
            <tr><td>Autres Revenus Hors Activit\xE9</td><td class="text-right">${this.formatCurrency(t.autresRevenusHorsActiviteN)}</td><td class="text-right">${this.formatCurrency(t.autresRevenusHorsActiviteN1)}</td><td class="text-right">${this.formatCurrency(t.autresRevenusHorsActiviteNplus1)}</td></tr>
            <tr class="total-row highlight-indigo"><td><strong>CASH FLOW</strong></td><td class="text-right"><strong>${this.formatCurrency(t.cashFlowN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.cashFlowN1)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.cashFlowNplus1)}</strong></td></tr>
            <tr class="total-row highlight-indigo"><td><strong>CAPACIT\xC9 DE REMBOURSEMENT</strong></td><td class="text-right"><strong>${this.formatCurrency(t.capaciteRemboursementN)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.capaciteRemboursementN1)}</strong></td><td class="text-right"><strong>${this.formatCurrency(t.capaciteRemboursementNplus1)}</strong></td></tr>
        </tbody>
    </table>
</div>
        `}genererSectionBesoinCredit(t){return`
<div class="section">
    <h2><span class="section-icon">\u{1F4B0}</span> 3. \xC9VALUATION DU BESOIN R\xC9EL EN CR\xC9DIT</h2>

    <div class="two-columns">
        <!-- Besoin Investissement -->
        <div class="column">
            <h3 class="subsection-title">Besoin en Investissement</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>\xC9l\xE9ments</th>
                        <th class="text-right">Montant</th>
                        <th class="text-right">Ajustement</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Co\xFBt \xC9quipement</td><td class="text-right">${this.formatCurrency(t.coutEquipement)}</td><td class="text-right">${this.formatCurrency(t.ajustCoutEquipement)}</td></tr>
                    <tr><td>D\xE9penses Rattach\xE9es</td><td class="text-right">${this.formatCurrency(t.depensesRattachees)}</td><td class="text-right">${this.formatCurrency(t.ajustDepensesRattachees)}</td></tr>
                    <tr><td>Apport Personnel</td><td class="text-right">${this.formatCurrency(t.apportPersonnel)}</td><td class="text-right">${this.formatCurrency(t.ajustApportPersonnel)}</td></tr>
                    <tr class="total-row highlight-cyan"><td><strong>BESOIN R\xC9EL INVESTISSEMENT</strong></td><td class="text-right"><strong>${this.formatCurrency(t.besoinReelInvestissement)}</strong></td><td class="text-right">-</td></tr>
                </tbody>
            </table>
        </div>

        <!-- Besoin Exploitation -->
        <div class="column">
            <h3 class="subsection-title">Besoin en Exploitation</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>\xC9l\xE9ments</th>
                        <th class="text-right">Montant</th>
                        <th class="text-right">Ajustement</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Co\xFBt Achat Cycle</td><td class="text-right">${this.formatCurrency(t.coutAchatCycle)}</td><td class="text-right">${this.formatCurrency(t.ajustCoutAchatCycle)}</td></tr>
                    <tr><td>Nbre Cycles \xE0 Financer</td><td class="text-right">${t.nbreCycleFinancer||0}</td><td class="text-right">-</td></tr>
                    <tr><td>Tr\xE9sorerie Disponible</td><td class="text-right">${this.formatCurrency(t.tresorerieDisponible)}</td><td class="text-right">${this.formatCurrency(t.ajustTresorerieDispo)}</td></tr>
                    <tr><td>Stock Actuel</td><td class="text-right">${this.formatCurrency(t.stockActuel)}</td><td class="text-right">${this.formatCurrency(t.ajustStockActuel)}</td></tr>
                    <tr><td>Comptes \xE0 Recevoir</td><td class="text-right">${this.formatCurrency(t.comptesRecevoir)}</td><td class="text-right">${this.formatCurrency(t.ajustComptesRecevoir)}</td></tr>
                    <tr><td>Dettes Fournisseurs</td><td class="text-right">${this.formatCurrency(t.dettesFournisseurs)}</td><td class="text-right">${this.formatCurrency(t.ajustDettesFournisseurs)}</td></tr>
                    <tr><td>Cr\xE9dit Fournisseur</td><td class="text-right">${this.formatCurrency(t.creditFournisseur)}</td><td class="text-right">${this.formatCurrency(t.ajustCreditFournisseur)}</td></tr>
                    <tr class="total-row highlight-cyan"><td><strong>BESOIN R\xC9EL EXPLOITATION</strong></td><td class="text-right"><strong>${this.formatCurrency(t.besoinReelExploitation)}</strong></td><td class="text-right">-</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
        `}genererSectionPersonnesCaution(t){return!t||t.length===0?`
<div class="section">
    <h2><span class="section-icon">\u{1F465}</span> 4. PERSONNES CAUTION</h2>
    <div class="no-data-box">
        <p>Aucune personne caution enregistr\xE9e pour cette demande</p>
    </div>
</div>
            `:`
<div class="section">
    <h2><span class="section-icon">\u{1F465}</span> 4. PERSONNES CAUTION (${t.length})</h2>
    <table class="data-table">
        <thead>
            <tr>
                <th>Nom complet</th>
                <th>T\xE9l\xE9phone</th>
                <th>Activit\xE9</th>
                <th>Profession</th>
                <th class="text-center">\xC2ge</th>
            </tr>
        </thead>
        <tbody>
            ${t.map(e=>`
                <tr>
                    <td class="highlight-purple"><strong>${this.getFullName(e)}</strong></td>
                    <td>${e.telephone||"-"}</td>
                    <td>${e.activite||"-"}</td>
                    <td>${e.profession||"-"}</td>
                    <td class="text-center">${e.age||"-"}</td>
                </tr>
            `).join("")}
        </tbody>
    </table>
</div>
        `}formatCurrency(t){return t==null?"0 GNF":new Intl.NumberFormat("fr-FR",{style:"currency",currency:"GNF",minimumFractionDigits:0,maximumFractionDigits:0}).format(t)}formatPercent(t){return t==null?"-":`${(t*100).toFixed(1)}%`}getFullName(t){let e=[];return t.nom&&e.push(t.nom),t.prenom&&e.push(t.prenom),e.join(" ")||"-"}isRatioConforme(t,e,r){return t==null?!1:r?t>=e:t<e}getRatioClass(t,e,r){return t==null?"neutral":this.isRatioConforme(t,e,r)?"conforme":"non-conforme"}getRatioStatus(t,e,r){return t==null?"":this.isRatioConforme(t,e,r)?"\u2713":"\u2717"}genererHTMLLegacy(t,e){let r=this.getStylesLegacy(),n=this.genererContenuLegacy(t,e);return`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>R\xE9sum\xE9 d'Analyse de Cr\xE9dit</title>
    <style>${r}</style>
</head>
<body>
    ${n}
</body>
</html>
        `}genererContenuLegacy(t,e){let r=new Date().toLocaleDateString("fr-FR",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"});return`
<div class="print-container">
    <div class="header">
        <div class="header-content">
            <h1>R\xC9SUM\xC9 D'ANALYSE DE CR\xC9DIT</h1>
            <div class="header-info">
                <p><strong>Date d'impression:</strong> ${r}</p>
                <p><strong>Montant demand\xE9:</strong> ${t.montantDemande||"-"}</p>
                <p><strong>\xC9valuation:</strong> <span class="evaluation ${(t.evaluationGlobale||"").toLowerCase()}">${t.evaluationGlobale||"-"}</span></p>
            </div>
        </div>
    </div>

    ${this.genererEvaluationGlobaleLegacy(t)}
    ${e.includeIndicateurs!==!1?this.genererIndicateursClesLegacy(t):""}
    ${this.genererInformationsGeneralesLegacy(t)}
    ${this.genererBilanFinancierLegacy(t)}
    ${this.genererExploitationLegacy(t)}
    ${this.genererDemandeCreditLegacy(t)}
    ${this.genererPersonnesCautionLegacy(t)}
    ${this.genererRecommandationsLegacy(t)}

    <div class="footer">
        <p>Document g\xE9n\xE9r\xE9 automatiquement le ${r}</p>
        ${e.includeSignature?`<div class="signature-section"><p>Signature de l'analyste: ___________________</p></div>`:""}
    </div>
</div>
        `}genererEvaluationGlobaleLegacy(t){return`
<div class="section evaluation-section">
    <h2>\xC9VALUATION GLOBALE</h2>
    <div class="evaluation-grid">
        <div class="evaluation-item">
            <h3>Statut Global</h3>
            <div class="evaluation-badge ${(t.evaluationGlobale||"").toLowerCase()}">${t.evaluationGlobale||"-"}</div>
        </div>
        <div class="evaluation-item">
            <h3>Score de Risque</h3>
            <div class="score">${t.scoreRisque||0}/100</div>
        </div>
        <div class="evaluation-item">
            <h3>Seuils Respect\xE9s</h3>
            <div class="seuils">${t.seuilsRespetes||0}/6</div>
        </div>
    </div>
</div>
        `}genererIndicateursClesLegacy(t){return!t.ratios||t.ratios.length===0?"":`
<div class="section">
    <h2>INDICATEURS CL\xC9S</h2>
    <div class="indicateurs-grid">
        ${t.ratios.map(e=>`
            <div class="indicateur-item">
                <h4>${e.nom}</h4>
                <div class="ratio-value ${(e.statut||"").toLowerCase()}">${e.valeur}%</div>
                <div class="ratio-status">${e.statut}</div>
                <div class="ratio-formula">${e.formule||""}</div>
            </div>
        `).join("")}
    </div>
</div>
        `}genererInformationsGeneralesLegacy(t){return`
<div class="section">
    <h2>INFORMATIONS G\xC9N\xC9RALES</h2>
    <div class="info-grid">
        <div class="info-block">
            <h3>Promoteur</h3>
            ${this.genererTableauLegacy(t.promoteur)}
        </div>
        <div class="info-block">
            <h3>Entreprise</h3>
            ${this.genererTableauLegacy(t.entreprise)}
        </div>
    </div>
</div>
        `}genererBilanFinancierLegacy(t){return`
<div class="section">
    <h2>BILAN FINANCIER</h2>
    <div class="bilan-grid">
        <div class="bilan-block">
            <h3>Bilan Entreprise</h3>
            ${this.genererTableauLegacy(t.bilanEntreprise)}
        </div>
        <div class="bilan-block">
            <h3>Patrimoine Personnel</h3>
            ${this.genererTableauLegacy(t.bilanPersonnel)}
        </div>
    </div>
</div>
        `}genererExploitationLegacy(t){return`
<div class="section">
    <h2>EXPLOITATION</h2>
    <div class="exploitation-grid">
        <div class="exploitation-block">
            <h3>Exploitation Actuelle</h3>
            ${this.genererTableauLegacy(t.exploitationActuelle)}
            <h4>D\xE9tail des Charges</h4>
            ${this.genererTableauLegacy(t.chargesActuelles)}
        </div>
        <div class="exploitation-block">
            <h3>Exploitation Pr\xE9visionnelle</h3>
            ${this.genererTableauLegacy(t.exploitationPrevisionnelle)}
            <h4>D\xE9tail des Charges</h4>
            ${this.genererTableauLegacy(t.chargesPrevisionnelles)}
        </div>
    </div>
</div>
        `}genererDemandeCreditLegacy(t){return`
<div class="section">
    <h2>DEMANDE DE CR\xC9DIT</h2>
    <div class="demande-grid">
        <div class="demande-block">
            <h3>Informations Principales</h3>
            ${this.genererTableauLegacy(t.demandeCredit)}
        </div>
        <div class="demande-block">
            <h3>Informations Administratives</h3>
            ${this.genererTableauLegacy(t.infoAdministratives)}
        </div>
    </div>
</div>
        `}genererPersonnesCautionLegacy(t){return!t.personnesCaution||t.personnesCaution.length===0?`
<div class="section">
    <h2>PERSONNES CAUTION</h2>
    <div class="no-caution">
        <p>Aucune personne caution renseign\xE9e</p>
    </div>
</div>
            `:`
<div class="section">
    <h2>PERSONNES CAUTION (${t.personnesCaution.length})</h2>
    <div class="caution-content">
        ${this.genererTableauLegacy(t.personnesCautionData)}
        ${t.analyseGarantie?`
        <div class="caution-analysis">
            <h3>Analyse de Garantie</h3>
            <p><strong>Niveau:</strong> ${t.analyseGarantie.niveau}</p>
            <p><strong>Score:</strong> ${t.analyseGarantie.score}/100</p>
            <p><strong>Description:</strong> ${t.analyseGarantie.description}</p>
        </div>
        `:""}
    </div>
</div>
        `}genererRecommandationsLegacy(t){return!t.recommandations&&!t.decisionRecommandee?"":`
<div class="section">
    <h2>RECOMMANDATIONS ET ANALYSE</h2>
    <div class="recommandations-grid">
        ${t.recommandations?`
        <div class="recommandations-block">
            <h3>Recommandations</h3>
            <ul>
                ${t.recommandations.map(e=>`<li>${e}</li>`).join("")}
            </ul>
        </div>
        `:""}
        ${t.conseilsAmelioration?`
        <div class="recommandations-block">
            <h3>Conseils d'Am\xE9lioration</h3>
            <ul>
                ${t.conseilsAmelioration.map(e=>`<li>${e}</li>`).join("")}
            </ul>
        </div>
        `:""}
    </div>
    ${t.decisionRecommandee?`
    <div class="decision-block">
        <h3>Recommandation de D\xE9cision</h3>
        <div class="decision-content">
            <p><strong>D\xE9cision:</strong> <span class="decision ${(t.decisionRecommandee.decision||"").toLowerCase()}">${(t.decisionRecommandee.decision||"").replace("_"," ")}</span></p>
            <p><strong>Justification:</strong> ${t.decisionRecommandee.justification||""}</p>
            ${t.decisionRecommandee.conditions?`
            <p><strong>Conditions:</strong></p>
            <ul>
                ${t.decisionRecommandee.conditions.map(e=>`<li>${e}</li>`).join("")}
            </ul>
            `:""}
        </div>
    </div>
    `:""}
</div>
        `}genererTableauLegacy(t){return!t||t.length===0?"<p>Aucune donn\xE9e disponible</p>":`
<table>
    <tbody>
        ${t.map(e=>`
            <tr ${e.isTotal?'class="total-row"':""}>
                <td class="label">${e.label}</td>
                <td class="value ${e.severity||""}">${e.value}</td>
            </tr>
        `).join("")}
    </tbody>
</table>
        `}getStylesLegacy(){return`
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
        `}getStyles(){return`
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
        `}static \u0275fac=function(e){return new(e||s)};static \u0275prov=a({token:s,factory:s.\u0275fac,providedIn:"root"})};export{o as a};
