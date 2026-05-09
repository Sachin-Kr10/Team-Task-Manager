import { useState, useEffect } from 'react'
import { dashboardAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import {
  HiOutlineFolder,
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineLightningBolt,
  HiOutlineClock,
  HiOutlineArrowRight
} from 'react-icons/hi'
import { Link } from 'react-router-dom'

const statCards = [
  {
    key: 'totalProjects',
    icon: HiOutlineFolder,
    label: 'Active Projects',
    gradient: 'from-blue-500 to-cyan-400',
   
  },
  {
    key: 'totalTasks',
    icon: HiOutlineClipboardList,
    label: 'Total Tasks',
    gradient: 'from-cyan-500 to-blue-500',
    
  },
  {
    key: 'completedThisWeek',
    icon: HiOutlineCheckCircle,
    label: 'Done This Week',
    gradient: 'from-emerald-500 to-green-400',
  },
  {
    key: 'overdueTasks',
    icon: HiOutlineExclamationCircle,
    label: 'Overdue',
    gradient: 'from-rose-500 to-orange-400',
  }
]

const statusChart = [
  {
    label: 'To Do',
    status: 'todo',
    color: '#818cf8',
    icon: '🎯'
  },
  {
    label: 'In Progress',
    status: 'in-progress',
    color: '#fbbf24',
    icon: '⚡'
  },
  {
    label: 'In Review',
    status: 'review',
    color: '#a78bfa',
    icon: '🔍'
  },
  {
    label: 'Completed',
    status: 'completed',
    color: '#34d399',
    icon: '✅'
  }
]

const Dashboard = () => {
  const [stats, setStats] = useState(null)

  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await dashboardAPI.getStats()

      setStats(res.data.data)
    } catch {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-72 rounded-2xl bg-white/[0.05]" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 rounded-[28px] border border-white/10 bg-[rgba(15,23,42,0.72)] backdrop-blur-2xl"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="h-[420px] rounded-[28px] border border-white/10 bg-[rgba(15,23,42,0.72)] backdrop-blur-2xl" />

          <div className="h-[420px] rounded-[28px] border border-white/10 bg-[rgba(15,23,42,0.72)] backdrop-blur-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative space-y-8 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-0 h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-[-10%] h-[320px] w-[320px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(15,23,42,0.72)] p-8 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_30%)]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:60px_60px]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              Workspace Overview
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
              Hello,&nbsp;
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                {user?.name?.split(' ')[0]}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
              You currently have{' '}
              <span className="font-bold text-white">
                {stats?.myTasks || 0}
              </span>{' '}
              active tasks waiting for your attention today.
            </p>
          </div>

          <Link
            to="/my-tasks"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-blue-400/20 bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(59,130,246,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(59,130,246,0.35)]"
          >
            View My Tasks

            <HiOutlineArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, i) => (
          <div
            key={card.key}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(15,23,42,0.72)] p-6 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            style={{
              animationDelay: `${i * 80}ms`
            }}
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_35%)]" />

            <div
              className={`absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-2xl transition-transform duration-700 group-hover:scale-125`}
            />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  {card.label}
                </p>

                <h2 className="mt-3 text-5xl font-black tracking-tight text-white">
                  {stats?.[card.key] || 0}
                </h2>
              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br ${card.gradient} text-white ${card.glow} transition-all duration-300 group-hover:rotate-6 group-hover:scale-110`}
              >
                <card.icon size={30} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Distribution */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(15,23,42,0.72)] p-8 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_35%)]" />

          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
                <HiOutlineLightningBolt size={26} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">
                  Task Distribution
                </h3>

                <p className="text-sm text-slate-400">
                  Track workflow progress across your workspace
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {statusChart.map((cfg, i) => {
                const count =
                  stats?.statusBreakdown?.[cfg.status] || 0

                const total = stats?.totalTasks || 1

                const percentage = Math.round(
                  (count / total) * 100
                )

                return (
                  <div key={cfg.status}>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {cfg.icon}
                        </span>

                        <div>
                          <p className="text-sm font-bold text-white">
                            {cfg.label}
                          </p>

                          <p className="text-xs text-slate-500">
                            {count} Tasks
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-black text-white">
                        {percentage}%
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/[0.04] ring-1 ring-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}dd)`,
                          transitionDelay: `${i * 120}ms`
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(15,23,42,0.72)] p-8 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.10),transparent_35%)]" />

          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                <HiOutlineClock size={24} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">
                  Recent Activity
                </h3>

                <p className="text-sm text-slate-400">
                  Latest updates from your workspace
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {stats?.recentTasks?.length > 0 ? (
                stats.recentTasks.map((task) => (
                  <div
                    key={task._id}
                    className="group flex items-center gap-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 transition-all duration-300 hover:translate-x-1 hover:bg-white/[0.05]"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-violet-500 text-lg font-black text-white shadow-[0_0_25px_rgba(59,130,246,0.25)]">
                      {task.assignee?.name?.charAt(0) ||
                        '?'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-bold text-white">
                        {task.title}
                      </h4>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        {task.project?.name}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          task.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : task.status ===
                              'in-progress'
                            ? 'bg-amber-500/10 text-amber-400'
                            : task.status === 'review'
                            ? 'bg-violet-500/10 text-violet-400'
                            : 'bg-blue-500/10 text-blue-400'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-16 text-slate-500">
                  <HiOutlineClipboardList size={70} />

                  <p className="mt-5 text-base font-bold">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard