import { Schema as Schema, model } from 'mongoose';

const ServiceSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

model('services', ServiceSchema)