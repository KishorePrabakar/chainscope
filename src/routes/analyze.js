const express = require('express');
const router = express.Router();
const { analyzeLive } = require('../controllers/analyzeController');

router.get('/:address', analyzeLive);

module.exports = router;