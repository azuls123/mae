'use strict'

const TrabajoOrden = require('../model/trabajoOrden.model');
const Moment = require('moment');

// funciones
    function Crear(request, response) {
        const Params = request.body;
        const NewTrabajoOrden = new TrabajoOrden();
        NewTrabajoOrden.Trabajo = Params.Trabajo;
        NewTrabajoOrden.Detalles = Params.Detalles;
        NewTrabajoOrden.Orden = Params.Orden;
        NewTrabajoOrden.Cantidad = Params.Cantidad;
        NewTrabajoOrden.Estado = Params.Estado;


        NewTrabajoOrden.save((ErrorSave, Stored) => {
            if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', Stored});
            if (Stored) return response.status(201).send({Message: 'registro Guardado', TrabajoOrden: Stored});
            return response.status(404).send({Message: 'No se Guardo el Registro'});
        })
    }
    function Leer(request, response) {
        const params = request.body;
        let Query   = TrabajoOrden.find(params);
        Query.populate({
            path: 'Trabajo',

        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', TrabajoOrdenes: Response});
        })
    }
    function Editar(request, response) {
        const Params = request.body;
        TrabajoOrden.findByIdAndUpdate(Params._id, Params, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el trabajo de la Orden', Error});
            if (!Updated) return response.status(404).send({Message: 'No se Edito el Trabajo de la Orden'});
            return response.status(200).send({Message: 'Trabajo de la Orden Editado Correctamente!...', TrabajoOrden: Updated});
        })
    }
    module.exports = {
        Crear,
        Leer,
        Editar
    }