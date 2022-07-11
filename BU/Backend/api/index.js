const express = require('express')
const router = express.Router()

require('./routes/users')(router)

module.exports = router