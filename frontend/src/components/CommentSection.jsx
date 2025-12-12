import { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown, FaPaperPlane, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/posts/${postId}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/api/posts/${postId}/comment`, { content: newComment });
      setComments([res.data, ...comments]); // Add new comment to top
      setNewComment('');
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  const toggleLike = async (commentId) => {
    try {
      const res = await api.put(`/api/comments/${commentId}/like`);
      // Update local state
      setComments(comments.map(c => 
        c._id === commentId ? { ...c, likes: res.data, dislikes: c.dislikes.filter(id => id !== user._id) } : c
      ));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDislike = async (commentId) => {
    try {
      const res = await api.put(`/api/comments/${commentId}/dislike`);
      // Update local state
      setComments(comments.map(c => 
        c._id === commentId ? { ...c, dislikes: res.data, likes: c.likes.filter(id => id !== user._id) } : c
      ));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(`/api/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted.');
    } catch (error) {
      toast.error('Could not delete comment.');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-800">
      <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wide">Comments ({comments.length})</h4>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add to the discussion..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:border-papaya focus:outline-none transition"
        />
        <button type="submit" className="bg-papaya text-black p-3 rounded hover:bg-papaya-dark transition">
          <FaPaperPlane />
        </button>
      </form>

      {/* List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-800/50 p-3 rounded border border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {comment.user.userImage ? (
                  <img 
                    src={comment.user.userImage} 
                    alt={comment.user.username}
                    className="w-6 h-6 rounded-full object-cover border border-gray-600"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {comment.user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <Link to={`/profile/${comment.user.username}`} className="font-bold text-white text-sm hover:text-papaya">
                  @{comment.user.username}
                </Link>
                <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              
              {/* DELETE BUTTON (Only for comment owner) */}
              {user && user._id === comment.user._id && (
                <button 
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-gray-600 hover:text-red-500 transition text-xs"
                  title="Delete Comment"
                >
                  <FaTrash />
                </button>
              )}
            </div>
            
            <p className="text-gray-300 text-sm my-2">{comment.content}</p>

            {/* Comment Actions */}
            <div className="flex items-center gap-4 text-xs">
              <button 
                onClick={() => toggleLike(comment._id)}
                className={`flex items-center gap-1 hover:text-papaya transition ${comment.likes.includes(user._id) ? 'text-papaya' : 'text-gray-500'}`}
              >
                <FaThumbsUp /> {comment.likes.length}
              </button>
              <button 
                onClick={() => toggleDislike(comment._id)}
                className={`flex items-center gap-1 hover:text-red-500 transition ${comment.dislikes.includes(user._id) ? 'text-red-500' : 'text-gray-500'}`}
              >
                <FaThumbsDown /> {comment.dislikes.length}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
