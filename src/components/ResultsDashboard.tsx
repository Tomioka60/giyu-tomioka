import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { exportCalculationToPdf } from '../utils/pdfExport';
import { 
  Droplets, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  BarChart3, 
  Compass, 
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Sprout,
  FileDown,
  Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Cell,
  CartesianGrid
} from 'recharts';

interface ResultsDashboardProps {
  result: CalculationResult;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
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

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfExportSuccess, setPdfExportSuccess] = useState(false);

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      await exportCalculationToPdf(result, 'results-charts-container');
      setPdfExportSuccess(true);
      setTimeout(() => setPdfExportSuccess(false), 4500);
    } catch (error) {
      console.error('Erreur export PDF:', error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Chart data 1: Volume decomposition
  const volumeData = [
    {
      name: 'Volume Brut Requis',
      'Eau utile aux racines': volumeNetM3,
      'Pertes réseau (Ea)': volumeLossesM3,
    }
  ];

  if (effectiveRainfall > 0) {
    (volumeData[0] as any)['Économie Pluie'] = Number((effectiveRainfall * surfaceHa * 10).toFixed(1));
  }

  // Chart data 2: Bilan comparatif (Besoin vs Apport Réel si renseigné)
  const comparisonData = actualVolumeM3 !== undefined ? [
    {
      name: 'Bilan Hydrique',
      'Besoin Requis (m³)': volumeNeededM3,
      'Apport Réel (m³)': actualVolumeM3,
    }
  ] : null;

  // Chart data 3: Projection hebdomadaire (7 jours)
  const weeklyProjection = [
    { day: 'J+1', volume: volumeNeededM3 },
    { day: 'J+2', volume: volumeNeededM3 },
    { day: 'J+3', volume: volumeNeededM3 },
    { day: 'J+4', volume: volumeNeededM3 },
    { day: 'J+5', volume: volumeNeededM3 },
    { day: 'J+6', volume: volumeNeededM3 },
    { day: 'J+7', volume: volumeNeededM3 },
  ];

  return (
    <div className="space-y-6">

      {/* Overview Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-850 to-teal-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-700/60 text-emerald-200 border border-emerald-600/40">
                Résultats du Calcul • {input.parcelName}
              </span>
              <span className="text-xs text-emerald-300/80">
                {surfaceHa.toFixed(2)} ha • {input.growthStage}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Cabinet_Grotesk'] text-white">
              Bilan & Prescription d'Irrigation
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
              Calcul conforme au référentiel INRA Maroc & bulletin FAO-56 pour une irrigation efficiente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Bouton Exporter en PDF dans le banner */}
            <button
              id="export-pdf-banner-btn"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-emerald-900 hover:bg-emerald-50 active:bg-emerald-100 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group border border-white/20"
              title="Télécharger le bulletin technique complet d'irrigation en format PDF A4"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                  <span>Génération du PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
                  <span>Exporter en PDF</span>
                </>
              )}
            </button>

            {/* Key Metric Badge: Durée recommandée */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 text-center sm:text-right">
              <span className="text-[11px] sm:text-xs text-emerald-200 font-semibold block uppercase tracking-wider">
                Durée recommandée
              </span>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono mt-0.5 block">
                {recommendedDurationFormatted}
              </span>
              <span className="text-[11px] text-emerald-300 block mt-0.5">
                Au débit de {flowRateM3h} m³/h
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Export Notification & Fast-Action Banner */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-3.5 px-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <FileDown className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-stone-900">
                Bulletin Technique d'Irrigation (Rapport A4 Imprimable)
              </p>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70 hidden sm:inline-block">
                Conforme INRA & PNEI
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Téléchargez le document complet avec détail des formules, volumes utiles, pertes, bilan et annexes graphiques.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center">
          {pdfExportSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>PDF prêt et téléchargé !</span>
            </span>
          )}
          <button
            id="export-pdf-action-bar-btn"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Création du rapport...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>Télécharger Rapport PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6 Key Results Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Card 1: ETc & Climat */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Évapotranspiration Culture (ETc)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-stone-900 font-mono">
                {etc}
              </span>
              <span className="text-sm font-semibold text-stone-500">mm/jour</span>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
              <div className="flex justify-between">
                <span>ET0 régionale :</span>
                <span className="font-semibold text-stone-900">{et0} mm/j</span>
              </div>
              <div className="flex justify-between">
                <span>Coefficient cultural (Kc) :</span>
                <span className="font-bold text-emerald-700">{kc.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Formule :</span>
                <span className="font-mono text-[11px] text-stone-500">ET0 × Kc</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Besoins Net & Brut */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Besoins en Eau (Lame)
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-emerald-900 font-mono">
                {grossRequirementMm}
              </span>
              <span className="text-sm font-semibold text-stone-500">mm brut/jour</span>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
              <div className="flex justify-between">
                <span>Besoin net (Bn) :</span>
                <span className="font-bold text-stone-900">{netRequirementMm} mm/j</span>
              </div>
              <div className="flex justify-between">
                <span>Efficacité système (Ea) :</span>
                <span className="font-semibold text-emerald-800">{efficiency}%</span>
              </div>
              <div className="flex justify-between">
                <span>Pluie efficace déduite :</span>
                <span className="font-semibold text-stone-700">{effectiveRainfall} mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Volume d'eau nécessaire */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Volume Brut Nécessaire
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-blue-950 font-mono">
                {volumeNeededM3.toLocaleString('fr-FR')}
              </span>
              <span className="text-sm font-semibold text-stone-500">m³</span>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
              <div className="flex justify-between">
                <span>Volume utile net :</span>
                <span className="font-bold text-stone-900">{volumeNetM3.toLocaleString('fr-FR')} m³</span>
              </div>
              <div className="flex justify-between">
                <span>Pertes d'application :</span>
                <span className="font-semibold text-amber-700">+{volumeLossesM3.toLocaleString('fr-FR')} m³</span>
              </div>
              <div className="flex justify-between">
                <span>Dose à l'hectare :</span>
                <span className="font-mono text-stone-700">{(volumeNeededM3 / surfaceHa).toFixed(1)} m³/ha</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Durée d'irrigation */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Durée d'Irrigation
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-stone-900 font-mono">
                {recommendedDurationFormatted}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
              <div className="flex justify-between">
                <span>Débit de la station :</span>
                <span className="font-bold text-stone-900">{flowRateM3h} m³/h</span>
              </div>
              <div className="flex justify-between">
                <span>En heures décimales :</span>
                <span className="font-mono text-stone-700">{result.recommendedDurationHours} h</span>
              </div>
              <div className="flex justify-between">
                <span>Formule :</span>
                <span className="font-mono text-[11px] text-stone-500">Volume (m³) / Débit (m³/h)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Volume Réellement Apporté */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Volume Réellement Apporté
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            {actualVolumeM3 !== undefined ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-purple-950 font-mono">
                    {actualVolumeM3.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-sm font-semibold text-stone-500">m³</span>
                </div>
                <div className="mt-2 pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Durée programmée :</span>
                    <span className="font-bold text-stone-900">
                      {input.actualDurationHours || 0}h {input.actualDurationMinutes ? `${input.actualDurationMinutes}min` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taux de couverture :</span>
                    <span className={`font-bold ${
                      balanceStatus === 'deficit' ? 'text-red-700' :
                      balanceStatus === 'surplus' ? 'text-blue-700' : 'text-emerald-700'
                    }`}>
                      {balancePercentage}% du besoin
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statut :</span>
                    <span className="capitalize font-semibold text-stone-800">{balanceStatus}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-2 text-stone-400 text-xs italic">
                Durée programmée non renseignée dans le formulaire.
              </div>
            )}
          </div>
        </div>

        {/* Card 6: Bilan (Déficit ou Surplus) */}
        <div className={`rounded-xl p-5 border shadow-xs transition-colors ${
          balanceStatus === 'deficit'
            ? 'bg-red-50/70 border-red-200'
            : balanceStatus === 'surplus'
            ? 'bg-blue-50/70 border-blue-200'
            : balanceStatus === 'optimal'
            ? 'bg-emerald-50/70 border-emerald-200'
            : 'bg-white border-stone-200/90'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Bilan : Déficit / Surplus
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              balanceStatus === 'deficit' ? 'bg-red-100 text-red-700' :
              balanceStatus === 'surplus' ? 'bg-blue-100 text-blue-700' :
              balanceStatus === 'optimal' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'
            }`}>
              {balanceStatus === 'deficit' ? <TrendingDown className="w-4 h-4" /> :
               balanceStatus === 'surplus' ? <TrendingUp className="w-4 h-4" /> :
               balanceStatus === 'optimal' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-3">
            {balanceM3 !== undefined ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-3xl font-black font-mono ${
                    balanceStatus === 'deficit' ? 'text-red-700' :
                    balanceStatus === 'surplus' ? 'text-blue-800' : 'text-emerald-800'
                  }`}>
                    {balanceM3 > 0 ? `+${balanceM3}` : balanceM3}
                  </span>
                  <span className="text-sm font-semibold text-stone-500">m³</span>
                </div>
                <div className="mt-2 pt-2 border-t border-stone-200/60 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Diagnostic :</span>
                    <span className={`font-bold ${
                      balanceStatus === 'deficit' ? 'text-red-700' :
                      balanceStatus === 'surplus' ? 'text-blue-700' : 'text-emerald-700'
                    }`}>
                      {balanceStatus === 'deficit' ? 'Déficit hydrique (Stress)' :
                       balanceStatus === 'surplus' ? 'Surplus (Gaspillage)' : 'Équilibre parfait'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-tight pt-1">
                    {balanceStatus === 'deficit' 
                      ? 'La parcelle n\'a pas reçu assez d\'eau. Risque de baisse de rendement.' 
                      : balanceStatus === 'surplus'
                      ? 'L\'apport dépasse la capacité des plantes. Risque de percolation.'
                      : 'L\'apport correspond exactement aux besoins de la culture.'}
                  </p>
                </div>
              </>
            ) : (
              <div className="py-2 text-stone-400 text-xs italic">
                Renseignez la durée d'arrosage programmée pour afficher le diagnostic.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Visual Charts Section */}
      <div id="results-charts-container" className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#F8FAF6] p-1.5 rounded-2xl">

        {/* Chart 1: Répartition volumique */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                Décomposition du Volume d'Eau Nécessaire (m³)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Part de l'eau réellement absorbée vs pertes d'application réseau
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md">
              Total : {volumeNeededM3} m³
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} layout="vertical" margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" unit=" m³" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip 
                  formatter={(value: any) => [`${value} m³`, '']}
                  contentStyle={{ backgroundColor: '#1C1917', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Eau utile aux racines" stackId="a" fill="#059669" radius={[4, 0, 0, 4]} />
                <Bar dataKey="Pertes réseau (Ea)" stackId="a" fill="#F59E0B" />
                {effectiveRainfall > 0 && (
                  <Bar dataKey="Économie Pluie" stackId="a" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 text-xs text-stone-600 gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Besoin net plante : <strong>{volumeNetM3} m³ ({((volumeNetM3/volumeNeededM3)*100).toFixed(0)}%)</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Pertes d'efficience : <strong>{volumeLossesM3} m³ ({((volumeLossesM3/volumeNeededM3)*100).toFixed(0)}%)</strong></span>
            </div>
          </div>
        </div>

        {/* Chart 2: Comparatif Besoin vs Apport Réel OU Projection 7 jours */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                {comparisonData ? 'Bilan Hydraulique : Apport vs Besoin' : 'Projection Hebdomadaire (7 Jours)'}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {comparisonData ? 'Adéquation de la durée programmée' : 'Estimation de la consommation cumulée'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {comparisonData ? (
                <BarChart data={comparisonData} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis unit=" m³" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(value: any) => [`${value} m³`, '']}
                    contentStyle={{ backgroundColor: '#1C1917', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Besoin Requis (m³)" fill="#0D9488" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Apport Réel (m³)" fill={balanceStatus === 'deficit' ? '#DC2626' : balanceStatus === 'surplus' ? '#2563EB' : '#16A34A'} radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={weeklyProjection} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis unit=" m³" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(value: any) => [`${value} m³`, 'Besoin journalier']}
                    contentStyle={{ backgroundColor: '#1C1917', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="volume" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>Volume cumulé sur 7 jours :</span>
            <span className="font-bold text-stone-900 font-mono">{(volumeNeededM3 * 7).toLocaleString('fr-FR')} m³</span>
          </div>
        </div>

      </div>

      {/* Diagnostic & Technical Recommendations (INRA / PNEI) */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>Diagnostic Agronomique & Conseils de Pilotage (Maroc)</span>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map((warn, i) => (
              <div key={i} className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm text-amber-950 font-medium">
                  {warn}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations list */}
        <div className="space-y-2">
          {recommendations.map((rec, i) => (
            <div key={i} className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <p className="text-xs sm:text-sm text-emerald-950">
                {rec}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Footer reminder & Export button */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-stone-200/80">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Info className="w-4 h-4 text-stone-400 shrink-0" />
            <span>
              Calcul conforme FAO-56 ($ET_c = ET_0 \times K_c$) et référentiel INRA Maroc (PNEI).
            </span>
          </div>

          <button
            id="export-pdf-bottom-btn"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-300 transition-colors cursor-pointer shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                <span>Export en cours...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 text-emerald-700" />
                <span>Exporter ce bilan en PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
