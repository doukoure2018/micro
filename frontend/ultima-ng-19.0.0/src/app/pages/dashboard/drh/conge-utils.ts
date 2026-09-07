import { DemandeConge, PermissionSociale } from '@/service/drh.service';

export interface CongeStatutTag {
    label: string;
    severity: 'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast';
}

export const STATUT_CONGE_LABELS: { [k: string]: CongeStatutTag } = {
    SOUMISE: { label: 'Soumise au responsable', severity: 'info' },
    ACCEPTEE_RESP: { label: 'Acceptée — en attente DRH', severity: 'warn' },
    REJETEE_RESP: { label: 'Rejetée par le responsable', severity: 'danger' },
    VALIDEE_DRH: { label: 'Validée — congé accordé', severity: 'success' },
    REJETEE_DRH: { label: 'Renvoyée par la DRH', severity: 'danger' },
    ANNULEE: { label: 'Annulée', severity: 'secondary' },
    INTERROMPUE: { label: 'Interrompue', severity: 'contrast' }
};

export function statutConge(statut: string): CongeStatutTag {
    return STATUT_CONGE_LABELS[statut] || { label: statut, severity: 'secondary' };
}

export const MOTIFS_PERMISSION = [
    { label: 'Naissance', value: 'NAISSANCE' },
    { label: 'Baptême', value: 'BAPTEME' },
    { label: 'Maladie', value: 'MALADIE' },
    { label: 'Mariage', value: 'MARIAGE' },
    { label: 'Décès', value: 'DECES' },
    { label: 'Autre (à préciser)', value: 'AUTRE' }
];

export const LIENS_PARENTE = [
    { label: 'Père', value: 'PERE' },
    { label: 'Mère', value: 'MERE' },
    { label: 'Grand-père', value: 'GD_PERE' },
    { label: 'Grand-mère', value: 'GD_MERE' },
    { label: 'Enfant à charge', value: 'ENFANT_CHARGE' },
    { label: 'Marâtre', value: 'MARATRE' },
    { label: 'Conjoint(e)', value: 'CONJOINT' },
    { label: 'Autre', value: 'AUTRE' }
];

export function libelleMotif(motif?: string): string {
    return MOTIFS_PERMISSION.find((m) => m.value === motif)?.label || motif || '';
}

export function libelleLienParente(lien?: string): string {
    return LIENS_PARENTE.find((l) => l.value === lien)?.label || lien || '';
}

const fmt = (iso?: string) => {
    if (!iso) return '……………………';
    const [a, m, j] = iso.split('-');
    return `${j}/${m}/${a}`;
};

/** Impression du formulaire « Demande de permission sociale » au format papier CRG. */
export function imprimerPermission(p: PermissionSociale): void {
    const w = window.open('', '_blank', 'width=900,height=1000');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<title>Permission sociale — ${p.nomComplet}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #111; max-width: 720px; margin: 2rem auto; line-height: 1.9; }
  .entete { text-align: center; border-bottom: 2px solid #111; padding-bottom: .5rem; margin-bottom: 1.5rem; }
  .entete h2 { margin: 0; }
  h1 { text-align: center; font-size: 1.5rem; letter-spacing: .05em; margin: 1.2rem 0 1.5rem; }
  .champ { margin: .35rem 0; }
  .champ b { display: inline-block; min-width: 220px; }
  .valeur { border-bottom: 1px dotted #555; padding: 0 .5rem; }
  .signatures { display: flex; justify-content: space-between; margin-top: 3rem; gap: 1rem; }
  .signatures div { text-align: center; width: 32%; }
  .signatures .ligne { border-top: 1px solid #111; margin-top: 4rem; padding-top: .3rem; font-size: .9rem; }
  .cachet { margin-top: 2rem; font-size: .85rem; color: #333; text-align: center; }
  @media print { body { margin: 0.5cm auto; } }
</style></head><body>
<div class="entete">
  <h2>CRÉDIT RURAL DE GUINÉE S.A</h2>
</div>
<h1>DEMANDE DE PERMISSION SOCIALE ${p.exercice}</h1>
<div class="champ"><b>NOM, PRÉNOMS :</b> <span class="valeur">${p.nomComplet}</span></div>
<div class="champ"><b>Matricule :</b> <span class="valeur">${p.matricule || '—'}</span></div>
<div class="champ"><b>Direction, Service :</b> <span class="valeur">${p.departementLibelle || p.departementCode}</span></div>
<div class="champ"><b>Sollicite une permission de :</b> <span class="valeur">${p.nbJours} jours</span></div>
<div class="champ"><b>Allant du</b> <span class="valeur">${fmt(p.dateDebut)}</span> <b style="min-width:auto">au</b> <span class="valeur">${fmt(p.dateFin)}</span> inclus</div>
<div class="champ"><b>Motif :</b> <span class="valeur">${libelleMotif(p.motif)}${p.lienParente ? ' — ' + libelleLienParente(p.lienParente) : ''}${p.precisionMotif ? ' (' + p.precisionMotif + ')' : ''}</span></div>
<div class="signatures">
  <div><b>Signature de l'agent</b><div class="ligne">${p.nomComplet}</div></div>
  <div><b>Le Responsable du département</b><div class="ligne">${p.traiteeRespNom || ''}</div></div>
  <div><b>Le chef de service GRH</b><div class="ligne">${p.valideeDrhNom || ''}</div></div>
</div>
<div class="cachet">Document généré par l'application — statut : ${statutConge(p.statut).label}</div>
<script>window.onload = function(){ window.print(); }<\/script>
</body></html>`);
    w.document.close();
}

/** Impression du formulaire « Demande de congé » au format papier CRG. */
export function imprimerDemandeConge(d: DemandeConge, droit: number): void {
    const w = window.open('', '_blank', 'width=900,height=1000');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<title>Demande de congé — ${d.nomComplet}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #111; max-width: 720px; margin: 2rem auto; line-height: 1.9; }
  .entete { text-align: center; border-bottom: 2px solid #111; padding-bottom: .5rem; margin-bottom: 1.5rem; }
  .entete h2 { margin: 0; }
  .entete small { display: block; }
  h1 { text-align: center; font-size: 1.6rem; letter-spacing: .05em; margin: 1.2rem 0 .2rem; }
  .sous-titre { text-align: center; font-style: italic; margin-bottom: 1.5rem; }
  .champ { margin: .35rem 0; }
  .champ b { display: inline-block; min-width: 200px; }
  .valeur { border-bottom: 1px dotted #555; padding: 0 .5rem; }
  .signatures { display: flex; justify-content: space-between; margin-top: 3rem; gap: 1rem; }
  .signatures div { text-align: center; width: 32%; }
  .signatures .ligne { border-top: 1px solid #111; margin-top: 4rem; padding-top: .3rem; font-size: .9rem; }
  .cachet { margin-top: 2rem; font-size: .85rem; color: #333; text-align: center; }
  @media print { body { margin: 0.5cm auto; } }
</style></head><body>
<div class="entete">
  <h2>CRÉDIT RURAL DE GUINÉE S.A</h2>
  <small>Société Anonyme avec Conseil d'Administration — Institution de Microfinance régie par loi L/2005/020/AN</small>
</div>
<h1>DEMANDE DE CONGÉ ${d.exercice}</h1>
<div class="sous-titre">Droit aux congés : ${droit} jours ouvrables</div>
<div class="champ"><b>NOM ET PRÉNOMS :</b> <span class="valeur">${d.nomComplet}</span></div>
<div class="champ"><b>Matricule :</b> <span class="valeur">${d.matricule || '—'}</span></div>
<div class="champ"><b>Direction, Service :</b> <span class="valeur">${d.departementLibelle || d.departementCode}</span></div>
<div class="champ"><b>Sollicite un congé de :</b> <span class="valeur">${d.nbJours} jours</span> au titre de l'année ${d.exercice}</div>
<div class="champ"><b>Allant du</b> <span class="valeur">${fmt(d.dateDebut)}</span> <b style="min-width:auto">au</b> <span class="valeur">${fmt(d.dateFin)}</span> inclus</div>
<div class="champ"><b>Déjà pris :</b> <span class="valeur">${d.dejaPris} jours</span></div>
<div class="champ"><b>Compte prendre :</b> <span class="valeur">${d.nbJours} jours</span></div>
<div class="champ"><b>Solde de tout compte :</b> <span class="valeur">${d.soldeApres} jours</span></div>
<div class="signatures">
  <div><b>Le salarié</b><div class="ligne">${d.nomComplet}</div></div>
  <div><b>Le Responsable du département</b><div class="ligne">${d.traiteeRespNom || ''}</div></div>
  <div><b>Le Chef de service GRH</b><div class="ligne">${d.valideeDrhNom || ''}</div></div>
</div>
<div class="cachet">Document généré par l'application — statut : ${statutConge(d.statut).label}${d.valideeDrhLe ? ' le ' + fmt(d.valideeDrhLe.slice(0, 10)) : ''}</div>
<script>window.onload = function(){ window.print(); }<\/script>
</body></html>`);
    w.document.close();
}
