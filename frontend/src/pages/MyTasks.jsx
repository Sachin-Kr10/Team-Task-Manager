import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  HiOutlineClipboardList, HiOutlineFilter,
  HiOutlineCalendar, HiOutlineFlag, HiOutlineChevronDown,
  HiOutlineFolder
} from 'react-icons/hi';

const statusCfg = {
  'todo': { label: 'To Do', bg: 'rgba(129,140,248,0.1)', color: '#818cf8', dot: '#818cf8' },
  'in-progress': { label: 'In Progress', bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', dot: '#fbbf24' },
  'review': { label: 'Review', bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', dot: '#a78bfa' },
  'completed': { label: 'Completed', bg: 'rgba(52,211,153,0.1)', color: '#34d399', dot: '#34d399' }
};

const priCfg = {
  'low': { label: 'Low', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  'medium': { label: 'Medium', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  'high': { label: 'High', color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
  'urgent': { label: 'Urgent', color: '#f87171', bg: 'rgba(248,113,113,0.1)' }
};

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => { fetchTasks(); }, [statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      const res = await tasksAPI.getMyTasks(params.toString());
      setTasks(res.data.data);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      fetchTasks();
      toast.success('Status updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="glass-card-static p-6 h-24 animate-pulse" />)}
    </div>
  );

  const summary = Object.entries(statusCfg).map(([key, cfg]) => ({
    ...cfg, key, count: tasks.filter(t => t.status === key).length
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">My Tasks</h2>
          <p className="text-white/30 font-medium mt-1">{tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned to you</p>
        </div>
        <div className="flex items-center gap-2">
          <HiOutlineFilter className="text-white/20" size={16} />
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input py-2.5 px-4 pr-8 text-xs font-bold w-auto appearance-none cursor-pointer">
              <option value="">All Status</option>
              {Object.entries(statusCfg).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
            </select>
            <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={12} />
          </div>
          <div className="relative">
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
              className="glass-input py-2.5 px-4 pr-8 text-xs font-bold w-auto appearance-none cursor-pointer">
              <option value="">All Priority</option>
              {Object.entries(priCfg).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
            </select>
            <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={12} />
          </div>
        </div>
      </div>

      {/* Quick Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summary.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(statusFilter === s.key ? '' : s.key)}
            className={`glass-card p-5 lg:p-6 text-left group animate-slide-up ${statusFilter === s.key ? 'ring-2' : ''}`}
            style={{
              animationDelay: `${i * 60}ms`,
              ...(statusFilter === s.key ? { borderColor: s.color + '40', boxShadow: `0 0 20px ${s.color}10` } : {})
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: s.dot, boxShadow: `0 0 8px ${s.dot}60` }} />
              <span className="text-[10px] font-extrabold text-white/25 uppercase tracking-widest">{s.label}</span>
            </div>
            <p className="text-2xl font-extrabold text-white">{s.count}</p>
          </button>
        ))}
      </div>

      {/* Task List */}
      {tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task, i) => (
            <div
              key={task._id}
              className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 group hover:translate-x-1 animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Left: Priority + Content */}
              <div className="flex-1 min-w-0 flex items-start gap-5">
                <div className="w-1.5 self-stretch rounded-full shrink-0 mt-1.5"
                  style={{ background: priCfg[task.priority]?.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-[10px] md:text-xs font-extrabold px-3 py-1.5 rounded uppercase tracking-widest"
                      style={{ background: priCfg[task.priority]?.bg, color: priCfg[task.priority]?.color }}>
                      <HiOutlineFlag className="inline mr-1" size={12} />
                      {task.priority}
                    </span>
                    {task.project && (
                      <span className="flex items-center gap-1.5 text-xs text-white/50 font-bold hover:text-white/80 transition-colors">
                        <HiOutlineFolder size={14} />
                        {task.project.name}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-white leading-tight">{task.title}</h4>
                  {task.description && <p className="text-sm text-white/50 mt-1.5 line-clamp-2 leading-relaxed">{task.description}</p>}
                </div>
              </div>

              {/* Right: Due date + Status */}
              <div className="flex items-center gap-4 shrink-0 md:ml-auto">
                {task.dueDate && (
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-md border ${
                    new Date(task.dueDate) < new Date() && task.status !== 'completed'
                      ? 'bg-rose-500/5 border-rose-500/10 text-rose-400'
                      : 'bg-white/[0.02] border-white/5 text-white/30'
                  }`}>
                    <HiOutlineCalendar size={14} />
                    <span className="text-[10px] font-bold">
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}

                <div className="relative">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="text-[10px] font-extrabold uppercase tracking-widest rounded-md px-4 py-2.5 appearance-none cursor-pointer outline-none pr-8"
                    style={{
                      background: statusCfg[task.status]?.bg,
                      color: statusCfg[task.status]?.color,
                      border: `1px solid ${statusCfg[task.status]?.color}20`
                    }}
                  >
                    {Object.entries(statusCfg).map(([s, c]) => (
                      <option key={s} value={s}>{c.label}</option>
                    ))}
                  </select>
                  <HiOutlineChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" size={12}
                    style={{ color: statusCfg[task.status]?.color + '80' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card-static p-20 text-center max-w-xl mx-auto animate-fade-in">
          <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineClipboardList className="text-white/10" size={40} />
          </div>
          <h3 className="text-xl font-extrabold text-white/50 mb-2">No tasks found</h3>
          <p className="text-white/20 text-sm font-medium">
            {statusFilter || priorityFilter ? 'Try adjusting your filters to see more results.' : 'You have no tasks assigned yet. Check back later!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
