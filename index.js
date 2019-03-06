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
                ['Ваши заказы', 'О нас']
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

// Клавиатура
bot.on('message', async msg => {

    // Получаем данные о пользователе
    const { chat: { id }, text, from: {first_name, last_name} } = msg

    // Выводим данные о пользователе в консоль
    console.log(`Message from ${first_name} ${last_name}, id: ${id}`)
    
    // Ответ на входящий текст
    switch(text){
        case 'Услуги':
            // получаем список типов услуг
            const services = await ServiceController.uniqServiceType()
            const servicesKeyboard = inlineKeyboard(services, "nothing")
            bot.sendMessage(id, `Пожалуйста, выберите тип услуги`, {reply_markup:servicesKeyboard})
            break   
        case 'Запчасти':
            // Получаем список марок машин
            const brands = await PartController.uniqBrand()
            const brandKeyboard = inlineKeyboard(brands, "nothing")
            bot.sendMessage(id, `Пожалуйста, выберите марку автомобиля`, {reply_markup:brandKeyboard})
            break 
        case 'Ваши заказы':
            // Выводим пользователю его заказы
            const orders = await OrderController.findOrdersById(id)
            if (orders.length > 0) {
                const orderChangeKeyboard = {
                    inline_keyboard: [
                        [
                            {
                                text: 'Изменить',
                                callback_data: JSON.stringify({
                                    addition: "change"
                                })
                            }
                        ]
                    ]
                }
                let answerText = "Ваши заказы:\n"
    
                orders.map((o, i) => {
                    answerText = answerText + `${i+1}. ${o.part}: ${o.status}\n`
                })
                bot.sendMessage(id, answerText, {reply_markup:orderChangeKeyboard})
            } else {
                bot.sendMessage(id, "Вы еще ничего не заказали.")
            }
            break
        case 'О нас':
            // Выводим пользователю информацию об СТО
            bot.sendMessage(id, `СТО "Генстар"\nАдрес: 250-летия Донбасса проспект, 62\nНомера телефонов:\n+38 (050) 323-58-19 Viber\n+38 (050) 328-13-73\n+38 (071) 308-97-35\n+38 (071) 308-97-36`)
            bot.sendLocation(id, 48.030787, 37.933752)
            break
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
    // массив типов услуг
    const services = await ServiceController.uniqServiceType()

    // получаем id пользователя
    const { from: { id }, message: { message_id } } = query

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
                partsOfType.map(p => {
                    const partText = `${p.name}\nЦена: ${p.price} руб.` 
                    bot.sendPhoto(id, p.image, {
                        caption: partText,
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Подробнее',
                                        callback_data: JSON.stringify({
                                            text: p.name,
                                            addition: "more"
                                        })
                                    }
                                ],
                                [
                                    {
                                        text: 'Заказать',
                                        callback_data: JSON.stringify({
                                            text: p.name,
                                            addition: "order"
                                        })
                                    }
                                ]
                            ]
                        }
                    })
                })
            } else {
                if (services.indexOf( text ) != -1) {
                    // пришел тип услуги
                    const servicesOfType = await ServiceController.servisesByType(text)
                    let answerText = `${text}\n`
    
                    servicesOfType.map((s, i) => {
                        answerText = answerText + `${i+1}. ${s.name} от ${s.price} рублей\n`
                    })
                    bot.sendMessage(id, answerText)
                } else {
                    // проверяем, какая команда пришла от пользователя
                    switch (addition) {
                        // Подробнее
                        case "more":
                            const partMoreInfo = await PartController.partByName(text)
                            const orderKeyboard = {
                                inline_keyboard: [
                                    [
                                        {
                                            text: 'Заказать',
                                            callback_data: JSON.stringify({
                                                text: partMoreInfo.name,
                                                addition: "order"
                                            })
                                        }
                                    ]
                                ]
                            }
                            bot.editMessageCaption(`${partMoreInfo.name}\nЦена: ${partMoreInfo.price} руб.\nЦена установки: ${partMoreInfo.installation} руб. \nО детали: ${partMoreInfo.about}\nСовместима с ${partMoreInfo.cars.join(', ')}`, {chat_id:id, message_id:message_id, reply_markup:orderKeyboard})
                            break
                        // Заказать
                        case "order":
                            const answer = await OrderController.orderPart(id, text)
                            bot.answerCallbackQuery(query.id, {text: answer})
                            break
                        // Удалить заказ
                        case "remove":
                            const removeAnswer = await OrderController.removeOrder(id, text)
                            bot.answerCallbackQuery(query.id, {text: removeAnswer})
                            const notDeliveredOrdersUpdate = await OrderController.findNotDeliveredOrdersById(id)
                            const index = notDeliveredOrdersUpdate.indexOf(text)
                            if (index !== -1) notDeliveredOrdersUpdate.splice(index, 1)
                            if (notDeliveredOrdersUpdate.length > 0) {
                                const partRemoveKeyboardUpdate = inlineKeyboard(notDeliveredOrdersUpdate, "remove")
                                bot.editMessageText(`Вы заказали ${notDeliveredOrdersUpdate.length} деталей, которые еще не были доставлены.Выберите деталь, заказ на которую Вы хотели бы отменить. Заказ на доставленную деталь отменить нельзя, для этого свяжитесь с менеджером по телефону или в Telegram.`, {chat_id:id, message_id:message_id, reply_markup:partRemoveKeyboardUpdate})
                            } else {
                                bot.editMessageText(`У вас нет заказов, которые еще не были доставлены. Заказ на доставленную деталь отменить нельзя, для этого свяжитесь с менеджером по телефону или в Telegram.`, {chat_id:id, message_id:message_id})
                            }
                            break
                        // Список заказанных запчастей с возможностью удаления
                        case "change":
                            const notDeliveredOrders = await OrderController.findNotDeliveredOrdersById(id)
                            if (notDeliveredOrders.length > 0) {
                                const partRemoveKeyboard = inlineKeyboard(notDeliveredOrders, "remove")
                                bot.sendMessage(id, `Вы заказали ${notDeliveredOrders.length} деталей, которые еще не были доставлены. Выберите деталь, заказ на которую Вы хотели бы отменить. Заказ на доставленную деталь отменить нельзя, для этого свяжитесь с менеджером по телефону или в Telegram.`, {reply_markup:partRemoveKeyboard})
                            } else {
                                bot.sendMessage(id, `У вас нет заказов, которые еще не были доставлены. Заказ на доставленную деталь отменить нельзя, для этого свяжитесь с менеджером по телефону или в Telegram.`)
                            }
                            break
                    }
                }
            }
        }
    }
})

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