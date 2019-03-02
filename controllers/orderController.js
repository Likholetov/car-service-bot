import mongoose from 'mongoose'
import '../models/order.model'
import '../models/part.model'

const Part = mongoose.model('parts')
const Order = mongoose.model('orders')

class OrderController {
    // добавление блюда в заказ
    async orderPart(userId, partName){
        // создаем заказ
        const order = new Order({
            telegramId: userId,
            part: partName
        })

        // сохраниение нового заказа
        order.save()

        // формирование ответа пользователю
        return `Заказ на ${partName} оформлен`
    }
}

export default new OrderController()