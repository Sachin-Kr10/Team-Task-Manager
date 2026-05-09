import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  HiOutlineClipboardList, HiOutlineFilter,
  HiOutlineCalendar, HiOutlineFlag
} from 'react-icons/hi';

const statusCfg = {
  'todo': { label: 'To Do', bg: 'rgba(99,102,241,0.12)', color: '#818cf8' },
  'in-progress': { label: 'In Progress', bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  'review': { label: 'Review', bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
  'completed': { label: 'Completed', bg: 'rgba(16,185,129,0.12)', color: '#34d399' }
};

const priCfg = {
  'low': { label: 'Low', color: '#60a5fa' },
  'medium': { label: 'Medium', color: '#fbbf24' },
  'high': { label: 'High', color: '#fb923c' },
  'urgent': { label: 'Urgent', color: '#f87171' }
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
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
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      fetchTasks();
      toast.success('Status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">My Tasks</h2>
          <p className="text-white/40 text-sm mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned to you</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <HiOutlineFilter className="text-white/30" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input py-2 px-3 text-xs w-auto"
            >
              <option value="">All Status</option>
              {Object.entries(statusCfg).map(([v, c]) => (
                <option key={v} value={v}>{c.label}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="glass-input py-2 px-3 text-xs w-auto"
            >
              <option value="">All Priority</option>
              {Object.entries(priCfg).map(([v, c]) => (
                <option key={v} value={v}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Task list */}
      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <motion.div
              key={task._id}
              variants={item}
              className="glass-card p-5 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md capitalize"
                    style={{ background: `${priCfg[task.priority].color}15`, color: priCfg[task.priority].color }}>
                    <HiOutlineFlag className="inline mr-1" size={10} />
                    {task.priority}
                  </span>
                  {task.project && (
                    <span className="text-xs text-white/30 truncate">
                      {task.project.name}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-medium text-white/90">{task.title}</h4>
                {task.description && (
                  <p className="text-xs text-white/30 mt-1 line-clamp-1">{task.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <HiOutlineCalendar size={12}
                      className={new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-400' : 'text-white/30'} />
                    <span className={`text-xs ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-400' : 'text-white/30'}`}>
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}

                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer font-medium"
                  style={{
                    background: statusCfg[task.status].bg,
                    color: statusCfg[task.status].color,
                    border: `1px solid ${statusCfg[task.status].color}30`
                  }}
                >
                  {Object.entries(statusCfg).map(([s, c]) => (
                    <option key={s} value={s} style={{ background: '#111127', color: '#e2e8f0' }}>{c.label}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div variants={item} className="glass-card p-12 text-center">
          <HiOutlineClipboardList className="mx-auto text-white/10 mb-3" size={48} />
          <h3 className="text-lg font-semibold text-white/60 mb-1">No tasks found</h3>
          <p className="text-white/30 text-sm">
            {statusFilter || priorityFilter ? 'Try adjusting your filters' : 'No tasks assigned to you yet'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyTasks;
