import { useEffect, useState } from 'react';
import api from '../api';
import PostItem from '../components/PostItem';
import FeedAd from '../components/FeedAd';
import { FaStream } from 'react-icons/fa';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-papaya"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
        <FaStream className="text-papaya text-xl" />
        <h1 className="text-2xl font-bold text-white tracking-wide">Your Feed</h1>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={post._id}>
              {/* 1. Render the Post */}
              <PostItem post={post} />

              {/* 2. Inject Ad after every 5th post (index 4, 9, 14...) */}
              {(index + 1) % 5 === 0 && <FeedAd />}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-anthracite-light rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-2">No activity yet</h3>
            <p className="text-gray-400">Follow users to see their reviews here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
