import { useState } from 'react';

function PostItem({ post }) {
  // Each post tracks its own "isRevealed" state
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition flex flex-col sm:flex-row">
      {/* Poster Section */}
      <div className="sm:w-32 flex-shrink-0">
        {post.posterPath ? (
          <img
            src={`https://image.tmdb.org/t/p/w200${post.posterPath}`}
            alt={post.mediaTitle}
            className="w-full h-48 sm:h-full object-cover"
          />
        ) : (
          <div className="w-full h-48 sm:h-full bg-gray-700 flex items-center justify-center text-4xl">
            🎬
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col">
        {/* HEADER: User + Date + Context */}
        <div className="mb-4 border-b border-gray-700 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-400">
              <span className="text-blue-400 font-semibold">@{post.user?.username || 'Unknown'}</span> watched
            </span>
            {post.isSpoiler && (
              <span className="bg-red-600 text-xs text-white px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                Spoiler
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white">{post.mediaTitle}</h3>
          {(post.season || post.episode) && (
            <p className="text-xs text-gray-500 mt-1">
              {post.season && `Season ${post.season}`} {post.episode && `Ep ${post.episode}`}
            </p>
          )}
        </div>

        {/* BODY: Content / Spoiler Logic */}
        <div className="flex-1 text-gray-300">
          {post.isSpoiler && !isRevealed ? (
            <button 
              onClick={() => setIsRevealed(true)}
              className="w-full bg-gray-900/50 border-2 border-dashed border-gray-600 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-700/30 hover:border-red-500 transition flex flex-col items-center gap-2 group"
            >
              <span className="text-red-400 font-bold group-hover:text-red-300">⚠️ Spoiler Warning</span>
              <span className="text-xs text-gray-400 group-hover:text-gray-300">Click to reveal</span>
            </button>
          ) : (
            <p className={`whitespace-pre-wrap leading-relaxed ${post.isSpoiler ? 'text-gray-100 bg-gray-700/30 p-4 rounded-lg' : ''}`}>
              {post.content}
            </p>
          )}
        </div>

        {/* FOOTER: Date + Hide Button */}
        <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500 flex justify-between items-center">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {post.isSpoiler && isRevealed && (
            <button 
              onClick={() => setIsRevealed(false)}
              className="text-gray-500 hover:text-gray-300 underline"
            >
              Hide Spoiler
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostItem;
