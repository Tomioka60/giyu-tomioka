import React, { useState, useEffect } from 'react';
import { CalculationInput, CalculationResult, ActiveTab, Parcel } from './types';
import { calculateIrrigation } from './utils/irrigationCalculations';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { IrrigationCalculator } from './components/IrrigationCalculator';
import { ResultsView } from './components/ResultsView';
import { ParcelsView } from './components/ParcelsView';
import { HistoryView } from './components/HistoryView';
import { CropsView } from './components/CropsView';
import { SettingsView } from './components/SettingsView';
import { MoroccoReferenceModal } from './components/MoroccoReferenceModal';
import { 
  Menu, 
  HelpCircle, 
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

const LOCAL_STORAGE_HISTORY_KEY = 'agriirrig_history_v2';
const LOCAL_STORAGE_PARCELS_KEY = 'agriirrig_parcels_v2';
const LOCAL_STORAGE_THEME_KEY = 'agriirrig_theme';

const INITIAL_PARCELS: Parcel[] = [
  {
    id: 'parcel_1',
    name: 'Verger Nord — Clémentiniers',
    location: 'Vallée du Souss-Massa',
    regionId: 'souss_massa',
    areaHa: 5.0,
    cropId: 'agrumes',
    growthStage: 'mi_saison',
    soilId: 'sablo_limoneux_rmel',
    irrigationSystemId: 'goutte_a_goutte',
    flowRate: 35.0,
    flowUnit: 'm3_h',
    latestIrrigationDate: '2026-09-18',
    waterRequirementM3Day: 195,
    notes: 'Goutteurs autorégulants vérifiés.'
  },
  {
    id: 'parcel_2',
    name: 'Secteur B — Tomates primeurs',
    location: 'Plaine de Chtouka',
    regionId: 'souss_massa',
    areaHa: 2.8,
    cropId: 'tomate_plein_champ',
    growthStage: 'developpement',
    soilId: 'sablo_limoneux_rmel',
    irrigationSystemId: 'goutte_a_goutte',
    flowRate: 20.0,
    flowUnit: 'm3_h',
    latestIrrigationDate: '2026-09-19',
    waterRequirementM3Day: 98,
    notes: 'Arrosage sous serre et fertigation.'
  },
  {
    id: 'parcel_3',
    name: 'Bloc Est — Oliveraie intensive',
    location: 'Bassin du Haouz / Marrakech',
    regionId: 'haouz',
    areaHa: 8.5,
    cropId: 'olivier',
    growthStage: 'mi_saison',
    soilId: 'limoneux_hamri',
    irrigationSystemId: 'goutte_a_goutte',
    flowRate: 45.0,
    flowUnit: 'm3_h',
    latestIrrigationDate: '2026-09-15',
    waterRequirementM3Day: 260,
    notes: 'Stratégie d\'irrigation déficitaire régulée.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [calcActiveInput, setCalcActiveInput] = useState<CalculationInput | undefined>(undefined);
  
  // Theme state: dark mode for bright sunlight readability in the field
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_THEME_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, 'light');
      }
    } catch (e) {
      console.error(e);
    }
  }, [darkMode]);

  // Load initial data and seed calculations
  useEffect(() => {
    // 1. Initial calculation input default
    const defaultInput: CalculationInput = {
      parcelName: 'Verger Nord — Clémentiniers (5 ha)',
      surfaceValue: 5.0,
      surfaceUnit: 'ha',
      regionId: 'souss_massa',
      month: 5, // Mai
      cropId: 'agrumes',
      growthStage: 'mi_saison',
      soilId: 'sablo_limoneux_rmel',
      irrigationSystemId: 'goutte_a_goutte',
      flowRate: 35.0,
      flowUnit: 'm3_h',
      et0: 5.9,
      rainfall: 0,
      actualDurationHours: 4,
      actualDurationMinutes: 0
    };

    const initialResult = calculateIrrigation(defaultInput);
    setCurrentResult(initialResult);
    setCalcActiveInput(defaultInput);

    // 2. Load history
    try {
      const savedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
        } else {
          setHistory([initialResult]);
        }
      } else {
        setHistory([initialResult]);
      }
    } catch {
      setHistory([initialResult]);
    }

    // 3. Load parcels
    try {
      const savedParcels = localStorage.getItem(LOCAL_STORAGE_PARCELS_KEY);
      if (savedParcels) {
        const parsed = JSON.parse(savedParcels);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setParcels(parsed);
        } else {
          setParcels(INITIAL_PARCELS);
        }
      } else {
        setParcels(INITIAL_PARCELS);
      }
    } catch {
      setParcels(INITIAL_PARCELS);
    }
  }, []);

  const saveHistoryList = (newList: CalculationResult[]) => {
    setHistory(newList);
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const saveParcelsList = (newList: Parcel[]) => {
    setParcels(newList);
    try {
      localStorage.setItem(LOCAL_STORAGE_PARCELS_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCalculate = (input: CalculationInput) => {
    const result = calculateIrrigation(input);
    setCurrentResult(result);
    setCalcActiveInput(input);
    
    // Add to history
    const filtered = history.filter(h => h.id !== result.id);
    const updated = [result, ...filtered].slice(0, 30);
    saveHistoryList(updated);
  };

  const handleSelectHistoricalResult = (result: CalculationResult) => {
    setCurrentResult(result);
    setCalcActiveInput(result.input);
    setActiveTab('calculator');
  };

  const handleDeleteHistoricalItem = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    saveHistoryList(updated);
  };

  const handleClearHistory = () => {
    saveHistoryList([]);
  };

  const handleAddParcel = (parcel: Parcel) => {
    const updated = [parcel, ...parcels];
    saveParcelsList(updated);
  };

  const handleUpdateParcel = (parcel: Parcel) => {
    const updated = parcels.map(p => p.id === parcel.id ? parcel : p);
    saveParcelsList(updated);
  };

  const handleDeleteParcel = (id: string) => {
    const updated = parcels.filter(p => p.id !== id);
    saveParcelsList(updated);
  };

  const handleSelectParcelForCalc = (parcel: Parcel) => {
    const input: CalculationInput = {
      parcelName: parcel.name,
      surfaceValue: parcel.areaHa,
      surfaceUnit: 'ha',
      regionId: parcel.regionId,
      month: 5,
      cropId: parcel.cropId,
      growthStage: parcel.growthStage,
      soilId: parcel.soilId,
      irrigationSystemId: parcel.irrigationSystemId,
      flowRate: parcel.flowRate,
      flowUnit: parcel.flowUnit,
      et0: 5.5,
      rainfall: 0,
      actualDurationHours: 4,
      actualDurationMinutes: 0
    };

    const res = calculateIrrigation(input);
    setCurrentResult(res);
    setCalcActiveInput(input);
    setActiveTab('calculator');
  };

  const getBreadcrumbTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard': return 'Tableau de bord';
      case 'calculator': return 'Calculateur d\'irrigation';
      case 'parcels': return 'Parcelles';
      case 'history': return 'Historique';
      case 'crops': return 'Référentiel cultures';
      case 'settings': return 'Paramètres';
      default: return 'Tableau de bord';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-stone-950 text-stone-100' : 'bg-[#F7F7F3] text-[#1F2933]'} flex font-sans antialiased`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        historyCount={history.length}
        parcelsCount={parcels.length}
        onOpenGuide={() => setShowGuideModal(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-400 dark:text-stone-500">AgriIrrig</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600" />
              <span className="font-bold text-[#1F2933] dark:text-stone-100">
                {getBreadcrumbTitle(activeTab)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark Mode Field Toggle */}
            <button
              id="btn-theme-toggle"
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer text-xs font-semibold inline-flex items-center gap-1.5"
              title={darkMode ? "Passer en mode clair" : "Mode plein soleil (sombre)"}
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-[11px]">Mode clair</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-stone-600" />
                  <span className="hidden sm:inline text-[11px]">Mode terrain</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowGuideModal(true)}
              className="p-2 text-stone-600 dark:text-stone-400 hover:text-[#1F2933] dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer text-xs font-semibold inline-flex items-center gap-1.5"
              title="Référentiel agronomique"
            >
              <HelpCircle className="w-4 h-4 text-[#2F6B4F] dark:text-emerald-400" />
              <span className="hidden md:inline">Tables agronomiques</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <Dashboard
              parcels={parcels}
              history={history}
              latestResult={currentResult}
              onNavigateToCalculator={() => setActiveTab('calculator')}
              onNavigateToParcels={() => setActiveTab('parcels')}
              onNavigateToHistory={() => setActiveTab('history')}
              onSelectHistoricalResult={handleSelectHistoricalResult}
              onSelectParcel={handleSelectParcelForCalc}
              onOpenGuide={() => setShowGuideModal(true)}
            />
          )}

          {/* TAB 2: IRRIGATION CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              {/* Page header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[#1F2933] dark:text-stone-100">
                    Calculateur d'irrigation
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                    Déterminez l'évapotranspiration de la culture (ETc), les volumes bruts nécessaires et la durée d'ouverture des vannes.
                  </p>
                </div>
              </div>

              {/* Calculator Form */}
              <IrrigationCalculator
                onCalculate={handleCalculate}
                initialInput={calcActiveInput || currentResult?.input}
              />

              {/* Calculated Results Presentation */}
              {currentResult && (
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                  <ResultsView result={currentResult} />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PARCELS */}
          {activeTab === 'parcels' && (
            <ParcelsView
              parcels={parcels}
              onAddParcel={handleAddParcel}
              onUpdateParcel={handleUpdateParcel}
              onDeleteParcel={handleDeleteParcel}
              onSelectParcelForCalc={handleSelectParcelForCalc}
            />
          )}

          {/* TAB 4: HISTORY */}
          {activeTab === 'history' && (
            <HistoryView
              history={history}
              onSelectResult={handleSelectHistoricalResult}
              onDeleteResult={handleDeleteHistoricalItem}
              onClearHistory={handleClearHistory}
            />
          )}

          {/* TAB 5: CROPS */}
          {activeTab === 'crops' && (
            <CropsView />
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsView 
              darkMode={darkMode}
              onToggleDarkMode={setDarkMode}
            />
          )}

        </main>

        {/* Global Clean Product Footer */}
        <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-4 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1F2933] dark:text-stone-200">AgriIrrig</span>
              <span>—</span>
              <span>Gestion et pilotage de l'irrigation agricole de précision</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Besoins en eau & Pilotage des vannes</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Agronomic Tables Modal */}
      <MoroccoReferenceModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

    </div>
  );
}
