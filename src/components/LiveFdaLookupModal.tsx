import React, { useState } from 'react';
import { Search, ShieldAlert, X, AlertTriangle, BookOpen, CheckCircle, ExternalLink } from 'lucide-react';
import { searchFdaDrug, FdaDrugInfo } from '../services/fdaService';

interface LiveFdaLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveFdaLookupModal: React.FC<LiveFdaLookupModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FdaDrugInfo | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    const data = await searchFdaDrug(query);
    setResult(data);
    setLoading(false);
  };

  const quickDrugs = ['Metformin', 'Lisinopril', 'Warfarin', 'Atorvastatin', 'Amlodipine', 'Ibuprofen'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden text-xs">
        {/* Header */}
        <div className="bg-[#183661] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-300" />
            <h2 className="text-base font-bold">FDA Drug Labeling, Boxed Warnings & Safety Lookup</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter drug generic or brand name (e.g. Warfarin, Lisinopril, Metformin)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                {loading ? 'Searching FDA...' : 'Search'}
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Quick Query:</span>
              {quickDrugs.map(drug => (
                <button
                  key={drug}
                  type="button"
                  onClick={() => {
                    setQuery(drug);
                    searchFdaDrug(drug).then(res => {
                      setResult(res);
                      setSearched(true);
                    });
                  }}
                  className="bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200 transition-colors"
                >
                  {drug}
                </button>
              ))}
            </div>
          </form>

          {/* Results Display */}
          {loading && (
            <div className="py-12 text-center space-y-2">
              <span className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              <p className="text-slate-500 text-xs">Querying openFDA Regulatory Labeling database...</p>
            </div>
          )}

          {!loading && searched && result && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{result.brandName}</h3>
                  <span className="text-slate-500 text-xs font-mono">{result.genericName}</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {result.source === 'live_fda_api' ? 'Live FDA API Verified' : 'Hospital Clinical Formulary'}
                </span>
              </div>

              {/* Boxed Warning if present */}
              {result.boxedWarning && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1 text-red-950">
                  <div className="flex items-center gap-1.5 font-bold text-red-700 text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>FDA BOXED WARNING</span>
                  </div>
                  <p className="text-[11px] leading-relaxed line-clamp-4">{result.boxedWarning}</p>
                </div>
              )}

              {/* Contraindications */}
              {result.contraindications && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-950">
                  <span className="font-bold text-amber-800 text-xs block">Contraindications</span>
                  <p className="text-[11px] leading-relaxed line-clamp-4">{result.contraindications}</p>
                </div>
              )}

              {/* Warnings / Cautions */}
              {result.warnings && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-800">
                  <span className="font-bold text-slate-700 text-xs block">Warnings & Precautions</span>
                  <p className="text-[11px] leading-relaxed line-clamp-4">{result.warnings}</p>
                </div>
              )}
            </div>
          )}

          {!loading && searched && !result && (
            <div className="py-8 text-center text-slate-400">
              No FDA labeling record found for that query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
