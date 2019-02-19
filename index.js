// Основные зависимости
import TelegramBot from 'node-telegram-bot-api'
import config from 'config'
import mongoose from 'mongoose'

// Зависимости необходимые для работы с Webhook
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

// Контроллеры
import PartController from './controllers/partController'
import OrderController from './controllers/orderController'
import ServiceController from './controllers/serviseController'

// подключение MongoDB
mongoose.connect(config.get('db_url'), {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

const TOKEN = config.get('token')

// для работы с  Update
const bot = new TelegramBot(TOKEN, {
    polling: true
})

// для работы с Webhook
/*
const bot = new TelegramBot(TOKEN)
bot.setWebHook(`${config.get('url')}/bot`)

const app = new Koa()

const router = new Router()
router.post('/bot', ctx => {
    const { body } = ctx.request
    bot.processUpdate(body)
    ctx.status = 200
})

app.use(bodyParser())
app.use(router.routes())

const port = config.get('port')
app.listen(port, () => {
    console.log(`Listening on ${port}`)
})*/

// Bot functions

bot.on('message', msg => {
    const { chat: { id } } = msg
    console.log(`Message from ${msg.from.first_name} ${msg.from.last_name}, id: ${msg.from.id}`)
    bot.sendMessage(id, 'Pong')
})

bot.onText(/\/help (.+)/, (msg, [source, match]) => {
    const { chat: { id } } = msg
    bot.sendMessage(id, match)
})

bot.onText(/\/start (.+)/, (msg, [source, match]) => {
    const { chat: { id } } = msg
    bot.sendMessage(id, `You told me "${match}"`)
})

bot.on('inline_query', query => {
    const results = []

    for (let index = 0; index < 3; index++) {
        results.push({
            id: index.toString(),
            type: 'article',
            title: `Title #${index}`,
            input_message_content: {
                message_text: `Article #${index} content`
            }
        })
        
    }

    bot.answerInlineQuery(query.id, results, {
        cache_time: 0,
        switch_pm_text: 'Перейти к диалогу с ботом',
        switch_pm_parameter: 'start'
    })
})