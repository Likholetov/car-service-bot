import TelegramBot from 'node-telegram-bot-api'
import config from 'config'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

const TOKEN = config.get('token')
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
})

bot.on('message', msg => {
    const { chat: { id } } = msg
    bot.sendMessage(id, 'Pong')
})

bot.onText(/\/help (.+)/, (msg, [source, match]) => {
    const { chat: { id } } = msg
    bot.sendMessage(id, match)
})