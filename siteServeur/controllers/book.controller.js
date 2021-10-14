const BookModel = require("../models/Book.model")
const mongoose = require("mongoose")
const fs = require("fs")
const AuthorModel = require("../models/Author.model")

exports.books_list = (req, res)=>{
  const authors = AuthorModel.find()
    .exec()
    .then(authors=>{
      const books = BookModel.find()
      .populate("author")
        .exec()
        .then(
          books=>{
            res.render('books/books', 
            {
              books, 
              authors,
              message: res.locals.message
            })
        })
      .catch(e=>console.log(e.message))
    })
  .catch(e=>console.log(e.message))
}

exports.books_details = (req, res)=>{
  const book = BookModel.findById(req.params.id)
    .populate("author")
    .exec()
    .then( book=>res.render('books/book', {book, isModif: false}) )
    .catch(e=>console.log(e))
}

exports.books_create = (req, res)=>{
  const book = new BookModel({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    author: req.body.author,
    publication_year: req.body.publication_year,
    pages: req.body.pages,
    description: req.body.description,
    image: req.file.path.substring(14)
  })
  book.save()
  .then(
    result=>{
        res.redirect("/books")
  })
  .catch(e=>console.log(e))
}

exports.books_edit = (req, res)=>{
  AuthorModel.find()
    .exec()
    .then(authors=>{
      BookModel.findById(req.params.id)
      .populate("author")
      .exec()
      .then( 
        book=>{
          for (const author of authors) {
            console.log("Auteurs : ", author._id);
            console.log("Book: ", book.author._id);
            
          }
          res.render("books/book",
          {
            authors,
            book, 
            isModif: true
          })
      })
      .catch(e=>console.log(e))
    })
    .catch(e=>console.log(e))
}

exports.books_update = (req, res)=>{
  const bookUpdate = {
    title: req.body.title,
    author: req.body.author,
    publication_year: req.body.publication_year,
    pages: req.body.pages,
    description: req.body.description,
  }
  BookModel.updateOne({_id: req.body.identifiant}, bookUpdate)
  .exec()
  .then(result=>{
    if(result.matchedCount<1) throw new Error("Requête de modification échouée")
    req.session.message = {
      type: 'success',
      content: 'Modification effectuée'
    }
    res.redirect("/books")
  })
  .catch(e=>{
    console.log(e)
    req.session.message = {
      type: 'warning',
      content: 'Un problème a eu lieu. Modification annulée'
    }
    res.redirect("/books")
  })
}

exports.books_delete = (req, res)=>{
  const book = BookModel.findById(req.params.id)
    .select("image")
    .exec()
    .then(  book => {
      fs.unlink("./public/images/" + book.image, error=>{
        console.log("Message error " + error);
      })
    BookModel.findByIdAndRemove(req.params.id)
    .exec()
    .then(
      result => {
        req.session.message = {
          type: 'success',
          content: 'Suppression effectuée'
        }
        console.log(req.session.message)
        res.redirect("/books")
    })
    .catch(e => {
      console.log(e.message)
      req.session.message = {
          type: 'warning',
          content: 'La suppression n\'a pas été effectuée'
      }
      res.redirect("/books")
    })
  })
  .catch(error=>{
      console.log(error)
  })
}

exports.books_image_update = (req, res) => {
  const book = BookModel.findById(req.body.identifiant)
  .select("image")
  .exec()
  .then(book=>{
      fs.unlink("./public/images/"+book.image, error=>{
          console.log(error)
      })
  const bookUpdate = {
      image : req.file.path.substring(14)
  }
  BookModel.updateOne({_id: req.body.identifiant}, bookUpdate)
      .exec()
      .then(result=>{
          res.redirect("/books/edit/"+req.body.identifiant)
      })
      .catch(
          e=>{
              console.log(e)
      })
}).catch(e=>{
  console.log(e)
  })
}