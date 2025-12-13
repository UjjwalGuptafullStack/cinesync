import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // SECURITY: Read token from currentUser (already parsed at line 14)
        // NEVER write profile data back to localStorage - this would cause identity contamination
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        
        const response = await api.get(
          `/api/users/profile/${username}`,
          config
        );
        // CRITICAL: Only update local 'profile' state, never currentUser or localStorage
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

  // Private Content Overlay Component
  const PrivateOverlay = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-800 border-dashed">
      <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-4 text-gray-400">
        <FaLock className="text-2xl" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-2">
        Private Content
      </h3>
      <p className="text-gray-500 max-w-sm text-center">
        You must be following this user to view their posts and library.
      </p>
    </div>
  );

  if (loading) return <div className="text-center mt-20 text-xl text-gray-400 animate-pulse">Loading Profile...</div>;
  if (!profile) return <div className="text-center mt-20 text-2xl text-red-400">User not found 😢</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* 1. Header Dashboard */}
      <div className="bg-anthracite-light p-8 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row items-center gap-8 border border-gray-800 relative overflow-hidden">
        
        {/* The Orange Top Border Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-papaya to-red-600"></div>

        {/* Avatar Section - Large Circular Profile Picture */}
        {profile.userImage ? (
          <img 
            src={profile.userImage} 
            alt={profile.username}
            className="w-24 h-24 rounded-full object-cover border-4 border-papaya shadow-lg z-10"
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-tr from-papaya to-red-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg z-10 border-4 border-papaya">
            {profile.username.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Identity Section */}
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-3xl font-bold text-white mb-1">@{profile.username}</h1>
          <p className="text-gray-400 text-sm mb-4 uppercase tracking-widest font-semibold">
            {profile.role === 'production' && <span className="text-papaya font-bold mr-2">🎬 PRODUCTION HOUSE</span>}
            Joined {new Date(profile.createdAt).getFullYear()}
          </p>

          {/* Stats Boxes - Different for Production Houses */}
          <div className="flex justify-center md:justify-start gap-4 mb-4">
            {profile.role === 'production' ? (
              // Production House Stats
              [
                { label: 'Creations', value: profile.stats?.filmographyCount || 0 },
                { label: 'Engaged Fans', value: profile.stats?.engagedUsers || 0 },
              ].map((stat) => (
                <div key={stat.label} className="bg-anthracite border border-gray-700 px-6 py-3 rounded-lg text-center min-w-[120px] shadow">
                  <span className="block text-2xl font-bold text-papaya">{stat.value}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{stat.label}</span>
                </div>
              ))
            ) : (
              // Normal User Stats
              [
                { label: 'Watched', value: profile.stats.watchedCount },
                { label: 'Audience', value: profile.stats.audienceCount },
                { label: 'Tracking', value: profile.stats.trackingCount },
              ].map((stat) => (
                <div key={stat.label} className="bg-anthracite border border-gray-700 px-6 py-3 rounded-lg text-center min-w-[100px] shadow">
                  <span className="block text-2xl font-bold text-papaya">{stat.value}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{stat.label}</span>
                </div>
              ))
            )}
          </div>

          {/* Action Area */}
          <div className="flex gap-3 justify-center md:justify-start flex-wrap">
            {/* If viewing own profile */}
            {currentUser._id === profile._id && (
              <Link 
                to="/settings" 
                className="bg-papaya hover:bg-papaya-dark text-black font-bold text-sm py-2 px-6 rounded transition uppercase tracking-wide shadow-md"
              >
                Edit Profile
              </Link>
            )}

            {/* If viewing friend's profile - Hide Message for Production Houses */}
            {currentUser._id !== profile._id && profile.network && profile.role !== 'production' && (
              <Link 
                to={`/chat/${profile._id}`} 
                className="bg-anthracite hover:bg-papaya hover:text-black text-white font-bold py-2 px-6 rounded transition uppercase tracking-wide text-sm border-2 border-papaya shadow-md"
              >
                Send Message
              </Link>
            )}
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

      {/* 2. Standard Navigation Tabs */}
      <div className="flex border-b border-gray-800 mb-8 sticky top-16 bg-anthracite z-20">
        {['reviews', 'library', 'network'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab === 'reviews' ? 'posts' : tab)} // Map 'reviews' UI to 'posts' state logic
            className={`flex-1 py-4 font-bold uppercase tracking-wider text-sm transition-all border-b-2 ${
              (activeTab === tab || (tab === 'reviews' && activeTab === 'posts'))
                ? 'text-papaya border-papaya' 
                : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Content Sections */}
      
      {/* REVIEWS TAB */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {profile.isPrivate ? (
            <PrivateOverlay />
          ) : (
            profile.posts.length > 0 ? (
              profile.posts.map(post => (
                <PostItem key={post._id} post={post} />
              ))
            ) : (
              <div className="text-center py-10 bg-white dark:bg-anthracite-light rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-gray-400">No posts yet.</p>
              </div>
            )
          )}
        </div>
      )}

      {/* LIBRARY TAB (Unique Watched List or Filmography for Production Houses) */}
      {activeTab === 'library' && (
        <div>
          {profile.isPrivate ? (
            <PrivateOverlay />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {/* V8.0: Support both watchedList (users) and filmography (production houses) */}
              {((profile.role === 'production' ? profile.filmography : profile.watchedList) || []).length > 0 ? (
                (profile.role === 'production' ? profile.filmography : profile.watchedList).map(item => (
                  <Link 
                    key={item.tmdbId} 
                    to={`/hub/${item.tmdbId}`}
                    className="relative group block"
                  >
                    {item.poster ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w200${item.poster}`} 
                        alt={item.title}
                        className="rounded-lg shadow-md transition transform group-hover:scale-105 w-full h-auto object-cover aspect-[2/3]"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-700 rounded flex items-center justify-center aspect-[2/3]">🎬</div>
                    )}
                    {/* Hover Overlay - V8.0: Click to view Media Hub */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center rounded-lg p-2">
                      <span className="text-xs font-bold text-center text-white mb-2">{item.title}</span>
                      <span className="text-[10px] text-papaya uppercase tracking-widest">View Community</span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="col-span-full text-center py-10 text-gray-500 bg-white dark:bg-anthracite-light rounded-lg border border-gray-200 dark:border-gray-800">
                  {profile.role === 'production' ? 'No creations added yet.' : 'Library is empty.'}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* NETWORK TAB - V8.0: Different for Production Houses */}
      {activeTab === 'network' && (
        <div className="bg-white dark:bg-anthracite-light p-6 rounded-lg border border-gray-200 dark:border-gray-800 min-h-[200px]">
          {profile.role === 'production' ? (
            // PRODUCTION HOUSE: Show Engaged Users
            <div>
              <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 flex justify-between">
                <span>🔥 Engaged Fans</span>
                <span className="bg-papaya text-black text-xs px-3 py-1 rounded-full font-bold">{profile.network?.length || 0}</span>
              </h3>
              <p className="text-gray-500 text-sm mb-4">Users who have posted about your creations</p>
              <ul className="space-y-3">
                {(profile.network || []).map(u => (
                  <li key={u._id} className="flex items-center gap-3 group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 p-2 rounded transition">
                    {u.userImage ? (
                      <img 
                        src={u.userImage} 
                        alt={u.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-papaya"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-papaya rounded-full flex items-center justify-center text-sm font-bold text-black">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <a href={`/profile/${u.username}`} className="text-papaya-dark dark:text-papaya group-hover:text-papaya transition font-semibold">
                      @{u.username}
                    </a>
                  </li>
                ))}
                {(!profile.network || profile.network.length === 0) && (
                  <li className="text-gray-500 text-sm">No engaged fans yet.</li>
                )}
              </ul>
            </div>
          ) : (
            // NORMAL USER: Show Tracking & Audience
            profile.network ? (
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
                        {u.userImage ? (
                          <img 
                            src={u.userImage} 
                            alt={u.username}
                            className="w-8 h-8 rounded-full object-cover border border-papaya"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-papaya rounded-full flex items-center justify-center text-xs font-bold text-black">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                        )}
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
                        {u.userImage ? (
                          <img 
                            src={u.userImage} 
                            alt={u.username}
                            className="w-8 h-8 rounded-full object-cover border border-gray-600"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-tr from-gray-700 to-black rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                        )}
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
