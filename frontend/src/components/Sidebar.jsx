import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaPlusSquare, FaUser, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Helper to style active links (The McLaren "Active" State)
  const getLinkClass = ({ isActive }) => 
    `flex items-center gap-4 px-6 py-4 text-lg font-medium transition-all duration-200 group ${
      isActive 
        ? 'text-papaya border-r-4 border-papaya bg-white/5 dark:bg-white/5' 
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-papaya-light'
    }`;

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-anthracite border-r border-gray-200 dark:border-gray-800 z-50">
      
      {/* 1. Logo Area */}
      <div className="p-8">
        <h1 className="text-3xl font-extrabold tracking-tighter italic text-anthracite dark:text-white">
          Cine<span className="text-papaya">Sync</span>
          <span className="text-xs not-italic ml-1 align-top bg-papaya text-black px-1 rounded">V3</span>
        </h1>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 flex flex-col gap-2 mt-4">
        <NavLink to="/" className={getLinkClass}>
          <FaHome className="text-xl" /> <span>Feed</span>
        </NavLink>
        <NavLink to="/find-friends" className={getLinkClass}>
          <FaSearch className="text-xl" /> <span>Search</span>
        </NavLink>
        <NavLink to="/create" className={getLinkClass}>
          <FaPlusSquare className="text-xl" /> <span>Post</span>
        </NavLink>
        <NavLink to={`/profile/${user?.username}`} className={getLinkClass}>
          <FaUser className="text-xl" /> <span>Profile</span>
        </NavLink>
      </nav>

      {/* 3. Bottom Controls (Theme & User) */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-4 text-gray-500 dark:text-gray-400 hover:text-papaya transition w-full"
        >
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 text-red-500 hover:text-red-400 transition w-full"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

        {/* Mini User Profile */}
        <div className="flex items-center gap-3 pt-4">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-papaya to-red-500 flex items-center justify-center font-bold text-white shadow-lg shadow-papaya/20">
             {user?.username.charAt(0).toUpperCase()}
           </div>
           <div className="text-sm">
             <p className="font-bold text-anthracite dark:text-white">@{user?.username}</p>
             <p className="text-gray-500 text-xs">Driver</p>
           </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
