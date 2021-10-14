const express = require("express")
const router = express.Router()
const authorController = require("../controllers/author.controller ")
const { body, validationResult } = require('express-validator');

// const upload = require("../multer_config")

// Show all authors
router.get('/', authorController.author_list)

// Create user
router.get('/create', body('lastname').isLength({min:2}), authorController.author_create)

// Anonymous user
router.get('/anonymous_user_create', authorController.anonymous_create)

// Show author books
router.get('/:_id/books', authorController.author_books_list)

// Show author
router.get('/:_id', authorController.author_show)

// Save new Author
router.post('/', authorController.author_created_save)

// Edit Author
router.get("/edit/:_id", authorController.author_edit)

// Update Author
router.post("/modificationServer", authorController.author_update)

// Delete one Author
router.post('/delete/:_id', authorController.author_delete)


module.exports = router