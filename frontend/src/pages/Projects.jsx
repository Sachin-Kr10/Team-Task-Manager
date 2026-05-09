import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/UI/Modal';
import { CardSkeleton } from '../components/UI/Skeleton';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus, HiOutlineFolder, HiOutlineTrash,
  HiOutlineUsers, HiOutlineChevronRight, HiOutlineExclamation
} from 'react-icons/hi';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.getAll();
      setProjects(res.data.data);
    } catch (error) { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Project name is required'); return; }
    setSubmitting(true);
    try {
      await projectsAPI.create(formData);
      toast.success('Project created successfully!');
      setShowModal(false);
      setFormData({ name: '', description: '' });
      fetchProjects();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to create project'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setSubmitting(true);
    try {
      await projectsAPI.delete(showDeleteModal);
      toast.success('Project deleted');
      setShowDeleteModal(null);
      fetchProjects();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to delete'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Projects</h2>
          <p className="text-white/40 font-medium mt-1">Manage and track your team's workspace</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <HiOutlinePlus size={20} />
          Create New Project
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <div key={project._id} className="animate-slide-up" style={{ animationDelay: `${i * 70}ms` }}>
              <Link to={`/projects/${project._id}`} className="block group h-full">
                <div className="glass-card p-7 h-full flex flex-col relative overflow-hidden">
                  <HiOutlineFolder className="absolute -bottom-6 -right-6 text-white/[0.03] group-hover:text-white/[0.07] transition-colors duration-500" size={140} />

                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className="w-13 h-13 rounded-2xl flex items-center justify-center bg-primary-500/10 text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-primary-500/30"
                      style={{ width: '52px', height: '52px' }}>
                      <HiOutlineFolder size={26} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${
                        project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {project.status}
                      </span>
                      {project.owner?._id === user?._id && (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteModal(project._id); }}
                          className="p-2.5 rounded-xl text-white/10 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative z-10 flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors duration-300">
                      {project.name}
                    </h3>
                    <p className="text-white/35 text-sm leading-relaxed line-clamp-3 mb-6">
                      {project.description || 'No project description provided. Add one to keep your team aligned.'}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="relative z-10 mt-auto pt-5 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-white/25 uppercase tracking-widest font-extrabold">Progress</span>
                      <span className="text-white/60">
                        {Math.round((project.taskCounts?.completed / project.taskCounts?.total) * 100) || 0}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden ring-1 ring-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-bar-grow"
                        style={{ width: `${project.taskCounts?.total ? (project.taskCounts.completed / project.taskCounts.total) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4">
                      <div className="flex items-center gap-2 text-white/35">
                        <HiOutlineUsers size={18} />
                        <span className="text-xs font-bold">{project.members?.length || 0} Members</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary-400 group-hover:gap-2.5 transition-all duration-300">
                        VIEW BOARD <HiOutlineChevronRight />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card-static p-20 text-center max-w-2xl mx-auto animate-fade-in">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineFolder className="text-white/10" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">Start by creating your first team project to organize tasks and track progress together.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary px-10">
            <HiOutlinePlus size={20} />
            Create Your First Project
          </button>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Project">
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-xs font-extrabold text-white/30 uppercase tracking-widest mb-2 ml-1">Project Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Website Redesign" className="glass-input text-lg font-medium" required />
          </div>
          <div>
            <label className="block text-xs font-extrabold text-white/30 uppercase tracking-widest mb-2 ml-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is this project about?" rows={4} className="glass-input resize-none" />
          </div>
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 font-bold">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 font-bold">
              {submitting ? 'Creating...' : 'Launch Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="Delete Project?" maxWidth="max-w-md">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-500/5">
            <HiOutlineExclamation size={40} />
          </div>
          <div>
            <p className="text-white font-bold text-lg mb-2">Are you absolutely sure?</p>
            <p className="text-white/40 text-sm">This action cannot be undone. This will permanently delete the project and all associated tasks.</p>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={handleDelete} disabled={submitting} className="btn-danger w-full py-4 text-base">
              {submitting ? 'Deleting...' : 'Yes, Delete Project'}
            </button>
            <button onClick={() => setShowDeleteModal(null)} className="btn-secondary w-full py-4 text-base">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;
