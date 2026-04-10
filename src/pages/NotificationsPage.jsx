import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Bell, CheckCircle2, MessageSquare, Calendar, Check, CheckCheck,
  Zap, Filter, Clock, Trash2
} from 'lucide-react';

const TYPE_CONFIG = {
  applied:   { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/20' },
  response:  { icon: MessageSquare, color: 'text-blue-400',   bg: 'bg-blue-500/15 border-blue-500/20' },
  interview: { icon: Calendar,      color: 'text-amber-400',  bg: 'bg-amber-500/15 border-amber-500/20' },
  default:   { icon: Bell,          color: 'text-brand-400',  bg: 'bg-brand-500/15 border-brand-500/20' },
};

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/notifications').then(({ data }) => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'applied') return n.type === 'applied';
    if (filter === 'response') return n.type === 'response';
    if (filter === 'interview') return n.type === 'interview';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-white text-lg">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-white bg-brand-600 px-2 py-0.5 rounded-full">{unreadCount} new</span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-0.5">Stay updated on your job applications</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm flex items-center gap-1.5">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-surface-800 p-1 rounded-xl border border-white/5 w-fit">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'interview', label: 'Interviews' },
          { id: 'response', label: 'Responses' },
          { id: 'applied', label: 'Applied' },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setFilter(id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
              ${filter === id ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="card h-20 shimmer-bg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No notifications here</p>
        </div>
      ) : (
        <div className="space-y-2 stagger-children">
          {filtered.map(notif => {
            const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.default;
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                onClick={() => !notif.read && markRead(notif.id)}
                className={`card p-4 flex items-start gap-3 cursor-pointer transition-all hover:border-white/10
                  ${!notif.read ? 'border-white/10 bg-surface-800' : 'opacity-60'}`}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon size={16} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className={`text-sm font-semibold ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                        {notif.title}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notif.read && <div className="w-2 h-2 rounded-full bg-brand-400" />}
                      <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">{timeAgo(notif.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Activity log section */}
      <div className="card p-5 mt-6">
        <h4 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
          <Clock size={14} className="text-brand-400" /> Activity Log
        </h4>
        <div className="space-y-3">
          {[
            { action: 'Resume customized for Flipkart JD', time: '2h ago', type: 'resume' },
            { action: 'Interview scheduled at Freshworks', time: '6h ago', type: 'interview' },
            { action: 'Auto-applied to Urban Company (Node.js Developer)', time: '8h ago', type: 'apply' },
            { action: 'Response received from Ola Recruiter', time: '1d ago', type: 'response' },
            { action: 'ATS Score improved from 68 to 74', time: '2d ago', type: 'ats' },
            { action: 'Applied to Paytm – Senior Frontend Developer', time: '2d ago', type: 'apply' },
          ].map(({ action, time, type }, i) => {
            const dotColors = {
              resume: 'bg-purple-400', interview: 'bg-emerald-400',
              apply: 'bg-brand-400', response: 'bg-blue-400', ats: 'bg-amber-400'
            };
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${dotColors[type] || 'bg-slate-500'}`} />
                  {i < 5 && <div className="w-px h-6 bg-white/5 mt-1" />}
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-sm text-slate-300">{action}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
