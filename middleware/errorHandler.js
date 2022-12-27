

const { logEvents } = require('./logger') 


//overwrites express standard error handling
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}\t${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)

    const status = res.statusCode ? res.statusCode : 500 //server error
    res.status(status)

    res.json({ message: err.message})
}

module.exports = errorHandler