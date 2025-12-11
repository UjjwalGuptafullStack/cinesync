import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSun, FaMoon, FaSearch, FaBell, FaUser } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const user = JSON.parse(localStorage.getItem('user'));

  const onLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 shadow-md transition-colors duration-300 
      bg-papaya border-b border-papaya-dark text-black
      dark:bg-anthracite-light dark:border-gray-800 dark:text-white">
      
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition group">
          <img 
            src="/cinesync-logo.svg" 
            alt="CineSync Logo" 
            className="h-10 w-10 transition-transform group-hover:scale-110"
          />
          <span className="text-xl font-bold tracking-tight text-black dark:text-white hidden sm:inline">
            Cine<span className="text-white dark:text-papaya">Sync</span>
          </span>
        </Link>

        {/* Navigation */}
        <ul className="flex items-center space-x-6">
          {user ? (
            <>
              {/* Links */}
              <li>
                <Link to="/find-friends" className="text-black/70 hover:text-black dark:text-gray-400 dark:hover:text-papaya text-lg transition" title="Find Friends">
                  <FaSearch />
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="text-black/70 hover:text-black dark:text-gray-400 dark:hover:text-papaya text-lg transition" title="Notifications">
                  <FaBell />
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-black/70 hover:text-black dark:text-gray-400 dark:hover:text-papaya font-bold transition">
                  + POST
                </Link>
              </li>

              {/* Profile Link */}
              <li>
                <Link to={`/profile/${user.username}`} className="text-black dark:text-white font-bold hover:text-white dark:hover:text-papaya transition flex items-center gap-2">
                  <FaUser className="text-white dark:text-papaya" />
                  <span className="hidden md:inline">{user.username}</span>
                </Link>
              </li>

              {/* Actions */}
              <div className="flex items-center gap-4 border-l border-black/20 dark:border-gray-700 pl-4 ml-2">
                <button onClick={toggleTheme} className="text-black hover:text-white dark:text-gray-400 dark:hover:text-papaya transition">
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
                <button onClick={onLogout} className="text-black/70 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition" title="Logout">
                  <FaSignOutAlt />
                </button>
              </div>
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
