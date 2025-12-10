import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import PostItem from '../components/PostItem';
import { FaUserSecret, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Profile() {
  const { username } = useParams(); // Get username from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'library', 'network'
  const [requestSent, setRequestSent] = useState(false); // Track if follow request sent

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

  const handleFollowRequest = async () => {
    try {
      await api.post(`/api/social/follow/${profile._id}`);
      toast.success('Request transmitted successfully.');
      setRequestSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transmission failed');
    }
  };

  // Classified Overlay Component
  const ClassifiedOverlay = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-800 border-dashed">
      <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-4 text-gray-400">
        <FaLock className="text-2xl" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-2">
        Data Classified
      </h3>
      <p className="text-gray-500 max-w-sm text-center">
        You must be tracking this driver to view their telemetry and library data.
      </p>
    </div>
  );

  if (loading) return <div className="text-center mt-20 text-xl text-gray-400 animate-pulse">Loading Profile...</div>;
  if (!profile) return <div className="text-center mt-20 text-2xl text-red-400">User not found 😢</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* 1. Header Section */}
      <div className="bg-anthracite-light p-8 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row items-center gap-8 border border-gray-800 relative overflow-hidden">
        
        {/* The Orange Top Border Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-papaya to-red-600"></div>

        {/* Avatar Section */}
        <div className="w-24 h-24 bg-gradient-to-tr from-papaya to-red-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg z-10">
          {profile.username.charAt(0).toUpperCase()}
        </div>

        {/* Text Info */}
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-3xl font-bold text-white mb-2">@{profile.username}</h1>
          <p className="text-gray-400 text-sm mb-4 uppercase tracking-widest font-bold">
            Joined {new Date(profile.createdAt).getFullYear()}
          </p>

          {/* Stats Boxes */}
          <div className="flex justify-center md:justify-start gap-4">
            {[
              { label: 'Watched', value: profile.stats.watchedCount },
              { label: 'Audience', value: profile.stats.audienceCount },
              { label: 'Tracking', value: profile.stats.trackingCount },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-900 border border-gray-700 px-6 py-3 rounded text-center min-w-[100px]">
                <span className="block text-2xl font-bold text-papaya">{stat.value}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Request Access Button */}
        {profile.isPrivate && (
          <div className="mt-6 md:mt-0">
            <button 
              onClick={handleFollowRequest}
              disabled={requestSent}
              className={`px-8 py-3 rounded font-bold uppercase tracking-wider transition shadow-lg ${
                requestSent 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-papaya hover:bg-papaya-dark text-black'
              }`}
            >
              {requestSent ? 'Request Pending' : 'Request Access'}
            </button>
          </div>
        )}
      </div>

      {/* 2. Navigation Tabs (Sharp & Fast) */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 sticky top-[80px] bg-glacier dark:bg-carbon z-20">
        {['posts', 'library', 'network'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 font-bold uppercase tracking-wider text-sm transition-all relative ${
              activeTab === tab 
                ? 'text-papaya' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            {tab}
            {/* Active Indicator Line */}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-papaya"></span>
            )}
          </button>
        ))}
      </div>

      {/* 3. Content Sections */}
      
      {/* REVIEWS TAB */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {profile.isPrivate ? (
            <ClassifiedOverlay />
          ) : (
            profile.posts.length > 0 ? (
              profile.posts.map(post => (
                <PostItem key={post._id} post={post} />
              ))
            ) : (
              <div className="text-center py-10 bg-white dark:bg-anthracite-light rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-gray-400">No telemetry data available.</p>
              </div>
            )
          )}
        </div>
      )}

      {/* LIBRARY TAB (Unique Watched List) */}
      {activeTab === 'library' && (
        <div>
          {profile.isPrivate ? (
            <ClassifiedOverlay />
          ) : (
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
                <p className="col-span-full text-center py-10 text-gray-500 bg-white dark:bg-anthracite-light rounded-lg border border-gray-200 dark:border-gray-800">Library is empty.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* NETWORK TAB (Privacy Protected) */}
      {activeTab === 'network' && (
        <div className="bg-white dark:bg-anthracite-light p-6 rounded-lg border border-gray-200 dark:border-gray-800 min-h-[200px]">
          {profile.network ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Tracking List */}
              <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 flex justify-between">
                    <span>Tracking</span>
                    <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">{profile.stats.trackingCount}</span>
                </h3>
                <ul className="space-y-3">
                  {profile.network.tracking.map(u => (
                    <li key={u._id} className="flex items-center gap-3 group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 p-2 rounded transition">
                       <div className="w-8 h-8 bg-papaya rounded-full flex items-center justify-center text-xs font-bold text-black">
                           {u.username.charAt(0).toUpperCase()}
                       </div>
                       <a href={`/profile/${u.username}`} className="text-papaya-dark dark:text-papaya group-hover:text-papaya transition">
                           @{u.username}
                       </a>
                    </li>
                  ))}
                  {profile.network.tracking.length === 0 && <li className="text-gray-500 text-sm">Not tracking anyone.</li>}
                </ul>
              </div>

              {/* Audience List */}
              <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 flex justify-between">
                    <span>Audience</span>
                    <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">{profile.stats.audienceCount}</span>
                </h3>
                <ul className="space-y-3">
                  {profile.network.audience.map(u => (
                    <li key={u._id} className="flex items-center gap-3 group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 p-2 rounded transition">
                       <div className="w-8 h-8 bg-gradient-to-tr from-gray-700 to-black rounded-full flex items-center justify-center text-xs font-bold text-white">
                           {u.username.charAt(0).toUpperCase()}
                       </div>
                       <a href={`/profile/${u.username}`} className="text-gray-700 dark:text-gray-300 group-hover:text-papaya transition">
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
              <FaLock className="text-5xl text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider">Network Hidden</h3>
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
