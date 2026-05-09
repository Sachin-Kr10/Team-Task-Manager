import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  HiOutlineMenuAlt2,
  HiOutlineBell,
  HiOutlineSearch
} from 'react-icons/hi'

const pageTitles = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Monitor projects, tasks and team productivity'
  },
  '/projects': {
    title: 'Projects',
    subtitle: 'Manage workspaces and collaborate with your team'
  },
  '/my-tasks': {
    title: 'My Tasks',
    subtitle: 'Track assigned work and deadlines'
  }
}

const Navbar = ({ onMenuToggle }) => {
  const location = useLocation()
  const { user } = useAuth()

  const getPageInfo = () => {
    if (location.pathname.startsWith('/projects/')) {
      return {
        title: 'Project Board',
        subtitle: 'Manage tasks, members and workflows'
      }
    }

    return (
      pageTitles[location.pathname] || {
        title: 'Dashboard',
        subtitle: 'Workspace overview'
      }
    )
  }

  const pageInfo = getPageInfo()

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[rgba(15,23,42,0.68)] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        {/* Gradient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_35%)]" />

        <div className="relative flex h-[78px] items-center justify-between px-4 sm:px-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <button
              onClick={onMenuToggle}
              id="menu-toggle-btn"
              className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-white lg:hidden"
            >
              <HiOutlineMenuAlt2
                size={22}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </button>

            {/* Title */}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-2xl font-black tracking-tight text-transparent">
                  {pageInfo.title}
                </h1>

                <div className="hidden h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] sm:block" />
              </div>

              <div className="mt-1 flex items-center gap-3">
                <p className="hidden text-sm font-medium text-slate-400 md:block">
                  {pageInfo.subtitle}
                </p>

                <span className="hidden text-slate-600 md:block">•</span>

                <p className="text-xs font-medium tracking-wide text-slate-500">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Notification */}
            <button
              id="notification-btn"
              className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-white"
            >
              <HiOutlineBell
                size={20}
                className="transition-transform duration-300 group-hover:rotate-12"
              />

              <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border border-[#020617] bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)]" />
            </button>

            {/* User */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-2 pr-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]">
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-violet-500 text-sm font-black text-white shadow-[0_0_25px_rgba(59,130,246,0.35)]">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="hidden text-left lg:block">
                <h3 className="text-sm font-semibold text-white">
                  {user?.name || 'User'}
                </h3>

                <p className="text-xs text-slate-400">
                  Team Member
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar