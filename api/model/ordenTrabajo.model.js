'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Numero          : { type: String, default: 'No Ruc', required: true },
        Solicitante     : { type: Schema.ObjectId, ref: 'Empleado'},
        Taller          : { type: Schema.ObjectId, ref: 'Taller'},
        Vehiculo        : { type: Schema.ObjectId, ref: 'Vehiculo'},
        Iva             : { type: Schema.ObjectId, ref: 'Iva'},
        Total           : {type: Number, default: 0},
        Estado          : { type: String, default: 'Pendiente', required: true },
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('OrdenTrabajo', MainSchema);