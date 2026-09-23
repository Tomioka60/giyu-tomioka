import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { exportCalculationToPdf } from '../utils/pdfExport';
import { 
  Download, 
  Trash2, 
  ArrowUpRight, 
  FileDown, 
  History as HistoryIcon,
  Search
} from 'lucide-react';

interface HistoryViewProps {
  history: CalculationResult[];
  onSelectResult: (result: CalculationResult) => void;
  onDeleteResult: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectResult,
  onDeleteResult,
  onClearHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.input.parcelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.input.cropId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'covered' && (item.balanceStatus === 'optimal' || item.balanceStatus === 'non_specifie' || !item.balanceStatus)) ||
      (item.balanceStatus === filterStatus);
    return matchesSearch && matchesStatus;
  });

  const exportToCsv = () => {
    if (history.length === 0) return;

    const headers = [
      'Date',
      'Parcelle',
      'Superficie (ha)',
      'Culture',
      'Stade',
      'Besoin en eau (m3)',
      'Volume apporte (m3)',
      'Duree de pompage',
      'Statut bilan'
    ];

    const rows = history.map(h => [
      new Date(h.timestamp).toLocaleDateString('fr-FR'),
      `"${h.input.parcelName.replace(/"/g, '""')}"`,
      h.surfaceHa.toFixed(2),
      h.input.cropId,
      h.input.growthStage,
      h.volumeNeededM3,
      h.actualVolumeM3 ?? '',
      `"${h.recommendedDurationFormatted}"`,
      h.balanceStatus ?? 'Optimal'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2933] dark:text-stone-100">Historique des calculs</h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Traçabilité des prescriptions hydriques, temps de pompage et bilans de contrôle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={exportToCsv}
                className="px-3 py-2 text-xs font-semibold text-[#1F2933] dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                <span>Exporter en CSV</span>
              </button>
              <button
                onClick={onClearHistory}
                className="px-3 py-2 text-xs font-semibold text-red-700 dark:text-red-400 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Effacer tout</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filtrer par parcelle ou culture..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 focus:outline-none focus:border-[#2F6B4F]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Statut :</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-2.5 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-200 focus:outline-none focus:border-[#2F6B4F]"
          >
            <option value="all">Tous les statuts</option>
            <option value="covered">Couvert / Optimal</option>
            <option value="deficit">Déficit</option>
            <option value="surplus">Excédent</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-12 text-center">
          <HistoryIcon className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1F2933] dark:text-stone-200">Aucun calcul enregistré</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            {history.length === 0 
              ? 'Effectuez un calcul d\'irrigation pour alimenter automatiquement le registre historique.'
              : 'Aucun enregistrement ne correspond aux filtres de recherche.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-[#F7F7F3] dark:bg-stone-900/60 text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Parcelle</th>
                  <th className="py-3 px-4">Culture</th>
                  <th className="py-3 px-4">Besoin en eau</th>
                  <th className="py-3 px-4">Volume apporté</th>
                  <th className="py-3 px-4">Durée</th>
                  <th className="py-3 px-4">Statut bilan</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                {filteredHistory.map((item) => {
                  const dateStr = new Date(item.timestamp).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  });

                  const statusLabel = item.balanceStatus === 'deficit' ? 'Déficit' :
                    item.balanceStatus === 'surplus' ? 'Excédent' : 'Optimal';

                  return (
                    <tr key={item.id} className="hover:bg-[#F7F7F3] dark:hover:bg-stone-800/40 transition-colors">
                      <td className="py-3 px-4 text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                        {dateStr}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-[#1F2933] dark:text-stone-100">{item.input.parcelName}</span>
                        <div className="text-[10px] text-stone-400 dark:text-stone-500 font-mono">{item.surfaceHa.toFixed(2)} ha</div>
                      </td>

                      <td className="py-3 px-4 capitalize text-[#1F2933] dark:text-stone-200">
                        {item.input.cropId}
                        <div className="text-[10px] text-stone-400 dark:text-stone-500">
                          {item.input.growthStage === 'mi_saison' ? 'Mi-saison' : item.input.growthStage === 'developpement' ? 'Développement' : item.input.growthStage === 'fin_saison' ? 'Fin de saison' : 'Initial'}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-[#1F2933] dark:text-stone-100">
                        {item.volumeNeededM3} m³
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-700 dark:text-stone-300">
                        {item.actualVolumeM3 !== undefined ? `${item.actualVolumeM3} m³` : '—'}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-[#2F6B4F] dark:text-emerald-400">
                        {item.recommendedDurationFormatted}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                          statusLabel === 'Déficit' 
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : statusLabel === 'Excédent'
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-[#2F6F8F] dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                            : 'bg-[#2F6B4F]/10 dark:bg-emerald-950/60 text-[#173F35] dark:text-emerald-300 border border-[#2F6B4F]/20 dark:border-emerald-800'
                        }`}>
                          {statusLabel}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => exportCalculationToPdf(item)}
                            className="p-1 text-stone-400 dark:text-stone-500 hover:text-[#2F6B4F] dark:hover:text-emerald-400 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                            title="Télécharger le rapport PDF"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectResult(item)}
                            className="px-2 py-1 rounded bg-[#2F6B4F]/10 dark:bg-stone-800 text-[#173F35] dark:text-emerald-300 hover:bg-[#2F6B4F]/20 font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1 border border-[#2F6B4F]/20"
                            title="Charger dans la vue active"
                          >
                            <span>Charger</span>
                            <ArrowUpRight className="w-3 h-3 text-[#2F6B4F]" />
                          </button>
                          <button
                            onClick={() => onDeleteResult(item.id)}
                            className="p-1 text-stone-400 dark:text-stone-500 hover:text-red-700 dark:hover:text-red-400 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                            title="Supprimer la ligne"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
