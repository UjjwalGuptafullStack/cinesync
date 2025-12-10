import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUserPlus, FaSearch } from 'react-icons/fa';

function FindFriends() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const response = await axios.get(
        `http://localhost:5000/api/social/search?query=${query}`,
        config
      );
      setUsers(response.data);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (userId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      await axios.post(
        `http://localhost:5000/api/social/follow/${userId}`,
        {}, // Empty body
        config
      );
      
      toast.success('Friend request sent!');
      // Optional: Remove user from list or change button state
      setUsers(users.filter((u) => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaSearch className="text-blue-500" /> Find Friends
      </h1>

      {/* Search Bar */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-blue-500"
            placeholder="Search by username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-bold transition"
          >
            {loading ? '...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-750 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-lg">{user.username}</span>
              </div>
              
              <button
                onClick={() => sendRequest(user._id)}
                className="flex items-center gap-2 bg-gray-700 hover:bg-green-600 text-white px-4 py-2 rounded transition group"
              >
                <FaUserPlus className="text-green-400 group-hover:text-white" />
                <span>Follow</span>
              </button>
            </div>
          ))
        ) : (
          query && !loading && (
            <p className="text-center text-gray-500">No users found.</p>
          )
        )}
      </div>
    </div>
  );
}

export default FindFriends;
