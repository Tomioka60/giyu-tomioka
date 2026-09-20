import React, { useState, useEffect } from 'react';
import { 
  CalculationInput, 
  GrowthStage, 
  SoilTypeKey, 
  IrrigationSystemType 
} from '../types';
import { 
  MOROCCAN_REGIONS, 
  MOROCCAN_CROPS, 
  MOROCCAN_SOILS, 
  IRRIGATION_SYSTEMS, 
  MOROCCAN_PRESETS,
  MONTH_NAMES 
} from '../data/moroccoData';
import { 
  MapPin, 
  Sprout, 
  Layers, 
  Clock, 
  Gauge, 
  CloudSun, 
  CloudRain, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';

interface CalculationFormProps {
  onCalculate: (input: CalculationInput) => void;
  initialInput?: CalculationInput;
}

const DEFAULT_INPUT: CalculationInput = {
  parcelName: 'Parcelle Nord - Verger',
  surfaceValue: 5,
  surfaceUnit: 'ha',
  regionId: 'souss_massa',
  month: 5, // Mai
  cropId: 'agrumes',
  growthStage: 'mi_saison',
  soilId: 'sablo_limoneux_rmel',
  irrigationSystemId: 'goutte_a_goutte',
  flowRate: 35,
  flowUnit: 'm3_h',
  et0: 5.9,
  rainfall: 0,
  actualDurationHours: 4,
  actualDurationMinutes: 0
};

export const CalculationForm: React.FC<CalculationFormProps> = ({ 
  onCalculate,
  initialInput 
}) => {
  const [formData, setFormData] = useState<CalculationInput>(initialInput || DEFAULT_INPUT);
  const [showAdvancedKc, setShowAdvancedKc] = useState(false);
  const [showActualDurationAudit, setShowActualDurationAudit] = useState(true);

  // Selected crop details
  const selectedCrop = MOROCCAN_CROPS.find(c => c.id === formData.cropId) || MOROCCAN_CROPS[0];
  const currentStageInfo = selectedCrop.stages[formData.growthStage];
  
  // Selected region details
  const selectedRegion = MOROCCAN_REGIONS.find(r => r.id === formData.regionId) || MOROCCAN_REGIONS[0];
  
  // Selected soil details
  const selectedSoil = MOROCCAN_SOILS.find(s => s.id === formData.soilId) || MOROCCAN_SOILS[0];
  
  // Selected system details
  const selectedSystem = IRRIGATION_SYSTEMS.find(s => s.id === formData.irrigationSystemId) || IRRIGATION_SYSTEMS[0];

  // Update ET0 when region or month changes, if not explicitly customized
  const handleRegionOrMonthChange = (newRegionId: string, newMonth: number) => {
    const region = MOROCCAN_REGIONS.find(r => r.id === newRegionId) || selectedRegion;
    const defaultEt0 = region.monthlyEt0[newMonth] || 5.0;
    setFormData(prev => ({
      ...prev,
      regionId: newRegionId,
      month: newMonth,
      et0: defaultEt0
    }));
  };

  // Update Kc when crop or stage changes
  const handleCropOrStageChange = (newCropId: string, newStage: GrowthStage) => {
    const crop = MOROCCAN_CROPS.find(c => c.id === newCropId) || selectedCrop;
    const stage = crop.stages[newStage] || crop.stages.mi_saison;
    setFormData(prev => ({
      ...prev,
      cropId: newCropId,
      growthStage: newStage,
      customKc: stage.kc
    }));
  };

  // Apply a preset
  const applyPreset = (preset: typeof MOROCCAN_PRESETS[0]) => {
    const region = MOROCCAN_REGIONS.find(r => r.id === preset.regionId)!;
    const crop = MOROCCAN_CROPS.find(c => c.id === preset.cropId)!;
    const stage = crop.stages[preset.growthStage];
    const system = IRRIGATION_SYSTEMS.find(s => s.id === preset.irrigationSystemId)!;

    const newFormData: CalculationInput = {
      parcelName: preset.parcelName,
      surfaceValue: preset.surfaceValue,
      surfaceUnit: preset.surfaceUnit,
      regionId: preset.regionId,
      month: preset.month,
      cropId: preset.cropId,
      growthStage: preset.growthStage,
      customKc: stage.kc,
      soilId: preset.soilId,
      irrigationSystemId: preset.irrigationSystemId,
      customEfficiency: system.defaultEfficiency,
      flowRate: preset.flowRate,
      flowUnit: preset.flowUnit,
      et0: region.monthlyEt0[preset.month] || 5.0,
      rainfall: preset.rainfall,
      actualDurationHours: 4,
      actualDurationMinutes: 0
    };

    setFormData(newFormData);
    onCalculate(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const handleReset = () => {
    setFormData(DEFAULT_INPUT);
    onCalculate(DEFAULT_INPUT);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
      
      {/* Form Header with Moroccan Presets Bar */}
      <div className="p-4 sm:p-6 border-b border-stone-100 bg-stone-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              Paramètres d'Irrigation de la Parcelle
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Renseignez les caractéristiques de votre exploitation selon les normes agronomiques du Maroc.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            Réinitialiser
          </button>
        </div>

        {/* Quick Presets for Morocco */}
        <div className="mt-4 pt-3 border-t border-stone-200/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Exemples types des bassins agricoles marocains :</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MOROCCAN_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-[11px] sm:text-xs px-2.5 py-1 rounded-md bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">

        {/* SECTION 1: Parcelle & Localisation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-950 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>1. Parcelle & Localisation (Bassin ORMVA)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Nom de la parcelle */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nom ou Identifiant de la parcelle
              </label>
              <input
                type="text"
                value={formData.parcelName}
                onChange={e => setFormData({ ...formData, parcelName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-900"
                placeholder="Ex: Parcelle 4 - Clémentiniers"
                required
              />
            </div>

            {/* Superficie & Unité */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Superficie de la parcelle
              </label>
              <div className="flex rounded-lg border border-stone-200 overflow-hidden bg-stone-50 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600">
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={formData.surfaceValue}
                  onChange={e => setFormData({ ...formData, surfaceValue: Math.max(0.01, parseFloat(e.target.value) || 0) })}
                  className="w-full px-3 py-2 text-sm bg-transparent border-none focus:outline-none text-stone-900 font-medium"
                  required
                />
                <div className="flex border-l border-stone-200 bg-stone-100">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, surfaceUnit: 'ha' })}
                    className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                      formData.surfaceUnit === 'ha'
                        ? 'bg-emerald-700 text-white'
                        : 'text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    ha
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, surfaceUnit: 'm2' })}
                    className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                      formData.surfaceUnit === 'm2'
                        ? 'bg-emerald-700 text-white'
                        : 'text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    m²
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                {formData.surfaceUnit === 'ha' 
                  ? `= ${(formData.surfaceValue * 10000).toLocaleString('fr-FR')} m²` 
                  : `= ${(formData.surfaceValue / 10000).toFixed(2)} ha`}
              </p>
            </div>

            {/* Région / ORMVA */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Région agricole / Bassin d'irrigation
              </label>
              <div className="relative">
                <select
                  value={formData.regionId}
                  onChange={e => handleRegionOrMonthChange(e.target.value, formData.month)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-900 appearance-none pr-8 font-medium"
                >
                  {MOROCCAN_REGIONS.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                {selectedRegion.ormvaOrDpa} • {selectedRegion.climateZone}
              </p>
            </div>

          </div>
        </div>

        <div className="h-px bg-stone-100" />

        {/* SECTION 2: Culture & Stade Phénologique */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-950 uppercase tracking-wider">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>2. Culture & Stade Phénologique (Kc FAO-56 Maroc)</span>
            </div>
            
            <button
              type="button"
              onClick={() => setShowAdvancedKc(!showAdvancedKc)}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer underline underline-offset-2"
            >
              {showAdvancedKc ? 'Masquer ajustement Kc' : 'Ajuster Kc manuellement'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Culture */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Espèce végétale / Culture
              </label>
              <div className="relative">
                <select
                  value={formData.cropId}
                  onChange={e => handleCropOrStageChange(e.target.value, formData.growthStage)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-900 appearance-none pr-8 font-medium"
                >
                  {MOROCCAN_CROPS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
              <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                Racines : {selectedCrop.rootDepthMeters} m • p = {selectedCrop.depletionFractionP}
              </p>
            </div>

            {/* Stade de développement */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Stade de développement végétatif
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['initial', 'developpement', 'mi_saison', 'fin_saison'] as GrowthStage[]).map(stageKey => {
                  const stage = selectedCrop.stages[stageKey];
                  const isSelected = formData.growthStage === stageKey;
                  return (
                    <button
                      key={stageKey}
                      type="button"
                      onClick={() => handleCropOrStageChange(formData.cropId, stageKey)}
                      className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold capitalize">
                          {stageKey === 'mi_saison' ? 'Mi-saison' : stageKey}
                        </span>
                        <span className="text-[11px] font-mono font-bold bg-white px-1.5 py-0.5 rounded text-emerald-700 border border-stone-200">
                          Kc {stage.kc.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1 line-clamp-1 leading-tight">
                        {stage.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Description agronomique du stade sélectionné */}
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <div className="text-xs text-emerald-950">
              <span className="font-bold">{currentStageInfo.label} : </span>
              {currentStageInfo.description} {selectedCrop.notesAgro}
            </div>
          </div>

          {/* Ajustement manuel du Kc si activé */}
          {showAdvancedKc && (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-800">
                    Coefficient cultural (Kc) personnalisé
                  </label>
                  <p className="text-[11px] text-stone-500">
                    Valeur de référence INRA pour ce stade : <span className="font-bold">{currentStageInfo.kc}</span>
                  </p>
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="1.5"
                    value={formData.customKc ?? currentStageInfo.kc}
                    onChange={e => setFormData({ ...formData, customKc: parseFloat(e.target.value) || currentStageInfo.kc })}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-stone-300 rounded-lg text-stone-900 font-bold text-center focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="h-px bg-stone-100" />

        {/* SECTION 3: Climat, ET0 & Pluviométrie */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-950 uppercase tracking-wider">
            <CloudSun className="w-4 h-4 text-emerald-600" />
            <span>3. Évapotranspiration de Référence (ET0) & Pluie</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Mois de calcul */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Mois de l'année (période)
              </label>
              <div className="relative">
                <select
                  value={formData.month}
                  onChange={e => handleRegionOrMonthChange(formData.regionId, parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-900 appearance-none pr-8 font-medium"
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* ET0 journalière (mm/j) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-stone-700">
                  ET0 de référence (mm/jour)
                </label>
                <span className="text-[10px] text-stone-500 font-mono">
                  Moyenne station : {selectedRegion.monthlyEt0[formData.month]}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="15"
                  value={formData.et0}
                  onChange={e => setFormData({ ...formData, et0: Math.max(0.1, parseFloat(e.target.value) || 0) })}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-900 font-bold"
                  required
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-stone-400">
                  mm/j
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Basé sur les données agro-climatiques de la région {selectedRegion.name.split(' ')[0]}
              </p>
            </div>

            {/* Précipitations (mm) */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Précipitations enregistrées (mm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.rainfall}
                  onChange={e => setFormData({ ...formData, rainfall: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-900 font-medium"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-stone-400">
                  mm
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {formData.rainfall > 0 
                  ? 'La pluie efficace (Peff) viendra en déduction des besoins' 
                  : 'Aucune pluie (0 mm) enregistrée'}
              </p>
            </div>

          </div>
        </div>

        <div className="h-px bg-stone-100" />

        {/* SECTION 4: Type de Sol & Système d'irrigation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-950 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>4. Sol Marocain & Matériel d'Irrigation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Type de sol marocain */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Type de sol de la parcelle
              </label>
              <div className="relative">
                <select
                  value={formData.soilId}
                  onChange={e => setFormData({ ...formData, soilId: e.target.value as SoilTypeKey })}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-900 appearance-none pr-8 font-medium"
                >
                  {MOROCCAN_SOILS.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.localName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Rétention RU : {selectedSoil.availableWaterCapacityMmPerM} mm/m • Infiltration max : {selectedSoil.infiltrationRateMmPerHour} mm/h
              </p>
            </div>

            {/* Système d'irrigation & Efficacité */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-stone-700">
                  Système d'irrigation
                </label>
                <span className="text-[10px] font-bold text-emerald-700">
                  Ea : {formData.customEfficiency ?? selectedSystem.defaultEfficiency}%
                </span>
              </div>
              <div className="relative">
                <select
                  value={formData.irrigationSystemId}
                  onChange={e => {
                    const sysId = e.target.value as IrrigationSystemType;
                    const sys = IRRIGATION_SYSTEMS.find(s => s.id === sysId)!;
                    setFormData({
                      ...formData,
                      irrigationSystemId: sysId,
                      customEfficiency: sys.defaultEfficiency
                    });
                  }}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-900 appearance-none pr-8 font-medium"
                >
                  {IRRIGATION_SYSTEMS.map(sys => (
                    <option key={sys.id} value={sys.id}>
                      {sys.name} (Ea: {sys.defaultEfficiency}%)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                {selectedSystem.pneiStatus}
              </p>
            </div>

            {/* Débit disponible (puits, forage, borne ORMVA) */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Débit disponible (station / borne)
              </label>
              <div className="flex rounded-lg border border-stone-200 overflow-hidden bg-stone-50 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600">
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={formData.flowRate}
                  onChange={e => setFormData({ ...formData, flowRate: Math.max(0.1, parseFloat(e.target.value) || 0) })}
                  className="w-full px-3 py-2 text-sm bg-transparent border-none focus:outline-none text-stone-900 font-bold"
                  required
                />
                <div className="flex border-l border-stone-200 bg-stone-100">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, flowUnit: 'm3_h' })}
                    className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                      formData.flowUnit === 'm3_h'
                        ? 'bg-emerald-700 text-white'
                        : 'text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    m³/h
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, flowUnit: 'l_s' })}
                    className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                      formData.flowUnit === 'l_s'
                        ? 'bg-emerald-700 text-white'
                        : 'text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    L/s
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {formData.flowUnit === 'l_s' 
                  ? `= ${(formData.flowRate * 3.6).toFixed(1)} m³/h` 
                  : `= ${(formData.flowRate / 3.6).toFixed(1)} L/s`}
              </p>
            </div>

          </div>
        </div>

        <div className="h-px bg-stone-100" />

        {/* SECTION 5: Option d'audit / Bilan hydrique réel (Déficit / Surplus) */}
        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-950">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Bilan & Audit : Comparer avec votre durée d'arrosage habituelle</span>
            </div>
            <button
              type="button"
              onClick={() => setShowActualDurationAudit(!showActualDurationAudit)}
              className="text-xs font-semibold text-amber-900 underline underline-offset-2 cursor-pointer"
            >
              {showActualDurationAudit ? 'Masquer' : 'Activer le comparateur'}
            </button>
          </div>

          {showActualDurationAudit && (
            <div className="mt-3 pt-3 border-t border-amber-200/50 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <p className="text-xs text-amber-900">
                  Indiquez la durée que vous programmez actuellement sur vos vannes pour calculer le <span className="font-bold">volume réellement apporté</span> et diagnostiquer s'il y a un <span className="font-bold text-red-700">déficit hydrique</span> (stress plante) ou un <span className="font-bold text-blue-700">surplus d'eau</span> (gaspillage).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Heures
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={formData.actualDurationHours ?? 0}
                    onChange={e => setFormData({
                      ...formData,
                      actualDurationHours: Math.max(0, parseInt(e.target.value) || 0)
                    })}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-lg text-stone-900 font-bold text-center"
                  />
                </div>
                <span className="text-stone-400 font-bold mt-4">h</span>
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Minutes
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    step="5"
                    value={formData.actualDurationMinutes ?? 0}
                    onChange={e => setFormData({
                      ...formData,
                      actualDurationMinutes: Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                    })}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-lg text-stone-900 font-bold text-center"
                  />
                </div>
                <span className="text-stone-400 font-bold mt-4">min</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            id="btn-calculate"
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-base shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Gauge className="w-5 h-5" />
            <span>Calculer les Besoins en Eau & la Durée d'Irrigation</span>
          </button>
        </div>

      </form>

    </div>
  );
};
