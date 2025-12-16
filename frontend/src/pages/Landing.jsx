import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaComments, FaFilm } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../api';

function Landing() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get('/api/posts/trending');
        setTrending(res.data);
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-anthracite via-anthracite-light to-anthracite text-white">
      
      {/* Hero Section with Phone Mockup */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
              Track Your <span className="text-papaya">Binge Journey.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
              CineSync is the ultimate social platform for movie and TV show enthusiasts. Rate content, track what you watch, share reviews with friends, and discuss episodes in real-time with our integrated chat system.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <Link to="/register" className="bg-papaya text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition shadow-lg">
                Join the Community
              </Link>
              <Link to="/login" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition">
                Log In
              </Link>
            </div>
          </div>

          {/* Right Side: Phone Mockup */}
          <div className="hidden lg:flex relative w-1/2 justify-center">
            <div className="relative border-[12px] border-gray-900 rounded-[2.5rem] h-[550px] w-[280px] bg-black shadow-2xl overflow-hidden z-10">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-20"></div>
              
              {/* Screen Content */}
              <div className="grid grid-cols-2 gap-1 p-2 mt-6 h-full bg-anthracite overflow-hidden opacity-90">
                <img src="https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Batman" />
                <img src="https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Stranger Things" />
                <img src="https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Oppenheimer" />
                <img src="https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Barbie" />
                <img src="https://image.tmdb.org/t/p/w500/cjEepSetYE1vj4tcivilian8oyB0l6.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Rush" />
                <img src="https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" className="rounded mb-1 w-full h-40 object-cover" alt="Interstellar" />
              </div>
            </div>

            {/* Floating Icons */}
            <div className="absolute top-20 -left-4 bg-papaya p-3 rounded-full shadow-xl animate-bounce z-20">
              <FaStar className="text-xl text-black" />
            </div>
            <div className="absolute bottom-32 -right-4 bg-white p-3 rounded-full shadow-xl animate-pulse z-20 text-papaya">
              <FaComments className="text-xl" />
            </div>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div className="bg-anthracite-light py-20 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Everything You Need in One Platform</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-anthracite rounded-lg border border-gray-800 hover:border-papaya transition">
              <div className="bg-papaya w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaStar className="text-black text-xl" />
              </div>
              <h3 className="text-xl font-bold text-papaya mb-3">Social Reviews</h3>
              <p className="text-gray-300 leading-relaxed">Don't just watch—discuss. Post your reviews with spoiler tags, rate shows on a 10-point scale, and see what your network thinks about the latest blockbusters and hidden gems.</p>
            </div>
            <div className="p-6 bg-anthracite rounded-lg border border-gray-800 hover:border-papaya transition">
              <div className="bg-papaya w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaComments className="text-black text-xl" />
              </div>
              <h3 className="text-xl font-bold text-papaya mb-3">Real-time Chat</h3>
              <p className="text-gray-300 leading-relaxed">Message your friends instantly to plan movie nights or debate plot twists with our integrated messaging system. Share images, react to messages, and never miss a conversation.</p>
            </div>
            <div className="p-6 bg-anthracite rounded-lg border border-gray-800 hover:border-papaya transition">
              <div className="bg-papaya w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaFilm className="text-black text-xl" />
              </div>
              <h3 className="text-xl font-bold text-papaya mb-3">Production Hubs</h3>
              <p className="text-gray-300 leading-relaxed">Follow official Production House accounts to get exclusive updates, behind-the-scenes content, cast interviews, and release dates directly from studios and creators.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Movies Section (For AdSense Content) */}
      <div className="bg-anthracite py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Trending on CineSync</h2>
          
          {loading ? (
            <div className="text-center text-gray-400">Loading trending content...</div>
          ) : trending.length === 0 ? (
            <div className="text-center text-gray-400">
              <p className="mb-4">No content yet. Be the first to share what you're watching!</p>
              <Link to="/register" className="bg-papaya text-black px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition inline-block">
                Join Now
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {trending.map((item) => (
                  <div key={item._id} className="bg-anthracite-light p-4 rounded-lg border border-gray-800 hover:border-papaya transition group">
                    <img 
                      src={item.posterPath ? `https://image.tmdb.org/t/p/w500${item.posterPath}` : '/placeholder-poster.png'} 
                      className="rounded mb-3 w-full h-64 object-cover group-hover:scale-105 transition" 
                      alt={item.mediaTitle} 
                    />
                    <h4 className="font-bold text-white mb-1 line-clamp-1">{item.mediaTitle}</h4>
                    <div className="flex items-center gap-1 text-sm">
                      <FaComments className="text-papaya" />
                      <span className="text-gray-300">{item.count} {item.count === 1 ? 'post' : 'posts'}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link to="/register" className="bg-papaya text-black px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition inline-block">
                  Join to See More
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 bg-anthracite-light">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-papaya rounded-lg flex items-center justify-center">
                <FaPlay className="text-black text-xs ml-0.5" />
              </div>
              <span className="text-xl font-bold">CineSync</span>
            </div>
            <p className="text-gray-400 text-sm">&copy; 2025 CineSync. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-papaya transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-papaya transition">Terms of Service</Link>
              <Link to="/contact" className="hover:text-papaya transition">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
