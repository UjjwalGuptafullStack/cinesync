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

  // Helper to get high-res poster
  const getPosterUrl = (path, size = 'w780') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  return (
    <div className="bg-anthracite-light border border-gray-800 rounded-xl overflow-hidden mb-6 shadow-lg">
      
      {/* 1. HEADER SECTION - Context Aware */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Link to={`/profile/${post.user?.username}`}>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden">
              {post.user?.userImage ? (
                <img src={post.user.userImage} alt={post.user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-papaya to-red-600">
                  {post.user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </Link>
          
          {/* User Info */}
          <div>
            <Link to={`/profile/${post.user?.username}`} className="font-bold text-white hover:text-papaya transition text-sm md:text-base">
              @{post.user?.username}
            </Link>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Right Side: Title Tag + Context Tag + Delete */}
        <div className="flex items-center gap-2">
          {/* Main Title Tag */}
          <span className="bg-papaya text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider truncate max-w-[120px] md:max-w-[150px]">
            {post.mediaTitle}
          </span>

          {/* NEW: Specific Context Tag (Season/Episode) */}
          {post.season && (
            <span className="bg-gray-700 text-gray-200 text-xs font-bold px-2 py-1 rounded-full border border-gray-600 whitespace-nowrap">
              {post.episode ? `S${post.season} E${post.episode}` : `Season ${post.season}`}
            </span>
          )}

          {/* Delete Button (Owner Only) */}
          {user && user._id === post.user._id && (
            <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition p-1">
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN IMAGE STAGE - Smart Switch */}
      <div className="relative w-full bg-black flex items-center justify-center overflow-hidden bg-anthracite-dark group min-h-[300px]">
        
        {post.userImage ? (
          // SCENARIO A: User uploaded a photo
          <>
            <img 
              src={post.userImage} 
              alt="User upload" 
              className={`w-full h-auto object-cover max-h-[600px] ${post.isSpoiler && !isRevealed ? 'blur-2xl scale-110' : ''} transition-all duration-500`}
            />
            
            {/* Show Mini Poster Overlay (Only if user uploaded their own image) */}
            {post.posterPath && (
              <div className="absolute bottom-4 right-4 w-20 md:w-24 shadow-2xl border-2 border-white/20 rounded-lg overflow-hidden z-10 transform rotate-3 group-hover:rotate-0 group-hover:scale-105 transition duration-500 ease-out">
                <img src={getPosterUrl(post.posterPath, 'w200')} alt="Poster" className="w-full h-auto" />
              </div>
            )}
          </>
        ) : (
          // SCENARIO B: No User Image -> Show Official Poster as Main Content
          <div className="w-full bg-gradient-to-b from-anthracite-dark to-black py-8 flex justify-center items-center">
            {post.posterPath ? (
              <img 
                src={getPosterUrl(post.posterPath, 'w780')} 
                alt="Official Poster" 
                className={`rounded-lg shadow-2xl max-h-[500px] w-auto border border-gray-800 ${post.isSpoiler && !isRevealed ? 'blur-xl' : ''}`}
              />
            ) : (
              // Absolute fallback if API fails
              <div className="text-gray-600 py-20 italic text-center">
                <div className="text-5xl mb-4 opacity-50">📷</div>
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>
        )}

        {/* Spoiler Curtain (Works for both scenarios) */}
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
