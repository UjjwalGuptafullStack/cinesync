const express = require('express');
const router = express.Router();
const { searchShows, getShowDetails, getSeasonDetails } = require('../controllers/mediaController');

router.get('/search', searchShows);
router.get('/tv/:id', getShowDetails);
router.get('/tv/:id/season/:seasonNum', getSeasonDetails);

module.exports = router;
