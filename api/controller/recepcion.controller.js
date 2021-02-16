'use strict'

const Recepcion = require('../model/recepcion.model');
const Moment = require('moment');
// funciones

    function Crear(request, response) {
        const Params = request.body;
        const NewRecepcion = new Recepcion();
        NewRecepcion.Nombre = Params.nombre;
        
        if (request.usuario && request.usuario.id) {
            NewRecepcion.Created.By = request.usuario.id;
        }

        NewRecepcion.save((ErrorSave, Stored) => {
            if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', Stored});
            if (Stored) return response.status(201).send({Message: 'registro Guardado', Recepcion: Stored});
            return response.status(404).send({Message: 'No se Guardo el Registro'});
        })
    }

    function Leer(request, response) {
        let Query = Recepcion.find();
        if (request.body) Query = Recepcion.find(request.body);
        Query.populate({
            path: 'Created.By Updated.By'
        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al consultar los registros', Error});
            if (!Response) return response.status(404).send({Message: 'No se encontraron registros'});
            return response.status(200).send({Message: 'Registros encontrados!', Recepciones: Response});
        })
    }

    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const update = request.body;

        Recepcion.findByIdAndUpdate(Id, update, {new:true}, (Error, Updated) => {
            if (Error) return response.sattus(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated) return response.status(404).send({Message: 'No se pudo editar el Registro'});
            return response.status(200).send({Message: 'Registro Editado', Recepcion: Updated });
        })
    }

module.exports = {
    Crear,
    Leer,
    Editar
}