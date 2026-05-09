import { useLocation } from 'react-router-dom';
import { HiOutlineMenu } from 'react-icons/hi';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/my-tasks': 'My Tasks'
};

const Navbar = ({ onMenuToggle }) => {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.startsWith('/projects/')) return 'Project Details';
    return pageTitles[location.pathname] || 'Dashboard';
  };

  return (
    <header
      className="sticky top-0 z-30 px-4 md:px-6 lg:px-8 py-4"
      style={{
        background: 'rgba(10,10,26,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"
          id="menu-toggle-btn"
        >
          <HiOutlineMenu size={22} />
        </button>

        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">{getTitle()}</h1>
          <p className="text-xs text-white/40 mt-0.5">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
