import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PostItem from '../components/PostItem';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('http://localhost:5000/api/posts', config);
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
    return <div className="text-center mt-20 text-2xl animate-pulse">Loading Feed... 🍿</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Global Feed 🌎</h1>
        <Link to="/create" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition">
          + Log Entry
        </Link>
      </div>

      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))
        ) : (
          <p className="text-center text-gray-400 mt-10">No posts yet. Be the first to share!</p>
        )}
      </div>
    </div>
  );
}

export default Home;
