import { useEffect, useState } from 'react';
import api from '../api';
import { FaHeart, FaComment, FaUserPlus, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notifsRes, requestsRes] = await Promise.all([
          api.get('/api/notifications'),
          api.get('/api/social/requests')
        ]);
        setNotifications(notifsRes.data);
        setRequests(requestsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await api.post(`/api/social/accept/${requestId}`);
      toast.success('Follow request accepted!');
      setRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.post(`/api/social/reject/${requestId}`);
      toast.info('Follow request rejected');
      setRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const getIcon = (type) => {
    switch(type) {
        case 'like': return <FaHeart className="text-papaya" />;
        case 'comment': return <FaComment className="text-blue-400" />;
        case 'follow_request': return <FaUserPlus className="text-yellow-400" />;
        case 'follow_accepted': return <FaUserCheck className="text-green-400" />;
        case 'follow_rejected': return <FaUserTimes className="text-red-400" />;
        default: return null;
    }
  };

  const getMessage = (n) => {
    switch(n.type) {
        case 'like': return <span>liked your review of <b>{n.post?.mediaTitle}</b></span>;
        case 'comment': return <span>commented on your review of <b>{n.post?.mediaTitle}</b></span>;
        case 'follow_request': return <span>wants to follow you</span>;
        case 'follow_accepted': return <span>accepted your follow request</span>;
        case 'follow_rejected': return <span>declined your follow request</span>;
        default: return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-2">Notifications</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-6">
          {/* Follow Requests Section */}
          {requests.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-papaya mb-3">Follow Requests</h2>
              <div className="space-y-2">
                {requests.map(req => (
                  <div key={req._id} className="bg-anthracite-light p-4 rounded border border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-xl bg-gray-800 p-2 rounded-full">
                        <FaUserPlus className="text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">
                          <span className="font-bold text-white">@{req.sender.username}</span> wants to follow you
                        </p>
                        <span className="text-xs text-gray-600">{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Section */}
          <div>
            <h2 className="text-lg font-semibold text-papaya mb-3">Activity</h2>
            <div className="space-y-2">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n._id} className="bg-anthracite-light p-4 rounded border border-gray-800 flex items-center gap-4">
                    <div className="text-xl bg-gray-800 p-2 rounded-full">
                      {getIcon(n.type)}
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">
                        <span className="font-bold text-white">@{n.sender.username}</span> {getMessage(n)}
                      </p>
                      <span className="text-xs text-gray-600">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-10">No notifications yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPage;
