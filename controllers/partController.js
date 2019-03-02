import mongoose from 'mongoose'
import _ from 'lodash'
import '../models/part.model'

const Part = mongoose.model('parts')

class PartController {

    // формируем список марок автомобилей из базы данных
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

    // получение автомобилей конкретной марки
    async carsOfBrand(brand) {
        // получаем из БД все детали
        const parts = await Part.find(brand)
      
        // массив для марок
        let cars = []

        // формирование массива брендов
        parts.map(p => cars = _.union(cars, p.cars))

        return cars
    }

    // получение типов деталей конкретной модели
    async typesOfParts(car) {
        // получаем из БД все детали
        const parts = await Part.find(car)
          
        // массив для марок
        let types = []
    
        // формирование массива брендов
        parts.map(p => types.push(p.type))
    
        // удаление повторяющихся типов
        types = _.uniq(types);
    
        return types
    }

        // получение типов деталей конкретной модели
    async typesOfParts(car) {
        // получаем из БД все детали
        const parts = await Part.find(car)
          
        // массив для марок
        let types = []
    
        // формирование массива брендов
        parts.map(p => types.push(p.type))
    
        // удаление повторяющихся типов
        types = _.uniq(types);
    
        return types
    }

    // получение деталей конкретного типа
    partsOfType(type) {
        // получаем из БД все детали
        return Part.find(type)
    }

    // поиск детали по названию
    partByName(name) {
        return Part.findOne({name: name})
    }
}

export default new PartController()
