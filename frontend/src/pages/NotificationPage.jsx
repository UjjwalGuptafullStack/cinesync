import { useEffect, useState } from 'react';
import api from '../api';
import { FaHeart, FaComment, FaUserPlus } from 'react-icons/fa';

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/api/notifications');
        setNotifications(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const getIcon = (type) => {
    switch(type) {
        case 'like': return <FaHeart className="text-papaya" />;
        case 'comment': return <FaComment className="text-blue-400" />;
        case 'follow': return <FaUserPlus className="text-green-400" />;
        default: return null;
    }
  };

  const getMessage = (n) => {
    switch(n.type) {
        case 'like': return <span>liked your review of <b>{n.post?.mediaTitle}</b></span>;
        case 'comment': return <span>commented on your review of <b>{n.post?.mediaTitle}</b></span>;
        case 'follow': return <span>started following you</span>;
        default: return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-2">Notifications</h1>

      <div className="space-y-2">
        {loading ? (
           <p className="text-gray-500">Loading...</p>
        ) : notifications.length > 0 ? (
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
  );
}

export default NotificationPage;
