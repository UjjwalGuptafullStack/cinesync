import { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { FaSearch, FaChevronRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function FindFriends() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await api.get('/api/social/suggestions');
      setSuggestions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

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
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-2">Find Friends</h1>
      <p className="text-gray-400 mb-8">Discover and connect with other cinephiles.</p>

      {/* SUGGESTIONS SECTION */}
      {suggestions.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
            <span className="text-papaya">⚡</span> Networking Grid
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map(user => (
              <div key={user._id} className="bg-anthracite-light rounded-xl border border-gray-800 p-5 flex flex-col gap-4 shadow-lg hover:border-papaya transition group">
                
                {/* Header: Avatar & Name */}
                <div className="flex items-center justify-between">
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
                    <div>
                      <Link to={`/profile/${user.username}`} className="font-bold text-white hover:text-papaya block leading-tight">
                         @{user.username}
                      </Link>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">Suggested</span>
                    </div>
                  </div>
                  {/* View Profile Button */}
                  <button 
                    onClick={() => navigate(`/profile/${user.username}`)}
                    className="bg-papaya text-black text-xs font-bold px-3 py-1.5 rounded hover:bg-papaya-dark transition"
                  >
                    View
                  </button>
                </div>

                {/* Library Preview (Top 3) */}
                <div className="bg-black/30 p-2 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Top Selections</p>
                  <div className="flex gap-2 h-24">
                    {user.libraryPreviews.map((poster, i) => (
                      <img 
                        key={i} 
                        src={`https://image.tmdb.org/t/p/w92${poster}`} 
                        alt="Show" 
                        className="h-full w-16 object-cover rounded border border-gray-700" 
                      />
                    ))}
                    {user.libraryPreviews.length === 0 && <span className="text-gray-600 text-xs italic self-center">No data</span>}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

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
              {user.userImage ? (
                <img 
                  src={user.userImage} 
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border border-gray-600"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              
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
