import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Bot, Eye, EyeOff, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'demo@applyai.dev', password: 'demo123' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <div className="min-h-screen bg-surface-950 mesh-bg flex items-center justify-center p-4">
      {/* Decorative orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-2xl shadow-brand-500/30 mb-4 float-anim">
            <Bot size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white"><Rozgar></Rozgar>AI</h1>
          <p className="text-slate-400 mt-1 text-sm">Your autonomous job application assistant</p>
        </div>

        {/* Card */}
        <div className="card-glow p-8">
          <div className="mb-6">
            <h2 className="font-display font-semibold text-xl text-white">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to continue your job search</p>
          </div>

          {/* Demo hint */}
          <div className="flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-xl p-3 mb-5">
            <Sparkles size={14} className="text-brand-400 flex-shrink-0" />
            <p className="text-xs text-brand-300">Demo credentials pre-filled. Just click Sign In!</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
              <AlertCircle size={14} className="text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-12"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-brand-400 hover:text-brand-300">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 h-11">
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
