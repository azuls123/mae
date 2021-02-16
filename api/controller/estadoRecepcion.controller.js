'use strict'

const EstadoRecepcion = require('../model/estadoRecepcion.model');
const Moment = require('moment');

// funciones
    // Crear
    function Crear(request, response) {
        const Params = request.body;
        const NewEstadoRecepcion = new EstadoRecepcion();
        
        NewEstadoRecepcion.Tipo             = Params.Tipo;
        NewEstadoRecepcion.Observacion      = Params.Observacion;
        NewEstadoRecepcion.Nombre           = Params.Nombre;
        NewEstadoRecepcion.FichaTecnica     = Params.FichaTecnica;

        if (request.usuario && request.usuario.id) {
            NewEstadoRecepcion.Created.By = request.usuario.id;
        }
        NewEstadoRecepcion.save((ErrorSave, Stored) => {
            if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', Stored});
            if (Stored) return response.status(201).send({Message: 'registro Guardado', EstadoRecepcion: Stored});
            return response.status(404).send({Message: 'No se Guardo el Registro'});
        })
    }

    function Leer(request, response) {
        const Tipo = request.params.Tipo;
        let Query   = EstadoRecepcion.find({Tipo});

        if (!Cargo) Query = EstadoRecepcion.find();

        Query.populate({
            path: 'Created.By Updated.By FichaTecnica',

        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', EstadoRecepciones: Response});
        })
    }

    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const Update = request.body;
        
        EstadoRecepcion.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
            return response.status(200).send({Message: 'Registro Editado', EstadoRecepcion: Updated});
        })
    }

module.exports = {
    Crear,
    Leer,
    Editar,
}
    