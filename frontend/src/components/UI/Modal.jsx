import { useEffect, useState, useCallback } from 'react';
import { HiOutlineX } from 'react-icons/hi';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 250);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, handleClose]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-300
          ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`glass-strong w-full ${maxWidth} pointer-events-auto rounded-3xl overflow-hidden relative transition-all duration-300
            ${visible
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-[0.92] translate-y-3'
            }`}
          style={{ boxShadow: '0 25px 60px -12px rgba(0,0,0,0.6)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all duration-200"
              id="modal-close-btn"
            >
              <HiOutlineX size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
