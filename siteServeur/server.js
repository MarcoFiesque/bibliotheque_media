const express = require("express")
const server = express()
const morgan = require("morgan")
const mongoose = require("mongoose")
const session = require("express-session")
const booksRouter = require("./routers/book.router")
const globalRouter = require("./routers/global.router")
const authorsRouter = require("./routers/author.router")

server.use(express.static("public"))
server.use(morgan("dev"))

// SESSION
server.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000},
}))

// views folder
server.set("views", "../siteClient")
server.set("view engine", "pug")
// Config Server
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.set('trust proxy', 1)
// Messages Flash
server.use((req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
})
//
server.use("/books", booksRouter)
server.use("/authors", authorsRouter)
server.use("/", globalRouter)

// PORT
server.listen(3001)
//

exports.db = mongoose.connect("mongodb://localhost/biblio_media", { useNewUrlParser: true })






