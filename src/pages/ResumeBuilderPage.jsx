import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  FileText, Sparkles, TrendingUp, AlertCircle, CheckCircle2,
  ChevronRight, ArrowUpRight, Loader2, Download, RefreshCw,
  Target, Zap, Star, Info
} from 'lucide-react';

function ScoreGauge({ score, label, color = '#6366f1' }) {
  const r = 40, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" className="-rotate-90">
          <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-2xl text-white">{score}</span>
          <span className="text-[9px] text-slate-500 font-mono">/ 100</span>
        </div>
      </div>
      <span className="text-xs text-slate-400 text-center">{label}</span>
    </div>
  );
}

const impactColors = { '+8 pts': '#10b981', '+6 pts': '#10b981', '+5 pts': '#f59e0b', '+4 pts': '#f59e0b', '+3 pts': '#6366f1' };

export default function ResumeBuilderPage() {
  const [tab, setTab] = useState('score');
  const [scoring, setScoring] = useState(false);
  const [scored, setScored] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [customizing, setCustomizing] = useState(false);
  const [customResult, setCustomResult] = useState(null);
  const [animateScores, setAnimateScores] = useState(false);

  useEffect(() => {
    api.get('/jobs').then(({ data }) => setJobs(data));
  }, []);

  const runScoring = async () => {
    setScoring(true);
    setScored(false);
    const { data } = await api.post('/resume/score', {});
    setScoreData(data);
    setScoring(false);
    setScored(true);
    setTimeout(() => setAnimateScores(true), 100);
  };

  const runCustomize = async () => {
    if (!selectedJob) return;
    setCustomizing(true);
    setCustomResult(null);
    const { data } = await api.post('/resume/customize', { jobId: selectedJob });
    setCustomResult(data);
    setCustomizing(false);
  };

  const sampleResumeSections = [
    'ARJUN SHARMA | arjun.sharma@email.com | +91 98765 43210 | Bangalore',
    '',
    'PROFESSIONAL SUMMARY',
    'Full-stack developer with 3+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud infrastructure on AWS.',
    '',
    'TECHNICAL SKILLS',
    'Frontend: React, TypeScript, Redux, Next.js, HTML5, CSS3',
    'Backend: Node.js, Express, Python, REST APIs, GraphQL',
    'Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, CI/CD',
    'Databases: PostgreSQL, MongoDB, Redis',
    '',
    'WORK EXPERIENCE',
    'Senior Frontend Developer | TechCorp Solutions | Jan 2022 – Present',
    '• Led frontend development for 3 major product features serving 50k+ users',
    '• Improved app performance by 40% through code splitting and lazy loading',
    '• Mentored 2 junior developers, conducting code reviews and knowledge sessions',
    '',
    'Full Stack Developer | StartupX | Jun 2020 – Dec 2021',
    '• Built REST APIs and React dashboards for fintech product with 10k+ DAU',
    '• Implemented Docker-based deployment reducing deployment time by 60%',
    '',
    'EDUCATION',
    'B.Tech Computer Science | IIT Bombay | 2016–2020 | 8.7 CGPA',
    '',
    'CERTIFICATIONS',
    'AWS Solutions Architect Associate | 2023',
    'Google Cloud Professional Developer | 2022',
  ];

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex gap-1 bg-surface-800 p-1 rounded-xl w-fit border border-white/5">
        {[
          { id: 'score', label: 'ATS Score', icon: Target },
          { id: 'preview', label: 'Resume Preview', icon: FileText },
          { id: 'customize', label: 'Customize for Job', icon: Zap },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === id ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ATS Score tab */}
      {tab === 'score' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: analyze */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-white">ATS Score Analysis</h3>
                  <p className="text-sm text-slate-400 mt-1">Analyze your current resume & see AI-generated score</p>
                </div>
                <button onClick={runScoring} disabled={scoring}
                  className="btn-primary flex items-center gap-2 text-sm">
                  {scoring ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {scoring ? 'Analyzing...' : scored ? 'Re-analyze' : 'Analyze Resume'}
                </button>
              </div>

              {!scored && !scoring && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                    <FileText size={28} className="text-brand-400" />
                  </div>
                  <p className="text-slate-400 text-sm">Click "Analyze Resume" to get your ATS score<br />and AI-powered improvement suggestions</p>
                </div>
              )}

              {scoring && (
                <div className="space-y-3">
                  {['Parsing resume sections...', 'Checking keyword density...', 'Scoring formatting...', 'Generating improvements...'].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                        <Loader2 size={10} className="text-brand-400 animate-spin" />
                      </div>
                      <span className="text-slate-400">{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {scored && scoreData && (
                <div className="space-y-4 animate-fade-in">
                  {/* Score comparison */}
                  <div className="flex items-center justify-around bg-white/3 rounded-xl p-5">
                    <ScoreGauge score={animateScores ? scoreData.score : 0} label="Current Resume" color="#f59e0b" />
                    <div className="flex flex-col items-center gap-1">
                      <ArrowUpRight size={20} className="text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-semibold">+{scoreData.generatedScore - scoreData.score} pts</span>
                    </div>
                    <ScoreGauge score={animateScores ? scoreData.generatedScore : 0} label="AI-Optimized Resume" color="#10b981" />
                  </div>

                  {/* Improvements */}
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                      <TrendingUp size={14} className="text-brand-400" /> Improvement Suggestions
                    </h4>
                    <div className="space-y-2">
                      {scoreData.improvements.map((imp, i) => (
                        <div key={i} className="flex items-start gap-3 bg-white/3 border border-white/5 rounded-xl p-3">
                          <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <AlertCircle size={12} className="text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-semibold text-slate-300">{imp.category}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-emerald-400 bg-emerald-500/10">
                                {imp.impact}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{imp.issue}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="btn-primary w-full flex items-center justify-center gap-2">
                    <Download size={15} /> Download AI-Optimized Resume
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: tips */}
          <div className="space-y-4">
            <div className="card p-5">
              <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <Star size={14} className="text-amber-400" /> ATS Tips
              </h4>
              <div className="space-y-3">
                {[
                  { tip: 'Use standard section headers', done: true },
                  { tip: 'Include job keywords verbatim', done: false },
                  { tip: 'Avoid tables and columns', done: true },
                  { tip: 'Use bullet points for experience', done: true },
                  { tip: 'Add measurable achievements', done: false },
                  { tip: 'Keep format clean and simple', done: true },
                ].map(({ tip, done }) => (
                  <div key={tip} className="flex items-center gap-2.5 text-sm">
                    {done
                      ? <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      : <AlertCircle size={14} className="text-amber-400 flex-shrink-0" />}
                    <span className={done ? 'text-slate-300' : 'text-slate-400'}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <Info size={14} className="text-brand-400" /> Score Breakdown
              </h4>
              {[
                { label: 'Keywords', score: 65 },
                { label: 'Formatting', score: 82 },
                { label: 'Readability', score: 78 },
                { label: 'Completeness', score: 71 },
                { label: 'Impact', score: 60 },
              ].map(({ label, score }) => (
                <div key={label} className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-slate-300 font-medium">{score}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview tab */}
      {tab === 'preview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white">Resume Preview</h3>
              <button className="btn-secondary text-sm flex items-center gap-1.5">
                <Download size={14} /> Export PDF
              </button>
            </div>
            <div className="bg-white rounded-xl p-8 font-mono text-xs text-gray-800 leading-relaxed overflow-y-auto max-h-[600px]">
              {sampleResumeSections.map((line, i) => (
                <div key={i} className={`${line === '' ? 'mt-3' : ''} ${line.includes('ARJUN') ? 'font-bold text-base text-center mb-1' : ''} ${['PROFESSIONAL SUMMARY', 'TECHNICAL SKILLS', 'WORK EXPERIENCE', 'EDUCATION', 'CERTIFICATIONS'].includes(line) ? 'font-bold text-sm border-b border-gray-300 pb-1 mt-3 mb-2 uppercase tracking-wider' : ''}`}>
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-5">
              <h4 className="font-semibold text-white text-sm mb-3">Resume Versions</h4>
              <div className="space-y-2">
                {['General ATS v3', 'Flipkart Customized', 'Razorpay Customized', 'Atlassian Customized'].map((v, i) => (
                  <div key={v} className="flex items-center justify-between p-2.5 bg-white/3 rounded-lg hover:bg-white/5 cursor-pointer transition-all">
                    <div className="flex items-center gap-2">
                      <FileText size={13} className="text-brand-400" />
                      <span className="text-sm text-slate-300">{v}</span>
                    </div>
                    {i === 0 && <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">Active</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customize tab */}
      {tab === 'customize' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6 space-y-4">
            <div>
              <h3 className="font-display font-semibold text-white mb-1">Customize Resume for Job</h3>
              <p className="text-sm text-slate-400">AI tailors your resume to match a specific job description</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Select Job</label>
              <select className="input" value={selectedJob} onChange={e => setSelectedJob(e.target.value)}>
                <option value="">-- Choose a job --</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title} @ {j.company} ({j.matchScore}% match)</option>
                ))}
              </select>
            </div>
            <button onClick={runCustomize} disabled={!selectedJob || customizing}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {customizing ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              {customizing ? 'Generating custom resume...' : 'Generate Custom Resume'}
            </button>

            {customResult && (
              <div className="animate-slide-up space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 size={16} /> Resume customized for {customResult.company}!
                </div>
                <div className="bg-white/3 border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-400">New ATS Score for this job</span>
                    <span className="font-display font-bold text-2xl text-emerald-400">{customResult.newScore}%</span>
                  </div>
                  <div className="space-y-1.5">
                    {customResult.customizations.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 size={11} className="text-emerald-400 flex-shrink-0" />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
                <button className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                  <Download size={14} /> Download {customResult.company} Resume
                </button>
              </div>
            )}
          </div>

          <div className="card p-6">
            <h4 className="font-semibold text-white text-sm mb-4">How AI Customization Works</h4>
            <div className="space-y-4">
              {[
                { step: '01', title: 'Parse Job Description', desc: 'AI reads required skills, keywords, and experience needed' },
                { step: '02', title: 'Match Profile Skills', desc: 'Maps your skills to job requirements, finding alignments' },
                { step: '03', title: 'Optimize Keywords', desc: 'Rewrites bullets to include JD-specific keywords naturally' },
                { step: '04', title: 'Reorder Sections', desc: 'Brings most relevant experience to the top for the recruiter' },
                { step: '05', title: 'Generate PDF', desc: 'ATS-friendly format with 95%+ parse accuracy' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/15 text-brand-400 text-xs font-bold font-mono flex items-center justify-center flex-shrink-0">
                    {step}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
