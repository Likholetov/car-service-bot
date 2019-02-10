const mongoose = require('mongoose')

require('../models/part.model')

const Part = mongoose.model('parts')

class PartController {
    
}

module.exports = new PartController()