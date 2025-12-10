import { NavLink } from 'react-router-dom';
import { FaHome, FaSearch, FaPlusSquare, FaUser } from 'react-icons/fa';

function MobileNav() {
  const user = JSON.parse(localStorage.getItem('user'));

  // Mobile Active Class (Icon glows Papaya)
  const getMobileClass = ({ isActive }) => 
    `flex flex-col items-center justify-center w-full h-full text-2xl transition-colors ${
      isActive ? 'text-papaya' : 'text-gray-400 hover:text-gray-200'
    }`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white dark:bg-anthracite border-t border-gray-200 dark:border-gray-800 z-50 flex justify-around items-center px-2">
      <NavLink to="/" className={getMobileClass}>
        <FaHome />
      </NavLink>
      <NavLink to="/find-friends" className={getMobileClass}>
        <FaSearch />
      </NavLink>
      <NavLink to="/create" className={getMobileClass}>
        <FaPlusSquare className="text-3xl" /> {/* Slightly bigger */}
      </NavLink>
      <NavLink to={`/profile/${user?.username}`} className={getMobileClass}>
        <FaUser />
      </NavLink>
    </div>
  );
}

export default MobileNav;
