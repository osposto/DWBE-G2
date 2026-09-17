const express = require('express');
const router = express.Router();
const PageController = require('../controllers/pageController');

// Ruta principal (Home)
router.get('/', PageController.renderHome);

// Ruta de información institucional / acerca de
router.get('/about', PageController.renderAbout);

module.exports = router;

