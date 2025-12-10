import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import PostItem from '../components/PostItem';
import { FaUserSecret, FaLock } from 'react-icons/fa';

function Profile() {
  const { username } = useParams(); // Get username from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'library', 'network'

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        const response = await api.get(
          `/api/users/profile/${username}`,
          config
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]); // Re-run if username changes

  if (loading) return <div className="text-center mt-20 text-xl text-gray-400 animate-pulse">Loading Profile...</div>;
  if (!profile) return <div className="text-center mt-20 text-2xl text-red-400">User not found 😢</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* 1. Header Section */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row items-center gap-8 border border-gray-700">
        {/* Avatar */}
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
          {profile.username.charAt(0).toUpperCase()}
        </div>

        {/* Stats & Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">@{profile.username}</h1>
          <p className="text-gray-400 text-sm mb-4">Joined {new Date(profile.createdAt).toLocaleDateString()}</p>
          
          <div className="flex justify-center md:justify-start gap-8">
            <div className="text-center p-2 rounded hover:bg-gray-700/50 transition">
              <span className="block text-2xl font-bold text-white">{profile.stats.watchedCount}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Watched</span>
            </div>
            <div className="text-center p-2 rounded hover:bg-gray-700/50 transition">
              <span className="block text-2xl font-bold text-white">{profile.stats.audienceCount}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Audience</span>
            </div>
            <div className="text-center p-2 rounded hover:bg-gray-700/50 transition">
              <span className="block text-2xl font-bold text-white">{profile.stats.trackingCount}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-gray-700 mb-6 sticky top-[80px] bg-gray-900 z-10">
        <button 
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-4 font-bold transition border-b-2 ${activeTab === 'posts' ? 'text-blue-500 border-blue-500' : 'text-gray-400 border-transparent hover:text-gray-200'}`}
        >
          Reviews
        </button>
        <button 
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-4 font-bold transition border-b-2 ${activeTab === 'library' ? 'text-blue-500 border-blue-500' : 'text-gray-400 border-transparent hover:text-gray-200'}`}
        >
          Library
        </button>
        <button 
          onClick={() => setActiveTab('network')}
          className={`flex-1 py-4 font-bold transition border-b-2 ${activeTab === 'network' ? 'text-blue-500 border-blue-500' : 'text-gray-400 border-transparent hover:text-gray-200'}`}
        >
          Network
        </button>
      </div>

      {/* 3. Content Sections */}
      
      {/* REVIEWS TAB */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {profile.posts.length > 0 ? (
            profile.posts.map(post => (
              <PostItem key={post._id} post={post} />
            ))
          ) : (
            <div className="text-center py-10 bg-gray-800 rounded-lg">
              <p className="text-gray-400">User hasn't posted any reviews yet.</p>
            </div>
          )}
        </div>
      )}

      {/* LIBRARY TAB (Unique Watched List) */}
      {activeTab === 'library' && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {profile.watchedList.length > 0 ? (
            profile.watchedList.map(item => (
              <div key={item.tmdbId} className="relative group">
                 {item.poster ? (
                   <img 
                     src={`https://image.tmdb.org/t/p/w200${item.poster}`} 
                     alt={item.title}
                     className="rounded-lg shadow-md transition transform group-hover:scale-105 w-full h-auto object-cover aspect-[2/3]"
                   />
                 ) : (
                   <div className="h-full w-full bg-gray-700 rounded flex items-center justify-center aspect-[2/3]">🎬</div>
                 )}
                 {/* Hover Overlay */}
                 <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg p-2">
                   <span className="text-xs font-bold text-center text-white">{item.title}</span>
                 </div>
              </div>
            ))
          ) : (
             <p className="col-span-full text-center py-10 text-gray-500 bg-gray-800 rounded-lg">Library is empty.</p>
          )}
        </div>
      )}

      {/* NETWORK TAB (Privacy Protected) */}
      {activeTab === 'network' && (
        <div className="bg-gray-800 p-6 rounded-lg min-h-[200px]">
          {profile.network ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Tracking List */}
              <div>
                <h3 className="font-bold text-gray-300 mb-4 border-b border-gray-700 pb-2 flex justify-between">
                    <span>Tracking</span>
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">{profile.stats.trackingCount}</span>
                </h3>
                <ul className="space-y-3">
                  {profile.network.tracking.map(u => (
                    <li key={u._id} className="flex items-center gap-3 group cursor-pointer hover:bg-gray-700 p-2 rounded transition">
                       <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                           {u.username.charAt(0).toUpperCase()}
                       </div>
                       <a href={`/profile/${u.username}`} className="text-blue-400 group-hover:text-white transition">
                           @{u.username}
                       </a>
                    </li>
                  ))}
                  {profile.network.tracking.length === 0 && <li className="text-gray-500 text-sm">Not tracking anyone.</li>}
                </ul>
              </div>

              {/* Audience List */}
              <div>
                <h3 className="font-bold text-gray-300 mb-4 border-b border-gray-700 pb-2 flex justify-between">
                    <span>Audience</span>
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">{profile.stats.audienceCount}</span>
                </h3>
                <ul className="space-y-3">
                  {profile.network.audience.map(u => (
                    <li key={u._id} className="flex items-center gap-3 group cursor-pointer hover:bg-gray-700 p-2 rounded transition">
                       <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                           {u.username.charAt(0).toUpperCase()}
                       </div>
                       <a href={`/profile/${u.username}`} className="text-purple-400 group-hover:text-white transition">
                           @{u.username}
                       </a>
                    </li>
                  ))}
                  {profile.network.audience.length === 0 && <li className="text-gray-500 text-sm">No audience yet.</li>}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center">
              <FaLock className="text-5xl text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">Network Hidden</h3>
              <p className="text-gray-500 mt-2 max-w-sm">
                @{profile.username}'s network is private. You can only view it if they are tracking you.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
