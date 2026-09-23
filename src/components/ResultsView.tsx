import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { exportCalculationToPdf } from '../utils/pdfExport';
import { 
  FileDown, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  Clock,
  Droplets,
  Gauge,
  Sun,
  Check,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

interface ResultsViewProps {
  result: CalculationResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result }) => {
  const {
    input,
    surfaceHa,
    kc,
    et0,
    etc,
    effectiveRainfall,
    netRequirementMm,
    grossRequirementMm,
    efficiency,
    volumeNeededM3,
    volumeNetM3,
    volumeLossesM3,
    flowRateM3h,
    recommendedDurationFormatted,
    actualVolumeM3,
    balanceM3,
    balanceStatus,
    balancePercentage,
    warnings,
    recommendations
  } = result;

  const [activeTab, setActiveTab] = useState<'field' | 'technical'>('field');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      await exportCalculationToPdf(result, 'results-charts-container');
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const volumeBreakdownData = [
    {
      name: 'Volume',
      'Besoin net utile': volumeNetM3,
      'Pertes réseau (Ea)': volumeLossesM3,
    }
  ];

  const comparisonData = actualVolumeM3 !== undefined ? [
    {
      name: 'Bilan hydrique',
      'Besoin calculé (Bb)': volumeNeededM3,
      'Volume apporté': actualVolumeM3,
    }
  ] : null;

  // Practical farmer metrics
  const citernesCount = Math.round((volumeNeededM3 * 1000) / 10000);
  const totalLitres = (volumeNeededM3 * 1000).toLocaleString('fr-FR');
  const m3PerHectare = (volumeNeededM3 / (surfaceHa || 1)).toFixed(1);

  return (
    <div className="space-y-5">
      
      {/* Top Bar: Selector between Practical Field Sheet & Detailed Technical View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#1F2933] dark:text-stone-100 flex items-center gap-2">
            <span>Prescription d'irrigation</span>
            <span className="text-xs font-normal text-stone-500">· {input.parcelName} ({surfaceHa.toFixed(2)} ha)</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Consultez les réglages d'arrosage prêts à être appliqués sur le programmateur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#F7F7F3] dark:bg-stone-800 p-1 rounded-lg border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setActiveTab('field')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                activeTab === 'field'
                  ? 'bg-[#2F6B4F] text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Fiche Terrain (Simple)
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                activeTab === 'technical'
                  ? 'bg-[#2F6B4F] text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Détails Agronomiques
            </button>
          </div>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="px-3 py-1.5 text-xs font-semibold text-[#1F2933] dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
            title="Télécharger la fiche d'arrosage"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2F6B4F]" />
            ) : (
              <FileDown className="w-3.5 h-3.5 text-[#2F6B4F]" />
            )}
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. PRACTICAL FIELD SHEET FOR FARMERS (DEFAULT)            */}
      {/* ========================================================= */}
      {activeTab === 'field' && (
        <div className="space-y-4">
          
          {/* Giant Hero Card for Sun/Field readability */}
          <div className="bg-[#173F35] text-white rounded-2xl p-6 sm:p-8 shadow-md border border-[#245246] space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/15">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-300 block">
                  Consigne principale du jour
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  Temps d'ouverture de votre vanne
                </div>
                <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl">
                  À programmer sur votre station de pompage ou vanne volumétrique pour couvrir les besoins en eau de la parcelle.
                </p>
              </div>

              {/* Big Duration Highlight */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-5 text-center sm:text-right min-w-[200px]">
                <span className="text-xs uppercase font-semibold text-emerald-200 block">Durée conseillée</span>
                <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight block mt-1">
                  {recommendedDurationFormatted}
                </span>
                <span className="text-xs text-stone-300 mt-1 block font-mono">
                  au débit de {flowRateM3h} m³/h
                </span>
              </div>
            </div>

            {/* 3 Key Practical Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
                  <Droplets className="w-4 h-4" />
                  <span>Volume d'eau requis</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                  {volumeNeededM3.toLocaleString('fr-FR')} m³
                </div>
                <div className="text-xs text-stone-300 mt-0.5">
                  soit env. {totalLitres} Litres (~{citernesCount} citernes)
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
                  <Gauge className="w-4 h-4" />
                  <span>Débit de la pompe</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                  {flowRateM3h} m³/h
                </div>
                <div className="text-xs text-stone-300 mt-0.5">
                  soit {(flowRateM3h / 3.6).toFixed(1)} Litres par seconde
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Meilleur moment d'arrosage</span>
                </div>
                <div className="text-lg font-bold text-white mt-1">
                  Matin (06h–09h)
                </div>
                <div className="text-xs text-stone-300 mt-0.5">
                  ou soir après 18h (évite l'évaporation du soleil)
                </div>
              </div>

            </div>

            {/* Water Meter / Comparison Box (If user entered duration) */}
            {actualVolumeM3 !== undefined && (
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                balanceStatus === 'optimal'
                  ? 'bg-emerald-950/60 border-emerald-400/40 text-emerald-100'
                  : balanceStatus === 'deficit'
                  ? 'bg-amber-950/70 border-amber-400/50 text-amber-100'
                  : 'bg-sky-950/70 border-sky-400/50 text-sky-100'
              }`}>
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {balanceStatus === 'optimal' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>Arrosage parfaitement équilibré ({actualVolumeM3} m³ apportés)</span>
                      </>
                    ) : balanceStatus === 'deficit' ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-300" />
                        <span>Attention : Sous-arrosage détecté ({actualVolumeM3} m³ apportés)</span>
                      </>
                    ) : (
                      <>
                        <Info className="w-4 h-4 text-sky-300" />
                        <span>Sur-arrosage constaté ({actualVolumeM3} m³ apportés)</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-stone-200 mt-1">
                    {balanceStatus === 'optimal'
                      ? 'La durée que vous avez saisie couvre exactement les besoins de la culture sans gaspillage.'
                      : balanceStatus === 'deficit'
                      ? `Il manque environ ${Math.abs(balanceM3 || 0)} m³ d'eau. Risque de ralentissement de croissance ou de chute des fruits.`
                      : `Vous apportez ${Math.abs(balanceM3 || 0)} m³ d'eau de plus que nécessaire. Vous pouvez réduire votre temps de pompe pour économiser l'électricité.`}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white/10 border border-white/20">
                    {balancePercentage}% du besoin
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Practical Field Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F2933] dark:text-stone-100">
                <Gauge className="w-4 h-4 text-[#2F6B4F]" />
                <span>1. Contrôle manomètre</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Vérifiez la pression en tête de parcelle. Pour un réseau goutte-à-goutte, maintenez entre <strong>1,0 et 1,5 bar</strong> pour garantir un débit uniforme de tous les goutteurs.
              </p>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F2933] dark:text-stone-100">
                <Droplets className="w-4 h-4 text-[#2F6F8F]" />
                <span>2. Inspection des rampes</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Faites un tour de vanne pour vérifier l'absence de fuites sur les raccords et déboucher les goutteurs obstrués par le calcaire ou les dépôts.
              </p>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F2933] dark:text-stone-100">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>3. Filtration station</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Procédez au contre-lavage régulier du filtre à sable ou des filtres à disques pour éviter les pertes de charge et la surchauffe de la pompe.
              </p>
            </div>

          </div>

          {/* Action Row */}
          <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-stone-500 dark:text-stone-400">
              Besoin d'une trace écrite pour votre chef de culture ou ouvrier de vanne ?
            </div>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#2F6B4F] hover:bg-[#24563F] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Création du PDF...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Bulletin téléchargé !</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Imprimer / Télécharger la fiche d'arrosage (PDF)</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TECHNICAL / AGRONOMIC VIEW (FOR DETAILED METRICS)      */}
      {/* ========================================================= */}
      {activeTab === 'technical' && (
        <div className="space-y-5">
          
          {/* Secondary Calculated Values Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">ETc (ET₀ × Kc)</span>
              <span className="text-lg font-bold text-[#1F2933] dark:text-stone-100 font-mono mt-0.5 block">{etc}</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">mm/jour</span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">Besoin net (Bn)</span>
              <span className="text-lg font-bold text-[#1F2933] dark:text-stone-100 font-mono mt-0.5 block">{netRequirementMm}</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">mm net/jour</span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">Besoin brut (Bb)</span>
              <span className="text-lg font-bold text-[#2F6B4F] dark:text-emerald-400 font-mono mt-0.5 block">{grossRequirementMm}</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">mm brut/jour</span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">Volume requis</span>
              <span className="text-lg font-bold text-[#1F2933] dark:text-stone-100 font-mono mt-0.5 block">{volumeNeededM3}</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">m³/jour</span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">Volume apporté</span>
              <span className="text-lg font-bold text-[#1F2933] dark:text-stone-100 font-mono mt-0.5 block">
                {actualVolumeM3 !== undefined ? actualVolumeM3 : '—'}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">m³ pompés</span>
            </div>

            <div className={`p-3 rounded-lg border ${
              balanceStatus === 'deficit'
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                : balanceStatus === 'surplus'
                ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-[#2F6F8F] dark:text-sky-300'
                : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-[#2F6B4F] dark:text-emerald-300'
            }`}>
              <span className="text-[10px] uppercase font-bold block opacity-80">Bilan d'arrosage</span>
              <span className="text-lg font-bold font-mono mt-0.5 block">
                {balanceM3 !== undefined ? (balanceM3 > 0 ? `+${balanceM3}` : balanceM3) : 'Équilibré'}
              </span>
              <span className="text-[10px] capitalize opacity-80">
                {balanceStatus === 'deficit' ? 'Déficit hydrique' : balanceStatus === 'surplus' ? 'Sur-arrosage' : 'Optimal'}
              </span>
            </div>
          </div>

          {/* Water Balance Flow Visualization */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Chaîne du bilan hydrique</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Décomposition physique étape par étape depuis la demande atmosphérique jusqu'au volume distribué.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 block">1. Demande culture (ETc)</span>
                <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono mt-1 block">{etc} mm/jour</span>
                <span className="text-[10px] text-stone-400">ET₀ ({et0}) × Kc ({kc.toFixed(2)})</span>
              </div>

              <div className="hidden md:flex justify-center text-stone-400">
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 block">2. Pluie efficace (Peff)</span>
                <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono mt-1 block">{effectiveRainfall} mm/jour</span>
                <span className="text-[10px] text-stone-400">Déduction pluie</span>
              </div>

              <div className="hidden md:flex justify-center text-stone-400">
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 block">3. Besoin net (Bn)</span>
                <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono mt-1 block">{netRequirementMm} mm/jour</span>
                <span className="text-[10px] text-stone-400">Utile aux racines</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
              <div className="p-3 bg-[#2F6B4F]/10 dark:bg-emerald-950/40 rounded-lg border border-[#2F6B4F]/30 dark:border-emerald-800 text-center">
                <span className="text-[10px] font-bold uppercase text-[#173F35] dark:text-emerald-300 block">4. Besoin brut requis (Bb)</span>
                <span className="text-base font-bold text-[#173F35] dark:text-emerald-200 font-mono mt-1 block">{grossRequirementMm} mm/jour</span>
                <span className="text-[10px] text-[#2F6B4F] dark:text-emerald-400">Bn / (Ea {efficiency}%) = {volumeNeededM3} m³</span>
              </div>

              <div className="hidden md:flex justify-center text-stone-400">
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 block">5. Volume apporté</span>
                <span className="text-base font-bold text-[#1F2933] dark:text-stone-100 font-mono mt-1 block">
                  {actualVolumeM3 !== undefined ? `${actualVolumeM3} m³` : `${volumeNeededM3} m³`}
                </span>
                <span className="text-[10px] text-stone-400">
                  {balancePercentage ? `${balancePercentage}% de couverture` : '100% ciblé'}
                </span>
              </div>
            </div>
          </div>

          {/* Analytical Charts */}
          <div id="results-charts-container" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">Décomposition des volumes (m³)</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Eau utile aux racines vs. pertes de réseau</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#1F2933] dark:text-stone-200 bg-[#F7F7F3] dark:bg-stone-800 px-2 py-0.5 rounded">
                  Total : {volumeNeededM3} m³
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeBreakdownData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#88888825" />
                    <XAxis type="number" unit=" m³" tick={{ fontSize: 11, fill: '#78716C' }} />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip 
                      formatter={(val: any) => [`${val} m³`, '']}
                      contentStyle={{ backgroundColor: '#1F2933', color: '#fff', borderRadius: '6px', fontSize: '11px', border: 'none' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="Besoin net utile" stackId="a" fill="#2F6B4F" radius={[4, 0, 0, 4]} />
                    <Bar dataKey="Pertes réseau (Ea)" stackId="a" fill="#C27838" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                <span>Absorption racinaire : <strong className="text-[#1F2933] dark:text-stone-200 font-mono">{volumeNetM3} m³ ({Math.round((volumeNetM3/volumeNeededM3)*100)}%)</strong></span>
                <span>Pertes réseau : <strong className="text-[#1F2933] dark:text-stone-200 font-mono">{volumeLossesM3} m³ ({Math.round((volumeLossesM3/volumeNeededM3)*100)}%)</strong></span>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">Eau apportée vs. Besoin calculé</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Vérification de l'adéquation de la durée d'arrosage</p>
                </div>
                {actualVolumeM3 !== undefined && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                    balanceStatus === 'deficit' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' :
                    balanceStatus === 'surplus' ? 'bg-sky-50 dark:bg-sky-950/60 text-[#2F6F8F] dark:text-sky-300' : 'bg-emerald-50 dark:bg-emerald-950/60 text-[#2F6B4F] dark:text-emerald-300'
                  }`}>
                    {balanceStatus === 'deficit' ? 'Déficit' : balanceStatus === 'surplus' ? 'Excédent' : 'Optimal'}
                  </span>
                )}
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {comparisonData ? (
                    <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888825" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716C' }} />
                      <YAxis unit=" m³" tick={{ fontSize: 11, fill: '#78716C' }} />
                      <Tooltip 
                        formatter={(val: any) => [`${val} m³`, '']}
                        contentStyle={{ backgroundColor: '#1F2933', color: '#fff', borderRadius: '6px', fontSize: '11px', border: 'none' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="Besoin calculé (Bb)" fill="#2F6B4F" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Volume apporté" fill={balanceStatus === 'deficit' ? '#C27838' : balanceStatus === 'surplus' ? '#2F6F8F' : '#2F6B4F'} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-stone-400">
                      Durée de pompage réelle non renseignée pour la comparaison.
                    </div>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-center justify-between">
                <span>Requis : <strong className="text-[#1F2933] dark:text-stone-200 font-mono">{volumeNeededM3} m³</strong></span>
                <span>Apporté : <strong className="text-[#1F2933] dark:text-stone-200 font-mono">{actualVolumeM3 !== undefined ? `${actualVolumeM3} m³` : 'N/A'}</strong></span>
              </div>
            </div>
          </div>

          {/* Technical Warnings & Agronomic Recommendations */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              <span>Prescriptions agronomiques & Infiltration sol</span>
            </div>

            {warnings.length > 0 && (
              <div className="space-y-2">
                {warnings.map((warn, i) => (
                  <div key={i} className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">{warn}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {recommendations.map((rec, i) => (
                <div key={i} className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-950 dark:text-emerald-200">{rec}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
