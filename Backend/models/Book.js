const mongoose = require('mongoose');
const slugify = require('slugify'); // Ensure this package is installed

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageURL: { type: String },
    slug: { type: String, unique: true }, 
    isUsed: { type: Boolean, default: false },
    condition: { type: Number, min: 1, max: 5 }
});

// Pre-save hook to generate slug
bookSchema.pre('save', function(next) {
    if (this.isModified('title') && this.title) {
        this.slug = slugify(this.title, { lower: true });
        console.log('Generated slug:', this.slug); // Log the generated slug
    }
    next(); // Ensure next() is called to proceed with saving
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
