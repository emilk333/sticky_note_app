const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersControllers')

// we are already inside "/users", so "/"" here means root of that 
// entrypoint for controllers for users

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router