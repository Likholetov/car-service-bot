import { Schema, model } from 'mongoose';

const ServiceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    about: {
        type: String,
        required: true
    }
})

model('services', ServiceSchema)