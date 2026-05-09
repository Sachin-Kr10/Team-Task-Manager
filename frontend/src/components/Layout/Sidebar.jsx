import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  HiOutlineViewGrid,
  HiOutlineFolder,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineX,
  HiOutlineSparkles
} from 'react-icons/hi'

const navItems = [
  {
    to: '/dashboard',
    icon: HiOutlineViewGrid,
    label: 'Dashboard',
    description: 'Overview & analytics'
  },
  {
    to: '/projects',
    icon: HiOutlineFolder,
    label: 'Projects',
    description: 'Manage workspaces'
  },
  {
    to: '/my-tasks',
    icon: HiOutlineClipboardList,
    label: 'My Tasks',
    description: 'Assigned tasks'
  }
]

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const sidebarContent = (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(231, 91, 56, 0.14),transparent_35%)]" />

        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-blue-500/[0.03] to-transparent" />
      </div>

      {/* Top */}
      <div className="relative z-10 border-b border-white/8 px-6 pb-6 pt-7">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-bl-500 via-cyan-400 to-violet-500 shadow-[0_0_40px_rgba(59,130,246,0.45)]">
              <span className="relative z-10 text-xl font-black text-white">
                T
              </span>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_55%)]" />
            </div>

            <div>
              <h1 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-xl font-black tracking-tight text-transparent">
                TaskFlow
              </h1>

              <div className="mt-1 flex items-center gap-2">

                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
                  Team Workspace
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-400 transition-all duration-300 hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            <HiOutlineX size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="relative z-10 flex-1 px-4 py-6">
        {/* Label */}
        <div className="mb-5 px-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-slate-600">
            Navigation
          </p>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to === '/projects' &&
                location.pathname.startsWith('/projects/'))

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className="block"
              >
                <div
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'border-blue-500/20 bg-gradient-to-r from-blue-500/[0.14] to-cyan-500/[0.04] shadow-[0_0_30px_rgba(59,130,246,0.12)]'
                      : 'border-transparent bg-transparent hover:border-white/8 hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Active Glow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(59,130,246,0.15),transparent_60%)]" />
                  )}

                  <div className="relative flex items-center gap-3 px-4 py-3.5">
                    {/* Left Indicator */}
                    <div
                      className={`absolute left-0 top-[18%] h-[64%] w-[4px] rounded-r-full transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-b from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]'
                          : 'bg-transparent'
                      }`}
                    />

                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-blue-500/15 text-blue-400'
                          : 'bg-white/[0.03] text-slate-500 group-hover:bg-white/[0.06] group-hover:text-slate-300'
                      }`}
                    >
                      <item.icon size={20} />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`truncate text-sm font-bold transition-all duration-300 ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </h3>

                      <p
                        className={`mt-0.5 truncate text-[11px] font-medium ${
                          isActive
                            ? 'text-blue-300/70'
                            : 'text-slate-600 group-hover:text-slate-500'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Right Dot */}
                    {isActive && (
                      <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.9)]" />
                    )}
                  </div>
                </div>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Bottom User Card */}
      <div className="relative z-10 border-t border-white/8 p-4">
        {/* User */}
        <div className="mb-3 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.05]">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-violet-500 text-base font-black text-white shadow-[0_0_25px_rgba(59,130,246,0.35)]">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-white">
                {user?.name || 'User'}
              </h3>

              <p className="mt-1 truncate text-xs text-slate-400">
                {user?.email}
              </p>

              <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-rose-500/10 bg-rose-500/[0.04] px-4 py-3 text-sm font-bold text-rose-400 transition-all duration-300 hover:bg-rose-500/[0.08] hover:shadow-[0_0_20px_rgba(244,63,94,0.12)]"
        >
          <HiOutlineLogout
            size={18}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />

          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[290px] border-r border-white/10 bg-[rgba(2,6,23,0.82)] backdrop-blur-3xl shadow-[10px_0_60px_rgba(0,0,0,0.45)] lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[290px] transform border-r border-white/10 bg-[rgba(2,6,23,0.94)] backdrop-blur-3xl transition-all duration-300 ease-out lg:hidden ${
          isOpen
            ? 'translate-x-0 shadow-[10px_0_60px_rgba(0,0,0,0.6)]'
            : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar