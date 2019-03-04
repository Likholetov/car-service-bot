// Основные зависимости
import config from 'config'
import mongoose from 'mongoose'

import database from "./database.json"
import '../models/service.model'
import '../models/part.model'

const Service = mongoose.model('services')
const Part = mongoose.model('parts')

// подключение MongoDB
mongoose.connect(config.get('db_url'), {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

// filling DB with test data
database.parts.forEach(p => new Part(p).save().catch(e => console.log(e)))
database.services.forEach(s => new Service(s).save().catch(e => console.log(e)))