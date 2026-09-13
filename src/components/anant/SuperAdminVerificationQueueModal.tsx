import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  FileText,
  Users,
  Search,
  ExternalLink,
  Calendar,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { TrustRegistrationSubmission } from '../../types/anant.ts';

interface SuperAdminVerificationQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrustUpdated?: () => void;
}

export function SuperAdminVerificationQueueModal({
  isOpen,
  onClose,
  onTrustUpdated,
}: SuperAdminVerificationQueueModalProps) {
  const [submissions, setSubmissions] = useState<TrustRegistrationSubmission[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] =
    useState<TrustRegistrationSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/trusts/queue');
      const data = await res.json();
      if (data.success && data.data?.submissions) {
        setSubmissions(data.data.submissions);
        if (!selectedSubmission && data.data.submissions.length > 0) {
          setSelectedSubmission(data.data.submissions[0]);
        }
      }
    } catch {
      setStatusMessage({ text: 'Failed to load verification queue.', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchQueue();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProcessSubmission = async (action: 'APPROVE' | 'REJECT') => {
    if (!selectedSubmission) return;
    setActionLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/admin/trusts/${selectedSubmission.id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reviewerNotes: reviewerNotes || (action === 'APPROVE' ? 'Verified with Charity Commissioner records.' : 'Incomplete documentation.'),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({ text: data.error?.message || 'Action failed.', isError: true });
        return;
      }

      setStatusMessage({
        text: `Trust '${selectedSubmission.trustLegalName}' ${action === 'APPROVE' ? 'APPROVED' : 'REJECTED'} successfully!`,
        isError: false,
      });

      // Update local state
      const updated = submissions.map((s) =>
        s.id === selectedSubmission.id ? { ...s, status: data.data.status, reviewerNotes: data.data.reviewerNotes } : s
      );
      setSubmissions(updated);
      setSelectedSubmission({
        ...selectedSubmission,
        status: data.data.status,
        reviewerNotes: data.data.reviewerNotes,
      });

      if (onTrustUpdated) onTrustUpdated();
    } catch {
      setStatusMessage({ text: 'Network error executing review.', isError: true });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === 'PENDING' && s.status !== 'PENDING_VERIFICATION') return false;
    if (filter === 'APPROVED' && s.status !== 'APPROVED') return false;
    if (filter === 'REJECTED' && s.status !== 'REJECTED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.trustLegalName.toLowerCase().includes(q) ||
        s.templeName.toLowerCase().includes(q) ||
        s.govRegNumber.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = submissions.filter((s) => s.status === 'PENDING_VERIFICATION').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-950/50 flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-amber-950/60 to-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Super Admin Verification Queue
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                    {pendingCount} Pending
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Government Trust Registration and Public Charity Compliance Review Console
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Status banner */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs flex items-center justify-between border-b ${
              statusMessage.isError
                ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-[11px] underline opacity-80 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Body: 2 Columns (List on Left, Dossier on Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left: Queue List */}
          <div className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-950/50 shrink-0">
            {/* Filter Tabs */}
            <div className="p-3 border-b border-slate-800 space-y-2">
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-semibold">
                <button
                  onClick={() => setFilter('PENDING')}
                  className={`py-1 rounded-lg transition-all ${
                    filter === 'PENDING' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('APPROVED')}
                  className={`py-1 rounded-lg transition-all ${
                    filter === 'APPROVED' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setFilter('REJECTED')}
                  className={`py-1 rounded-lg transition-all ${
                    filter === 'REJECTED' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Rejected
                </button>
                <button
                  onClick={() => setFilter('ALL')}
                  className={`py-1 rounded-lg transition-all ${
                    filter === 'ALL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  All
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name or Reg No..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Submissions List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {isLoading ? (
                <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  Loading submissions...
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No submissions match the selected filter.
                </div>
              ) : (
                filteredSubmissions.map((sub) => {
                  const isSelected = selectedSubmission?.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setReviewerNotes(sub.reviewerNotes || '');
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                          {sub.trustLegalName}
                        </h4>
                        {sub.status === 'PENDING_VERIFICATION' && (
                          <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            PENDING
                          </span>
                        )}
                        {sub.status === 'APPROVED' && (
                          <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            APPROVED
                          </span>
                        )}
                        {sub.status === 'REJECTED' && (
                          <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            REJECTED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{sub.templeName}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
                        <span>{sub.city}</span>
                        <span>{sub.govRegNumber.slice(0, 18)}...</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Submission Dossier & Action Panel */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-y-auto">
            {selectedSubmission ? (
              <div className="p-6 space-y-6">
                
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-100">
                        {selectedSubmission.trustLegalName}
                      </h3>
                      {selectedSubmission.status === 'APPROVED' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Authenticated Public Trust
                        </span>
                      )}
                      {selectedSubmission.status === 'PENDING_VERIFICATION' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Verification Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-400 font-medium mt-0.5">
                      {selectedSubmission.templeName} • {selectedSubmission.city}, {selectedSubmission.state}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <p>Submitted: {new Date(selectedSubmission.submittedAt).toLocaleDateString()}</p>
                    <p className="font-mono text-slate-500">Ref ID: {selectedSubmission.id}</p>
                  </div>
                </div>

                {/* Government Registrar Credentials Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">
                      Gov Trust Reg Number
                    </span>
                    <span className="font-mono font-bold text-amber-400 text-xs">
                      {selectedSubmission.govRegNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">
                      Charity Commissionerate
                    </span>
                    <span className="font-semibold text-slate-200">
                      {selectedSubmission.charityCommissionerDistrict}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">
                      Renewal / Expiry Date
                    </span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {selectedSubmission.expiryDate}
                    </span>
                  </div>
                </div>

                {/* Attached Charity Certificate File */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        {selectedSubmission.certificateFileName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Official Government Charity Certificate Document
                      </p>
                    </div>
                  </div>
                  <a
                    href={selectedSubmission.certificateFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect Deed</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Trustees Roster (Max 5 Seats Enforced) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" />
                    Registered Trustees &amp; Authorized Personnel ({selectedSubmission.trustees.length}/5 Seats)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSubmission.trustees.map((t, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{t.name}</span>
                          <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30">
                            {t.designation}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">Mobile: {t.mobile}</p>
                        {t.panOrAadhaarRef && (
                          <p className="text-[10px] text-slate-500 font-mono">
                            ID Ref: {t.panOrAadhaarRef}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviewer Action Box */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Super Admin Adjudication
                  </h4>
                  <textarea
                    rows={2}
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    placeholder="Enter compliance notes or verification remarks for the applicant trust..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Approving will provision the temple in the live directory with the golden seal.
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleProcessSubmission('REJECT')}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject Trust</span>
                      </button>
                      <button
                        onClick={() => handleProcessSubmission('APPROVE')}
                        disabled={actionLoading}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                      >
                        {actionLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve &amp; Issue Golden Seal</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                Select a submission from the queue to review government credentials.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
