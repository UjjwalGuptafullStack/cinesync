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
  const [postContext, setPostContext] = useState('general');
  const [seasonsTotal, setSeasonsTotal] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [episodesTotal, setEpisodesTotal] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState('');

  const navigate = useNavigate();

  // Triggered when a TV Show is selected from search
  const onMediaSelect = async (media) => {
    setSelectedMedia(media);
    
    // If it's a TV show, fetch its details to know how many seasons it has
    if (media.media_type === 'tv' || !media.title) {
       try {
         const response = await axios.get(`http://localhost:5000/api/media/tv/${media.id}`);
         setSeasonsTotal(response.data.number_of_seasons);
       } catch (err) {
         console.error("Could not fetch seasons");
       }
    }
  };

  // Triggered when a specific Season is selected
  const onSeasonSelect = async (seasonNum) => {
    setSelectedSeason(seasonNum);
    // Fetch episodes for this season
    try {
       const response = await axios.get(`http://localhost:5000/api/media/tv/${selectedMedia.id}/season/${seasonNum}`);
       setEpisodesTotal(response.data.episodes.length);
    } catch (err) {
       console.error("Could not fetch episodes");
    }
  };

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
        mediaType: selectedMedia.title ? 'movie' : 'tv',
        season: (postContext !== 'general' && selectedSeason) ? Number(selectedSeason) : undefined,
        episode: (postContext === 'episode' && selectedEpisode) ? Number(selectedEpisode) : undefined,
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
                onClick={() => onMediaSelect(media)}
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
            {/* SMART CONTEXT SELECTOR (Only for TV Shows) */}
            {(!selectedMedia.title) && (
              <div className="mb-4 space-y-3 bg-gray-700 p-4 rounded">
                <label className="block text-sm font-bold text-gray-300">What are you posting about?</label>
                
                {/* 1. Scope Selector */}
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => { setPostContext('general'); setSelectedSeason(''); setSelectedEpisode(''); }}
                    className={`px-3 py-1 rounded text-sm ${postContext === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}
                  >
                    Whole Series
                  </button>
                  <button 
                     type="button"
                     onClick={() => setPostContext('season')}
                     className={`px-3 py-1 rounded text-sm ${postContext === 'season' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}
                  >
                    Specific Season
                  </button>
                  <button 
                     type="button"
                     onClick={() => setPostContext('episode')}
                     className={`px-3 py-1 rounded text-sm ${postContext === 'episode' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}
                  >
                    Specific Episode
                  </button>
                </div>

                {/* 2. Season Dropdown (Shows if context is Season or Episode) */}
                {postContext !== 'general' && (
                  <div>
                    <select 
                      className="w-full p-2 bg-gray-600 rounded text-white border border-gray-500"
                      value={selectedSeason}
                      onChange={(e) => onSeasonSelect(e.target.value)}
                    >
                      <option value="">Select Season ({seasonsTotal} available)</option>
                      {[...Array(seasonsTotal)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Season {i + 1}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 3. Episode Dropdown (Shows only if context is Episode AND Season is selected) */}
                {postContext === 'episode' && selectedSeason && (
                  <div>
                    <select 
                      className="w-full p-2 bg-gray-600 rounded text-white border border-gray-500"
                      value={selectedEpisode}
                      onChange={(e) => setSelectedEpisode(e.target.value)}
                    >
                      <option value="">Select Episode ({episodesTotal} available)</option>
                      {[...Array(episodesTotal)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Episode {i + 1}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

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
