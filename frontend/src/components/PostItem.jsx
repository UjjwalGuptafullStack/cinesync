import { useState } from 'react';
import { Link } from 'react-router-dom';

function PostItem({ post }) {
  // Each post tracks its own "isRevealed" state
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="group relative bg-white dark:bg-anthracite-light border border-gray-200 dark:border-gray-800 border-l-4 border-l-transparent hover:border-l-papaya transition-all duration-300 rounded-r-lg shadow-sm overflow-hidden mb-4">
      
      <div className="flex sm:flex-row flex-col">
        
        {/* 1. Poster Strip (Narrower, sleeker) */}
        <div className="sm:w-28 w-full bg-black flex-shrink-0 relative overflow-hidden">
          {post.posterPath ? (
            <img
              src={`https://image.tmdb.org/t/p/w200${post.posterPath}`}
              alt={post.mediaTitle}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500 scale-100 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-32 sm:h-full flex items-center justify-center text-3xl">🎬</div>
          )}
        </div>

        {/* 2. Data Sector */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          
          {/* Header: Driver Info & Lap Data */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <Link to={`/profile/${post.user?.username}`} className="hover:text-papaya transition">
                  @{post.user?.username}
                </Link>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              
              <h3 className="text-xl font-bold text-papaya mt-1 transition-colors">
                {post.mediaTitle}
              </h3>
              
              {/* Telemetry Tags */}
              {(post.season || post.episode) && (
                <div className="flex gap-2 mt-2">
                  {post.season && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-xs font-mono rounded text-gray-600 dark:text-gray-300">
                      S{post.season}
                    </span>
                  )}
                  {post.episode && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-xs font-mono rounded text-gray-600 dark:text-gray-300">
                      EP{post.episode}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Status Flag */}
            {post.isSpoiler && (
              <span className="flex items-center gap-1 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] uppercase font-bold px-2 py-1 rounded tracking-widest">
                Spoiler
              </span>
            )}
          </div>

          {/* Content Sector */}
          <div className="text-gray-300 leading-relaxed text-sm mt-3">
            {post.isSpoiler && !isRevealed ? (
              <button 
                onClick={() => setIsRevealed(true)}
                className="w-full text-left bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-black/40 p-3 rounded border border-gray-200 dark:border-gray-700 border-dashed transition group/spoiler"
              >
                <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 group-hover/spoiler:text-papaya">
                   ⚠️ Classified Data. <span className="underline decoration-papaya underline-offset-4">Decrypt.</span>
                </span>
              </button>
            ) : (
              <p className="whitespace-pre-wrap font-normal">{post.content}</p>
            )}
          </div>

          {/* Footer Actions */}
          {post.isSpoiler && isRevealed && (
               <button onClick={() => setIsRevealed(false)} className="text-xs text-gray-400 hover:text-white mt-3 self-start uppercase font-bold tracking-wider">
                 Hide Data
               </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostItem;
