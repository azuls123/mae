'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Tipo        : { type: String, default: 'No Tipo', required: false },
        Observacion : { type: String, default: 'No Observacion', required: true },
        Nombre      : { type: String, default: 'No Nombre', required: true },
        FichaTecnica: { type: Schema.ObjectId, ref: 'FichaTecnica'},
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('EstadoRecepcion', MainSchema);