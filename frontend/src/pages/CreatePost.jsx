import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import { FaCamera, FaTimesCircle } from 'react-icons/fa';

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
  const [imageFile, setImageFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  // Handle image selection with compression and preview
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size before compression
    const fileSizeMB = file.size / 1024 / 1024;
    
    if (fileSizeMB > 20) {
      toast.error('Image is too large. Please select an image smaller than 20MB.');
      e.target.value = ''; // Reset input
      return;
    }

    try {
      setIsCompressing(true);
      toast.info('Compressing image...');

      const options = {
        maxSizeMB: 2, // Max file size in MB
        maxWidthOrHeight: 1920, // Max dimensions
        useWebWorker: true,
        fileType: 'image/jpeg', // Convert to JPEG for better compression
      };

      const compressedFile = await imageCompression(file, options);
      
      // Create a new File object with the original name
      const finalFile = new File([compressedFile], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      setImageFile(finalFile);
      // Create preview URL
      setPreviewUrl(URL.createObjectURL(finalFile));
      
      const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
      const compressedSizeMB = (finalFile.size / 1024 / 1024).toFixed(2);
      
      toast.success(`Image compressed: ${originalSizeMB}MB → ${compressedSizeMB}MB`);
    } catch (error) {
      console.error('Compression error:', error);
      toast.error('Failed to compress image. Please try a different image.');
      e.target.value = '';
    } finally {
      setIsCompressing(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  // 2. SUBMIT POST FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
        toast.error('Please write something!');
        return;
    }

    if (isCompressing) {
      toast.warning('Please wait for image compression to complete.');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.token;

      // Create FormData instead of JSON for file uploads
      const formData = new FormData();
      formData.append('tmdbId', selectedMedia.id.toString());
      formData.append('mediaTitle', selectedMedia.title || selectedMedia.name);
      formData.append('posterPath', selectedMedia.poster_path || '');
      formData.append('content', content);
      formData.append('isSpoiler', isSpoiler);
      formData.append('mediaType', selectedMedia.title ? 'movie' : 'tv');
      
      if (postContext !== 'general' && selectedSeason) {
        formData.append('season', selectedSeason);
      }
      if (postContext === 'episode' && selectedEpisode) {
        formData.append('episode', selectedEpisode);
      }
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${baseURL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      const data = await response.json();
      console.log('✅ Post created response:', data);

      toast.success('Post created successfully!');
      navigate('/'); // Go back to feed
    } catch (error) {
      console.error('Post creation error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* STEP 1: SEARCH & SELECT */}
      {!selectedMedia ? (
        <div className="max-w-2xl mx-auto mt-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
          <p className="text-gray-400 mb-8">Search for a movie or TV show to talk about.</p>

          <div className="bg-anthracite-light p-6 rounded-lg border border-gray-800 shadow-lg">
            <form onSubmit={searchMedia} className="flex gap-3">
              <input
                type="text"
                className="flex-1 p-3 bg-gray-900 text-white placeholder-gray-400 rounded border border-gray-700 focus:outline-none focus:border-papaya transition"
                placeholder="Type movie or show name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="bg-papaya hover:bg-papaya-dark text-black font-bold px-6 py-3 rounded transition uppercase tracking-wide"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
          
          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {results.map((media) => (
              <div
                key={media.id}
                className="flex items-center gap-4 p-3 bg-anthracite-light border border-gray-800 rounded hover:border-papaya cursor-pointer transition"
                onClick={() => onMediaSelect(media)}
              >
                {media.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${media.poster_path}`}
                    alt={media.title}
                    className="w-12 h-18 object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-18 bg-gray-700"></div>
                )}
                <div>
                  <h3 className="font-bold text-white group-hover:text-papaya transition">{media.title || media.name}</h3>
                  <p className="text-xs text-gray-500">
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

            {/* Image Upload with Camera Icon & Preview */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-bold mb-2">
                Visuals {isCompressing && <span className="ml-2 text-papaya animate-pulse">● Compressing...</span>}
              </label>
              
              {!previewUrl ? (
                // STATE 1: No Image Selected - Show Camera Button
                <div>
                  <input 
                    type="file" 
                    id="image-upload"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                    disabled={isCompressing}
                    className="hidden"
                  />
                  <label 
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-papaya hover:bg-anthracite-light transition group ${
                      isCompressing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FaCamera className="text-3xl text-gray-500 group-hover:text-papaya mb-2 transition" />
                    <span className="text-gray-400 text-sm font-bold group-hover:text-white transition">
                      Take Photo or Upload
                    </span>
                  </label>
                </div>
              ) : (
                // STATE 2: Image Selected - Show Preview
                <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden flex items-center justify-center group">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="h-full w-full object-contain"
                  />
                  {/* Clear Button Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={clearImage}
                      className="flex flex-col items-center text-white hover:text-red-500 transition"
                    >
                      <FaTimesCircle className="text-4xl mb-2" />
                      <span className="font-bold uppercase tracking-wider text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

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
              Post Review 🚀
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreatePost;
