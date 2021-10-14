const AuthorModel = require('../models/Author.model')
const Seeder = require("good-mongoose-seeder")
const Mongoose = require('mongoose')
const url       = 'mongodb://localhost/biblio_media:27017'
const data      = {
    model: 'author',
    documents: 
    [
        {
            _id: Mongoose.Schema.Types.ObjectId, 
            firstname: 'unknown', 
            lastname: 'unknown', 
            age:0, 
            sexe:true
        },
    ]
}
Mongoose.model = AuthorModel
Seeder.connect(url).then(
    () => Seeder.seedData(data)
).catch((error) => {
    // An Error occurred.
    console.log(error.message);
}).finally(() => Seeder.disconnect())  