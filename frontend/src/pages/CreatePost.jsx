import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function CreatePost() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [content, setContent] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 1. SEARCH FUNCTION
  const searchMedia = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      // Call your backend proxy (not TMDB directly!)
      const response = await axios.get(`http://localhost:5000/api/media/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      toast.error('Failed to search media');
    } finally {
      setLoading(false);
    }
  };

  // 2. SUBMIT POST FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
        toast.error('Please write something!');
        return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.token;

      // Prepare the data
      const postData = {
        tmdbId: selectedMedia.id.toString(),
        mediaTitle: selectedMedia.title || selectedMedia.name, // TMDB uses 'title' for movies, 'name' for TV
        posterPath: selectedMedia.poster_path,
        content,
        isSpoiler,
      };

      // Send to Backend with the Bearer Token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post('http://localhost:5000/api/posts', postData, config);

      toast.success('Entry logged successfully! 🎬');
      navigate('/'); // Go back to feed
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Log a New Entry 🖊️</h1>

      {/* STEP 1: SEARCH & SELECT */}
      {!selectedMedia ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <form onSubmit={searchMedia} className="flex gap-2 mb-6">
            <input
              type="text"
              className="flex-1 p-3 bg-gray-700 rounded border border-gray-600 text-white"
              placeholder="Search for a movie or show..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-bold"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((media) => (
              <div
                key={media.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded cursor-pointer transition"
                onClick={() => setSelectedMedia(media)}
              >
                {media.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${media.poster_path}`}
                    alt={media.title}
                    className="w-12 h-18 rounded"
                  />
                ) : (
                  <div className="w-12 h-18 bg-gray-600 rounded"></div>
                )}
                <div>
                  <h3 className="font-bold text-lg">{media.title || media.name}</h3>
                  <p className="text-sm text-gray-400">
                    {media.release_date || media.first_air_date || 'Unknown Year'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* STEP 2: WRITE REVIEW */
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <img
                src={`https://image.tmdb.org/t/p/w92${selectedMedia.poster_path}`}
                alt={selectedMedia.title}
                className="w-20 rounded shadow"
              />
              <div>
                <h2 className="text-2xl font-bold">{selectedMedia.title || selectedMedia.name}</h2>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-sm text-blue-400 hover:underline mt-2"
                >
                  ← Change Selection
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full p-4 bg-gray-700 rounded border border-gray-600 h-32 text-white"
              placeholder="What did you think? (No spoilers unless you tag it!)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="spoiler"
                className="w-5 h-5"
                checked={isSpoiler}
                onChange={(e) => setIsSpoiler(e.target.checked)}
              />
              <label htmlFor="spoiler" className="text-red-400 font-bold cursor-pointer">
                This post contains spoilers ⚠️
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded text-lg transition"
            >
              Post Entry 🚀
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreatePost;
