'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Tipo        : { type: String, default: 'No Tipo', required: false },
        Descripcion : { type: String, default: 'No Descripcion', required: true },
        Activo      : { type: Boolean, default: false },
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('Trabajo', MainSchema);