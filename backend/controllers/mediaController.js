const axios = require('axios');

// @desc    Search for shows/movies
// @route   GET /api/media/search?query=batman
// @access  Public
const searchShows = async (req, res) => {
  const { query } = req.query; // Get the search term from the URL

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${query}&include_adult=false`
    );
    
    // We only want to send back the results array
    res.json(response.data.results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data from TMDB' });
  }
};

module.exports = { searchShows };
