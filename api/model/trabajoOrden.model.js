'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Trabajo     : {  type: Schema.ObjectId, ref: 'Trabajo' },
        Detalles    : {  type: String },
        Orden       : {  type: Schema.ObjectId, ref: 'OrdenTrabajo' },
        Cantidad    : {  type: Number, default: 1 },
        Estado      : {  type: String,  default: 'Pendiente' },
        Costo       : {type: Number, default: 0},
        Total       : {type: Number, default: 0},
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('TrabajoOrden', MainSchema);