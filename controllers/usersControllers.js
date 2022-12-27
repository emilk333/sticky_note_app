
const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler') //QOL for async syntax + catches all non logical errors
const bcrypt = require('bcrypt') // Password encryption


// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {

    // Mongoose specific methods. Find user and omit possword as well as meta data
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
})


// @desc create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // Confirm data
    if (!username || !password || !Array.isArray(roles)  || !roles.length) {
        return res.status(400).json({ message : "All fields are required"})
    }

    // Check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message : "Duplicate username"})
    }
    
    //Hash password
    const saltRounds = 10
    const hashedPwd = await bcrypt.hash(password, saltRounds) 

    const userObject = {
        username, 
        "password" : hashedPwd,
        roles
    }

    // Create and store new user
    const user = await User.create(userObject)

    if (user) { //if successfull
        res.status(201).json({ message : `New user ${username} created`})
    } else {
        res.status(400).json({ message : "Invalid user data received"})
    }
})


// @desc update new user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    // Confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message : "All fields are required"})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message : "User not found"})
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    // Allow updates to the original user. I.e. if this is true, we are trying to edit a username to something that already exists
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message : "Duplicate username"})
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // Hash password
        const saltRounds = 10
        user.password = await bcrypt.hash(password, saltRounds) 
    }
    
    const updatedUser = await user.save()

    res.json({ message : `${updatedUser.username} updated`})
})


// @desc delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message : "User ID required"})
    }

    // Control if user has note 
    const note = await Note.findOne({ user: id}).lean().exec()
    if (note) {
        return res.status(400).json({ message : "Delete not possible: User has assigned notes"})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message : "User not found"})
    }

    const result = await user.deleteOne()
    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json({ message : reply})
})


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}