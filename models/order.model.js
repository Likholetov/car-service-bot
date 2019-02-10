import { Schema as Schema, model } from 'mongoose';

const OrderSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

model('orders', OrderSchema)