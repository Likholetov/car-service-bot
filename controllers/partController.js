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

    // получение машин конкретной марки
    async carsOfBrand(brand) {
        // получаем из БД все детали
        const parts = await Part.find(brand)
      
        // массив для марок
        let cars = []

        // формирование массива брендов
        parts.map(p => cars = _.union(cars, p.cars))

        // удаление повторяющихся типов
        cars = _.uniq(cars);

        return cars
    }

    // получение машин конкретной марки
    async typesOfParts(brand, car) {
        // получаем из БД все детали
        const parts = await Part.find(brand)
          
        // массив для марок
        let cars = []
    
        // формирование массива брендов
        parts.map(p => cars = _.union(cars, p.cars))
    
        // удаление повторяющихся типов
        cars = _.uniq(cars);
    
        return cars
    }
}

export default new PartController()
