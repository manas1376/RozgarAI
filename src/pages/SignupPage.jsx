import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Bot, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signup(form.name, form.email, form.password);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  const perks = ['AI-powered job matching', 'Auto-apply to 100s of jobs', 'ATS resume optimization', 'Real-time application tracking'];

  return (
    <div className="min-h-screen bg-surface-950 mesh-bg flex items-center justify-center p-4">
      <div className="fixed top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-4xl animate-fade-in grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-xl shadow-brand-500/30">
              <Bot size={22} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white"><Rozgar></Rozgar>AI</span>
          </div>
          <h2 className="font-display font-bold text-4xl text-white leading-tight mb-4">
            Land your dream job<br />
            <span className="gradient-text">10x faster</span>
          </h2>
          <p className="text-slate-400 mb-8">Join thousands of job seekers using AI to automate and optimize their job search.</p>
          <div className="space-y-3">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="card-glow p-8">
          <div className="mb-6">
            <h2 className="font-display font-semibold text-xl text-white">Create account</h2>
            <p className="text-slate-400 text-sm mt-1">Start your AI-powered job search</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
              <AlertCircle size={14} className="text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Full Name</label>
              <input type="text" className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your full name" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email</label>
              <input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input pr-12" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 8 characters" minLength={6} required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 h-11 mt-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ArrowRight size={16} /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account? <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
