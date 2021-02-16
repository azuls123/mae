'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Correo      : { type: String, default: 'No Correo', required: true},
        Contrase    : { type: String, default: 'No Contraseña', required: true },
        Empleado    : { type: Schema.ObjectId, ref: 'Empleado' },
        Activo      : { type: Boolean, default: true, required: false },
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('Usuario', MainSchema);