import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import MobileHeader from './MobileHeader';

function Layout() {
  // Protect the routes: If no user, kick to login
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-glacier dark:bg-carbon transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Top & Bottom Bars */}
      <MobileHeader />
      <MobileNav />

      {/* MAIN CONTENT AREA */}
      {/* md:ml-64 pushes content right on desktop to make room for sidebar */}
      {/* pt-20 pb-20 adds spacing for mobile top/bottom bars */}
      <main className="md:ml-64 min-h-screen p-4 pt-20 pb-20 md:p-8 md:pt-8 transition-all">
        <div className="max-w-4xl mx-auto">
          <Outlet /> {/* This is where the Page content (Feed, Profile, etc.) renders */}
        </div>
      </main>
      
    </div>
  );
}

export default Layout;
