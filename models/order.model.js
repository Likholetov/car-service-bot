import { Schema, model } from 'mongoose';

const OrderSchema = new Schema({
    telegramId: {
        type: Number,
        required: true
    },
    part: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "не доставлено"
    }
})

model('orders', OrderSchema)