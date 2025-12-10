import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaBell } from 'react-icons/fa';

function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch requests on load
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const response = await axios.get(
        'http://localhost:5000/api/social/requests',
        config
      );
      setRequests(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      await axios.post(
        `http://localhost:5000/api/social/accept/${requestId}`,
        {},
        config
      );

      toast.success('Request accepted!');
      // Remove the accepted request from the list
      setRequests(requests.filter((req) => req._id !== requestId));
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaBell className="text-yellow-500" /> Friend Requests
      </h1>

      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div
              key={req._id}
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg border-l-4 border-yellow-500"
            >
              <div>
                <p className="text-gray-300 text-sm">Follow Request from</p>
                <div className="flex items-center gap-3 mt-1">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {req.sender.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-lg text-white">{req.sender.username}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept(req._id)}
                  className="bg-green-600 hover:bg-green-700 p-2 rounded-full text-white transition shadow"
                  title="Accept"
                >
                  <FaCheck />
                </button>
                {/* Reject logic can be added later, for now just UI */}
                <button className="bg-red-600 hover:bg-red-700 p-2 rounded-full text-white transition shadow opacity-50 cursor-not-allowed">
                  <FaTimes />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-800 rounded-lg">
            <p className="text-gray-400">No pending requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendRequests;
