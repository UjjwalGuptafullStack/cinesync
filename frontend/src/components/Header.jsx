import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSun, FaMoon, FaSearch, FaBell, FaComments } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  // Re-read user from localStorage when navigating (to catch profile updates)
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };

    // Listen for custom storage events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleStorageChange);
    };
  }, []);

  const onLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 shadow-md transition-colors duration-300 
      bg-papaya border-b-2 border-papaya-dark text-black
      dark:bg-anthracite dark:border-gray-800 dark:text-white">
      
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 hover:opacity-80 transition">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-black dark:text-white">Cine</span><span className="text-white dark:text-papaya">Sync</span>
          </span>
        </Link>

        {/* Navigation */}
        <ul className="flex items-center space-x-4 md:space-x-6">
          {user ? (
            <>
              {/* Icon Links */}
              <li>
                <Link to="/find-friends" className="text-black/70 hover:text-papaya dark:text-gray-400 dark:hover:text-papaya text-xl transition" title="Search">
                  <FaSearch />
                </Link>
              </li>
              
              {/* Messages - Prominent Pill Button */}
              <li className="hidden md:block">
                <Link 
                  to="/chat" 
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 transition group relative"
                >
                  <div className="relative">
                    <FaComments className="text-papaya text-lg" />
                    {/* Unread Badge - You can add logic later to show actual count */}
                    {/* {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-anthracite">
                        {unreadCount}
                      </span>
                    )} */}
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 font-bold text-sm group-hover:text-black dark:group-hover:text-white">Messages</span>
                </Link>
              </li>
              
              {/* Mobile Messages Icon */}
              <li className="md:hidden">
                <Link to="/chat" className="text-black/70 hover:text-papaya dark:text-gray-400 dark:hover:text-papaya text-xl transition relative" title="Messages">
                  <FaComments />
                </Link>
              </li>
              
              <li>
                <Link to="/notifications" className="text-black/70 hover:text-papaya dark:text-gray-400 dark:hover:text-papaya text-xl transition" title="Notifications">
                  <FaBell />
                </Link>
              </li>

              {/* Profile Avatar */}
              <li>
                <Link to={`/profile/${user.username}`} className="flex items-center gap-2 hover:opacity-80 transition">
                  {user.userImage ? (
                    <img 
                      src={user.userImage} 
                      alt={user.username}
                      className="w-9 h-9 rounded-full object-cover border-2 border-black dark:border-papaya"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-papaya to-red-600 flex items-center justify-center text-white font-bold text-sm border-2 border-black dark:border-papaya">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline font-semibold text-black dark:text-white">{user.username}</span>
                </Link>
              </li>

              {/* Theme Toggle */}
              <li>
                <button 
                  onClick={toggleTheme} 
                  className="text-black/70 hover:text-papaya dark:text-gray-400 dark:hover:text-papaya text-lg transition"
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
              </li>
              
              {/* Logout */}
              <li>
                <button 
                  onClick={onLogout} 
                  className="text-black/70 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition text-lg" 
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </li>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-black dark:text-gray-300 hover:text-white dark:hover:text-white font-medium">Login</Link>
              <Link to="/register" className="bg-black text-papaya dark:bg-papaya dark:text-black px-4 py-2 rounded font-bold hover:bg-gray-800 dark:hover:bg-papaya-dark transition">
                Get Started
              </Link>
            </div>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
