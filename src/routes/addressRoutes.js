const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const analyzeController = require('../controllers/analyzeController');

router.post('/address', addressController.submitAddress);
router.get('/addresses', addressController.listAddresses);
router.get('/address/:id', addressController.getAddress);
router.delete('/address/:id', addressController.deleteAddress);
router.get('/analyze/:address', analyzeController.analyzeLive);

module.exports = router;