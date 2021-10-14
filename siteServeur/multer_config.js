const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, "./public/images/")
    },
    filename : (req, file, callback)=>{
        let date = new Date().toLocaleDateString().replaceAll('/', '_')
        callback(null, date+"-"+Math.round(Math.random()*10000)+"-"+file.originalname)
    }
})

const fileFilter = (req, file, callback)=>{
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        callback(null, true)
    } else {
        callback(new Error("Ce format n'est pas accepté"), false)
    }
}

module.exports = multer({
    storage : storage,
    limits : {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter : fileFilter
})