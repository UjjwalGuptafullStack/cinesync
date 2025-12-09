import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Header() {
  const navigate = useNavigate();
  
  // Check if user is logged in by looking at localStorage
  // (In a real app, we'd use a Context/Redux store, but this works for MVP)
  const user = JSON.parse(localStorage.getItem('user'));

  const onLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <header className="flex justify-between items-center py-4 mb-8 border-b border-gray-700">
      <div className="logo">
        <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400">
          CineSync 🎬
        </Link>
      </div>
      <ul className="flex items-center space-x-6">
        {user ? (
          // IF LOGGED IN: Show Logout
          <>
            <li className="text-gray-300">
               Hello, <span className="font-bold text-white">{user.username}</span>
            </li>
            <li>
              <button
                className="flex items-center space-x-2 text-gray-300 hover:text-red-500 transition"
                onClick={onLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </li>
          </>
        ) : (
          // IF LOGGED OUT: Show Login/Register
          <>
            <li>
              <Link to="/login" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <FaSignInAlt />
                <span>Login</span>
              </Link>
            </li>
            <li>
              <Link to="/register" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <FaUser />
                <span>Register</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
