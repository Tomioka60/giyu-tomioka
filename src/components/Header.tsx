import React from 'react';
import { Droplets, Sprout, BookOpen, History, Award, MapPin } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onToggleHistory: () => void;
  historyCount: number;
  showHistory: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onToggleHistory,
  historyCount,
  showHistory
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Droplets className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight text-emerald-950 font-['Cabinet_Grotesk']">
                  Agri<span className="text-emerald-600">Irrig</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Maroc
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Calculateur d'irrigation de précision • Normes INRA & FAO-56
              </p>
            </div>
          </div>

          {/* Navigation & Certified Badges */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Normes certified pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>Données certifiées INRA / PNEI</span>
            </div>

            {/* Guide Technique button */}
            <button
              id="btn-open-guide"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
              title="Consulter les référentiels agronomiques marocains"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span className="hidden xs:inline">Référentiel Maroc</span>
            </button>

            {/* History Toggle button */}
            <button
              id="btn-toggle-history"
              onClick={onToggleHistory}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                showHistory
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-700 bg-white hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden xs:inline">Historique</span>
              {historyCount > 0 && (
                <span className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  showHistory ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {historyCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
