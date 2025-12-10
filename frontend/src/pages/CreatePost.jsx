import { useState } from 'react';
import api from '../api';
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
         const response = await api.get(`/api/media/tv/${media.id}`);
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
       const response = await api.get(`/api/media/tv/${selectedMedia.id}/season/${seasonNum}`);
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
      const response = await api.get(`/api/media/search?query=${query}`);
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

      await api.post('/api/posts', postData, config);

      toast.success('Post created successfully!');
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
        <div className="max-w-2xl mx-auto mt-10">
          <h1 className="text-4xl font-black text-anthracite dark:text-white mb-2">New Log Entry</h1>
          <p className="text-gray-500 mb-8">Search the database to begin transmission.</p>

          <div className="bg-white dark:bg-anthracite-light p-1 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800">
            <form onSubmit={searchMedia} className="flex">
              <input
                type="text"
                className="flex-1 p-4 bg-transparent text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none font-medium"
                placeholder="Type movie or show name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="bg-papaya hover:bg-papaya-dark text-black font-bold px-8 py-2 rounded transition uppercase tracking-wide"
              >
                {loading ? 'Scanning...' : 'Search'}
              </button>
            </form>
          </div>

          {/* Search Results (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {results.map((media) => (
              <div
                key={media.id}
                className="flex items-center gap-4 p-4 bg-white dark:bg-anthracite-light border border-transparent hover:border-papaya cursor-pointer transition rounded shadow-sm group"
                onClick={() => onMediaSelect(media)}
              >
                {media.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${media.poster_path}`}
                    alt={media.title}
                    className="w-12 h-18 object-cover shadow-sm group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-12 h-18 bg-gray-700"></div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-papaya transition">{media.title || media.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {media.release_date ? media.release_date.split('-')[0] : 'Unknown'} • {media.media_type === 'tv' ? 'TV Series' : 'Movie'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* STEP 2: WRITE REVIEW */
        <div className="bg-white dark:bg-anthracite-light border border-gray-200 dark:border-gray-800 p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <img
                src={`https://image.tmdb.org/t/p/w92${selectedMedia.poster_path}`}
                alt={selectedMedia.title}
                className="w-20 rounded shadow"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMedia.title || selectedMedia.name}</h2>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-sm text-papaya hover:underline mt-2 font-bold"
                >
                  ← Change Selection
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SMART CONTEXT SELECTOR (Only for TV Shows) */}
            {(!selectedMedia.title) && (
              <div className="mb-4 space-y-3 bg-gray-100 dark:bg-white/5 p-4 rounded border border-gray-200 dark:border-white/10">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">What are you posting about?</label>
                
                {/* 1. Scope Selector */}
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => { setPostContext('general'); setSelectedSeason(''); setSelectedEpisode(''); }}
                    className={`px-3 py-1 rounded text-sm font-bold ${postContext === 'general' ? 'bg-papaya text-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                  >
                    Whole Series
                  </button>
                  <button 
                     type="button"
                     onClick={() => setPostContext('season')}
                     className={`px-3 py-1 rounded text-sm font-bold ${postContext === 'season' ? 'bg-papaya text-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                  >
                    Specific Season
                  </button>
                  <button 
                     type="button"
                     onClick={() => setPostContext('episode')}
                     className={`px-3 py-1 rounded text-sm font-bold ${postContext === 'episode' ? 'bg-papaya text-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                  >
                    Specific Episode
                  </button>
                </div>

                {/* 2. Season Dropdown (Shows if context is Season or Episode) */}
                {postContext !== 'general' && (
                  <div>
                    <select 
                      className="w-full p-2 bg-white dark:bg-gray-800 rounded text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
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
                      className="w-full p-2 bg-white dark:bg-gray-800 rounded text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
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
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 h-32 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-papaya transition"
              placeholder="What did you think? (No spoilers unless you tag it!)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="spoiler"
                className="w-5 h-5 accent-papaya"
                checked={isSpoiler}
                onChange={(e) => setIsSpoiler(e.target.checked)}
              />
              <label htmlFor="spoiler" className="text-red-500 font-bold cursor-pointer text-sm uppercase tracking-wider">
                This post contains spoilers ⚠️
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-papaya hover:bg-papaya-dark text-black font-bold py-3 rounded text-lg transition uppercase tracking-wider"
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
