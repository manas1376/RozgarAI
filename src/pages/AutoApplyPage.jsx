import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Zap, CheckCircle2, Play, Loader2, Bot, User, FileText,
  MessageSquare, Send, Clock, AlertCircle, Sparkles, ChevronRight,
  BarChart3, Settings
} from 'lucide-react';

const STEP_LABELS = [
  { icon: '🌐', label: 'Loading application portal' },
  { icon: '👤', label: 'Filling personal details from profile' },
  { icon: '📄', label: 'Uploading customized resume' },
  { icon: '💬', label: 'Answering screening questions' },
  { icon: '🚀', label: 'Submitting application' },
];

function ApplySimulation({ job, onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= STEP_LABELS.length - 1) {
          clearInterval(interval);
          setTimeout(() => { setDone(true); onComplete(); }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: (job.color || '#6366f1') + '30' }}>
          <span style={{ color: job.color || '#6366f1' }}>{job.logo || job.company?.[0]}</span>
        </div>
        <div>
          <div className="font-semibold text-white">{job.title}</div>
          <div className="text-sm text-slate-400">{job.company} · {job.platform}</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {STEP_LABELS.map((step, i) => {
          const isActive = i === currentStep && !done;
          const isDone = i < currentStep || done;
          return (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300
              ${isActive ? 'bg-brand-500/10 border border-brand-500/20' : isDone ? 'opacity-70' : 'opacity-40'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm
                ${isDone ? 'bg-emerald-500/20' : isActive ? 'bg-brand-500/20' : 'bg-white/5'}`}>
                {isDone ? <CheckCircle2 size={14} className="text-emerald-400" /> :
                  isActive ? <Loader2 size={14} className="text-brand-400 animate-spin" /> :
                  <span>{step.icon}</span>}
              </div>
              <span className={`text-sm ${isActive ? 'text-white font-medium' : isDone ? 'text-slate-300' : 'text-slate-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {done && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center animate-fade-in">
          <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
          <div className="font-semibold text-white">Application submitted!</div>
          <div className="text-xs text-slate-400 mt-1">Tracking added to your dashboard</div>
        </div>
      )}

      {!done && (
        <button onClick={onCancel} className="btn-ghost text-sm w-full mt-2 text-slate-500">Cancel</button>
      )}
    </div>
  );
}

export default function AutoApplyPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [completedJobs, setCompletedJobs] = useState(new Set());
  const [autoMode, setAutoMode] = useState(false);
  const [autoQueue, setAutoQueue] = useState([]);
  const [profileFillData] = useState({
    name: 'Arjun Sharma', email: 'arjun.sharma@email.com',
    phone: '+91 98765 43210', location: 'Bangalore, India',
    experience: '3 years', linkedin: 'linkedin.com/in/arjunsharma',
  });

  useEffect(() => {
    api.get('/jobs?decision=Apply').then(({ data }) => {
      setJobs(data.filter(j => j.decision === 'Apply' || j.decision === 'Maybe'));
    });
  }, []);

  const startApply = (job) => {
    setSelectedJob(job);
    setApplying(true);
    api.post('/apply/simulate', { jobId: job.id }).catch(() => {});
  };

  const handleComplete = () => {
    setCompletedJobs(prev => new Set([...prev, selectedJob.id]));
    setTimeout(() => { setApplying(false); setSelectedJob(null); }, 1500);
  };

  const startAutoQueue = () => {
    const applyJobs = jobs.filter(j => j.decision === 'Apply' && !completedJobs.has(j.id));
    setAutoQueue(applyJobs.map(j => j.id));
    setAutoMode(true);
    if (applyJobs.length > 0) startApply(applyJobs[0]);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left panel */}
      <div className="lg:col-span-2 space-y-5">
        {/* Auto-apply banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900/60 to-purple-900/40 border border-brand-500/25 p-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex items-start justify-between gap-4 relative">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Bot size={16} className="text-brand-400" />
                <span className="text-brand-400 text-sm font-semibold">AI Auto-Apply Agent</span>
              </div>
              <h3 className="font-display font-semibold text-white text-lg mb-1">
                {jobs.filter(j => j.decision === 'Apply').length} jobs ready to apply
              </h3>
              <p className="text-slate-400 text-sm">
                AI will fill forms, customize resume per job, and submit applications automatically
              </p>
            </div>
            <button
              onClick={startAutoQueue}
              disabled={applying || completedJobs.size === jobs.filter(j => j.decision === 'Apply').length}
              className="btn-primary flex items-center gap-2 whitespace-nowrap flex-shrink-0">
              <Sparkles size={15} /> Auto-Apply All
            </button>
          </div>
          <div className="flex gap-4 mt-4 pt-3 border-t border-white/5">
            {[
              { label: 'Applied today', value: completedJobs.size },
              { label: 'Avg. time/job', value: '4s' },
              { label: 'Success rate', value: '94%' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="font-display font-bold text-xl text-white">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Applying simulation */}
        {applying && selectedJob && (
          <ApplySimulation job={selectedJob} onComplete={handleComplete} onCancel={() => { setApplying(false); setSelectedJob(null); }} />
        )}

        {/* Job queue */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">Application Queue</h3>
            <span className="text-xs text-slate-500 font-mono">{jobs.length} jobs</span>
          </div>
          <div className="space-y-2">
            {jobs.map(job => {
              const isDone = completedJobs.has(job.id);
              const isRunning = applying && selectedJob?.id === job.id;
              return (
                <div key={job.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                  ${isDone ? 'border-emerald-500/20 bg-emerald-500/5 opacity-70' :
                    isRunning ? 'border-brand-500/30 bg-brand-500/10' :
                    'border-white/5 bg-white/3 hover:border-white/10'}`}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: (job.color || '#6366f1') + '25', color: job.color || '#6366f1' }}>
                    {job.logo || job.company?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{job.title}</div>
                    <div className="text-xs text-slate-500">{job.company} · {job.matchScore}% match</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isDone ? (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Applied
                      </span>
                    ) : isRunning ? (
                      <span className="text-xs text-brand-400 flex items-center gap-1">
                        <Loader2 size={12} className="animate-spin" /> Running...
                      </span>
                    ) : (
                      <button
                        onClick={() => startApply(job)}
                        disabled={applying}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                        <Play size={11} /> Apply
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="space-y-4">
        {/* Profile data preview */}
        <div className="card p-5">
          <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
            <User size={14} className="text-brand-400" /> Auto-fill Profile Data
          </h4>
          <div className="space-y-2">
            {Object.entries(profileFillData).map(([key, val]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-slate-500 capitalize">{key}</span>
                <span className="text-slate-300 font-mono truncate max-w-[140px]">{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 size={11} /> Profile 85% complete
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="card p-5">
          <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
            <Settings size={14} className="text-brand-400" /> Auto-Apply Settings
          </h4>
          <div className="space-y-3">
            {[
              { label: 'Only "Apply" decisions', value: true },
              { label: 'Customize resume per job', value: true },
              { label: 'Skip jobs below 70% match', value: true },
              { label: 'Send confirmation email', value: false },
              { label: 'Add to tracker automatically', value: true },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{label}</span>
                <div className={`w-9 h-5 rounded-full transition-colors ${value ? 'bg-brand-600' : 'bg-white/10'} relative cursor-pointer`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${value ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="card p-5">
          <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
            <BarChart3 size={14} className="text-brand-400" /> Agent Stats
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Applied', value: '29', color: 'text-brand-400' },
              { label: 'This Week', value: '12', color: 'text-emerald-400' },
              { label: 'Avg Match', value: '81%', color: 'text-amber-400' },
              { label: 'Time Saved', value: '4.2h', color: 'text-purple-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/3 rounded-xl p-3 text-center">
                <div className={`font-display font-bold text-xl ${color}`}>{value}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
