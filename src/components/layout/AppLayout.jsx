import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  LayoutDashboard, User, FileText, Briefcase, Zap, ListChecks,
  Bell, TrendingUp, LogOut, Menu, X, ChevronRight, Settings,
  Sparkles, Bot
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/profile', icon: User, label: 'My Profile' },
  { path: '/resume', icon: FileText, label: 'Resume Builder' },
  { path: '/jobs', icon: Briefcase, label: 'Job Finder' },
  { path: '/apply', icon: Zap, label: 'Auto Apply' },
  { path: '/tracker', icon: ListChecks, label: 'Tracker' },
  { path: '/skills', icon: TrendingUp, label: 'Skill Gap' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    api.get('/notifications').then(({ data }) => {
      setUnreadCount(data.filter(n => !n.read).length);
    }).catch(() => {});
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const currentPage = navItems.find(n => location.pathname === n.path);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950 mesh-bg">
      {/* Mobile overlay */}
      {mobileSidebar && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileSidebar(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50 flex flex-col
        bg-surface-900 border-r border-white/5 transition-all duration-300
        ${sidebarOpen ? 'w-64' : 'w-16'}
        ${mobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/25">
            <Bot size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="font-display font-bold text-lg text-white leading-none">RozgarAI</div>
              <div className="text-xs text-brand-400 font-mono mt-0.5"></div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileSidebar(false)}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-2' : ''}`
              }
            >
              <div className="relative flex-shrink-0">
                <Icon size={18} />
                {path === '/notifications' && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              {sidebarOpen && <span className="truncate">{label}</span>}
              {sidebarOpen && path === '/apply' && (
                <span className="ml-auto text-[10px] font-bold text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded-full">AI</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/5">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-200 truncate">{user?.name}</div>
                <div className="text-xs text-slate-500 truncate">{user?.email}</div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`sidebar-item w-full mt-1 text-red-400 hover:text-red-300 hover:bg-red-500/5 ${!sidebarOpen ? 'justify-center px-2' : ''}`}
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle btn */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-800 border border-white/10 items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ChevronRight size={12} className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-4 bg-surface-900/50 backdrop-blur border-b border-white/5 flex-shrink-0">
          <button
            onClick={() => setMobileSidebar(true)}
            className="lg:hidden btn-ghost p-2"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1">
            <h1 className="font-display font-semibold text-lg text-white">
              {currentPage?.label || 'ApplyAI'}
            </h1>
            <div className="text-xs text-slate-500 font-mono">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Status */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Active
            </div>

            {/* Notifications bell */}
            <NavLink to="/notifications" className="relative btn-ghost p-2">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </NavLink>

            {/* Profile */}
            <NavLink to="/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0] || 'U'}
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
