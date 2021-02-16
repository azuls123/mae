'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Km_Inicial  : { type: String, default: 'No Km_Inicial', required: false },
        Km_Final    : { type: String, default: 'No Km_Final', required: true },
        Created     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        },
        Updated     : {
            By      : { type: Schema.ObjectId, ref: 'Usuario' },
            At      : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('Recorrido', MainSchema);