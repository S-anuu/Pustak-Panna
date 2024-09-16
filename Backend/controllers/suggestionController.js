const Suggestion = require('../models/Suggestion')

exports.submitSuggestion = async (req, res) => {
    try {
        const { title, author } = req.body;
        const newSuggestion = new Suggestion({ title, author });
        await newSuggestion.save();
        
        // Redirect to the home page after successful submission
        res.redirect('/');
    } catch (error) {
        console.error('Error submitting suggestion:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};