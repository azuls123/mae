'use strict'
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Ci          : { type: String, default: 'No Ci', required: false, unique: true },
        Nombres     : { type: String, default: 'No Nombres', required: true, unique: false },
        Apellidos   : { type: String, default: 'No Apellidos', required: true, unique: false },
        Area        : { type: String, default: 'No Area', required: false, unique: false },
        Cargo       : { type: String, default: 'Admin', required: false, unique: false },
        Telefono    : { type: String, default: 'No Teléfono', required: false, unique: false },
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
module.exports = Mongoose.model('Empleado', MainSchema);