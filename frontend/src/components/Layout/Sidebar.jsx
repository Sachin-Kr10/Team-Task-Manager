import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineFolder,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineX
} from 'react-icons/hi';

const navItems = [
  { to: '/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard' },
  { to: '/projects', icon: HiOutlineFolder, label: 'Projects' },
  { to: '/my-tasks', icon: HiOutlineClipboardList, label: 'My Tasks' }
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">TaskFlow</h1>
            <p className="text-xs text-white/40">Team Manager</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
        >
          <HiOutlineX size={20} />
        </button>
      </div>

      {/* Separator */}
      <div className="mx-4 h-px bg-white/5" />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
                    borderLeft: '3px solid #6366f1'
                  }
                : {}
            }
          >
            <item.icon size={20} className="shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Separator */}
      <div className="mx-4 h-px bg-white/5" />

      {/* User profile & logout */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm shrink-0"
            style={{ background: user?.avatar || '#6366f1' }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-white/40 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
        >
          <HiOutlineLogout size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block fixed left-0 top-0 bottom-0 w-72 z-50"
        style={{
          background: 'linear-gradient(180deg, rgba(17,17,39,0.95) 0%, rgba(10,10,26,0.98) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(17,17,39,0.98) 0%, rgba(10,10,26,1) 100%)',
              borderRight: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
