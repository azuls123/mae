'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Numero      : { type: Number },
        Lugar       : {
            Origen  : { type: String, default: 'No Origen', required: true },
            Destino : { type: String, default: 'No Destino', required: true },

        },
        Fecha       : {
            Salida  : { type: String, default: 'No Salida', required: true },
            Regreso : { type: String, default: 'No Ingreso', required: false },
            Estimada : { type: String, default: 'No Ingreso', required: true },

        },
        Emision       : {
            Lugar   : { type: String, default: 'No Lugar', required: true },
            Fecha   : { type: String, default: 'No Fecha', required: true }

        },
        Conductor   : { type: Schema.ObjectId, ref: 'Empleado', required: true },
        Recorrido   : { type: Number, default: 0 },
        KmInicial   : { type: Number, default: 0 },
        Vehiculo    : { type: Schema.ObjectId, ref: 'Vehiculo', required: true },
        Motivo      : { type: String, default: 'No Motivo', required: true },
        Estado    : { type: String, default: 'Procesado, Aprobado, Completado' },
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('Salvoconducto', MainSchema);