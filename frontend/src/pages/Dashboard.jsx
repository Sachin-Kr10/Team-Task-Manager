import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  HiOutlineFolder, HiOutlineClipboardList, HiOutlineCheckCircle,
  HiOutlineExclamationCircle, HiOutlineLightningBolt, HiOutlineClock,
  HiOutlineArrowRight
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

const statCards = [
  { key: 'totalProjects', icon: HiOutlineFolder, label: 'Active Projects', gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)', shadow: 'rgba(99,102,241,0.3)' },
  { key: 'totalTasks', icon: HiOutlineClipboardList, label: 'Total Tasks', gradient: 'linear-gradient(135deg, #3b82f6, #2dd4bf)', shadow: 'rgba(59,130,246,0.3)' },
  { key: 'completedThisWeek', icon: HiOutlineCheckCircle, label: 'Done This Week', gradient: 'linear-gradient(135deg, #10b981, #059669)', shadow: 'rgba(16,185,129,0.3)' },
  { key: 'overdueTasks', icon: HiOutlineExclamationCircle, label: 'Overdue', gradient: 'linear-gradient(135deg, #ef4444, #f97316)', shadow: 'rgba(239,68,68,0.3)' }
];

const statusChart = [
  { label: 'To Do', status: 'todo', color: '#818cf8', icon: '🎯' },
  { label: 'In Progress', status: 'in-progress', color: '#fbbf24', icon: '⚡' },
  { label: 'In Review', status: 'review', color: '#a78bfa', icon: '🔍' },
  { label: 'Completed', status: 'completed', color: '#34d399', icon: '✅' }
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardAPI.getStats();
      setStats(res.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-white/5 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 glass-card-static" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 glass-card-static" />
          <div className="h-80 glass-card-static" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Hello, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h2>
          <p className="text-white/40 text-lg mt-1 font-medium">
            You have {stats?.myTasks || 0} tasks to focus on today.
          </p>
        </div>
        <Link to="/my-tasks" className="btn-primary group">
          View My Tasks
          <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <div
            key={card.key}
            className="glass-card p-6 relative overflow-hidden group animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.07] group-hover:scale-110 transition-transform duration-700"
              style={{ background: card.gradient }} />
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-white/40 text-sm font-medium mb-1">{card.label}</p>
                <p className="text-4xl font-extrabold text-white tracking-tight">{stats?.[card.key] || 0}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300"
                style={{ background: card.gradient, boxShadow: `0 8px 20px -5px ${card.shadow}` }}>
                <card.icon size={28} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="glass-card-static p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400">
              <HiOutlineLightningBolt size={20} />
            </div>
            Task Distribution
          </h3>
          <div className="space-y-6">
            {statusChart.map((cfg, i) => {
              const count = stats?.statusBreakdown?.[cfg.status] || 0;
              const total = stats?.totalTasks || 1;
              const percentage = Math.round((count / total) * 100);
              return (
                <div key={cfg.status} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cfg.icon}</span>
                      <span className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">{cfg.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-white block">{count}</span>
                      <span className="text-[10px] text-white/30 uppercase tracking-wider">{percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/5 overflow-hidden ring-1 ring-white/5">
                    <div
                      className="h-full rounded-full animate-bar-grow"
                      style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}dd)`,
                        animationDelay: `${300 + i * 150}ms`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card-static p-8 flex flex-col animate-slide-up" style={{ animationDelay: '280ms' }}>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-500/10 text-accent-400">
              <HiOutlineClock size={20} />
            </div>
            Recent Activity
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {stats?.recentTasks?.length > 0 ? (
              stats.recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:translate-x-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ background: task.assignee?.avatar || 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>
                    {task.assignee?.name?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">{task.title}</p>
                    <p className="text-xs text-white/40 font-medium truncate">{task.project?.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                      task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      task.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-indigo-500/10 text-indigo-400'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-20">
                <HiOutlineClipboardList size={64} />
                <p className="mt-4 font-bold">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
