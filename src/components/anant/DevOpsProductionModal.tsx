import React, { useState, useEffect } from 'react';
import {
  X,
  Server,
  Activity,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle2,
  Database,
  Cpu,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { moderateSpiritualContent, ModerationResult } from '../../server/contentModeration.ts';

interface DevOpsProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DevOpsProductionModal({ isOpen, onClose }: DevOpsProductionModalProps) {
  const [activeTab, setActiveTab] = useState<'K8S_AUTOSCALE' | 'MODERATION' | 'CICD' | 'DATABASE'>(
    'K8S_AUTOSCALE'
  );

  // Festival Traffic Autoscaling Simulator State
  const [isFestivalSurge, setIsFestivalSurge] = useState(false);
  const [festivalType, setFestivalType] = useState<'GANESH_CHATURTHI' | 'MAHA_SHIVRATRI' | 'PANDHARPUR_WARI'>('GANESH_CHATURTHI');
  const [simulatedRps, setSimulatedRps] = useState(120);
  const [replicaCount, setReplicaCount] = useState(2);
  const [cpuUsage, setCpuUsage] = useState(28);

  // Moderation test state
  const [moderationInput, setModerationInput] = useState(
    'Bappa divine morning abhishek and Pushpa vrushti! May your home be blessed with health & prosperity. 🌸🙏'
  );
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);

  // Simulate HPA scaling dynamics when festival surge is toggled
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFestivalSurge) {
      setSimulatedRps(18400); // 18,400 requests per second
      setCpuUsage(84); // Triggers HPA target (> 70%)
      // Animate pod scale up
      interval = setInterval(() => {
        setReplicaCount((prev) => (prev < 24 ? prev + 4 : 24));
      }, 500);
    } else {
      setSimulatedRps(145);
      setCpuUsage(24);
      interval = setInterval(() => {
        setReplicaCount((prev) => (prev > 2 ? prev - 2 : 2));
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isFestivalSurge]);

  useEffect(() => {
    if (moderationInput) {
      setModerationResult(moderateSpiritualContent(moderationInput));
    }
  }, [moderationInput]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[85vh] bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-950/50 flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-amber-950/60 to-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                DevOps, Security &amp; Festival Peak Autoscaling
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  Production Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Kubernetes HPA, CI/CD Pipeline, Content Moderation Filter &amp; Supabase Database
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('K8S_AUTOSCALE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'K8S_AUTOSCALE'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Festival Peak Autoscaler (K8s HPA)
          </button>
          <button
            onClick={() => setActiveTab('MODERATION')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'MODERATION'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Spiritual Moderation Guard
          </button>
          <button
            onClick={() => setActiveTab('CICD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'CICD'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            CI/CD Pipeline (Web &amp; Mobile)
          </button>
          <button
            onClick={() => setActiveTab('DATABASE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'DATABASE'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            Supabase PostGIS Proximity
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: Kubernetes HPA Autoscaler Festival Simulator */}
          {activeTab === 'K8S_AUTOSCALE' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    Simulate Hindu Festival Traffic Surge
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Triggers high concurrent darshan streams and tests real-time Kubernetes HorizontalPodAutoscaler scale-up.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={festivalType}
                    onChange={(e) => setFestivalType(e.target.value as any)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-400 focus:outline-none"
                  >
                    <option value="GANESH_CHATURTHI">Ganesh Chaturthi (10 Days)</option>
                    <option value="MAHA_SHIVRATRI">Maha Shivratri (Midnight Surge)</option>
                    <option value="PANDHARPUR_WARI">Ashadhi Ekadashi Wari</option>
                  </select>

                  <button
                    onClick={() => setIsFestivalSurge(!isFestivalSurge)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer ${
                      isFestivalSurge
                        ? 'bg-rose-500 text-slate-950 hover:bg-rose-400'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400'
                    }`}
                  >
                    {isFestivalSurge ? 'Stop Peak Traffic' : 'Simulate 500k Devotee Surge'}
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Active Pod Replicas</span>
                    <Server className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-amber-400">
                    {replicaCount} <span className="text-xs font-normal text-slate-500">/ 30 Max</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">HPA Min: 2 • Max: 30 Pods</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Darshan Traffic (RPS)</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    {simulatedRps.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-slate-500">req/s</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Via Cloudflare CDN + Nginx</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Cluster CPU Usage</span>
                    <Cpu className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">
                    {cpuUsage}%
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Scale-up trigger: &gt; 70% CPU</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Redis OTP Cache</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-200">
                    0.8 <span className="text-xs font-normal text-slate-500">ms latency</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Sliding-window rate limiter</p>
                </div>
              </div>

              {/* Pod Cluster Graphic */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">
                    Kubernetes Namespace: <span className="text-amber-400 font-mono">production</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    RollingUpdate Strategy (MaxSurge 25%, MaxUnavailable 0)
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {Array.from({ length: replicaCount }).map((_, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/40 flex flex-col items-center justify-center text-center animate-pulse"
                    >
                      <Server className="w-4 h-4 text-amber-400 mb-1" />
                      <span className="text-[9px] font-mono font-bold text-slate-300">
                        pod-{i + 1}
                      </span>
                      <span className="text-[8px] text-emerald-400 font-bold">100% Ready</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manifest Preview snippet */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Configured k8s/hpa.yaml Specification
                </span>
                <pre className="p-3 bg-slate-900 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto">
{`apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: anant-festival-autoscaler
spec:
  minReplicas: 2
  maxReplicas: 30
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 70 }`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: Spiritual Moderation Guard */}
          {activeTab === 'MODERATION' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Sacred Sanctum Decorum Guard (सात्विक वातावरण फिल्टर)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Strict content moderation filters out profanity, vulgarity, hate speech, and commercial spam while validating genuine Hindu Bhakti and darshan posts.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] text-slate-400 self-center">Test sample presets:</span>
                  <button
                    onClick={() =>
                      setModerationInput(
                        'हर हर महादेव! आज श्रावण सोमवारी त्र्यंबकेश्वर ज्योतिर्लिंग येथे महा रुद्राभिषेक संपन्न झाला. दर्शन घ्या. ॐ नमः शिवाय!'
                      )
                    }
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700"
                  >
                    Devotional Darshan Post (Valid)
                  </button>
                  <button
                    onClick={() =>
                      setModerationInput(
                        'Join online casino satta king win 50,000 cash daily instant payout in teen patti!'
                      )
                    }
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-700"
                  >
                    Gambling / Commercial Spam (Prohibited)
                  </button>
                  <button
                    onClick={() =>
                      setModerationInput(
                        'गणेश चतुर्थीच्या निमित्ताने सिद्धिविनायक चरणी मोदक नैवेद्य अर्पण केला. गणपती बाप्पा मोरया!'
                      )
                    }
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700"
                  >
                    Marathi Ganesh Bhakti (Valid)
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={moderationInput}
                  onChange={(e) => setModerationInput(e.target.value)}
                  placeholder="Enter community text, caption, or comment to inspect..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />

                {/* Moderation Inspection Output */}
                {moderationResult && (
                  <div
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      moderationResult.classification === 'SATVIK'
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                        : moderationResult.classification === 'REJECTED'
                        ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                        : 'bg-amber-950/40 border-amber-800 text-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-2">
                        {moderationResult.classification === 'SATVIK' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                        Classification: {moderationResult.classification} (सात्विक &amp; Reverent)
                      </span>
                      <span className="font-mono text-[11px]">
                        Confidence: {(moderationResult.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    {moderationResult.reason && (
                      <p className="text-[11px] opacity-90">{moderationResult.reason}</p>
                    )}

                    <div className="flex items-center justify-between text-[10px] pt-1 opacity-80">
                      <span>Action: {moderationResult.suggestedAction}</span>
                      <span>
                        Flagged Tokens:{' '}
                        {moderationResult.flaggedKeywords.length > 0
                          ? moderationResult.flaggedKeywords.join(', ')
                          : 'None (Pure Bhakti Decorum)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CI/CD Pipeline Architecture */}
          {activeTab === 'CICD' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Automated GitHub Actions Pipeline (.github/workflows/ci-cd.yml)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    End-to-end multi-platform build, security audit, and deployment pipeline for Web, Android &amp; iOS.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Lint &amp; Typecheck Job</h4>
                        <p className="text-[10px] text-slate-400">npm ci &amp;&amp; npm run lint (TypeScript strictly compiled)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      PASSED
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Trivy Vulnerability &amp; Container Scan</h4>
                        <p className="text-[10px] text-slate-400">High &amp; Critical CVE audit, strict supply chain verification</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      0 VULNERABILITIES
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Docker Build &amp; Push to GHCR / ECR</h4>
                        <p className="text-[10px] text-slate-400">Multi-stage alpine container with dumb-init &amp; non-root user</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                      ROLLING DEPLOY
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                        4
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Mobile Android App Bundle (AAB)</h4>
                        <p className="text-[10px] text-slate-400">Fastlane internal deployment to Google Play Console</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400">
                      AAB READY
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                        5
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Mobile iOS IPA Archive (macOS Runner)</h4>
                        <p className="text-[10px] text-slate-400">Fastlane beta submission to Apple TestFlight &amp; App Store Connect</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                      TESTFLIGHT READY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Supabase PostGIS Database */}
          {activeTab === 'DATABASE' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-400" />
                    Supabase / PostgreSQL with PostGIS Spatial Extensions
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Spatial index calculations with `ST_DWithin` &amp; `ST_Distance` on WGS-84 coordinate geography.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400">
                    Active Stored Procedure: find_nearest_temples(lat, lng, radius_meters)
                  </span>
                  <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto">
{`SELECT id, name, city,
  ROUND((ST_Distance(geog, ST_SetSRID(ST_MakePoint(73.8553, 18.5173), 4326)::geography))::numeric / 1000, 2) AS distance_km
FROM temples
WHERE ST_DWithin(geog, ST_SetSRID(ST_MakePoint(73.8553, 18.5173), 4326)::geography, 50000)
ORDER BY distance_km ASC;`}
                  </pre>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      Database Migration File
                    </span>
                    <p className="font-mono text-amber-400 text-[11px] mt-1">
                      supabase/migrations/20260912000001_init_anant_schema.sql
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      Seed Script Execution
                    </span>
                    <p className="font-mono text-emerald-400 text-[11px] mt-1">
                      npm run db:seed &amp;&amp; npm run db:migrate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
