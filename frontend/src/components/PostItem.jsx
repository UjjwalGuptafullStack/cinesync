import { useState } from 'react';

function PostItem({ post }) {
  // Each post tracks its own "isRevealed" state
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex gap-4">
      {/* Left: Poster */}
      <div className="flex-shrink-0">
        {post.posterPath ? (
          <img
            src={`https://image.tmdb.org/t/p/w200${post.posterPath}`}
            alt={post.mediaTitle}
            className="w-24 h-36 object-cover rounded"
          />
        ) : (
          <div className="w-24 h-36 bg-gray-700 rounded flex items-center justify-center text-2xl">
            🎬
          </div>
        )}
      </div>

      {/* Right: Content */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">{post.mediaTitle}</h2>
            <p className="text-sm text-gray-400">
              Watched by <span className="text-blue-400">@{post.user?.username || 'Unknown'}</span>
            </p>
          </div>
          {post.isSpoiler && (
            <span className="bg-red-600 text-xs text-white px-2 py-1 rounded uppercase font-bold tracking-wider">
              Spoiler
            </span>
          )}
        </div>

        <div className="mt-4 text-gray-300">
          {/* THE LOGIC: If it's a spoiler AND not revealed yet, show button. Else, show text. */}
          {post.isSpoiler && !isRevealed ? (
            <button 
              onClick={() => setIsRevealed(true)}
              className="w-full bg-gray-700 p-3 rounded text-center cursor-pointer hover:bg-gray-600 border border-gray-600 transition flex flex-col items-center gap-2 group"
            >
              <span className="text-red-400 font-bold group-hover:text-red-300">⚠️ Spoiler Warning</span>
              <span className="text-xs text-gray-400">Click to reveal {post.user?.username}'s thoughts</span>
            </button>
          ) : (
            <p className={`whitespace-pre-wrap ${post.isSpoiler ? 'text-gray-100 bg-gray-700/50 p-3 rounded' : ''}`}>
              {post.content}
            </p>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-500 flex justify-between">
          <span>Posted on {new Date(post.createdAt).toLocaleDateString()}</span>
          {/* If it was a spoiler and is now revealed, allow hiding it again */}
          {post.isSpoiler && isRevealed && (
            <button 
                onClick={() => setIsRevealed(false)}
                className="text-gray-500 hover:text-gray-300"
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
