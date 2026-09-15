'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Landmark, Check, ChevronDown, X, MapPin } from 'lucide-react';
import { TempleCatalogEntry } from '../../types/jaap.ts';
import {
  getLocalTemplesCatalog,
  saveLocalTempleCatalog,
  getLocalDeities,
} from '../../lib/supabase-jaap.ts';
import { CreatableDeitySelect } from './CreatableDeitySelect.tsx';

export interface CreatableTempleSelectProps {
  selectedTempleId?: string;
  onSelectTemple: (temple: TempleCatalogEntry) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function CreatableTempleSelect({
  selectedTempleId = '',
  onSelectTemple,
  label = 'Select or Register Temple Catalog Entry (मंदिर निवड किंवा नवीन नोंदणी)',
  placeholder = 'Search temple by name or city (e.g. Trimbakeshwar, Pandharpur)...',
  className = '',
}: CreatableTempleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [temples, setTemples] = useState<TempleCatalogEntry[]>([]);

  // Selected Temple Display
  const selectedTemple = temples.find((t) => t.id === selectedTempleId);

  // Modal State for Registering New Temple
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTempleName, setNewTempleName] = useState('');
  const [newPrimaryDeityId, setNewPrimaryDeityId] = useState('');
  const [newPrimaryDeityName, setNewPrimaryDeityName] = useState('');
  const [newState, setNewState] = useState('Maharashtra');
  const [newCity, setNewCity] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch Temples Catalog
  useEffect(() => {
    const list = getLocalTemplesCatalog();
    setTemples(list);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTemples = temples.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q) ||
      t.state.toLowerCase().includes(q)
    );
  });

  const exactMatch = temples.find(
    (t) => t.name.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  const handleSelect = (temple: TempleCatalogEntry) => {
    onSelectTemple(temple);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleOpenAddModal = () => {
    setNewTempleName(searchQuery.trim());
    setNewCity('');
    setNewState('Maharashtra');
    setNewPincode('');
    setIsAddModalOpen(true);
    setIsOpen(false);
  };

  const handleSaveNewTemple = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTempleName.trim() || !newCity.trim() || !newState.trim()) return;

    setIsSubmitting(true);

    try {
      const created = saveLocalTempleCatalog({
        name: newTempleName.trim(),
        primaryDeityId: newPrimaryDeityId || 'deity_shiva',
        state: newState.trim(),
        city: newCity.trim(),
      });

      // Update local state list
      setTemples((prev) => [created, ...prev]);

      // Trigger selection callback
      onSelectTemple(created);
      setIsAddModalOpen(false);
      setSearchQuery('');
    } catch (err) {
      console.error('Failed to register temple catalog entry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* Main Select Trigger / Input Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[48px] bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-2xl px-4 py-2.5 text-sm text-slate-100 flex items-center justify-between cursor-pointer transition-all shadow-sm focus-within:ring-2 focus-within:ring-amber-500/40"
      >
        <div className="flex items-center gap-2.5 truncate">
          <Landmark className="w-4 h-4 text-amber-400 shrink-0" />
          {selectedTemple ? (
            <div className="truncate flex items-center gap-1.5">
              <span className="font-bold text-amber-300 truncate">{selectedTemple.name}</span>
              <span className="text-[10px] font-mono text-slate-400">
                ({selectedTemple.city}, {selectedTemple.state})
              </span>
            </div>
          ) : (
            <span className="text-slate-400 text-xs">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search Bar Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search temple by name or city..."
              className="w-full min-h-[40px] pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Temple List Options */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredTemples.map((t) => {
              const isSelected = selectedTempleId === t.id;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelect(t)}
                  className={`w-full text-left min-h-[44px] px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'hover:bg-slate-900 text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{t.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {t.city}, {t.state}
                    </span>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              );
            })}

            {filteredTemples.length === 0 && !searchQuery.trim() && (
              <div className="p-4 text-center text-xs text-slate-400">No temples found in catalog</div>
            )}
          </div>

          {/* "+ Add New Temple" Creatable Option */}
          {searchQuery.trim() && !exactMatch && (
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="w-full min-h-[46px] px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Register &quot;{searchQuery.trim()}&quot; to Temple Catalog</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL: REGISTER NEW TEMPLE ENTRY FORM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">Register New Temple Catalog Entry (मंदिर नोंदणी)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewTemple} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Temple Name *</label>
                <input
                  type="text"
                  required
                  value={newTempleName}
                  onChange={(e) => setNewTempleName(e.target.value)}
                  placeholder="e.g. Trimbakeshwar Shiva Temple, Khandoba Mandir"
                  className="w-full min-h-[44px] bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              {/* Embedded Creatable Deity Selector for Associated Primary Deity */}
              <div>
                <CreatableDeitySelect
                  label="Associated Primary Deity *"
                  selectedDeityName={newPrimaryDeityName}
                  onSelectDeity={(d) => {
                    setNewPrimaryDeityId(d.id);
                    setNewPrimaryDeityName(d.name);
                  }}
                  placeholder="Select or add associated deity..."
                />
              </div>

              {/* Location: City, State, Pin Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Nashik, Pandharpur"
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Pin Code (Optional)</label>
                  <input
                    type="text"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    placeholder="e.g. 422212"
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTempleName.trim() || !newCity.trim()}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Register &amp; Select Temple
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
