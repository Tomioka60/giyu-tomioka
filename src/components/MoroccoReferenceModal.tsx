import React, { useState } from 'react';
import { 
  MOROCCAN_CROPS, 
  MOROCCAN_REGIONS, 
  MOROCCAN_SOILS, 
  IRRIGATION_SYSTEMS, 
  MONTH_NAMES 
} from '../data/moroccoData';
import { 
  X, 
  Award, 
  Sprout, 
  MapPin, 
  Layers, 
  Droplets,
  ShieldCheck
} from 'lucide-react';

interface MoroccoReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoroccoReferenceModal: React.FC<MoroccoReferenceModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'kc' | 'et0' | 'sols' | 'pnei'>('kc');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#173F35] text-white flex items-center justify-between shrink-0 border-b border-[#173F35]/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2F6B4F] flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Référentiel agronomique
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-emerald-200 border border-white/15">
                  Données techniques
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Évapotranspiration de référence ET₀, coefficients culturaux Kc, horizons pédologiques et systèmes d'irrigation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-[#F7F7F3] dark:bg-stone-900 px-4 sm:px-6 overflow-x-auto gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('kc')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'kc'
                ? 'border-[#2F6B4F] text-[#173F35] dark:text-emerald-400 bg-white dark:bg-stone-800'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Sprout className="w-4 h-4 text-[#2F6B4F]" />
            Coefficients Kc par culture
          </button>

          <button
            onClick={() => setActiveTab('et0')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'et0'
                ? 'border-[#2F6B4F] text-[#173F35] dark:text-emerald-400 bg-white dark:bg-stone-800'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#2F6B4F]" />
            ET₀ Régionales (Bassins ORMVA)
          </button>

          <button
            onClick={() => setActiveTab('sols')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'sols'
                ? 'border-[#2F6B4F] text-[#173F35] dark:text-emerald-400 bg-white dark:bg-stone-800'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Layers className="w-4 h-4 text-[#2F6B4F]" />
            Sols marocains (Tirs, Hamri, Rmel)
          </button>

          <button
            onClick={() => setActiveTab('pnei')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'pnei'
                ? 'border-[#2F6B4F] text-[#173F35] dark:text-emerald-400 bg-white dark:bg-stone-800'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Droplets className="w-4 h-4 text-[#2F6B4F]" />
            Systèmes d'irrigation & Efficiences
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-white dark:bg-stone-900">
          
          {/* TAB 1: KC CROPS */}
          {activeTab === 'kc' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Valeurs recommandées de coefficients culturaux (Kc) par stade végétatif.
                </p>
                <span className="text-[11px] font-mono text-[#173F35] dark:text-emerald-300 bg-[#2F6B4F]/10 px-2 py-0.5 rounded border border-[#2F6B4F]/20">
                  12 cultures stratégiques
                </span>
              </div>

              <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-xs">
                <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-800 text-left text-xs">
                  <thead className="bg-[#F7F7F3] dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Culture</th>
                      <th className="py-2.5 px-2 text-center">Kc Initial</th>
                      <th className="py-2.5 px-2 text-center">Kc Dév.</th>
                      <th className="py-2.5 px-2 text-center bg-[#2F6B4F]/10 dark:bg-emerald-950/40 text-[#173F35] dark:text-emerald-300 font-black">Kc Mi-saison</th>
                      <th className="py-2.5 px-2 text-center">Kc Fin</th>
                      <th className="py-2.5 px-3">Racines (m)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200">
                    {MOROCCAN_CROPS.map(crop => (
                      <tr key={crop.id} className="hover:bg-[#F7F7F3] dark:hover:bg-stone-800/40">
                        <td className="py-2.5 px-3 font-semibold text-[#1F2933] dark:text-stone-100">
                          {crop.name}
                          <span className="block text-[10px] font-normal text-stone-500 capitalize">
                            {crop.category.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">{crop.stages.initial.kc.toFixed(2)}</td>
                        <td className="py-2.5 px-2 text-center font-mono">{crop.stages.developpement.kc.toFixed(2)}</td>
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-[#173F35] dark:text-emerald-300 bg-[#2F6B4F]/10 dark:bg-emerald-950/40">
                          {crop.stages.mi_saison.kc.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">{crop.stages.fin_saison.kc.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400 font-mono">{crop.rootDepthMeters} m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ET0 REGIONS */}
          {activeTab === 'et0' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Évapotranspiration de référence journalière moyenne (ET₀ en mm/jour) par mois, issue des stations agro-météorologiques régionales.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOROCCAN_REGIONS.map(reg => (
                  <div key={reg.id} className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F7F7F3] dark:bg-stone-800/50 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">{reg.name}</h4>
                        <span className="text-[11px] text-[#2F6B4F] dark:text-emerald-400 font-medium">{reg.ormvaOrDpa}</span>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white dark:bg-stone-900 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-[#1F2933] dark:text-stone-200">
                        {reg.typicalRainfallAnnualMm} mm/an
                      </span>
                    </div>

                    <div className="grid grid-cols-6 gap-1 pt-2 border-t border-stone-200/70 dark:border-stone-700 text-[10px] text-center font-mono">
                      {[1, 2, 3, 4, 5, 6].map(m => (
                        <div key={m} className="bg-white dark:bg-stone-900 p-1 rounded border border-stone-200 dark:border-stone-700">
                          <span className="text-stone-400 block">{MONTH_NAMES[m - 1].slice(0, 3)}</span>
                          <span className="font-bold text-[#1F2933] dark:text-stone-200">{reg.monthlyEt0[m]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-6 gap-1 text-[10px] text-center font-mono">
                      {[7, 8, 9, 10, 11, 12].map(m => (
                        <div key={m} className="bg-white dark:bg-stone-900 p-1 rounded border border-stone-200 dark:border-stone-700">
                          <span className="text-stone-400 block">{MONTH_NAMES[m - 1].slice(0, 3)}</span>
                          <span className="font-bold text-[#2F6B4F] dark:text-emerald-400">{reg.monthlyEt0[m]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MOROCCAN SOILS */}
          {activeTab === 'sols' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Classification des terroirs agricoles marocains et caractéristiques hydrodynamiques.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOROCCAN_SOILS.map(soil => (
                  <div key={soil.id} className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F7F7F3] dark:bg-stone-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">{soil.name}</h4>
                      <span className="text-[11px] font-bold text-[#173F35] dark:text-emerald-300 bg-[#2F6B4F]/10 px-2 py-0.5 rounded border border-[#2F6B4F]/20">
                        {soil.localName}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-1">
                      <div className="p-2 bg-white dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-700">
                        <span className="text-stone-400 text-[10px] block">Réserve Utile (RU)</span>
                        <span className="font-bold text-[#1F2933] dark:text-stone-100 font-mono">{soil.availableWaterCapacityMmPerM} mm/m</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-700">
                        <span className="text-stone-400 text-[10px] block">Infiltration Max</span>
                        <span className="font-bold text-[#1F2933] dark:text-stone-100 font-mono">{soil.infiltrationRateMmPerHour} mm/h</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed pt-1">
                      {soil.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EFFICIENCES */}
          {activeTab === 'pnei' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#173F35] text-white rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  <h4 className="text-sm font-bold">Optimisation de l'efficience de l'eau en irrigation</h4>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed">
                  L'adoption de l'irrigation localisée (goutte-à-goutte) permet d'atteindre une efficience d'application de 90%, minimisant les pertes par évaporation directe et réduisant significativement les volumes d'eau prélevés à la parcelle.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {IRRIGATION_SYSTEMS.map(sys => (
                  <div key={sys.id} className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">{sys.name}</h5>
                      <span className="text-xs font-bold text-[#173F35] dark:text-emerald-300 bg-[#2F6B4F]/10 px-2 py-0.5 rounded border border-[#2F6B4F]/20">
                        Ea : {sys.defaultEfficiency}%
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {sys.description}
                    </p>
                    <div className="text-[11px] font-semibold text-[#173F35] dark:text-emerald-300 bg-[#F7F7F3] dark:bg-stone-900 p-2 rounded border border-stone-200 dark:border-stone-700">
                      Plage d'efficience constatée : {sys.minEfficiency}% à {sys.maxEfficiency}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F7F7F3] dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center text-xs text-stone-500 shrink-0">
          <span>Paramètres agronomiques de référence pour le pilotage d'irrigation</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#2F6B4F] hover:bg-[#24563F] text-white font-bold transition-colors cursor-pointer"
          >
            Fermer le guide
          </button>
        </div>

      </div>
    </div>
  );
};
