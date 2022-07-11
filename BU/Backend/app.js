const express = require('express')
const app = express()
const api = require('./api')
const morgan = require('morgan') // logger
const bodyParser = require('body-parser')
const cors = require('cors');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');

app.set('port', (process.env.PORT || 3000))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

app.use('/api', api)
app.use(express.static('static'))

app.use(morgan('dev'))

app.use(function(req, res){
    const err = new Error('Not Found')
    err.status = 404
    res.json(err)
})

// global error handler
app.use(errorHandler);


//  MongoDB connection 
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/usersList', { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('Connected to MongoDB')

    app.listen(app.get('port'), function () {
        console.log('API Server Listening on port ' + app.get('port') + '!')
    })
})