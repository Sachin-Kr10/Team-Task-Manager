import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/UI/Modal';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineUsers,
  HiOutlineUserAdd,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineArrowLeft,
  HiOutlineChevronDown,
  HiOutlineExclamation
} from 'react-icons/hi';

const statusCfg = {
  todo: {
    label: 'To Do',
    color: '#818cf8',
    bg: 'rgba(129,140,248,0.18)',
    dot: '#818cf8'
  },
  'in-progress': {
    label: 'In Progress',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.18)',
    dot: '#fbbf24'
  },
  review: {
    label: 'In Review',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.18)',
    dot: '#a78bfa'
  },
  completed: {
    label: 'Completed',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.18)',
    dot: '#34d399'
  }
};

const priCfg = {
  low: {
    label: 'Low',
    color: '#93c5fd',
    bg: 'rgba(59,130,246,0.18)'
  },
  medium: {
    label: 'Medium',
    color: '#fde68a',
    bg: 'rgba(245,158,11,0.18)'
  },
  high: {
    label: 'High',
    color: '#fdba74',
    bg: 'rgba(249,115,22,0.18)'
  },
  urgent: {
    label: 'Urgent',
    color: '#fca5a5',
    bg: 'rgba(239,68,68,0.18)'
  }
};

const cardStyle =
  'bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-1';

const inputStyle =
  'bg-white/5 border border-white/10 rounded-xl text-slate-100 px-4 py-3 transition-all duration-200 outline-none w-full focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 [&>option]:bg-[#111827] [&>option]:text-white';

const gradientAvatar = {
  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)'
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

  const [tf, setTf] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: '',
    status: 'todo'
  });

  const [sub, setSub] = useState(false);

  const isAdmin =
    project &&
    (project.owner?._id === user?._id ||
      project.members?.some(
        (m) => m.user?._id === user?._id && m.role === 'admin'
      ));

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      const [p, t] = await Promise.all([
        projectsAPI.getById(id),
        tasksAPI.getProjectTasks(id)
      ]);

      setProject(p.data.data);
      setTasks(t.data.data);
    } catch {
      toast.error('Failed to load project');
      nav('/projects');
    } finally {
      setLoading(false);
    }
  };

  const resetTf = () => {
    setTf({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      dueDate: '',
      status: 'todo'
    });

    setEditTask(null);
  };

  const handleTask = async (e) => {
    e.preventDefault();

    if (!tf.title.trim()) {
      return toast.error('Title required');
    }

    setSub(true);

    try {
      if (editTask) {
        await tasksAPI.update(editTask._id, {
          ...tf,
          project: id
        });

        toast.success('Task updated');
      } else {
        await tasksAPI.create({
          ...tf,
          project: id
        });

        toast.success('Task created');
      }

      setShowTM(false);
      resetTf();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSub(false);
    }
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
    try {
      await tasksAPI.updateStatus(tid, s);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const delTask = async () => {
    if (!showDeleteTaskModal) return;

    try {
      await tasksAPI.delete(showDeleteTaskModal);

      toast.success('Task deleted');
      setShowDeleteTaskModal(null);

      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const addMem = async (e) => {
    e.preventDefault();

    if (!mEmail.trim()) {
      return toast.error('Email required');
    }

    setSub(true);

    try {
      await projectsAPI.addMember(id, {
        email: mEmail,
        role: mRole
      });

      toast.success('Member added');

      setShowMM(false);
      setMEmail('');

      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSub(false);
    }
  };

  const remMem = async () => {
    if (!showRemoveMemberModal) return;

    try {
      await projectsAPI.removeMember(id, showRemoveMemberModal);

      toast.success('Member removed');

      setShowRemoveMemberModal(null);

      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-300 font-bold animate-pulse">
          Syncing Workspace...
        </p>
      </div>
    );
  }

  const byStatus = {
    todo: tasks.filter((t) => t.status === 'todo'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    review: tasks.filter((t) => t.status === 'review'),
    completed: tasks.filter((t) => t.status === 'completed')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white p-6 rounded-3xl">
      <div className="space-y-8 animate-fade-in">
        <div>
          <button
            onClick={() => nav('/projects')}
            className="group flex items-center gap-2 text-slate-400 hover:text-white text-xs font-extrabold uppercase tracking-widest mb-6 transition-all"
          >
            <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Workspace
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-lg">
                <HiOutlineClipboardList size={32} />
              </div>

              <div>
                <h2 className="text-4xl font-black text-white tracking-tight mb-3">
                  {project.name}
                </h2>

                <p className="text-slate-400 text-sm font-medium max-w-xl leading-relaxed">
                  {project.description ||
                    'Project hub for collaboration and tracking.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {project.members?.slice(0, 5).map((m, i) => (
                  <div
                    key={m.user?._id}
                    className="w-11 h-11 rounded-2xl border-2 border-[#020617] flex items-center justify-center text-sm font-black text-white shadow-xl"
                    style={{
                      ...gradientAvatar,
                      zIndex: 10 - i
                    }}
                  >
                    {m.user?.name?.charAt(0)}
                  </div>
                ))}
              </div>

              {isAdmin && (
                <button
                  onClick={() => {
                    resetTf();
                    setShowTM(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-500/30 px-6 py-3 rounded-2xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/20"
                >
                  <HiOutlinePlus size={20} />
                  Create Task
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex gap-2">
            {[
              {
                key: 'tasks',
                label: 'Board',
                icon: HiOutlineClipboardList
              },
              {
                key: 'team',
                label: 'Team',
                icon: HiOutlineUsers
              }
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-extrabold uppercase tracking-widest transition-all duration-300 ${
                  tab === t.key
                    ? 'text-white bg-white/10 border border-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <t.icon size={18} />
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'team' && isAdmin && (
            <button
              onClick={() => setShowMM(true)}
              className="flex items-center gap-2 text-xs font-extrabold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <HiOutlineUserAdd size={16} />
              INVITE TEAM MEMBER
            </button>
          )}
        </div>

        {tab === 'tasks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 pb-10">
            {Object.entries(statusCfg).map(([s, cfg]) => (
              <div key={s} className="flex flex-col gap-4">
                <div className="bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: cfg.dot,
                        boxShadow: `0 0 12px ${cfg.dot}`
                      }}
                    />

                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                      {cfg.label}
                    </span>
                  </div>

                  <span className="text-[10px] font-black text-white bg-white/10 px-2.5 py-1 rounded-lg">
                    {byStatus[s].length}
                  </span>
                </div>

                <div className="flex flex-col gap-4 min-h-[400px]">
                  {byStatus[s].map((t) => (
                    <div key={t._id} className={`${cardStyle} p-5 group`}>
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-widest border border-white/10"
                          style={{
                            background: priCfg[t.priority]?.bg,
                            color: priCfg[t.priority]?.color
                          }}
                        >
                          {t.priority}
                        </span>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {(isAdmin ||
                            t.assignee?._id === user?._id) && (
                            <button
                              onClick={() => openEdit(t)}
                              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                              <HiOutlinePencil size={15} />
                            </button>
                          )}

                          {isAdmin && (
                            <button
                              onClick={() =>
                                setShowDeleteTaskModal(t._id)
                              }
                              className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                            >
                              <HiOutlineTrash size={15} />
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className="text-lg font-black text-white mb-3 leading-tight">
                        {t.title}
                      </h4>

                      {t.description && (
                        <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                          {t.description}
                        </p>
                      )}

                      <div className="space-y-4">
                        {t.dueDate && (
                          <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/10">
                            <HiOutlineCalendar
                              size={15}
                              className={
                                new Date(t.dueDate) < new Date() &&
                                t.status !== 'completed'
                                  ? 'text-rose-400'
                                  : 'text-slate-400'
                              }
                            />

                            <span
                              className={`text-xs font-bold ${
                                new Date(t.dueDate) < new Date() &&
                                t.status !== 'completed'
                                  ? 'text-rose-400'
                                  : 'text-slate-300'
                              }`}
                            >
                              {new Date(
                                t.dueDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="relative inline-block w-36">
                            <select
                              value={t.status}
                              onChange={(e) =>
                                chgStatus(t._id, e.target.value)
                              }
                              className="w-full text-[11px] font-black uppercase tracking-widest appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:text-white transition-all cursor-pointer outline-none [&>option]:bg-[#111827] [&>option]:text-white"
                            >
                              {Object.entries(statusCfg).map(
                                ([sv, sc]) => (
                                  <option
                                    key={sv}
                                    value={sv}
                                  >
                                    {sc.label}
                                  </option>
                                )
                              )}
                            </select>

                            <HiOutlineChevronDown
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                              size={12}
                            />
                          </div>

                          {t.assignee && (
                            <div
                              className="w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-xl ring-2 ring-white/10"
                              title={t.assignee.name}
                              style={gradientAvatar}
                            >
                              {t.assignee.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {byStatus[s].length === 0 && (
                    <div className="flex flex-col items-center justify-center p-10 rounded-3xl border-2 border-dashed border-white/10 text-slate-500 bg-white/[0.02]">
                      <HiOutlinePlus size={24} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'team' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {project.members?.map((m) => (
              <div
                key={m.user?._id}
                className={`${cardStyle} p-6 flex items-center justify-between group`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl"
                    style={gradientAvatar}
                  >
                    {m.user?.name?.charAt(0)}
                  </div>

                  <div>
                    <p className="text-base font-black text-white flex items-center gap-2">
                      {m.user?.name}

                      {m.user?._id === project.owner?._id && (
                        <span className="text-[10px] font-black bg-amber-500/15 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/20 uppercase tracking-widest">
                          Owner
                        </span>
                      )}
                    </p>

                    <p className="text-sm text-slate-400 font-medium">
                      {m.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${
                      m.role === 'admin'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                        : 'bg-white/5 text-slate-300 border border-white/10'
                    }`}
                  >
                    {m.role}
                  </span>

                  {isAdmin &&
                    m.user?._id !== project.owner?._id && (
                      <button
                        onClick={() =>
                          setShowRemoveMemberModal(
                            m.user?._id
                          )
                        }
                        className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
  isOpen={showMM}
  onClose={() => {
    setShowMM(false);
    setMEmail('');
    setMRole('member');
  }}
  title="Invite Team Member"
>
  <form onSubmit={addMem} className="space-y-5">
    <div>
      <label className="block text-sm font-bold text-slate-300 mb-2">
        Email Address
      </label>

      <input
        type="email"
        value={mEmail}
        onChange={(e) => setMEmail(e.target.value)}
        className={inputStyle}
        placeholder="member@example.com"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-bold text-slate-300 mb-2">
        Role
      </label>

      <select
        value={mRole}
        onChange={(e) => setMRole(e.target.value)}
        className={inputStyle}
      >
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <div className="flex gap-4 pt-2">
      <button
        type="button"
        onClick={() => {
          setShowMM(false);
          setMEmail('');
          setMRole('member');
        }}
        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 px-5 py-3 rounded-xl font-bold transition-all"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={sub}
        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-3 rounded-xl font-bold transition-all"
      >
        {sub ? 'Inviting...' : 'Send Invite'}
      </button>
    </div>
  </form>
</Modal>

<Modal
  isOpen={!!showDeleteTaskModal}
  onClose={() => setShowDeleteTaskModal(null)}
  title="Delete Task"
>
  <div className="space-y-6">
    <div className="flex justify-center">
      <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center">
        <HiOutlineExclamation
          size={42}
          className="text-rose-400"
        />
      </div>
    </div>

    <p className="text-center text-slate-300">
      Are you sure you want to delete this task?
    </p>

    <div className="flex gap-4">
      <button
        onClick={() => setShowDeleteTaskModal(null)}
        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 px-5 py-3 rounded-xl font-bold transition-all"
      >
        Cancel
      </button>

      <button
        onClick={delTask}
        className="flex-1 bg-rose-600 hover:bg-rose-500 text-white px-5 py-3 rounded-xl font-bold transition-all"
      >
        Delete
      </button>
    </div>
  </div>
</Modal>

<Modal
  isOpen={!!showRemoveMemberModal}
  onClose={() => setShowRemoveMemberModal(null)}
  title="Remove Member"
>
  <div className="space-y-6">
    <div className="flex justify-center">
      <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center">
        <HiOutlineExclamation
          size={42}
          className="text-rose-400"
        />
      </div>
    </div>

    <p className="text-center text-slate-300">
      Remove this member from project?
    </p>

    <div className="flex gap-4">
      <button
        onClick={() => setShowRemoveMemberModal(null)}
        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 px-5 py-3 rounded-xl font-bold transition-all"
      >
        Cancel
      </button>

      <button
        onClick={remMem}
        className="flex-1 bg-rose-600 hover:bg-rose-500 text-white px-5 py-3 rounded-xl font-bold transition-all"
      >
        Remove
      </button>
    </div>
  </div>
</Modal>
      </div>
    </div>
  );
};

export default ProjectDetail;