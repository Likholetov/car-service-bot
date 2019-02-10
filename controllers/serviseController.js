const mongoose = require('mongoose')

require('../models/service.model')

const Service = mongoose.model('services')

class ServiceController {
    
}

module.exports = new ServiceController()