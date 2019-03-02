import mongoose from 'mongoose'
import _ from 'lodash'
import '../models/order.model'
import '../models/part.model'

const Part = mongoose.model('parts')
const Order = mongoose.model('orders')

class OrderController {
    // добавление детали в заказ
    orderPart(userId, partName){
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

    // Просмотр заказанных деталей
    async findOrdersById(userId){
        const delivered = await Order.find({telegramId: userId, status: "доставлено"})
        const notDelivered = await Order.find({telegramId: userId, status: "не доставлено"})
        const result = _.union(delivered, notDelivered)
        return result
    }

    // Просмотр деталей, которые еще не доставлены
    async findNotDeliveredOrdersById(userId){
        const noOrders = await Order.find({telegramId: userId, status: "не доставлено"})
        const noOrdersList = []
        noOrders.map(n => noOrdersList.push(n.part))
        return noOrdersList
    }

    // Отмена заказа
    async removeOrder(userId, partName){
        const orderForRemove = await Order.findOne({telegramId: userId, part: partName, status: "не доставлено"})
        orderForRemove.status = "Отмена"
        orderForRemove.save()
        return `Заказ на ${partName} отменен`
    }
}

export default new OrderController()