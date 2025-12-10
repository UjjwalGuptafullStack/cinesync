import { useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { FaSearch, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function FindFriends() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const response = await api.get(`/api/social/search?query=${query}`);
      setUsers(response.data);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold text-white mb-2">Find Friends</h1>
      <p className="text-gray-400 mb-8">Search for users to follow.</p>

      {/* Search Bar */}
      <div className="bg-anthracite-light p-4 rounded-lg shadow-lg border border-gray-800 mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            className="flex-1 p-3 bg-gray-900 text-white placeholder-gray-400 rounded border border-gray-700 focus:outline-none focus:border-papaya transition"
            placeholder="Enter username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="bg-papaya hover:bg-papaya-dark text-black font-bold px-6 py-3 rounded transition uppercase tracking-wide"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* User Results */}
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between bg-anthracite-light p-4 rounded-lg border border-gray-800 hover:border-papaya transition shadow-sm group"
          >
            <div className="flex items-center gap-4">
              {/* Simple Avatar Circle */}
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-papaya transition">{user.username}</h3>
              </div>
            </div>

            <Link 
              to={`/profile/${user.username}`}
              className="text-sm font-bold text-gray-400 group-hover:text-white flex items-center gap-1 transition"
            >
              View Profile <FaChevronRight size={12} />
            </Link>
          </div>
        ))}
        
        {users.length === 0 && query && !loading && (
           <div className="text-center py-10 text-gray-500">
             No users found.
           </div>
        )}
      </div>
    </div>
  );
}

export default FindFriends;
