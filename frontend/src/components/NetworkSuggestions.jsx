import { useState, useEffect } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';

function NetworkSuggestions({ horizontal = false }) {
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get('/api/social/suggestions');
        // Limit to 3 for horizontal view
        setSuggestions(horizontal ? res.data.slice(0, 3) : res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSuggestions();
  }, [horizontal]);

  if (suggestions.length === 0) return null;

  if (horizontal) {
    return (
      <div className="bg-anthracite-light border border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FaUserPlus className="text-papaya" />
            People You May Know
          </h3>
          <Link 
            to="/find-friends" 
            className="text-papaya text-xs font-bold hover:underline uppercase tracking-wider"
          >
            See All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map(user => (
            <div 
              key={user._id} 
              className="bg-anthracite border border-gray-700 rounded-lg p-4 hover:border-papaya transition cursor-pointer"
              onClick={() => navigate(`/profile/${user.username}`)}
            >
              <div className="flex flex-col items-center text-center gap-3">
                {user.userImage ? (
                  <img 
                    src={user.userImage} 
                    alt={user.username}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-black border-2 border-gray-600 flex items-center justify-center text-white font-bold text-xl">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-white hover:text-papaya truncate">
                    @{user.username}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.libraryPreviews?.length || 0} shows
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${user.username}`);
                  }}
                  className="w-full bg-papaya text-black text-xs font-bold px-3 py-2 rounded hover:bg-papaya-dark transition"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vertical view (original)
  return (
    <div className="space-y-4">
      {suggestions.map(user => (
        <div key={user._id} className="bg-anthracite-light rounded-xl border border-gray-800 p-5 flex items-center justify-between shadow-lg hover:border-papaya transition">
          <div className="flex items-center gap-3">
            {user.userImage ? (
              <img 
                src={user.userImage} 
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover border border-gray-600"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-black border border-gray-600 flex items-center justify-center text-white font-bold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <Link to={`/profile/${user.username}`} className="font-bold text-white hover:text-papaya">
              @{user.username}
            </Link>
          </div>
          <button 
            onClick={() => navigate(`/profile/${user.username}`)}
            className="bg-papaya text-black text-xs font-bold px-4 py-2 rounded hover:bg-papaya-dark transition"
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
}

export default NetworkSuggestions;
