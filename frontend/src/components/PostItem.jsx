import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { FaThumbsUp, FaThumbsDown, FaCommentAlt } from 'react-icons/fa';
import CommentSection from './CommentSection';

function PostItem({ post: initialPost }) {
  const [post, setPost] = useState(initialPost);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  // --- Interaction Logic ---
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

  return (
    <div className="bg-anthracite-light border border-gray-800 rounded-lg overflow-hidden mb-6 shadow-lg">
      <div className="flex flex-col sm:flex-row">
        
        {/* Poster Strip */}
        <div className="sm:w-28 w-full bg-black flex-shrink-0 relative overflow-hidden">
          {post.posterPath ? (
            <img
              src={`https://image.tmdb.org/t/p/w200${post.posterPath}`}
              alt={post.mediaTitle}
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition"
            />
          ) : (
            <div className="w-full h-32 sm:h-full flex items-center justify-center text-3xl">🎬</div>
          )}
        </div>

        {/* Content Sector */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          
          {/* Header */}
          <div className="mb-3">
             <div className="flex justify-between items-start">
               <h3 className="text-xl font-bold text-papaya leading-tight">{post.mediaTitle}</h3>
               {post.season && (
                 <span className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 rounded">S{post.season} E{post.episode}</span>
               )}
             </div>
             
             <div className="text-xs text-gray-400 mt-1">
               Review by <Link to={`/profile/${post.user?.username}`} className="text-white font-bold hover:underline">@{post.user?.username}</Link>
             </div>
          </div>

          {/* Review Text */}
          <div className="text-gray-300 leading-relaxed text-sm mb-4">
            {post.isSpoiler && !isRevealed ? (
              // --- FIXED SPOILER UI (Simple) ---
              <button 
                onClick={() => setIsRevealed(true)}
                className="w-full text-left bg-gray-800 hover:bg-gray-700 p-3 rounded border-l-4 border-red-500 transition"
              >
                <span className="text-red-500 font-bold uppercase text-xs tracking-widest block mb-1">Spoiler Warning</span>
                <span className="text-gray-400 text-sm">This post contains spoilers. Click to reveal.</span>
              </button>
            ) : (
              <p className="whitespace-pre-wrap">{post.content}</p>
            )}
          </div>

          {/* Interaction Bar */}
          <div className="flex items-center gap-6 pt-3 border-t border-gray-800">
            {/* LIKE */}
            <button 
              onClick={toggleLike}
              className={`flex items-center gap-2 transition ${post.likes.includes(user._id) ? 'text-papaya font-bold' : 'text-gray-500 hover:text-white'}`}
            >
              <FaThumbsUp /> <span>{post.likes.length}</span>
            </button>

            {/* DISLIKE */}
            <button 
              onClick={toggleDislike}
              className={`flex items-center gap-2 transition ${post.dislikes.includes(user._id) ? 'text-red-500 font-bold' : 'text-gray-500 hover:text-white'}`}
            >
              <FaThumbsDown /> <span>{post.dislikes.length}</span>
            </button>

            {/* COMMENT TOGGLE */}
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 transition ${showComments ? 'text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <FaCommentAlt /> <span>Comments</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comment Section (Hidden by default) */}
      {showComments && (
        <div className="px-5 pb-5">
           <CommentSection postId={post._id} />
        </div>
      )}
    </div>
  );
}

export default PostItem;
