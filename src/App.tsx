import React, { useState, useEffect } from 'react';
import { CalculationInput, CalculationResult } from './types';
import { calculateIrrigation } from './utils/irrigationCalculations';
import { Header } from './components/Header';
import { CalculationForm } from './components/CalculationForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { CalculationHistory } from './components/CalculationHistory';
import { MoroccoReferenceModal } from './components/MoroccoReferenceModal';
import { 
  Droplets, 
  Sprout, 
  MapPin, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const LOCAL_STORAGE_HISTORY_KEY = 'agriirrig_history_morocco_v1';

export default function App() {
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Initialize with initial calculation and load saved history from localStorage
  useEffect(() => {
    // 1. Initial calculation default
    const defaultInput: CalculationInput = {
      parcelName: 'Verger Clémentiniers Souss (5 ha)',
      surfaceValue: 5,
      surfaceUnit: 'ha',
      regionId: 'souss_massa',
      month: 5, // Mai
      cropId: 'agrumes',
      growthStage: 'mi_saison',
      soilId: 'sablo_limoneux_rmel',
      irrigationSystemId: 'goutte_a_goutte',
      flowRate: 35,
      flowUnit: 'm3_h',
      et0: 5.9,
      rainfall: 0,
      actualDurationHours: 4,
      actualDurationMinutes: 0
    };

    const initialResult = calculateIrrigation(defaultInput);
    setCurrentResult(initialResult);

    // 2. Load history from localStorage
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Erreur lors du chargement de l\'historique', e);
    }

    // Default seeded history entry for demonstration
    setHistory([initialResult]);
  }, []);

  // Save history helper
  const saveToHistory = (newResult: CalculationResult) => {
    setHistory(prev => {
      // Filter out duplicate identical IDs or keep last 20 calculations
      const filtered = prev.filter(item => item.id !== newResult.id);
      const updated = [newResult, ...filtered].slice(0, 25);
      try {
        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Erreur sauvegarde historique', e);
      }
      return updated;
    });
  };

  // Handler when user triggers calculation in form
  const handleCalculate = (input: CalculationInput) => {
    const result = calculateIrrigation(input);
    setCurrentResult(result);
    saveToHistory(result);
  };

  // Select historical result
  const handleSelectHistoricalResult = (result: CalculationResult) => {
    setCurrentResult(result);
  };

  // Delete an item from history
  const handleDeleteHistoricalItem = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Clear all history
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#192A1E] flex flex-col font-['Plus_Jakarta_Sans']">
      
      {/* Top Header */}
      <Header
        onOpenGuide={() => setShowGuideModal(true)}
        onToggleHistory={() => setShowHistory(!showHistory)}
        historyCount={history.length}
        showHistory={showHistory}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* National Water Awareness & Agronomic Banner */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Droplets className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Plan National de l'Eau & Stratégie Génération Green 2020-2030
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-stone-900 mt-0.5">
                Calculateur d'Irrigation de Précision pour le Terroir Marocain
              </h2>
              <p className="text-xs text-stone-500 mt-0.5 max-w-3xl">
                Optimisez la distribution de l'eau en fonction du coefficient cultural INRA/FAO ($K_c$), de l'évapotranspiration $ET_0$ régionale et des caractéristiques de votre sol (Tirs, Hamri, Rmel).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={() => setShowGuideModal(true)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              <span>Consulter les Tables Kc & ET0</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Conditional History Panel */}
        {showHistory && (
          <CalculationHistory
            history={history}
            onSelectResult={handleSelectHistoricalResult}
            onDeleteResult={handleDeleteHistoricalItem}
            onClearHistory={handleClearHistory}
            onClose={() => setShowHistory(false)}
          />
        )}

        {/* Core Layout: Form & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Calculation Form */}
          <div className="lg:col-span-5 space-y-6">
            <CalculationForm
              onCalculate={handleCalculate}
              initialInput={currentResult?.input}
            />
          </div>

          {/* Right Column: Results Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            {currentResult ? (
              <ResultsDashboard result={currentResult} />
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400">
                <Sprout className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                <p className="text-sm font-semibold">Veuillez renseigner le formulaire pour afficher les résultats d'irrigation.</p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">AgriIrrig Maroc</span>
            <span>•</span>
            <span>Outil d'aide à la décision pour agriculteurs et techniciens agronomes</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Méthodologie FAO-56 & INRA Maroc</span>
            <span>•</span>
            <span>Programme PNEI</span>
          </div>
        </div>
      </footer>

      {/* Moroccan Agronomic Reference Modal */}
      <MoroccoReferenceModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

    </div>
  );
}
