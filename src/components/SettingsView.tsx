import React, { useState } from 'react';
import { 
  Check, 
  Sun, 
  Moon, 
  Sliders
} from 'lucide-react';

interface SettingsViewProps {
  darkMode: boolean;
  onToggleDarkMode: (isDark: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode,
  onToggleDarkMode,
}) => {
  const [defaultUnit, setDefaultUnit] = useState<'ha' | 'm2'>('ha');
  const [defaultFlowUnit, setDefaultFlowUnit] = useState<'m3_h' | 'l_s'>('m3_h');
  const [autoDeductRain, setAutoDeductRain] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#1F2933] dark:text-stone-100">
          Paramètres de l'application
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Configuration des unités de mesure, du calcul de la pluie efficace et du mode d'affichage.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Affichage Terrain / Thème Sombre */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">
                Mode d'affichage terrain (Plein soleil)
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Basculez vers un thème sombre à fort contraste pour éviter les reflets en plein soleil lors des diagnostics de parcelles.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => onToggleDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold ${
                darkMode 
                  ? 'bg-stone-800 text-emerald-300 border-emerald-700' 
                  : 'bg-[#F7F7F3] text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
            >
              {darkMode ? (
                <>
                  <Moon className="w-4 h-4 text-emerald-400" />
                  <span>Mode sombre actif</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>Mode clair actif</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Unit Preferences Card */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2933] dark:text-stone-100">Unités de mesure par défaut</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Unité de superficie par défaut
              </label>
              <select
                value={defaultUnit}
                onChange={e => setDefaultUnit(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F3] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 focus:outline-none focus:border-[#2F6B4F]"
              >
                <option value="ha">Hectares (ha)</option>
                <option value="m2">Mètres carrés (m²)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Unité de débit par défaut
              </label>
              <select
                value={defaultFlowUnit}
                onChange={e => setDefaultFlowUnit(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F3] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[#1F2933] dark:text-stone-100 focus:outline-none focus:border-[#2F6B4F]"
              >
                <option value="m3_h">Mètres cubes par heure (m³/h)</option>
                <option value="l_s">Litres par seconde (L/s)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoDeductRain}
                onChange={e => setAutoDeductRain(e.target.checked)}
                className="rounded text-[#2F6B4F] focus:ring-[#2F6B4F]"
              />
              <span className="font-medium">
                Déduire automatiquement la pluie efficace (Peff) du calcul du besoin brut
              </span>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-xs font-bold text-[#2F6B4F] dark:text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Paramètres enregistrés avec succès</span>
            </span>
          ) : <div />}

          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-[#2F6B4F] hover:bg-[#24563F] rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Enregistrer les préférences
          </button>
        </div>
      </form>
    </div>
  );
};
