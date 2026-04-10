import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/auth/forgot-password', { email }).catch(() => {});
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface-950 mesh-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-2xl shadow-brand-500/30 mb-4">
            <Bot size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white"><Rozgar></Rozgar>AI</h1>
        </div>

        <div className="card-glow p-8">
          {!sent ? (
            <>
              <div className="mb-6">
                <h2 className="font-display font-semibold text-xl text-white">Reset password</h2>
                <p className="text-slate-400 text-sm mt-1">Enter your email to receive a reset link</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email address</label>
                  <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 h-11">
                  {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={16} /> Send Reset Link</>}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg text-white mb-2">Check your email</h3>
              <p className="text-slate-400 text-sm">We've sent a password reset link to <span className="text-slate-200 font-medium">{email}</span></p>
            </div>
          )}

          <Link to="/login" className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mt-5 justify-center transition-colors">
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
