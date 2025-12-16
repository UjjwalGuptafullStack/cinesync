import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaComments, FaFilm, FaHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../api';

function Landing() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real content to satisfy Google AdSense "Valuable Inventory" policy
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Only run this if you have created the endpoint, otherwise it fails gracefully
        const res = await api.get('/api/posts/trending'); 
        setTrending(res.data);
      } catch (error) {
        // If endpoint doesn't exist yet, we just show nothing or a static fallback
        console.log('Trending fetch skipped or failed (Normal for new setups)');
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-anthracite via-anthracite-light to-anthracite text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <div className="container mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Copy */}
          <div className="flex-1 text-center lg:text-left z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Track Your <span className="text-papaya">Binge Journey.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              CineSync is the social home for your watch history. Post about what you're watching, discuss spoilers safely with blurred tags, and build your personal library of movies and shows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register" className="bg-papaya text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 hover:scale-105 transition shadow-[0_0_20px_rgba(255,135,0,0.3)]">
                Join the Community
              </Link>
              <Link to="/login" className="border border-gray-600 bg-anthracite-light text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition">
                Log In
              </Link>
            </div>
          </div>

          {/* Right Side: Phone Mockup */}
          <div className="hidden lg:flex relative justify-center perspective-1000">
            
            {/* The Phone Frame */}
            <div className="relative border-[14px] border-gray-900 rounded-[3rem] h-[600px] w-[300px] bg-black shadow-2xl overflow-hidden z-10 transform rotate-[-5deg] hover:rotate-0 transition duration-500 ease-out">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-gray-900 rounded-b-xl z-20"></div>
              
              {/* Screen Content - Grid of Posters */}
              <div className="grid grid-cols-2 gap-1 p-2 mt-8 h-full bg-anthracite opacity-90">
                <img src="https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" className="rounded-lg w-full h-48 object-cover" alt="Batman" />
                <img src="https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" className="rounded-lg w-full h-48 object-cover" alt="Oppenheimer" />
                <img src="https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg" className="rounded-lg w-full h-48 object-cover" alt="Barbie" />
                <img src="https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" className="rounded-lg w-full h-48 object-cover" alt="Interstellar" />
                {/* FIXED: Replaced broken "Rush" link with "The Matrix" */}
                <img src="https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" className="rounded-lg w-full h-48 object-cover" alt="The Matrix" />
                <img src="https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg" className="rounded-lg w-full h-48 object-cover" alt="Arrival" />
              </div>
            </div>

            {/* FIXED: Floating Icons (Positioned Further Out & Better Colors) */}
            
            {/* Icon 1: Top Left - Star (Rating) */}
            <div className="absolute top-24 -left-12 bg-gray-800 p-4 rounded-2xl shadow-xl z-20 animate-bounce delay-100 border border-gray-700">
              <FaStar className="text-2xl text-papaya" />
            </div>

            {/* Icon 2: Bottom Right - Chat (Social) */}
            <div className="absolute bottom-32 -right-12 bg-papaya p-4 rounded-2xl shadow-xl z-20 animate-bounce delay-300 border border-orange-500">
              <FaComments className="text-2xl text-black" />
            </div>

            {/* Icon 3: Middle Right - Like (Reaction) - Optional extra floater */}
            <div className="absolute top-1/2 -right-16 bg-white p-3 rounded-full shadow-lg z-0 opacity-80 animate-pulse">
              <FaHeart className="text-xl text-red-500" />
            </div>

          </div>
        </div>
      </div>

      {/* 2. FEATURES SECTION (Text-Rich for Google SEO) */}
      <div className="bg-anthracite-light py-20 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-white tracking-tight">The Social Network for Film Buffs</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 bg-anthracite rounded-2xl border border-gray-800 hover:border-papaya transition group hover:-translate-y-2 duration-300">
              <div className="bg-gray-800 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:bg-papaya transition">
                <FaStar className="text-papaya text-xl group-hover:text-black transition" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Spoiler-Safe Reviews</h3>
              <p className="text-gray-400 leading-relaxed">
                Post your thoughts on the latest episodes without ruining it for others. Our blurred spoiler tags keep the feed safe until you're ready to click "Reveal."
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-anthracite rounded-2xl border border-gray-800 hover:border-papaya transition group hover:-translate-y-2 duration-300">
              <div className="bg-gray-800 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:bg-papaya transition">
                <FaComments className="text-papaya text-xl group-hover:text-black transition" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Chat & Share</h3>
              <p className="text-gray-400 leading-relaxed">
                Slide into DMs to discuss plot twists privately. Share images directly in the chat to swap memes or fan theories with your friends in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-anthracite rounded-2xl border border-gray-800 hover:border-papaya transition group hover:-translate-y-2 duration-300">
              <div className="bg-gray-800 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:bg-papaya transition">
                <FaFilm className="text-papaya text-xl group-hover:text-black transition" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Production Hubs</h3>
              <p className="text-gray-400 leading-relaxed">
                Follow verified Production House accounts to see their official filmography. Get behind-the-scenes updates directly from the creators you love.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC CONTENT SECTION (Crucial for AdSense) */}
      <div className="bg-anthracite py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold text-white">Trending Discussions</h2>
            <Link to="/register" className="text-papaya font-bold hover:underline">View All</Link>
          </div>
          
          {loading ? (
             // Skeleton Loader
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[1,2,3,4].map(i => <div key={i} className="bg-gray-800 h-64 rounded-xl animate-pulse"></div>)}
             </div>
          ) : trending.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trending.map((item) => (
                <div key={item._id} className="relative group overflow-hidden rounded-xl border border-gray-800">
                  <img 
                    src={item.posterPath ? `https://image.tmdb.org/t/p/w500${item.posterPath}` : 'https://via.placeholder.com/300x450'} 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                    alt={item.mediaTitle} 
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <h4 className="font-bold text-white truncate">{item.mediaTitle}</h4>
                    <p className="text-xs text-papaya font-bold">{item.count} active discussions</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Static Fallback if API returns empty (So site doesn't look broken)
            <div className="text-center py-10 bg-anthracite-light rounded-xl border border-dashed border-gray-700">
              <p className="text-gray-400 mb-4">Join the community to see what's trending today.</p>
              <Link to="/register" className="text-papaya font-bold">Start Exploring &rarr;</Link>
            </div>
          )}
        </div>
      </div>
      
      {/* 4. FOOTER */}
      <footer className="border-t border-gray-800 py-10 bg-anthracite-light">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-papaya rounded-lg flex items-center justify-center">
              <FaPlay className="text-black text-xs ml-0.5" />
            </div>
            <span className="text-xl font-bold text-white">CineSync</span>
          </div>
          
          <div className="text-gray-500 text-sm text-center md:text-right">
            <p>&copy; 2025 CineSync Inc.</p>
            <div className="flex gap-4 mt-2 justify-center md:justify-end">
              <Link to="/privacy" className="hover:text-papaya transition">Privacy</Link>
              <Link to="/terms" className="hover:text-papaya transition">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
