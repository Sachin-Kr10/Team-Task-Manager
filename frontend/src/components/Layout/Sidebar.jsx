import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineFolder,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineX,
  HiOutlineSparkles
} from 'react-icons/hi';

const navItems = [
  { to: '/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard', description: 'Overview & stats' },
  { to: '/projects', icon: HiOutlineFolder, label: 'Projects', description: 'Manage workspaces' },
  { to: '/my-tasks', icon: HiOutlineClipboardList, label: 'My Tasks', description: 'Assigned to you' }
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ── Brand Header ── */}
      <div className="px-6 pt-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              boxShadow: '0 4px 24px rgba(59, 130, 246, 0.35)'
            }}
          >
            <span className="text-white font-black text-lg relative z-10">T</span>
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%)' }}
            />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">TaskFlow</h1>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Team Manager</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2.5 rounded-xl hover:bg-white/5 text-white/30 hover:text-white transition-all duration-200"
        >
          <HiOutlineX size={20} />
        </button>
      </div>

      {/* ── Navigation Label ── */}
      <div className="px-7 mb-3">
        <p className="text-[10px] font-extrabold text-white/[0.12] uppercase tracking-[0.25em]">Navigation</p>
      </div>

      {/* ── Nav Links ── */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to ||
            (item.to === '/projects' && location.pathname.startsWith('/projects/'));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="block"
            >
              <div
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 relative group
                  ${isActive
                    ? 'text-white bg-gradient-to-r from-primary-500/[0.12] to-accent-500/[0.06] border border-primary-500/[0.15]'
                    : 'text-white/35 hover:text-white/70 border border-transparent hover:bg-white/[0.03]'
                  }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-[25%] bottom-[25%] w-[3px] rounded-full transition-all duration-300"
                    style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }}
                  />
                )}

                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                  ${isActive
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'bg-white/[0.03] text-white/25 group-hover:bg-white/[0.06] group-hover:text-white/50'
                  }`}
                >
                  <item.icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="block leading-tight">{item.label}</span>
                  <span className={`text-[10px] font-medium block leading-tight mt-0.5
                    ${isActive ? 'text-primary-400/60' : 'text-white/[0.12]'}`}
                  >
                    {item.description}
                  </span>
                </div>

                {/* Active glow dot */}
                {isActive && (
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0"
                    style={{ boxShadow: '0 0 8px 2px rgba(99,102,241,0.5)' }}
                  />
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>


      {/* ── Separator ── */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* ── User Profile ── */}
      <div className="p-4">
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] mb-3 group hover:bg-white/[0.04] transition-all duration-300">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shrink-0 ring-2 ring-white/10 shadow-lg"
            style={{ background: user?.avatar || 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-white/20 truncate font-medium">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-rose-400/40 hover:text-rose-400 hover:bg-rose-500/[0.06] border border-transparent hover:border-rose-500/10 transition-all duration-300"
        >
          <HiOutlineLogout size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar - always visible on lg+ */}
      <aside
        className="fixed left-0 top-0 bottom-0 z-50 hidden lg:flex flex-col"
        style={{
          width: '272px',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '4px 0 32px rgba(0,0,0,0.5)'
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar - slide in/out */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col lg:hidden sidebar-transition
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          width: '272px',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          boxShadow: isOpen ? '8px 0 48px rgba(0,0,0,0.6)' : 'none'
        }}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
