import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineArrowRight } from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: '#06061a' }}>
      {/* Background effects */}
      <div className="orb orb-1 animate-float" />
      <div className="orb orb-2 animate-float" style={{ animationDelay: '2s' }} />
      <div className="orb orb-3 animate-float" style={{ animationDelay: '4s' }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Left panel - branding (desktop) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative">
        <div className="max-w-md animate-fade-in-slow">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mb-10 relative"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', boxShadow: '0 12px 40px rgba(99,102,241,0.35)' }}
          >
            <span className="text-white text-2xl font-black relative z-10">T</span>
            <div className="absolute inset-0 rounded-3xl"
              style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%)' }} />
          </div>

          <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Manage tasks<br />
            <span className="gradient-text">like a pro.</span>
          </h1>
          <p className="text-lg text-white/30 leading-relaxed mb-10">
            TaskFlow brings your team together with Kanban boards, role-based access, and real-time progress tracking.
          </p>

          <div className="flex items-center gap-6">
            {[
              { value: '10K+', label: 'Tasks tracked' },
              { value: '500+', label: 'Teams active' },
              { value: '99.9%', label: 'Uptime' }
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md relative z-10 animate-slide-up">
          {/* Mobile logo */}
          <div className="text-center mb-10 lg:hidden animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', boxShadow: '0 8px 32px rgba(99,102,241,0.3)' }}>
              <span className="text-white text-xl font-black">T</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Welcome back</h2>
            <p className="text-white/30 text-sm font-medium">Sign in to continue to your workspace</p>
          </div>

          {/* Form card */}
          <div className="glass-card-static p-8" style={{ boxShadow: '0 25px 60px -12px rgba(0,0,0,0.5)' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-extrabold text-white/25 uppercase tracking-widest mb-2.5 ml-1">Email Address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="glass-input pl-12 py-3.5"
                    id="login-email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-white/25 uppercase tracking-widest mb-2.5 ml-1">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input pl-12 pr-12 py-3.5"
                    id="login-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors duration-200"
                  >
                    {showPassword ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base font-bold group"
                id="login-submit-btn"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform duration-200" size={18} />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-white/5" /></div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-[10px] font-bold text-white/15 uppercase tracking-widest" style={{ background: '#0d0d24' }}>New here?</span>
                </div>
              </div>
              <Link to="/register" className="btn-secondary w-full py-3.5 text-sm font-bold inline-flex items-center justify-center">
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
