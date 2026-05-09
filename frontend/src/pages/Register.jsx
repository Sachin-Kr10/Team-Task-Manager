import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  HiOutlineMail, HiOutlineLockClosed, HiOutlineUser,
  HiOutlineEye, HiOutlineEyeOff, HiOutlineArrowRight, HiOutlineCheckCircle
} from 'react-icons/hi';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return toast.error('Please fill in all fields');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const strength = !password
    ? { w: '0%', c: '#334155', l: '' }
    : password.length < 6 ? { w: '25%', c: '#ef4444', l: 'Weak' }
    : password.length < 10 ? { w: '60%', c: '#f59e0b', l: 'Fair' }
    : { w: '100%', c: '#10b981', l: 'Strong' };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: '#06061a' }}>
      <div className="orb orb-1 animate-float" />
      <div className="orb orb-2 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Left branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative">
        <div className="max-w-md animate-fade-in-slow">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-10"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', boxShadow: '0 12px 40px rgba(99,102,241,0.35)' }}>
            <span className="text-white text-2xl font-black">T</span>
          </div>
          <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Start building<br /><span className="gradient-text">something great.</span>
          </h1>
          <p className="text-lg text-white/30 leading-relaxed mb-10">
            Join TaskFlow and unlock powerful team collaboration tools.
          </p>
          <div className="space-y-4">
            {['Unlimited projects & tasks', 'Role-based team access', 'Real-time Kanban boards', 'Priority & deadline tracking'].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <HiOutlineCheckCircle size={20} className="text-emerald-400 shrink-0" />
                <span className="text-sm text-white/40 font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="text-center mb-10 lg:hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>
              <span className="text-white text-xl font-black">T</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create account</h2>
            <p className="text-white/30 text-sm font-medium">Get started with TaskFlow — it's free</p>
          </div>

          <div className="glass-card-static p-8" style={{ boxShadow: '0 25px 60px -12px rgba(0,0,0,0.5)' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-extrabold text-white/25 uppercase tracking-widest mb-2.5 ml-1">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" className="glass-input pl-12 py-3.5" id="register-name" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-white/25 uppercase tracking-widest mb-2.5 ml-1">Email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" className="glass-input pl-12 py-3.5" id="register-email" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-white/25 uppercase tracking-widest mb-2.5 ml-1">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"
                    className="glass-input pl-12 pr-12 py-3.5" id="register-password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                    {showPassword ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2.5 flex items-center gap-2.5">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: strength.w, background: strength.c }} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: strength.c }}>
                      {strength.l}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-white/25 uppercase tracking-widest mb-2.5 ml-1">Confirm Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password" className="glass-input pl-12 py-3.5" id="register-confirm-password" required />
                  {confirmPassword && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {password === confirmPassword
                        ? <HiOutlineCheckCircle size={18} className="text-emerald-400" />
                        : <div className="w-2 h-2 rounded-full bg-rose-400" />}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base font-bold group mt-2" id="register-submit-btn">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/25 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
