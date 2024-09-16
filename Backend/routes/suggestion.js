const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController'); // Example path

router.post('/suggestion', suggestionController.submitSuggestion);

module.exports = router;