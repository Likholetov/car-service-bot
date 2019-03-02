import mongoose from 'mongoose'
import _ from 'lodash'
import '../models/service.model'

const Service = mongoose.model('services')

class ServiceController {
        // формируем список услуг из базы данных
        async uniqServiceType() {
            // получаем из БД все детали
            const services = await Service.find({})
          
            // массив типов
            let types = []
    
            // формирование массива типов
            services.map(s => types.push(s.type))
    
            // удаление повторяющихся типов
            types = _.uniq(types);
    
            return types
        }

        // получение услуг определенного типа
        servisesByType(type) {
            // получаем из БД все услуги типа type
            return Service.find({type: type})
        }
}

export default new ServiceController()