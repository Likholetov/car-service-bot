import { Schema as Schema, model } from 'mongoose';

const PartSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

model('parts', PartSchema)