'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Sparkles, Check, ChevronDown, X, ShieldCheck } from 'lucide-react';
import { DeityType, Deity } from '../../types/jaap.ts';
import {
  getLocalDeityTypes,
  getLocalDeities,
  saveLocalDeity,
} from '../../lib/supabase-jaap.ts';

export interface CreatableDeitySelectProps {
  selectedDeityName?: string;
  selectedDeityTypeId?: string;
  onSelectDeity: (deity: { id: string; name: string; deityTypeId: string; shortDescription?: string; isVerified: boolean }) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function CreatableDeitySelect({
  selectedDeityName = '',
  selectedDeityTypeId = '',
  onSelectDeity,
  label = 'Select or Add Deity (देवता / कुलदैवत)',
  placeholder = 'Search or type new Deity (e.g. Khandoba, Kalbhairav)...',
  className = '',
}: CreatableDeitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deityTypes, setDeityTypes] = useState<DeityType[]>([]);
  const [deities, setDeities] = useState<Deity[]>([]);

  // Modal State for Adding New Deity
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeityName, setNewDeityName] = useState('');
  const [newDeityTypeId, setNewDeityTypeId] = useState('');
  const [newShortDescription, setNewShortDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch Deity Types and Deities
  useEffect(() => {
    const types = getLocalDeityTypes();
    const list = getLocalDeities();
    setDeityTypes(types);
    setDeities(list);
    if (types.length > 0 && !newDeityTypeId) {
      setNewDeityTypeId(types[0].id);
    }
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

  const filteredDeities = deities.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.shortDescription && d.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = !selectedDeityTypeId || d.deityTypeId === selectedDeityTypeId;
    return matchesSearch && matchesType;
  });

  const exactMatch = deities.find(
    (d) => d.name.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  const handleSelect = (deity: Deity) => {
    onSelectDeity(deity);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleOpenAddModal = () => {
    setNewDeityName(searchQuery.trim());
    if (!newDeityTypeId && deityTypes.length > 0) {
      setNewDeityTypeId(deityTypes[0].id);
    }
    setNewShortDescription('');
    setIsAddModalOpen(true);
    setIsOpen(false);
  };

  const handleSaveNewDeity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeityName.trim()) return;

    setIsSubmitting(true);

    try {
      const created = saveLocalDeity({
        name: newDeityName.trim(),
        deityTypeId: newDeityTypeId || deityTypes[0]?.id || 'dt_shaiva',
        shortDescription: newShortDescription.trim(),
      });

      // Update local state list
      setDeities((prev) => [created, ...prev]);

      // Trigger selection callback
      onSelectDeity(created);
      setIsAddModalOpen(false);
      setSearchQuery('');
    } catch (err) {
      console.error('Failed to create deity:', err);
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
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          {selectedDeityName ? (
            <span className="font-bold text-amber-300 truncate">{selectedDeityName}</span>
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
              placeholder="Search deity or type new name..."
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

          {/* Deity List Options */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredDeities.map((d) => {
              const isSelected = selectedDeityName === d.name;
              const deityType = deityTypes.find((t) => t.id === d.deityTypeId);

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleSelect(d)}
                  className={`w-full text-left min-h-[44px] px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'hover:bg-slate-900 text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-100">{d.name}</span>
                      {d.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Verified Deity Record" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {deityType ? deityType.name : 'Vedic Deity'} {d.shortDescription ? `• ${d.shortDescription}` : ''}
                    </span>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              );
            })}

            {filteredDeities.length === 0 && !searchQuery.trim() && (
              <div className="p-4 text-center text-xs text-slate-400">No deities found</div>
            )}
          </div>

          {/* "+ Add New God/Deity" Creatable Option */}
          {searchQuery.trim() && !exactMatch && (
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="w-full min-h-[46px] px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Add &quot;{searchQuery.trim()}&quot; as New God / Deity</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD NEW DEITY FORM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">Add New God / Deity (नवीन देव जोडणी)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewDeity} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Deity / God Name *</label>
                <input
                  type="text"
                  required
                  value={newDeityName}
                  onChange={(e) => setNewDeityName(e.target.value)}
                  placeholder="e.g. Khandoba, Kalbhairav, Mhatoba"
                  className="w-full min-h-[44px] bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Deity Category / Type *</label>
                <select
                  value={newDeityTypeId}
                  onChange={(e) => setNewDeityTypeId(e.target.value)}
                  className="w-full min-h-[44px] bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                >
                  {deityTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Short Description / Bio (Optional)</label>
                <textarea
                  rows={2}
                  value={newShortDescription}
                  onChange={(e) => setNewShortDescription(e.target.value)}
                  placeholder="e.g. Gramadevata of Jejuri, Martanda Bhairava..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
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
                  disabled={isSubmitting || !newDeityName.trim()}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save &amp; Select Deity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
