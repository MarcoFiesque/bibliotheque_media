const mongoose = require("mongoose")

const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true
    },
    publication_year: {
        type: Number,
        max: 2022
    },
    pages: Number,
    description: String,
    image: String
})

module.exports = mongoose.model('Book', bookSchema)