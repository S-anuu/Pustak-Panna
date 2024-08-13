const Book = require('../models/Book'); 


exports.index = async (req, res) => {
    try {
        // Fetch all books
        const books = await Book.find({});

        // Fetch new arrivals or the last 5 books if none in the last 7 days
        const today = new Date();
        const pastDate = new Date(today.setDate(today.getDate() - 7)); // Date 7 days ago

        let trending = await Book.find({

        }).limit(6);

        let newArrivals = await Book.find({})
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .limit(3); // Limit to 3 books

        // If no new arrivals, get the last 5 books regardless of date
        if (newArrivals.length === 0) {
            newArrivals = await Book.find({})
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order
                .limit(5); // Limit to 5 books
        }

        let usedBooks = await Book.find({
            isUsed: true,
        })
        .sort({createdAt: -1})
        .limit(3)

        let bestSeller = await Book.find({
        })
        .limit(3)

        // Render the index page with books and newArrivals data
        res.render('index', { 
            title: 'Pustak-Panna', 
            pageStyles: '', 
            headerStyle: 'header', 
            books, 
            newArrivals,
            usedBooks,
            bestSeller,
            trending 
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.newReleases = async (req, res) => {
    const pageSize = 10; // Number of books per page
    const currentPage = parseInt(req.query.page) || 1; // Current page number
    const skip = (currentPage - 1) * pageSize;

        // Fetch books, sorting by creation date or _id, and limiting the results
    const newBooks = await Book.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize);
    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / pageSize);


    res.render('newReleases', {
        title: 'New Releases',
        pageStyles: '',
        headerStyle: 'header',
        newBooks,
        totalBooks,
        totalPages
        
    })
}

exports.bestSellers = async (req, res) => {
    const pageSize = 10; // Number of books per page
    const currentPage = parseInt(req.query.page) || 1; // Current page number
    const skip = (currentPage - 1) * pageSize;

        // Fetch books, sorting by creation date or _id, and limiting the results
    const bestSellers = await Book.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize);
    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / pageSize);


    res.render('bestSellers', {
        title: 'Best Sellers',
        pageStyles: '',
        headerStyle: 'header',
        bestSellers,
        totalBooks,
        totalPages
       
    })
}