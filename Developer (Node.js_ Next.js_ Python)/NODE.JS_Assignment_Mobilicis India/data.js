const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: {
        type: Int8Array,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: Date,
        required: true
    }
});

const Book = mongoose.model('Books', bookSchema);

module.exports = Book;