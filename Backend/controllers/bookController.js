const Book = require('../models/Book');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
//const flash = require('connect-flash')

exports.getAllBooks = async (req, res) => {
    try {
        const pageSize = 6; // Number of books per page
        const currentPage = parseInt(req.query.page) || 1; // Current page number
        const skip = (currentPage - 1) * pageSize;

        // Fetch books, sorting by creation date or _id, and limiting the results
        const books = await Book.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize);
        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / pageSize);

        res.render('books', { 
            title: 'Pustak-Panna', 
            pageStyles: '', 
            headerStyle: 'admin-header', 
            books, 
            currentPage, 
            pageSize, 
            totalPages,
            currentPath: '/books' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getAddBookPage =  (req, res) => {
    res.render('addBook', { title: 'Pustak-Panna', pageStyles: 'addBook.css', headerStyle: 'admin-header', currentPath: '/books/add' });
};

exports.addBook = async (req, res) => {
    try {
        const { title, author, category, price, description, isUsed, condition } = req.body;
        let imagePath = '';

        if (req.file) {
            imagePath = "/" + req.file.path;
        }

        const newBook = new Book({
            title,
            author,
            category,
            price,
            description,
            imageURL: imagePath,
            isUsed: !!isUsed,
            condition: isUsed ? parseInt(condition, 10) : undefined
        });

        await newBook.save();
        res.redirect('/books');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.checkBook = async (req, res, next) => {
    try {
        const { title, author } = req.body;
        const existingBook = await Book.findOne({ title, author });

        if (existingBook) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (err) {
        console.error('Error checking book:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getEditPage = async (req, res, next) => {
    const book = await Book.findOne({_id: req.params._id})
    res.render('editBooks', {title: 'Edit Books', book, pageStyles: '', headerStyle: 'admin-header', currentPath:'/books/edit'} )
    //console.log(book)   
}

exports.editBook = async (req, res, next) => {
    try {
        const { title, author, category, price, description, isUsed, condition } = req.body;
        let imagePath = '';

        if (req.file) {
            imagePath = "/" + req.file.path;

            // Delete old image if it's different from the new one
            const book = await Book.findById(req.params._id);
            if (book.imageURL && book.imageURL !== imagePath) {
                const oldImagePath = path.join(__dirname, '../uploads', book.imageURL);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Failed to delete old image:', err);
                });
            }
        } else {
            const book = await Book.findById(req.params._id);
            imagePath = book.imageURL;
        }

        await Book.updateOne(
            { _id: req.params._id },
            {
                $set: {
                    title,
                    author,
                    category,
                    price,
                    description,
                    ...(imagePath && { imageURL: imagePath }),
                    isUsed: !!isUsed,
                    condition: isUsed ? parseInt(condition, 10) : undefined
                }
            }
        );

        res.redirect('/books');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


exports.deleteBook = async(req, res, next) => {
    const result = await Book.deleteOne({_id: req.params._id})

    if (result.deletedCount === 1) {
        console.log("Successfully deleted one book.");
      } else {
        console.log("No documents matched the query. Deleted 0 books.");
      }

    res.redirect('/books')
}

const Review = require('../models/Review'); // Make sure to import the Review model

exports.getBookDetails = async (req, res, next) => {
    try {
        // Extract the slug from the URL parameter
        const slug = req.params.slug;
        
        // Find the book by slug
        const book = await Book.findOne({ slug });

        if (!book) {
            return res.status(404).send('Book not found');
        }

        // Fetch reviews for the book and populate user information (firstname, middlename, lastname)
        const reviews = await Review.find({ bookId: book._id }).populate('userId', 'firstname middlename lastname');

        // Render the book details page and pass the reviews
        res.render('bookDetails', {
            title: book.title,
            pageStyles: '',
            headerStyle: 'header',
            book,
            reviews,
            currentPath: '/book/:id'  
        });
    } catch (err) {
        console.error('Error fetching book details:', err);
        res.status(500).send('Server Error');
    }
};


// bookController.js
exports.getNewReleases = async (req, res) => {
    try {
        // Fetch the books sorted by creation date in descending order (latest first)
        const books = await Book.find().sort({ createdAt: -1 }).limit(10); // Adjust the limit if necessary

        // Render the 'new-releases.ejs' page with the retrieved books
        res.render('newReleases', {
            title: 'Pustak-Panna',
            books,
            pageStyles: '',
            headerStyle: 'header',
            currentPath:'/product/new-releases'
        });
    } catch (error) {
        console.error('Error fetching new releases:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getBestSellers = async (req, res) => {
    try {
        // Fetch the books sorted by sales count in descending order (best sellers first)
        const books = await Book.find().sort({ salesCount: -1 }).limit(10); // Adjust limit as needed

        // Render the 'bestSellers.ejs' page with the retrieved books
        res.render('bestSellers', 
            { title: 'Pustak-Panna',
              books,
              pageStyles: '',
              headerStyle: 'header',
              currentPath: '/product/best-sellers'
            });
    } catch (error) {
        console.error('Error fetching best sellers:', error);
        res.status(500).send('Internal Server Error');
    }
};

