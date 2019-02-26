import mongoose from 'mongoose'
import _ from 'lodash'
import '../models/part.model'

const Part = mongoose.model('parts')

class PartController {
    // Формируем клавиатуру марок автомобилей
    async uniqBrand() {
        // получаем из БД все детали
        const parts = await Part.find({})
      
        // массив для марок
        let brands = []

        // формирование массива брендов
        parts.map(p => brands.push(p.brand))

        // удаление повторяющихся типов
        brands = _.uniq(brands);

        return brands
    }

    inlineKeyboard(buttons) {
        // формирование кнопок
        buttons = buttons.map(b => [
            { text: b, 
                callback_data: JSON.stringify({
                text: b
            })}
        ])
    
        // формирование клавиатуры 
        buttons = {
            inline_keyboard: buttons
        }
    
        // возврат клавиатуры типов
        return buttons
    }
}

export default new PartController()
