const express = require("express")
const router = express.Router()

router.get('/', (req, res)=>{
    res.render('index')
})

router.use((req, res, suite)=>{
    const error = new Error("Page non trouvée")
    error.status = 404
    suite(error)
})

router.use((error, req, res)=>{
    res.status(error.status || 500)
    res.end(error.message)
})

module.exports = router