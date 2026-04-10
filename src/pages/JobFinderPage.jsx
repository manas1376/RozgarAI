import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Search, MapPin, DollarSign, Building2, Monitor, Briefcase,
  Zap, ChevronRight, Star, TrendingUp, Clock, ExternalLink,
  CheckCircle2, AlertCircle, XCircle, Filter, SlidersHorizontal
} from 'lucide-react';

function DecisionBadge({ decision }) {
  if (decision === 'Apply') return <span className="badge-apply"><CheckCircle2 size={10} /> Apply</span>;
  if (decision === 'Maybe') return <span className="badge-maybe"><AlertCircle size={10} /> Maybe</span>;
  return <span className="badge-avoid"><XCircle size={10} /> Avoid</span>;
}

function MatchBar({ score }) {
  const color = score >= 85 ? '#10b981' : score >= 65 ? '#6366f1' : '#f59e0b';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-10 text-right" style={{ color }}>{score}%</span>
    </div>
  );
}

function JobCard({ job, onApply, applying }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`card p-5 hover:border-white/10 transition-all duration-300 cursor-pointer ${expanded ? 'border-brand-500/30' : ''}`}>
      <div onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start gap-3 mb-3">
          {/* Company logo */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ backgroundColor: job.color + '30', border: `1px solid ${job.color}40` }}>
            <span style={{ color: job.color }}>{job.logo}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-white text-sm leading-tight">{job.title}</h3>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-xs text-slate-400">{job.company}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-500">{job.platform}</span>
                </div>
              </div>
              <DecisionBadge decision={job.decision} />
            </div>
          </div>
        </div>

        <MatchBar score={job.matchScore} />

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5 text-xs text-slate-500">
          <span className="flex items-center gap-1"><MapPin size={10} />{job.location}</span>
          <span className="flex items-center gap-1"><DollarSign size={10} />{job.salary}</span>
          <span className="flex items-center gap-1"><Monitor size={10} />{job.workMode}</span>
          <span className="flex items-center gap-1"><Clock size={10} />{job.posted}</span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-fade-in">
          <p className="text-sm text-slate-400">{job.description}</p>

          <div>
            <div className="text-xs text-slate-500 mb-1.5">Required Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map(s => (
                <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">{s}</span>
              ))}
            </div>
          </div>

          {/* AI Decision */}
          <div className={`rounded-xl p-3 text-sm ${
            job.decision === 'Apply' ? 'bg-emerald-500/10 border border-emerald-500/20' :
            job.decision === 'Maybe' ? 'bg-amber-500/10 border border-amber-500/20' :
            'bg-red-500/10 border border-red-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Star size={12} className={job.decision === 'Apply' ? 'text-emerald-400' : job.decision === 'Maybe' ? 'text-amber-400' : 'text-red-400'} />
              <span className={`text-xs font-semibold ${job.decision === 'Apply' ? 'text-emerald-400' : job.decision === 'Maybe' ? 'text-amber-400' : 'text-red-400'}`}>
                AI Decision: {job.decision}
              </span>
            </div>
            <p className="text-xs text-slate-400">{job.decisionReason}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Success probability: <span className="font-bold text-white">{job.successProbability}%</span>
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost text-xs flex items-center gap-1">
                <ExternalLink size={12} /> View JD
              </button>
              {job.decision !== 'Avoid' && (
                <button
                  onClick={(e) => { e.stopPropagation(); onApply(job); }}
                  disabled={applying === job.id}
                  className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                  {applying === job.id
                    ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                    : <Zap size={11} />}
                  {applying === job.id ? 'Applying...' : 'Quick Apply'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobFinderPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', platform: '', workMode: '', decision: '' });
  const [applying, setApplying] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.platform) params.append('platform', filters.platform);
    if (filters.workMode) params.append('workMode', filters.workMode);
    if (filters.decision) params.append('decision', filters.decision);
    if (filters.search) params.append('search', filters.search);
    const { data } = await api.get(`/jobs?${params}`);
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [filters.platform, filters.workMode, filters.decision]);
  useEffect(() => {
    const t = setTimeout(() => { if (filters.search !== undefined) fetchJobs(); }, 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const handleApply = async (job) => {
    setApplying(job.id);
    await api.post('/apply/simulate', { jobId: job.id });
    setApplied(prev => new Set([...prev, job.id]));
    setApplying(null);
  };

  const setApplied = setAppliedJobs;

  const decisionCounts = {
    apply: jobs.filter(j => j.decision === 'Apply').length,
    maybe: jobs.filter(j => j.decision === 'Maybe').length,
    avoid: jobs.filter(j => j.decision === 'Avoid').length,
  };

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Apply', count: decisionCounts.apply, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Maybe', count: decisionCounts.maybe, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
          { label: 'Avoid', count: decisionCounts.avoid, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`border rounded-xl p-3 text-center ${color}`}>
            <div className="font-display font-bold text-2xl">{count}</div>
            <div className="text-xs font-medium mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="card p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input pl-9" placeholder="Search jobs, companies..."
              value={filters.search} onChange={e => setFilters(f => ({...f, search: e.target.value}))} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 text-sm ${showFilters ? 'border-brand-500/50 text-brand-400' : ''}`}>
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-white/5 animate-fade-in">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Platform</label>
              <select className="input text-sm py-2" value={filters.platform} onChange={e => setFilters(f => ({...f, platform: e.target.value}))}>
                <option value="">All Platforms</option>
                {['LinkedIn', 'Naukri', 'Indeed', 'Glassdoor'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Work Mode</label>
              <select className="input text-sm py-2" value={filters.workMode} onChange={e => setFilters(f => ({...f, workMode: e.target.value}))}>
                <option value="">All Modes</option>
                {['Remote', 'Hybrid', 'Office'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">AI Decision</label>
              <select className="input text-sm py-2" value={filters.decision} onChange={e => setFilters(f => ({...f, decision: e.target.value}))}>
                <option value="">All Decisions</option>
                {['Apply', 'Maybe', 'Avoid'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Job list */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-36 shimmer-bg" />)}
        </div>
      ) : (
        <div>
          <div className="text-sm text-slate-400 mb-3">
            Showing <span className="text-white font-medium">{jobs.length}</span> jobs · Sorted by match score
          </div>
          <div className="grid sm:grid-cols-2 gap-4 stagger-children">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} onApply={handleApply} applying={applying} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
