import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HiOutlineMenu, HiOutlineBell } from 'react-icons/hi';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your workspace' },
  '/projects': { title: 'Projects', subtitle: 'Manage your team workspaces' },
  '/my-tasks': { title: 'My Tasks', subtitle: 'Tasks assigned to you' }
};

const Navbar = ({ onMenuToggle }) => {
  const location = useLocation();
  const { user } = useAuth();

  const getPageInfo = () => {
    if (location.pathname.startsWith('/projects/')) {
      return { title: 'Project Board', subtitle: 'Kanban view & team management' };
    }
    return pageTitles[location.pathname] || { title: 'Dashboard', subtitle: 'Overview' };
  };

  const pageInfo = getPageInfo();

  return (
    <header
      className="sticky top-0 z-30 px-5 md:px-6 lg:px-8"
      style={{
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <div className="flex items-center justify-between h-[68px]">
        {/* Left: Hamburger + Page info */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2.5 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all duration-200"
            id="menu-toggle-btn"
          >
            <HiOutlineMenu size={22} />
          </button>

          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{pageInfo.title}</h1>
            <p className="text-[11px] text-white/20 font-medium mt-0.5 hidden sm:block">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button className="relative p-2.5 rounded-xl hover:bg-white/5 text-white/25 hover:text-white/60 transition-all duration-200" id="notification-btn">
            <HiOutlineBell size={20} />
            <div
              className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full"
              style={{ boxShadow: '0 0 6px 1px rgba(99,102,241,0.5)' }}
            />
          </button>

          {/* User avatar (mobile) */}
          <div className="lg:hidden flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10"
              style={{ background: user?.avatar || 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
