import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaUser, FaUsers, FaBell, FaSun, FaMoon } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // Check if user is logged in by looking at localStorage
  // (In a real app, we'd use a Context/Redux store, but this works for MVP)
  const user = JSON.parse(localStorage.getItem('user'));

  const onLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 mb-8">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo Area */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition">
          CineSync 🎬
        </Link>

        {/* Navigation */}
        <ul className="flex items-center space-x-6">
          {user ? (
            <>
              <li className="hidden md:block text-gray-400 text-sm">
                 Hey, <Link to={`/profile/${user.username}`} className="text-white font-semibold hover:text-blue-400 hover:underline transition">
                   {user.username}
                 </Link>
              </li>
              
              {/* Action Icons */}
              <div className="flex items-center space-x-4 border-l border-gray-700 pl-4">
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 text-papaya text-xl"
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
                <Link to="/find-friends" className="text-gray-400 hover:text-blue-400 transition text-xl p-2 rounded-full hover:bg-gray-800" title="Find Friends">
                  <FaUsers />
                </Link>
                <Link to="/requests" className="text-gray-400 hover:text-yellow-400 transition text-xl p-2 rounded-full hover:bg-gray-800" title="Requests">
                  <FaBell />
                </Link>
                <button
                  className="text-gray-400 hover:text-red-400 transition text-xl p-2 rounded-full hover:bg-gray-800"
                  onClick={onLogout}
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-gray-300 hover:text-white font-medium">Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition">
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
