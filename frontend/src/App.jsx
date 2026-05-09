import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import MyTasks from './pages/MyTasks'
import Layout from './components/Layout/Layout'
import './index.css'

const ScreenLoader = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)]" />

      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:80px_80px]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-700 shadow-[0_0_60px_rgba(59,130,246,0.45)]" />

          <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white">
            T
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-2xl font-bold text-transparent">
            TaskFlow
          </h1>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
            <p className="text-sm font-medium tracking-wide text-slate-400">
              Loading workspace...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <ScreenLoader />

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <ScreenLoader />

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#020617] text-slate-100">
          <Toaster
            position="top-right"
            gutter={12}
            containerStyle={{
              top: 24,
              right: 24
            }}
            toastOptions={{
              duration: 3500,
              style: {
                background: 'rgba(10,15,30,0.88)',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                backdropFilter: 'blur(24px)',
                padding: '14px 18px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 40px rgba(0,0,0,0.45)'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff'
                }
              }
            }}
          />

          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />

              <Route path="dashboard" element={<Dashboard />} />

              <Route path="projects" element={<Projects />} />

              <Route path="projects/:id" element={<ProjectDetail />} />

              <Route path="my-tasks" element={<MyTasks />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App