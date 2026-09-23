import React, { useState } from 'react';
import { MOROCCAN_CROPS } from '../data/moroccoData';
import { Search } from 'lucide-react';

export const CropsView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCrops = MOROCCAN_CROPS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.notesAgro.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2933] dark:text-stone-100">Référentiel des cultures & Coefficients Kc</h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Coefficients culturaux Kc, profondeurs d'enracinement et fraction d'épuisement critique (p) pour chaque stade phénologique.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une culture, variété ou note agronomique..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 focus:outline-none focus:border-[#2F6B4F]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-200 focus:outline-none focus:border-[#2F6B4F]"
        >
          <option value="all">Toutes les filières agricoles</option>
          <option value="arboriculture">Arboriculture fruitière</option>
          <option value="maraichage">Maraîchage primeur & plein champ</option>
          <option value="grandes_cultures">Grandes cultures / Céréales</option>
          <option value="fourrages">Cultures fourragères</option>
          <option value="fruits_rouges">Petits fruits rouges</option>
        </select>
      </div>

      {/* Crops Table */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-[#F7F7F3] dark:bg-stone-900/60 text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Espèce / Variété</th>
                <th className="py-3 px-4">Enracinement (m)</th>
                <th className="py-3 px-4">Fraction p</th>
                <th className="py-3 px-4">Kc Initial</th>
                <th className="py-3 px-4">Kc Dév.</th>
                <th className="py-3 px-4">Kc Mi-saison</th>
                <th className="py-3 px-4">Kc Fin</th>
                <th className="py-3 px-4">Recommandations agronomiques</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
              {filteredCrops.map((crop) => (
                <tr key={crop.id} className="hover:bg-[#F7F7F3] dark:hover:bg-stone-800/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1F2933] dark:text-stone-100">
                    {crop.name}
                    <div className="text-[10px] text-stone-400 font-normal capitalize">{crop.category.replace('_', ' ')}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#1F2933] dark:text-stone-200">
                    {crop.rootDepthMeters} m
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-600 dark:text-stone-400">
                    {crop.depletionFractionP}
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-600 dark:text-stone-400">
                    {crop.stages.initial.kc.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-600 dark:text-stone-400">
                    {crop.stages.developpement.kc.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#173F35] dark:text-emerald-300 bg-[#2F6B4F]/10 dark:bg-emerald-950/40">
                    {crop.stages.mi_saison.kc.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-600 dark:text-stone-400">
                    {crop.stages.fin_saison.kc.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-stone-600 dark:text-stone-400 text-[11px] max-w-xs">
                    {crop.notesAgro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
