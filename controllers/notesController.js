const Note = require('../models/Note')
const asyncHandler = require('express-async-handler') //QOL for async syntax + catches all non logical errors


// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().select().lean()

    if (!notes?.length) {
        return res.status(400).json({ message : "No notes found"})
    }

    res.json(notes)
})


// @desc create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
   const { title, text, user } = req.body

    if (!title && !text && !user) {
        return res.status(400).json({ message : "All fields are required"})
    }

    const noteObject = {
        title,
        text,
        user
    }

    const note = await Note.create(noteObject)

    if (note) { //if successfull
        res.status(201).json({ message : `New note ${title} created`})
    } else {
        res.status(400).json({ message : "Invalid note data received"})
    }
})


// @desc update new note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { title, text, completed, id, user } = req.body

    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const note = await Note.findById(id).exec()

    note.user = user
    note.title = title,
    note.text = text,
    note.completed = completed

    const updatedNote = await note.save()

    res.json({ message : `Note with id ${updatedNote.id} and title ${updatedNote.title} was updated`})
})


// @desc delete note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Note ID is required' })
    }

    const noteToDelete = await Note.findById(id).exec()

    if (!noteToDelete) {
        return res.status(400).json({ message : "Note not found"})
    }

    const result = await noteToDelete.deleteOne()
    
    res.json({ message :`Note with id ${result.id} was deleted` })
})


module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}