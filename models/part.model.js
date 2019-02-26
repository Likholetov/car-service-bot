import { Schema, model } from 'mongoose';

const PartSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    cars: {
        type: [String],
        default: [],
        required: true
    },
    installation: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    }
})

model('parts', PartSchema)