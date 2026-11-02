/**
 * La synthèse hebdomadaire de direction (V198).
 *
 * Un champ nul signifie « non mesurable cette semaine-là », jamais zéro : c'est la distinction
 * que l'écran doit rendre, comme le courriel.
 */

export interface SemaineSynthese {
    semaineDu: string;
    semaineAu: string;

    demRecu: number | null;
    demInstruction: number | null;
    demAccorde: number | null;
    demRefuse: number | null;
    demAnnule: number | null;
    demNouveauxSemaine: number | null;
    demAccordesSemaine: number | null;
    demAnnulesSemaine: number | null;

    pfDatePhoto: string | null;
    pfCredits: number | null;
    pfEncours: number | null;
    pfNbRetard: number | null;
    pfImpaye: number | null;
    pfContentieux: number | null;

    par30Encours: number | null;
    par30Nb: number | null;
    par60Encours: number | null;
    par60Nb: number | null;
    par90Encours: number | null;
    par90Nb: number | null;
    par120Encours: number | null;
    par120Nb: number | null;

    assEnAttente: number | null;
    assValide: number | null;
    assRejete: number | null;
    assValideSemaine: number | null;
    assRejeteSemaine: number | null;

    arrDateLimite: string | null;
    arrAJour: number | null;
    arrAValider: number | null;
    arrEnRetard: number | null;
    arrJamaisRemonte: number | null;
    arrRetardMoyen: number | null;

    octNb: number | null;
    octMontant: number | null;
    octIndisponible: string | null;

    envoyeAt: string | null;
    nbDestinataires: number | null;
    essai: boolean;
}

export interface DelegationSynthese {
    delegationId: number | null;
    delegation: string;
    demInstruction: number | null;
    demAccordesSemaine: number | null;
    octNb: number | null;
    octMontant: number | null;
    pfCredits: number | null;
    pfEncours: number | null;
    pfImpaye: number | null;
    par30Encours: number | null;
    par90Encours: number | null;
    assEnAttente: number | null;
    assValideSemaine: number | null;
    arrEnRetard: number | null;
    arrJamaisRemonte: number | null;
}

export interface Synthese {
    courante: SemaineSynthese;
    precedente: SemaineSynthese | null;
    delegations: DelegationSynthese[];
    nbDestinataires: number;
}
