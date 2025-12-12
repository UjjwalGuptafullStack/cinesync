import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { FaPaperPlane } from 'react-icons/fa';

function ChatPage() {
  const { userId } = useParams(); // ID of person we are talking to
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const currentUserRef = useRef(JSON.parse(localStorage.getItem('user')));
  const isMountedRef = useRef(true);

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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await api.post('/api/chat', { receiverId: userId, content: newMessage });
      if (isMountedRef.current) {
        setMessages(prev => [...prev, res.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Derive the other user from the first message (if exists)
  // Safety check: Ensure sender and receiver are populated objects, not just IDs
  const otherUser = messages.length > 0 && messages[0].sender && messages[0].receiver
    ? (messages[0].sender._id === currentUserRef.current._id ? messages[0].receiver : messages[0].sender)
    : null;

  return (
    <div className="max-w-2xl mx-auto mt-4 h-[80vh] flex flex-col bg-anthracite-light border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header - Dynamic with user info */}
      <div className="p-4 bg-anthracite border-b border-gray-800 flex items-center gap-3">
        {otherUser ? (
          <>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
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
              <span className="text-xs text-green-500 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Active now
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500 animate-pulse"></div>
            <span className="text-white font-bold">Loading chat...</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
        {messages.map((msg) => {
          const isMe = msg.sender._id === currentUserRef.current._id;
          return (
            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-lg text-sm ${
                isMe ? 'bg-papaya text-black rounded-tr-none' : 'bg-gray-700 text-white rounded-tl-none'
              }`}>
                <p>{msg.content}</p>
                <span className="text-[10px] opacity-70 block text-right mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-anthracite border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-white focus:border-papaya focus:outline-none"
        />
        <button type="submit" className="bg-papaya p-3 rounded-full text-black hover:bg-papaya-dark transition">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
