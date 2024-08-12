const Book = require('../models/Book');
const path = require('path');
const fs = require('fs');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.render('books', { books });
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
