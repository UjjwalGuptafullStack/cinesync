import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilm, FaUsers } from 'react-icons/fa';
import PostItem from '../components/PostItem';
import api from '../api';

function MediaHub() {
  const { tmdbId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ count: 0, posts: [] });
  const [loading, setLoading] = useState(true);
  const [mediaInfo, setMediaInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, [tmdbId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/posts/media/${tmdbId}`);
      setData(res.data);
      
      // Extract media info from first post if available
      if (res.data.posts.length > 0) {
        const firstPost = res.data.posts[0];
        setMediaInfo({
          title: firstPost.mediaTitle,
          poster: firstPost.posterPath,
          type: firstPost.mediaType,
        });
      }
    } catch (error) {
      console.error('Failed to fetch media hub:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4 pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-papaya mb-6 transition"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-papaya to-orange-500 text-black p-8 rounded-xl mb-8 shadow-2xl">
        <div className="flex items-center gap-6">
          {/* Media Poster */}
          {mediaInfo?.poster && (
            <img
              src={`https://image.tmdb.org/t/p/w185${mediaInfo.poster}`}
              alt={mediaInfo.title}
              className="w-24 h-36 rounded-lg shadow-lg hidden sm:block"
            />
          )}
          
          {/* Title & Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FaFilm className="text-2xl" />
              <h1 className="text-3xl font-bold">
                {mediaInfo?.title || 'Loading...'}
              </h1>
            </div>
            
            <p className="text-sm uppercase tracking-widest mb-4 opacity-80">
              {mediaInfo?.type === 'tv' ? 'TV Series' : 'Movie'} • Community Discussion
            </p>
            
            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg inline-flex">
              <FaUsers className="text-xl" />
              <span className="font-bold text-lg">{data.count}</span>
              <span className="text-sm">
                {data.count === 1 ? 'Post' : 'Posts'} about this title
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-papaya"></div>
          <p className="text-gray-400 mt-4">Loading discussions...</p>
        </div>
      ) : data.posts.length === 0 ? (
        <div className="text-center py-12 bg-anthracite-light rounded-xl border border-gray-800">
          <FaFilm className="text-6xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">No discussions yet</h3>
          <p className="text-gray-400">Be the first to post about this title!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.posts.map(post => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MediaHub;
