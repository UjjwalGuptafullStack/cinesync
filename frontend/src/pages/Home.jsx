import { useEffect, useState } from 'react';
import api from '../api';
import PostItem from '../components/PostItem';
import FeedAd from '../components/FeedAd';
import CreatePost from './CreatePost';
import { FaStream, FaPlusCircle, FaTimes } from 'react-icons/fa';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

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
    <div className="w-full">
      {/* Mobile View - Modal for Create Post */}
      {showCreatePost && (
        <div className="lg:hidden fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen p-4">
            <div className="bg-anthracite-light rounded-lg">
              <div className="sticky top-0 bg-anthracite-light p-4 border-b border-gray-800 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-white">Create Post</h2>
                <button 
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>
              <div className="p-4">
                <CreatePost onPostCreated={() => setShowCreatePost(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Two-Column Layout */}
      <div className="hidden lg:flex gap-6 max-w-7xl mx-auto">
        {/* Left Column - Feed */}
        <div className={`transition-all duration-300 ${showCreatePost ? 'w-1/2' : 'w-full max-w-2xl mx-auto'}`}>
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
                  <PostItem post={post} />
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

        {/* Right Column - Create Post Button / Form */}
        <div className={`transition-all duration-300 ${showCreatePost ? 'w-1/2' : 'w-auto'}`}>
          {!showCreatePost ? (
            <div className="sticky top-20">
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex flex-col items-center justify-center gap-3 bg-papaya hover:bg-papaya-dark text-black font-bold p-6 rounded-xl transition shadow-lg group"
              >
                <FaPlusCircle className="text-4xl group-hover:scale-110 transition-transform" />
                <span className="text-lg uppercase tracking-wider">Create Post</span>
              </button>
            </div>
          ) : (
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="bg-anthracite-light rounded-lg border border-gray-800 shadow-lg">
                <div className="sticky top-0 bg-anthracite-light p-4 border-b border-gray-800 flex justify-between items-center z-10">
                  <h2 className="text-xl font-bold text-white">Create Post</h2>
                  <button 
                    onClick={() => setShowCreatePost(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <FaTimes className="text-2xl" />
                  </button>
                </div>
                <div className="p-4">
                  <CreatePost onPostCreated={() => setShowCreatePost(false)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Feed View with Floating Action Button */}
      <div className="lg:hidden max-w-2xl mx-auto">
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
                <PostItem post={post} />
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

        {/* Floating Action Button - Mobile */}
        <button
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-6 right-6 bg-papaya hover:bg-papaya-dark text-black font-bold p-4 rounded-full shadow-2xl transition transform hover:scale-110 z-40"
        >
          <FaPlusCircle className="text-3xl" />
        </button>
      </div>
    </div>
  );
}

export default Home;
