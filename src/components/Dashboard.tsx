import React from 'react';
import { 
  ArrowRight, 
  Droplets, 
  HelpCircle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { CalculationResult, Parcel } from '../types';

interface DashboardProps {
  parcels: Parcel[];
  history: CalculationResult[];
  latestResult: CalculationResult | null;
  onNavigateToCalculator: () => void;
  onNavigateToParcels: () => void;
  onNavigateToHistory: () => void;
  onSelectHistoricalResult: (result: CalculationResult) => void;
  onSelectParcel: (parcel: Parcel) => void;
  onOpenGuide: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  parcels,
  history,
  latestResult,
  onNavigateToCalculator,
  onNavigateToParcels,
  onNavigateToHistory,
  onSelectHistoricalResult,
  onSelectParcel,
  onOpenGuide,
}) => {
  // Aggregate KPIs
  const totalWaterRequired = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.volumeNeededM3, 0) / history.length)
    : (latestResult ? latestResult.volumeNeededM3 : 0);

  const totalWaterUsed = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + (h.actualVolumeM3 ?? h.volumeNeededM3), 0) / history.length)
    : (latestResult ? (latestResult.actualVolumeM3 ?? latestResult.volumeNeededM3) : 0);

  const avgEfficiency = history.length > 0
    ? Math.round(history.reduce((acc, h) => acc + h.efficiency, 0) / history.length)
    : (latestResult ? latestResult.efficiency : 90);

  const activeParcelsCount = parcels.length;
  const totalAreaHa = parcels.reduce((acc, p) => acc + p.areaHa, 0);

  // Water usage chart data: 7-day monitoring trend
  const usageTrendData = [
    { day: 'Lun', required: 165, applied: 160 },
    { day: 'Mar', required: 172, applied: 170 },
    { day: 'Mer', required: 180, applied: 185 },
    { day: 'Jeu', required: 155, applied: 155 },
    { day: 'Ven', required: 190, applied: 180 },
    { day: 'Sam', required: 182, applied: 182 },
    { day: 'Dim', required: 175, applied: 170 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2933] dark:text-stone-100">
            Tableau de bord d'exploitation
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Pilotage simple de l'arrosage : calculez le volume d'eau et le temps de vanne pour chaque parcelle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="px-3 py-2 text-xs font-semibold text-[#1F2933] dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-[#F7F7F3] dark:hover:bg-stone-700 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#2F6B4F]" />
            <span>Tables agronomiques</span>
          </button>
          <button
            id="dashboard-new-calc-btn"
            onClick={onNavigateToCalculator}
            className="px-4 py-2 text-xs font-bold text-white bg-[#2F6B4F] hover:bg-[#24563F] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
          >
            <span>Calculer l'arrosage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Guide Rapide pour l'Agriculteur (3 étapes terrain) */}
      <div className="bg-[#173F35] text-white rounded-2xl p-5 sm:p-6 border border-[#245246] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">
              Guide pratique terrain
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Comment doser votre arrosage en 3 étapes simples ?
            </h2>
          </div>
          <button
            onClick={onNavigateToCalculator}
            className="self-start md:self-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Lancer un calcul express</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold">1</span>
              <span>Choisissez votre culture</span>
            </div>
            <p className="text-xs text-stone-200 mt-2">
              Indiquez la superficie (en ha ou m²) et le stade de développement (ex: floraison, grossissement des fruits).
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold">2</span>
              <span>Débit de votre pompe</span>
            </div>
            <p className="text-xs text-stone-200 mt-2">
              Sélectionnez votre débit habituel (ex : 25, 35 ou 50 m³/h). L'application adapte le calcul immédiatement.
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold">3</span>
              <span>Ouvrez vos vannes</span>
            </div>
            <p className="text-xs text-stone-200 mt-2">
              Obtenez le nombre précis d'heures et de minutes d'ouverture pour éviter le stress hydrique et le gaspillage d'eau.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards: 4 cards with intentional hierarchy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dominant KPI: Water Required */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-[#2F6B4F]/40 dark:border-[#2F6B4F]/60 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#173F35] dark:text-emerald-300">
                Besoin d'eau requis
              </span>
              <span className="text-[10px] font-semibold text-[#173F35] dark:text-emerald-300 bg-[#173F35]/10 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-[#173F35]/20 dark:border-emerald-800">
                Aujourd'hui
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-[#1F2933] dark:text-stone-100 font-mono tracking-tight">
                {totalWaterRequired.toLocaleString('fr-FR')}
              </span>
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">m³/jour</span>
            </div>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <span>Dose moyenne</span>
            <span className="font-semibold text-[#2F6B4F] dark:text-emerald-400 font-mono">
              {(totalWaterRequired / (totalAreaHa || 1)).toFixed(1)} m³/ha
            </span>
          </p>
        </div>

        {/* KPI 2: Water Used */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Eau apportée
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#2F6F8F]" title="Apports réels" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-[#1F2933] dark:text-stone-100 font-mono tracking-tight">
                {totalWaterUsed.toLocaleString('fr-FR')}
              </span>
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">m³/jour</span>
            </div>
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <span>Taux de couverture</span>
            <span className={`font-semibold font-mono ${
              totalWaterUsed >= totalWaterRequired ? 'text-[#2F6B4F] dark:text-emerald-400' : 'text-[#2F6F8F] dark:text-sky-400'
            }`}>
              {totalWaterRequired > 0 
                ? `${Math.round((totalWaterUsed / totalWaterRequired) * 100)}% couvert`
                : '100%'}
            </span>
          </div>
        </div>

        {/* KPI 3: Irrigation Efficiency */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Efficience réseau
              </span>
              <span className="text-[10px] font-semibold text-[#2F6B4F] dark:text-emerald-400 font-mono">Ea</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-[#1F2933] dark:text-stone-100 font-mono tracking-tight">
                {avgEfficiency}%
              </span>
            </div>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            Réseau goutte-à-goutte / aspersion
          </p>
        </div>

        {/* KPI 4: Active Parcels */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Parcelles actives
              </span>
              <Layers className="w-4 h-4 text-stone-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-[#1F2933] dark:text-stone-100 font-mono tracking-tight">
                {activeParcelsCount}
              </span>
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">unités</span>
            </div>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <span>Superficie totale</span>
            <span className="font-semibold text-[#1F2933] dark:text-stone-200 font-mono">{totalAreaHa.toFixed(1)} ha</span>
          </p>
        </div>
      </div>

      {/* Main Monitoring Section: Water Usage Chart */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">Suivi des apports en eau (m³/jour)</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Comparaison entre les besoins bruts calculés (Bb) et les volumes réels distribués.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#2F6B4F] inline-block" />
              <span className="text-[#1F2933] dark:text-stone-300 font-medium">Besoin requis (Bb)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#2F6F8F] inline-block" />
              <span className="text-[#1F2933] dark:text-stone-300 font-medium">Apport réel</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#1F2933' }} />
              <YAxis unit=" m³" tick={{ fontSize: 11, fill: '#1F2933' }} />
              <Tooltip
                formatter={(val: any) => [`${val} m³`, '']}
                contentStyle={{ 
                  backgroundColor: '#1F2933', 
                  color: '#FFFFFF', 
                  borderRadius: '8px', 
                  fontSize: '11px',
                  border: '1px solid #374151' 
                }}
              />
              <Area 
                type="monotone" 
                dataKey="required" 
                stroke="#2F6B4F" 
                strokeWidth={2}
                fill="#2F6B4F" 
                fillOpacity={0.15} 
              />
              <Area 
                type="monotone" 
                dataKey="applied" 
                stroke="#2F6F8F" 
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column Lower Grid: Recent Calculations & Your Parcels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Calculations */}
        <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">Dernières prescriptions</h2>
              <button
                onClick={onNavigateToHistory}
                className="text-xs font-semibold text-[#2F6B4F] dark:text-emerald-400 hover:text-[#173F35] cursor-pointer inline-flex items-center gap-1"
              >
                <span>Tout voir</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {history.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-stone-200 dark:border-stone-800 rounded-lg">
                <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">Aucune prescription enregistrée</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Lancez un calcul pour consigner les apports ici.</p>
                <button
                  onClick={onNavigateToCalculator}
                  className="mt-3 px-3 py-1.5 text-xs font-bold text-white bg-[#2F6B4F] hover:bg-[#24563F] rounded-lg transition-colors cursor-pointer"
                >
                  Lancer un calcul
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectHistoricalResult(item)}
                    className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-[#2F6B4F] dark:hover:border-emerald-500/60 hover:bg-[#F7F7F3] dark:hover:bg-stone-800/60 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1F2933] dark:text-stone-100">{item.input.parcelName}</span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400">
                          {item.surfaceHa.toFixed(1)} ha
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                        <span>Req : <strong className="text-[#1F2933] dark:text-stone-200 font-mono">{item.volumeNeededM3} m³</strong></span>
                        <span>•</span>
                        <span>Durée : <strong className="text-[#2F6B4F] dark:text-emerald-400 font-mono">{item.recommendedDurationFormatted}</strong></span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                      item.balanceStatus === 'deficit'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : item.balanceStatus === 'surplus'
                        ? 'bg-sky-50 dark:bg-sky-950/60 text-[#2F6F8F] dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-[#2F6B4F] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {item.balanceStatus === 'optimal' ? 'Optimal' : item.balanceStatus === 'deficit' ? 'Déficit' : item.balanceStatus === 'surplus' ? 'Excédent' : 'Couvert'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Your Parcels */}
        <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">Vos parcelles</h2>
              <button
                onClick={onNavigateToParcels}
                className="text-xs font-semibold text-[#2F6B4F] dark:text-emerald-400 hover:text-[#173F35] cursor-pointer inline-flex items-center gap-1"
              >
                <span>Gérer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {parcels.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-stone-200 dark:border-stone-800 rounded-lg">
                <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">Aucune parcelle configurée</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Enregistrez vos parcelles agricoles pour faciliter le suivi.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {parcels.slice(0, 4).map((parcel) => (
                  <div
                    key={parcel.id}
                    onClick={() => onSelectParcel(parcel)}
                    className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-[#2F6B4F] dark:hover:border-emerald-500/60 hover:bg-[#F7F7F3] dark:hover:bg-stone-800/60 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1F2933] dark:text-stone-100">{parcel.name}</span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                          {parcel.areaHa} ha
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        <span>{parcel.location}</span>
                        <span className="mx-1.5">•</span>
                        <span>Débit : {parcel.flowRate} {parcel.flowUnit === 'm3_h' ? 'm³/h' : 'L/s'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-[#1F2933] dark:text-stone-100 font-mono">
                        {parcel.waterRequirementM3Day} m³/jour
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Dernier : {parcel.latestIrrigationDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
