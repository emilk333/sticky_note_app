

const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) { //!origin allows postman etc. to access the api
            callback(null, true) //docs can be seen from cors library provider
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credential: true,
    optionsSuccessStatus: 200,
}


module.exports = corsOptions