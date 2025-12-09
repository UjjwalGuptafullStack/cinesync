const express = require('express');
const router = express.Router();
const { searchShows } = require('../controllers/mediaController');

router.get('/search', searchShows);

module.exports = router;
