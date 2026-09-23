import React, { useState } from 'react';
import { Parcel, GrowthStage, SoilTypeKey, IrrigationSystemType } from '../types';
import { 
  Plus, 
  Layers, 
  MapPin, 
  Calculator, 
  Trash2, 
  X
} from 'lucide-react';
import { MOROCCAN_CROPS, IRRIGATION_SYSTEMS } from '../data/moroccoData';

interface ParcelsViewProps {
  parcels: Parcel[];
  onAddParcel: (parcel: Parcel) => void;
  onUpdateParcel: (parcel: Parcel) => void;
  onDeleteParcel: (id: string) => void;
  onSelectParcelForCalc: (parcel: Parcel) => void;
}

export const ParcelsView: React.FC<ParcelsViewProps> = ({
  parcels,
  onAddParcel,
  onDeleteParcel,
  onSelectParcelForCalc,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // New parcel form state
  const [newParcel, setNewParcel] = useState<Omit<Parcel, 'id'>>({
    name: '',
    location: 'Vallée du Souss-Massa',
    regionId: 'souss_massa',
    areaHa: 4.5,
    cropId: 'agrumes',
    growthStage: 'mi_saison',
    soilId: 'sablo_limoneux_rmel',
    irrigationSystemId: 'goutte_a_goutte',
    flowRate: 35.0,
    flowUnit: 'm3_h',
    latestIrrigationDate: new Date().toISOString().slice(0, 10),
    waterRequirementM3Day: 165,
    notes: 'Lignes de goutteurs vérifiées.'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParcel.name.trim()) return;

    const parcel: Parcel = {
      ...newParcel,
      id: `parcel_${Date.now()}`
    };
    onAddParcel(parcel);
    setShowAddModal(false);
    setNewParcel({
      name: '',
      location: 'Vallée du Souss-Massa',
      regionId: 'souss_massa',
      areaHa: 4.5,
      cropId: 'agrumes',
      growthStage: 'mi_saison',
      soilId: 'sablo_limoneux_rmel',
      irrigationSystemId: 'goutte_a_goutte',
      flowRate: 35.0,
      flowUnit: 'm3_h',
      latestIrrigationDate: new Date().toISOString().slice(0, 10),
      waterRequirementM3Day: 165,
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2933] dark:text-stone-100">Gestion des parcelles</h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Inventaire des blocs de culture, réseaux d'arrosage et historique des dotations en eau.
          </p>
        </div>

        <button
          id="btn-add-parcel"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#2F6B4F] hover:bg-[#24563F] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une parcelle</span>
        </button>
      </div>

      {/* Parcels Table / Card List */}
      {parcels.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-12 text-center">
          <Layers className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1F2933] dark:text-stone-200">Aucune parcelle enregistrée</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            Ajoutez les blocs de votre exploitation agricole pour enregistrer leur superficie, culture en place et système d'irrigation.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#2F6B4F] hover:bg-[#24563F] rounded-lg cursor-pointer"
          >
            Créer la première parcelle
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile Card List (Optimized for smartphones under sunlight) */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {parcels.map((parcel) => {
              const cropObj = MOROCCAN_CROPS.find(c => c.id === parcel.cropId);
              const systemObj = IRRIGATION_SYSTEMS.find(s => s.id === parcel.irrigationSystemId);

              return (
                <div 
                  key={parcel.id} 
                  className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">{parcel.name}</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{parcel.location}</span>
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {parcel.areaHa} ha
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100 dark:border-stone-800">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">Culture</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{cropObj?.name || parcel.cropId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">Débit pompe</span>
                      <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                        {parcel.flowRate} {parcel.flowUnit === 'm3_h' ? 'm³/h' : 'L/s'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">Système</span>
                      <span className="text-stone-700 dark:text-stone-300">{systemObj?.name || parcel.irrigationSystemId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">Besoin journalier</span>
                      <span className="font-mono font-bold text-[#2F6B4F] dark:text-emerald-400">
                        {parcel.waterRequirementM3Day} m³/jour
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => onDeleteParcel(parcel.id)}
                      className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
                      title="Supprimer la parcelle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectParcelForCalc(parcel)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#2F6B4F] hover:bg-[#24563F] text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Calculer l'arrosage</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 bg-[#F7F7F3] dark:bg-stone-900/60 text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Parcelle & Localisation</th>
                    <th className="py-3 px-4">Superficie</th>
                    <th className="py-3 px-4">Culture & Stade</th>
                    <th className="py-3 px-4">Système d'irrigation</th>
                    <th className="py-3 px-4">Débit secteur</th>
                    <th className="py-3 px-4">Besoin en eau</th>
                    <th className="py-3 px-4">Dernier arrosage</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                  {parcels.map((parcel) => {
                    const cropObj = MOROCCAN_CROPS.find(c => c.id === parcel.cropId);
                    const systemObj = IRRIGATION_SYSTEMS.find(s => s.id === parcel.irrigationSystemId);

                    return (
                      <tr key={parcel.id} className="hover:bg-[#F7F7F3] dark:hover:bg-stone-800/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#1F2933] dark:text-stone-100">{parcel.name}</div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{parcel.location}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-semibold text-[#1F2933] dark:text-stone-200">
                          {parcel.areaHa} ha
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-[#1F2933] dark:text-stone-200">{cropObj?.name || parcel.cropId}</div>
                          <div className="text-[10px] text-stone-500 dark:text-stone-400 capitalize">
                            {parcel.growthStage === 'mi_saison' ? 'Mi-saison' : parcel.growthStage === 'developpement' ? 'Développement' : parcel.growthStage === 'fin_saison' ? 'Fin de saison' : 'Initial'}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-[#1F2933] dark:text-stone-200">{systemObj?.name || parcel.irrigationSystemId}</div>
                          <div className="text-[10px] text-[#2F6B4F] dark:text-emerald-400 font-semibold">Ea {systemObj?.defaultEfficiency}%</div>
                        </td>

                        <td className="py-3 px-4 font-mono text-[#1F2933] dark:text-stone-300">
                          {parcel.flowRate} {parcel.flowUnit === 'm3_h' ? 'm³/h' : 'L/s'}
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold font-mono text-[#2F6B4F] dark:text-emerald-400">{parcel.waterRequirementM3Day} m³/j</span>
                          <div className="text-[10px] text-stone-400 font-mono">
                            {(parcel.waterRequirementM3Day / parcel.areaHa).toFixed(1)} m³/ha
                          </div>
                        </td>

                        <td className="py-3 px-4 text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                          {parcel.latestIrrigationDate}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onSelectParcelForCalc(parcel)}
                              className="px-2.5 py-1 rounded bg-[#2F6B4F]/10 dark:bg-emerald-950/60 text-[#173F35] dark:text-emerald-300 hover:bg-[#2F6B4F]/20 font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1 border border-[#2F6B4F]/20"
                              title="Charger dans le calculateur"
                            >
                              <Calculator className="w-3 h-3 text-[#2F6B4F]" />
                              <span>Calculer</span>
                            </button>
                            <button
                              onClick={() => onDeleteParcel(parcel.id)}
                              className="p-1 text-stone-400 hover:text-red-700 transition-colors cursor-pointer rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                              title="Supprimer la parcelle"
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
        </div>
      )}

      {/* Add Parcel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div 
            className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="text-base font-bold text-[#1F2933] dark:text-stone-100">Enregistrer une nouvelle parcelle</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2933] dark:text-stone-300 mb-1">Nom du bloc / parcelle</label>
                <input
                  type="text"
                  value={newParcel.name}
                  onChange={e => setNewParcel({ ...newParcel, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 focus:outline-none focus:border-[#2F6B4F]"
                  placeholder="ex : Bloc Sud 3 — Oliveraie"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] dark:text-stone-300 mb-1">Localisation / Secteur</label>
                  <input
                    type="text"
                    value={newParcel.location}
                    onChange={e => setNewParcel({ ...newParcel, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 focus:outline-none focus:border-[#2F6B4F]"
                    placeholder="ex : Taroudant Secteur 4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] dark:text-stone-300 mb-1">Superficie (ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newParcel.areaHa}
                    onChange={e => setNewParcel({ ...newParcel, areaHa: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 font-mono focus:outline-none focus:border-[#2F6B4F]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] dark:text-stone-300 mb-1">Culture</label>
                  <select
                    value={newParcel.cropId}
                    onChange={e => setNewParcel({ ...newParcel, cropId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 focus:outline-none focus:border-[#2F6B4F]"
                  >
                    {MOROCCAN_CROPS.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] dark:text-stone-300 mb-1">Stade de croissance</label>
                  <select
                    value={newParcel.growthStage}
                    onChange={e => setNewParcel({ ...newParcel, growthStage: e.target.value as GrowthStage })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 focus:outline-none focus:border-[#2F6B4F]"
                  >
                    <option value="initial">Initial</option>
                    <option value="developpement">Développement</option>
                    <option value="mi_saison">Mi-saison</option>
                    <option value="fin_saison">Fin de saison</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] dark:text-stone-300 mb-1">Système d'irrigation</label>
                  <select
                    value={newParcel.irrigationSystemId}
                    onChange={e => setNewParcel({ ...newParcel, irrigationSystemId: e.target.value as IrrigationSystemType })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 focus:outline-none focus:border-[#2F6B4F]"
                  >
                    {IRRIGATION_SYSTEMS.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] dark:text-stone-300 mb-1">Débit d'alimentation (m³/h)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newParcel.flowRate}
                    onChange={e => setNewParcel({ ...newParcel, flowRate: parseFloat(e.target.value) || 10 })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 font-mono focus:outline-none focus:border-[#2F6B4F]"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2F6B4F] hover:bg-[#24563F] rounded-lg cursor-pointer shadow-xs"
                >
                  Enregistrer la parcelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
