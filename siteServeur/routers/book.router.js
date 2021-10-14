const express = require("express")
const router = express.Router()
const bookController = require("../controllers/book.controller")
const upload = require("../multer_config")

// All books
router.get('/', bookController.books_list)

// New Book
router.post('/', upload.single("image"), bookController.books_create)

// Show one book
router.get('/:id', bookController.books_details)

// Page de modification de 1 Book
router.get("/edit/:id", bookController.books_edit)

// Update (Enregistrement des modifications)
router.post("/modificationServer", bookController.books_update)

// Update image
router.post("/updateImage", upload.single("image"), bookController.books_image_update)

// Delete one Book
router.post('/delete/:id', bookController.books_delete)

module.exports = router