import React from 'react';
import { CalculationResult } from '../types';
import { exportCalculationToPdf } from '../utils/pdfExport';
import { 
  History, 
  Trash2, 
  Download, 
  ArrowUpRight, 
  Sprout, 
  Clock, 
  Droplets,
  Calendar,
  AlertCircle,
  FileDown
} from 'lucide-react';

interface CalculationHistoryProps {
  history: CalculationResult[];
  onSelectResult: (result: CalculationResult) => void;
  onDeleteResult: (id: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({
  history,
  onSelectResult,
  onDeleteResult,
  onClearHistory,
  onClose
}) => {
  const exportToCsv = () => {
    if (history.length === 0) return;

    const headers = [
      'Date',
      'Parcelle',
      'Superficie (ha)',
      'Culture',
      'Stade',
      'Région',
      'ET0 (mm/j)',
      'Kc',
      'ETc (mm/j)',
      'Besoin Net (mm)',
      'Besoin Brut (mm)',
      'Volume Requis (m3)',
      'Durée Recommandée',
      'Débit (m3/h)',
      'Volume Apporté (m3)',
      'Bilan (m3)',
      'Statut'
    ];

    const rows = history.map(h => [
      new Date(h.timestamp).toLocaleDateString('fr-FR'),
      `"${h.input.parcelName.replace(/"/g, '""')}"`,
      h.surfaceHa.toFixed(2),
      h.input.cropId,
      h.input.growthStage,
      h.input.regionId,
      h.et0,
      h.kc,
      h.etc,
      h.netRequirementMm,
      h.grossRequirementMm,
      h.volumeNeededM3,
      `"${h.recommendedDurationFormatted}"`,
      h.flowRateM3h,
      h.actualVolumeM3 ?? '',
      h.balanceM3 ?? '',
      h.balanceStatus ?? ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AgriIrrig_Historique_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-6 space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Historique des Calculs d'Irrigation ({history.length})
            </h2>
            <p className="text-xs text-stone-500">
              Retrouvez et réutilisez les bilans hydriques de vos parcelles enregistrées.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              Exporter CSV
            </button>
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              Effacer tout
            </button>
          </div>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-stone-700">Aucun calcul enregistré pour le moment</p>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            Effectuez un calcul d'irrigation à l'aide du formulaire pour voir l'historique s'afficher ici automatiquement.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {history.map((item) => {
            const dateStr = new Date(item.timestamp).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-emerald-50/30 hover:border-emerald-300 transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                        <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                        {item.input.parcelName}
                      </h4>
                      <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {dateStr} • {item.surfaceHa.toFixed(2)} ha
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteResult(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                      title="Supprimer cette entrée"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-stone-200/60 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Volume brut</span>
                      <span className="font-bold text-stone-900 font-mono">{item.volumeNeededM3} m³</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Durée arrosage</span>
                      <span className="font-bold text-emerald-800 font-mono">{item.recommendedDurationFormatted}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Bilan</span>
                      <span className={`font-bold capitalize ${
                        item.balanceStatus === 'deficit' ? 'text-red-700' :
                        item.balanceStatus === 'surplus' ? 'text-blue-700' :
                        item.balanceStatus === 'optimal' ? 'text-emerald-700' : 'text-stone-500'
                      }`}>
                        {item.balanceStatus || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between border-t border-stone-200/60">
                  <button
                    onClick={() => exportCalculationToPdf(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-800 p-1 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Télécharger le bulletin PDF de ce calcul"
                  >
                    <FileDown className="w-3.5 h-3.5 text-emerald-700" />
                    <span>PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectResult(item);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    <span>Charger ce calcul</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
