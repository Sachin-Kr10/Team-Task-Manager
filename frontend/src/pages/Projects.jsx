import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projectsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import Modal from '../components/UI/Modal'
import { CardSkeleton } from '../components/UI/Skeleton'
import toast from 'react-hot-toast'
import {
  HiOutlinePlus,
  HiOutlineFolder,
  HiOutlineTrash,
  HiOutlineUsers,
  HiOutlineChevronRight,
  HiOutlineExclamation,
  HiOutlineSparkles
} from 'react-icons/hi'

const Projects = () => {
  const [projects, setProjects] = useState([])

  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)

  const [showDeleteModal, setShowDeleteModal] =
    useState(null)

  const [submitting, setSubmitting] =
    useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  const { user } = useAuth()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.getAll()

      setProjects(res.data.data)
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      return toast.error(
        'Project name is required'
      )
    }

    setSubmitting(true)

    try {
      await projectsAPI.create(formData)

      toast.success(
        'Project created successfully'
      )

      setShowModal(false)

      setFormData({
        name: '',
        description: ''
      })

      fetchProjects()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to create project'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!showDeleteModal) return

    setSubmitting(true)

    try {
      await projectsAPI.delete(showDeleteModal)

      toast.success('Project deleted')

      setShowDeleteModal(null)

      fetchProjects()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to delete project'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative z-10 space-y-8">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0f172acc] p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_30%)]" />

        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:60px_60px]" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* LEFT */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-400">
              <HiOutlineSparkles size={14} />
              Workspace Projects
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
              Manage Your{' '}
              <span className="bg-gradient-to-r from-rose-400 via-red-300 to-orange-300 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
              Organize workspaces, collaborate with
              your team and manage every project with
              a premium workflow experience.
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => setShowModal(true)}
            className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-rose-400/20 bg-gradient-to-r from-rose-600 to-red-500 px-7 py-4 text-sm font-bold text-white shadow-[0_0_35px_rgba(244,63,94,0.28)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(244,63,94,0.38)]"
          >
            <HiOutlinePlus size={22} />

            Create New Project
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, i) => {
            const progress = project.taskCounts
              ?.total
              ? Math.round(
                  (project.taskCounts.completed /
                    project.taskCounts.total) *
                    100
                )
              : 0

            return (
              <div
                key={project._id}
                className="animate-slide-up"
                style={{
                  animationDelay: `${i * 70}ms`
                }}
              >
                <div className="group h-full">
                  <Link
                    to={`/projects/${project._id}`}
                    className="block h-full"
                  >
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#0f172acc] p-7 backdrop-blur-xl shadow-[0_15px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
                      {/* Glow */}
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.06),transparent_30%)]" />

                      {/* Decorative */}
                      <HiOutlineFolder
                        size={150}
                        className="pointer-events-none absolute -bottom-8 -right-8 text-white/[0.03] transition-all duration-700 group-hover:scale-110"
                      />

                      {/* TOP */}
                      <div className="relative z-10 mb-6 flex items-start justify-between">
                        {/* ICON */}
                        <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-rose-500/20 to-red-500/10 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.18)] transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                          <HiOutlineFolder size={30} />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
                              project.status ===
                              'active'
                                ? 'border border-emerald-500/15 bg-emerald-500/10 text-emerald-400'
                                : 'border border-slate-500/10 bg-slate-500/10 text-slate-400'
                            }`}
                          >
                            {project.status}
                          </span>

                          {project.owner?._id ===
                            user?._id && (
                            <button
                              onClick={(e) => {
                                e.preventDefault()

                                e.stopPropagation()

                                setShowDeleteModal(
                                  project._id
                                )
                              }}
                              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent text-slate-500 opacity-100 transition-all duration-300 hover:border-rose-500/10 hover:bg-rose-500/10 hover:text-rose-400 md:opacity-0 md:group-hover:opacity-100"
                            >
                              <HiOutlineTrash
                                size={18}
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="relative z-10 flex-1">
                        <h3 className="text-2xl font-black tracking-tight text-white transition-colors duration-300 group-hover:text-rose-400">
                          {project.name}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">
                          {project.description ||
                            'No project description provided yet.'}
                        </p>
                      </div>

                      {/* PROGRESS */}
                      <div className="relative z-10 mt-8 border-t border-white/6 pt-6">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            Progress
                          </span>

                          <span className="text-sm font-black text-white">
                            {progress}%
                          </span>
                        </div>

                        {/* BAR */}
                        <div className="h-3 overflow-hidden rounded-full bg-white/[0.04] ring-1 ring-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-red-400 to-orange-400 transition-all duration-1000"
                            style={{
                              width: `${progress}%`
                            }}
                          />
                        </div>

                        {/* FOOTER */}
                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-400">
                            <HiOutlineUsers
                              size={18}
                            />

                            <span className="text-sm font-bold">
                              {project.members
                                ?.length || 0}{' '}
                              Members
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-400 transition-all duration-300 group-hover:gap-3">
                            Open Board

                            <HiOutlineChevronRight
                              size={16}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0f172acc] p-16 text-center backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.10),transparent_35%)]" />

          <div className="relative z-10 mx-auto max-w-lg">
            <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-white/[0.03] ring-1 ring-white/10">
              <HiOutlineFolder
                size={54}
                className="text-slate-600"
              />
            </div>

            <h3 className="text-3xl font-black text-white">
              No Projects Found
            </h3>

            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-400">
              Start building your workspace by
              creating your first project.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl border border-rose-400/20 bg-gradient-to-r from-rose-600 to-red-500 px-8 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(244,63,94,0.25)] transition-all duration-300 hover:scale-[1.02]"
            >
              <HiOutlinePlus size={22} />

              Create Your First Project
            </button>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Project"
      >
        <form
          onSubmit={handleCreate}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Project Name
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
              placeholder="e.g. SaaS Dashboard"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base font-medium text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-500 focus:border-rose-500/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-rose-500/10"
            />
          </div>

          <div>
            <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Description
            </label>

            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
              }
              placeholder="Describe your project..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-medium text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-500 focus:border-rose-500/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-rose-500/10"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-slate-200 transition-all duration-300 hover:bg-white/[0.05]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-2xl border border-rose-400/20 bg-gradient-to-r from-rose-600 to-red-500 px-5 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(244,63,94,0.25)] transition-all duration-300 hover:scale-[1.01]"
            >
              {submitting
                ? 'Creating...'
                : 'Launch Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        title="Delete Project?"
        maxWidth="max-w-md"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 ring-8 ring-rose-500/5">
            <HiOutlineExclamation size={44} />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">
              Are you absolutely sure?
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              This action cannot be undone. The
              project and all associated tasks will
              be permanently deleted.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="w-full rounded-2xl border border-rose-400/20 bg-gradient-to-r from-rose-500 to-red-500 px-5 py-4 text-base font-bold text-white transition-all duration-300 hover:scale-[1.01]"
            >
              {submitting
                ? 'Deleting...'
                : 'Yes, Delete Project'}
            </button>

            <button
              onClick={() =>
                setShowDeleteModal(null)
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-base font-bold text-slate-200 transition-all duration-300 hover:bg-white/[0.05]"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Projects