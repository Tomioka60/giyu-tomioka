import React, { useState } from 'react';
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
  RotateCcw, 
  Bookmark, 
  Info, 
  Check, 
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Clock,
  Sparkles,
  Sliders,
  Droplets,
  Sprout,
  Sun,
  Layers,
  Gauge
} from 'lucide-react';

interface IrrigationCalculatorProps {
  onCalculate: (input: CalculationInput) => void;
  initialInput?: CalculationInput;
}

const DEFAULT_INPUT: CalculationInput = {
  parcelName: 'Verger Clémentiniers — Souss',
  surfaceValue: 5.0,
  surfaceUnit: 'ha',
  regionId: 'souss_massa',
  month: 5, // Mai
  cropId: 'agrumes',
  growthStage: 'mi_saison',
  soilId: 'sablo_limoneux_rmel',
  irrigationSystemId: 'goutte_a_goutte',
  flowRate: 35.0,
  flowUnit: 'm3_h',
  et0: 5.9,
  rainfall: 0,
  actualDurationHours: 4,
  actualDurationMinutes: 0
};

export const IrrigationCalculator: React.FC<IrrigationCalculatorProps> = ({
  onCalculate,
  initialInput
}) => {
  const [formData, setFormData] = useState<CalculationInput>(initialInput || DEFAULT_INPUT);
  const [calculatorMode, setCalculatorMode] = useState<'simple' | 'advanced'>('simple');
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [showAdvancedAudit, setShowAdvancedAudit] = useState(true);
  
  // Quick Valve Timer Drawer
  const [showValveTimer, setShowValveTimer] = useState(false);
  const [quickVolume, setQuickVolume] = useState<number>(140);
  const [quickFlow, setQuickFlow] = useState<number>(35);

  // Selected crop details
  const selectedCrop = MOROCCAN_CROPS.find(c => c.id === formData.cropId) || MOROCCAN_CROPS[0];
  const currentStageInfo = selectedCrop.stages[formData.growthStage] || selectedCrop.stages.mi_saison;
  
  // Selected region details
  const selectedRegion = MOROCCAN_REGIONS.find(r => r.id === formData.regionId) || MOROCCAN_REGIONS[0];
  
  // Selected soil details
  const selectedSoil = MOROCCAN_SOILS.find(s => s.id === formData.soilId) || MOROCCAN_SOILS[0];
  
  // Selected system details
  const selectedSystem = IRRIGATION_SYSTEMS.find(s => s.id === formData.irrigationSystemId) || IRRIGATION_SYSTEMS[0];

  // Region / Month change updates ET0
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

  // Crop / Stage change updates Kc
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

  const handleReset = () => {
    setFormData(DEFAULT_INPUT);
    setActiveStep(1);
    onCalculate(DEFAULT_INPUT);
  };

  const handleExecuteCalculation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onCalculate(formData);
  };

  const steps = [
    { num: 1, title: '1. Parcelle', summary: `${formData.parcelName || 'Parcelle'} (${formData.surfaceValue} ${formData.surfaceUnit})` },
    { num: 2, title: '2. Culture', summary: `${selectedCrop.name} (${currentStageInfo.label})` },
    { num: 3, title: '3. Pompe & Réseau', summary: `${selectedSystem.name} (${formData.flowRate} ${formData.flowUnit === 'm3_h' ? 'm³/h' : 'L/s'})` },
    { num: 4, title: '4. Météo & Durée', summary: `ET₀ : ${formData.et0} mm/j, Pluie : ${formData.rainfall} mm` }
  ];

  // Quick helper calculations
  const surfaceInHa = formData.surfaceUnit === 'ha' ? formData.surfaceValue : formData.surfaceValue / 10000;
  const estimatedDailyVolume = Math.round(surfaceInHa * 10000 * (formData.et0 * (formData.customKc ?? currentStageInfo.kc) / 1000) / ((formData.customEfficiency ?? selectedSystem.defaultEfficiency) / 100));
  const estimatedHours = formData.flowRate > 0 ? (estimatedDailyVolume / formData.flowRate) : 0;
  const estH = Math.floor(estimatedHours);
  const estM = Math.round((estimatedHours - estH) * 60);

  // Quick valve timer result
  const quickValveDurationHours = quickFlow > 0 ? quickVolume / quickFlow : 0;
  const qvh = Math.floor(quickValveDurationHours);
  const qvm = Math.round((quickValveDurationHours - qvh) * 60);

  return (
    <div className="space-y-4">
      
      {/* Top Banner: Mode Selector & Helper Info */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1F2933] dark:text-stone-100">
                Calculateur d'irrigation
              </h2>
              <span className="text-[11px] font-semibold text-[#173F35] dark:text-emerald-300 bg-[#2F6B4F]/10 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-[#2F6B4F]/20">
                Simple & Rapide
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Calculez directement le volume d'eau en m³ et le temps d'ouverture de vos vannes d'arrosage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mode switch */}
            <div className="flex items-center bg-[#F7F7F3] dark:bg-stone-800 p-1 rounded-lg border border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setCalculatorMode('simple')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  calculatorMode === 'simple'
                    ? 'bg-[#2F6B4F] text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Mode Simple (1 Clic)
              </button>
              <button
                type="button"
                onClick={() => setCalculatorMode('advanced')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  calculatorMode === 'advanced'
                    ? 'bg-[#2F6B4F] text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Mode Avancé
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer inline-flex items-center gap-1"
              title="Réinitialiser les valeurs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
          </div>
        </div>

        {/* Quick Presets for Farmers */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-[#2F6B4F]" />
              <span>Charger un modèle de culture en 1 clic :</span>
            </span>
            <button
              type="button"
              onClick={() => setShowValveTimer(!showValveTimer)}
              className="text-xs font-semibold text-[#2F6B4F] dark:text-emerald-400 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{showValveTimer ? 'Masquer la réglette vanne' : 'Réglette de vanne express'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {MOROCCAN_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="p-2 text-left rounded-lg bg-[#F7F7F3] dark:bg-stone-800/80 hover:bg-[#2F6B4F]/10 hover:border-[#2F6B4F] border border-stone-200 dark:border-stone-700 text-[#1F2933] dark:text-stone-200 transition-colors cursor-pointer"
              >
                <div className="text-xs font-bold truncate">{p.parcelName.split('—')[0].trim()}</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                  {p.surfaceValue} ha • {p.flowRate} m³/h
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Valve Timer Accordion */}
        {showValveTimer && (
          <div className="mt-4 p-4 rounded-xl bg-[#173F35] text-white border border-[#245246] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-300" />
                <h4 className="text-sm font-bold">Réglette de vanne express (Règle de trois terrain)</h4>
              </div>
              <span className="text-[11px] text-emerald-200 bg-white/10 px-2 py-0.5 rounded font-mono">
                Durée = Volume ÷ Débit
              </span>
            </div>
            <p className="text-xs text-stone-200">
              Vous connaissez déjà le volume en m³ à injecter ? Entrez le volume et le débit de votre pompe pour obtenir le temps d'ouverture exact.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-[11px] text-stone-200 font-medium mb-1">Volume d'eau souhaité (m³)</label>
                <input
                  type="number"
                  min="1"
                  value={quickVolume}
                  onChange={e => setQuickVolume(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white font-mono font-bold focus:outline-none focus:border-emerald-300"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-200 font-medium mb-1">Débit de votre pompe (m³/h)</label>
                <input
                  type="number"
                  min="1"
                  value={quickFlow}
                  onChange={e => setQuickFlow(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white font-mono font-bold focus:outline-none focus:border-emerald-300"
                />
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-center">
                <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Temps d'ouverture vanne</span>
                <span className="text-xl font-black text-white font-mono mt-0.5 block">
                  {qvh}h {qvm > 0 ? `${qvm}min` : '00min'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODE 1: SIMPLE & DIRECT (RECOMMENDED FOR EVERYDAY FARMERS) */}
      {/* ========================================================= */}
      {calculatorMode === 'simple' && (
        <form onSubmit={handleExecuteCalculation} className="space-y-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* CARD 1: CROP & PARCEL */}
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <Sprout className="w-4 h-4 text-[#2F6B4F]" />
                <h3 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">1. Ma Culture & Parcelle</h3>
              </div>

              {/* Crop Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Type de culture
                </label>
                <select
                  value={formData.cropId}
                  onChange={e => handleCropOrStageChange(e.target.value, formData.growthStage)}
                  className="w-full px-3 py-2.5 text-xs bg-[#F7F7F3] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 font-bold focus:outline-none focus:border-[#2F6B4F]"
                >
                  {MOROCCAN_CROPS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Growth Stage */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Stade de développement
                </label>
                <select
                  value={formData.growthStage}
                  onChange={e => handleCropOrStageChange(formData.cropId, e.target.value as GrowthStage)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F3] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 font-medium focus:outline-none focus:border-[#2F6B4F]"
                >
                  {Object.entries(selectedCrop.stages).map(([stageKey, info]) => (
                    <option key={stageKey} value={stageKey}>
                      {info.label} (Kc : {info.kc})
                    </option>
                  ))}
                </select>
              </div>

              {/* Surface Area */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Superficie de la parcelle
                </label>
                <div className="flex rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden bg-[#F7F7F3] dark:bg-stone-800 focus-within:border-[#2F6B4F]">
                  <input
                    type="number"
                    step="0.1"
                    min="0.05"
                    value={formData.surfaceValue}
                    onChange={e => setFormData({ ...formData, surfaceValue: Math.max(0.05, parseFloat(e.target.value) || 0) })}
                    className="w-full px-3 py-2 text-sm bg-transparent border-none focus:outline-none text-[#1F2933] dark:text-stone-100 font-mono font-bold"
                    required
                  />
                  <div className="flex border-l border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-700">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, surfaceUnit: 'ha' })}
                      className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                        formData.surfaceUnit === 'ha'
                          ? 'bg-[#2F6B4F] text-white'
                          : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      ha
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, surfaceUnit: 'm2' })}
                      className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                        formData.surfaceUnit === 'm2'
                          ? 'bg-[#2F6B4F] text-white'
                          : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      m²
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono">
                  {formData.surfaceUnit === 'ha' 
                    ? `= ${(formData.surfaceValue * 10000).toLocaleString('fr-FR')} m²` 
                    : `= ${(formData.surfaceValue / 10000).toFixed(2)} ha`}
                </p>
              </div>

              {/* Parcel Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Nom du verger ou repère
                </label>
                <input
                  type="text"
                  value={formData.parcelName}
                  onChange={e => setFormData({ ...formData, parcelName: e.target.value })}
                  placeholder="ex : Parcelle Nord, Bloc 4..."
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F3] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 focus:outline-none focus:border-[#2F6B4F]"
                />
              </div>
            </div>

            {/* CARD 2: IRRIGATION SYSTEM & PUMP */}
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <Droplets className="w-4 h-4 text-[#2F6F8F]" />
                <h3 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">2. Système d'Arrosage & Pompe</h3>
              </div>

              {/* System Type */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Méthode d'arrosage
                </label>
                <select
                  value={formData.irrigationSystemId}
                  onChange={e => {
                    const sys = IRRIGATION_SYSTEMS.find(s => s.id === e.target.value) || selectedSystem;
                    setFormData({
                      ...formData,
                      irrigationSystemId: e.target.value as IrrigationSystemType,
                      customEfficiency: sys.defaultEfficiency
                    });
                  }}
                  className="w-full px-3 py-2.5 text-xs bg-[#F7F7F3] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 font-bold focus:outline-none focus:border-[#2F6B4F]"
                >
                  {IRRIGATION_SYSTEMS.map(sys => (
                    <option key={sys.id} value={sys.id}>
                      {sys.name} (Efficience : {sys.defaultEfficiency}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Pump Flow Rate with Direct Unit */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Débit de votre pompe ou vanne
                  </label>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {formData.flowUnit === 'm3_h' ? 'm³/heure' : 'Litres/sec'}
                  </span>
                </div>
                
                <div className="flex rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden bg-[#F7F7F3] dark:bg-stone-800 focus-within:border-[#2F6B4F]">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={formData.flowRate}
                    onChange={e => setFormData({ ...formData, flowRate: Math.max(1, parseFloat(e.target.value) || 0) })}
                    className="w-full px-3 py-2 text-sm bg-transparent border-none focus:outline-none text-[#1F2933] dark:text-stone-100 font-mono font-bold"
                    required
                  />
                  <div className="flex border-l border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-700">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, flowUnit: 'm3_h' })}
                      className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                        formData.flowUnit === 'm3_h'
                          ? 'bg-[#2F6B4F] text-white'
                          : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      m³/h
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, flowUnit: 'l_s' })}
                      className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                        formData.flowUnit === 'l_s'
                          ? 'bg-[#2F6B4F] text-white'
                          : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      L/s
                    </button>
                  </div>
                </div>

                {/* Common Flow Buttons */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-stone-500 font-medium">Débits fréquents :</span>
                  {[15, 25, 35, 50, 70].map(flowVal => (
                    <button
                      key={flowVal}
                      type="button"
                      onClick={() => setFormData({ ...formData, flowRate: flowVal, flowUnit: 'm3_h' })}
                      className={`px-2 py-0.5 text-[10px] rounded font-mono font-bold border transition-colors cursor-pointer ${
                        formData.flowRate === flowVal && formData.flowUnit === 'm3_h'
                          ? 'bg-[#2F6B4F] text-white border-[#2F6B4F]'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {flowVal} m³/h
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional: Actual Duration (Audit) */}
              <div className="p-3 bg-[#F7F7F3] dark:bg-stone-800/80 rounded-lg border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200">
                  <Clock className="w-3.5 h-3.5 text-[#2F6B4F]" />
                  <span>Durée habituelle programmée (facultatif)</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Renseignez combien d'heures vous prévoyez d'arroser pour vérifier si cela couvre vos arbres.
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={formData.actualDurationHours ?? 0}
                      onChange={e => setFormData({ ...formData, actualDurationHours: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full px-2 py-1 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded text-center font-mono font-bold"
                    />
                    <span className="text-[10px] text-stone-400 block text-center mt-0.5">heures</span>
                  </div>
                  <span className="font-bold text-stone-400">:</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      step="5"
                      value={formData.actualDurationMinutes ?? 0}
                      onChange={e => setFormData({ ...formData, actualDurationMinutes: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)) })}
                      className="w-full px-2 py-1 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded text-center font-mono font-bold"
                    />
                    <span className="text-[10px] text-stone-400 block text-center mt-0.5">minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: REGION, SEASON & WEATHER */}
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <Sun className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">3. Région & Météo</h3>
              </div>

              {/* Agricultural Region */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Bassin agricole
                </label>
                <select
                  value={formData.regionId}
                  onChange={e => handleRegionOrMonthChange(e.target.value, formData.month)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F3] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 font-medium focus:outline-none focus:border-[#2F6B4F]"
                >
                  {MOROCCAN_REGIONS.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Mois d'arrosage
                </label>
                <select
                  value={formData.month}
                  onChange={e => handleRegionOrMonthChange(formData.regionId, parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F3] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 font-medium focus:outline-none focus:border-[#2F6B4F]"
                >
                  {Object.entries(MONTH_NAMES).map(([mNum, name]) => (
                    <option key={mNum} value={mNum}>
                      {name} (évaporation moyenne : {selectedRegion.monthlyEt0[parseInt(mNum)]} mm/j)
                    </option>
                  ))}
                </select>
              </div>

              {/* Rainfall */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Pluie tombée aujourd'hui (mm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.rainfall}
                    onChange={e => setFormData({ ...formData, rainfall: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-full px-3 py-2 text-xs bg-[#F7F7F3] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 font-mono font-bold focus:outline-none focus:border-[#2F6B4F]"
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-stone-400 font-semibold">mm</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  0 mm si temps sec et ensoleillé.
                </p>
              </div>

              {/* Quick Estimate Preview Card */}
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#2F6B4F] dark:text-emerald-300 block">
                  Estimation directe en temps réel
                </span>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-stone-600 dark:text-stone-300">Volume estimé :</span>
                  <span className="text-sm font-bold font-mono text-[#1F2933] dark:text-stone-100">
                    ~{estimatedDailyVolume.toLocaleString('fr-FR')} m³
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-stone-600 dark:text-stone-300">Durée recommandée :</span>
                  <span className="text-sm font-bold font-mono text-[#2F6B4F] dark:text-emerald-400">
                    ~{estH}h {estM > 0 ? `${estM}min` : '00min'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Big Action Submit Button */}
          <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-stone-500 dark:text-stone-400 text-center sm:text-left">
              <span>Prêt pour le diagnostic • Calcul du volume d'eau et de la durée d'ouverture de vanne</span>
            </div>

            <button
              id="btn-calculate-express"
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-extrabold text-white bg-[#2F6B4F] hover:bg-[#24563F] active:scale-[0.99] rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10"
            >
              <Droplets className="w-5 h-5 text-white" />
              <span>CALCULER L'ARROSAGE DU JOUR</span>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </button>
          </div>

        </form>
      )}

      {/* ========================================================= */}
      {/* MODE 2: ADVANCED MULTI-STEP WIZARD (FOR DETAILED AUDIT) */}
      {/* ========================================================= */}
      {calculatorMode === 'advanced' && (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs overflow-hidden">
          
          {/* Step Indicator Bar */}
          <div className="p-4 bg-[#F7F7F3] dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {steps.map((step) => {
              const isCurrent = activeStep === step.num;
              const isCompleted = activeStep > step.num;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(step.num as any)}
                  className={`p-2.5 rounded-lg text-left transition-colors cursor-pointer border ${
                    isCurrent 
                      ? 'bg-[#2F6B4F]/10 dark:bg-emerald-950/60 border-[#2F6B4F] text-[#173F35] dark:text-emerald-200 font-semibold' 
                      : isCompleted
                      ? 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-[#1F2933] dark:text-stone-300 hover:bg-[#F7F7F3]'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400 hover:bg-[#F7F7F3]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      {step.title}
                    </span>
                    {isCompleted && (
                      <span className="w-4 h-4 rounded-full bg-[#2F6B4F] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                    {step.summary}
                  </div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleExecuteCalculation} className="p-5 sm:p-6 space-y-6">
            
            {/* STEP 1: PARCEL & SOIL */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-stone-100 dark:border-stone-800 pb-2">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Étape 1 — Paramètres de la parcelle</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Identification du lot, superficie, bassin hydraulique régional et nature du sol.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Nom ou référence de la parcelle
                    </label>
                    <input
                      type="text"
                      value={formData.parcelName}
                      onChange={e => setFormData({ ...formData, parcelName: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#2F6B4F]"
                      placeholder="ex : Verger Clémentiniers — Bloc A"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Superficie irriguée
                    </label>
                    <div className="flex rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden bg-stone-50 dark:bg-stone-800 focus-within:border-[#2F6B4F]">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.surfaceValue}
                        onChange={e => setFormData({ ...formData, surfaceValue: Math.max(0.01, parseFloat(e.target.value) || 0) })}
                        className="w-full px-3 py-2 text-sm bg-transparent border-none focus:outline-none text-stone-900 dark:text-stone-100 font-mono font-bold"
                        required
                      />
                      <div className="flex border-l border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-700">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, surfaceUnit: 'ha' })}
                          className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                            formData.surfaceUnit === 'ha'
                              ? 'bg-[#2F6B4F] text-white'
                              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                          }`}
                        >
                          ha
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, surfaceUnit: 'm2' })}
                          className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                            formData.surfaceUnit === 'm2'
                              ? 'bg-[#2F6B4F] text-white'
                              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                          }`}
                        >
                          m²
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Région agricole
                    </label>
                    <select
                      value={formData.regionId}
                      onChange={e => handleRegionOrMonthChange(e.target.value, formData.month)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:border-[#2F6B4F]"
                    >
                      {MOROCCAN_REGIONS.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Type de sol
                    </label>
                    <select
                      value={formData.soilId}
                      onChange={e => setFormData({ ...formData, soilId: e.target.value as SoilTypeKey })}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:border-[#2F6B4F]"
                    >
                      {MOROCCAN_SOILS.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.localName} ({s.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CROP & KC */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="border-b border-stone-100 dark:border-stone-800 pb-2">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Étape 2 — Culture & Stade phénologique</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Sélection de la spéculation végétale et ajustement du coefficient cultural (Kc).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Culture
                    </label>
                    <select
                      value={formData.cropId}
                      onChange={e => handleCropOrStageChange(e.target.value, formData.growthStage)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:border-[#2F6B4F]"
                    >
                      {MOROCCAN_CROPS.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Stade végétatif
                    </label>
                    <select
                      value={formData.growthStage}
                      onChange={e => handleCropOrStageChange(formData.cropId, e.target.value as GrowthStage)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:border-[#2F6B4F]"
                    >
                      {Object.entries(selectedCrop.stages).map(([stageKey, info]) => (
                        <option key={stageKey} value={stageKey}>
                          {info.label} (Kc : {info.kc})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Ajustement manuel du Kc (Optionnel)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.1"
                      max="1.5"
                      value={formData.customKc ?? currentStageInfo.kc}
                      onChange={e => setFormData({ ...formData, customKc: parseFloat(e.target.value) || currentStageInfo.kc })}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono font-bold focus:outline-none focus:border-[#2F6B4F]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: SYSTEM & EFFICIENCY */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <div className="border-b border-stone-100 dark:border-stone-800 pb-2">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Étape 3 — Système d'irrigation & Débit</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Efficience d'application du réseau et débit volumétrique disponible.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Système d'irrigation
                    </label>
                    <select
                      value={formData.irrigationSystemId}
                      onChange={e => {
                        const sys = IRRIGATION_SYSTEMS.find(s => s.id === e.target.value) || selectedSystem;
                        setFormData({
                          ...formData,
                          irrigationSystemId: e.target.value as IrrigationSystemType,
                          customEfficiency: sys.defaultEfficiency
                        });
                      }}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:border-[#2F6B4F]"
                    >
                      {IRRIGATION_SYSTEMS.map(sys => (
                        <option key={sys.id} value={sys.id}>
                          {sys.name} (Efficience : {sys.defaultEfficiency}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Débit de la station de pompage
                    </label>
                    <div className="flex rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden bg-stone-50 dark:bg-stone-800 focus-within:border-[#2F6B4F]">
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        value={formData.flowRate}
                        onChange={e => setFormData({ ...formData, flowRate: Math.max(1, parseFloat(e.target.value) || 0) })}
                        className="w-full px-3 py-2 text-sm bg-transparent border-none focus:outline-none text-stone-900 dark:text-stone-100 font-mono font-bold"
                        required
                      />
                      <div className="flex border-l border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-700">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, flowUnit: 'm3_h' })}
                          className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                            formData.flowUnit === 'm3_h'
                              ? 'bg-[#2F6B4F] text-white'
                              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                          }`}
                        >
                          m³/h
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, flowUnit: 'l_s' })}
                          className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                            formData.flowUnit === 'l_s'
                              ? 'bg-[#2F6B4F] text-white'
                              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                          }`}
                        >
                          L/s
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: CLIMATE & DURATION */}
            {activeStep === 4 && (
              <div className="space-y-4">
                <div className="border-b border-stone-100 dark:border-stone-800 pb-2">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Étape 4 — Climat & Audit de durée</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Évapotranspiration de référence ET₀ et confrontation avec la durée réelle.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      ET₀ (Évapotranspiration journalière)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="15"
                        value={formData.et0}
                        onChange={e => setFormData({ ...formData, et0: Math.max(0.1, parseFloat(e.target.value) || 0) })}
                        className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono font-bold focus:outline-none focus:border-[#2F6B4F]"
                        required
                      />
                      <span className="absolute right-3 top-2 text-xs text-stone-400 font-semibold">mm/jour</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Précipitations (Pluie)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={formData.rainfall}
                        onChange={e => setFormData({ ...formData, rainfall: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono font-bold focus:outline-none focus:border-[#2F6B4F]"
                      />
                      <span className="absolute right-3 top-2 text-xs text-stone-400 font-semibold">mm</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Navigation Bar */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
              <div>
                {activeStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveStep((activeStep - 1) as any)}
                    className="px-3.5 py-2 text-xs font-semibold text-[#1F2933] dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-[#F7F7F3] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Étape précédente</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep((activeStep + 1) as any)}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#1F2933] dark:bg-stone-800 hover:bg-black rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Passer à l'étape {activeStep + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : null}

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#2F6B4F] hover:bg-[#24563F] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Calculer l'irrigation</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
