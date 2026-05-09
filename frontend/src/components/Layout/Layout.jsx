import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen text-white relative">
      {/* Ambient Animated Background */}
      <div className="ambient-bg" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area — pushed right on desktop by sidebar width */}
      <div className="min-h-screen flex flex-col" style={{ marginLeft: '0px' }}>
        <style>{`@media (min-width: 1024px) { .main-content { margin-left: 272px !important; } }`}</style>
        <div className="main-content min-h-screen flex flex-col">
          <Navbar
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          <main className="flex-1 p-5 md:p-6 lg:p-8">
            <div key={location.pathname} className="animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
