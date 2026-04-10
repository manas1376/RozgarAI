import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import api from '../utils/api';
import {
  Briefcase, MessageSquare, Calendar, Target, TrendingUp,
  Zap, ArrowRight, ChevronRight, Activity, Sparkles, Clock,
  CheckCircle2, AlertCircle, Info, Award, Bot
} from 'lucide-react';

const COLORS = ['#F59E0B', '#6366F1', '#3B82F6', '#10B981'];

function ScoreRing({ score, size = 80, strokeWidth = 8, color = '#6366f1' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
      <circle
        cx={size/2} cy={size/2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.5s ease' }}
      />
    </svg>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div className="card p-5 hover:border-white/10 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        {trend && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>}
      </div>
      <div className="font-display font-bold text-3xl text-white mb-0.5">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

function ActivityIcon({ type }) {
  const icons = {
    apply: <Zap size={12} className="text-brand-400" />,
    response: <MessageSquare size={12} className="text-blue-400" />,
    interview: <Calendar size={12} className="text-emerald-400" />,
    ats: <Award size={12} className="text-amber-400" />,
    resume: <Briefcase size={12} className="text-purple-400" />,
    analysis: <TrendingUp size={12} className="text-cyan-400" />,
    profile: <CheckCircle2 size={12} className="text-slate-400" />,
  };
  const colors = {
    apply: 'bg-brand-500/15',
    response: 'bg-blue-500/15',
    interview: 'bg-emerald-500/15',
    ats: 'bg-amber-500/15',
    resume: 'bg-purple-500/15',
    analysis: 'bg-cyan-500/15',
    profile: 'bg-slate-500/15',
  };
  return (
    <div className={`w-6 h-6 rounded-full ${colors[type] || 'bg-slate-500/15'} flex items-center justify-center flex-shrink-0`}>
      {icons[type] || <Activity size={12} className="text-slate-400" />}
    </div>
  );
}

const customTooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#e2e8f0',
  fontSize: '12px',
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
      {[...Array(8)].map((_, i) => <div key={i} className="card h-32 shimmer-bg" />)}
    </div>
  );

  const { stats, weeklyData, platformStats, statusDist, recentActivity } = data;

  return (
    <div className="space-y-6 stagger-children">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900/50 to-purple-900/30 border border-brand-500/20 p-6">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Bot size={18} className="text-brand-400" />
            <span className="text-brand-400 text-sm font-semibold font-mono">AI Engine Active</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-1">Good morning, Arjun! 👋</h2>
          <p className="text-slate-400 text-sm">Your AI assistant analyzed <span className="text-white font-semibold">47 new jobs</span> overnight. <span className="text-emerald-400 font-semibold">12 are high-confidence matches</span>.</p>
          <div className="flex gap-3 mt-4">
            <Link to="/jobs" className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5">
              <Sparkles size={14} /> View Matches <ArrowRight size={14} />
            </Link>
            <Link to="/apply" className="btn-secondary text-sm px-4 py-2 flex items-center gap-1.5">
              <Zap size={14} /> Auto Apply
            </Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Briefcase} label="Total Applications" value={stats.totalApplications} sub="All time" color="bg-brand-600" trend={12} />
        <StatCard icon={MessageSquare} label="Responses" value={stats.responses} sub={`${stats.responseRate}% response rate`} color="bg-blue-600" trend={8} />
        <StatCard icon={Calendar} label="Interviews" value={stats.interviews} sub="Scheduled/Completed" color="bg-emerald-600" trend={25} />
        <StatCard icon={Target} label="ATS Score" value={`${stats.atsScore}%`} sub="Your resume score" color="bg-amber-600" trend={6} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Weekly activity */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-white">Weekly Activity</h3>
              <p className="text-xs text-slate-500 mt-0.5">Applications sent vs responses</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">This week</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Area type="monotone" dataKey="applied" stroke="#6366f1" strokeWidth={2} fill="url(#colorApplied)" name="Applied" />
              <Area type="monotone" dataKey="responses" stroke="#10b981" strokeWidth={2} fill="url(#colorResponses)" name="Responses" />
              <Legend formatter={(v) => <span style={{color: '#94a3b8', fontSize: 11}}>{v}</span>} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status distribution */}
        <div className="card p-5">
          <div className="mb-5">
            <h3 className="font-display font-semibold text-white">Application Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">Current pipeline</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusDist} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="count" paddingAngle={3}>
                {statusDist.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {statusDist.map((s, i) => (
              <div key={s.status} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-slate-400">{s.status}</span>
                </div>
                <span className="font-semibold text-white">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Platform distribution */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-white mb-4">By Platform</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={platformStats} layout="vertical">
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="platform" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {platformStats.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ATS Score Card */}
        <div className="card p-5 flex flex-col items-center justify-center">
          <div className="relative">
            <ScoreRing score={stats.atsScore} size={100} color="#6366f1" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-bold text-2xl text-white">{stats.atsScore}</span>
              <span className="text-[10px] text-slate-500">/ 100</span>
            </div>
          </div>
          <h3 className="font-display font-semibold text-white mt-3">ATS Score</h3>
          <p className="text-xs text-slate-400 text-center mt-1">Good score! Optimize further with AI suggestions</p>
          <Link to="/resume" className="btn-secondary text-xs px-3 py-1.5 mt-3 flex items-center gap-1">
            <Sparkles size={12} /> Improve Score
          </Link>
        </div>

        {/* Recent activity */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">Recent Activity</h3>
            <Link to="/tracker" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map(act => (
              <div key={act.id} className="flex items-start gap-2.5">
                <ActivityIcon type={act.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 leading-tight">{act.action}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {new Date(act.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top opportunities */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-white">Top Opportunities</h3>
            <p className="text-xs text-slate-500 mt-0.5">AI-ranked by match score</p>
          </div>
          <Link to="/jobs" className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { title: 'Senior React Developer', company: 'Flipkart', score: 94, decision: 'Apply', salary: '₹25-35 LPA' },
            { title: 'Full Stack Engineer', company: 'Razorpay', score: 91, decision: 'Apply', salary: '₹30-45 LPA' },
            { title: 'DevOps Engineer', company: 'Atlassian', score: 79, decision: 'Apply', salary: '₹28-40 LPA' },
          ].map(job => (
            <div key={job.company} className="bg-white/3 border border-white/5 rounded-xl p-4 hover:border-brand-500/30 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-sm text-white">{job.title}</div>
                  <div className="text-xs text-slate-400">{job.company}</div>
                </div>
                <span className={`badge-apply text-[10px]`}>{job.decision}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-500">{job.salary}</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-brand-500" style={{width: `${job.score}%`}} />
                  </div>
                  <span className="text-xs font-bold text-brand-400">{job.score}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
