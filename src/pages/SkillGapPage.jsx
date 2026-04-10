import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  TrendingUp, BookOpen, Award, Zap, Star, ArrowUpRight,
  CheckCircle2, AlertCircle, Clock, Target, Sparkles, ChevronRight,
  BarChart3, Brain
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';

const customTooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#e2e8f0',
  fontSize: '12px',
};

const difficultyColor = {
  Easy: 'text-emerald-400 bg-emerald-500/10',
  Medium: 'text-amber-400 bg-amber-500/10',
  Hard: 'text-red-400 bg-red-500/10',
};

const impactColor = {
  High: 'text-emerald-400',
  Medium: 'text-amber-400',
  Low: 'text-slate-400',
};

const radarData = [
  { subject: 'Frontend', A: 90 },
  { subject: 'Backend', A: 78 },
  { subject: 'DevOps', A: 65 },
  { subject: 'Cloud', A: 72 },
  { subject: 'DB', A: 70 },
  { subject: 'Mobile', A: 25 },
  { subject: 'ML/AI', A: 30 },
  { subject: 'Security', A: 45 },
];

export default function SkillGapPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gaps');

  useEffect(() => {
    api.get('/skill-gap').then(({ data }) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <div key={i} className="card h-40 shimmer-bg" />)}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/40 to-brand-900/40 border border-purple-500/20 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Brain size={22} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-lg mb-1">Skill Gap Analysis</h3>
            <p className="text-slate-400 text-sm">Based on 47 jobs analyzed this week. AI has identified high-demand skills you can learn to boost your match rate by up to <span className="text-emerald-400 font-semibold">+28%</span>.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-800 p-1 rounded-xl border border-white/5 w-fit">
        {[
          { id: 'gaps', label: 'Skill Gaps', icon: AlertCircle },
          { id: 'radar', label: 'Skill Radar', icon: Target },
          { id: 'certs', label: 'Certifications', icon: Award },
          { id: 'market', label: 'Market Trends', icon: TrendingUp },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === id ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* Current skills */}
      <div className="card p-5">
        <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-400" /> Your Current Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.currentSkills.map(skill => (
            <span key={skill} className="text-sm px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Skill Gaps */}
      {activeTab === 'gaps' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {data.missingSkills.map(skill => (
            <div key={skill.skill} className="card p-5 hover:border-brand-500/30 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{skill.skill}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${difficultyColor[skill.difficulty]}`}>
                      {skill.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={9} /> {skill.timeToLearn}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-xl text-brand-400">{skill.demand}%</div>
                  <div className="text-[10px] text-slate-500">demand</div>
                </div>
              </div>
              <div className="progress-bar mb-3">
                <div className="progress-fill" style={{ width: `${skill.demand}%` }} />
              </div>
              <button className="btn-secondary text-xs w-full flex items-center justify-center gap-1 group-hover:border-brand-500/40">
                <BookOpen size={11} /> Start Learning <ChevronRight size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Radar Chart */}
      {activeTab === 'radar' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h4 className="font-semibold text-white text-sm mb-4">Skill Coverage Radar</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Radar name="Skills" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5">
            <h4 className="font-semibold text-white text-sm mb-4">Skill Strength by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={radarData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="A" radius={[0, 4, 4, 0]} name="Proficiency">
                  {radarData.map((entry, i) => (
                    <Cell key={i} fill={entry.A >= 70 ? '#10b981' : entry.A >= 50 ? '#6366f1' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Certifications */}
      {activeTab === 'certs' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {data.recommendedCerts.map(cert => (
            <div key={cert.name} className="card p-5 hover:border-amber-500/30 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                  <Award size={18} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{cert.name}</h4>
                  <p className="text-xs text-slate-400">{cert.provider}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className={`font-semibold ${impactColor[cert.impact]}`}>
                  {cert.impact} Impact
                </span>
                <span className="text-slate-400">{cert.jobs} jobs need this</span>
              </div>
              <button className="btn-primary text-xs w-full flex items-center justify-center gap-1">
                <Sparkles size={11} /> View Cert Roadmap
              </button>
            </div>
          ))}

          {/* Placeholder cards */}
          {[
            { name: 'Next.js Certified Developer', provider: 'Vercel', impact: 'High', jobs: 312 },
            { name: 'Docker Certified Associate', provider: 'Docker Inc.', impact: 'Medium', jobs: 198 },
            { name: 'Terraform Associate', provider: 'HashiCorp', impact: 'High', jobs: 176 },
          ].map(cert => (
            <div key={cert.name} className="card p-5 hover:border-amber-500/30 transition-all opacity-70">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                  <Award size={18} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{cert.name}</h4>
                  <p className="text-xs text-slate-400">{cert.provider}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className={`font-semibold ${impactColor[cert.impact]}`}>{cert.impact} Impact</span>
                <span className="text-slate-400">{cert.jobs} jobs need this</span>
              </div>
              <button className="btn-secondary text-xs w-full">View Roadmap</button>
            </div>
          ))}
        </div>
      )}

      {/* Market Trends */}
      {activeTab === 'market' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h4 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-400" /> Fastest Growing Skills (2025)
            </h4>
            <div className="space-y-3">
              {data.marketTrends.map(({ skill, growth, demand }) => (
                <div key={skill} className="flex items-center justify-between p-3 bg-white/3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ArrowUpRight size={14} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-white">{skill}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400">{growth}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
                      ${demand === 'Very High' ? 'bg-emerald-500/20 text-emerald-400' :
                        demand === 'High' ? 'bg-brand-500/20 text-brand-400' :
                        'bg-amber-500/20 text-amber-400'}`}>
                      {demand}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h4 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-brand-400" /> AI Recommendations for You
            </h4>
            <div className="space-y-3">
              {[
                { icon: '🚀', title: 'Learn Next.js', desc: '83% demand, 1-2 weeks, matches 34 more jobs', urgency: 'High' },
                { icon: '☸️', title: 'Get Kubernetes CKA', desc: '78% demand, highest cert ROI for DevOps roles', urgency: 'High' },
                { icon: '📊', title: 'Add System Design', desc: 'Required for senior roles at FAANG companies', urgency: 'Critical' },
                { icon: '🔴', title: 'Learn Redis Advanced', desc: '58% demand, easy win — 1-2 weeks', urgency: 'Medium' },
                { icon: '🤖', title: 'AI/ML Integration', desc: '+67% growth — add LangChain to projects', urgency: 'Future' },
              ].map(({ icon, title, desc, urgency }) => {
                const urgencyStyle = {
                  Critical: 'text-red-400 bg-red-500/10',
                  High: 'text-amber-400 bg-amber-500/10',
                  Medium: 'text-brand-400 bg-brand-500/10',
                  Future: 'text-slate-400 bg-white/5',
                };
                return (
                  <div key={title} className="flex items-start gap-3 p-3 bg-white/3 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
                    <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white">{title}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${urgencyStyle[urgency]}`}>{urgency}</span>
                      </div>
                      <p className="text-xs text-slate-400">{desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-600 flex-shrink-0 mt-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
