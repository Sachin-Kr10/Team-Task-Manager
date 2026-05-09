import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/UI/Modal';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus, HiOutlineTrash, HiOutlinePencil,
  HiOutlineUsers, HiOutlineUserAdd, HiOutlineClipboardList,
  HiOutlineCalendar, HiOutlineFlag, HiOutlineArrowLeft,
  HiOutlineChevronDown, HiOutlineExclamation
} from 'react-icons/hi';

const statusCfg = {
  'todo': { label: 'To Do', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', dot: '#818cf8' },
  'in-progress': { label: 'In Progress', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', dot: '#fbbf24' },
  'review': { label: 'In Review', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', dot: '#a78bfa' },
  'completed': { label: 'Completed', color: '#34d399', bg: 'rgba(52,211,153,0.1)', dot: '#34d399' }
};

const priCfg = {
  'low': { label: 'Low', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  'medium': { label: 'Medium', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  'high': { label: 'High', color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
  'urgent': { label: 'Urgent', color: '#f87171', bg: 'rgba(248,113,113,0.1)' }
};

const ProjectDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('tasks');
  const [showTM, setShowTM] = useState(false);
  const [showMM, setShowMM] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(null);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [mEmail, setMEmail] = useState('');
  const [mRole, setMRole] = useState('member');
  const [tf, setTf] = useState({ title: '', description: '', assignee: '', priority: 'medium', dueDate: '', status: 'todo' });
  const [sub, setSub] = useState(false);

  const isAdmin = project && (
    project.owner?._id === user?._id ||
    project.members?.some(m => m.user?._id === user?._id && m.role === 'admin')
  );

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    try {
      const [p, t] = await Promise.all([projectsAPI.getById(id), tasksAPI.getProjectTasks(id)]);
      setProject(p.data.data);
      setTasks(t.data.data);
    } catch { toast.error('Failed to load project'); nav('/projects'); }
    finally { setLoading(false); }
  };

  const resetTf = () => {
    setTf({ title: '', description: '', assignee: '', priority: 'medium', dueDate: '', status: 'todo' });
    setEditTask(null);
  };

  const handleTask = async (e) => {
    e.preventDefault();
    if (!tf.title.trim()) return toast.error('Title required');
    setSub(true);
    try {
      if (editTask) {
        await tasksAPI.update(editTask._id, { ...tf, project: id });
        toast.success('Task updated');
      } else {
        await tasksAPI.create({ ...tf, project: id });
        toast.success('Task created');
      }
      setShowTM(false); resetTf(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSub(false); }
  };

  const openEdit = (t) => {
    setEditTask(t);
    setTf({
      title: t.title,
      description: t.description || '',
      assignee: t.assignee?._id || '',
      priority: t.priority,
      dueDate: t.dueDate ? t.dueDate.slice(0, 10) : '',
      status: t.status
    });
    setShowTM(true);
  };

  const chgStatus = async (tid, s) => {
    try { await tasksAPI.updateStatus(tid, s); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const delTask = async () => {
    if (!showDeleteTaskModal) return;
    try {
      await tasksAPI.delete(showDeleteTaskModal);
      toast.success('Task deleted');
      setShowDeleteTaskModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const addMem = async (e) => {
    e.preventDefault();
    if (!mEmail.trim()) return toast.error('Email required');
    setSub(true);
    try {
      await projectsAPI.addMember(id, { email: mEmail, role: mRole });
      toast.success('Member added!');
      setShowMM(false); setMEmail(''); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSub(false); }
  };

  const remMem = async () => {
    if (!showRemoveMemberModal) return;
    try {
      await projectsAPI.removeMember(id, showRemoveMemberModal);
      toast.success('Member removed');
      setShowRemoveMemberModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-white/40 font-bold animate-pulse">Syncing Workspace...</p>
    </div>
  );

  const byStatus = {
    'todo': tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    'review': tasks.filter(t => t.status === 'review'),
    'completed': tasks.filter(t => t.status === 'completed')
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div>
        <button onClick={() => nav('/projects')}
          className="group flex items-center gap-2 text-white/40 hover:text-white text-xs font-extrabold uppercase tracking-widest mb-6 transition-all">
          <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Workspace
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-3xl bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0 border border-primary-500/10">
              <HiOutlineClipboardList size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-2">{project.name}</h2>
              <p className="text-white/30 text-sm font-medium max-w-xl">
                {project.description || 'Project hub for collaboration and tracking.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-4">
              {project.members?.slice(0, 5).map((m, i) => (
                <div key={m.user?._id}
                  className="w-10 h-10 rounded-xl border-2 border-dark-bg flex items-center justify-center text-xs font-extrabold text-white shadow-lg"
                  style={{ background: m.user?.avatar || '#6366f1', zIndex: 5 - i }}>
                  {m.user?.name?.charAt(0)}
                </div>
              ))}
              {project.members?.length > 5 && (
                <div className="w-10 h-10 rounded-xl border-2 border-dark-bg bg-slate-800 flex items-center justify-center text-[10px] font-extrabold text-white/60 z-0">
                  +{project.members.length - 5}
                </div>
              )}
            </div>
            {isAdmin && (
              <button onClick={() => { resetTf(); setShowTM(true); }} className="btn-primary">
                <HiOutlinePlus size={20} />
                Create Task
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex gap-1">
          {[
            { key: 'tasks', label: 'Board', icon: HiOutlineClipboardList },
            { key: 'team', label: 'Team', icon: HiOutlineUsers }
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-extrabold uppercase tracking-widest transition-all duration-300 ${
                tab === t.key ? 'text-white bg-white/5' : 'text-white/20 hover:text-white/40'
              }`}>
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'team' && isAdmin && (
          <button onClick={() => setShowMM(true)}
            className="flex items-center gap-2 text-xs font-extrabold text-primary-400 hover:text-primary-300 transition-colors">
            <HiOutlineUserAdd size={16} />
            INVITE TEAM MEMBER
          </button>
        )}
      </div>

      {/* Kanban Board */}
      {tab === 'tasks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start pb-10">
          {Object.entries(statusCfg).map(([s, cfg]) => (
            <div key={s} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-3 py-2.5 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.dot, boxShadow: `0 0 10px ${cfg.dot}60` }} />
                  <span className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest">{cfg.label}</span>
                </div>
                <span className="text-[10px] font-extrabold text-white/60 bg-white/5 px-2 py-0.5 rounded-lg">{byStatus[s].length}</span>
              </div>

              <div className="flex flex-col gap-3 min-h-[400px]">
                {byStatus[s].map((t, i) => (
                  <div key={t._id}
                    className="glass-card p-6 group hover:-translate-y-1 animate-slide-up"
                    style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-widest"
                        style={{ background: priCfg[t.priority]?.bg, color: priCfg[t.priority]?.color }}>
                        {t.priority}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {(isAdmin || t.assignee?._id === user?._id) && (
                          <button onClick={() => openEdit(t)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-colors">
                            <HiOutlinePencil size={14} />
                          </button>
                        )}
                        {isAdmin && (
                          <button onClick={() => setShowDeleteTaskModal(t._id)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-white/20 hover:text-rose-400 transition-colors">
                            <HiOutlineTrash size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2 leading-tight">{t.title}</h4>
                    {t.description && <p className="text-xs text-white/30 line-clamp-2 mb-4 leading-relaxed">{t.description}</p>}

                    <div className="flex flex-col gap-3">
                      {t.dueDate && (
                        <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <HiOutlineCalendar size={14}
                            className={new Date(t.dueDate) < new Date() && t.status !== 'completed' ? 'text-rose-400' : 'text-white/20'} />
                          <span className={`text-[10px] font-bold ${
                            new Date(t.dueDate) < new Date() && t.status !== 'completed' ? 'text-rose-400' : 'text-white/40'
                          }`}>
                            {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="relative inline-block w-32">
                          <select value={t.status} onChange={e => chgStatus(t._id, e.target.value)}
                            className="w-full text-[10px] font-extrabold uppercase tracking-widest appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/60 focus:text-white transition-all cursor-pointer outline-none">
                            {Object.entries(statusCfg).map(([sv, sc]) => <option key={sv} value={sv}>{sc.label}</option>)}
                          </select>
                          <HiOutlineChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={12} />
                        </div>
                        {t.assignee && (
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold text-white shadow-lg ring-2 ring-white/5"
                            title={t.assignee.name}
                            style={{ background: t.assignee.avatar || '#6366f1' }}>
                            {t.assignee.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {byStatus[s].length === 0 && (
                  <div className="flex flex-col items-center justify-center p-10 rounded-3xl border-2 border-dashed border-white/5 text-white/10">
                    <HiOutlinePlus size={24} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team Tab */}
      {tab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.members?.map((m, i) => (
            <div key={m.user?._id}
              className="glass-card p-6 flex items-center justify-between group animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-xl"
                  style={{ background: m.user?.avatar || '#6366f1' }}>
                  {m.user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-bold text-white flex items-center gap-2">
                    {m.user?.name}
                    {m.user?._id === project.owner?._id && (
                      <span className="text-[10px] font-extrabold bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-lg border border-amber-500/10 uppercase tracking-widest">Owner</span>
                    )}
                  </p>
                  <p className="text-xs text-white/30 font-medium">{m.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-widest ${
                  m.role === 'admin' ? 'bg-primary-500/10 text-primary-400 border border-primary-500/10' : 'bg-white/5 text-white/30 border border-white/5'
                }`}>
                  {m.role}
                </span>
                {isAdmin && m.user?._id !== project.owner?._id && (
                  <button onClick={() => setShowRemoveMemberModal(m.user?._id)}
                    className="p-2.5 rounded-xl bg-rose-500/5 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100">
                    <HiOutlineTrash size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <Modal isOpen={showTM} onClose={() => { setShowTM(false); resetTf(); }} title={editTask ? 'Update Task' : 'Create New Task'}>
        <form onSubmit={handleTask} className="space-y-6">
          <div>
            <label className="block text-xs font-extrabold text-white/30 uppercase tracking-widest mb-2 ml-1">Task Title</label>
            <input type="text" value={tf.title} onChange={e => setTf({ ...tf, title: e.target.value })}
              className="glass-input text-lg font-bold" placeholder="What needs to be done?" required />
          </div>
          <div>
            <label className="block text-xs font-extrabold text-white/30 uppercase tracking-widest mb-2 ml-1">Description</label>
            <textarea value={tf.description} onChange={e => setTf({ ...tf, description: e.target.value })}
              rows={3} className="glass-input resize-none text-sm" placeholder="Add more details..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-white/30 uppercase tracking-widest mb-2 ml-1">Priority</label>
              <select value={tf.priority} onChange={e => setTf({ ...tf, priority: e.target.value })} className="glass-input text-sm font-bold">
                {Object.entries(priCfg).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-white/30 uppercase tracking-widest mb-2 ml-1">Status</label>
              <select value={tf.status} onChange={e => setTf({ ...tf, status: e.target.value })} className="glass-input text-sm font-bold">
                {Object.entries(statusCfg).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-extrabold text-white/30 uppercase tracking-widest mb-2 ml-1">Assign To</label>
            <select value={tf.assignee} onChange={e => setTf({ ...tf, assignee: e.target.value })} className="glass-input text-sm font-bold">
              <option value="">Unassigned</option>
              {project.members?.map(m => <option key={m.user?._id} value={m.user?._id}>{m.user?.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-extrabold text-white/30 uppercase tracking-widest mb-2 ml-1">Due Date</label>
            <input type="date" value={tf.dueDate} onChange={e => setTf({ ...tf, dueDate: e.target.value })} className="glass-input text-sm font-bold" />
          </div>
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={() => { setShowTM(false); resetTf(); }} className="btn-secondary flex-1 font-bold">Cancel</button>
            <button type="submit" disabled={sub} className="btn-primary flex-1 font-bold">
              {sub ? 'Saving...' : editTask ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Member Modal */}
      <Modal isOpen={showMM} onClose={() => setShowMM(false)} title="Invite Member">
        <form onSubmit={addMem} className="space-y-6">
          <div>
            <label className="block text-xs font-extrabold text-white/30 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input type="email" value={mEmail} onChange={e => setMEmail(e.target.value)}
              className="glass-input font-bold" placeholder="member@example.com" required />
          </div>
          <div>
            <label className="block text-xs font-extrabold text-white/30 uppercase tracking-widest mb-2 ml-1">Workspace Role</label>
            <select value={mRole} onChange={e => setMRole(e.target.value)} className="glass-input font-bold">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={() => setShowMM(false)} className="btn-secondary flex-1 font-bold">Cancel</button>
            <button type="submit" disabled={sub} className="btn-primary flex-1 font-bold">
              {sub ? 'Inviting...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Task Modal */}
      <Modal isOpen={!!showDeleteTaskModal} onClose={() => setShowDeleteTaskModal(null)} title="Delete Task?" maxWidth="max-w-md">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-500/5">
            <HiOutlineExclamation size={40} />
          </div>
          <p className="text-white/40 text-sm">Are you sure? This action cannot be reversed.</p>
          <div className="flex flex-col gap-3">
            <button onClick={delTask} className="btn-danger w-full py-4 font-bold">Delete Task</button>
            <button onClick={() => setShowDeleteTaskModal(null)} className="btn-secondary w-full py-4 font-bold">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Remove Member Modal */}
      <Modal isOpen={!!showRemoveMemberModal} onClose={() => setShowRemoveMemberModal(null)} title="Remove Member?" maxWidth="max-w-md">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-500/5">
            <HiOutlineExclamation size={40} />
          </div>
          <p className="text-white/40 text-sm">Remove this member? They will lose access to all tasks and boards.</p>
          <div className="flex flex-col gap-3">
            <button onClick={remMem} className="btn-danger w-full py-4 font-bold">Remove Member</button>
            <button onClick={() => setShowRemoveMemberModal(null)} className="btn-secondary w-full py-4 font-bold">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
