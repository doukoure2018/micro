import React, { useState, useMemo } from 'react';

// ============================================================================
// MAQUETTE - COLLECTE DES DONNÉES & AMORTISSEMENTS
// Crédit Rural de Guinée - Analyse des Crédits PME
// ============================================================================

const formatGNF = (value) => {
  if (!value && value !== 0) return '';
  return new Intl.NumberFormat('fr-GN', { 
    style: 'decimal',
    maximumFractionDigits: 0 
  }).format(value) + ' GNF';
};

const parseNumber = (value) => {
  if (!value) return 0;
  return parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0;
};

// ============================================================================
// Composants réutilisables
// ============================================================================

const SectionHeader = ({ number, title, icon }) => (
  <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white px-5 py-3 rounded-lg shadow-md mb-4">
    <span className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full font-bold text-lg">
      {number}
    </span>
    <span className="text-lg font-semibold tracking-wide">{title}</span>
    {icon && <span className="ml-auto text-2xl opacity-80">{icon}</span>}
  </div>
);

const QuestionRow = ({ question, children, highlight }) => (
  <div className={`grid grid-cols-12 gap-4 py-3 px-4 items-center border-b border-gray-100 hover:bg-emerald-50/30 transition-colors ${highlight ? 'bg-amber-50' : ''}`}>
    <div className="col-span-6 text-gray-700 text-sm leading-relaxed">{question}</div>
    <div className="col-span-6 flex items-center gap-3">{children}</div>
  </div>
);

const OuiNonSelect = ({ value, onChange, name }) => (
  <div className="flex gap-2">
    {['OUI', 'NON'].map(opt => (
      <button
        key={opt}
        type="button"
        onClick={() => onChange(opt)}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
          value === opt 
            ? 'bg-emerald-600 text-white shadow-md' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const NumberInput = ({ value, onChange, placeholder, suffix, className = '' }) => (
  <div className={`relative ${className}`}>
    <input
      type="text"
      value={value ? formatGNF(value).replace(' GNF', '') : ''}
      onChange={(e) => onChange(parseNumber(e.target.value))}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
    />
    {suffix && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
        {suffix}
      </span>
    )}
  </div>
);

const TextInput = ({ value, onChange, placeholder, className = '' }) => (
  <input
    type="text"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${className}`}
  />
);

const SelectInput = ({ value, onChange, options, placeholder }) => (
  <select
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
  >
    <option value="">{placeholder}</option>
    {options.map(opt => (
      <option key={opt.value || opt} value={opt.value || opt}>
        {opt.label || opt}
      </option>
    ))}
  </select>
);

const DateInput = ({ value, onChange }) => (
  <input
    type="date"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
  />
);

const SubQuestionValue = ({ label, value, onChange }) => (
  <div className="flex items-center gap-3 pl-8 py-2 bg-gray-50 rounded-lg">
    <span className="text-gray-600 text-sm">{label}</span>
    <NumberInput value={value} onChange={onChange} className="w-48" />
  </div>
);

// ============================================================================
// Composant Tableau Dynamique
// ============================================================================

const DynamicTable = ({ columns, data, onDataChange, addRowText, maxRows = 15 }) => {
  const addRow = () => {
    if (data.length < maxRows) {
      onDataChange([...data, columns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), {})]);
    }
  };

  const updateRow = (index, key, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [key]: value };
    onDataChange(newData);
  };

  const removeRow = (index) => {
    onDataChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-gray-600 font-medium w-8">#</th>
            {columns.map(col => (
              <th key={col.key} className={`px-3 py-2 text-${col.align || 'left'} text-gray-600 font-medium`}>
                {col.label}
              </th>
            ))}
            <th className="px-3 py-2 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-t border-gray-100 hover:bg-emerald-50/20">
              <td className="px-3 py-2 text-gray-400">{index + 1}</td>
              {columns.map(col => (
                <td key={col.key} className="px-2 py-1.5">
                  {col.type === 'number' ? (
                    <input
                      type="text"
                      value={row[col.key] ? parseFloat(row[col.key]).toLocaleString('fr-FR') : ''}
                      onChange={(e) => updateRow(index, col.key, parseNumber(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-right font-mono text-sm focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : col.type === 'select' ? (
                    <select
                      value={row[col.key] || ''}
                      onChange={(e) => updateRow(index, col.key, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">--</option>
                      {col.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : col.type === 'date' ? (
                    <input
                      type="date"
                      value={row[col.key] || ''}
                      onChange={(e) => updateRow(index, col.key, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : col.computed ? (
                    <span className="px-2 py-1 bg-emerald-50 rounded text-emerald-700 font-mono text-right block">
                      {formatGNF(col.computed(row))}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={row[col.key] || ''}
                      onChange={(e) => updateRow(index, col.key, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-emerald-500"
                    />
                  )}
                </td>
              ))}
              <td className="px-2 py-1.5">
                <button
                  onClick={() => removeRow(index)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50">
            <td colSpan={columns.length + 2} className="px-3 py-2">
              <button
                onClick={addRow}
                disabled={data.length >= maxRows}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
              >
                <span className="text-lg">+</span> {addRowText}
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

// ============================================================================
// Composant Matrice Cycles
// ============================================================================

const CycleMatrix = ({ data, onChange, type }) => {
  const months = ['Janv', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const levels = ['Fort', 'Moyen', 'Faible'];
  const items = type === 'month' ? months : days;

  const handleClick = (item, level) => {
    const newData = { ...data };
    // Retirer l'item de tous les niveaux
    levels.forEach(l => {
      if (newData[l]) {
        newData[l] = newData[l].filter(i => i !== item);
      }
    });
    // Ajouter au nouveau niveau
    if (!newData[level]) newData[level] = [];
    newData[level].push(item);
    onChange(newData);
  };

  const getLevel = (item) => {
    for (const level of levels) {
      if (data[level]?.includes(item)) return level;
    }
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-emerald-50">
            <th className="px-2 py-2 border border-gray-200 text-left text-gray-600 w-20">Cycle</th>
            {items.map(item => (
              <th key={item} className="px-2 py-2 border border-gray-200 text-center text-gray-600 font-medium">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {levels.map((level, levelIdx) => (
            <tr key={level} className={levelIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className={`px-2 py-2 border border-gray-200 font-medium ${
                level === 'Fort' ? 'text-emerald-600' : level === 'Faible' ? 'text-orange-600' : 'text-blue-600'
              }`}>
                {level}
              </td>
              {items.map(item => {
                const isSelected = getLevel(item) === level;
                return (
                  <td key={item} className="px-1 py-1 border border-gray-200 text-center">
                    <button
                      onClick={() => handleClick(item, level)}
                      className={`w-8 h-8 rounded-md transition-all ${
                        isSelected 
                          ? level === 'Fort' 
                            ? 'bg-emerald-500 text-white shadow-md' 
                            : level === 'Faible' 
                              ? 'bg-orange-500 text-white shadow-md'
                              : 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// Onglet COLLECTE DES DONNÉES
// ============================================================================

const CollecteDonnees = ({ data, onChange }) => {
  const updateField = (section, field, value) => {
    onChange({
      ...data,
      [section]: {
        ...data[section],
        [field]: value
      }
    });
  };

  // Calculs automatiques
  const calculatedValues = useMemo(() => {
    const produits = data.margeBrute?.produits || [];
    const totalVentes = produits.reduce((sum, p) => sum + (p.prixVente * p.quantite || 0), 0);
    const totalCouts = produits.reduce((sum, p) => sum + (p.coutAchat * p.quantite || 0), 0);
    const tauxMarge = totalVentes > 0 ? (totalVentes - totalCouts) / totalVentes : 0;

    const stocks = data.actifs?.stockArticles || [];
    const totalStock = stocks.reduce((sum, s) => sum + (s.quantite * s.coutUnitaire || 0), 0);

    return { totalVentes, totalCouts, tauxMarge, totalStock };
  }, [data.margeBrute?.produits, data.actifs?.stockArticles]);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Collecte des Données</h1>
            <p className="text-emerald-100 text-sm mt-1">Grille d'évaluation de l'emprunteur PME</p>
          </div>
          <div className="text-right">
            <div className="text-emerald-100 text-xs uppercase tracking-wider">Crédit Rural de Guinée</div>
            <div className="text-3xl font-bold">CRG</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 bg-white/10 rounded-lg p-4">
          <div>
            <label className="text-emerald-100 text-xs block mb-1">Date d'évaluation</label>
            <DateInput 
              value={data.header?.dateEvaluation} 
              onChange={(v) => updateField('header', 'dateEvaluation', v)} 
            />
          </div>
          <div>
            <label className="text-emerald-100 text-xs block mb-1">Nom du membre</label>
            <TextInput 
              value={data.header?.nomMembre} 
              onChange={(v) => updateField('header', 'nomMembre', v)}
              placeholder="Nom et prénom"
              className="bg-white/90"
            />
          </div>
          <div>
            <label className="text-emerald-100 text-xs block mb-1">N° membre</label>
            <TextInput 
              value={data.header?.numeroMembre} 
              onChange={(v) => updateField('header', 'numeroMembre', v)}
              placeholder="Numéro"
              className="bg-white/90"
            />
          </div>
        </div>
      </div>

      {/* Section 1: Activité */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <SectionHeader number="1" title="Activité" icon="🏪" />
        <div className="space-y-3">
          <QuestionRow question="Quelle est votre activité ?">
            <TextInput 
              value={data.activite?.description}
              onChange={(v) => updateField('activite', 'description', v)}
              placeholder="Description de l'activité"
              className="flex-1"
            />
          </QuestionRow>
          <QuestionRow question="Secteur d'activité">
            <SelectInput
              value={data.activite?.secteur}
              onChange={(v) => updateField('activite', 'secteur', v)}
              options={['AGRICULTURE', 'COMMERCE', 'ARTISANAT', 'SERVICE', 'INDUSTRIE', 'Autre']}
              placeholder="Sélectionner..."
            />
          </QuestionRow>
          <QuestionRow question="Sous-secteur d'activité">
            <SelectInput
              value={data.activite?.sousSecteur}
              onChange={(v) => updateField('activite', 'sousSecteur', v)}
              options={['Habillement', 'Restauration', 'Alimentation', 'Cosmétique', 'Mercerie', 'Vaisselle-Émaux', 'Autre']}
              placeholder="Sélectionner..."
            />
          </QuestionRow>
        </div>
      </div>

      {/* Section 2: Conditions de crédit */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <SectionHeader number="2" title="Conditions de crédit sollicité" icon="💰" />
        <div className="space-y-3">
          <QuestionRow question="Objet du crédit" highlight>
            <SelectInput
              value={data.credit?.objetCredit}
              onChange={(v) => updateField('credit', 'objetCredit', v)}
              options={['Fonds de roulement', 'Investissement', 'Invest+Fond de Roulement', 'Bon de Commande']}
              placeholder="Sélectionner..."
            />
          </QuestionRow>
          <QuestionRow question="Montant sollicité" highlight>
            <NumberInput 
              value={data.credit?.montantSollicite}
              onChange={(v) => updateField('credit', 'montantSollicite', v)}
              className="w-48"
            />
            <span className="text-gray-500 text-sm">GNF</span>
          </QuestionRow>
          <QuestionRow question="Durée de crédit sollicité">
            <NumberInput 
              value={data.credit?.dureeSollicitee}
              onChange={(v) => updateField('credit', 'dureeSollicitee', v)}
              className="w-24"
            />
            <span className="text-gray-500 text-sm">mois</span>
          </QuestionRow>
          <QuestionRow question="Périodicité de remboursement">
            <SelectInput
              value={data.credit?.periodicite}
              onChange={(v) => updateField('credit', 'periodicite', v)}
              options={['Mensuelle', 'Bimestrielle', 'Trimestrielle', 'Quadrimestrielle', 'Semestrielle', 'Annuelle']}
              placeholder="Sélectionner..."
            />
          </QuestionRow>
          <QuestionRow question="Période de différé">
            <NumberInput 
              value={data.credit?.periodeDiffere}
              onChange={(v) => updateField('credit', 'periodeDiffere', v)}
              className="w-24"
            />
            <span className="text-gray-500 text-sm">mois</span>
          </QuestionRow>
          <QuestionRow question="Nombre d'échéances">
            <NumberInput 
              value={data.credit?.nombreEcheances}
              onChange={(v) => updateField('credit', 'nombreEcheances', v)}
              className="w-24"
            />
          </QuestionRow>
          <QuestionRow question="Échéance correspondante" highlight>
            <NumberInput 
              value={data.credit?.echeance}
              onChange={(v) => updateField('credit', 'echeance', v)}
              className="w-48"
            />
            <span className="text-gray-500 text-sm">GNF</span>
          </QuestionRow>
          <QuestionRow question="Valeur de la garantie proposée" highlight>
            <NumberInput 
              value={data.credit?.valeurGarantie}
              onChange={(v) => updateField('credit', 'valeurGarantie', v)}
              className="w-48"
            />
            <span className="text-gray-500 text-sm">GNF</span>
          </QuestionRow>
          <QuestionRow question="Capacité de remboursement périodique déclarée" highlight>
            <NumberInput 
              value={data.credit?.capaciteRemboursement}
              onChange={(v) => updateField('credit', 'capaciteRemboursement', v)}
              className="w-48"
            />
            <span className="text-gray-500 text-sm">GNF</span>
          </QuestionRow>
        </div>
      </div>

      {/* Section 3: Chiffre d'affaires */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <SectionHeader number="3" title="Quel Chiffre d'Affaires?" icon="📊" />
        
        {/* Estimation initiale */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="text-gray-700 font-medium mb-3">Estimation initiale du Chiffre d'affaires</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">CA hebdomadaire</label>
              <NumberInput 
                value={data.chiffreAffaires?.caHebdo}
                onChange={(v) => updateField('chiffreAffaires', 'caHebdo', v)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">CA mensuel</label>
              <NumberInput 
                value={data.chiffreAffaires?.caMensuel}
                onChange={(v) => updateField('chiffreAffaires', 'caMensuel', v)}
              />
            </div>
          </div>
        </div>

        {/* Cycle mensuel */}
        <div className="mb-4">
          <h4 className="text-gray-700 font-medium mb-3">Cycle d'affaires mensuel</h4>
          <CycleMatrix 
            type="month"
            data={data.chiffreAffaires?.cycleMensuel || {}}
            onChange={(v) => updateField('chiffreAffaires', 'cycleMensuel', v)}
          />
        </div>

        {/* Cycle hebdomadaire */}
        <div className="mb-4">
          <h4 className="text-gray-700 font-medium mb-3">Structure du CA Hebdomadaire</h4>
          <CycleMatrix 
            type="week"
            data={data.chiffreAffaires?.cycleHebdo || {}}
            onChange={(v) => updateField('chiffreAffaires', 'cycleHebdo', v)}
          />
        </div>

        {/* Résumé CA calculé */}
        <div className="bg-emerald-50 rounded-lg p-4 flex justify-between items-center">
          <span className="text-emerald-700 font-medium">CA mensuel calculé</span>
          <span className="text-2xl font-bold text-emerald-700">
            {formatGNF(calculatedValues.totalVentes || data.chiffreAffaires?.caMensuel || 0)}
          </span>
        </div>
      </div>

      {/* Section 4: Marge brute */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <SectionHeader number="4" title="Structure de la marge brute" icon="📈" />
        
        <div className="space-y-4">
          <QuestionRow question="Connaissez-vous votre pourcentage de marge brute ?">
            <OuiNonSelect 
              value={data.margeBrute?.connaitMarge}
              onChange={(v) => updateField('margeBrute', 'connaitMarge', v)}
            />
            {data.margeBrute?.connaitMarge === 'OUI' && (
              <NumberInput 
                value={data.margeBrute?.tauxDeclare}
                onChange={(v) => updateField('margeBrute', 'tauxDeclare', v)}
                placeholder="%"
                className="w-24"
              />
            )}
          </QuestionRow>

          <QuestionRow question="Procédez au calcul du taux marge brute ?">
            <OuiNonSelect 
              value={data.margeBrute?.calculerMarge}
              onChange={(v) => updateField('margeBrute', 'calculerMarge', v)}
            />
          </QuestionRow>

          {data.margeBrute?.calculerMarge === 'OUI' && (
            <>
              <QuestionRow question="Quelle est la fréquence des ventes ?">
                <SelectInput
                  value={data.margeBrute?.frequenceVentes}
                  onChange={(v) => updateField('margeBrute', 'frequenceVentes', v)}
                  options={['Journalière', 'Hebdomadaire', 'Mensuelle']}
                  placeholder="Sélectionner..."
                />
              </QuestionRow>

              <div className="mt-4">
                <h4 className="text-gray-700 font-medium mb-3">Produits ou Articles</h4>
                <DynamicTable
                  columns={[
                    { key: 'nom', label: 'Produit', type: 'text' },
                    { key: 'prixVente', label: 'Prix de vente (GNF)', type: 'number', align: 'right' },
                    { key: 'coutAchat', label: 'Coût d\'achat (GNF)', type: 'number', align: 'right' },
                    { key: 'quantite', label: 'Quantité', type: 'number', align: 'right' },
                    { key: 'ca', label: 'CA (GNF)', computed: (row) => (row.prixVente || 0) * (row.quantite || 0), align: 'right' },
                    { key: 'cout', label: 'Coût total', computed: (row) => (row.coutAchat || 0) * (row.quantite || 0), align: 'right' },
                  ]}
                  data={data.margeBrute?.produits || []}
                  onDataChange={(v) => updateField('margeBrute', 'produits', v)}
                  addRowText="Ajouter un produit"
                  maxRows={15}
                />
              </div>

              {/* Totaux marge */}
              <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Total Ventes</div>
                  <div className="text-xl font-bold text-gray-800">{formatGNF(calculatedValues.totalVentes)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Total Coûts</div>
                  <div className="text-xl font-bold text-gray-800">{formatGNF(calculatedValues.totalCouts)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Taux de Marge</div>
                  <div className="text-xl font-bold text-emerald-600">{(calculatedValues.tauxMarge * 100).toFixed(2)}%</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section 5: Actifs */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <SectionHeader number="5" title="Évaluation des actifs nets de l'entreprise" icon="🏢" />
        
        <div className="space-y-4">
          {/* a) Terrains */}
          <QuestionRow question="a) Existe-t-il des terrains utilisés pour l'activité ?">
            <OuiNonSelect 
              value={data.actifs?.terrains?.existe}
              onChange={(v) => updateField('actifs', 'terrains', { ...data.actifs?.terrains, existe: v })}
            />
          </QuestionRow>
          {data.actifs?.terrains?.existe === 'OUI' && (
            <SubQuestionValue 
              label="Valeur estimée"
              value={data.actifs?.terrains?.valeur}
              onChange={(v) => updateField('actifs', 'terrains', { ...data.actifs?.terrains, valeur: v })}
            />
          )}

          {/* b) Bâtiments */}
          <QuestionRow question="b) Existe-t-il des bâtiments et magasin dédiés à l'activité ?">
            <OuiNonSelect 
              value={data.actifs?.batiments?.existe}
              onChange={(v) => updateField('actifs', 'batiments', { ...data.actifs?.batiments, existe: v })}
            />
            {data.actifs?.batiments?.existe === 'OUI' && (
              <>
                <span className="text-gray-500 text-sm">Est-ce votre propriété ?</span>
                <OuiNonSelect 
                  value={data.actifs?.batiments?.propriete}
                  onChange={(v) => updateField('actifs', 'batiments', { ...data.actifs?.batiments, propriete: v })}
                />
              </>
            )}
          </QuestionRow>
          {data.actifs?.batiments?.existe === 'OUI' && data.actifs?.batiments?.propriete === 'OUI' && (
            <div className="pl-8 py-2 bg-blue-50 rounded-lg text-blue-700 text-sm flex items-center gap-2">
              <span>📝</span> Référez-vous à la feuille Amorts pour les détails
            </div>
          )}

          {/* c) Installations */}
          <QuestionRow question="c) Existe-t-il des installations dédiées à l'activité ?">
            <OuiNonSelect 
              value={data.actifs?.installations?.existe}
              onChange={(v) => updateField('actifs', 'installations', { ...data.actifs?.installations, existe: v })}
            />
          </QuestionRow>

          {/* d) Matériels roulants */}
          <QuestionRow question="d) Existe-t-il des matériels roulants dédiés à l'activité ?">
            <OuiNonSelect 
              value={data.actifs?.materielsRoulants?.existe}
              onChange={(v) => updateField('actifs', 'materielsRoulants', { ...data.actifs?.materielsRoulants, existe: v })}
            />
            {data.actifs?.materielsRoulants?.existe === 'OUI' && (
              <>
                <span className="text-gray-500 text-sm">Est-ce votre propriété ?</span>
                <OuiNonSelect 
                  value={data.actifs?.materielsRoulants?.propriete}
                  onChange={(v) => updateField('actifs', 'materielsRoulants', { ...data.actifs?.materielsRoulants, propriete: v })}
                />
              </>
            )}
          </QuestionRow>

          {/* e) Mobiliers */}
          <QuestionRow question="e) Existe-t-il des mobiliers et matériels de bureau ?">
            <OuiNonSelect 
              value={data.actifs?.mobiliers?.existe}
              onChange={(v) => updateField('actifs', 'mobiliers', { ...data.actifs?.mobiliers, existe: v })}
            />
          </QuestionRow>

          {/* f) Machines */}
          <QuestionRow question="f) Existent-ils des machines et équipements de production ?">
            <OuiNonSelect 
              value={data.actifs?.machines?.existe}
              onChange={(v) => updateField('actifs', 'machines', { ...data.actifs?.machines, existe: v })}
            />
          </QuestionRow>

          {/* g) Caution financière */}
          <QuestionRow question="g) Caution financière/dépôt financier effectué ?">
            <OuiNonSelect 
              value={data.actifs?.cautionFinanciere?.existe}
              onChange={(v) => updateField('actifs', 'cautionFinanciere', { ...data.actifs?.cautionFinanciere, existe: v })}
            />
          </QuestionRow>
          {data.actifs?.cautionFinanciere?.existe === 'OUI' && (
            <SubQuestionValue 
              label="Évalué à"
              value={data.actifs?.cautionFinanciere?.valeur}
              onChange={(v) => updateField('actifs', 'cautionFinanciere', { ...data.actifs?.cautionFinanciere, valeur: v })}
            />
          )}

          {/* h) Prêts employés */}
          <QuestionRow question="h) Avez-vous fait des prêts à vos employés ?">
            <OuiNonSelect 
              value={data.actifs?.pretsEmployes?.existe}
              onChange={(v) => updateField('actifs', 'pretsEmployes', { ...data.actifs?.pretsEmployes, existe: v })}
            />
          </QuestionRow>
          {data.actifs?.pretsEmployes?.existe === 'OUI' && (
            <SubQuestionValue 
              label="Évalué à"
              value={data.actifs?.pretsEmployes?.valeur}
              onChange={(v) => updateField('actifs', 'pretsEmployes', { ...data.actifs?.pretsEmployes, valeur: v })}
            />
          )}

          {/* i) Stock */}
          <QuestionRow question="i) Avez-vous un stock de marchandises à vendre ?">
            <OuiNonSelect 
              value={data.actifs?.stock?.existe}
              onChange={(v) => updateField('actifs', 'stock', { ...data.actifs?.stock, existe: v })}
            />
            {data.actifs?.stock?.existe === 'OUI' && (
              <>
                <span className="text-gray-500 text-sm">Avez-vous une idée de sa valeur ?</span>
                <OuiNonSelect 
                  value={data.actifs?.stock?.connaitValeur}
                  onChange={(v) => updateField('actifs', 'stock', { ...data.actifs?.stock, connaitValeur: v })}
                />
              </>
            )}
          </QuestionRow>
          {data.actifs?.stock?.existe === 'OUI' && data.actifs?.stock?.connaitValeur === 'OUI' && (
            <SubQuestionValue 
              label="Valeur estimée"
              value={data.actifs?.stock?.valeurEstimee}
              onChange={(v) => updateField('actifs', 'stock', { ...data.actifs?.stock, valeurEstimee: v })}
            />
          )}

          {/* Évaluation détaillée du stock */}
          {data.actifs?.stock?.existe === 'OUI' && (
            <>
              <QuestionRow question="Faire l'évaluation du stock disponible ?">
                <OuiNonSelect 
                  value={data.actifs?.stock?.evaluerDetail}
                  onChange={(v) => updateField('actifs', 'stock', { ...data.actifs?.stock, evaluerDetail: v })}
                />
              </QuestionRow>

              {data.actifs?.stock?.evaluerDetail === 'OUI' && (
                <div className="mt-4">
                  <h4 className="text-gray-700 font-medium mb-3">Évaluation du stock disponible</h4>
                  <DynamicTable
                    columns={[
                      { key: 'nom', label: 'Produit/Article', type: 'text' },
                      { key: 'quantite', label: 'Quantité', type: 'number', align: 'right' },
                      { key: 'coutUnitaire', label: 'Coût d\'achat', type: 'number', align: 'right' },
                      { key: 'valeur', label: 'Valeur Stock', computed: (row) => (row.quantite || 0) * (row.coutUnitaire || 0), align: 'right' },
                    ]}
                    data={data.actifs?.stockArticles || []}
                    onDataChange={(v) => updateField('actifs', 'stockArticles', v)}
                    addRowText="Ajouter un article"
                    maxRows={15}
                  />
                  <div className="mt-3 p-3 bg-emerald-50 rounded-lg flex justify-between items-center">
                    <span className="font-medium text-emerald-700">TOTAL Stock</span>
                    <span className="text-xl font-bold text-emerald-700">{formatGNF(calculatedValues.totalStock)}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* j) Crédit fournisseur */}
          <QuestionRow question="j) Obtenez-vous des crédits fournisseurs ?">
            <OuiNonSelect 
              value={data.actifs?.creditFournisseur?.existe}
              onChange={(v) => updateField('actifs', 'creditFournisseur', { ...data.actifs?.creditFournisseur, existe: v })}
            />
          </QuestionRow>
          {data.actifs?.creditFournisseur?.existe === 'OUI' && (
            <SubQuestionValue 
              label="Évalué à"
              value={data.actifs?.creditFournisseur?.valeur}
              onChange={(v) => updateField('actifs', 'creditFournisseur', { ...data.actifs?.creditFournisseur, valeur: v })}
            />
          )}

          {/* k) Créances clients */}
          <QuestionRow question="k) Avez-vous des clients qui vous doivent de l'argent ?">
            <OuiNonSelect 
              value={data.actifs?.creancesClients?.existe}
              onChange={(v) => updateField('actifs', 'creancesClients', { ...data.actifs?.creancesClients, existe: v })}
            />
          </QuestionRow>
          {data.actifs?.creancesClients?.existe === 'OUI' && (
            <div className="pl-8 space-y-2">
              <div className="flex items-center gap-3 py-2 bg-gray-50 rounded-lg px-4">
                <span className="text-gray-600 text-sm">Créances &gt; 3 mois</span>
                <NumberInput 
                  value={data.actifs?.creancesClients?.plus3Mois}
                  onChange={(v) => updateField('actifs', 'creancesClients', { ...data.actifs?.creancesClients, plus3Mois: v })}
                  className="w-40"
                />
              </div>
              <div className="flex items-center gap-3 py-2 bg-gray-50 rounded-lg px-4">
                <span className="text-gray-600 text-sm">Créances &lt; 3 mois</span>
                <NumberInput 
                  value={data.actifs?.creancesClients?.moins3Mois}
                  onChange={(v) => updateField('actifs', 'creancesClients', { ...data.actifs?.creancesClients, moins3Mois: v })}
                  className="w-40"
                />
              </div>
            </div>
          )}

          {/* Trésorerie */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-gray-700 font-semibold mb-4">💵 Trésorerie</h4>
            
            <QuestionRow question="l) Avez-vous de l'argent cash quelque part ?">
              <OuiNonSelect 
                value={data.actifs?.tresorerie?.cash?.existe}
                onChange={(v) => updateField('actifs', 'tresorerie', { ...data.actifs?.tresorerie, cash: { ...data.actifs?.tresorerie?.cash, existe: v }})}
              />
            </QuestionRow>
            {data.actifs?.tresorerie?.cash?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.actifs?.tresorerie?.cash?.valeur}
                onChange={(v) => updateField('actifs', 'tresorerie', { ...data.actifs?.tresorerie, cash: { ...data.actifs?.tresorerie?.cash, valeur: v }})}
              />
            )}

            <QuestionRow question="m) Avez-vous de l'argent dans un compte CRG ?">
              <OuiNonSelect 
                value={data.actifs?.tresorerie?.compteCRG?.existe}
                onChange={(v) => updateField('actifs', 'tresorerie', { ...data.actifs?.tresorerie, compteCRG: { ...data.actifs?.tresorerie?.compteCRG, existe: v }})}
              />
            </QuestionRow>
            {data.actifs?.tresorerie?.compteCRG?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.actifs?.tresorerie?.compteCRG?.valeur}
                onChange={(v) => updateField('actifs', 'tresorerie', { ...data.actifs?.tresorerie, compteCRG: { ...data.actifs?.tresorerie?.compteCRG, valeur: v }})}
              />
            )}

            <QuestionRow question="n) Avez-vous de l'argent auprès d'un tontinier ?">
              <OuiNonSelect 
                value={data.actifs?.tresorerie?.tontinier?.existe}
                onChange={(v) => updateField('actifs', 'tresorerie', { ...data.actifs?.tresorerie, tontinier: { ...data.actifs?.tresorerie?.tontinier, existe: v }})}
              />
            </QuestionRow>
            {data.actifs?.tresorerie?.tontinier?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.actifs?.tresorerie?.tontinier?.valeur}
                onChange={(v) => updateField('actifs', 'tresorerie', { ...data.actifs?.tresorerie, tontinier: { ...data.actifs?.tresorerie?.tontinier, valeur: v }})}
              />
            )}

            <QuestionRow question="o) Avez-vous de l'argent dans un compte en banque/mobile money ?">
              <OuiNonSelect 
                value={data.actifs?.tresorerie?.banque?.existe}
                onChange={(v) => updateField('actifs', 'tresorerie', { ...data.actifs?.tresorerie, banque: { ...data.actifs?.tresorerie?.banque, existe: v }})}
              />
            </QuestionRow>
            {data.actifs?.tresorerie?.banque?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.actifs?.tresorerie?.banque?.valeur}
                onChange={(v) => updateField('actifs', 'tresorerie', { ...data.actifs?.tresorerie, banque: { ...data.actifs?.tresorerie?.banque, valeur: v }})}
              />
            )}
          </div>

          {/* Dettes (Passif) */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-gray-700 font-semibold mb-4">📋 Dettes et Engagements</h4>
            
            <QuestionRow question="p) Devez-vous de l'argent à une institution de microfinance ?">
              <OuiNonSelect 
                value={data.passifs?.empruntIMF?.existe}
                onChange={(v) => updateField('passifs', 'empruntIMF', { ...data.passifs?.empruntIMF, existe: v })}
              />
            </QuestionRow>
            {data.passifs?.empruntIMF?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.passifs?.empruntIMF?.valeur}
                onChange={(v) => updateField('passifs', 'empruntIMF', { ...data.passifs?.empruntIMF, valeur: v })}
              />
            )}

            <QuestionRow question="q) Avez-vous un emprunt bancaire à + d'1 an ?">
              <OuiNonSelect 
                value={data.passifs?.empruntBancaireLT?.existe}
                onChange={(v) => updateField('passifs', 'empruntBancaireLT', { ...data.passifs?.empruntBancaireLT, existe: v })}
              />
            </QuestionRow>
            {data.passifs?.empruntBancaireLT?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.passifs?.empruntBancaireLT?.valeur}
                onChange={(v) => updateField('passifs', 'empruntBancaireLT', { ...data.passifs?.empruntBancaireLT, valeur: v })}
              />
            )}

            <QuestionRow question="r) Avez-vous un emprunt bancaire à - d'1 an ?">
              <OuiNonSelect 
                value={data.passifs?.empruntBancaireCT?.existe}
                onChange={(v) => updateField('passifs', 'empruntBancaireCT', { ...data.passifs?.empruntBancaireCT, existe: v })}
              />
            </QuestionRow>
            {data.passifs?.empruntBancaireCT?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.passifs?.empruntBancaireCT?.valeur}
                onChange={(v) => updateField('passifs', 'empruntBancaireCT', { ...data.passifs?.empruntBancaireCT, valeur: v })}
              />
            )}

            <QuestionRow question="s) Avez-vous reçu des avances chez vos clients ?">
              <OuiNonSelect 
                value={data.passifs?.avancesClients?.existe}
                onChange={(v) => updateField('passifs', 'avancesClients', { ...data.passifs?.avancesClients, existe: v })}
              />
            </QuestionRow>
            {data.passifs?.avancesClients?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.passifs?.avancesClients?.valeur}
                onChange={(v) => updateField('passifs', 'avancesClients', { ...data.passifs?.avancesClients, valeur: v })}
              />
            )}

            <QuestionRow question="t) Devez-vous de l'argent à vos fournisseurs ?">
              <OuiNonSelect 
                value={data.passifs?.dettesFournisseurs?.existe}
                onChange={(v) => updateField('passifs', 'dettesFournisseurs', { ...data.passifs?.dettesFournisseurs, existe: v })}
              />
            </QuestionRow>
            {data.passifs?.dettesFournisseurs?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.passifs?.dettesFournisseurs?.valeur}
                onChange={(v) => updateField('passifs', 'dettesFournisseurs', { ...data.passifs?.dettesFournisseurs, valeur: v })}
              />
            )}

            <QuestionRow question="u) Avez-vous des avis d'imposition non encore réglés ?">
              <OuiNonSelect 
                value={data.passifs?.impots?.existe}
                onChange={(v) => updateField('passifs', 'impots', { ...data.passifs?.impots, existe: v })}
              />
            </QuestionRow>
            {data.passifs?.impots?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.passifs?.impots?.valeur}
                onChange={(v) => updateField('passifs', 'impots', { ...data.passifs?.impots, valeur: v })}
              />
            )}

            <QuestionRow question="v) Avez-vous des loyers non encore payés ?">
              <OuiNonSelect 
                value={data.passifs?.loyersNonPayes?.existe}
                onChange={(v) => updateField('passifs', 'loyersNonPayes', { ...data.passifs?.loyersNonPayes, existe: v })}
              />
            </QuestionRow>
            {data.passifs?.loyersNonPayes?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.passifs?.loyersNonPayes?.valeur}
                onChange={(v) => updateField('passifs', 'loyersNonPayes', { ...data.passifs?.loyersNonPayes, valeur: v })}
              />
            )}

            <QuestionRow question="w) Avez-vous des factures d'électricité non encore payées ?">
              <OuiNonSelect 
                value={data.passifs?.facturesNonPayees?.existe}
                onChange={(v) => updateField('passifs', 'facturesNonPayees', { ...data.passifs?.facturesNonPayees, existe: v })}
              />
            </QuestionRow>
            {data.passifs?.facturesNonPayees?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.passifs?.facturesNonPayees?.valeur}
                onChange={(v) => updateField('passifs', 'facturesNonPayees', { ...data.passifs?.facturesNonPayees, valeur: v })}
              />
            )}

            <QuestionRow question="x) Êtes-vous dans une tontine (où votre tour est déjà passé) ?">
              <OuiNonSelect 
                value={data.passifs?.tontine?.existe}
                onChange={(v) => updateField('passifs', 'tontine', { ...data.passifs?.tontine, existe: v })}
              />
            </QuestionRow>
            {data.passifs?.tontine?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant restant"
                value={data.passifs?.tontine?.valeur}
                onChange={(v) => updateField('passifs', 'tontine', { ...data.passifs?.tontine, valeur: v })}
              />
            )}

            <QuestionRow question="y) Avez-vous une dette quelconque à régler bientôt ?">
              <OuiNonSelect 
                value={data.passifs?.autresDettes?.existe}
                onChange={(v) => updateField('passifs', 'autresDettes', { ...data.passifs?.autresDettes, existe: v })}
              />
            </QuestionRow>
            {data.passifs?.autresDettes?.existe === 'OUI' && (
              <SubQuestionValue 
                label="Montant"
                value={data.passifs?.autresDettes?.valeur}
                onChange={(v) => updateField('passifs', 'autresDettes', { ...data.passifs?.autresDettes, valeur: v })}
              />
            )}
          </div>
        </div>
      </div>

      {/* Section 6: Charges mensuelles */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <SectionHeader number="6" title="Évaluation des charges mensuelles de l'entreprise" icon="💸" />
        
        <div className="space-y-3">
          {[
            { key: 'loyer', label: 'a) Le loyer des magasins et boutiques' },
            { key: 'salaires', label: 'b) Le salaire des employés' },
            { key: 'fournitures', label: 'c) Achat de fournitures de bureau' },
            { key: 'publicite', label: 'd) Frais de publicité et promotion' },
            { key: 'telephone', label: 'e) Frais de Téléphone / Internet' },
            { key: 'electricite', label: 'f) Frais d\'électricité' },
            { key: 'eau', label: 'g) Frais d\'eau' },
            { key: 'transportAchat', label: 'h) Frais de transport sur achat' },
            { key: 'transportVente', label: 'i) Frais de transport sur vente' },
            { key: 'transportDivers', label: 'j) Frais de transport divers' },
            { key: 'entretien', label: 'k) Frais d\'entretien et de réparation' },
            { key: 'carburant', label: 'l) Frais de carburant' },
            { key: 'assurance', label: 'm) Frais d\'assurance' },
            { key: 'fraisBancaires', label: 'n) Frais bancaires' },
            { key: 'interetsEmprunts', label: 'n) Intérêts sur emprunts' },
            { key: 'impotsTaxes', label: 'o) Impôts - Taxes et permis' },
            { key: 'honoraires', label: 'p) Frais Honoraires professionnels' },
            { key: 'provisions', label: 'q) Provisions mensuelles éventuelles' },
            { key: 'echeanceAutreCredit', label: 'r) Échéance autre crédit' },
            { key: 'autresCharges', label: 's) Autres charges' },
          ].map(({ key, label }) => (
            <React.Fragment key={key}>
              <QuestionRow question={label}>
                <OuiNonSelect 
                  value={data.charges?.[key]?.existe}
                  onChange={(v) => updateField('charges', key, { ...data.charges?.[key], existe: v })}
                />
              </QuestionRow>
              {data.charges?.[key]?.existe === 'OUI' && (
                <SubQuestionValue 
                  label="Montant mensuel"
                  value={data.charges?.[key]?.valeur}
                  onChange={(v) => updateField('charges', key, { ...data.charges?.[key], valeur: v })}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Section 7: Charges personnelles */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <SectionHeader number="7" title="Évaluation des charges personnelles de l'entrepreneur" icon="👤" />
        
        <QuestionRow question="Avez-vous fixé un salaire pour vous-même au niveau de votre activité ?">
          <OuiNonSelect 
            value={data.chargesPersonnelles?.salaireFixe}
            onChange={(v) => updateField('chargesPersonnelles', 'salaireFixe', v)}
          />
        </QuestionRow>

        {/* Si OUI: demander le montant */}
        {data.chargesPersonnelles?.salaireFixe === 'OUI' && (
          <div className="ml-8 mt-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-4">
              <span className="text-emerald-700 font-medium">Quel est le montant par mois ?</span>
              <NumberInput 
                value={data.chargesPersonnelles?.salaireMontant}
                onChange={(v) => updateField('chargesPersonnelles', 'salaireMontant', v)}
                className="w-48"
              />
              <span className="text-gray-500 text-sm">GNF</span>
            </div>
          </div>
        )}

        {/* Si NON: afficher le détail des charges personnelles */}
        {data.chargesPersonnelles?.salaireFixe === 'NON' && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <p className="text-orange-700 text-sm">
                <strong>Note:</strong> Veuillez détailler vos charges personnelles mensuelles prélevées sur l'activité.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { key: 'alimentation', label: 'a) Frais d\'alimentation' },
                { key: 'loyerResidence', label: 'b) Redevance - Loyer résidence personnelle' },
                { key: 'transportPrive', label: 'c) Frais de transport privé' },
                { key: 'electriciteEauComm', label: 'd) Électricité - eau - communication' },
                { key: 'habillement', label: 'e) Frais d\'habillement' },
                { key: 'fraisMedicaux', label: 'f) Frais médicaux' },
                { key: 'echeanceAutreCredit', label: 'g) Échéance autre crédit' },
                { key: 'scolarite', label: 'h) Frais de scolarité' },
                { key: 'travauxConstruction', label: 'i) Travaux de constructions privées' },
                { key: 'autresChargesPerso', label: 'j) Autres charges personnelles' },
              ].map(({ key, label }) => (
                <div key={key} className="grid grid-cols-12 gap-4 py-2 px-4 items-center border-b border-gray-100 hover:bg-gray-50">
                  <div className="col-span-6 text-gray-700 text-sm">{label}</div>
                  <div className="col-span-6 flex items-center gap-3">
                    <NumberInput 
                      value={data.chargesPersonnelles?.details?.[key]}
                      onChange={(v) => updateField('chargesPersonnelles', 'details', {
                        ...data.chargesPersonnelles?.details,
                        [key]: v
                      })}
                      className="w-48"
                      placeholder="0"
                    />
                    <span className="text-gray-500 text-sm">GNF</span>
                  </div>
                </div>
              ))}

              {/* Question k) */}
              <div className="grid grid-cols-12 gap-4 py-3 px-4 items-center bg-amber-50 rounded-lg mt-4">
                <div className="col-span-8 text-gray-700 text-sm font-medium">
                  k) Toutes ces dépenses sont prélevées dans l'activité ?
                </div>
                <div className="col-span-4">
                  <OuiNonSelect 
                    value={data.chargesPersonnelles?.depensesPreleveesDansActivite}
                    onChange={(v) => updateField('chargesPersonnelles', 'depensesPreleveesDansActivite', v)}
                  />
                </div>
              </div>

              {/* Total des charges personnelles */}
              <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg flex justify-between items-center">
                <span className="text-orange-700 font-medium">Total charges personnelles mensuelles</span>
                <span className="text-xl font-bold text-orange-700">
                  {formatGNF(
                    Object.values(data.chargesPersonnelles?.details || {}).reduce((sum, val) => sum + (parseNumber(val) || 0), 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 8: Autres revenus */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <SectionHeader number="8" title="Évaluation des autres revenus mensuels" icon="💵" />
        
        <div className="space-y-3">
          {[
            { key: 'salaire', label: 'a) Salaire et rémunérations en tant que salarié' },
            { key: 'loyers', label: 'b) Loyers perçus' },
            { key: 'activitesSecondaires', label: 'c) Revenus issus d\'activités secondaires' },
            { key: 'autres', label: 'd) Autres revenus' },
          ].map(({ key, label }) => (
            <React.Fragment key={key}>
              <QuestionRow question={label}>
                <OuiNonSelect 
                  value={data.autresRevenus?.[key]?.existe}
                  onChange={(v) => updateField('autresRevenus', key, { ...data.autresRevenus?.[key], existe: v })}
                />
              </QuestionRow>
              {data.autresRevenus?.[key]?.existe === 'OUI' && (
                <SubQuestionValue 
                  label="Montant"
                  value={data.autresRevenus?.[key]?.valeur}
                  onChange={(v) => updateField('autresRevenus', key, { ...data.autresRevenus?.[key], valeur: v })}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Section 9: Biens personnels */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <SectionHeader number="9" title="Évaluation des biens personnels de l'entrepreneur" icon="🏠" />
        
        <div className="space-y-3">
          {[
            { key: 'terrains', label: 'a) Avez-vous des terrains vides' },
            { key: 'maisons', label: 'b) Avez-vous des maisons' },
            { key: 'vehicules', label: 'c) Avez-vous des véhicules' },
            { key: 'motos', label: 'd) Avez-vous des motos' },
            { key: 'autres', label: 'e) Autres biens personnels' },
          ].map(({ key, label }) => (
            <React.Fragment key={key}>
              <QuestionRow question={label}>
                <OuiNonSelect 
                  value={data.biensPersonnels?.[key]?.existe}
                  onChange={(v) => updateField('biensPersonnels', key, { ...data.biensPersonnels?.[key], existe: v })}
                />
              </QuestionRow>
              {data.biensPersonnels?.[key]?.existe === 'OUI' && (
                <SubQuestionValue 
                  label="Valeur estimée"
                  value={data.biensPersonnels?.[key]?.valeur}
                  onChange={(v) => updateField('biensPersonnels', key, { ...data.biensPersonnels?.[key], valeur: v })}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Signatures */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600 font-medium">Nom et Prénom, Date et Signature</p>
            <p className="text-gray-400 text-sm mt-2">(Agent de crédit)</p>
            <div className="h-20 mt-4"></div>
          </div>
          <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600 font-medium">Nom et Prénom, Date et Signature</p>
            <p className="text-gray-400 text-sm mt-2">(Emprunteur)</p>
            <div className="h-20 mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Onglet AMORTISSEMENTS
// ============================================================================

const Amortissements = ({ data, onChange }) => {
  const typeOptions = [
    'Bâtiments et magasin',
    'Installations et agencements',
    'Matériels industriels',
    'Mobilier de bureau',
    'Matériel informatique',
    'Matériel de transport',
    'Autres immobilisations'
  ];

  const dureeDefaut = {
    'Bâtiments et magasin': 120,
    'Installations et agencements': 60,
    'Matériels industriels': 60,
    'Mobilier de bureau': 60,
    'Matériel informatique': 36,
    'Matériel de transport': 36,
    'Autres immobilisations': 60
  };

  const calculateAmortissement = (item) => {
    if (!item.valeurAcquisition || !item.dureeAmort) return 0;
    return item.valeurAcquisition / item.dureeAmort;
  };

  const calculateVNC = (item) => {
    if (!item.valeurAcquisition || !item.dateAcquisition || !item.dureeAmort) return item.valeurAcquisition || 0;
    
    const dateAcq = new Date(item.dateAcquisition);
    const now = new Date();
    const moisEcoules = (now.getFullYear() - dateAcq.getFullYear()) * 12 + (now.getMonth() - dateAcq.getMonth());
    const amortCumule = Math.min(item.valeurAcquisition, calculateAmortissement(item) * moisEcoules);
    return Math.max(0, item.valeurAcquisition - amortCumule);
  };

  const handleTypeChange = (index, type) => {
    const newData = [...(data || [])];
    newData[index] = {
      ...newData[index],
      type,
      dureeAmort: dureeDefaut[type] || 60
    };
    onChange(newData);
  };

  const totals = useMemo(() => {
    const items = data || [];
    return {
      valeurAcquisition: items.reduce((sum, i) => sum + (parseNumber(i.valeurAcquisition) || 0), 0),
      amortMensuel: items.reduce((sum, i) => sum + calculateAmortissement(i), 0),
      vnc: items.reduce((sum, i) => sum + calculateVNC(i), 0)
    };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Tableau des Amortissements</h1>
            <p className="text-blue-100 text-sm mt-1">Immobilisations et calcul des amortissements</p>
          </div>
          <div className="text-right">
            <div className="text-blue-100 text-xs uppercase tracking-wider">Crédit Rural de Guinée</div>
            <div className="text-3xl font-bold">CRG</div>
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <span className="text-blue-100 text-sm">Date d'évaluation :</span>
            <DateInput value={new Date().toISOString().split('T')[0]} onChange={() => {}} />
          </div>
        </div>
      </div>

      {/* Tableau des immobilisations */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-50">
              <tr>
                <th className="px-3 py-3 text-left text-blue-800 font-semibold w-10">№</th>
                <th className="px-3 py-3 text-left text-blue-800 font-semibold">Nature de l'immobilisation</th>
                <th className="px-3 py-3 text-left text-blue-800 font-semibold w-48">Type d'immobilisation</th>
                <th className="px-3 py-3 text-center text-blue-800 font-semibold w-36">Date d'acquisition</th>
                <th className="px-3 py-3 text-center text-blue-800 font-semibold w-24">Durée (mois)</th>
                <th className="px-3 py-3 text-right text-blue-800 font-semibold w-40">Valeur d'acquisition</th>
                <th className="px-3 py-3 text-right text-blue-800 font-semibold w-36">Amort. mensuel</th>
                <th className="px-3 py-3 text-right text-blue-800 font-semibold w-40">VNC</th>
                <th className="px-3 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {(data || []).map((item, index) => (
                <tr key={index} className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50/30`}>
                  <td className="px-3 py-2 text-gray-500 font-medium">{index + 1}</td>
                  <td className="px-2 py-1.5">
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[index] = { ...newData[index], description: e.target.value };
                        onChange(newData);
                      }}
                      placeholder="Description..."
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <select
                      value={item.type || ''}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">-- Type --</option>
                      {typeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="date"
                      value={item.dateAcquisition || ''}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[index] = { ...newData[index], dateAcquisition: e.target.value };
                        onChange(newData);
                      }}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={item.dureeAmort || ''}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[index] = { ...newData[index], dureeAmort: parseInt(e.target.value) || 0 };
                        onChange(newData);
                      }}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm text-center focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="text"
                      value={item.valeurAcquisition ? parseFloat(item.valeurAcquisition).toLocaleString('fr-FR') : ''}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[index] = { ...newData[index], valeurAcquisition: parseNumber(e.target.value) };
                        onChange(newData);
                      }}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm text-right font-mono focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-blue-700 bg-blue-50/50">
                    {formatGNF(calculateAmortissement(item))}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-emerald-700 bg-emerald-50/50 font-semibold">
                    {formatGNF(calculateVNC(item))}
                  </td>
                  <td className="px-2 py-1.5">
                    <button
                      onClick={() => onChange(data.filter((_, i) => i !== index))}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 border-t-2 border-gray-300">
                <td colSpan={5} className="px-3 py-3">
                  <button
                    onClick={() => onChange([...(data || []), { dureeAmort: 60 }])}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <span className="text-lg">+</span> Ajouter une immobilisation
                  </button>
                </td>
                <td className="px-3 py-3 text-right font-mono font-bold text-gray-800">
                  {formatGNF(totals.valeurAcquisition)}
                </td>
                <td className="px-3 py-3 text-right font-mono font-bold text-blue-700 bg-blue-100">
                  {formatGNF(totals.amortMensuel)}
                </td>
                <td className="px-3 py-3 text-right font-mono font-bold text-emerald-700 bg-emerald-100">
                  {formatGNF(totals.vnc)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Résumé par catégorie */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Résumé par catégorie</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {typeOptions.map(type => {
            const items = (data || []).filter(i => i.type === type);
            const totalVNC = items.reduce((sum, i) => sum + calculateVNC(i), 0);
            if (totalVNC === 0) return null;
            return (
              <div key={type} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider">{type}</div>
                <div className="text-xl font-bold text-gray-800 mt-1">{formatGNF(totalVNC)}</div>
                <div className="text-xs text-gray-400 mt-1">{items.length} immobilisation(s)</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Application principale
// ============================================================================

export default function CollecteDonneesApp() {
  const [activeTab, setActiveTab] = useState('collecte');
  const [collecteData, setCollecteData] = useState({
    header: { dateEvaluation: new Date().toISOString().split('T')[0] },
    activite: {},
    credit: {},
    chiffreAffaires: {},
    margeBrute: { produits: [] },
    actifs: { stockArticles: [] },
    passifs: {},
    charges: {},
    chargesPersonnelles: { details: {} },
    autresRevenus: {},
    biensPersonnels: {}
  });
  const [amortsData, setAmortsData] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                CRG
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Crédit Rural de Guinée</div>
                <div className="text-xs text-gray-500">Analyse des Crédits PME</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('collecte')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'collecte'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📋 Collecte des Données
              </button>
              <button
                onClick={() => setActiveTab('amorts')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'amorts'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🏢 Amortissements
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors">
                💾 Enregistrer
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'collecte' ? (
          <CollecteDonnees data={collecteData} onChange={setCollecteData} />
        ) : (
          <Amortissements data={amortsData} onChange={setAmortsData} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          Crédit Rural de Guinée © 2026 - Système d'Analyse des Crédits PME
        </div>
      </footer>
    </div>
  );
}
