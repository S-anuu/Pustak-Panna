const Book = require('../models/Book'); 

exports.index = async (req, res) => {
    try {
        // Fetch all books
        const books = await Book.find({});

        // Fetch new arrivals or the last 5 books if none in the last 7 days
        const today = new Date();
        const pastDate = new Date(today.setDate(today.getDate() - 7)); // Date 7 days ago

        let newArrivals = await Book.find({
            createdAt: { $gte: pastDate } // Books added in the last 7 days
        })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .limit(5); // Limit to 5 books

        // If no new arrivals, get the last 5 books regardless of date
        if (newArrivals.length === 0) {
            newArrivals = await Book.find({})
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order
                .limit(5); // Limit to 5 books
        }

        // Render the index page with books and newArrivals data
        res.render('demoIndex', { 
            title: 'Pustak-Panna', 
            pageStyles: '', 
            headerStyle: 'header', 
            books, 
            newArrivals 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
