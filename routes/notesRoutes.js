const express = require('express')
const router = express.Router()
const notesController = require('../controllers/notesController')

// we are already inside "/Notes", so "/"" here means root of that 
// entrypoint for controllers for Notes

router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNewNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

module.exports = router