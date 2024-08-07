exports.getAllBooks = async (req, res) => {
    const books = await Book.find()
    res.json(books)
}

exports.getBookById = async (req, res) => {
    const book = await Book.findById(req.params.id)
    res.json(book)
}
