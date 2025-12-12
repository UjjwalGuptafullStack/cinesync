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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-anthracite-light border border-gray-800 rounded-xl overflow-hidden mb-6 shadow-lg">
      
      {/* 1. HEADER SECTION */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden">
            {post.user?.userImage ? (
              <img src={post.user.userImage} alt={post.user.username} className="w-full h-full object-cover" />
            ) : (
              post.user?.username.charAt(0).toUpperCase()
            )}
          </div>
          
          {/* User Info */}
          <div>
            <Link to={`/profile/${post.user?.username}`} className="font-bold text-white hover:text-papaya transition text-sm md:text-base">
              @{post.user?.username}
            </Link>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Right Side: Movie Tag & Delete */}
        <div className="flex items-center gap-3">
          <span className="bg-papaya text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider truncate max-w-[120px] md:max-w-none">
            {post.mediaTitle}
          </span>
          {user && user._id === post.user._id && (
            <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition p-1">
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      {/* 2. IMAGE SECTION (The Big Stage) */}
      <div className="relative w-full bg-black flex items-center justify-center overflow-hidden bg-anthracite-dark group">
        {/* Main User Image */}
        {post.userImage ? (
          <img 
            src={post.userImage} 
            alt="User upload" 
            className={`w-full h-auto object-cover min-h-[300px] md:min-h-[400px] max-h-[600px] ${post.isSpoiler && !isRevealed ? 'blur-2xl scale-110' : ''} transition-all duration-500`}
          />
        ) : (
          // Fallback for no image
          <div className="w-full py-32 flex flex-col items-center justify-center text-gray-700 bg-anthracite-dark/50">
             <div className="text-5xl mb-4 opacity-50">📷</div>
             <span className="text-sm italic opacity-70">No image attached</span>
          </div>
        )}

        {/* Spoiler Curtain */}
        {post.isSpoiler && !isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm transition-all">
            <button 
              onClick={() => setIsRevealed(true)}
              className="bg-black/80 border border-papaya text-papaya px-6 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-papaya hover:text-black transition transform hover:scale-105 shadow-lg"
            >
              Reveal Spoiler
            </button>
          </div>
        )}

        {/* Movie Poster Overlay (Bottom Right) */}
        {post.posterPath && (
          <div className="absolute bottom-4 right-4 w-20 md:w-24 shadow-2xl border-2 border-white/20 rounded-lg overflow-hidden z-10 transform rotate-3 group-hover:rotate-0 group-hover:scale-105 transition duration-500 ease-out">
            <img 
              src={`https://image.tmdb.org/t/p/w200${post.posterPath}`} 
              alt="Poster" 
              className="w-full h-auto"
            />
          </div>
        )}
      </div>

      {/* 3. CONTENT & ACTIONS SECTION */}
      <div className="p-4 bg-anthracite-light">
        {/* Caption */}
        <div className="mb-4">
           {post.isSpoiler && !isRevealed ? (
             <p className="text-gray-600 italic text-sm pl-4 border-l-2 border-papaya">Caption hidden due to spoilers.</p>
           ) : (
             <p className="text-gray-200 text-sm md:text-base leading-relaxed font-light whitespace-pre-wrap">
               {post.content}
             </p>
           )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-6 pt-4 border-t border-gray-800 text-gray-400">
           <button 
             onClick={toggleLike} 
             className={`flex items-center gap-2 hover:text-papaya transition group ${post.likes.includes(user?._id) ? 'text-papaya' : ''}`}
           >
             <FaThumbsUp className="text-lg group-hover:scale-110 transition" /> 
             <span className="text-sm font-bold">{post.likes.length}</span>
           </button>

           <button 
             onClick={toggleDislike} 
             className={`flex items-center gap-2 hover:text-red-500 transition group ${post.dislikes.includes(user?._id) ? 'text-red-500' : ''}`}
           >
             <FaThumbsDown className="text-lg group-hover:scale-110 transition mt-1" /> 
             <span className="text-sm font-bold">{post.dislikes.length}</span>
           </button>

           <button 
             onClick={() => setShowComments(!showComments)} 
             className={`flex items-center gap-2 hover:text-papaya transition group ${showComments ? 'text-papaya' : ''}`}
           >
             <FaCommentAlt className="text-lg group-hover:scale-110 transition" /> 
             <span className="text-sm font-bold">Comments</span>
           </button>
        </div>

        {/* Comments Dropdown */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-800/50 animate-in fade-in slide-in-from-top-2 duration-300">
            <CommentSection postId={post._id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PostItem;
