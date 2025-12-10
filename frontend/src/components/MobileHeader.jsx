import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function MobileHeader() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white/80 dark:bg-anthracite/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 flex justify-between items-center px-4">
      <h1 className="text-xl font-extrabold italic text-anthracite dark:text-white">
        Cine<span className="text-papaya">Sync</span>
      </h1>
      
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="text-papaya text-xl">
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-xl">
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
}

export default MobileHeader;
