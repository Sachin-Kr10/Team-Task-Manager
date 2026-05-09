import { useEffect, useState, useCallback } from 'react'
import { HiOutlineX } from 'react-icons/hi'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl'
}) => {
  const [visible, setVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)

      document.body.style.overflow = 'hidden'

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true)
        })
      })
    } else {
      setVisible(false)

      document.body.style.overflow = ''

      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300)

      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setVisible(false)

    setTimeout(() => {
      onClose()
    }, 300)
  }, [onClose])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleClose])

  if (!shouldRender) return null

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          visible
            ? 'bg-black/70 opacity-100 backdrop-blur-md'
            : 'bg-black/0 opacity-0 backdrop-blur-0'
        }`}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_30%)]" />
      </div>

      {/* Modal */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(15,23,42,0.88)] backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.55)] transition-all duration-300 ${maxWidth} ${
            visible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-6 scale-[0.94] opacity-0'
          }`}
        >
          {/* Background Effects */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_28%)]" />

            {/* Blur Orbs */}
            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:60px_60px]" />
          </div>

          {/* Header */}
          <div className="relative flex items-start justify-between border-b border-white/8 px-6 pb-5 pt-6 sm:px-8 sm:pt-7">
            <div>
              <h2 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-black tracking-tight text-transparent">
                {title}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Manage and update your workspace details
              </p>
            </div>

            {/* Close */}
            <button
              id="modal-close-btn"
              onClick={handleClose}
              className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-400 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              <HiOutlineX
                size={20}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
            </button>
          </div>

          {/* Content */}
          <div className="relative px-6 py-6 sm:px-8 sm:py-7">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal