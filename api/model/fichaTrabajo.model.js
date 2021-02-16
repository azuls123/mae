'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Operacion   : { type: String, default: 'No Tipo', required: false },
        Ut          : { type: String, default: 'No Descripcion', required: true },
        FichaTecnica: { type: Schema.ObjectId, ref: 'FichaTecnica' },
        Trabajo     : { type: Schema.ObjectId, ref: 'Trabajo' },
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('FichaTrabajo', MainSchema);