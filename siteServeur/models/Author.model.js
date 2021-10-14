const { body } = require("express-validator")
const mongoose = require("mongoose")

exports.validate = (method) => {
    switch (method) {
      case 'createUser': {
       return [ 
          body('firstname', 'userName doesn\'t exists').exists(),
          body('lastname', 'Invalid email').exists(),
          body('age').optional().isInt(),
          body('sexe').optional().isIn(['true', 'false'])
         ]   
      }
    }
  }

const authorSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    firstname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    lastname: {
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        max: 125,
        required: true,
        default: 0
    },
    sexe: {
        type: Boolean,
        required: true
    },
})

authorSchema.index({firstname: 1, lastname: 1}, {unique: true})

authorSchema.virtual("books", {
    ref: "Book",
    localField: "_id",
    foreignField: "author"
})

module.exports = new mongoose.model('Author', authorSchema)