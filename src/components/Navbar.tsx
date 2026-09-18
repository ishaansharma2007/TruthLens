import React, { useState, useRef, useEffect } from 'react';
import { Category } from '../types/claim';
import { 
  ChevronDown, 
  BarChart3, 
  Vote, 
  ShieldAlert, 
  BookOpen, 
  Cpu, 
  Globe, 
  Briefcase, 
  Film, 
  Trophy, 
  Users, 
  Scale 
} from 'lucide-react';

interface NavbarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  activeView: 'feed' | 'reviewer' | 'analytics';
  setActiveView: (view: 'feed' | 'reviewer' | 'analytics') => void;
  selectedSpecialFilter: string | null;
  onSelectSpecialFilter: (filter: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  activeView,
  setActiveView,
  selectedSpecialFilter,
  onSelectSpecialFilter,
}) => {
  const [isFactCheckOpen, setIsFactCheckOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const factCheckSubCategories: { name: Category; label: string; icon: React.ReactNode }[] = [
    { name: 'Politics', label: 'Politics', icon: <Scale className="w-4 h-4 text-rose-600" /> },
    { name: 'Business', label: 'Business', icon: <Briefcase className="w-4 h-4 text-blue-600" /> },
    { name: 'World', label: 'World', icon: <Globe className="w-4 h-4 text-emerald-600" /> },
    { name: 'Entertainment', label: 'Entertainment', icon: <Film className="w-4 h-4 text-purple-600" /> },
    { name: 'Sports', label: 'Sports', icon: <Trophy className="w-4 h-4 text-amber-600" /> },
    { name: 'Social', label: 'Social', icon: <Users className="w-4 h-4 text-indigo-600" /> },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFactCheckOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubCategoryClick = (categoryName: Category) => {
    setActiveView('feed');
    onSelectSpecialFilter(null);
    onSelectCategory(categoryName);
    setIsFactCheckOpen(false);
  };

  const handleSpecialNav = (special: string) => {
    if (special === 'Data Dive') {
      setActiveView('analytics');
      onSelectSpecialFilter(null);
    } else {
      setActiveView('feed');
      onSelectSpecialFilter(special);
      onSelectCategory('ALL');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-300 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* All Feeds */}
            <button
              onClick={() => {
                setActiveView('feed');
                onSelectCategory('ALL');
                onSelectSpecialFilter(null);
              }}
              className={`px-3 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeView === 'feed' && selectedCategory === 'ALL' && !selectedSpecialFilter
                  ? 'border-slate-900 text-slate-950 font-bold'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              All Desks
            </button>

            {/* Fact Check Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsFactCheckOpen(!isFactCheckOpen)}
                className={`flex items-center gap-1 px-3 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                  isFactCheckOpen || factCheckSubCategories.some((c) => c.name === selectedCategory)
                    ? 'border-slate-900 text-slate-950 font-bold'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span>Fact Check</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFactCheckOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isFactCheckOpen && (
                <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    Investigative Desks
                  </div>
                  {factCheckSubCategories.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => handleSubCategoryClick(sub.name)}
                      className={`w-full px-3.5 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedCategory === sub.name ? 'bg-amber-50/70 text-amber-950 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {sub.icon}
                        <span>{sub.label}</span>
                      </div>
                      {selectedCategory === sub.name && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Election Tracker */}
            <button
              onClick={() => handleSpecialNav('Election Tracker')}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                selectedSpecialFilter === 'Election Tracker'
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Vote className="w-4 h-4 text-indigo-600" />
              <span>Election Tracker</span>
            </button>

            {/* ScamCheck */}
            <button
              onClick={() => handleSpecialNav('ScamCheck')}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                selectedSpecialFilter === 'ScamCheck'
                  ? 'border-rose-600 text-rose-700 font-bold'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>ScamCheck</span>
            </button>

            {/* Explainers */}
            <button
              onClick={() => handleSpecialNav('Explainers')}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                selectedSpecialFilter === 'Explainers'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Explainers</span>
            </button>

            {/* Decode */}
            <button
              onClick={() => handleSpecialNav('Decode')}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                selectedSpecialFilter === 'Decode'
                  ? 'border-cyan-600 text-cyan-700 font-bold'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-600" />
              <span>Decode</span>
            </button>

            {/* Data Dive (Analytics) */}
            <button
              onClick={() => handleSpecialNav('Data Dive')}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeView === 'analytics'
                  ? 'border-amber-600 text-amber-700 font-bold bg-amber-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-600" />
              <span>Data Dive</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
