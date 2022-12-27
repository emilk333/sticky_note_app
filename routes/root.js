const express = require('express')
const router = express.Router()
const path = require('path')


/**
 * match if requested route is only a 
 * /
 * index
 * index.html
 */ 
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router