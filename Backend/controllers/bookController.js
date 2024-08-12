const Book = require('../models/Book');
const path = require('path');
const fs = require('fs');
//const flash = require('connect-flash')

exports.getAllBooks = async (req, res) => {
    try {
        // Fetch and sort books by creation date (or _id) in descending order
        const books = await Book.find().sort({ createdAt: -1 }); // or .sort({ _id: -1 })
        res.render('books', { title: 'Pustak-Panna', pageStyles: '', headerStyle: 'admin-header', books });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getAddBookPage =  (req, res) => {
    res.render('addBook', { title: 'Pustak-Panna', pageStyles: 'addBook.css', headerStyle: 'admin-header' });
};

exports.addBook = async (req, res) => {
    try {
        const { title, author, category, price, description } = req.body;
        // console.log(req.body)
        let imagePath = '';
        
        if (req.file) {
            imagePath= "/" + req.file.path; 
        }

        const newBook = new Book({
            title,
            author,
            category,
            price,
            description,
            imageURL: imagePath
        });

        await newBook.save();
        res.redirect('/admin/books');
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
    res.render('editBooks', {title: 'Edit Books', book, pageStyles: '', headerStyle: 'admin-header'}, )
    console.log(book)   
}

exports.editBook = async (req, res, next) => {
    try {
        const { title, author, category, price, description } = req.body;
        let imagePath = '';

        // Check if a new file is uploaded
        if (req.file) {
            // Update the imagePath to the new file
            imagePath = "/" + req.file.path;

            // If an old image exists, delete it
            const book = await Book.findById(req.params._id);
            if (book.imageURL && book.imageURL !== imagePath) {
                const oldImagePath = path.join(__dirname, '../uploads', book.imageURL);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Failed to delete old image:', err);
                });
            }
        } else {
            // Keep the existing image path if no new file is uploaded
            const book = await Book.findById(req.params._id);
            imagePath = book.imageURL;
        }

        // Update the book details
        await Book.updateOne(
            { _id: req.params._id },
            {
                $set: {
                    title,
                    author,
                    category,
                    price,
                    description,
                    ...(imagePath && { imageURL: imagePath }) // Only update imageURL if a new image is uploaded
                }
            }
        );

        res.redirect('/admin/books');
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

    res.redirect('/admin/books')
}