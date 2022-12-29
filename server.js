require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500
const errorHandler = require('./middleware/errorHandler') //custom middleware
const { logger, logEvents } = require('./middleware/logger') //custom middleware
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser') //third-party middleware
const cors = require('cors') //third-party middleware
const connectDB = require('./config/dbConnection')
const mongoose = require('mongoose')

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

//tells the server where to find static files (css/html etc)
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/notesRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    const notFound = '404 Not Found'
    
    //look at the headers from the frontend response
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html')) //send html back to the client
    } else if (req.accepts('json')) {
        //if the request is of type json and is not cought, the route cannot be found
        res.json({ message: notFound})
    } else {
        res.type('txt').send(notFound)
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to Database (MongoDB)')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.once('error', err => {
    logEvents(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})

