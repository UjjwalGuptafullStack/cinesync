import { useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function NotificationItem({ request, onUpdate }) {
  const [status, setStatus] = useState('pending'); // pending, accepted, followed_back

  const handleAccept = async () => {
    try {
      await api.post(`/api/social/accept/${request._id}`);
      setStatus('accepted');
      toast.success('Request accepted!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to accept request');
    }
  };

  const handleFollowBack = async () => {
    try {
      await api.put(`/api/users/follow/${request.sender._id}`);
      setStatus('followed_back');
      toast.success(`You're now following @${request.sender.username}!`);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      toast.error('Failed to follow back');
    }
  };

  const handleReject = async () => {
    try {
      await api.post(`/api/social/reject/${request._id}`);
      toast.info('Request rejected');
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      toast.error('Failed to reject request');
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-anthracite-light rounded-lg mb-2 border border-gray-800">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${request.sender.username}`}>
          {request.sender.userImage ? (
            <img 
              src={request.sender.userImage} 
              className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400" 
              alt={request.sender.username} 
            />
          ) : (
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-yellow-400">
              {request.sender.username.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
        <div>
          <Link to={`/profile/${request.sender.username}`} className="font-bold text-white hover:text-papaya">
            @{request.sender.username}
          </Link>
          <p className="text-gray-400 text-sm">wants to follow you</p>
        </div>
      </div>

      <div className="flex gap-2">
        {status === 'pending' && (
          <>
            <button 
              onClick={handleAccept} 
              className="bg-papaya text-black px-4 py-1.5 rounded font-bold hover:bg-papaya-dark transition"
            >
              Accept
            </button>
            <button 
              onClick={handleReject}
              className="text-gray-400 px-3 hover:text-red-500 transition text-sm"
            >
              Ignore
            </button>
          </>
        )}

        {/* THE FRICTION KILLER: Immediate Follow Back Option */}
        {status === 'accepted' && (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-green-500 text-sm font-bold">Accepted!</span>
            <button 
              onClick={handleFollowBack} 
              className="border-2 border-papaya text-papaya px-3 py-1.5 rounded hover:bg-papaya hover:text-black transition text-sm font-bold"
            >
              Follow Back +
            </button>
          </div>
        )}

        {status === 'followed_back' && (
          <span className="text-gray-400 text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Connected
          </span>
        )}
      </div>
    </div>
  );
}

export default NotificationItem;
