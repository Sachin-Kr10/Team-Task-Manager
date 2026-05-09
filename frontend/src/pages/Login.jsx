import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineCheckCircle
} from 'react-icons/hi'

const Login = () => {
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] = useState(false)

  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')

      return
    }

    setLoading(true)

    try {
      await login(email, password)

      toast.success('Welcome back!')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Login failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#020617]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_left,rgba(6,182,212,0.10),transparent_24%)]" />

        {/* Blur Orbs */}
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-[-15%] right-[-10%] h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-3xl" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:72px_72px]" />

        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Left Section */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        <div className="relative z-10 max-w-xl px-12">
          {/* Logo */}
          <div className="mb-12 flex items-center gap-5">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[30px] bg-gradient-to-br from-blue-500 via-cyan-400 to-violet-500 shadow-[0_0_45px_rgba(59,130,246,0.35)]">
              <span className="relative z-10 text-3xl font-black text-white">
                T
              </span>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_55%)]" />
            </div>

            <div>
              <h1 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-black tracking-tight text-transparent">
                TaskFlow
              </h1>

              <div className="mt-2 flex items-center gap-2">
                <HiOutlineSparkles
                  size={14}
                  className="text-blue-400"
                />

                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
                  Team Workspace
                </p>
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-6xl font-black leading-[1.05] tracking-tight text-white">
            Manage tasks
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              like a pro.
            </span>
          </h2>

          <p className="mt-8 max-w-lg text-lg leading-relaxed text-slate-400">
            Collaborate with your team using premium
            workspace management, Kanban boards,
            role-based access and real-time project
            tracking.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-5">
            {[
              'Modern Kanban workspace',
              'Team collaboration & roles',
              'Real-time task tracking'
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/10 bg-emerald-500/10 text-emerald-400">
                  <HiOutlineCheckCircle size={20} />
                </div>

                <p className="text-base font-medium text-slate-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
        <div className="relative z-10 w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-10 flex flex-col items-center lg:hidden">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-blue-500 via-cyan-400 to-violet-500 shadow-[0_0_35px_rgba(59,130,246,0.35)]">
              <span className="text-2xl font-black text-white">
                T
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black text-white">
              TaskFlow
            </h1>
          </div>

          {/* Form Card */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(15,23,42,0.78)] p-8 backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] sm:p-10">
            {/* Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_30%)]" />

            {/* Header */}
            <div className="relative z-10 mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                Welcome Back
              </div>

              <h2 className="text-4xl font-black tracking-tight text-white">
                Sign In
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Access your workspace and continue
                managing your team projects.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="relative z-10 space-y-6"
            >
              {/* Email */}
              <div>
                <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Email Address
                </label>

                <div className="relative">
                  <HiOutlineMail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-4 text-sm font-medium text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-500 focus:border-blue-500/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Password
                </label>

                <div className="relative">
                  <HiOutlineLockClosed
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-12 text-sm font-medium text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-500 focus:border-blue-500/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors duration-300 hover:text-white"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff
                        size={20}
                      />
                    ) : (
                      <HiOutlineEye
                        size={20}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-blue-400/20 bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(59,130,246,0.25)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_45px_rgba(59,130,246,0.35)]"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Signing In...
                  </div>
                ) : (
                  <>
                    Sign In

                    <HiOutlineArrowRight
                      size={20}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Bottom */}
            <div className="relative z-10 mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-px w-full bg-white/6" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-[rgba(15,23,42,0.95)] px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    New Here?
                  </span>
                </div>
              </div>

              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-sm font-bold text-slate-200 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
              >
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login