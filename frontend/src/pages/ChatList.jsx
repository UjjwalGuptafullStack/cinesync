import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';

function ChatList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await api.get('/api/chat/inbox');
        // Filter out any invalid conversations
        const validConversations = res.data.filter(chat => chat.user && chat.user._id);
        setConversations(validConversations);
      } catch (error) {
        console.error('Failed to fetch inbox:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-6 pb-20">
      <div className="bg-anthracite-light border border-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-papaya/10 to-transparent">
          <div className="flex items-center gap-3">
            <FaComments className="text-3xl text-papaya" />
            <div>
              <h1 className="text-2xl font-bold text-white">Messages</h1>
              <p className="text-gray-400 text-sm">Your active conversations</p>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="divide-y divide-gray-800">
          {loading ? (
            <div className="p-10 text-center">
              <div className="animate-pulse text-gray-500">Loading chats...</div>
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((chat) => (
              <Link 
                key={chat.user._id} 
                to={`/chat/${chat.user._id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-800/50 transition group"
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 border-2 border-gray-700 group-hover:border-papaya transition">
                  {chat.user.userImage ? (
                    <img 
                      src={chat.user.userImage} 
                      alt={chat.user.username} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br from-papaya to-red-600">
                      {chat.user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-white group-hover:text-papaya transition truncate">
                      @{chat.user.username}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {new Date(chat.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                </div>

                {/* Unread Indicator */}
                {!chat.isRead && (
                  <div className="w-3 h-3 bg-papaya rounded-full flex-shrink-0"></div>
                )}
              </Link>
            ))
          ) : (
            <div className="p-10 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <FaComments className="text-4xl text-gray-600" />
              </div>
              <p className="text-gray-500 mb-2">No active chats yet</p>
              <p className="text-gray-600 text-sm">Visit a user's profile to start a conversation!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatList;
