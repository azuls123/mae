'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Moment = require('moment');

    const MainSchema = Schema({
        Numero          : { type: Number, default: 0, required: false },
        Kilometraje     : { type: String, default: 'No Kilometraje', required: true },
        FechaAnterior   : { type: String, default: 'No Fecha Anterior', required: true },
        Recorrido       : { type: Schema.ObjectId, ref: 'Recorrido'},
        Empleado        : { type: Schema.ObjectId, ref: 'Empleado'},
        Solicitud       : {
            Fecha       : { type: String, default: 'No Fecha', required: true },
            Hora        : { type: String, default: 'No Hora', required: true },

        },  
        IngresoTaller   : {
            Fecha       : { type: String, default: 'No Fecha', required: true },
            Hora        : { type: String, default: 'No Hora', required: true },

        },  
        Created         : {
            By          : { type: Schema.ObjectId, ref: 'Usuario' },
            At          : { type: String, default: Moment().unix(), required: false }
        },  
        Updated         : {
            By          : { type: Schema.ObjectId, ref: 'Usuario' },
            At          : { type: String, default: Moment().unix(), required: false }
        }
    });

module.exports = Mongoose.model('FichaTecnica', MainSchema);