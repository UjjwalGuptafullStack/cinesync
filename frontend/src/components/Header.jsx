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
    <header className="sticky top-0 z-50 bg-anthracite-light border-b border-gray-800 shadow-md">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:opacity-80 transition">
          Cine<span className="text-papaya">Sync</span>
        </Link>

        {/* Navigation */}
        <ul className="flex items-center space-x-6">
          {user ? (
            <>
              {/* Links */}
              <li>
                <Link to="/find-friends" className="text-gray-400 hover:text-papaya text-lg transition" title="Find Friends">
                  <FaSearch />
                </Link>
              </li>
              <li>
                <Link to="/requests" className="text-gray-400 hover:text-papaya text-lg transition" title="Requests">
                  <FaBell />
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-gray-400 hover:text-papaya font-bold transition">
                  + POST
                </Link>
              </li>

              {/* Profile Link */}
              <li>
                <Link to={`/profile/${user.username}`} className="text-white font-bold hover:text-papaya transition flex items-center gap-2">
                  <FaUser className="text-papaya" />
                  <span className="hidden md:inline">{user.username}</span>
                </Link>
              </li>

              {/* Actions */}
              <div className="flex items-center gap-4 border-l border-gray-700 pl-4 ml-2">
                <button onClick={toggleTheme} className="text-gray-400 hover:text-papaya transition">
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
                <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition" title="Logout">
                  <FaSignOutAlt />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-gray-300 hover:text-white font-medium">Login</Link>
              <Link to="/register" className="bg-papaya text-black px-4 py-2 rounded font-bold hover:bg-papaya-dark transition">
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
