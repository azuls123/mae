'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Fecha       : { type: String, default: 'No Fecha', required: false },
        Numero      : { type: Number, default: 0, required: true },
        Responsable : { type: Schema.ObjectId, ref: 'Empleado' },
        Vehiculo    : { type: Schema.ObjectId, ref: 'Vehiculo'},
        Motivo      : { type: String, default: 'No Motivo', required: false },
        Aceite      : { type: String, default: 'No Aceite/Refrigerante', required: false },
        Cantidad    : { type: Number, default: 0, required: true },
        Combustible : { type: String, default: 'No Tipo', required: false },
        Valor       : { type: Number, default: 0, required: true },
        IVA         : { type: Schema.ObjectId, ref: 'Iva'},
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('OrdenCombustible', MainSchema);