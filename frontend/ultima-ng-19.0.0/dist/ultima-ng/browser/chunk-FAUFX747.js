import{a as ve}from"./chunk-PGREYID7.js";import{a as fe,b as he}from"./chunk-LUIQEVTA.js";import"./chunk-FVKECR4K.js";import{f as ge}from"./chunk-MVMJFDGQ.js";import{b as pe}from"./chunk-K2RLQDMJ.js";import{c as te,d as ie}from"./chunk-JK4JG2UW.js";import{b as oe}from"./chunk-5YYAURUY.js";import{b as me}from"./chunk-7ZFHYQCZ.js";import{b as ae}from"./chunk-ML3LU6MO.js";import{k as se}from"./chunk-SRGIHKGJ.js";import"./chunk-KLDL5O4H.js";import"./chunk-PXEEYFPS.js";import"./chunk-4MNJFNZT.js";import"./chunk-7A4CRAMP.js";import"./chunk-3WTE2CKQ.js";import"./chunk-LA2FUI34.js";import"./chunk-ZNTL7BEM.js";import{a as le,b as de}from"./chunk-QZOXHZZK.js";import"./chunk-MPVO6A2U.js";import"./chunk-D6YNXGTA.js";import"./chunk-ED7TFTUL.js";import"./chunk-MZ7FZGG3.js";import{a as ce,b as ue}from"./chunk-C4WQ325L.js";import"./chunk-HNZBC55R.js";import"./chunk-J62YMCRW.js";import"./chunk-J6B6CWYC.js";import"./chunk-IEQZB3PI.js";import"./chunk-ATSSA22C.js";import"./chunk-XYTTGGFW.js";import"./chunk-ZNT52ZF3.js";import"./chunk-Z7KSDRLV.js";import"./chunk-N4Q6Z3MW.js";import{a as ne,b as re}from"./chunk-3BEM77IG.js";import{b as j,d as Y}from"./chunk-UCSGE5ZL.js";import"./chunk-2O7XYKW4.js";import{a as T}from"./chunk-YTFCGSG6.js";import"./chunk-RHLJ6NE2.js";import"./chunk-R2ZYXRFE.js";import{a as Z,b as K}from"./chunk-NRZ4QNP7.js";import"./chunk-GFZUU5ZD.js";import"./chunk-BODZH67C.js";import"./chunk-KR7F45VC.js";import{a as H,b as X,f as Q,g as W}from"./chunk-XKXBFP6V.js";import"./chunk-ULM4QL4Q.js";import{oa as F,sa as J}from"./chunk-3YZBLOIS.js";import"./chunk-2I6ZAGC7.js";import{b as ee}from"./chunk-FVCMZ6IK.js";import"./chunk-VDYO34A5.js";import"./chunk-Y2QT2WK5.js";import"./chunk-S35HUXPS.js";import{l as B,y as z}from"./chunk-GZWLZB4Q.js";import{Bb as g,Db as I,Eb as _,Fb as x,Gb as n,Hb as r,Ib as d,Mb as O,Rb as R,Sb as u,U as L,Va as s,_ as S,cc as o,dc as h,ec as m,fa as y,ga as E,gb as G,lc as U,ma as q,mb as v,mc as w,nc as D,va as V,vb as p,yb as $}from"./chunk-MKA3N2SS.js";import{a as b,b as P}from"./chunk-GAL4ENT6.js";var N=class a{imprimerResumeCredit(e,t={}){let i=window.open("","_blank","width=800,height=600");if(!i){console.error("Impossible d'ouvrir la fen\xEAtre d'impression");return}let l=this.genererHTMLComplet(e,t);i.document.write(l),i.document.close(),i.onload=()=>{setTimeout(()=>{i.print()},500)}}genererHTMLComplet(e,t){return`
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>${t.title||"R\xE9sum\xE9 d'Analyse de Cr\xE9dit"}</title>
                ${this.genererStyles()}
            </head>
            <body>
                ${this.genererPage1InformationsGenerales(e)}
                ${this.genererPage2Exploitation(e)}
                ${this.genererPage3ResumeAnalyse(e)}
                ${this.genererPage4PersonnesCaution(e,t.includeSignature)}
            </body>
            </html>
        `}genererPage1InformationsGenerales(e){let t=i=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"GNF",minimumFractionDigits:0}).format(i||0);return`
            <div class="page">
                <div class="header">
                    <h1>R\xC9SUM\xC9 D'ANALYSE DE CR\xC9DIT</h1>
                    <h2>PAGE 1 : INFORMATIONS G\xC9N\xC9RALES</h2>
                    <div class="date">Date : ${new Date().toLocaleDateString("fr-FR")}</div>
                </div>

                <!-- Informations de la demande -->
                <div class="section">
                    <h3>DEMANDE DE CR\xC9DIT</h3>
                    <table class="info-table">
                        <tr>
                            <td><strong>Montant demand\xE9 :</strong></td>
                            <td>${t(e.montantDemande)}</td>
                            <td><strong>Date demande :</strong></td>
                            <td>${e.demandeCredit?.[0]?.value||"-"}</td>
                        </tr>
                        <tr>
                            <td><strong>Dur\xE9e :</strong></td>
                            <td>${e.demandeCredit?.[2]?.value||"-"}</td>
                            <td><strong>Mensualit\xE9 estim\xE9e :</strong></td>
                            <td>${e.demandeCredit?.[4]?.value||"-"}</td>
                        </tr>
                        <tr>
                            <td><strong>Objet du financement :</strong></td>
                            <td colspan="3">${e.demandeCredit?.[3]?.value||"-"}</td>
                        </tr>
                    </table>
                </div>

                <!-- Informations du promoteur -->
                <div class="section">
                    <h3>INFORMATIONS DU PROMOTEUR</h3>
                    <table class="info-table">
                        ${e.promoteur?.map((i,l)=>l%2===0?`
                            <tr>
                                <td><strong>${i.label} :</strong></td>
                                <td>${i.value}</td>
                                ${e.promoteur[l+1]?`
                                    <td><strong>${e.promoteur[l+1].label} :</strong></td>
                                    <td>${e.promoteur[l+1].value}</td>
                                `:"<td></td><td></td>"}
                            </tr>
                            `:"").join("")}
                    </table>
                </div>

                <!-- Informations de l'entreprise -->
                <div class="section">
                    <h3>INFORMATIONS DE L'ENTREPRISE</h3>
                    <table class="info-table">
                        ${e.entreprise?.map((i,l)=>l%2===0?`
                            <tr>
                                <td><strong>${i.label} :</strong></td>
                                <td>${i.value}</td>
                                ${e.entreprise[l+1]?`
                                    <td><strong>${e.entreprise[l+1].label} :</strong></td>
                                    <td>${e.entreprise[l+1].value}</td>
                                `:"<td></td><td></td>"}
                            </tr>
                            `:"").join("")}
                    </table>
                </div>

                <!-- Bilans financiers -->
                <div class="section">
                    <h3>BILANS FINANCIERS</h3>
                    <div class="bilan-container">
                        <div class="bilan-column">
                            <h4>Bilan Entreprise</h4>
                            <table class="small-table">
                                ${e.bilanEntreprise?.slice(0,7).map(i=>`
                                    <tr>
                                        <td>${i.label}</td>
                                        <td class="text-right">${i.value}</td>
                                    </tr>
                                `).join("")}
                            </table>
                        </div>
                        <div class="bilan-column">
                            <h4>Patrimoine Personnel</h4>
                            <table class="small-table">
                                ${e.bilanPersonnel?.map(i=>`
                                    <tr ${i.isTotal?'class="total-row"':""}>
                                        <td>${i.label}</td>
                                        <td class="text-right">${i.value}</td>
                                    </tr>
                                `).join("")}
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Informations administratives -->
                ${e.informationsAdministratives?`
                <div class="section">
                    <h3>TRA\xC7ABILIT\xC9 ADMINISTRATIVE</h3>
                    <table class="info-table">
                        <tr>
                            <td><strong>D\xE9l\xE9gation :</strong></td>
                            <td>${e.informationsAdministratives.delegation||"-"}</td>
                            <td><strong>Agence :</strong></td>
                            <td>${e.informationsAdministratives.agence||"-"}</td>
                        </tr>
                        <tr>
                            <td><strong>Point de vente :</strong></td>
                            <td>${e.informationsAdministratives.pointVente||"-"}</td>
                            <td><strong>Agent traitant :</strong></td>
                            <td>${e.informationsAdministratives.utilisateurTraitant||"-"}</td>
                        </tr>
                    </table>
                </div>
                `:""}

                <div class="footer">
                    <p><strong>NB: L'emprunteur et l'agent de cr\xE9dit doivent parapher toutes les pages.</strong></p>
                    <div class="paraphe-zone">
                        <div>Paraphe emprunteur : ________</div>
                        <div>Paraphe agent : ________</div>
                    </div>
                </div>
            </div>
        `}genererPage2Exploitation(e){return`
            <div class="page">
                <div class="header">
                    <h1>R\xC9SUM\xC9 D'ANALYSE DE CR\xC9DIT</h1>
                    <h2>PAGE 2 : EXPLOITATION</h2>
                    <div class="date">Date : ${new Date().toLocaleDateString("fr-FR")}</div>
                </div>

                <!-- Exploitation Actuelle -->
                <div class="section">
                    <h3>EXPLOITATION ACTUELLE</h3>
                    <table class="info-table">
                        ${e.exploitationActuelle?.map(t=>`
                            <tr ${t.isTotal?'class="total-row"':""} ${t.isRatio?'class="ratio-row"':""}>
                                <td><strong>${t.label} :</strong></td>
                                <td class="${t.isTotal||t.isRatio?"highlight":""}">
                                    ${t.value}
                                    ${t.severity?this.getBadgeHTML(t.severity):""}
                                </td>
                            </tr>
                        `).join("")}
                    </table>

                    <h4>D\xE9tail des Charges Actuelles</h4>
                    <table class="info-table">
                        ${e.chargesActuelles?.map(t=>`
                            <tr ${t.isTotal?'class="total-row"':""}>
                                <td><strong>${t.label} :</strong></td>
                                <td class="${t.isTotal?"highlight":""}">${t.value}</td>
                            </tr>
                        `).join("")}
                    </table>
                </div>

                <!-- Exploitation Pr\xE9visionnelle -->
                <div class="section">
                    <h3>EXPLOITATION PR\xC9VISIONNELLE</h3>
                    <table class="info-table">
                        ${e.exploitationPrevisionnelle?.map(t=>`
                            <tr ${t.isTotal?'class="total-row"':""} ${t.isRatio?'class="ratio-row"':""}>
                                <td><strong>${t.label} :</strong></td>
                                <td class="${t.isTotal||t.isRatio?"highlight":""}">
                                    ${t.value}
                                    ${t.severity?this.getBadgeHTML(t.severity):""}
                                </td>
                            </tr>
                        `).join("")}
                    </table>

                    <h4>D\xE9tail des Charges Pr\xE9visionnelles</h4>
                    <table class="info-table">
                        ${e.chargesPrevisionnelles?.map(t=>`
                            <tr ${t.isTotal?'class="total-row"':""}>
                                <td><strong>${t.label} :</strong></td>
                                <td class="${t.isTotal?"highlight":""}">${t.value}</td>
                            </tr>
                        `).join("")}
                    </table>
                </div>

                <!-- Comparaison Actuelle vs Pr\xE9visionnelle -->
                <div class="section">
                    <h3>ANALYSE COMPARATIVE</h3>
                    <div class="comparison-box">
                        <p><strong>\xC9volution du chiffre d'affaires :</strong> 
                            Analyse de la progression entre l'exploitation actuelle et pr\xE9visionnelle
                        </p>
                        <p><strong>\xC9volution des charges :</strong> 
                            Comparaison des charges totales entre les deux p\xE9riodes
                        </p>
                        <p><strong>Am\xE9lioration des marges :</strong> 
                            Impact sur la rentabilit\xE9 de l'entreprise
                        </p>
                    </div>
                </div>

                <div class="footer">
                    <p><strong>NB: L'emprunteur et l'agent de cr\xE9dit doivent parapher toutes les pages.</strong></p>
                    <div class="paraphe-zone">
                        <div>Paraphe emprunteur : ________</div>
                        <div>Paraphe agent : ________</div>
                    </div>
                </div>
            </div>
        `}genererPage3ResumeAnalyse(e){let t=i=>{let l=parseFloat(i.valeur),c=!1;switch(i.nom){case"R1 - Capacit\xE9 de remboursement":c=l>=150;break;case"R2 - Ratio de solvabilit\xE9":c=l>=25;break;case"R3 - Ratio de liquidit\xE9":c=l>=100;break;case"R4 - Ratio d'endettement":c=l<=70;break;case"R5 - Ratio de d\xE9pendance":c=l<=50;break;case"R6 - Ratio de couverture":c=l>=120;break}return c?"\u2705":"\u274C"};return`
            <div class="page">
                <div class="header">
                    <h1>R\xC9SUM\xC9 D'ANALYSE DE CR\xC9DIT</h1>
                    <h2>PAGE 3 : ANALYSE DES RATIOS ET \xC9VALUATION</h2>
                    <div class="date">Date : ${new Date().toLocaleDateString("fr-FR")}</div>
                </div>

                <!-- Tableau comparatif des ratios -->
                <div class="section">
                    <h3>COMPARAISON AVEC LES SEUILS D'\xC9VALUATION</h3>
                    <table class="ratio-comparison-table">
                        <thead>
                            <tr>
                                <th>Ratio</th>
                                <th>Formule</th>
                                <th>Seuil Acceptable</th>
                                <th>Valeur Calcul\xE9e</th>
                                <th>Statut</th>
                                <th>Conforme</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${e.ratios?Object.values(e.ratios).map(i=>{let l=this.getSeuilText(i.nom);return`
                                <tr class="${i.statut.toLowerCase()}">
                                    <td><strong>${i.nom}</strong></td>
                                    <td class="formula">${i.formule}</td>
                                    <td class="seuil">${l}</td>
                                    <td class="value"><strong>${i.valeur}%</strong></td>
                                    <td class="status ${i.statut.toLowerCase()}">${i.statut}</td>
                                    <td class="check">${t(i)}</td>
                                </tr>
                                `}).join(""):""}
                        </tbody>
                    </table>
                </div>

                <!-- Synth\xE8se de l'\xE9valuation -->
                <div class="section">
                    <h3>SYNTH\xC8SE DE L'\xC9VALUATION</h3>
                    <div class="evaluation-summary">
                        <div class="eval-item">
                            <span class="label">\xC9valuation Globale :</span>
                            <span class="value ${e.evaluation?.toLowerCase()}">${e.evaluation||"-"}</span>
                        </div>
                        <div class="eval-item">
                            <span class="label">Score de Risque :</span>
                            <span class="value">${e.scoreRisque||0}/100</span>
                        </div>
                        <div class="eval-item">
                            <span class="label">Seuils Respect\xE9s :</span>
                            <span class="value">${e.seuilsRespetes||0}/6</span>
                        </div>
                        <div class="eval-item">
                            <span class="label">Taux de Conformit\xE9 :</span>
                            <span class="value">${Math.round(e.seuilsRespetes/6*100)}%</span>
                        </div>
                    </div>
                </div>

                <!-- Analyse de risque -->
                <div class="section">
                    <h3>ANALYSE DE RISQUE</h3>
                    <div class="risk-analysis">
                        <h4>Facteurs de risque identifi\xE9s :</h4>
                        <ul>
                            ${e.analyseRisque?.facteurs?.map(i=>`<li>${i}</li>`).join("")||"<li>Aucun facteur de risque majeur identifi\xE9</li>"}
                        </ul>
                    </div>
                </div>

                <!-- D\xE9cision recommand\xE9e -->
                <div class="section">
                    <h3>D\xC9CISION RECOMMAND\xC9E</h3>
                    <div class="decision-box ${e.decisionRecommandee?.decision?.toLowerCase()}">
                        <p><strong>D\xE9cision :</strong> ${e.decisionRecommandee?.decision?.replace(/_/g," ")||"-"}</p>
                        <p><strong>Justification :</strong> ${e.decisionRecommandee?.justification||"-"}</p>
                        ${e.decisionRecommandee?.conditions?`
                            <h4>Conditions :</h4>
                            <ul>
                                ${e.decisionRecommandee.conditions.map(i=>`<li>${i}</li>`).join("")}
                            </ul>
                        `:""}
                    </div>
                </div>

                <div class="footer">
                    <p><strong>NB: L'emprunteur et l'agent de cr\xE9dit doivent parapher toutes les pages.</strong></p>
                    <div class="paraphe-zone">
                        <div>Paraphe emprunteur : ________</div>
                        <div>Paraphe agent : ________</div>
                    </div>
                </div>
            </div>
        `}genererPage4PersonnesCaution(e,t){let i=e.personnesCaution&&e.personnesCaution.length>0;return`
            <div class="page">
                <div class="header">
                    <h1>R\xC9SUM\xC9 D'ANALYSE DE CR\xC9DIT</h1>
                    <h2>PAGE 4 : PERSONNES CAUTION ET VALIDATION</h2>
                    <div class="date">Date : ${new Date().toLocaleDateString("fr-FR")}</div>
                </div>

                <!-- Personnes Caution -->
                <div class="section">
                    <h3>PERSONNES CAUTION (${e.personnesCaution?.length||0})</h3>
                    
                    ${i?`
                        ${e.personnesCaution.map((l,c)=>`
                            <div class="caution-box">
                                <h4>Caution ${c+1}</h4>
                                <table class="info-table">
                                    <tr>
                                        <td><strong>Nom :</strong></td>
                                        <td>${l.nom||"-"}</td>
                                        <td><strong>Pr\xE9nom :</strong></td>
                                        <td>${l.prenom||"-"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>T\xE9l\xE9phone :</strong></td>
                                        <td>${l.telephone||"-"}</td>
                                        <td><strong>\xC2ge :</strong></td>
                                        <td>${l.age?l.age+" ans":"-"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Profession :</strong></td>
                                        <td>${l.profession||"-"}</td>
                                        <td><strong>Activit\xE9 :</strong></td>
                                        <td>${l.activite||"-"}</td>
                                    </tr>
                                </table>
                            </div>
                        `).join("")}

                        <!-- Analyse de la garantie -->
                        <div class="garantie-analysis">
                            <h4>Analyse de la Garantie Personnelle</h4>
                            <table class="info-table">
                                <tr>
                                    <td><strong>Niveau de garantie :</strong></td>
                                    <td>${e.analyseGarantie?.niveau||"-"}</td>
                                    <td><strong>Score :</strong></td>
                                    <td>${e.analyseGarantie?.score||0}/100</td>
                                </tr>
                                <tr>
                                    <td colspan="4">
                                        <strong>Description :</strong> ${e.analyseGarantie?.description||"-"}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    `:`
                        <div class="warning-box">
                            <p><strong>\u26A0\uFE0F ATTENTION :</strong> Aucune personne caution n'a \xE9t\xE9 renseign\xE9e pour cette demande de cr\xE9dit.</p>
                            <p>Risque de garantie insuffisant - Il est recommand\xE9 d'exiger au moins une personne caution solvable.</p>
                        </div>
                    `}
                </div>

                <!-- Validation finale -->
                <div class="section">
                    <h3>VALIDATION DU DOSSIER</h3>
                    <div class="validation-box">
                        <p>Je soussign\xE9(e), certifie l'exactitude des informations fournies dans ce dossier de demande de cr\xE9dit.</p>
                        <p>J'ai pris connaissance de l'analyse effectu\xE9e et des conditions propos\xE9es.</p>
                        <br>
                        <p>Fait \xE0 _________________, le _________________</p>
                    </div>
                </div>

                <!-- Zone de signatures -->
                <div class="signature-section">
                    <h3>SIGNATURES</h3>
                    <div class="signature-container">
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <p><strong>Nom et Pr\xE9nom de l'emprunteur</strong></p>
                            <p>${e.promoteur?.[0]?.value||""} ${e.promoteur?.[1]?.value||""}</p>
                        </div>
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <p><strong>Nom de l'agent de cr\xE9dit</strong></p>
                            <p>${e.informationsAdministratives?.utilisateurTraitant?.split(" - ")[0]||""}</p>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p><strong>NB: L'emprunteur et l'agent de cr\xE9dit doivent parapher toutes les pages.</strong></p>
                    <div class="paraphe-zone">
                        <div>Paraphe emprunteur : ________</div>
                        <div>Paraphe agent : ________</div>
                    </div>
                </div>
            </div>
        `}getSeuilText(e){switch(e){case"R1 - Capacit\xE9 de remboursement":return"\u2265 150%";case"R2 - Ratio de solvabilit\xE9":return"\u2265 25%";case"R3 - Ratio de liquidit\xE9":return"\u2265 100%";case"R4 - Ratio d'endettement":return"\u2264 70%";case"R5 - Ratio de d\xE9pendance":return"\u2264 50%";case"R6 - Ratio de couverture":return"\u2265 120%";default:return"-"}}getBadgeHTML(e){return`<span class="badge ${e}" style="background-color: ${{success:"#22c55e",info:"#3b82f6",warn:"#f59e0b",danger:"#ef4444"}[e]||"#6b7280"}"></span>`}genererStyles(){return`
            <style>
                @page {
                    size: A4;
                    margin: 15mm;
                }

                @media print {
                    .page {
                        page-break-after: always;
                    }
                    
                    .page:last-child {
                        page-break-after: auto;
                    }
                }

                body {
                    font-family: 'Arial', 'Helvetica', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }

                .page {
                    min-height: 100vh;
                    padding: 20px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                }

                .header {
                    text-align: center;
                    border-bottom: 3px solid #2563eb;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }

                .header h1 {
                    color: #1e40af;
                    margin: 0 0 10px 0;
                    font-size: 24px;
                }

                .header h2 {
                    color: #3b82f6;
                    margin: 0 0 10px 0;
                    font-size: 18px;
                }

                .date {
                    color: #6b7280;
                    font-size: 14px;
                }

                .section {
                    margin-bottom: 30px;
                }

                .section h3 {
                    color: #1e40af;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 8px;
                    margin-bottom: 15px;
                    font-size: 16px;
                }

                .section h4 {
                    color: #3b82f6;
                    margin: 15px 0 10px 0;
                    font-size: 14px;
                }

                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 15px;
                }

                .info-table td {
                    padding: 8px;
                    border: 1px solid #e5e7eb;
                    font-size: 12px;
                }

                .info-table td:first-child {
                    background-color: #f9fafb;
                    width: 35%;
                }

                .total-row {
                    background-color: #eff6ff;
                    font-weight: bold;
                }

                .ratio-row {
                    background-color: #fef3c7;
                }

                .highlight {
                    font-weight: bold;
                    color: #1e40af;
                }

                .bilan-container {
                    display: flex;
                    gap: 20px;
                }

                .bilan-column {
                    flex: 1;
                }

                .small-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .small-table td {
                    padding: 5px;
                    border: 1px solid #e5e7eb;
                    font-size: 11px;
                }

                .text-right {
                    text-align: right;
                }

                /* Styles pour la page 3 - Tableau comparatif */
                .ratio-comparison-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                }

                .ratio-comparison-table th {
                    background-color: #1e40af;
                    color: white;
                    padding: 10px;
                    text-align: left;
                    border: 1px solid #1e40af;
                }

                .ratio-comparison-table td {
                    padding: 8px;
                    border: 1px solid #e5e7eb;
                }

                .ratio-comparison-table .formula {
                    font-style: italic;
                    color: #6b7280;
                    font-size: 10px;
                }

                .ratio-comparison-table .seuil {
                    font-weight: bold;
                    color: #059669;
                }

                .ratio-comparison-table .value {
                    font-weight: bold;
                    color: #1e40af;
                }

                .ratio-comparison-table .status {
                    font-weight: bold;
                    text-align: center;
                }

                .ratio-comparison-table .status.excellent {
                    color: #059669;
                }

                .ratio-comparison-table .status.bon {
                    color: #3b82f6;
                }

                .ratio-comparison-table .status.acceptable {
                    color: #f59e0b;
                }

                .ratio-comparison-table .status.risque {
                    color: #ef4444;
                }

                .ratio-comparison-table .check {
                    text-align: center;
                    font-size: 16px;
                }

                .evaluation-summary {
                    background-color: #f0f9ff;
                    border: 2px solid #3b82f6;
                    border-radius: 8px;
                    padding: 15px;
                }

                .eval-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                }

                .eval-item:last-child {
                    border-bottom: none;
                }

                .eval-item .label {
                    font-weight: bold;
                    color: #374151;
                }

                .eval-item .value {
                    font-weight: bold;
                    color: #1e40af;
                }

                .eval-item .value.excellent {
                    color: #059669;
                }

                .eval-item .value.bon {
                    color: #3b82f6;
                }

                .eval-item .value.acceptable {
                    color: #f59e0b;
                }

                .eval-item .value.risque {
                    color: #ef4444;
                }

                .risk-analysis {
                    background-color: #fef3c7;
                    border-left: 4px solid #f59e0b;
                    padding: 15px;
                }

                .decision-box {
                    border: 2px solid #6b7280;
                    border-radius: 8px;
                    padding: 15px;
                    background-color: #f9fafb;
                }

                .decision-box.accorder {
                    border-color: #059669;
                    background-color: #f0fdf4;
                }

                .decision-box.accorder_avec_conditions {
                    border-color: #3b82f6;
                    background-color: #eff6ff;
                }

                .decision-box.etude_approfondie {
                    border-color: #f59e0b;
                    background-color: #fef3c7;
                }

                .decision-box.refuser {
                    border-color: #ef4444;
                    background-color: #fef2f2;
                }

                /* Styles pour la page 4 */
                .caution-box {
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    background-color: #f9fafb;
                }

                .warning-box {
                    background-color: #fef3c7;
                    border: 2px solid #f59e0b;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                }

                .garantie-analysis {
                    background-color: #f0f9ff;
                    border: 1px solid #3b82f6;
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 20px;
                }

                .validation-box {
                    background-color: #f9fafb;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }

                .signature-section {
                    margin-top: auto;
                    padding-top: 40px;
                }

                .signature-container {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 60px;
                }

                .signature-box {
                    text-align: center;
                    width: 250px;
                }

                .signature-line {
                    border-bottom: 2px solid #374151;
                    margin-bottom: 10px;
                    height: 50px;
                }

                .footer {
                    margin-top: auto;
                    padding-top: 30px;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    font-size: 12px;
                }

                .paraphe-zone {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 20px;
                    font-size: 11px;
                }

                .badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 4px;
                    color: white;
                    font-size: 10px;
                    margin-left: 5px;
                }

                .comparison-box {
                    background-color: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 15px;
                }

                /* Responsive pour impression */
                @media print {
                    body {
                        font-size: 11pt;
                    }

                    .no-print {
                        display: none;
                    }
                }
            </style>
        `}static \u0275fac=function(t){return new(t||a)};static \u0275prov=L({token:a,factory:a.\u0275fac,providedIn:"root"})};var be=()=>({background:"#28a745","border-color":"#28a745"}),k=a=>({"font-bold bg-blue-50 border-round":a}),xe=a=>({"font-bold bg-blue-50 border-round px-2":a}),M=(a,e)=>e.label;function Re(a,e){if(a&1&&(n(0,"small",6),o(1),r()),a&2){let t=u();s(),h(t.getResumeImpression())}}function Pe(a,e){if(a&1){let t=O();n(0,"div",8)(1,"p-button",11),R("onClick",function(){y(t);let l=u();return E(l.imprimerBilan())}),r(),n(2,"p-splitButton",12),R("onClick",function(){y(t);let l=u();return E(l.previsualiserImpression())}),r()()}if(a&2){let t=u();s(),$(w(3,be)),s(),p("model",t.printMenuModel)}}function Se(a,e){a&1&&(n(0,"div",9),d(1,"p-button",13),r())}function ye(a,e){a&1&&(n(0,"div",1)(1,"div",2)(2,"div",14),d(3,"p-progressSpinner"),r()()())}function Ee(a,e){if(a&1){let t=O();n(0,"div",1)(1,"div",2)(2,"p-card")(3,"div",15),d(4,"i",16),n(5,"h3",17),o(6,"Erreur lors du chargement"),r(),n(7,"p",18),o(8),r(),n(9,"p-button",19),R("onClick",function(){y(t);let l=u();return E(l.chargerResumeCredit())}),r()()()()()}if(a&2){let t,i=u();s(8),h(((t=i.state().error)==null?null:t.message)||"Une erreur est survenue")}}function Ae(a,e){if(a&1&&(n(0,"span",37),o(1),r(),n(2,"div",93),d(3,"p-tag",94),r()),a&2){let t=u(3);s(),m("",t.calculerR1Capacite(),"%"),s(2),p("value",t.getStatutR1())("severity",t.getSeveriteR1())}}function Oe(a,e){a&1&&(n(0,"span",83),o(1,"Information"),d(2,"br"),o(3,"manquante"),r())}function Me(a,e){if(a&1&&(n(0,"span",37),o(1),r(),n(2,"div",93),d(3,"p-tag",94),r()),a&2){let t=u(3);s(),m("",t.calculerR1Propose(),"%"),s(2),p("value",t.getStatutR1Propose())("severity",t.getSeveriteR1Propose())}}function De(a,e){a&1&&(n(0,"span",83),o(1,"Information"),d(2,"br"),o(3,"manquante"),r())}function Ie(a,e){if(a&1&&(n(0,"span",37),o(1),r(),n(2,"div",93),d(3,"p-tag",94),r()),a&2){let t=u(3);s(),m("",t.calculerR2Solvabilite(),"%"),s(2),p("value",t.getStatutR2())("severity",t.getSeveriteR2())}}function Te(a,e){a&1&&(n(0,"span",83),o(1,"Information"),d(2,"br"),o(3,"manquante"),r())}function Ne(a,e){if(a&1&&(n(0,"span",37),o(1),r(),n(2,"div",93),d(3,"p-tag",94),r()),a&2){let t=u(3);s(),m("",t.calculerR2Solvabilite(),"%"),s(2),p("value",t.getStatutR2())("severity",t.getSeveriteR2())}}function $e(a,e){a&1&&(n(0,"span",83),o(1,"Information"),d(2,"br"),o(3,"manquante"),r())}function we(a,e){if(a&1&&(n(0,"span",37),o(1),r(),n(2,"div",93),d(3,"p-tag",94),r()),a&2){let t=u(3);s(),m("",t.calculerR3Liquidite(),"%"),s(2),p("value",t.getStatutR3())("severity",t.getSeveriteR3())}}function Fe(a,e){a&1&&(n(0,"span",83),o(1,"Information"),d(2,"br"),o(3,"manquante"),r())}function ke(a,e){if(a&1&&(n(0,"span",37),o(1),r(),n(2,"div",93),d(3,"p-tag",94),r()),a&2){let t=u(3);s(),m("",t.calculerR3Liquidite(),"%"),s(2),p("value",t.getStatutR3())("severity",t.getSeveriteR3())}}function Le(a,e){a&1&&(n(0,"span",83),o(1,"Information"),d(2,"br"),o(3,"manquante"),r())}function qe(a,e){if(a&1&&(n(0,"span",37),o(1),r(),n(2,"div",93),d(3,"p-tag",94),r()),a&2){let t=u(3);s(),m("",t.calculerR4Endettement(),"%"),s(2),p("value",t.getStatutR4())("severity",t.getSeveriteR4())}}function Ve(a,e){a&1&&(n(0,"span",83),o(1,"Information"),d(2,"br"),o(3,"manquante"),r())}function Ge(a,e){if(a&1&&(n(0,"span",37),o(1),r(),n(2,"div",93),d(3,"p-tag",94),r()),a&2){let t=u(3);s(),m("",t.calculerR4Propose(),"%"),s(2),p("value",t.getStatutR4Propose())("severity",t.getSeveriteR4Propose())}}function Ue(a,e){a&1&&(n(0,"span",83),o(1,"Information"),d(2,"br"),o(3,"manquante"),r())}function Be(a,e){if(a&1&&(n(0,"span",37),o(1),r(),n(2,"div",93),d(3,"p-tag",94),r()),a&2){let t=u(3);s(),m("",t.calculerR5Dependance(),"%"),s(2),p("value",t.getStatutR5())("severity",t.getSeveriteR5())}}function ze(a,e){a&1&&(n(0,"span",83),o(1,"Information"),d(2,"br"),o(3,"manquante"),r())}function je(a,e){if(a&1&&(n(0,"span",37),o(1),r(),n(2,"div",93),d(3,"p-tag",94),r()),a&2){let t=u(3);s(),m("",t.calculerR5Dependance(),"%"),s(2),p("value",t.getStatutR5())("severity",t.getSeveriteR5())}}function Ye(a,e){a&1&&(n(0,"span",83),o(1,"Information"),d(2,"br"),o(3,"manquante"),r())}function Je(a,e){if(a&1&&(n(0,"span",37),o(1),r(),n(2,"div",93),d(3,"p-tag",94),r()),a&2){let t=u(3);s(),m("",t.calculerR6Couverture(),"%"),s(2),p("value",t.getStatutR6())("severity",t.getSeveriteR6())}}function He(a,e){a&1&&(n(0,"span",83),o(1,"Information"),d(2,"br"),o(3,"manquante"),r())}function Xe(a,e){if(a&1&&(n(0,"span",37),o(1),r(),n(2,"div",93),d(3,"p-tag",94),r()),a&2){let t=u(3);s(),m("",t.calculerR6Propose(),"%"),s(2),p("value",t.getStatutR6Propose())("severity",t.getSeveriteR6Propose())}}function Qe(a,e){a&1&&(n(0,"span",83),o(1,"Information"),d(2,"br"),o(3,"manquante"),r())}function We(a,e){a&1&&(n(0,"div",95),d(1,"i",96),n(2,"h4",97),o(3,"Recommandations et Analyse"),r()())}function Ze(a,e){if(a&1&&(n(0,"div",89),o(1),r()),a&2){let t=e.$implicit;s(),h(t)}}function Ke(a,e){if(a&1&&(n(0,"div",89),o(1),r()),a&2){let t=e.$implicit;s(),m("\u2022 ",t,"")}}function et(a,e){if(a&1&&(n(0,"div",60)(1,"div",2)(2,"div",61)(3,"div",62)(4,"span",24),o(5,"4. Ratios de d\xE9cision"),r()(),n(6,"div",63)(7,"div",64)(8,"div",65)(9,"div",66),o(10," Proposition - simulation "),r(),n(11,"div",67)(12,"div",68),o(13,"Montant :"),r(),n(14,"div",69),o(15),r()(),n(16,"div",67)(17,"div",68),o(18,"Dur\xE9e :"),r(),n(19,"div",70)(20,"em"),o(21),r()(),n(22,"div",71),o(23," Nbre d'\xE9ch. : "),n(24,"strong"),o(25),r()()(),n(26,"div",72)(27,"div",68),o(28,"\xC9ch\xE9ance :"),r(),n(29,"div",69),o(30),r()()()(),n(31,"table",73)(32,"thead")(33,"tr"),d(34,"th",74),n(35,"th",75),o(36," Norme "),r(),n(37,"th",76)(38,"div",77),o(39," Ratios calcul\xE9s en fonction du montant sollicit\xE9 "),r()(),n(40,"th",76)(41,"div",77),o(42," Ratios associ\xE9s au montant propos\xE9 "),r()()()(),n(43,"tbody")(44,"tr")(45,"td",78)(46,"div",37),o(47,"R.1 Capacit\xE9 de remboursement calcul\xE9e"),r(),n(48,"div",79),o(49,"(Cash Flow + Autres revenus) / Traite"),r()(),n(50,"td",80),o(51," \u2265 200% "),r(),n(52,"td",81)(53,"div",82),v(54,Ae,4,3)(55,Oe,4,0,"span",83),r()(),n(56,"td",81)(57,"div",82),v(58,Me,4,3)(59,De,4,0,"span",83),r()()(),n(60,"tr")(61,"td",78)(62,"div",37),o(63,"R.2 Ratio de solvabilit\xE9"),r(),n(64,"div",79),o(65,"Capitaux propres / Total Actif"),r()(),n(66,"td",80),o(67," \u2265 35% "),r(),n(68,"td",81)(69,"div",82),v(70,Ie,4,3)(71,Te,4,0,"span",83),r()(),n(72,"td",81)(73,"div",82),v(74,Ne,4,3)(75,$e,4,0,"span",83),r()()(),n(76,"tr")(77,"td",78)(78,"div",37),o(79,"R.3 Ratio de liquidit\xE9 \xE0 \xE9ch\xE9ance"),r(),n(80,"div",79),o(81,"(Cr\xE9ances+Tr\xE9sorerie) / Dettes \xE0 court terme"),r()(),n(82,"td",80),o(83," \u2265 100% "),r(),n(84,"td",81)(85,"div",82),v(86,we,4,3)(87,Fe,4,0,"span",83),r()(),n(88,"td",81)(89,"div",82),v(90,ke,4,3)(91,Le,4,0,"span",83),r()()(),n(92,"tr")(93,"td",78)(94,"div",37),o(95,"R.4 Ratio d'endettement"),r(),n(96,"div",79),o(97,"(Dettes totales + Cr\xE9dit) / (Total Actif + Cr\xE9dit) "),r()(),n(98,"td",80),o(99," < 50% "),r(),n(100,"td",81)(101,"div",82),v(102,qe,4,3)(103,Ve,4,0,"span",83),r()(),n(104,"td",81)(105,"div",82),v(106,Ge,4,3)(107,Ue,4,0,"span",83),r()()(),n(108,"tr")(109,"td",78)(110,"div",37),o(111,"R.5 Ratio de d\xE9pendance"),r(),n(112,"div",79),o(113,"Autres revenus / Revenus totaux"),r()(),n(114,"td",80),o(115," < 50% "),r(),n(116,"td",81)(117,"div",82),v(118,Be,4,3)(119,ze,4,0,"span",83),r()(),n(120,"td",81)(121,"div",82),v(122,je,4,3)(123,Ye,4,0,"span",83),r()()(),n(124,"tr")(125,"td",78)(126,"div",37),o(127,"R.6 Ratio de couverture de la garantie"),r(),n(128,"div",79),o(129,"Valeur de la garantie / Cr\xE9dit"),r()(),n(130,"td",80),o(131," > 150% "),r(),n(132,"td",81)(133,"div",82),v(134,Je,4,3)(135,He,4,0,"span",83),r()(),n(136,"td",81)(137,"div",82),v(138,Xe,4,3)(139,Qe,4,0,"span",83),r()()()()(),n(140,"div",84)(141,"div",33)(142,"div",85)(143,"strong"),o(144,"Sollicit\xE9 :"),r(),o(145),r()(),n(146,"div",33)(147,"div",85)(148,"strong"),o(149,"Propos\xE9 :"),r(),o(150),r()()()()()()(),n(151,"div",60)(152,"div",2)(153,"p-card"),v(154,We,4,0,"ng-template",86),n(155,"div",1)(156,"div",87)(157,"h6",88),o(158,"\u{1F4A1} Recommandations"),r(),_(159,Ze,2,1,"div",89,I),r(),n(161,"div",87)(162,"h6",90),o(163,"\u26A0\uFE0F Facteurs de Risque"),r(),_(164,Ke,2,1,"div",89,I),r(),n(166,"div",87)(167,"h6",91),o(168,"\u2696\uFE0F D\xE9cision"),r(),n(169,"div",22),d(170,"p-tag",42),r(),n(171,"div",92),o(172),r()()()()()()),a&2){let t=u(2);s(15),m(" ",t.formatCurrency(t.getMontantPropose())||"-"," "),s(6),m("",t.getDureeProposee()||"-"," mois"),s(4),h(t.getNbreEcheancePropose()||"-"),s(5),m(" ",t.formatCurrency(t.getEcheanceProposee())||"-"," "),s(24),g(t.calculerR1Capacite()!=="0.0"?54:55),s(4),g(t.calculerR1Propose()!=="N/A"&&t.calculerR1Propose()!=="0.0"?58:59),s(12),g(t.calculerR2Solvabilite()!=="0.0"?70:71),s(4),g(t.calculerR2Solvabilite()!=="0.0"?74:75),s(12),g(t.calculerR3Liquidite()!=="0.0"?86:87),s(4),g(t.calculerR3Liquidite()!=="0.0"?90:91),s(12),g(t.calculerR4Endettement()!=="0.0"?102:103),s(4),g(t.calculerR4Propose()!=="N/A"&&t.calculerR4Propose()!=="0.0"?106:107),s(12),g(t.calculerR5Dependance()!=="0.0"?118:119),s(4),g(t.calculerR5Dependance()!=="0.0"?122:123),s(12),g(t.calculerR6Couverture()!=="0.0"?134:135),s(4),g(t.calculerR6Propose()!=="N/A"&&t.calculerR6Propose()!=="0.0"?138:139),s(4),p("ngClass",t.allRatiosConformesSollicite()?"bg-green-100 text-green-800":"bg-red-100 text-red-800"),s(3),m(" ",t.getNbSeuilsRespetesSollicite(),"/6 conformes "),s(2),p("ngClass",t.allRatiosConformesPropose()?"bg-green-100 text-green-800":"bg-red-100 text-red-800"),s(3),m(" ",t.getNbSeuilsRespetesPropose(),"/6 conformes "),s(9),x(t.getRecommandations()),s(5),x(t.getAnalyseRisque().facteurs),s(6),p("value",t.getRecommandationDecision().decision.replace("_"," "))("severity",t.getDecisionSeverity()),s(2),h(t.getRecommandationDecision().justification)}}function tt(a,e){if(a&1&&(n(0,"div",39)(1,"span",18),o(2),r(),n(3,"span",98),o(4),r()()),a&2){let t=e.$implicit;s(2),m("",t.label,":"),s(2),h(t.value)}}function it(a,e){if(a&1&&(n(0,"div",39)(1,"span",18),o(2),r(),n(3,"span",98),o(4),r()()),a&2){let t=e.$implicit;s(2),m("",t.label,":"),s(2),h(t.value)}}function nt(a,e){a&1&&(n(0,"div",43),d(1,"i",99),o(2," Aucune personne caution renseign\xE9e "),r())}function rt(a,e){if(a&1&&(n(0,"div",100),d(1,"i",101),o(2),r()),a&2){let t=e.$implicit;s(2),m("",t," ")}}function at(a,e){if(a&1&&(n(0,"div",38),_(1,rt,3,1,"div",100,I),r()),a&2){let t=u(2);s(),x(t.getPersonnesCautionCompact())}}function ot(a,e){if(a&1&&d(0,"p-tag",94),a&2){let t=u().$implicit;p("value",t.value)("severity",t.severity)}}function st(a,e){if(a&1&&o(0),a&2){let t=u().$implicit;m(" ",t.value," ")}}function lt(a,e){if(a&1&&(n(0,"div",46)(1,"span",18),o(2),r(),n(3,"span",102),v(4,ot,1,2,"p-tag",94)(5,st,1,1),r()()),a&2){let t=e.$implicit;p("ngClass",D(3,k,t.isTotal)),s(2),m("",t.label,":"),s(2),g(t.isRatio?4:5)}}function dt(a,e){if(a&1&&(n(0,"div",50)(1,"span",18),o(2),r(),n(3,"span",102),o(4),r()()),a&2){let t=e.$implicit;p("ngClass",D(3,xe,t.isTotal)),s(2),m("",t.label,":"),s(2),h(t.value)}}function ct(a,e){if(a&1&&d(0,"p-tag",94),a&2){let t=u().$implicit;p("value",t.value)("severity",t.severity)}}function ut(a,e){if(a&1&&o(0),a&2){let t=u().$implicit;m(" ",t.value," ")}}function mt(a,e){if(a&1&&(n(0,"div",52)(1,"span",18),o(2),r(),n(3,"span",102),v(4,ct,1,2,"p-tag",94)(5,ut,1,1),r()()),a&2){let t=e.$implicit;p("ngClass",D(3,k,t.isTotal)),s(2),m("",t.label,":"),s(2),g(t.isRatio?4:5)}}function pt(a,e){if(a&1&&d(0,"p-tag",94),a&2){let t=u().$implicit;p("value",t.value)("severity",t.severity)}}function gt(a,e){if(a&1&&o(0),a&2){let t=u().$implicit;m(" ",t.value," ")}}function vt(a,e){if(a&1&&(n(0,"div",52)(1,"span",18),o(2),r(),n(3,"span",102),v(4,pt,1,2,"p-tag",94)(5,gt,1,1),r()()),a&2){let t=e.$implicit;p("ngClass",D(3,k,t.isTotal)),s(2),m("",t.label,":"),s(2),g(t.isRatio?4:5)}}function ft(a,e){if(a&1){let t=O();n(0,"div",59)(1,"p-button",103),R("onClick",function(){y(t);let l=u(2);return E(l.previsualiserImpression())}),r(),n(2,"p-button",104),R("onClick",function(){y(t);let l=u(2);return E(l.imprimerBilan())}),r()()}a&2&&(s(2),$(w(2,be)))}function ht(a,e){if(a&1){let t=O();v(0,et,173,23),n(1,"div",20)(2,"div",2)(3,"div",21)(4,"div",22),d(5,"i",23),n(6,"span",24),o(7,"Demande de Cr\xE9dit"),r()(),n(8,"div",1)(9,"div",25)(10,"span",26),o(11,"Montant demand\xE9:"),r(),n(12,"span",27),o(13),r()(),n(14,"div",28)(15,"span",26),o(16,"Dur\xE9e:"),r(),n(17,"span",27),o(18),r()(),n(19,"div",28)(20,"span",26),o(21,"\xC9ch\xE9ance:"),r(),n(22,"span",27),o(23),r()(),n(24,"div",28)(25,"span",26),o(26,"Nbre \xE9ch.:"),r(),n(27,"span",27),o(28),r()(),n(29,"div",25)(30,"span",26),o(31,"Statut:"),r(),d(32,"p-tag",29),r()(),n(33,"div",30)(34,"div",31)(35,"span",26),o(36,"Objet:"),r(),n(37,"span",32),o(38),r()(),n(39,"div",28)(40,"span",26),o(41,"P\xE9riodicit\xE9:"),r(),n(42,"span",32),o(43),r()(),n(44,"div",33)(45,"span",26),o(46,"Localisation:"),r(),n(47,"span",32),o(48),r()()()()()(),n(49,"div",20)(50,"div",34)(51,"div",35)(52,"div",22),d(53,"i",36),n(54,"span",37),o(55,"Promoteur"),r()(),n(56,"div",38),_(57,tt,5,2,"div",39,M),r()()(),n(59,"div",34)(60,"div",35)(61,"div",22),d(62,"i",40),n(63,"span",37),o(64,"Entreprise"),r()(),n(65,"div",38),_(66,it,5,2,"div",39,M),r()()()(),n(68,"div",20)(69,"div",2)(70,"div",21)(71,"div",22),d(72,"i",41),n(73,"span",37),o(74,"Personnes Caution"),r(),d(75,"p-badge",42),r(),v(76,nt,3,0,"div",43)(77,at,3,0,"div",38),r()()(),n(78,"div",20)(79,"div",44)(80,"div",35)(81,"div",22),d(82,"i",45),n(83,"span",37),o(84,"Bilan Entreprise"),r()(),n(85,"div",38),_(86,lt,6,5,"div",46,M),r()()(),n(88,"div",47)(89,"div",35)(90,"div",22),d(91,"i",48),n(92,"span",37),o(93,"Patrimoine Personnel"),r()(),n(94,"div",49),_(95,dt,5,5,"div",50,M),r()()()(),n(97,"div",20)(98,"div",34)(99,"div",35)(100,"div",22),d(101,"i",51),n(102,"span",37),o(103,"Exploitation Actuelle"),r()(),n(104,"div",38),_(105,mt,6,5,"div",52,M),r()()(),n(107,"div",34)(108,"div",35)(109,"div",22),d(110,"i",53),n(111,"span",37),o(112,"Exploitation Pr\xE9visionnelle"),r()(),n(113,"div",38),_(114,vt,6,5,"div",52,M),r()()()(),n(116,"div",20)(117,"div",2)(118,"div",21)(119,"div",22),d(120,"i",54),n(121,"span",37),o(122,"R\xE9sum\xE9 Financier"),r()(),n(123,"div",38)(124,"div",55)(125,"span",18),o(126,"Total Actif:"),r(),n(127,"span",56),o(128),r()(),n(129,"div",55)(130,"span",18),o(131,"Total Passif:"),r(),n(132,"span",56),o(133),r()(),n(134,"div",55)(135,"span",18),o(136,"Patrimoine:"),r(),n(137,"span",56),o(138),r()(),n(139,"div",55)(140,"span",18),o(141,"Garantie:"),r(),n(142,"span",57),o(143),r()()()()()(),n(144,"div",1)(145,"div",2)(146,"div",58)(147,"p-button",10),R("onClick",function(){y(t);let l=u();return E(l.retourListe())}),r(),v(148,ft,3,3,"div",59),r()()()}if(a&2){let t,i=u();g(((t=i.state().user)==null?null:t.role)==="MANAGER"||((t=i.state().user)==null?null:t.role)==="DA"?0:-1),s(13),h(i.formatCurrency(i.getMontantDemande())),s(5),m("",i.getDureeDemande()," mois"),s(5),h(i.formatCurrency(i.getEcheanceDemande())),s(5),h(i.getNbreEcheanceDemande()),s(4),p("value",i.getStatutDemande())("severity",i.getStatutSeverity(i.getStatutDemande())),s(6),h(i.getObjetCredit()),s(5),h(i.getPeriodicite()),s(5),h(i.getResumeAdministratif()),s(9),x(i.getPromoteurData().slice(0,6)),s(9),x(i.getEntrepriseData().slice(0,6)),s(9),p("value",i.getNombrePersonnesCaution().toString())("severity",i.getNombrePersonnesCaution()>0?"success":"warn"),s(),g(i.hasPersonnesCaution()?77:76),s(10),x(i.getBilanEntrepriseData()),s(9),x(i.getBilanPersonnelData()),s(10),x(i.getExploitationActuelleData()),s(9),x(i.getExploitationPrevisionnelleData()),s(14),h(i.formatCurrency(i.calculerTotalActif())),s(5),h(i.formatCurrency(i.calculerTotalPassif())),s(5),h(i.formatCurrency(i.calculerPatrimoinePersonnel())),s(5),h(i.formatCurrency(i.getValeurGarantie())),s(5),g(i.peutImprimer()?148:-1)}}function Ct(a,e){if(a&1){let t=O();n(0,"div",1)(1,"div",2)(2,"p-card")(3,"div",105),d(4,"i",106),n(5,"h3",18),o(6,"Aucune donn\xE9e disponible"),r(),n(7,"p",83),o(8,"Le r\xE9sum\xE9 de cr\xE9dit n'est pas encore disponible."),r(),n(9,"p-button",10),R("onClick",function(){y(t);let l=u();return E(l.retourListe())}),r()()()()()}}var Ce=class a{state=V({loading:!1,message:void 0,loadingAdmin:!1,error:void 0,searching:!1});router=S(Y);route=S(j);messageService=S(F);destroyRef=S(q);analyseCreditService=S(ee);printService=S(ve);resumePrintService=S(N);userId=null;demandeId=null;ngOnInit(){this.route.params.pipe(T(this.destroyRef)).subscribe(e=>{this.userId=+e.userId,this.demandeId=+e.demandeId,console.log("\u{1F50D} Param\xE8tres r\xE9cup\xE9r\xE9s - UserId:",this.userId,"DemandeId:",this.demandeId),this.demandeId&&this.userId?this.chargerResumeCredit():this.messageService.add({severity:"error",summary:"Erreur",detail:"Param\xE8tres de navigation manquants"})})}chargerResumeCredit(){this.demandeId&&(this.state.update(e=>P(b({},e),{loading:!0,error:void 0})),console.log("\u{1F680} Chargement du r\xE9sum\xE9 pour la demande:",this.demandeId),this.analyseCreditService.obtenirResumeCredit$(this.demandeId).pipe(T(this.destroyRef)).subscribe({next:e=>{console.log("\u2705 R\xE9ponse re\xE7ue:",e),e.data?.resumeCredit?(this.state.update(t=>P(b({},t),{resumeCredit:e.data.resumeCredit,user:e.data.user,loading:!1,message:"R\xE9sum\xE9 charg\xE9 avec succ\xE8s"})),this.chargerInfoAdministrative(),this.messageService.add({severity:"success",summary:"Succ\xE8s",detail:"R\xE9sum\xE9 de cr\xE9dit charg\xE9 avec succ\xE8s"})):this.gererErreur("Aucune donn\xE9e de r\xE9sum\xE9 trouv\xE9e")},error:e=>{this.gererErreur("Erreur lors du chargement du r\xE9sum\xE9",e)}}))}chargerInfoAdministrative(){let e=this.state().resumeCredit?.demande_credit;if(!e||e.delegation_id==null||e.agence_id==null||e.point_vente_id==null||e.user_id==null){console.warn("\u26A0\uFE0F Informations administratives incompl\xE8tes dans la demande"),console.log("\u{1F50D} D\xE9tails des IDs:",{delegation_id:e?.delegation_id,agence_id:e?.agence_id,point_vente_id:e?.point_vente_id,user_id:e?.user_id});return}this.state.update(t=>P(b({},t),{loadingAdmin:!0})),console.log("\u{1F3E2} Chargement des informations administratives..."),console.log("\u{1F4CB} IDs utilis\xE9s:",{delegation_id:e.delegation_id,agence_id:e.agence_id,point_vente_id:e.point_vente_id,user_id:e.user_id}),this.analyseCreditService.getInfoAdministrative$(e.delegation_id,e.agence_id,e.point_vente_id).pipe(T(this.destroyRef)).subscribe({next:t=>{console.log("\u2705 Informations administratives re\xE7ues:",t),t.data?.infoAdministrative?(this.state.update(i=>P(b({},i),{infoAdministrative:t.data.infoAdministrative,loadingAdmin:!1})),console.log("\u{1F4CB} Infos admin charg\xE9es:",t.data.infoAdministrative),this.messageService.add({severity:"success",summary:"Succ\xE8s",detail:"Informations administratives charg\xE9es"})):(console.warn("\u26A0\uFE0F Aucune donn\xE9e administrative trouv\xE9e"),this.state.update(i=>P(b({},i),{loadingAdmin:!1})),this.messageService.add({severity:"warn",summary:"Attention",detail:"Structure de donn\xE9es administrative non trouv\xE9e"}))},error:t=>{console.error("\u274C Erreur lors du chargement des infos admin:",t),this.state.update(i=>P(b({},i),{loadingAdmin:!1})),this.messageService.add({severity:"error",summary:"Erreur",detail:`Impossible de charger les d\xE9tails administratifs: ${t.message||"Erreur inconnue"}`})}})}gererErreur(e,t){this.state.update(i=>P(b({},i),{loading:!1,error:t})),this.messageService.add({severity:"error",summary:"Erreur",detail:e}),console.error("\u274C Erreur:",t)}getMontantPropose(){return this.state().resumeCredit?.demande_credit?.montant_propose??0}getDureeProposee(){return this.state().resumeCredit?.demande_credit?.duree_proposee??0}getNbreEcheancePropose(){return this.state().resumeCredit?.demande_credit?.nombre_echeance_propose??0}getEcheanceProposee(){return this.state().resumeCredit?.demande_credit?.echeance_proposee??0}getMontantDemande(){return this.state().resumeCredit?.demande_credit?.montant_demande??0}getDureeDemande(){return this.state().resumeCredit?.demande_credit?.duree_mois??0}getEcheanceDemande(){return this.state().resumeCredit?.demande_credit?.echeance??this.calculerMensualite()}getNbreEcheanceDemande(){return this.state().resumeCredit?.demande_credit?.nombre_echeance??this.getDureeDemande()}getObjetCredit(){return this.state().resumeCredit?.demande_credit?.objet_financement||"Non renseign\xE9"}getStatutDemande(){return this.state().resumeCredit?.demande_credit?.statut??"INCONNU"}getPeriodicite(){return this.state().resumeCredit?.demande_credit?.periodicite_remboursement??"Mensuelle"}calculerR1Propose(){let e=this.getEcheanceProposee();return e<=0?"N/A":((this.getCashFlow()+this.getAutresRevenus())/e*100).toFixed(1)}getStatutR1Propose(){let e=parseFloat(this.calculerR1Propose());return isNaN(e)?"Info manquante":e>=200?"CONFORME":"NON CONFORME"}getSeveriteR1Propose(){let e=parseFloat(this.calculerR1Propose());return isNaN(e)?"warn":e>=200?"success":"danger"}calculerR4Propose(){let e=this.getMontantPropose(),t=this.getTotalActif(),i=this.getDettesTotales(),l=t+e;return l<=0?"N/A":((i+e)/l*100).toFixed(1)}getStatutR4Propose(){let e=parseFloat(this.calculerR4Propose());return isNaN(e)?"Info manquante":e<50?"CONFORME":"NON CONFORME"}getSeveriteR4Propose(){let e=parseFloat(this.calculerR4Propose());return isNaN(e)?"warn":e<50?"success":"danger"}calculerR6Propose(){let e=this.getMontantPropose();return e<=0?"N/A":(this.getValeurGarantie()/e*100).toFixed(1)}getStatutR6Propose(){let e=parseFloat(this.calculerR6Propose());return isNaN(e)?"Info manquante":e>150?"CONFORME":"NON CONFORME"}getSeveriteR6Propose(){let e=parseFloat(this.calculerR6Propose());return isNaN(e)?"warn":e>150?"success":"danger"}getDettesTotales(){let e=this.state().resumeCredit?.bilan_entreprise;return e?(e.dettes_fournisseurs??0)+(e.emprunts??0):0}getNbSeuilsRespetesSollicite(){let e=0;return parseFloat(this.calculerR1Capacite())>=200&&e++,parseFloat(this.calculerR2Solvabilite())>=35&&e++,parseFloat(this.calculerR3Liquidite())>=100&&e++,parseFloat(this.calculerR4Endettement())<50&&e++,parseFloat(this.calculerR5Dependance())<50&&e++,parseFloat(this.calculerR6Couverture())>150&&e++,e}getNbSeuilsRespetesPropose(){let e=0,t=parseFloat(this.calculerR1Propose());!isNaN(t)&&t>=200&&e++,parseFloat(this.calculerR2Solvabilite())>=35&&e++,parseFloat(this.calculerR3Liquidite())>=100&&e++;let i=parseFloat(this.calculerR4Propose());!isNaN(i)&&i<50&&e++,parseFloat(this.calculerR5Dependance())<50&&e++;let l=parseFloat(this.calculerR6Propose());return!isNaN(l)&&l>150&&e++,e}allRatiosConformesSollicite(){return this.getNbSeuilsRespetesSollicite()===6}allRatiosConformesPropose(){return this.getNbSeuilsRespetesPropose()===6}calculerTotalActif(){let e=this.state().resumeCredit?.bilan_entreprise;if(!e)return 0;let t=e.liquidites||0,i=e.creances_clients||0,l=e.valeur_stocks||0,c=e.valeur_equipements||0;return t+i+l+c}calculerTotalPassif(){let e=this.state().resumeCredit?.bilan_entreprise;if(!e)return 0;let t=e.dettes_fournisseurs||0,i=e.emprunts||0,l=e.capital_propre||0;return t+i+l}calculerRatioLiquidite(){let e=this.state().resumeCredit?.bilan_entreprise;if(!e)return 0;let t=e.liquidites||0,i=e.creances_clients||0,l=e.dettes_fournisseurs||0,c=e.emprunts||0,f=l+c;return f>0?(t+i)/f:0}calculerRevenusTotauxActuel(){let e=this.state().resumeCredit?.exploitation_actuelle;if(!e)return 0;let t=e.chiffre_affaires||0,i=e.autres_revenus||0;return t+i}calculerRevenusTotauxPrevisionnel(){let e=this.state().resumeCredit?.exploitation_previsionnelle;if(!e)return 0;let t=e.chiffre_affaires||0,i=e.autres_revenus||0;return t+i}calculerRatioDependanceActuel(){let e=this.state().resumeCredit?.exploitation_actuelle;if(!e)return 0;let t=this.calculerRevenusTotauxActuel(),i=e.autres_revenus||0;return t>0?i/t:0}calculerRatioDependancePrevisionnel(){let e=this.state().resumeCredit?.exploitation_previsionnelle;if(!e)return 0;let t=this.calculerRevenusTotauxPrevisionnel(),i=e.autres_revenus||0;return t>0?i/t:0}calculerMargeButeActuelle(){let e=this.state().resumeCredit?.exploitation_actuelle;if(!e)return 0;let t=this.calculerRevenusTotauxActuel(),i=e.cout_marchandises||0;return t>0?(t-i)/t:0}calculerMargeButePrevisionnelle(){let e=this.state().resumeCredit?.exploitation_previsionnelle;if(!e)return 0;let t=this.calculerRevenusTotauxPrevisionnel(),i=e.cout_marchandises||0;return t>0?(t-i)/t:0}calculerTotalChargesActuelles(){let e=this.state().resumeCredit?.exploitation_actuelle;if(!e)return 0;let t=e.cout_transport_production||0,i=e.frais_transport_personnel||0,l=e.frais_manutention||0,c=e.montant_aide_externe||0,f=e.frais_hebergement_restauration||0,C=e.impots||0,A=e.loyers||0;return t+i+l+c+f+C+A}calculerTotalChargesPrevisionnelles(){let e=this.state().resumeCredit?.exploitation_previsionnelle;if(!e)return 0;let t=e.cout_transport_production||0,i=e.frais_transport_personnel||0,l=e.frais_manutention||0,c=e.montant_aide_externe||0,f=e.frais_hebergement_restauration||0,C=e.impots||0,A=e.loyers||0;return t+i+l+c+f+C+A}calculerPatrimoinePersonnel(){let e=this.state().resumeCredit?.bilan_personnel;return e?(e.epargnes||0)+(e.valeur_biens_durables||0):0}calculerMensualite(){let e=this.state().resumeCredit?.demande_credit;if(!e)return 0;let t=e.montant_demande||0,i=e.duree_mois||1;return t/i}calculerRatioCreditCA(){let e=this.state().resumeCredit?.demande_credit;if(!e)return 0;let t=e.montant_demande||0,i=this.calculerRevenusTotauxPrevisionnel();return i>0?t/i:0}getLiquiditySeverity(e){return e>2?"success":e>1.2?"info":e>.8?"warn":"danger"}getMarginSeverity(e){return e>=.4?"success":e>=.25?"info":e>=.15?"warn":"danger"}getRatioCreditCASeverity(){let e=this.calculerRatioCreditCA();return e<=.5?"success":e<=1?"info":e<=1.5?"warn":"danger"}getRatioDependanceSeverity(e){return e<.1?"success":e<.3?"info":e<.5?"warn":"danger"}getStatutSeverity(e){switch(e?.toUpperCase()){case"EN_ATTENTE":return"warn";case"APPROUVE":return"success";case"REJETE":return"danger";case"EN_COURS":return"info";case"VALIDE":return"success";default:return"secondary"}}formatDateForDisplay(e){if(!e)return"";let t;if(typeof e=="string"){if(t=new Date(e),isNaN(t.getTime()))return e}else if(e instanceof Date)t=e;else return"";return t.toLocaleDateString("fr-FR")}formatCurrency(e){return e==null?"0 GNF":new Intl.NumberFormat("fr-FR",{style:"currency",currency:"GNF",minimumFractionDigits:0,maximumFractionDigits:0}).format(e)}formatPercent(e){return new Intl.NumberFormat("fr-FR",{style:"percent",minimumFractionDigits:1,maximumFractionDigits:2}).format(e)}formatNumber(e){return new Intl.NumberFormat("fr-FR").format(e)}retourListe(){console.log("go back: ",this.state().resumeCredit?.demande_credit),this.router.navigate(["/dashboards/credit/individuel/attente/detail/",this.state().resumeCredit?.demande_credit?.demandeIndividuelId])}viewCompleteAnalyse(){console.log(this.state().resumeCredit?.demande_credit_id),this.state().resumeCredit?.demande_credit_id&&this.router.navigate([`/dashboards/credit/update-analyse-credit/${this.state().resumeCredit?.demande_credit_id}`])}getPromoteurData(){let e=this.state().resumeCredit?.promoteur;return e?[{label:"Nom",value:e.nom||"-"},{label:"Pr\xE9nom",value:e.prenom||"-"},{label:"Email",value:e.email||"-"},{label:"T\xE9l\xE9phone",value:e.telephone||"-"},{label:"Num\xE9ro d'identit\xE9",value:e.numero_identite||"-"},{label:"Date de naissance",value:this.formatDateForDisplay(e.date_naissance)||"-"},{label:"Adresse",value:e.adresse||"-"}]:[]}getEntrepriseData(){let e=this.state().resumeCredit?.entreprise;return e?[{label:"Nom",value:e.nom||"-"},{label:"Forme juridique",value:e.forme_juridique||"-"},{label:"Secteur d'activit\xE9",value:e.secteur_activite||"-"},{label:"Date de cr\xE9ation",value:this.formatDateForDisplay(e.date_creation)||"-"},{label:"Num\xE9ro de registre",value:e.numero_registre||"-"},{label:"Email",value:e.email||"-"},{label:"T\xE9l\xE9phone",value:e.telephone||"-"},{label:"Adresse",value:e.adresse||"-"}]:[]}getBilanEntrepriseData(){let e=this.state().resumeCredit?.bilan_entreprise;return e?[{label:"Liquidit\xE9s",value:this.formatCurrency(e.liquidites||0)},{label:"Cr\xE9ances clients",value:this.formatCurrency(e.creances_clients||0)},{label:"Valeur stocks",value:this.formatCurrency(e.valeur_stocks||0)},{label:"Valeur \xE9quipements",value:this.formatCurrency(e.valeur_equipements||0)},{label:"Dettes fournisseurs",value:this.formatCurrency(e.dettes_fournisseurs||0)},{label:"Emprunts",value:this.formatCurrency(e.emprunts||0)},{label:"Capital propre",value:this.formatCurrency(e.capital_propre||0)},{label:"Total actif",value:this.formatCurrency(this.calculerTotalActif()),isTotal:!0},{label:"Total passif",value:this.formatCurrency(this.calculerTotalPassif()),isTotal:!0},{label:"Ratio de liquidit\xE9",value:this.calculerRatioLiquidite().toFixed(2),severity:this.getLiquiditySeverity(this.calculerRatioLiquidite()),isRatio:!0}]:[]}getBilanPersonnelData(){let e=this.state().resumeCredit?.bilan_personnel;return e?[{label:"\xC9pargnes",value:this.formatCurrency(e.epargnes||0)},{label:"Biens durables",value:this.formatCurrency(e.valeur_biens_durables||0)},{label:"Total patrimoine",value:this.formatCurrency(this.calculerPatrimoinePersonnel()),isTotal:!0}]:[]}getExploitationActuelleData(){let e=this.state().resumeCredit?.exploitation_actuelle;return e?[{label:"P\xE9riode",value:`${this.formatDateForDisplay(e.periode_debut)} - ${this.formatDateForDisplay(e.periode_fin)}`},{label:"Chiffre d'affaires",value:this.formatCurrency(e.chiffre_affaires||0)},{label:"Autres revenus",value:this.formatCurrency(e.autres_revenus||0)},{label:"Revenus totaux",value:this.formatCurrency(this.calculerRevenusTotauxActuel()),isTotal:!0},{label:"Ratio de d\xE9pendance",value:this.formatPercent(this.calculerRatioDependanceActuel()),severity:this.getRatioDependanceSeverity(this.calculerRatioDependanceActuel()),isRatio:!0},{label:"Co\xFBt marchandises",value:this.formatCurrency(e.cout_marchandises||0)},{label:"Marge brute",value:this.formatPercent(this.calculerMargeButeActuelle()),severity:this.getMarginSeverity(this.calculerMargeButeActuelle()),isRatio:!0},{label:"Total charges",value:this.formatCurrency(this.calculerTotalChargesActuelles()),isTotal:!0}]:[]}getExploitationPrevisionnelleData(){let e=this.state().resumeCredit?.exploitation_previsionnelle;return e?[{label:"P\xE9riode",value:`${this.formatDateForDisplay(e.periode_debut)} - ${this.formatDateForDisplay(e.periode_fin)}`},{label:"Chiffre d'affaires",value:this.formatCurrency(e.chiffre_affaires||0)},{label:"Autres revenus",value:this.formatCurrency(e.autres_revenus||0)},{label:"Revenus totaux",value:this.formatCurrency(this.calculerRevenusTotauxPrevisionnel()),isTotal:!0},{label:"Ratio de d\xE9pendance",value:this.formatPercent(this.calculerRatioDependancePrevisionnel()),severity:this.getRatioDependanceSeverity(this.calculerRatioDependancePrevisionnel()),isRatio:!0},{label:"Co\xFBt marchandises",value:this.formatCurrency(e.cout_marchandises||0)},{label:"Marge brute",value:this.formatPercent(this.calculerMargeButePrevisionnelle()),severity:this.getMarginSeverity(this.calculerMargeButePrevisionnelle()),isRatio:!0},{label:"Total charges",value:this.formatCurrency(this.calculerTotalChargesPrevisionnelles()),isTotal:!0}]:[]}getChargesData(e){let t=e==="actuelle"?this.state().resumeCredit?.exploitation_actuelle:this.state().resumeCredit?.exploitation_previsionnelle;if(!t)return[];let i=e==="actuelle"?this.calculerTotalChargesActuelles():this.calculerTotalChargesPrevisionnelles();return[{label:"Transport production",value:this.formatCurrency(t.cout_transport_production||0)},{label:"Transport personnel",value:this.formatCurrency(t.frais_transport_personnel||0)},{label:"Manutention",value:this.formatCurrency(t.frais_manutention||0)},{label:"Aide externe",value:this.formatCurrency(t.montant_aide_externe||0)},{label:"H\xE9bergement/Restauration",value:this.formatCurrency(t.frais_hebergement_restauration||0)},{label:"Imp\xF4ts",value:this.formatCurrency(t.impots||0)},{label:"Loyers",value:this.formatCurrency(t.loyers||0)},{label:"Total charges",value:this.formatCurrency(i),isTotal:!0}]}getDemandeCreditData(){let e=this.state().resumeCredit?.demande_credit;return e?[{label:"Date demande",value:this.formatDateForDisplay(e.date_demande)||"-"},{label:"Montant demand\xE9",value:this.formatCurrency(e.montant_demande||0)},{label:"Dur\xE9e",value:`${e.duree_mois||0} mois`},{label:"Objet du financement",value:e.objet_financement||"-"},{label:"Mensualit\xE9 estim\xE9e",value:this.formatCurrency(this.calculerMensualite())},{label:"Ratio cr\xE9dit/Revenus totaux",value:this.formatPercent(this.calculerRatioCreditCA()),severity:this.getRatioCreditCASeverity(),isRatio:!0},{label:"Statut",value:e.statut||"-",isStatus:!0},{label:"ID D\xE9l\xE9gation",value:e.delegation_id?`${e.delegation_id}`:"Non renseign\xE9"},{label:"ID Agence",value:e.agence_id?`${e.agence_id}`:"Non renseign\xE9"},{label:"ID Point de vente",value:e.point_vente_id?`${e.point_vente_id}`:"Non renseign\xE9"},{label:"ID Utilisateur",value:e.user_id?`${e.user_id}`:"Non renseign\xE9"}]:[]}getIndicateursCles(){return this.state().resumeCredit?[{icon:"pi pi-chart-line",label:"Marge brute pr\xE9visionnelle",value:this.formatPercent(this.calculerMargeButePrevisionnelle()),severity:this.getMarginSeverity(this.calculerMargeButePrevisionnelle()),color:"blue"},{icon:"pi pi-money-bill",label:"Ratio de liquidit\xE9",value:this.calculerRatioLiquidite().toFixed(2),severity:this.getLiquiditySeverity(this.calculerRatioLiquidite()),color:"green"},{icon:"pi pi-percentage",label:"Ratio cr\xE9dit/Revenus totaux",value:this.formatPercent(this.calculerRatioCreditCA()),severity:this.getRatioCreditCASeverity(),color:"orange"},{icon:"pi pi-chart-pie",label:"Ratio de d\xE9pendance",value:this.formatPercent(this.calculerRatioDependancePrevisionnel()),severity:this.getRatioDependanceSeverity(this.calculerRatioDependancePrevisionnel()),color:"red"},this.getIndicateurGarantie(),{icon:"pi pi-wallet",label:"Patrimoine personnel",value:this.formatCurrency(this.calculerPatrimoinePersonnel()),severity:"info",color:"purple"}]:[]}calculerR1Capacite(){let e=this.getCashFlow(),t=this.getAutresRevenus(),i=this.getTraiteRevenus();return i===0?"0.0":((e+t)/i*100).toFixed(1)}getCashFlow(){if(!this.state().resumeCredit)return 0;let t=this.calculerRevenusTotauxPrevisionnel(),i=this.calculerTotalChargesPrevisionnelles();return Math.max(0,t-i)}getAutresRevenus(){return this.state().resumeCredit?.exploitation_previsionnelle?.autres_revenus||0}getTraiteRevenus(){return this.getEcheanceDemande()}getStatutR1(){return parseFloat(this.calculerR1Capacite())>=200?"CONFORME":"NON CONFORME"}getSeveriteR1(){return parseFloat(this.calculerR1Capacite())>=200?"success":"danger"}calculerR2Solvabilite(){let e=this.getCapitauxPropres(),t=this.getTotalActif();return t===0?"0.0":(e/t*100).toFixed(1)}getCapitauxPropres(){return this.state().resumeCredit?.bilan_entreprise?.capital_propre||0}getTotalActif(){return this.calculerTotalActif()}getStatutR2(){return parseFloat(this.calculerR2Solvabilite())>=35?"CONFORME":"NON CONFORME"}getSeveriteR2(){return parseFloat(this.calculerR2Solvabilite())>=35?"success":"danger"}calculerR3Liquidite(){let e=this.getCreancesEtTresorerie(),t=this.getDettesCourtTerme();return t===0?"0.0":(e/t*100).toFixed(1)}getCreancesEtTresorerie(){let t=this.state().resumeCredit?.bilan_entreprise,i=t?.creances_clients||0,l=t?.liquidites||0;return i+l}getDettesCourtTerme(){return this.state().resumeCredit?.bilan_entreprise?.dettes_fournisseurs||0||1}getStatutR3(){return parseFloat(this.calculerR3Liquidite())>=100?"CONFORME":"NON CONFORME"}getSeveriteR3(){return parseFloat(this.calculerR3Liquidite())>=100?"success":"danger"}calculerR4Endettement(){let e=this.getDettesTotalesAvecCredit(),t=this.getTotalActifAvecCredit();return t===0?"0.0":(e/t*100).toFixed(1)}getDettesTotalesAvecCredit(){let e=this.state().resumeCredit,t=e?.bilan_entreprise,i=(t?.dettes_fournisseurs||0)+(t?.emprunts||0),l=e?.demande_credit?.montant_demande||0;return i+l}getTotalActifAvecCredit(){let e=this.calculerTotalActif(),i=this.state().resumeCredit?.demande_credit?.montant_demande||0;return e+i}getStatutR4(){return parseFloat(this.calculerR4Endettement())<50?"CONFORME":"NON CONFORME"}getSeveriteR4(){return parseFloat(this.calculerR4Endettement())<50?"success":"danger"}calculerR5Dependance(){let e=this.getAutresRevenus(),t=this.getRevenusTorauxPrevisionnel();return t===0?"0.0":(e/t*100).toFixed(1)}getRevenusTorauxPrevisionnel(){return this.calculerRevenusTotauxPrevisionnel()}getStatutR5(){return parseFloat(this.calculerR5Dependance())<50?"CONFORME":"NON CONFORME"}getSeveriteR5(){return parseFloat(this.calculerR5Dependance())<50?"success":"danger"}calculerR6Couverture(){let e=this.getValeurGarantie(),t=this.getMontantCredit();return t===0?"0.0":(e/t*100).toFixed(1)}getValeurGarantie(){let e=this.state().resumeCredit,t=this.calculerPatrimoinePersonnel(),i=this.calculerTotalActif(),l=t+i*.5,f=this.getNombrePersonnesCaution()*.1,C=1+Math.min(f,.3);return l*C}getMontantCredit(){return this.state().resumeCredit?.demande_credit?.montant_demande||0}getStatutR6(){return parseFloat(this.calculerR6Couverture())>150?"CONFORME":"NON CONFORME"}getSeveriteR6(){return parseFloat(this.calculerR6Couverture())>150?"success":"danger"}getEvaluationGlobale(){let e=this.getNbSeuilsRespetes();return e>=6?"EXCELLENT":e>=5?"BON":e>=4?"ACCEPTABLE":"RISQUE"}getCouleurEvaluationGlobale(){switch(this.getEvaluationGlobale()){case"EXCELLENT":return"text-green-600";case"BON":return"text-blue-600";case"ACCEPTABLE":return"text-orange-600";case"RISQUE":return"text-red-600";default:return"text-gray-600"}}getNbSeuilsRespetes(){return this.getNbSeuilsRespetesSollicite()}getResumeRatios(){return{R1:{nom:"Capacit\xE9 de remboursement",valeur:this.calculerR1Capacite(),statut:this.getStatutR1(),formule:"(Cash Flow + Autres revenus) / Traite revenus"},R2:{nom:"Ratio de solvabilit\xE9",valeur:this.calculerR2Solvabilite(),statut:this.getStatutR2(),formule:"Capitaux propres / Total Actif"},R3:{nom:"Ratio de liquidit\xE9",valeur:this.calculerR3Liquidite(),statut:this.getStatutR3(),formule:"(Cr\xE9ances + Tr\xE9sorerie) / Dettes court terme"},R4:{nom:"Ratio d'endettement",valeur:this.calculerR4Endettement(),statut:this.getStatutR4(),formule:"(Dettes totales + Cr\xE9dit) / (Total Actif + Cr\xE9dit)"},R5:{nom:"Ratio de d\xE9pendance",valeur:this.calculerR5Dependance(),statut:this.getStatutR5(),formule:"Autres revenus / Revenus totaux"},R6:{nom:"Ratio de couverture",valeur:this.calculerR6Couverture(),statut:this.getStatutR6(),formule:"Valeur de la garantie / Cr\xE9dit"}}}exporterAnalyse(){let e=this.getResumeRatios(),t=this.getEvaluationGlobale(),i=this.getNbSeuilsRespetes();return{date_analyse:new Date().toISOString(),evaluation_globale:t,seuils_respectes:`${i}/6`,ratios:e,montant_demande:this.getMontantCredit(),recommandations:this.getRecommandations()}}getRecommandations(){let e=[];return parseFloat(this.calculerR1Capacite())<200&&e.push("\u2022 Am\xE9liorer la capacit\xE9 de remboursement (ratio < 200%)"),parseFloat(this.calculerR2Solvabilite())<35&&e.push("\u2022 Renforcer les capitaux propres (ratio < 35%)"),parseFloat(this.calculerR3Liquidite())<100&&e.push("\u2022 Am\xE9liorer la gestion de tr\xE9sorerie (ratio < 100%)"),parseFloat(this.calculerR4Endettement())>=50&&e.push("\u2022 R\xE9duire le niveau d'endettement (ratio >= 50%)"),parseFloat(this.calculerR5Dependance())>=50&&e.push("\u2022 Diversifier les sources de revenus (ratio >= 50%)"),parseFloat(this.calculerR6Couverture())<=150&&e.push("\u2022 Renforcer les garanties ou r\xE9duire le montant (ratio <= 150%)"),e.length===0&&(e.push("\u2705 Tous les indicateurs sont dans les normes"),e.push("\u2705 Le profil de risque est satisfaisant"),e.push("\u2705 La demande de cr\xE9dit peut \xEAtre consid\xE9r\xE9e favorablement")),e}getAnalyseRisque(){let e=this.getEvaluationGlobale(),t=this.getScoreRisque(),i=[];return parseFloat(this.calculerR1Capacite())<200&&i.push("Capacit\xE9 de remboursement insuffisante (< 200%)"),parseFloat(this.calculerR5Dependance())>=50&&i.push("Forte d\xE9pendance aux autres revenus (>= 50%)"),parseFloat(this.calculerR4Endettement())>=50&&i.push("Niveau d'endettement \xE9lev\xE9 (>= 50%)"),parseFloat(this.calculerR3Liquidite())<100&&i.push("Liquidit\xE9 insuffisante (< 100%)"),parseFloat(this.calculerR2Solvabilite())<35&&i.push("Solvabilit\xE9 insuffisante (< 35%)"),parseFloat(this.calculerR6Couverture())<=150&&i.push("Couverture de garantie insuffisante (<= 150%)"),i.length===0&&i.push("Aucun facteur de risque majeur identifi\xE9"),{niveau:e,score:t,facteurs:i}}getScoreRisque(){let e=this.getNbSeuilsRespetes();return Math.round(e/6*100)}getConseilsAmelioration(){let e=[],t=parseFloat(this.calculerR1Capacite()),i=parseFloat(this.calculerR2Solvabilite()),l=parseFloat(this.calculerR3Liquidite()),c=parseFloat(this.calculerR4Endettement()),f=parseFloat(this.calculerR5Dependance()),C=parseFloat(this.calculerR6Couverture());return t<200&&e.push("\u{1F4C8} Augmenter les revenus ou optimiser les charges pour am\xE9liorer le cash flow"),i<35&&e.push("\u{1F4B0} Envisager un apport en capital ou r\xE9duire les distributions"),l<100&&e.push("\u{1F4A7} Acc\xE9l\xE9rer le recouvrement des cr\xE9ances et optimiser la tr\xE9sorerie"),c>=50&&e.push("\u{1F4C9} Planifier un d\xE9sendettement progressif avant la nouvelle demande"),f>=50&&e.push("\u{1F3AF} D\xE9velopper le chiffre d'affaires principal pour r\xE9duire la d\xE9pendance"),C<=150&&e.push("\u{1F6E1}\uFE0F Constituer des garanties suppl\xE9mentaires ou r\xE9duire le montant"),e}getRecommandationDecision(){let e=this.getEvaluationGlobale(),t=this.getNbSeuilsRespetes();return t===6?{decision:"ACCORDER",justification:"Tous les ratios sont conformes aux normes"}:t>=5?{decision:"ACCORDER_AVEC_CONDITIONS",conditions:["Suivi trimestriel des ratios financiers","Maintien des garanties pendant toute la dur\xE9e"],justification:"Profil de risque acceptable avec quelques points d'attention"}:t>=4?{decision:"ETUDE_APPROFONDIE",conditions:["Audit financier compl\xE9mentaire","Plan d'am\xE9lioration des ratios d\xE9faillants","Garanties renforc\xE9es"],justification:"Profil n\xE9cessitant une analyse approfondie avant d\xE9cision"}:{decision:"REFUSER",justification:"Profil de risque trop \xE9lev\xE9, indicateurs financiers insuffisants"}}getDecisionSeverity(){switch(this.getRecommandationDecision().decision){case"ACCORDER":return"success";case"ACCORDER_AVEC_CONDITIONS":return"info";case"ETUDE_APPROFONDIE":return"warn";case"REFUSER":return"danger";default:return"secondary"}}testerAnalyseComplete(){console.log("=== ANALYSE COMPL\xC8TE DES RATIOS ==="),console.log(`
1. RATIOS SOLLICIT\xC9S:`),console.log("R1 - Capacit\xE9:",this.calculerR1Capacite()+"%","("+this.getStatutR1()+")"),console.log("R2 - Solvabilit\xE9:",this.calculerR2Solvabilite()+"%","("+this.getStatutR2()+")"),console.log("R3 - Liquidit\xE9:",this.calculerR3Liquidite()+"%","("+this.getStatutR3()+")"),console.log("R4 - Endettement:",this.calculerR4Endettement()+"%","("+this.getStatutR4()+")"),console.log("R5 - D\xE9pendance:",this.calculerR5Dependance()+"%","("+this.getStatutR5()+")"),console.log("R6 - Couverture:",this.calculerR6Couverture()+"%","("+this.getStatutR6()+")"),console.log(`
2. RATIOS PROPOS\xC9S:`),console.log("R1 Propos\xE9:",this.calculerR1Propose()+"%","("+this.getStatutR1Propose()+")"),console.log("R4 Propos\xE9:",this.calculerR4Propose()+"%","("+this.getStatutR4Propose()+")"),console.log("R6 Propos\xE9:",this.calculerR6Propose()+"%","("+this.getStatutR6Propose()+")"),console.log(`
3. \xC9VALUATION GLOBALE:`),console.log("Statut:",this.getEvaluationGlobale()),console.log("Score de risque:",this.getScoreRisque()+"/100"),console.log("Seuils respect\xE9s Sollicit\xE9:",this.getNbSeuilsRespetesSollicite()+"/6"),console.log("Seuils respect\xE9s Propos\xE9:",this.getNbSeuilsRespetesPropose()+"/6"),console.log(`
4. RECOMMANDATIONS:`),this.getRecommandations().forEach((i,l)=>{console.log(`${l+1}. ${i}`)}),console.log(`
5. ANALYSE DE RISQUE:`);let e=this.getAnalyseRisque();console.log("Niveau:",e.niveau),console.log("Facteurs de risque:",e.facteurs),console.log(`
6. D\xC9CISION RECOMMAND\xC9E:`);let t=this.getRecommandationDecision();console.log("D\xE9cision:",t.decision),console.log("Justification:",t.justification),t.conditions&&console.log("Conditions:",t.conditions),this.messageService.add({severity:"info",summary:"Test termin\xE9",detail:"V\xE9rifiez la console pour les r\xE9sultats d\xE9taill\xE9s"})}exporterAnalyseComplete(){let e=this.state().infoAdministrative,t={date_analyse:new Date().toISOString(),montant_demande:this.formatCurrency(this.getMontantCredit()),personnes_caution:{nombre:this.getNombrePersonnesCaution(),liste:this.state().resumeCredit?.personnes_caution||[],analyse_garantie:this.getAnalyseGarantiePersonnelle()},informations_administratives:e?{delegation:{id:e.delegationDto.id,libele:e.delegationDto.libele},agence:{id:e.agenceDto.id,libele:e.agenceDto.libele,delegation_id:e.agenceDto.delegation_id},point_vente:{id:e.pointVenteDto.id,libele:e.pointVenteDto.libele,code:e.pointVenteDto.code,delegation_id:e.pointVenteDto.delegation_id,agence_id:e.pointVenteDto.agence_id},utilisateur_traitant:{userId:e.user.userId,firstName:e.user.firstName,lastName:e.user.lastName,email:e.user.email,username:e.user.username,phone:e.user.phone,role:e.user.role,lastLogin:e.user.lastLogin,enabled:e.user.enabled},resume_hierarchique:this.getResumeAdministratif()}:{message:"Informations administratives non disponibles",fallback_ids:{delegation_id:this.state().resumeCredit?.demande_credit?.delegation_id,agence_id:this.state().resumeCredit?.demande_credit?.agence_id,point_vente_id:this.state().resumeCredit?.demande_credit?.point_vente_id,user_id:this.state().resumeCredit?.demande_credit?.user_id}},ratios:this.getResumeRatios(),evaluation:{statut_global:this.getEvaluationGlobale(),score_risque:this.getScoreRisque(),seuils_respectes:this.getNbSeuilsRespetes()+"/6"},recommandations:this.getRecommandations(),conseils_amelioration:this.getConseilsAmelioration(),analyse_risque:this.getAnalyseRisque(),decision_recommandee:this.getRecommandationDecision()};console.log("=== EXPORT ANALYSE COMPL\xC8TE AVEC INFOS ADMINISTRATIVES CORRIG\xC9ES ==="),console.log(JSON.stringify(t,null,2)),this.messageService.add({severity:"success",summary:"Export termin\xE9",detail:"Analyse export\xE9e avec informations administratives compl\xE8tes"}),this.telechargerAnalyseJSON(t)}testerInfoAdministrative(){console.log("=== TEST INFORMATIONS ADMINISTRATIVES ===");let e=this.hasInfoAdministrative(),t=this.isLoadingInfoAdmin(),i=this.getTracabiliteDetaillee(),l=this.getResumeAdministratif();console.log("Donn\xE9es disponibles:",e),console.log("En cours de chargement:",t),console.log("R\xE9sum\xE9:",l),console.log("Tracabilit\xE9 d\xE9taill\xE9e:",i),e&&console.log("Informations compl\xE8tes:",this.state().infoAdministrative),this.messageService.add({severity:"info",summary:"Test termin\xE9",detail:`Infos admin: ${e?"Disponibles":"Non disponibles"}`})}testerAnalyseCompleteAvecCautions(){console.log("=== ANALYSE COMPL\xC8TE AVEC PERSONNES CAUTION ==="),console.log(`
1. PERSONNES CAUTION:`),console.log("Nombre:",this.getNombrePersonnesCaution()),console.log("Liste:",this.getPersonnesCautionCompact());let e=this.getAnalyseGarantiePersonnelle();console.log("Analyse garantie:",e),console.log(`
2. INFORMATIONS COMPL\xC9MENTAIRES DEMANDE:`);let t=this.state().resumeCredit?.demande_credit;console.log("D\xE9l\xE9gation ID:",t?.delegation_id||"Non renseign\xE9"),console.log("Agence ID:",t?.agence_id||"Non renseign\xE9"),console.log("Point de vente ID:",t?.point_vente_id||"Non renseign\xE9"),console.log("User ID:",t?.user_id||"Non renseign\xE9"),console.log(`
3. RATIOS AVEC GARANTIES AM\xC9LIOR\xC9ES:`),console.log("R6 - Couverture (avec bonus cautions):",this.calculerR6Couverture()+"%","("+this.getStatutR6()+")"),console.log("Valeur garantie totale:",this.formatCurrency(this.getValeurGarantie())),console.log("Bonus personnes caution:",`${this.getNombrePersonnesCaution()} personne(s) = +${(this.getNombrePersonnesCaution()*10).toFixed(0)}%`),console.log(`
4. \xC9VALUATION GLOBALE:`),console.log("Statut:",this.getEvaluationGlobale()),console.log("Score de risque:",this.getScoreRisque()+"/100"),this.messageService.add({severity:"info",summary:"Test termin\xE9",detail:"Analyse avec personnes caution - Consultez la console"})}telechargerAnalyseJSON(e){let t=`analyse_credit_${new Date().toISOString().split("T")[0]}.json`,i=JSON.stringify(e,null,2),l=new Blob([i],{type:"application/json"}),c=document.createElement("a");c.href=URL.createObjectURL(l),c.download=t,c.click(),URL.revokeObjectURL(c.href)}getResumePourAffichage(){let e=this.getEvaluationGlobale(),t=this.getScoreRisque(),i=this.getNbSeuilsRespetes();return`\xC9valuation: ${e} (${t}/100) - ${i}/6 seuils respect\xE9s`}getCouleurScore(e){return e>=80?"text-green-600":e>=60?"text-blue-600":e>=40?"text-orange-600":"text-red-600"}getIconeEvaluation(){switch(this.getEvaluationGlobale()){case"EXCELLENT":return"pi pi-check-circle";case"BON":return"pi pi-thumbs-up";case"ACCEPTABLE":return"pi pi-exclamation-triangle";case"RISQUE":return"pi pi-times-circle";default:return"pi pi-question-circle"}}getPersonnesCautionData(){let e=this.state().resumeCredit?.personnes_caution;if(!e||!Array.isArray(e)||e.length===0)return[{label:"Aucune personne caution",value:"Pas de garantie personnelle enregistr\xE9e"}];let t=[];return e.forEach((i,l)=>{t.push({label:`Caution ${l+1} - Nom`,value:i.nom||"-"},{label:`Caution ${l+1} - Pr\xE9nom`,value:i.prenom||"-"},{label:`Caution ${l+1} - T\xE9l\xE9phone`,value:i.telephone||"-"},{label:`Caution ${l+1} - Activit\xE9`,value:i.activite||"-"},{label:`Caution ${l+1} - \xC2ge`,value:i.age?`${i.age} ans`:"-"},{label:`Caution ${l+1} - Profession`,value:i.profession||"-"}),l<e.length-1&&t.push({label:"---",value:"---"})}),t}getNombrePersonnesCaution(){let e=this.state().resumeCredit?.personnes_caution;return e&&Array.isArray(e)?e.length:0}hasPersonnesCaution(){return this.getNombrePersonnesCaution()>0}getPersonnesCautionCompact(){let e=this.state().resumeCredit?.personnes_caution;return!e||!Array.isArray(e)?[]:e.map(t=>`${t.prenom||""} ${t.nom||""} - ${t.profession||"N/A"}`)}getAnalyseGarantiePersonnelle(){let e=this.getNombrePersonnesCaution(),t=this.state().resumeCredit?.personnes_caution||[],i=0,l="INSUFFISANT",c="",f=[];e===0?(i=20,l="INSUFFISANT",c="Aucune personne caution renseign\xE9e",f.push("D\xE9signer au moins une personne caution solvable")):e===1?(i=60,l="MOYEN",c="Une seule personne caution",f.push("Envisager une seconde personne caution pour renforcer les garanties")):e===2?(i=85,l="BON",c="Deux personnes caution - profil correct",f.push("V\xE9rifier la solvabilit\xE9 des personnes caution")):(i=95,l="EXCELLENT",c="Plusieurs personnes caution - tr\xE8s bon profil de garantie");let C=t.filter(A=>!A.activite||!A.profession);return C.length>0&&(i-=10,f.push(`Compl\xE9ter les informations d'activit\xE9 pour ${C.length} personne(s)`)),{niveau:l,score:i,description:c,recommendations:f}}getIndicateurGarantie(){let e=this.getAnalyseGarantiePersonnelle(),t="secondary";switch(e.niveau){case"EXCELLENT":t="success";break;case"BON":t="info";break;case"MOYEN":t="warn";break;case"INSUFFISANT":t="danger";break}return{icon:"pi pi-users",label:"Garantie personnelle",value:`${this.getNombrePersonnesCaution()} personne(s)`,severity:t,color:"teal"}}getDemandeCreditInfosComplementaires(){let e=this.state().infoAdministrative,t=this.state().resumeCredit?.demande_credit;return!e||!t?[{label:"D\xE9l\xE9gation",value:t?.delegation_id?`ID: ${t.delegation_id}`:"Non renseign\xE9e"},{label:"Agence",value:t?.agence_id?`ID: ${t.agence_id}`:"Non renseign\xE9e"},{label:"Point de vente",value:t?.point_vente_id?`ID: ${t.point_vente_id}`:"Non renseign\xE9"},{label:"Utilisateur",value:t?.user_id?`ID: ${t.user_id}`:"Non renseign\xE9"}]:[{label:"D\xE9l\xE9gation",value:e.delegationDto.libele},{label:"Agence",value:e.agenceDto.libele},{label:"Point de vente",value:`${e.pointVenteDto.libele} (${e.pointVenteDto.code})`},{label:"Utilisateur traitant",value:`${e.user.firstName} ${e.user.lastName} - ${e.user.role}`}]}getTracabiliteDetaillee(){let e=this.state().infoAdministrative,t=this.state().resumeCredit?.demande_credit;return!e||!t?{delegation:{id:t?.delegation_id||"N/A",nom:"Information non disponible",details:"Chargement..."},agence:{id:t?.agence_id||"N/A",nom:"Information non disponible",details:"Chargement..."},pointVente:{id:t?.point_vente_id||"N/A",nom:"Information non disponible",details:"Chargement..."},user:{id:t?.user_id||"N/A",nom:"Information non disponible",details:"Chargement..."}}:{delegation:{id:e.delegationDto.id,nom:e.delegationDto.libele,details:`D\xE9l\xE9gation de ${e.delegationDto.libele}`,code:`DEL-${e.delegationDto.id}`},agence:{id:e.agenceDto.id,nom:e.agenceDto.libele,details:`Agence ${e.agenceDto.libele}`,delegation_id:e.agenceDto.delegation_id},pointVente:{id:e.pointVenteDto.id,nom:e.pointVenteDto.libele,code:e.pointVenteDto.code,details:`Point de vente ${e.pointVenteDto.libele} (Code: ${e.pointVenteDto.code})`,agence_id:e.pointVenteDto.agence_id,delegation_id:e.pointVenteDto.delegation_id},user:{id:e.user.userId,nom:`${e.user.firstName} ${e.user.lastName}`,email:e.user.email,details:e.user.role||"R\xF4le non sp\xE9cifi\xE9",username:e.user.username,phone:e.user.phone||"Non renseign\xE9",lastLogin:e.user.lastLogin||"Jamais connect\xE9",enabled:e.user.enabled}}}hasInfoAdministrative(){return!!this.state().infoAdministrative}isLoadingInfoAdmin(){return this.state().loadingAdmin}getResumeAdministratif(){let e=this.state().infoAdministrative;return e?`${e.delegationDto.libele} > ${e.agenceDto.libele} > ${e.pointVenteDto.libele} (${e.pointVenteDto.code})`:"Informations en cours de chargement..."}imprimerBilan(e={}){if(!this.state().resumeCredit){this.messageService.add({severity:"warn",summary:"Attention",detail:"Aucune donn\xE9e disponible pour l'impression"});return}try{let t=this.preparerDonneesImpression(),i=b({includeIndicateurs:!0,includeSignature:!1,title:"R\xE9sum\xE9 d'Analyse de Cr\xE9dit"},e);this.printService.imprimerBilan(t,i),this.messageService.add({severity:"success",summary:"Impression",detail:"Fen\xEAtre d'impression ouverte"})}catch(t){console.error("Erreur lors de l'impression:",t),this.messageService.add({severity:"error",summary:"Erreur",detail:"Impossible de g\xE9n\xE9rer le document d'impression"})}}preparerDonneesImpression(){let e=this.state().resumeCredit,t=this.state().infoAdministrative;return{dateImpression:new Date().toISOString(),montantDemande:this.formatCurrency(this.getMontantCredit()),evaluationGlobale:this.getEvaluationGlobale(),scoreRisque:this.getScoreRisque(),seuilsRespetes:this.getNbSeuilsRespetes(),ratios:[{nom:"R1 - Capacit\xE9 de remboursement",valeur:this.calculerR1Capacite(),statut:this.getStatutR1(),formule:"(Cash Flow + Autres revenus) / Traite revenus"},{nom:"R2 - Ratio de solvabilit\xE9",valeur:this.calculerR2Solvabilite(),statut:this.getStatutR2(),formule:"Capitaux propres / Total Actif"},{nom:"R3 - Ratio de liquidit\xE9",valeur:this.calculerR3Liquidite(),statut:this.getStatutR3(),formule:"(Cr\xE9ances + Tr\xE9sorerie) / Dettes court terme"},{nom:"R4 - Ratio d'endettement",valeur:this.calculerR4Endettement(),statut:this.getStatutR4(),formule:"(Dettes totales + Cr\xE9dit) / (Total Actif + Cr\xE9dit)"},{nom:"R5 - Ratio de d\xE9pendance",valeur:this.calculerR5Dependance(),statut:this.getStatutR5(),formule:"Autres revenus / Revenus totaux"},{nom:"R6 - Ratio de couverture",valeur:this.calculerR6Couverture(),statut:this.getStatutR6(),formule:"Valeur de la garantie / Cr\xE9dit"}],promoteur:this.getPromoteurData(),entreprise:this.getEntrepriseData(),bilanEntreprise:this.getBilanEntrepriseData(),bilanPersonnel:this.getBilanPersonnelData(),exploitationActuelle:this.getExploitationActuelleData(),exploitationPrevisionnelle:this.getExploitationPrevisionnelleData(),chargesActuelles:this.getChargesData("actuelle"),chargesPrevisionnelles:this.getChargesData("previsionnelle"),demandeCredit:this.getDemandeCreditData().slice(0,7),infoAdministratives:this.getDemandeCreditInfosComplementaires(),personnesCaution:e?.personnes_caution||[],personnesCautionData:this.getPersonnesCautionData(),analyseGarantie:this.getAnalyseGarantiePersonnelle(),recommandations:this.getRecommandations(),conseilsAmelioration:this.getConseilsAmelioration(),analyseRisque:this.getAnalyseRisque(),decisionRecommandee:this.getRecommandationDecision(),utilisateur:this.state().user,informationsAdministratives:t?{delegation:t.delegationDto.libele,agence:t.agenceDto.libele,pointVente:`${t.pointVenteDto.libele} (${t.pointVenteDto.code})`,utilisateurTraitant:`${t.user.firstName} ${t.user.lastName} - ${t.user.role}`}:null}}imprimerSimple(){this.imprimerBilan({includeIndicateurs:!1,includeSignature:!1})}exporterPDF(){this.messageService.add({severity:"info",summary:"Export PDF",detail:`Utilisez l'option "Enregistrer au format PDF" dans la fen\xEAtre d'impression`}),this.imprimerBilan({includeSignature:!1,includeIndicateurs:!0})}genererHTMLPreview(e){return`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Pr\xE9visualisation - R\xE9sum\xE9 d'Analyse de Cr\xE9dit</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .preview-header { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                    .preview-actions { text-align: center; margin-bottom: 20px; }
                    .print-btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 0 10px; }
                    .close-btn { background: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 0 10px; }
                    .content { border: 1px solid #dee2e6; padding: 20px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="preview-header">
                    <h2>Pr\xE9visualisation du R\xE9sum\xE9 d'Analyse de Cr\xE9dit</h2>
                    <p>V\xE9rifiez le contenu avant impression. Cette pr\xE9visualisation montre le document tel qu'il sera imprim\xE9.</p>
                </div>
                
                <div class="preview-actions">
                    <button class="print-btn" onclick="window.print()">Imprimer</button>
                    <button class="close-btn" onclick="window.close()">Fermer</button>
                </div>
                
                <div class="content">
                    <h1>R\xC9SUM\xC9 D'ANALYSE DE CR\xC9DIT</h1>
                    <p><strong>Montant demand\xE9:</strong> ${e.montantDemande}</p>
                    <p><strong>\xC9valuation:</strong> ${e.evaluationGlobale}</p>
                    <p><strong>Score de risque:</strong> ${e.scoreRisque}/100</p>
                    
                    <h2>PROMOTEUR</h2>
                    ${this.genererTableauPreview(e.promoteur)}
                    
                    <h2>ENTREPRISE</h2>
                    ${this.genererTableauPreview(e.entreprise)}
                    
                    <h2>RECOMMANDATIONS</h2>
                    <ul>
                        ${e.recommandations.map(t=>`<li>${t}</li>`).join("")}
                    </ul>
                    
                    <p style="margin-top: 30px; text-align: center; color: #6c757d; font-size: 12px;">
                        Document g\xE9n\xE9r\xE9 le ${new Date().toLocaleDateString("fr-FR")}
                    </p>
                </div>
            </body>
            </html>
        `}genererTableauPreview(e){return!e||e.length===0?"<p>Aucune donn\xE9e disponible</p>":`
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                ${e.map(t=>`
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold; width: 40%;">${t.label}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${t.value}</td>
                    </tr>
                `).join("")}
            </table>
        `}peutImprimer(){return!!(this.state().resumeCredit&&!this.state().loading)}getResumeImpression(){if(!this.peutImprimer())return"Aucune donn\xE9e disponible";let e=this.getEvaluationGlobale(),t=this.formatCurrency(this.getMontantCredit()),i=this.state().resumeCredit?.promoteur;return`${i?.prenom} ${i?.nom} - ${t} - ${e}`}printMenuModel=[{label:"Pr\xE9visualiser",icon:"pi pi-eye",command:()=>this.previsualiserImpression()},{label:"Imprimer avec signature",icon:"pi pi-file-edit",command:()=>this.imprimerAvecSignature()},{label:"Version simplifi\xE9e",icon:"pi pi-file",command:()=>this.imprimerSimple()},{separator:!0},{label:"Exporter en PDF",icon:"pi pi-file-pdf",command:()=>this.exporterPDF()}];imprimerResumeCredit(e={}){if(!this.state().resumeCredit){this.messageService.add({severity:"warn",summary:"Attention",detail:"Aucune donn\xE9e disponible pour l'impression"});return}try{let t=this.preparerDonneesImpressionResume(),i=b({includeEvaluation:!0,includeRatios:this.state().user?.role==="MANAGER"||this.state().user?.role==="DA",includeRecommandations:!0,includeSignature:!1,title:"R\xE9sum\xE9 d'Analyse de Cr\xE9dit"},e);this.resumePrintService.imprimerResumeCredit(t,i),this.messageService.add({severity:"success",summary:"Impression",detail:"Fen\xEAtre d'impression ouverte"})}catch(t){console.error("Erreur lors de l'impression:",t),this.messageService.add({severity:"error",summary:"Erreur",detail:"Impossible de g\xE9n\xE9rer le document d'impression"})}}preparerDonneesImpressionResume(){let e=this.state().resumeCredit,t=this.state().infoAdministrative;return{dateImpression:new Date().toISOString(),montantDemande:this.getMontantCredit(),evaluation:this.getEvaluationGlobale(),scoreRisque:this.getScoreRisque(),seuilsRespetes:this.getNbSeuilsRespetes(),ratios:this.state().user?.role==="MANAGER"||this.state().user?.role==="DA"?{R1:{nom:"R1 - Capacit\xE9 de remboursement",valeur:this.calculerR1Capacite(),statut:this.getStatutR1(),formule:"(Cash Flow + Autres revenus) / Traite revenus"},R2:{nom:"R2 - Ratio de solvabilit\xE9",valeur:this.calculerR2Solvabilite(),statut:this.getStatutR2(),formule:"Capitaux propres / Total Actif"},R3:{nom:"R3 - Ratio de liquidit\xE9",valeur:this.calculerR3Liquidite(),statut:this.getStatutR3(),formule:"(Cr\xE9ances + Tr\xE9sorerie) / Dettes court terme"},R4:{nom:"R4 - Ratio d'endettement",valeur:this.calculerR4Endettement(),statut:this.getStatutR4(),formule:"(Dettes totales + Cr\xE9dit) / (Total Actif + Cr\xE9dit)"},R5:{nom:"R5 - Ratio de d\xE9pendance",valeur:this.calculerR5Dependance(),statut:this.getStatutR5(),formule:"Autres revenus / Revenus totaux"},R6:{nom:"R6 - Ratio de couverture",valeur:this.calculerR6Couverture(),statut:this.getStatutR6(),formule:"Valeur de la garantie / Cr\xE9dit"}}:null,promoteur:this.getPromoteurData(),entreprise:this.getEntrepriseData(),bilanEntreprise:this.getBilanEntrepriseData(),bilanPersonnel:this.getBilanPersonnelData(),exploitationActuelle:this.getExploitationActuelleData(),exploitationPrevisionnelle:this.getExploitationPrevisionnelleData(),chargesActuelles:this.getChargesData("actuelle"),chargesPrevisionnelles:this.getChargesData("previsionnelle"),demandeCredit:this.getDemandeCreditData().slice(0,7),infoAdministratives:this.getDemandeCreditInfosComplementaires(),personnesCaution:e?.personnes_caution||[],personnesCautionData:this.getPersonnesCautionData(),analyseGarantie:this.getAnalyseGarantiePersonnelle(),recommandations:this.getRecommandations(),conseilsAmelioration:this.getConseilsAmelioration(),analyseRisque:this.getAnalyseRisque(),decisionRecommandee:this.getRecommandationDecision(),utilisateur:this.state().user,informationsAdministratives:t?{delegation:t.delegationDto?.libele,agence:t.agenceDto?.libele,pointVente:`${t.pointVenteDto?.libele} (${t.pointVenteDto?.code})`,utilisateurTraitant:`${t.user?.firstName} ${t.user?.lastName} - ${t.user?.role}`}:null}}imprimerAvecSignature(){this.imprimerResumeCredit({includeSignature:!0,includeEvaluation:!0,includeRatios:!0,includeRecommandations:!0})}imprimerResumeSimple(){this.imprimerResumeCredit({includeEvaluation:!0,includeRatios:!1,includeRecommandations:!0,includeSignature:!1})}imprimerRatiosDetailles(){if(this.state().user?.role!=="MANAGER"&&this.state().user?.role!=="DA"){this.messageService.add({severity:"warn",summary:"Acc\xE8s restreint",detail:"Seuls les managers et DA peuvent imprimer les ratios d\xE9taill\xE9s"});return}this.imprimerResumeCredit({includeEvaluation:!0,includeRatios:!0,includeRecommandations:!1,includeSignature:!1})}exporterResumePDF(){this.messageService.add({severity:"info",summary:"Export PDF",detail:`Utilisez l'option "Enregistrer au format PDF" dans la fen\xEAtre d'impression`}),setTimeout(()=>{this.imprimerResumeCredit({includeSignature:!1,includeEvaluation:!0,includeRatios:!0,includeRecommandations:!0})},1e3)}previsualiserImpression(){if(!this.state().resumeCredit){this.messageService.add({severity:"warn",summary:"Attention",detail:"Aucune donn\xE9e disponible pour la pr\xE9visualisation"});return}this.imprimerResumeCredit()}peutImprimerResume(){return!!(this.state().resumeCredit&&!this.state().loading)}getResumeImpressionPourAffichage(){if(!this.peutImprimerResume())return"Aucune donn\xE9e disponible";let e=this.getEvaluationGlobale(),t=this.formatCurrency(this.getMontantCredit()),i=this.state().resumeCredit?.promoteur;return`${i?.prenom} ${i?.nom} - ${t} - ${e}`}getStatutImpression(){if(!this.state().resumeCredit)return{disponible:!1,message:"Aucune donn\xE9e de r\xE9sum\xE9 disponible"};if(this.state().loading)return{disponible:!1,message:"Chargement en cours..."};let e=this.state().resumeCredit,t=this.getEvaluationGlobale(),i=this.getScoreRisque();return{disponible:!0,message:"Pr\xEAt pour impression",details:{promoteur:`${e?.promoteur?.prenom} ${e?.promoteur?.nom}`,entreprise:e?.entreprise?.nom,montantDemande:this.formatCurrency(this.getMontantCredit()),evaluation:t,scoreRisque:`${i}/100`,nbPersonnesCaution:this.getNombrePersonnesCaution(),hasInfoAdmin:this.hasInfoAdministrative(),canViewRatios:this.state().user?.role==="MANAGER"||this.state().user?.role==="DA"}}}ouvrirDialogOptionsImpression(){if(!this.peutImprimerResume()){this.messageService.add({severity:"warn",summary:"Attention",detail:"Aucune donn\xE9e disponible pour l'impression"});return}this.messageService.add({severity:"info",summary:"Options d'impression",detail:"Fonctionnalit\xE9 \xE0 d\xE9velopper: dialog d'options d'impression"})}validerDonneesAvantImpression(){return this.state().resumeCredit?this.state().resumeCredit?.promoteur?!this.getMontantCredit()||this.getMontantCredit()===0?(this.messageService.add({severity:"warn",summary:"Donn\xE9es incompl\xE8tes",detail:"Montant du cr\xE9dit non d\xE9fini"}),!1):!0:(this.messageService.add({severity:"warn",summary:"Donn\xE9es incompl\xE8tes",detail:"Informations du promoteur manquantes"}),!1):(this.messageService.add({severity:"error",summary:"Donn\xE9es manquantes",detail:"Aucun r\xE9sum\xE9 de cr\xE9dit disponible"}),!1)}imprimerAvecValidation(e={}){this.validerDonneesAvantImpression()&&this.imprimerResumeCredit(e)}getOptionsImpressionDisponibles(){let e=[{label:"Impression standard",icon:"pi pi-print",command:()=>this.imprimerResumeCredit()},{label:"Version simplifi\xE9e",icon:"pi pi-file",command:()=>this.imprimerResumeSimple()},{separator:!0},{label:"Exporter en PDF",icon:"pi pi-file-pdf",command:()=>this.exporterResumePDF()}];return(this.state().user?.role==="MANAGER"||this.state().user?.role==="DA")&&(e.splice(-2,0,{label:"Avec signature",icon:"pi pi-file-edit",command:()=>this.imprimerAvecSignature()}),e.splice(-2,0,{label:"Ratios d\xE9taill\xE9s",icon:"pi pi-chart-bar",command:()=>this.imprimerRatiosDetailles()})),e}getDureeMois(){return this.state().resumeCredit?.demande_credit?.duree_mois||0}getDureeEnAnneesResume(){let e=this.getDureeMois();if(e===0)return"0 mois";if(e<12)return`${e} mois`;let t=Math.floor(e/12),i=e%12;return i===0?t===1?"1 an":`${t} ans`:`${t} an${t>1?"s":""} et ${i} mois`}getDureeSeverityResume(){let e=this.getDureeMois();return e<=12?"success":e<=36?"info":e<=60?"warn":"danger"}getAnneesCredit(){let e=this.getDureeMois();if(e===0)return[];let t=[],i=e,l=1;for(;i>0;){let c=Math.min(12,i);t.push({numero:l,mois:c}),i-=c,l++}return t}getMoisAnnee(e){let t=["Jan","F\xE9v","Mar","Avr","Mai","Jun","Jul","Ao\xFB","Sep","Oct","Nov","D\xE9c"],i=this.getDureeMois(),l=(e-1)*12;return t.map((c,f)=>{let C=l+f+1;return{index:f,nom:c,actif:C<=i,numeroGlobal:C}})}getAnneeColorClass(e){return e===1?"text-green-700":e===2?"text-blue-700":"text-orange-700"}getProgressSegments(){let e=this.getAnneesCredit(),t=this.getDureeMois();return t===0?[]:e.map(i=>({annee:i.numero,mois:i.mois,pourcentage:i.mois/t*100,couleur:i.numero===1?"green":i.numero===2?"blue":"orange"}))}getCalculMensualiteData(){let e=this.getMontantCredit(),t=this.getDureeMois(),i=this.calculerMensualite(),l=i*t;return[{label:"Montant emprunt\xE9",value:this.formatCurrency(e)},{label:"Dur\xE9e du cr\xE9dit",value:`${t} mois (${this.getDureeEnAnneesResume()})`},{label:"Mensualit\xE9",value:this.formatCurrency(i)},{label:"Nombre de paiements",value:`${t} mensualit\xE9s`},{label:"Total \xE0 rembourser",value:this.formatCurrency(l),isTotal:!0}]}static \u0275fac=function(t){return new(t||a)};static \u0275cmp=G({type:a,selectors:[["app-resume-credit"]],features:[U([F])],decls:19,vars:6,consts:[[1,"container-fluid"],[1,"grid"],[1,"col-12"],[1,"flex","flex-wrap","gap-2","items-center","justify-between","mb-4"],[1,"text-2xl","font-bold","text-900","m-0"],[1,"text-600","m-0","mt-1"],[1,"text-500","mt-1","block"],[1,"flex","gap-2","flex-wrap"],[1,"print-buttons-group","flex","gap-2","mr-3"],[1,"print-disabled-info","mr-3"],["label","Retour","icon","pi pi-arrow-left","outlined","",3,"onClick"],["label","Imprimer","icon","pi pi-print","pTooltip","Imprimer le r\xE9sum\xE9 complet","tooltipPosition","bottom",3,"onClick"],["label","Options","icon","pi pi-download","severity","secondary","size","small",3,"onClick","model"],["label","Impression non disponible","icon","pi pi-print","disabled","","severity","secondary","size","small","pTooltip","Chargez d'abord les donn\xE9es pour pouvoir imprimer","tooltipPosition","bottom"],[1,"flex","justify-center","items-center","p-8"],[1,"text-center","p-4"],[1,"pi","pi-exclamation-triangle","text-6xl","text-red-500","mb-3"],[1,"text-red-600"],[1,"text-600"],["label","R\xE9essayer","icon","pi pi-refresh",3,"onClick"],[1,"grid","mb-3"],[1,"surface-card","p-3","border-round","shadow-1"],[1,"flex","align-items-center","gap-2","mb-2"],[1,"pi","pi-credit-card","text-red-600"],[1,"font-bold","text-lg"],[1,"col-3"],[1,"text-600","text-sm"],[1,"font-bold","ml-2"],[1,"col-2"],[1,"ml-2",3,"value","severity"],[1,"grid","mt-2"],[1,"col-4"],[1,"ml-2"],[1,"col-6"],[1,"col-12","lg:col-6"],[1,"surface-card","p-3","border-round","shadow-1","h-full"],[1,"pi","pi-user","text-blue-600"],[1,"font-bold"],[1,"grid","text-sm"],[1,"col-6","py-1"],[1,"pi","pi-building","text-green-600"],[1,"pi","pi-users","text-teal-600"],[3,"value","severity"],[1,"text-center","text-orange-600","py-2"],[1,"col-12","lg:col-8"],[1,"pi","pi-chart-bar","text-orange-600"],[1,"col-6","md:col-4","py-1",3,"ngClass"],[1,"col-12","lg:col-4"],[1,"pi","pi-wallet","text-purple-600"],[1,"text-sm"],[1,"py-1",3,"ngClass"],[1,"pi","pi-calendar","text-blue-600"],[1,"col-6","py-1",3,"ngClass"],[1,"pi","pi-chart-line","text-green-600"],[1,"pi","pi-chart-bar","text-green-600"],[1,"col-3","text-center"],[1,"font-bold","text-green-700","ml-1"],[1,"font-bold","text-blue-700","ml-1"],[1,"flex","justify-content-between","align-items-center","gap-3","p-3","bg-gray-50","border-round"],[1,"flex","gap-2"],[1,"grid","mb-4"],[1,"surface-card","border-round","shadow-1"],[1,"p-3","border-bottom-1","surface-border",2,"background-color","#d9d9d9"],[1,"p-3"],[1,"flex","justify-content-end","mb-3"],[1,"border-1","surface-border",2,"min-width","400px"],[1,"text-right","p-2","border-bottom-1","surface-border","font-semibold"],[1,"flex","border-bottom-1","surface-border"],[1,"p-2","text-right",2,"width","100px"],[1,"p-2","flex-1","text-center",2,"background-color","#c6efce"],[1,"p-2","text-center",2,"width","80px","background-color","#c6efce"],[1,"p-2","text-center","flex-1"],[1,"flex"],[1,"w-full",2,"border-collapse","collapse","border","1px solid #000"],[2,"border","1px solid #000","width","35%"],[1,"p-2","text-center","font-bold",2,"border","1px solid #000","width","10%"],[1,"p-2","text-center",2,"border","1px solid #000","width","22%","position","relative"],[2,"writing-mode","vertical-rl","transform","rotate(180deg)","height","120px","display","flex","align-items","center","justify-content","center","font-size","11px"],[1,"p-2",2,"border","1px solid #000"],[1,"text-sm","text-600"],[1,"p-2","text-center","font-bold",2,"border","1px solid #000"],[1,"p-2","text-center",2,"border","1px solid #000"],[1,"border-1","surface-border","p-2","border-round","inline-block",2,"min-width","100px"],[1,"text-500"],[1,"grid","mt-3"],[1,"p-2","border-round","text-center",3,"ngClass"],["pTemplate","header"],[1,"col-12","md:col-4"],[1,"text-blue-700","mb-2"],[1,"text-sm","text-700","mb-1"],[1,"text-orange-700","mb-2"],[1,"text-purple-700","mb-2"],[1,"text-sm","text-700"],[1,"mt-1"],["size","small",3,"value","severity"],[1,"flex","align-items-center","gap-2","p-3"],[1,"pi","pi-lightbulb","text-yellow-600"],[1,"m-0"],[1,"ml-1","font-medium"],[1,"pi","pi-exclamation-triangle","mr-2"],[1,"col-12","md:col-4","py-1"],[1,"pi","pi-user","text-teal-500","mr-1"],[1,"ml-1"],["label","Aper\xE7u","icon","pi pi-eye","outlined","","size","small",3,"onClick"],["label","Imprimer","icon","pi pi-print",3,"onClick"],[1,"text-center","p-8"],[1,"pi","pi-info-circle","text-6xl","text-blue-500","mb-3"]],template:function(t,i){t&1&&(n(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div")(5,"h2",4),o(6,"R\xE9sum\xE9 d'Analyse de Cr\xE9dit"),r(),n(7,"p",5),o(8,"Analyse compl\xE8te de la demande de cr\xE9dit"),r(),v(9,Re,2,1,"small",6),r(),n(10,"div",7),v(11,Pe,3,4,"div",8)(12,Se,2,0,"div",9),n(13,"p-button",10),R("onClick",function(){return i.retourListe()}),r()()()()(),v(14,ye,4,0,"div",1)(15,Ee,10,1,"div",1)(16,ht,149,18)(17,Ct,10,0,"div",1),r(),d(18,"p-toast")),t&2&&(s(9),g(i.peutImprimer()?9:-1),s(2),g(i.peutImprimer()?11:12),s(3),g(i.state().loading?14:-1),s(),g(i.state().error&&!i.state().loading?15:-1),s(),g(i.state().resumeCredit&&!i.state().loading?16:-1),s(),g(!i.state().resumeCredit&&!i.state().loading&&!i.state().error?17:-1))},dependencies:[z,B,ue,ce,J,pe,se,de,le,W,Q,re,ne,ie,te,X,H,ae,me,oe,K,Z,ge,he,fe],styles:['@charset "UTF-8";.recommendation-list[_ngcontent-%COMP%]{max-height:300px;overflow-y:auto}.risk-analysis[_ngcontent-%COMP%]   .p-progressbar[_ngcontent-%COMP%]{border-radius:10px}.conseil-item[_ngcontent-%COMP%]{transition:all .3s ease}.conseil-item[_ngcontent-%COMP%]:hover{transform:translate(5px);box-shadow:0 2px 4px #0000001a}.decision-recommendation[_ngcontent-%COMP%]{border-left:4px solid #8e44ad}.bg-accorder-50[_ngcontent-%COMP%]{background-color:#27ae601a;border-left-color:#27ae60}.bg-accorder-avec-conditions-50[_ngcontent-%COMP%]{background-color:#3498db1a;border-left-color:#3498db}.bg-etude-approfondie-50[_ngcontent-%COMP%]{background-color:#f39c121a;border-left-color:#f39c12}.bg-refuser-50[_ngcontent-%COMP%]{background-color:#e74c3c1a;border-left-color:#e74c3c}.indicator-card-simple[_ngcontent-%COMP%]{background:#fff;border:1px solid #e9ecef;border-radius:12px;padding:1.5rem;height:100%;box-shadow:0 2px 8px #0000001a;transition:all .3s ease;position:relative}.indicator-card-simple[_ngcontent-%COMP%]:hover{transform:translateY(-2px);box-shadow:0 4px 12px #00000026}.indicator-header[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%]{font-size:1rem;line-height:1.2}.indicator-header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{font-size:.75rem;font-style:italic}.indicator-value[_ngcontent-%COMP%]{color:#2c3e50}.indicator-details[_ngcontent-%COMP%]{border-top:1px solid #e9ecef;padding-top:1rem;margin-top:1rem}.separator-container[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;margin:1rem 0}.indicator-separator[_ngcontent-%COMP%]{width:80%;height:2px;background:linear-gradient(90deg,transparent 0%,#3498db 20%,#2ecc71 40%,#f39c12 60%,#e74c3c 80%,transparent 100%);border-radius:2px;position:relative;opacity:.7}.indicator-separator[_ngcontent-%COMP%]:before{content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:12px;height:12px;background:#fff;border:2px solid #3498db;border-radius:50%;box-shadow:0 2px 4px #0000001a}.separator-with-text[_ngcontent-%COMP%]{position:relative;text-align:center;margin:1.5rem 0}.separator-with-text[_ngcontent-%COMP%]:before{content:"";position:absolute;top:50%;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#dee2e6,transparent)}.separator-with-text[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{background:#fff;padding:0 1rem;color:#6c757d;font-size:.8rem;font-weight:500}@media (max-width: 992px){.separator-container[_ngcontent-%COMP%]{margin:.5rem 0}.indicator-separator[_ngcontent-%COMP%]{width:60%;height:1px}.indicator-separator[_ngcontent-%COMP%]:before{width:8px;height:8px}}@media (max-width: 768px){.indicator-card-simple[_ngcontent-%COMP%]{padding:1rem;margin-bottom:1.5rem}.indicator-value[_ngcontent-%COMP%]{font-size:2rem!important}.indicator-header[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%]{font-size:.9rem}.indicator-header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{font-size:.7rem}.separator-container[_ngcontent-%COMP%]{display:none}}.dotted-separator[_ngcontent-%COMP%]{width:100%;height:1px;background:repeating-linear-gradient(90deg,#3498db 0px,#3498db 4px,transparent 4px,transparent 8px)}.shadow-separator[_ngcontent-%COMP%]{width:80%;height:1px;background:#e9ecef;box-shadow:0 1px 3px #0000001a;border-radius:1px}.seuils-card-large[_ngcontent-%COMP%]{max-width:1200px;margin:0 auto}.seuils-content[_ngcontent-%COMP%]{padding:2rem}.seuils-section[_ngcontent-%COMP%], .evaluation-section[_ngcontent-%COMP%]{height:100%;display:flex;flex-direction:column}.seuils-list[_ngcontent-%COMP%]{flex:1;border-left:4px solid #27ae60}.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{transition:all .3s ease}.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover{transform:translate(5px);box-shadow:0 4px 8px #0000001a}.evaluation-box[_ngcontent-%COMP%]{flex:1;display:flex;flex-direction:column;justify-content:center;min-height:350px}.evaluation-main[_ngcontent-%COMP%]{text-align:center}.progress-section[_ngcontent-%COMP%]{margin:1.5rem 0}.progress-excellent[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%]{background:linear-gradient(90deg,#27ae60,#2ecc71)}.progress-bon[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%]{background:linear-gradient(90deg,#3498db,#5dade2)}.progress-acceptable[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%]{background:linear-gradient(90deg,#f39c12,#e67e22)}.progress-risque[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%]{background:linear-gradient(90deg,#e74c3c,#ec7063)}.status-indicator[_ngcontent-%COMP%]{margin-top:1rem}.recapitulatif-centre[_ngcontent-%COMP%]{border:2px dashed #dee2e6;background:linear-gradient(135deg,#f8f9fa,#e9ecef)}.metric-item[_ngcontent-%COMP%]{text-align:center;padding:.5rem}.metric-separator[_ngcontent-%COMP%]{font-size:1.5rem;color:#dee2e6;font-weight:700}@media (max-width: 992px){.seuils-content[_ngcontent-%COMP%]{padding:1.5rem}.evaluation-box[_ngcontent-%COMP%]{min-height:300px;margin-top:2rem}.text-5xl[_ngcontent-%COMP%]{font-size:3rem!important}}@media (max-width: 768px){.seuils-content[_ngcontent-%COMP%]{padding:1rem}.text-2xl[_ngcontent-%COMP%]{font-size:1.5rem!important}.text-5xl[_ngcontent-%COMP%]{font-size:2.5rem!important}.evaluation-box[_ngcontent-%COMP%]{min-height:250px;padding:1rem!important}.metric-item[_ngcontent-%COMP%]{margin:.5rem 0}.metric-separator[_ngcontent-%COMP%]{display:none}.flex-wrap[_ngcontent-%COMP%]   .metric-item[_ngcontent-%COMP%]{flex:1;min-width:80px}}.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], .evaluation-box[_ngcontent-%COMP%], .metric-item[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_fadeInUp .6s ease forwards}.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(1){animation-delay:.1s}.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(2){animation-delay:.2s}.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(3){animation-delay:.3s}.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(4){animation-delay:.4s}.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(5){animation-delay:.5s}.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(6){animation-delay:.6s}@keyframes _ngcontent-%COMP%_fadeInUp{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.loading-admin[_ngcontent-%COMP%]{border-left:4px solid var(--blue-500);transition:all .3s ease}.loading-admin[_ngcontent-%COMP%]:hover{background:var(--blue-100)!important}.stat-card[_ngcontent-%COMP%]{transition:all .3s ease;border:1px solid transparent;cursor:pointer}.stat-card[_ngcontent-%COMP%]:hover{transform:translateY(-4px);box-shadow:0 6px 20px #0000001a;border-color:var(--primary-color)}.stat-card[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{transition:all .3s ease}.stat-card[_ngcontent-%COMP%]:hover   i[_ngcontent-%COMP%]{transform:scale(1.1)}.stat-card[_ngcontent-%COMP%]   .info-badge[_ngcontent-%COMP%]{z-index:10}.stat-card[_ngcontent-%COMP%]   .info-badge[_ngcontent-%COMP%]   .pi-info-circle[_ngcontent-%COMP%]{transition:all .2s ease}.stat-card[_ngcontent-%COMP%]   .info-badge[_ngcontent-%COMP%]   .pi-info-circle[_ngcontent-%COMP%]:hover{transform:scale(1.2);color:var(--primary-color)!important}.details-card[_ngcontent-%COMP%]{border-left:3px solid transparent;transition:all .3s ease}.details-card[_ngcontent-%COMP%]:hover{border-left-color:var(--primary-color);transform:translate(4px);box-shadow:0 4px 12px #0000001a}.details-card[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]{padding:.25rem 0;border-bottom:1px solid rgba(0,0,0,.05)}.details-card[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]:last-child{border-bottom:none}.details-card[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:var(--text-color-secondary);font-size:.875rem}  .p-accordion .p-accordion-header{background:var(--surface-100);border:1px solid var(--surface-border);border-radius:6px;margin-bottom:.5rem}  .p-accordion .p-accordion-header:hover{background:var(--surface-200)}  .p-accordion .p-accordion-header .p-accordion-header-link{padding:.75rem 1rem;font-weight:600;color:var(--text-color)}  .p-accordion .p-accordion-header .p-accordion-header-link:focus{box-shadow:0 0 0 2px var(--primary-color-alpha)}  .p-accordion .p-accordion-content{border:none;background:transparent;padding:1rem 0}.status-badge.available[_ngcontent-%COMP%]{background:linear-gradient(45deg,var(--green-100),var(--green-200));border:1px solid var(--green-300);color:var(--green-800)}.status-badge.loading[_ngcontent-%COMP%]{background:linear-gradient(45deg,var(--blue-100),var(--blue-200));border:1px solid var(--blue-300);color:var(--blue-800)}.status-badge.unavailable[_ngcontent-%COMP%]{background:linear-gradient(45deg,var(--orange-100),var(--orange-200));border:1px solid var(--orange-300);color:var(--orange-800)}.loading-shimmer[_ngcontent-%COMP%]{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0,#f0f0f0 75%);background-size:200% 100%;animation:_ngcontent-%COMP%_shimmer 1.5s infinite}@keyframes _ngcontent-%COMP%_shimmer{0%{background-position:-200% 0}to{background-position:200% 0}}  .p-tooltip .p-tooltip-text{background:var(--surface-900);color:var(--surface-0);padding:.5rem .75rem;border-radius:6px;font-size:.875rem;max-width:250px;box-shadow:0 4px 12px #00000026}  .p-tooltip .p-tooltip-arrow{border-top-color:var(--surface-900)}.data-complete-indicator[_ngcontent-%COMP%]{position:relative}.data-complete-indicator[_ngcontent-%COMP%]:after{content:"\\2713";position:absolute;top:-5px;right:-5px;background:var(--green-500);color:#fff;border-radius:50%;width:16px;height:16px;font-size:10px;display:flex;align-items:center;justify-content:center;font-weight:700}.section-with-loading[_ngcontent-%COMP%]{position:relative}.section-with-loading.loading[_ngcontent-%COMP%]{opacity:.7;pointer-events:none}.section-with-loading.loading[_ngcontent-%COMP%]:before{content:"";position:absolute;inset:0;background:#fffc;z-index:10;display:flex;align-items:center;justify-content:center}.data-missing-alert[_ngcontent-%COMP%]{background:linear-gradient(45deg,var(--yellow-50),var(--yellow-100));border-left:4px solid var(--yellow-500);padding:.75rem;border-radius:6px;margin:.5rem 0}.data-missing-alert[_ngcontent-%COMP%]   .alert-icon[_ngcontent-%COMP%]{color:var(--yellow-600);margin-right:.5rem}.data-missing-alert[_ngcontent-%COMP%]   .alert-text[_ngcontent-%COMP%]{color:var(--yellow-800);font-size:.875rem}.reload-button[_ngcontent-%COMP%]:hover{transform:rotate(180deg);transition:transform .3s ease}.hierarchy-display[_ngcontent-%COMP%]{background:linear-gradient(135deg,var(--blue-50),var(--blue-100));border:1px solid var(--blue-200);border-radius:8px;padding:.75rem;position:relative;overflow:hidden}.hierarchy-display[_ngcontent-%COMP%]:before{content:"";position:absolute;top:0;left:0;width:4px;height:100%;background:linear-gradient(180deg,var(--blue-400),var(--blue-600))}.hierarchy-display[_ngcontent-%COMP%]   .hierarchy-text[_ngcontent-%COMP%]{margin-left:.5rem;font-weight:500;color:var(--blue-800)}  .p-skeleton.custom-skeleton{background:linear-gradient(90deg,var(--surface-200) 25%,var(--surface-100) 50%,var(--surface-200) 75%);background-size:200% 100%;animation:_ngcontent-%COMP%_skeleton-loading 1.5s infinite}@keyframes _ngcontent-%COMP%_skeleton-loading{0%{background-position:-200% 0}to{background-position:200% 0}}@media (max-width: 768px){.stat-card[_ngcontent-%COMP%]{margin-bottom:1rem}.stat-card[_ngcontent-%COMP%]:hover{transform:none}.details-card[_ngcontent-%COMP%]{margin-bottom:1rem}.details-card[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]{padding:.5rem 0}.details-card[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{display:block;margin-bottom:.25rem}.hierarchy-display[_ngcontent-%COMP%]{margin-bottom:1rem}.hierarchy-display[_ngcontent-%COMP%]   .hierarchy-text[_ngcontent-%COMP%]{font-size:.875rem;line-height:1.4}}@media (max-width: 576px){.info-badge[_ngcontent-%COMP%]{display:none}  .p-accordion .p-accordion-header .p-accordion-header-link{padding:.5rem;font-size:.875rem}.details-card[_ngcontent-%COMP%]{padding:.75rem!important}}.fade-in[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_fadeIn .5s ease-in}@keyframes _ngcontent-%COMP%_fadeIn{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.success-indicator[_ngcontent-%COMP%]{color:var(--green-600);animation:_ngcontent-%COMP%_successPulse .5s ease-in}.error-indicator[_ngcontent-%COMP%]{color:var(--red-600);animation:_ngcontent-%COMP%_errorShake .5s ease-in}@keyframes _ngcontent-%COMP%_successPulse{0%{transform:scale(1)}50%{transform:scale(1.1)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_errorShake{0%,to{transform:translate(0)}25%{transform:translate(-5px)}75%{transform:translate(5px)}}.duration-visualization-card[_ngcontent-%COMP%]{overflow:hidden}.duration-visualization-card[_ngcontent-%COMP%]     .p-card-header{background:linear-gradient(135deg,var(--surface-ground) 0%,var(--surface-100) 100%);border-bottom:1px solid var(--surface-border)}.duration-stat-card[_ngcontent-%COMP%]{transition:all .3s ease}.duration-stat-card[_ngcontent-%COMP%]:hover{transform:translateY(-4px);box-shadow:0 8px 25px #00000026}.bg-gradient-primary[_ngcontent-%COMP%]{background:linear-gradient(135deg,var(--primary-500) 0%,var(--primary-700) 100%)}.bg-gradient-success[_ngcontent-%COMP%]{background:linear-gradient(135deg,var(--green-500) 0%,var(--green-700) 100%)}.bg-gradient-info[_ngcontent-%COMP%]{background:linear-gradient(135deg,var(--blue-500) 0%,var(--blue-700) 100%)}.duration-timeline-section[_ngcontent-%COMP%]{border-left:4px solid var(--primary-color)}.months-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(12,1fr);gap:.25rem}.month-cell[_ngcontent-%COMP%]{border:1px solid transparent;transition:all .2s ease;min-height:50px;display:flex;flex-direction:column;align-items:center;justify-content:center}.month-cell[_ngcontent-%COMP%]:hover{transform:scale(1.05);box-shadow:0 2px 8px #0000001a;z-index:1}.text-xxs[_ngcontent-%COMP%]{font-size:.65rem}.duration-progress-bar[_ngcontent-%COMP%]{height:24px;background:var(--surface-200);border-radius:12px;overflow:hidden;position:relative}.progress-track[_ngcontent-%COMP%]{display:flex;height:100%;width:100%}.progress-segment[_ngcontent-%COMP%]{height:100%;transition:all .3s ease;position:relative;display:flex;align-items:center;justify-content:center}.progress-segment[_ngcontent-%COMP%]:hover{filter:brightness(1.1)}.progress-segment[_ngcontent-%COMP%]:first-child{border-radius:12px 0 0 12px}.progress-segment[_ngcontent-%COMP%]:last-child{border-radius:0 12px 12px 0}.progress-segment[_ngcontent-%COMP%]:only-child{border-radius:12px}.repartition-item[_ngcontent-%COMP%]{transition:all .2s ease}.repartition-item[_ngcontent-%COMP%]:hover{transform:translate(4px);background:var(--surface-100)!important}.repartition-dot[_ngcontent-%COMP%]{flex-shrink:0}.year-section[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_slideInUp .4s ease forwards;opacity:0}.year-section[_ngcontent-%COMP%]:nth-child(1){animation-delay:.1s}.year-section[_ngcontent-%COMP%]:nth-child(2){animation-delay:.2s}.year-section[_ngcontent-%COMP%]:nth-child(3){animation-delay:.3s}.year-section[_ngcontent-%COMP%]:nth-child(4){animation-delay:.4s}.year-section[_ngcontent-%COMP%]:nth-child(5){animation-delay:.5s}@keyframes _ngcontent-%COMP%_slideInUp{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@media (max-width: 992px){.months-grid[_ngcontent-%COMP%]{grid-template-columns:repeat(6,1fr)}.duration-stat-card[_ngcontent-%COMP%]{margin-bottom:1rem}.duration-stat-card[_ngcontent-%COMP%]   .text-4xl[_ngcontent-%COMP%]{font-size:1.75rem!important}.duration-legend-item[_ngcontent-%COMP%]{display:none}}@media (max-width: 768px){.months-grid[_ngcontent-%COMP%]{grid-template-columns:repeat(4,1fr)}.month-cell[_ngcontent-%COMP%]{min-height:40px;padding:.25rem!important}.month-cell[_ngcontent-%COMP%]   .font-bold[_ngcontent-%COMP%]{font-size:.7rem}.month-cell[_ngcontent-%COMP%]   .text-xxs[_ngcontent-%COMP%]{display:none}.duration-stat-card[_ngcontent-%COMP%]{padding:1rem!important}.duration-stat-card[_ngcontent-%COMP%]   .text-4xl[_ngcontent-%COMP%], .duration-stat-card[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:1.5rem!important}.duration-progress-bar[_ngcontent-%COMP%]{height:16px}}@media (max-width: 576px){.months-grid[_ngcontent-%COMP%]{grid-template-columns:repeat(3,1fr)}.year-section[_ngcontent-%COMP%]{padding:.5rem!important}.duration-stat-card[_ngcontent-%COMP%]   .text-4xl[_ngcontent-%COMP%]{font-size:1.25rem!important}}']})};export{Ce as ResumeCreditComponent};
