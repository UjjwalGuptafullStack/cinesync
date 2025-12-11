import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { FaThumbsUp, FaThumbsDown, FaCommentAlt, FaUser, FaTrash } from 'react-icons/fa';
import CommentSection from './CommentSection';
import { toast } from 'react-hot-toast';

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
        dislikes: prev.dislikes.filter(id => id !== user._id) // Remove self from dislikes
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
        likes: prev.likes.filter(id => id !== user._id) // Remove self from likes
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this log entry?')) return;
    try {
      await api.delete(`/api/posts/${post._id}`);
      setIsDeleted(true);
      toast.success('Entry deleted.');
    } catch (error) {
      toast.error('Could not delete post.');
    }
  };

  if (isDeleted) return null;

  return (
    <div className="bg-anthracite-light border border-gray-800 rounded-xl overflow-hidden mb-8 shadow-xl">
      
      {/* 1. HEADER: User Info */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-gray-700 to-black rounded-full flex items-center justify-center text-white font-bold">
            {post.user?.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <Link to={`/profile/${post.user?.username}`} className="font-bold text-white hover:text-papaya transition">
              @{post.user?.username}
            </Link>
            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Context Tag (Movie Name) */}
          <div className="text-right">
            <h3 className="text-sm font-bold text-papaya truncate max-w-[150px]">{post.mediaTitle}</h3>
            {(post.season || post.episode) && (
               <span className="text-[10px] text-gray-400 font-mono">S{post.season} E{post.episode}</span>
            )}
          </div>
          
          {/* DELETE BUTTON (Only show if current user owns post) */}
          {user && (user._id === post.user?._id || user._id === post.user) && (
            <button 
              onClick={handleDelete}
              className="text-gray-600 hover:text-red-500 transition p-1"
              title="Delete Entry"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      {/* 2. VISUAL STAGE: User Image + Poster Overlay */}
      <div className="relative w-full bg-black min-h-[300px] flex items-center justify-center overflow-hidden bg-anthracite-dark">
        
        {/* DEBUG: Uncomment to see the URL on each post */}
        {/* <div className="absolute top-0 left-0 bg-red-500 text-white text-xs z-50 p-1">
          Debug URL: {post.userImage || 'No Image'}
        </div> */}

        {/* Main User Uploaded Image */}
        {post.userImage ? (
          <img 
            src={post.userImage} 
            alt="User upload" 
            className={`w-full h-auto max-h-[600px] object-contain ${post.isSpoiler && !isRevealed ? 'blur-2xl' : ''}`}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          // Fallback Layout if NO user image
          <div className="w-full py-20 flex flex-col items-center justify-center text-gray-700">
            <div className="text-4xl mb-2">📷</div>
            <span className="text-sm italic">No image attached</span>
          </div>
        )}

        {/* SPOILER OVERLAY */}
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

        {/* OVERLAY: The Movie Poster (Lower Right) */}
        {post.posterPath && (
          <div className="absolute bottom-4 right-4 w-24 shadow-2xl border-2 border-white/20 rounded overflow-hidden z-10 transform rotate-2 hover:rotate-0 transition duration-300 hover:scale-110">
            <img 
              src={`https://image.tmdb.org/t/p/w200${post.posterPath}`} 
              alt="Poster" 
              className="w-full h-auto"
            />
          </div>
        )}
      </div>

      {/* 3. CAPTION & ACTIONS */}
      <div className="p-5">
        
        {/* Typography Improved Message */}
        <div className="mb-4">
           {post.isSpoiler && !isRevealed ? (
             <p className="text-gray-600 italic text-sm">Caption hidden due to spoilers.</p>
           ) : (
             <p className="text-gray-200 text-lg leading-relaxed font-light whitespace-pre-wrap">
               {post.content}
             </p>
           )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-6 pt-4 border-t border-gray-800 text-gray-400">
           {/* Like/Dislike/Comment Buttons */}
           <button 
             onClick={toggleLike} 
             className={`flex items-center gap-2 hover:text-papaya transition ${post.likes.includes(user._id) ? 'text-papaya' : ''}`}
           >
             <FaThumbsUp className="text-xl" /> <span className="text-sm font-bold">{post.likes.length}</span>
           </button>
           
           <button 
             onClick={toggleDislike} 
             className={`flex items-center gap-2 hover:text-red-500 transition ${post.dislikes.includes(user._id) ? 'text-red-500' : ''}`}
           >
             <FaThumbsDown className="text-xl" /> <span className="text-sm font-bold">{post.dislikes.length}</span>
           </button>
           
           <button 
             onClick={() => setShowComments(!showComments)}
             className={`flex items-center gap-2 hover:text-white transition ${showComments ? 'text-white' : ''}`}
           >
             <FaCommentAlt className="text-xl" /> <span className="text-sm font-bold">Comments</span>
           </button>
        </div>

        {/* Comment Section Dropdown */}
        {showComments && <div className="mt-4"><CommentSection postId={post._id} /></div>}
      </div>

    </div>
  );
}

export default PostItem;
