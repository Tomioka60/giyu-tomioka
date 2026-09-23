import React from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  Layers, 
  History, 
  Sprout, 
  Settings, 
  Droplets,
  HelpCircle,
  X
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  historyCount: number;
  parcelsCount: number;
  onOpenGuide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  historyCount,
  parcelsCount,
  onOpenGuide,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'calculator', label: 'Calculateur d\'irrigation', icon: Calculator },
    { id: 'parcels', label: 'Parcelles', icon: Layers, count: parcelsCount },
    { id: 'history', label: 'Historique', icon: History, count: historyCount },
    { id: 'crops', label: 'Référentiel cultures', icon: Sprout },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#173F35] text-stone-200 flex flex-col transition-transform duration-200 ease-in-out border-r border-[#245246] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#245246]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2F6F8F] text-white flex items-center justify-center shadow-xs">
              <Droplets className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base font-bold text-white tracking-tight">AgriIrrig</span>
                <span className="text-[10px] font-semibold text-emerald-200 bg-[#2F6B4F] px-1.5 py-0.5 rounded uppercase tracking-wide">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-stone-300 font-medium mt-0.5">Pilotage de l'irrigation</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
            aria-label="Fermer la navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-200/70">
            Navigation exploitation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#2F6B4F] text-white shadow-xs'
                    : 'text-stone-200 hover:bg-[#1f4e42] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-300'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive ? 'bg-[#173F35] text-emerald-100' : 'bg-black/20 text-stone-200'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Reference & Agronomic System Info */}
        <div className="p-3 border-t border-[#245246] space-y-2">
          <button
            onClick={onOpenGuide}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-200 hover:text-white hover:bg-[#1f4e42] rounded-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-300" />
            <span>Tables agronomiques (Kc / ET₀)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
