import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Skeleton from '../components/UI/Skeleton';
import toast from 'react-hot-toast';
import {
  HiOutlineFolder,
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineLightningBolt,
  HiOutlineClock,
  HiOutlineArrowRight
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const StatCard = ({ icon: Icon, label, value, gradient, delay = 0 }) => (
  <motion.div
    variants={item}
    className="glass-card p-6 relative overflow-hidden group"
  >
    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-700"
      style={{ background: gradient }} />
    
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-white/40 text-sm font-medium mb-1">{label}</p>
        <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
      </div>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 duration-300" 
        style={{ 
          background: `linear-gradient(135deg, ${gradient.split(',')[1].trim()}, ${gradient.split(',')[2].trim().replace(')', '')})`,
          boxShadow: `0 8px 20px -5px ${gradient.split(',')[1].trim()}40`
        }}>
        <Icon size={28} className="text-white" />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardAPI.getStats();
      setStats(res.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-white/5 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 glass-card" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 glass-card" />
          <div className="h-80 glass-card" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Hero Greeting */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Hello, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> <span className="animate-bounce inline-block">👋</span>
          </h2>
          <p className="text-white/40 text-lg mt-1 font-medium">You have {stats?.myTasks || 0} tasks to focus on today.</p>
        </div>
        <Link to="/my-tasks" className="btn-primary group">
          View My Tasks
          <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={HiOutlineFolder}
          label="Active Projects"
          value={stats?.totalProjects || 0}
          gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
        />
        <StatCard
          icon={HiOutlineClipboardList}
          label="Total Tasks"
          value={stats?.totalTasks || 0}
          gradient="linear-gradient(135deg, #3b82f6, #2dd4bf)"
        />
        <StatCard
          icon={HiOutlineCheckCircle}
          label="Done This Week"
          value={stats?.completedThisWeek || 0}
          gradient="linear-gradient(135deg, #10b981, #059669)"
        />
        <StatCard
          icon={HiOutlineExclamationCircle}
          label="Overdue"
          value={stats?.overdueTasks || 0}
          gradient="linear-gradient(135deg, #ef4444, #f97316)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <motion.div variants={item} className="glass-card p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400">
              <HiOutlineLightningBolt size={20} />
            </div>
            Task Distribution
          </h3>
          <div className="space-y-6">
            {[
              { label: 'To Do', status: 'todo', color: '#818cf8', icon: '🎯' },
              { label: 'In Progress', status: 'in-progress', color: '#fbbf24', icon: '⚡' },
              { label: 'In Review', status: 'review', color: '#a78bfa', icon: '🔍' },
              { label: 'Completed', status: 'completed', color: '#34d399', icon: '✅' }
            ].map((cfg) => {
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
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.2, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}dd)` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item} className="glass-card p-8 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-500/10 text-accent-400">
              <HiOutlineClock size={20} />
            </div>
            Recent Activity
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {stats?.recentTasks?.length > 0 ? (
              stats.recentTasks.map((task) => (
                <motion.div
                  key={task._id}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ background: task.assignee?.avatar || '#6366f1' }}>
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
                </motion.div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-20">
                <HiOutlineClipboardList size={64} />
                <p className="mt-4 font-bold">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
