const AuthorModel = require("../models/Author.model")
const BookModel = require("../models/Book.model")
const mongoose = require("mongoose")
const fs = require("fs")

exports.author_list = (req, res)=>{
  AuthorModel.find()
    .populate("books")
    .exec()
    .then(authors=>{
      res.render("authors/authors", {authors:authors})
    })
}

exports.author_books_list = (req, res)=>{
  const author_id = req.params._id
  AuthorModel.findById(author_id)
  .exec()
  .then(author=>{
    BookModel.find()
    .where(`author`)
    .equals(req.params._id)
    .populate('author')
    .exec()
    .then(books=>{
      console.log("books : ", books);
      console.log("auteur : ", author);

      res.render('authors/authorBooks', {books, author})
      })
  })
}

exports.author_show = (req, res)=>{
  const author = AuthorModel.findById(req.params._id)
    .populate('books')
    .exec()
    .then(
      author=>{
        res.render("authors/author", {author: author})
      }
    )
    .catch(e=>console.log(e.message))
}

exports.author_create = (req, res)=>{
  res.render("authors/author_create")
}

exports.author_created_save = (req, res) => {
  const author = AuthorModel({
    _id: new mongoose.Types.ObjectId(),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    sexe: req.body.sexe 
  })
  author.save()
  .then(
    result=>{
        res.redirect("back")
  })
  .catch(e=>{
    console.log(e)
    req.session.message = {
      type: 'danger',
      content: 'Le nouvel utilisateur n\'a pas pu être créé'
    }
    res.redirect("/")
  })
}

exports.anonymous_create = (req, res) => {
  let anonymous = new AuthorModel({
    _id: new mongoose.Types.ObjectId(), 
    firstname: 'unknown', 
    lastname: 'unknown', 
    age: 0, 
    sexe: true
  }).save()
  .then(
    result=>{
      res.redirect('/authors')
  })
  .catch(e=>{
    console.log(e)
    req.session.message = {
      type: 'danger',
      content: 'La requête n\'a pas aboutie'
    }
    res.redirect('/authors')
  })
}

exports.author_edit = (req, res)=>{
  const author = AuthorModel.findById(req.params._id)
    .exec()
    .then(author=>{
      console.log("auteur passé : ", author);
      res.render("authors/author_edit", {author})
    })
    .catch(e=>console.log(e))
}

exports.author_update = (req, res)=>{
  const authorUpdate = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    sexe: req.body.sexe
  }
  AuthorModel.updateOne({_id: req.body.identifiant}, authorUpdate)
  .where("firstname").ne("unknown")
  .exec()
  .then(result=>{
    if(result.matchedCount<1) throw new Error("Requête de modification échouée")
    req.session.message = {
      type: 'success',
      content: 'Modification effectuée'
    }
    res.redirect('/authors')
  })
}

exports.author_delete = (req, res)=>{
  AuthorModel.find()
  .where("firstname").equals("unknown")
  .then(anonymous=>{
      BookModel.updateMany({"author": req.params._id},{"$set": {"author": anonymous[0]._id}},{"multi": true})
      .exec()
      .then(
        AuthorModel.findByIdAndRemove(req.params._id)
        .where("firstname").ne("unknown")
        .exec()
        .then(deleted=>{
          if(deleted.matchedCount<1) throw new Error("Requête de modification échouée")
          req.session.message = {
            type: 'success',
            content: 'Suppression de l\'auteur effectuée'
          } 
          res.redirect("/authors")
        })
        .catch(e=>console.log(e.message))
      )
    }
  )
  //   AuthorModel.findByIdAndRemove(req.params._id)
  //   .exec()
  //   .then(
  //     result => {
  //       req.session.message = {
  //         type: 'success',
  //         content: 'Suppression effectuée'
  //       }
  //       console.log(req.session.message)
  //       res.redirect("/books")
  //   })
  //   .catch(e => {
  //     console.log(e.message)
  //     req.session.message = {
  //         type: 'warning',
  //         content: 'La suppression n\'a pas été effectuée'
  //     }
  //     res.redirect("/books")
  // })
  // .catch(error=>{
  //     console.log(error)
  // })
}