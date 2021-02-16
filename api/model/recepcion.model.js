'use strict'
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Nombre      : { type: String, default: 'No Teléfono', required: false, unique: false },
        Activo      : { type: Boolean, default: true },
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });
module.exports = Mongoose.model('Recepcion', MainSchema);