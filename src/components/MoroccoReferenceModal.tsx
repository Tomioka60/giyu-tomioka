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
  BookOpen, 
  Sprout, 
  MapPin, 
  Layers, 
  Droplets,
  ExternalLink,
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
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-950 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/60 flex items-center justify-center text-emerald-200 border border-emerald-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-['Cabinet_Grotesk'] text-white">
                  Référentiel Agronomique Certifié du Maroc
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-600">
                  INRA • FAO-56
                </span>
              </div>
              <p className="text-xs text-emerald-300 mt-0.5">
                Données d'évapotranspiration, coefficients culturaux Kc, sols marocains et normes PNEI.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 sm:px-6 overflow-x-auto gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('kc')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'kc'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-700" />
            Coefficients Kc par Culture
          </button>

          <button
            onClick={() => setActiveTab('et0')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'et0'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-700" />
            ET0 Régionales (Bassin ORMVA)
          </button>

          <button
            onClick={() => setActiveTab('sols')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'sols'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            Sols Marocains (Tirs, Hamri, Rmel)
          </button>

          <button
            onClick={() => setActiveTab('pnei')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'pnei'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Droplets className="w-4 h-4 text-emerald-700" />
            Programme PNEI & Efficience
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: KC CROPS */}
          {activeTab === 'kc' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  Valeurs certifiées de Kc selon les bulletins agronomiques de l'INRA Maroc et du document FAO 56.
                </p>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  12 cultures stratégiques
                </span>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                <table className="min-w-full divide-y divide-stone-200 text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Culture</th>
                      <th className="py-2.5 px-2 text-center">Kc Initial</th>
                      <th className="py-2.5 px-2 text-center">Kc Dév.</th>
                      <th className="py-2.5 px-2 text-center bg-emerald-50 text-emerald-950 font-black">Kc Mi-saison</th>
                      <th className="py-2.5 px-2 text-center">Kc Fin</th>
                      <th className="py-2.5 px-3">Racines (m)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {MOROCCAN_CROPS.map(crop => (
                      <tr key={crop.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 font-semibold text-stone-900">
                          {crop.name}
                          <span className="block text-[10px] font-normal text-stone-500 capitalize">
                            {crop.category.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">{crop.stages.initial.kc.toFixed(2)}</td>
                        <td className="py-2.5 px-2 text-center font-mono">{crop.stages.developpement.kc.toFixed(2)}</td>
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-emerald-700 bg-emerald-50/50">
                          {crop.stages.mi_saison.kc.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">{crop.stages.fin_saison.kc.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-stone-600 font-mono">{crop.rootDepthMeters} m</td>
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
              <p className="text-xs text-stone-600">
                Évapotranspiration de référence journalière moyenne (ET0 en mm/jour) par mois, calculée à partir des stations agro-météorologiques DMN / INRA.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOROCCAN_REGIONS.map(reg => (
                  <div key={reg.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">{reg.name}</h4>
                        <span className="text-[11px] text-emerald-800 font-medium">{reg.ormvaOrDpa}</span>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-700">
                        {reg.typicalRainfallAnnualMm} mm/an
                      </span>
                    </div>

                    <div className="grid grid-cols-6 gap-1 pt-2 border-t border-stone-200/70 text-[10px] text-center font-mono">
                      {[1, 2, 3, 4, 5, 6].map(m => (
                        <div key={m} className="bg-white p-1 rounded border border-stone-200">
                          <span className="text-stone-400 block">{MONTH_NAMES[m - 1].slice(0, 3)}</span>
                          <span className="font-bold text-stone-800">{reg.monthlyEt0[m]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-6 gap-1 text-[10px] text-center font-mono">
                      {[7, 8, 9, 10, 11, 12].map(m => (
                        <div key={m} className="bg-white p-1 rounded border border-stone-200">
                          <span className="text-stone-400 block">{MONTH_NAMES[m - 1].slice(0, 3)}</span>
                          <span className="font-bold text-emerald-800">{reg.monthlyEt0[m]}</span>
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
              <p className="text-xs text-stone-600">
                Classification des terroirs agricoles marocains et caractéristiques hydrodynamiques.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOROCCAN_SOILS.map(soil => (
                  <div key={soil.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-stone-900">{soil.name}</h4>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {soil.localName}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-1">
                      <div className="p-2 bg-white rounded border border-stone-200">
                        <span className="text-stone-400 text-[10px] block">Réserve Utile (RU)</span>
                        <span className="font-bold text-stone-900 font-mono">{soil.availableWaterCapacityMmPerM} mm/m</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-stone-200">
                        <span className="text-stone-400 text-[10px] block">Infiltration Max</span>
                        <span className="font-bold text-stone-900 font-mono">{soil.infiltrationRateMmPerHour} mm/h</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed pt-1">
                      {soil.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PNEI */}
          {activeTab === 'pnei' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950 text-white rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold">Programme National d'Économie d'Eau en Irrigation (PNEI)</h4>
                </div>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Face au stress hydrique structurel au Maroc, le PNEI et la stratégie Génération Green visent à convertir plus de 1 million d'hectares en irrigation localisée (goutte-à-goutte), avec un taux de subvention par le FDA pouvant atteindre 100% pour les petites exploitations (&lt; 5 ha).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {IRRIGATION_SYSTEMS.map(sys => (
                  <div key={sys.id} className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-stone-900">{sys.name}</h5>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        Ea : {sys.defaultEfficiency}%
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">
                      {sys.description}
                    </p>
                    <div className="text-[11px] font-semibold text-emerald-800 bg-stone-50 p-2 rounded border border-stone-200">
                      {sys.pneiStatus}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500 shrink-0">
          <span>Sources : INRA Maroc, IAV Hassan II, FAO-56, Ministère de l'Agriculture</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-colors cursor-pointer"
          >
            Fermer le guide
          </button>
        </div>

      </div>
    </div>
  );
};
