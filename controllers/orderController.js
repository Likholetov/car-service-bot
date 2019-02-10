const mongoose = require('mongoose')

require('../models/order.model')

const Order = mongoose.model('orders')

class OrderController {
    
}

module.exports = new OrderController()