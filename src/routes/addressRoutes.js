const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Your endpoints
router.post('/address', addressController.submitAddress);
router.get('/addresses', addressController.listAddresses);
router.get('/address/:id', addressController.getAddress);

module.exports = router;