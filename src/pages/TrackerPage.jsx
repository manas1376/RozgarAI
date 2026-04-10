import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Search, Filter, Clock, CheckCircle2, MessageSquare,
  Calendar, Circle, ChevronDown, ExternalLink, SlidersHorizontal,
  Briefcase, TrendingUp, MoreVertical
} from 'lucide-react';

const STATUS_CONFIG = {
  Pending:   { color: 'badge-pending',   dot: 'bg-amber-400',   icon: Circle,        label: 'Pending' },
  Applied:   { color: 'badge-applied',   dot: 'bg-brand-400',   icon: CheckCircle2,  label: 'Applied' },
  Response:  { color: 'badge-response',  dot: 'bg-blue-400',    icon: MessageSquare, label: 'Response' },
  Interview: { color: 'badge-interview', dot: 'bg-emerald-400', icon: Calendar,      label: 'Interview' },
};

const STATUSES = Object.keys(STATUS_CONFIG);

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = cfg.icon;
  return (
    <span className={`${cfg.color} flex items-center gap-1`}>
      <Icon size={10} /> {status}
    </span>
  );
}

function KanbanView({ applications }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATUSES.map(status => {
        const cfg = STATUS_CONFIG[status];
        const apps = applications.filter(a => a.status === status);
        return (
          <div key={status} className="space-y-2">
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className="text-sm font-semibold text-slate-300">{status}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono bg-white/5 px-2 py-0.5 rounded-full">{apps.length}</span>
            </div>
            {apps.map(app => (
              <div key={app.id} className="card p-3 hover:border-white/10 transition-all cursor-pointer">
                <div className="font-medium text-sm text-white leading-tight mb-1 truncate">{app.jobTitle}</div>
                <div className="text-xs text-slate-400 mb-2">{app.company}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">{app.platform}</span>
                  <span className="text-[10px] font-bold text-brand-400">{app.matchScore}%</span>
                </div>
                {app.notes && (
                  <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-500 truncate">
                    📝 {app.notes}
                  </div>
                )}
              </div>
            ))}
            {apps.length === 0 && (
              <div className="card p-4 text-center text-xs text-slate-600 border-dashed">
                No applications
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TrackerPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api.get('/applications').then(({ data }) => {
      setApplications(data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    await api.patch(`/applications/${id}`, { status });
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setUpdatingId(null);
  };

  const filtered = applications.filter(a => {
    const matchSearch = !search || [a.jobTitle, a.company, a.platform].some(f => f?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'Pending').length,
    applied: applications.filter(a => a.status === 'Applied').length,
    response: applications.filter(a => a.status === 'Response').length,
    interview: applications.filter(a => a.status === 'Interview').length,
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'bg-slate-500/20 text-slate-300' },
          { label: 'Applied', value: stats.applied, color: 'bg-brand-500/20 text-brand-400' },
          { label: 'Responses', value: stats.response, color: 'bg-blue-500/20 text-blue-400' },
          { label: 'Interviews', value: stats.interview, color: 'bg-emerald-500/20 text-emerald-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`card p-4 text-center border-none ${color}`}>
            <div className="font-display font-bold text-3xl">{value}</div>
            <div className="text-xs font-medium mt-0.5 opacity-80">{label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input pl-9" placeholder="Search applications..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input sm:w-40 text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex gap-1 bg-surface-800 p-1 rounded-xl border border-white/5">
          {[
            { id: 'table', label: 'Table' },
            { id: 'kanban', label: 'Kanban' },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setViewMode(id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === id ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="card h-14 shimmer-bg" />)}
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanView applications={filtered} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  {['Job Title', 'Company', 'Platform', 'Status', 'Match', 'Applied', 'Notes', 'Update Status'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => (
                  <tr key={app.id} className={`border-b border-white/3 hover:bg-white/2 transition-colors ${i % 2 === 0 ? '' : 'bg-white/1'}`}>
                    <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{app.jobTitle}</td>
                    <td className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap">{app.company}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">{app.platform}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-brand-400">{app.matchScore}%</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono whitespace-nowrap">
                      {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3 max-w-[150px]">
                      <span className="text-xs text-slate-500 truncate block">{app.notes || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="bg-white/5 border border-white/10 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-500"
                        value={app.status}
                        disabled={updatingId === app.id}
                        onChange={e => updateStatus(app.id, e.target.value)}>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-slate-500 text-sm">No applications found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
