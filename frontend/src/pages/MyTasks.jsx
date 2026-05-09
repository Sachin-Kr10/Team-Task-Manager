import { useState, useEffect } from 'react'
import { tasksAPI } from '../services/api'
import toast from 'react-hot-toast'
import {
  HiOutlineClipboardList,
  HiOutlineFilter,
  HiOutlineCalendar,
  HiOutlineFlag,
  HiOutlineChevronDown,
  HiOutlineFolder,
  HiOutlineSparkles,
  HiOutlineClock
} from 'react-icons/hi'

const statusCfg = {
  todo: {
    label: 'To Do',
    bg: 'rgba(129,140,248,0.12)',
    color: '#818cf8',
    dot: '#818cf8'
  },
  'in-progress': {
    label: 'In Progress',
    bg: 'rgba(251,191,36,0.12)',
    color: '#fbbf24',
    dot: '#fbbf24'
  },
  review: {
    label: 'Review',
    bg: 'rgba(167,139,250,0.12)',
    color: '#a78bfa',
    dot: '#a78bfa'
  },
  completed: {
    label: 'Completed',
    bg: 'rgba(52,211,153,0.12)',
    color: '#34d399',
    dot: '#34d399'
  }
}

const priCfg = {
  low: {
    label: 'Low',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.12)'
  },
  medium: {
    label: 'Medium',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.12)'
  },
  high: {
    label: 'High',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.12)'
  },
  urgent: {
    label: 'Urgent',
    color: '#f87171',
    bg: 'rgba(248,113,113,0.12)'
  }
}

const MyTasks = () => {
  const [tasks, setTasks] = useState([])

  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] =
    useState('')

  const [priorityFilter, setPriorityFilter] =
    useState('')

  useEffect(() => {
    fetchTasks()
  }, [statusFilter, priorityFilter])

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams()

      if (statusFilter) {
        params.append('status', statusFilter)
      }

      if (priorityFilter) {
        params.append(
          'priority',
          priorityFilter
        )
      }

      const res = await tasksAPI.getMyTasks(
        params.toString()
      )

      setTasks(res.data.data)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (
    taskId,
    newStatus
  ) => {
    try {
      await tasksAPI.updateStatus(
        taskId,
        newStatus
      )

      fetchTasks()

      toast.success('Status updated')
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed'
      )
    }
  }

  const summary = Object.entries(statusCfg).map(
    ([key, cfg]) => ({
      ...cfg,
      key,
      count: tasks.filter(
        (t) => t.status === key
      ).length
    })
  )

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="h-5 w-40 animate-pulse rounded-full bg-white/[0.05]" />

            <div className="h-12 w-72 animate-pulse rounded-2xl bg-white/[0.05]" />

            <div className="h-4 w-96 animate-pulse rounded-xl bg-white/[0.05]" />
          </div>

          <div className="flex gap-3">
            <div className="h-12 w-40 animate-pulse rounded-2xl bg-white/[0.05]" />

            <div className="h-12 w-40 animate-pulse rounded-2xl bg-white/[0.05]" />
          </div>
        </div>

        {/* Summary Skeleton */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-[rgba(15,23,42,0.72)] backdrop-blur-2xl"
            />
          ))}
        </div>

        {/* Tasks Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-[30px] border border-white/10 bg-[rgba(15,23,42,0.72)] backdrop-blur-2xl"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative space-y-8 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-0 h-[340px] w-[340px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-[-10%] h-[340px] w-[340px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(15,23,42,0.72)] p-8 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_30%)]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:60px_60px]" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          {/* Left */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              <HiOutlineSparkles size={14} />
              Personal Workspace
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
              My&nbsp;
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                Tasks
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
              You currently have{' '}
              <span className="font-black text-white">
                {tasks.length}
              </span>{' '}
              assigned task
              {tasks.length !== 1 ? 's' : ''}.
              Stay productive and keep your workflow
              moving efficiently.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Status */}
            <div className="relative">
              <HiOutlineFilter
                size={16}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="w-full appearance-none rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.72)] py-3 pl-11 pr-10 text-sm font-bold text-white outline-none backdrop-blur-xl transition-all duration-300 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">
                  All Status
                </option>

                {Object.entries(statusCfg).map(
                  ([v, c]) => (
                    <option
                      key={v}
                      value={v}
                    >
                      {c.label}
                    </option>
                  )
                )}
              </select>

              <HiOutlineChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>

            {/* Priority */}
            <div className="relative">
              <HiOutlineFlag
                size={16}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500"
              />

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value
                  )
                }
                className="w-full appearance-none rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.72)] py-3 pl-11 pr-10 text-sm font-bold text-white outline-none backdrop-blur-xl transition-all duration-300 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">
                  All Priority
                </option>

                {Object.entries(priCfg).map(
                  ([v, c]) => (
                    <option
                      key={v}
                      value={v}
                    >
                      {c.label}
                    </option>
                  )
                )}
              </select>

              <HiOutlineChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((s, i) => (
          <button
            key={s.key}
            onClick={() =>
              setStatusFilter(
                statusFilter === s.key
                  ? ''
                  : s.key
              )
            }
            className={`group relative overflow-hidden rounded-[28px] border bg-[rgba(15,23,42,0.72)] p-6 text-left backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] ${
              statusFilter === s.key
                ? 'border-white/15 shadow-[0_0_30px_rgba(59,130,246,0.12)]'
                : 'border-white/10'
            }`}
            style={{
              animationDelay: `${i * 60}ms`
            }}
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_35%)]" />

            {/* Orb */}
            <div
              className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125"
              style={{
                background: s.color + '15'
              }}
            />

            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full shadow-[0_0_12px]"
                  style={{
                    background: s.dot
                  }}
                />

                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                  {s.label}
                </span>
              </div>

              <h3 className="text-4xl font-black tracking-tight text-white">
                {s.count}
              </h3>

              <p className="mt-2 text-xs font-medium text-slate-500">
                Active tasks
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Tasks */}
      {tasks.length > 0 ? (
        <div className="space-y-5">
          {tasks.map((task, i) => (
            <div
              key={task._id}
              className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(15,23,42,0.72)] p-6 backdrop-blur-3xl shadow-[0_15px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(0,0,0,0.45)] md:p-8"
              style={{
                animationDelay: `${i * 60}ms`
              }}
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_30%)]" />

              {/* Decorative */}
              <HiOutlineClipboardList
                size={160}
                className="absolute -bottom-8 -right-8 text-white/[0.03]"
              />

              <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center">
                {/* Left */}
                <div className="flex min-w-0 flex-1 items-start gap-5">
                  {/* Priority Bar */}
                  <div
                    className="mt-1 h-24 w-1.5 rounded-full"
                    style={{
                      background:
                        priCfg[
                          task.priority
                        ]?.color
                    }}
                  />

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    {/* Top Tags */}
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      {/* Priority */}
                      <div
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em]"
                        style={{
                          background:
                            priCfg[
                              task.priority
                            ]?.bg,
                          color:
                            priCfg[
                              task.priority
                            ]?.color
                        }}
                      >
                        <HiOutlineFlag
                          size={12}
                        />

                        {
                          priCfg[
                            task.priority
                          ]?.label
                        }
                      </div>

                      {/* Project */}
                      {task.project && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/6 bg-white/[0.03] px-4 py-2 text-xs font-bold text-slate-400">
                          <HiOutlineFolder
                            size={14}
                          />

                          {task.project.name}
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black leading-tight tracking-tight text-white">
                      {task.title}
                    </h3>

                    {/* Desc */}
                    {task.description && (
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-wrap items-center gap-4 xl:ml-auto">
                  {/* Due */}
                  {task.dueDate && (
                    <div
                      className={`flex items-center gap-2 rounded-2xl border px-4 py-3 ${
                        new Date(
                          task.dueDate
                        ) < new Date() &&
                        task.status !==
                          'completed'
                          ? 'border-rose-500/10 bg-rose-500/10 text-rose-400'
                          : 'border-white/8 bg-white/[0.03] text-slate-400'
                      }`}
                    >
                      <HiOutlineCalendar
                        size={16}
                      />

                      <span className="text-xs font-bold uppercase tracking-[0.12em]">
                        {new Date(
                          task.dueDate
                        ).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric'
                          }
                        )}
                      </span>
                    </div>
                  )}

                  {/* Status */}
                  <div className="relative">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(
                          task._id,
                          e.target.value
                        )
                      }
                      className="appearance-none rounded-2xl border px-5 py-3 pr-10 text-xs font-black uppercase tracking-[0.18em] outline-none transition-all duration-300"
                      style={{
                        background:
                          statusCfg[
                            task.status
                          ]?.bg,
                        color:
                          statusCfg[
                            task.status
                          ]?.color,
                        border: `1px solid ${
                          statusCfg[
                            task.status
                          ]?.color
                        }20`
                      }}
                    >
                      {Object.entries(
                        statusCfg
                      ).map(([s, c]) => (
                        <option
                          key={s}
                          value={s}
                        >
                          {c.label}
                        </option>
                      ))}
                    </select>

                    <HiOutlineChevronDown
                      size={14}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                      style={{
                        color:
                          statusCfg[
                            task.status
                          ]?.color
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(15,23,42,0.72)] p-16 text-center backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          {/* Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_35%)]" />

          <div className="relative z-10 mx-auto max-w-lg">
            <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-white/[0.03] ring-1 ring-white/10">
              <HiOutlineClock
                size={54}
                className="text-slate-600"
              />
            </div>

            <h3 className="text-3xl font-black text-white">
              No Tasks Found
            </h3>

            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-400">
              {statusFilter ||
              priorityFilter
                ? 'Try adjusting your filters to view more matching tasks.'
                : 'You currently have no assigned tasks. New tasks will appear here automatically.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyTasks