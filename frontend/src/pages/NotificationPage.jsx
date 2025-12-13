import { useEffect, useState } from 'react';
import api from '../api';
import { FaHeart, FaComment, FaUserPlus, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import NotificationItem from '../components/NotificationItem';

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleClearAll = async () => {
    if (!window.confirm('Clear all notifications?')) return;
    try {
      await api.delete('/api/notifications');
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch (error) {
      toast.error('Failed to clear notifications');
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
                  <NotificationItem 
                    key={req._id} 
                    request={req} 
                    onUpdate={fetchData}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Notifications Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-papaya">Activity</h2>
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-gray-400 hover:text-red-500 transition uppercase tracking-wide"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="space-y-2">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n._id} className="bg-anthracite-light p-4 rounded border border-gray-800 flex items-center gap-4">
                    {n.sender.userImage ? (
                      <img 
                        src={n.sender.userImage} 
                        alt={n.sender.username}
                        className="w-10 h-10 rounded-full object-cover border border-gray-600"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {n.sender.username.charAt(0).toUpperCase()}
                      </div>
                    )}
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
