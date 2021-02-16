'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({    
        RUC         : { type: String, default: 'No Ruc', required: true },
        Nombre      : { type: String, default: 'No Nombre', required: true },
        Direccion   : { type: String, default: 'No Direccion', required: true },
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

    module.exports = Mongoose.model('Taller', MainSchema);