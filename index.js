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
import ServiceController from './controllers/serviceController'

// Клавиатура
const mainKeyboard = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
                ['Услуги', 'Запчасти'],
                ['Ваш заказ', 'О нас']
            ]
    }
}

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

// Функции

// Обработка входящих сообщений

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const { chat: { id } } = msg
    bot.sendMessage(id, `Здравствуйте!`, mainKeyboard)
})

// Обработка команды /help
bot.onText(/\/help/, (msg) => {
    const { chat: { id } } = msg
    bot.sendMessage(id, `Помощь`)
})

// Клавиатура
bot.on('message', async msg => {

    // Получаем данные о пользователе
    const { chat: { id }, text, from: {first_name, last_name} } = msg

    console.log(`Message from ${first_name} ${last_name}, id: ${id}`)
    
    // Ответ на входящий текст
    switch(text){
        case 'Услуги':
            //bot.sendMessage(id, `Здравствуйте!`, mainKeyboard)
            break   
        case 'Запчасти':
            const brands = await PartController.uniqBrand()
            const brandKeyboard = inlineKeyboard(brands, "nothing")
            bot.sendMessage(id, `Пожалуйста, выберите марку автомобиля`, {reply_markup:brandKeyboard})
            break 
        case 'Ваш заказ':
            
            break
        case 'О нас':
            
            break
        //default:
            //bot.sendMessage(id, `К сожалению, я не знаю такой команды`)
        }
})

// Инлайн клавиатура
bot.on('callback_query', async query => {

    // массив марок
    const brands = await PartController.uniqBrand()
    // массив машин
    const cars = await PartController.carsOfBrand({})
    // массив типов деталей
    const types = await PartController.typesOfParts({})

    // получаем id пользователя
    const { from: { id } } = query

    // парсим входящий JSON
    let { data } = query
    data = JSON.parse(data)
    const { text, addition } = data

    // проверяем, что пришло на вход
    if(brands.indexOf( text ) != -1) {
        // пришла марка автомобиля
        // получаем все автомобили этой марки
        const carsOfBrand = await PartController.carsOfBrand({brand: text})
        // создаем клавиатуру автомобилей
        const carsKeyboard = inlineKeyboard(carsOfBrand, text)
        // отправляем клавиатуру пользователю
        bot.sendMessage(id, `Пожалуйста, выберите модель автомобиля`, {reply_markup:carsKeyboard})
    } else {
        if (cars.indexOf( text ) != -1) {
            // пришла модель автомобиля
            const typesOfParts = await PartController.typesOfParts({cars: { $all: [text] }})
            const typesKeyboard = inlineKeyboard(typesOfParts, text)
            bot.sendMessage(id, `Пожалуйста, выберите тип необходимой детали`, {reply_markup:typesKeyboard})
        } else {
            if (types.indexOf( text ) != -1) {
                // пришел тип детали
                const partsOfType = await PartController.partsOfType({type: text, cars: { $all: [addition] }})
                console.log(partsOfType)
            } else {
                
            }
        }
    }

    //const cars = await PartController.carsOfBrand({brand: "LADA"})
    
    //console.log(cars)


})

/*bot.on('inline_query', query => {
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
})*/

// формирование инлайн клавиатуры из массива
function inlineKeyboard(buttons, addition) {
    // формирование кнопок
    buttons = buttons.map(b => [
        { text: b, 
            callback_data: JSON.stringify({
                text: b,
                addition: addition
        })}
    ])

    // формирование клавиатуры 
    buttons = {
        inline_keyboard: buttons
    }

    // возврат клавиатуры типов
    return buttons
}