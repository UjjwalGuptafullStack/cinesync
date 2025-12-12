import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { FaThumbsUp, FaThumbsDown, FaCommentAlt, FaTrash } from 'react-icons/fa';
import CommentSection from './CommentSection';
import { toast } from 'react-toastify';

function PostItem({ post: initialPost }) {
  const [post, setPost] = useState(initialPost);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const toggleLike = async () => {
    try {
      const res = await api.put(`/api/posts/${post._id}/like`);
      setPost(prev => ({
        ...prev,
        likes: res.data,
        dislikes: prev.dislikes.filter(id => id !== user._id)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDislike = async () => {
    try {
      const res = await api.put(`/api/posts/${post._id}/dislike`);
      setPost(prev => ({
        ...prev,
        dislikes: res.data,
        likes: prev.likes.filter(id => id !== user._id)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/api/posts/${post._id}`);
      setIsDeleted(true);
      toast.success('Post deleted.');
    } catch (error) {
      toast.error('Could not delete post.');
    }
  };

  if (isDeleted) return null;

  return (
    <div className="bg-anthracite-light border border-gray-800 rounded-xl overflow-hidden mb-6 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          {post.user?.userImage ? (
            <img 
              src={post.user.userImage} 
              alt={post.user?.username}
              className="w-10 h-10 rounded-full object-cover border border-gray-600"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {post.user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <Link to={`/profile/${post.user?.username}`} className="font-bold text-white hover:text-papaya transition">
              @{post.user?.username}
            </Link>
            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="bg-papaya text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {post.mediaTitle}
            </span>
            {(post.season || post.episode) && (
              <p className="text-[10px] text-gray-400 font-mono mt-1">S{post.season} E{post.episode}</p>
            )}
          </div>
          {user && (user._id === post.user?._id || user._id === post.user) && (
            <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition">
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      {/* Image Section */}
      <div className="relative w-full bg-black min-h-[300px] flex items-center justify-center overflow-hidden bg-anthracite-dark">
        {post.userImage ? (
          <img 
            src={post.userImage} 
            alt="User upload" 
            className={`w-full h-auto max-h-[600px] object-contain ${post.isSpoiler && !isRevealed ? 'blur-2xl' : ''}`}
          />
        ) : (
          <div className="w-full py-20 flex flex-col items-center justify-center text-gray-700">
             <div className="text-4xl mb-2">📷</div>
             <span className="text-sm italic">No image attached</span>
          </div>
        )}

        {post.isSpoiler && !isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <button 
              onClick={() => setIsRevealed(true)}
              className="bg-black/80 border border-papaya text-papaya px-6 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-papaya hover:text-black transition"
            >
              Reveal Spoiler
            </button>
          </div>
        )}

        {post.posterPath && (
          <div className="absolute bottom-4 right-4 w-24 shadow-2xl border-2 border-white/20 rounded overflow-hidden z-10">
            <img 
              src={`https://image.tmdb.org/t/p/w200${post.posterPath}`} 
              alt="Poster" 
              className="w-full h-auto"
            />
          </div>
        )}
      </div>

      {/* Content & Actions */}
      <div className="p-4">
        <div className="mb-4">
           {post.isSpoiler && !isRevealed ? (
             <p className="text-gray-600 italic text-sm">Caption hidden due to spoilers.</p>
           ) : (
             <p className="text-gray-200 text-lg leading-relaxed font-light whitespace-pre-wrap">
               {post.content}
             </p>
           )}
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-gray-800 text-gray-400">
           <button onClick={toggleLike} className={`flex items-center gap-2 hover:text-papaya transition ${post.likes.includes(user._id) ? 'text-papaya' : ''}`}>
             <FaThumbsUp className="text-xl" /> <span className="text-sm font-bold">{post.likes.length}</span>
           </button>
           <button onClick={toggleDislike} className={`flex items-center gap-2 hover:text-red-500 transition ${post.dislikes.includes(user._id) ? 'text-red-500' : ''}`}>
             <FaThumbsDown className="text-xl" /> <span className="text-sm font-bold">{post.dislikes.length}</span>
           </button>
           <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 hover:text-papaya transition ${showComments ? 'text-papaya' : ''}`}>
             <FaCommentAlt className="text-xl" /> <span className="text-sm font-bold">Comments</span>
           </button>
        </div>

        {showComments && <div className="mt-4"><CommentSection postId={post._id} /></div>}
      </div>
    </div>
  );
}

export default PostItem;
