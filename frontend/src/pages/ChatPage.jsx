import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { FaPaperPlane, FaCamera, FaTimes } from 'react-icons/fa';

function ChatPage() {
  const { userId } = useParams(); // ID of person we are talking to
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserRef = useRef(JSON.parse(localStorage.getItem('user')));
  const isMountedRef = useRef(true);

  // Helper to check if user is online (active in last 2 minutes)
  const isOnline = (lastActiveDate) => {
    if (!lastActiveDate) return false;
    const diff = new Date() - new Date(lastActiveDate);
    return diff < 2 * 60 * 1000; // Online if active in last 2 mins
  };

  // Helper to format message dates for separators
  const getMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get(`/api/chat/${userId}`);
      if (isMountedRef.current) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchMessages();
    
    // Poll every 3 seconds for new messages
    const interval = setInterval(fetchMessages, 3000);
    
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [userId, fetchMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !image) return;

    let imageUrl = "";

    try {
      // 1. Upload image if exists
      if (image) {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", image);
        
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        const uploadRes = await fetch(`${baseURL}/api/posts/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Upload failed');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      // 2. Send message with optional image
      const res = await api.post('/api/chat', { 
        receiverId: userId, 
        content: newMessage || '📷 Image',
        image: imageUrl 
      });
      
      if (isMountedRef.current) {
        setMessages(prev => [...prev, res.data]);
        setNewMessage('');
        setImage(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Derive the other user from the first message (if exists)
  // Safety check: Ensure sender and receiver are populated objects, not just IDs
  const otherUser = messages.length > 0 && messages[0].sender && messages[0].receiver
    ? (messages[0].sender._id === currentUserRef.current._id ? messages[0].receiver : messages[0].sender)
    : null;

  return (
    <div className="max-w-2xl mx-auto mt-4 h-[80vh] flex flex-col bg-anthracite-light border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header - Shows other user's info with online indicator */}
      <div className="p-4 bg-anthracite border-b border-gray-800 flex items-center gap-3">
        {otherUser ? (
          <>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 border-2 border-papaya">
              {otherUser.userImage ? (
                <img src={otherUser.userImage} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-papaya to-red-600">
                  {otherUser.username[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-white text-lg">@{otherUser.username}</h2>
              {isOnline(otherUser.lastActive) ? (
                <span className="text-xs text-green-400 flex items-center gap-1 font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  Online
                </span>
              ) : (
                <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  Offline
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500 animate-pulse"></div>
            <span className="text-white font-bold">Loading chat...</span>
          </div>
        )}
      </div>

      {/* Messages Area - Bubble Layout */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-anthracite/50">
        {messages.map((msg, index) => {
          const isMe = msg.sender._id === currentUserRef.current._id;
          const messageSender = msg.sender;
          
          // Check if we need a date separator
          const showDateSeparator = 
            index === 0 || 
            getMessageDate(messages[index - 1].createdAt) !== getMessageDate(msg.createdAt);

          return (
            <div key={msg._id}>
              {/* DATE SEPARATOR */}
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">
                    {getMessageDate(msg.createdAt)}
                  </span>
                </div>
              )}

              {/* MESSAGE BUBBLE */}
              <div className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-1 border border-gray-600">
                    {messageSender.userImage ? (
                      <img src={messageSender.userImage} alt={messageSender.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs">
                        {messageSender.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
                <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow ${
                  isMe 
                    ? 'bg-papaya text-black rounded-tr-sm font-medium' 
                    : 'bg-gray-700 text-white rounded-tl-sm'
                }`}>
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="attachment" 
                      className="rounded-lg mb-2 max-w-full cursor-pointer hover:opacity-90 transition"
                      onClick={() => window.open(msg.image, '_blank')}
                    />
                  )}
                  <p className="leading-relaxed">{msg.content}</p>
                  <span className="text-[10px] opacity-70 block text-right mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                {isMe && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-1 border border-papaya">
                    {currentUserRef.current.userImage ? (
                      <img src={currentUserRef.current.userImage} alt={currentUserRef.current.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-papaya to-red-600 flex items-center justify-center text-black font-bold text-xs">
                        {currentUserRef.current.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Rounded pill-shaped with camera and circular Send button */}
      <form onSubmit={handleSend} className="p-4 bg-anthracite border-t border-gray-800 flex items-center gap-3">
        {/* Camera Icon */}
        <label className="cursor-pointer text-gray-400 hover:text-papaya transition flex-shrink-0">
          <FaCamera className="text-xl" />
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageSelect}
            disabled={uploading}
          />
        </label>

        {/* Image Preview */}
        {image && (
          <div className="relative flex-shrink-0">
            <img 
              src={URL.createObjectURL(image)} 
              className="w-10 h-10 object-cover rounded border-2 border-papaya" 
              alt="preview"
            />
            <button 
              type="button"
              onClick={() => setImage(null)} 
              className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs hover:bg-red-600 transition"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={uploading ? "Uploading image..." : "Type a message..."}
          disabled={uploading}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-5 py-3 text-white focus:border-papaya focus:outline-none focus:ring-2 focus:ring-papaya/50 transition disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={uploading}
          className="bg-papaya p-3 rounded-full text-black hover:bg-papaya-dark transition shadow-md w-12 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
