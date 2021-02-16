'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Caracteristicas     : { type: String, default: 'No Caracteristicas', required: false },
        Marca               : { type: String, default: 'No Marca', required: true },
        Modelo              : { type: String, default: 'No Marca', required: true },
        Anio                : { type: String, default: 'No Año', required: true },
        Clase               : { type: String, default: 'No Clase', required: true },
        Llantas             : { type: String, default: 'No Llantas', required: true},
        Placa               : { type: String, default: 'No Placa', required: true },
        Matricula           : { type: String, default: 'No Matricula', required: true },
        Recorrido           : { type: Number, default: 0, required: true },
        Color               : { type: String, default: 'No Color', required: true},
        Costo               : { type: Number, default: 0, required: true },
        Combustible         : { type: String, default: 'No Combustible', required: true },
        Responsable         : { type: Schema.ObjectId, ref: 'Empleado' },
        Activo              : { type: Boolean, default: true, required: false },
        Created             : {
            By              : { type: Schema.ObjectId, ref: 'Usuario' },
            At              : { type: String, default: Moment().unix(), required: false }
        },      
        Updated             : {
            By              : { type: Schema.ObjectId, ref: 'Usuario' },
            At              : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('Vehiculo', MainSchema);