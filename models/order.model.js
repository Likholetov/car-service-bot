import { Schema as Schema, model } from 'mongoose';
import partSchema from "./part.model";

const OrderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parts: {
        type: [partSchema],
        default: []
    },
    status: {
        type: String,
        default: "не доставлено"
    }
})

model('orders', OrderSchema)