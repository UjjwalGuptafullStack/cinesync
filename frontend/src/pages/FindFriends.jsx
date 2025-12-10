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
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-4xl font-black text-anthracite dark:text-white mb-2 uppercase tracking-tight">Driver Database</h1>
      <p className="text-gray-500 mb-8">Locate other users to track their telemetry.</p>

      {/* 1. Command Line Search */}
      <div className="bg-white dark:bg-anthracite-light p-2 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 flex items-center px-4 bg-gray-50 dark:bg-black/20 rounded">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              className="flex-1 p-4 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none font-medium"
              placeholder="Enter username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="bg-papaya hover:bg-papaya-dark text-black font-bold px-8 py-2 rounded transition uppercase tracking-wide"
          >
            {loading ? 'Scanning...' : 'Search'}
          </button>
        </form>
      </div>

      {/* 2. Driver Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between bg-white dark:bg-anthracite-light p-5 rounded-lg border-l-4 border-transparent hover:border-l-papaya shadow-sm hover:shadow-md transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-gray-700 to-black rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{user.username}</h3>
                <Link 
                  to={`/profile/${user.username}`}
                  className="text-xs text-gray-500 group-hover:text-papaya uppercase font-bold tracking-wider flex items-center gap-1"
                >
                  View Profile <FaChevronRight size={10} />
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {users.length === 0 && query && !loading && (
           <div className="col-span-full text-center py-10 text-gray-400 font-mono">
             No drivers found matching query.
           </div>
        )}
      </div>
    </div>
  );
}

export default FindFriends;
